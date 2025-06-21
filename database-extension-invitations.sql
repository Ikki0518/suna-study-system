-- 招待システム用のテーブル拡張
-- 既存のstudy_invitationsテーブルに新しいカラムを追加

-- 招待テーブルの拡張
ALTER TABLE study_invitations 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student',
ADD COLUMN IF NOT EXISTS created_by_super_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS invitation_type VARCHAR(20) DEFAULT 'standard';

-- スーパー管理者用のビュー作成
CREATE OR REPLACE VIEW super_admin_overview AS
SELECT 
    s.id as school_id,
    s.name as school_name,
    s.description,
    COUNT(DISTINCT up.user_id) as total_users,
    COUNT(DISTINCT CASE WHEN up.role = 'admin' THEN up.user_id END) as admin_count,
    COUNT(DISTINCT CASE WHEN up.role = 'student' THEN up.user_id END) as student_count,
    COUNT(DISTINCT i.id) as invitation_count,
    COUNT(DISTINCT CASE WHEN i.status = 'pending' THEN i.id END) as pending_invitations
FROM study_schools s
LEFT JOIN study_user_profiles up ON s.id = up.school_id
LEFT JOIN study_invitations i ON s.id = i.school_id
GROUP BY s.id, s.name, s.description;

-- 招待統計ビュー
CREATE OR REPLACE VIEW invitation_statistics AS
SELECT 
    school_id,
    COUNT(*) as total_invitations,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_count,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_count,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_invitations,
    COUNT(CASE WHEN role = 'student' THEN 1 END) as student_invitations,
    COUNT(CASE WHEN created_by_super_admin = TRUE THEN 1 END) as super_admin_invitations
FROM study_invitations
GROUP BY school_id;

-- スーパー管理者権限チェック関数
CREATE OR REPLACE FUNCTION is_super_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN user_email = 'ikki_y0518@icloud.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 管理者招待権限チェック関数
CREATE OR REPLACE FUNCTION can_invite_admin(inviter_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- スーパー管理者のみ管理者を招待可能
    RETURN is_super_admin(inviter_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 招待作成時のトリガー関数
CREATE OR REPLACE FUNCTION validate_invitation_creation()
RETURNS TRIGGER AS $$
BEGIN
    -- 管理者招待の場合、スーパー管理者権限をチェック
    IF NEW.role = 'admin' AND NOT NEW.created_by_super_admin THEN
        RAISE EXCEPTION 'Only super admin can invite admin users';
    END IF;
    
    -- 招待コードの重複チェック
    IF EXISTS (
        SELECT 1 FROM study_invitations 
        WHERE invitation_code = NEW.invitation_code 
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Invitation code already exists';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 招待作成トリガー
DROP TRIGGER IF EXISTS validate_invitation_trigger ON study_invitations;
CREATE TRIGGER validate_invitation_trigger
    BEFORE INSERT ON study_invitations
    FOR EACH ROW
    EXECUTE FUNCTION validate_invitation_creation();

-- 期限切れ招待の自動更新関数
CREATE OR REPLACE FUNCTION update_expired_invitations()
RETURNS void AS $$
BEGIN
    UPDATE study_invitations 
    SET status = 'expired'
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 期限切れ招待の自動更新（日次実行）
-- この関数は定期的に実行する必要があります（cron job等で）

-- RLS (Row Level Security) ポリシーの更新
-- スーパー管理者は全てのデータにアクセス可能
CREATE POLICY "Super admin can access all invitations" ON study_invitations
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'ikki_y0518@icloud.com'
    );

-- 通常の管理者は自分のスクールの招待のみアクセス可能
CREATE POLICY "Admins can access own school invitations" ON study_invitations
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' AND
        school_id IN (
            SELECT school_id FROM study_user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- 招待コード検証用のポリシー（公開アクセス）
CREATE POLICY "Anyone can validate invitation codes" ON study_invitations
    FOR SELECT USING (status = 'pending' AND expires_at > NOW());

-- インデックスの追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_invitations_code ON study_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_invitations_school_status ON study_invitations(school_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_expires_at ON study_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_invitations_created_by_super_admin ON study_invitations(created_by_super_admin);

-- 初期データ: スーパー管理者プロファイル
INSERT INTO study_user_profiles (
    user_id, 
    name, 
    email, 
    role, 
    school_id,
    grade,
    created_at
) VALUES (
    'super-admin-uuid', -- 実際のSupabase UUIDに置き換え
    'Ikki Yamamoto',
    'ikki_y0518@icloud.com',
    'super_admin',
    (SELECT id FROM study_schools LIMIT 1), -- デフォルトスクール
    'システム管理者',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 完了メッセージ
SELECT 'Invitation system database extension completed successfully!' as message; 