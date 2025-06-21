-- 申請管理システム用データベース拡張
-- 既存の study_ テーブルに追加

-- ============================================
-- 申請管理テーブル
-- ============================================
CREATE TABLE study_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    school_id UUID REFERENCES study_schools(id) ON DELETE CASCADE,
    message TEXT, -- 申請メッセージ
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES study_user_profiles(id), -- 承認した管理者
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 招待システムテーブル
-- ============================================
CREATE TABLE study_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES study_schools(id) ON DELETE CASCADE,
    invited_by UUID REFERENCES study_user_profiles(id) ON DELETE CASCADE, -- 招待した管理者
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('student', 'instructor')) DEFAULT 'student',
    invitation_code VARCHAR(50) UNIQUE NOT NULL, -- 招待コード
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'), -- 7日後に期限切れ
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 通知システムテーブル
-- ============================================
CREATE TABLE study_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES study_user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'application', 'invitation', 'approval', etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- 追加データ（申請ID、招待IDなど）
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- インデックス作成
-- ============================================
CREATE INDEX idx_study_applications_school_id ON study_applications(school_id);
CREATE INDEX idx_study_applications_status ON study_applications(status);
CREATE INDEX idx_study_applications_email ON study_applications(applicant_email);
CREATE INDEX idx_study_invitations_school_id ON study_invitations(school_id);
CREATE INDEX idx_study_invitations_email ON study_invitations(email);
CREATE INDEX idx_study_invitations_code ON study_invitations(invitation_code);
CREATE INDEX idx_study_invitations_status ON study_invitations(status);
CREATE INDEX idx_study_notifications_user_id ON study_notifications(user_id);
CREATE INDEX idx_study_notifications_is_read ON study_notifications(is_read);

-- ============================================
-- RLS (Row Level Security) ポリシー
-- ============================================

-- Applications: 管理者は自分のスクールの申請を閲覧・管理可能
ALTER TABLE study_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view school applications" ON study_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND role = 'admin' AND school_id = study_applications.school_id
    )
);

CREATE POLICY "Admins can update school applications" ON study_applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND role = 'admin' AND school_id = study_applications.school_id
    )
);

-- 申請者は自分の申請を閲覧可能（メールアドレスベース）
CREATE POLICY "Applicants can view own applications" ON study_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND email = study_applications.applicant_email
    )
);

-- Invitations: 管理者は自分のスクールの招待を管理可能
ALTER TABLE study_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage school invitations" ON study_invitations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND role = 'admin' AND school_id = study_invitations.school_id
    )
);

-- 招待された人は自分宛の招待を閲覧可能
CREATE POLICY "Invitees can view own invitations" ON study_invitations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND email = study_invitations.email
    )
);

-- Notifications: ユーザーは自分の通知のみ閲覧・更新可能
ALTER TABLE study_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON study_notifications FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own notifications" ON study_notifications FOR UPDATE USING (
    auth.uid() = user_id
);

-- ============================================
-- トリガー設定
-- ============================================

-- updated_atトリガー
CREATE TRIGGER update_study_applications_updated_at BEFORE UPDATE ON study_applications FOR EACH ROW EXECUTE FUNCTION update_study_updated_at_column();
CREATE TRIGGER update_study_invitations_updated_at BEFORE UPDATE ON study_invitations FOR EACH ROW EXECUTE FUNCTION update_study_updated_at_column();
CREATE TRIGGER update_study_notifications_updated_at BEFORE UPDATE ON study_notifications FOR EACH ROW EXECUTE FUNCTION update_study_updated_at_column();

-- ============================================
-- 申請承認時の自動処理関数
-- ============================================

CREATE OR REPLACE FUNCTION process_approved_application()
RETURNS TRIGGER AS $$
BEGIN
    -- 申請が承認された場合
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        
        -- 申請者が既にユーザーとして登録されているかチェック
        -- （Supabase Authで登録済みの場合）
        IF EXISTS (
            SELECT 1 FROM auth.users 
            WHERE email = NEW.applicant_email
        ) THEN
            -- 既存ユーザーのプロフィールを更新
            INSERT INTO study_user_profiles (id, email, name, role, school_id)
            SELECT 
                auth.users.id,
                NEW.applicant_email,
                NEW.applicant_name,
                'student',
                NEW.school_id
            FROM auth.users 
            WHERE auth.users.email = NEW.applicant_email
            ON CONFLICT (id) DO UPDATE SET
                school_id = NEW.school_id,
                updated_at = NOW();
        END IF;
        
        -- 承認通知を申請者に送信（メール機能は別途実装）
        -- ここでは通知テーブルに記録のみ
        INSERT INTO study_notifications (
            user_id, 
            type, 
            title, 
            message, 
            data
        )
        SELECT 
            up.id,
            'application_approved',
            '申請が承認されました',
            'あなたの学習塾への参加申請が承認されました。システムをご利用いただけます。',
            jsonb_build_object('application_id', NEW.id, 'school_id', NEW.school_id)
        FROM study_user_profiles up
        WHERE up.email = NEW.applicant_email;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_process_approved_application
    AFTER UPDATE ON study_applications
    FOR EACH ROW
    EXECUTE FUNCTION process_approved_application();

-- ============================================
-- 招待コード生成関数
-- ============================================

CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- 8文字のランダムコード生成
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        
        -- 重複チェック
        SELECT EXISTS(
            SELECT 1 FROM study_invitations 
            WHERE invitation_code = code
        ) INTO exists_check;
        
        -- 重複がなければループを抜ける
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 招待作成時のコード自動生成トリガー
-- ============================================

CREATE OR REPLACE FUNCTION set_invitation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invitation_code IS NULL OR NEW.invitation_code = '' THEN
        NEW.invitation_code := generate_invitation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invitation_code
    BEFORE INSERT ON study_invitations
    FOR EACH ROW
    EXECUTE FUNCTION set_invitation_code();

-- ============================================
-- 便利なビュー作成
-- ============================================

-- 申請一覧ビュー（管理者用）
CREATE VIEW study_applications_with_school AS
SELECT 
    a.*,
    s.name as school_name,
    s.color as school_color,
    CASE 
        WHEN a.status = 'pending' THEN '承認待ち'
        WHEN a.status = 'approved' THEN '承認済み'
        WHEN a.status = 'rejected' THEN '拒否'
    END as status_display
FROM study_applications a
JOIN study_schools s ON a.school_id = s.id;

-- 招待一覧ビュー（管理者用）
CREATE VIEW study_invitations_with_details AS
SELECT 
    i.*,
    s.name as school_name,
    s.color as school_color,
    up.name as invited_by_name,
    CASE 
        WHEN i.status = 'pending' AND i.expires_at > NOW() THEN '送信済み'
        WHEN i.status = 'pending' AND i.expires_at <= NOW() THEN '期限切れ'
        WHEN i.status = 'accepted' THEN '承諾済み'
        WHEN i.status = 'expired' THEN '期限切れ'
    END as status_display
FROM study_invitations i
JOIN study_schools s ON i.school_id = s.id
LEFT JOIN study_user_profiles up ON i.invited_by = up.id; 