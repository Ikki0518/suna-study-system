-- ============================================
-- 決済機能拡張用データベーススキーマ
-- Suna Study System - Payment Extension
-- ============================================

-- ============================================
-- 1. Pricing Plans (料金プラン管理)
-- ============================================
CREATE TABLE pricing_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly INTEGER NOT NULL, -- 月額料金（円）
    price_yearly INTEGER, -- 年額料金（円、割引適用）
    max_students INTEGER DEFAULT 0, -- 最大生徒数（0は無制限）
    max_courses INTEGER DEFAULT 0, -- 最大コース数（0は無制限）
    features JSONB DEFAULT '[]', -- 利用可能機能のリスト
    stripe_price_id_monthly VARCHAR(100), -- Stripe価格ID（月額）
    stripe_price_id_yearly VARCHAR(100), -- Stripe価格ID（年額）
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false, -- 人気プランフラグ
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. School Subscriptions (スクールサブスクリプション)
-- ============================================
CREATE TABLE school_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    pricing_plan_id UUID REFERENCES pricing_plans(id),
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100) UNIQUE,
    status VARCHAR(20) CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')) DEFAULT 'trialing',
    billing_cycle VARCHAR(10) CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, stripe_subscription_id)
);

-- ============================================
-- 3. Payment History (決済履歴)
-- ============================================
CREATE TABLE payment_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES school_subscriptions(id),
    stripe_invoice_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    amount INTEGER NOT NULL, -- 金額（円）
    currency VARCHAR(3) DEFAULT 'jpy',
    status VARCHAR(20) CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')) DEFAULT 'pending',
    payment_method VARCHAR(50), -- 'card', 'bank_transfer', etc.
    description TEXT,
    receipt_url TEXT,
    failure_reason TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. Payment Methods (決済方法)
-- ============================================
CREATE TABLE payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(100) UNIQUE,
    type VARCHAR(20) DEFAULT 'card',
    card_brand VARCHAR(20), -- 'visa', 'mastercard', etc.
    card_last4 VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. Billing Addresses (請求先住所)
-- ============================================
CREATE TABLE billing_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    company_name VARCHAR(200),
    postal_code VARCHAR(20),
    prefecture VARCHAR(50),
    city VARCHAR(100),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    phone VARCHAR(20),
    tax_id VARCHAR(50), -- 法人番号等
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id)
);

-- ============================================
-- 6. Usage Metrics (使用量メトリクス)
-- ============================================
CREATE TABLE usage_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    active_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    storage_used_mb INTEGER DEFAULT 0,
    video_hours_watched INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, metric_date)
);

-- ============================================
-- 7. Invoices (請求書)
-- ============================================
CREATE TABLE invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES school_subscriptions(id),
    stripe_invoice_id VARCHAR(100) UNIQUE,
    invoice_number VARCHAR(50) UNIQUE,
    amount INTEGER NOT NULL,
    tax_amount INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'jpy',
    status VARCHAR(20) CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')) DEFAULT 'draft',
    invoice_date DATE NOT NULL,
    due_date DATE,
    paid_date DATE,
    invoice_pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- インデックス作成
-- ============================================
CREATE INDEX idx_school_subscriptions_school_id ON school_subscriptions(school_id);
CREATE INDEX idx_school_subscriptions_status ON school_subscriptions(status);
CREATE INDEX idx_payment_history_school_id ON payment_history(school_id);
CREATE INDEX idx_payment_history_status ON payment_history(status);
CREATE INDEX idx_payment_methods_school_id ON payment_methods(school_id);
CREATE INDEX idx_usage_metrics_school_date ON usage_metrics(school_id, metric_date);
CREATE INDEX idx_invoices_school_id ON invoices(school_id);

-- ============================================
-- RLS (Row Level Security) ポリシー
-- ============================================

-- RLSを有効化
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Pricing Plans: 全員が閲覧可能
CREATE POLICY "Pricing plans are viewable by everyone" ON pricing_plans FOR SELECT USING (is_active = true);

-- School Subscriptions: 該当スクールの管理者のみ
CREATE POLICY "School subscriptions viewable by school admins" ON school_subscriptions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = school_subscriptions.school_id AND role = 'admin'
    )
);

-- Payment History: 該当スクールの管理者のみ
CREATE POLICY "Payment history viewable by school admins" ON payment_history FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = payment_history.school_id AND role = 'admin'
    )
);

-- Payment Methods: 該当スクールの管理者のみ
CREATE POLICY "Payment methods manageable by school admins" ON payment_methods FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = payment_methods.school_id AND role = 'admin'
    )
);

-- Billing Addresses: 該当スクールの管理者のみ
CREATE POLICY "Billing addresses manageable by school admins" ON billing_addresses FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = billing_addresses.school_id AND role = 'admin'
    )
);

-- ============================================
-- トリガー設定
-- ============================================

-- updated_atトリガーを各テーブルに設定
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON pricing_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_subscriptions_updated_at BEFORE UPDATE ON school_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_history_updated_at BEFORE UPDATE ON payment_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_addresses_updated_at BEFORE UPDATE ON billing_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 初期料金プランデータ
-- ============================================

INSERT INTO pricing_plans (name, description, price_monthly, price_yearly, max_students, max_courses, features, is_popular) VALUES
('スタータープラン', '小規模な塾や個人指導に最適', 3980, 39800, 20, 10, '["基本的な学習管理", "進捗追跡", "5科目対応", "基本サポート"]', false),
('スタンダードプラン', '中規模な塾におすすめ', 9980, 99800, 100, 50, '["全機能利用可能", "詳細な分析機能", "カスタマイズ可能", "優先サポート", "データエクスポート"]', true),
('プレミアムプラン', '大規模な塾や法人向け', 19980, 199800, 500, 0, '["無制限のコース作成", "高度な分析機能", "専用サポート", "API アクセス", "白ラベル対応", "シングルサインオン"]', false),
('エンタープライズ', '教育機関向けカスタムプラン', 0, 0, 0, 0, '["完全カスタマイズ", "専用サーバー", "24/7サポート", "研修プログラム", "導入コンサルティング"]', false);

-- ============================================
-- 使用量チェック関数
-- ============================================

-- スクールの現在の使用量をチェックする関数
CREATE OR REPLACE FUNCTION check_school_usage_limits(school_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    subscription_record RECORD;
    plan_record RECORD;
    current_students INTEGER;
    current_courses INTEGER;
    result JSONB;
BEGIN
    -- 現在のサブスクリプションとプランを取得
    SELECT ss.*, pp.max_students, pp.max_courses, pp.name as plan_name
    INTO subscription_record
    FROM school_subscriptions ss
    JOIN pricing_plans pp ON ss.pricing_plan_id = pp.id
    WHERE ss.school_id = school_uuid AND ss.status = 'active'
    ORDER BY ss.created_at DESC
    LIMIT 1;
    
    -- サブスクリプションが見つからない場合
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'error', 'No active subscription found',
            'can_add_students', false,
            'can_add_courses', false
        );
    END IF;
    
    -- 現在の使用量を取得
    SELECT COUNT(DISTINCT up.id), COUNT(DISTINCT c.id)
    INTO current_students, current_courses
    FROM user_profiles up
    LEFT JOIN courses c ON up.school_id = c.school_id
    WHERE up.school_id = school_uuid AND up.role = 'student';
    
    -- 結果を構築
    result := jsonb_build_object(
        'plan_name', subscription_record.plan_name,
        'current_students', current_students,
        'max_students', subscription_record.max_students,
        'current_courses', current_courses,
        'max_courses', subscription_record.max_courses,
        'can_add_students', (subscription_record.max_students = 0 OR current_students < subscription_record.max_students),
        'can_add_courses', (subscription_record.max_courses = 0 OR current_courses < subscription_record.max_courses)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Webhook処理用関数
-- ============================================

-- Stripeのwebhookデータを処理する関数
CREATE OR REPLACE FUNCTION process_stripe_webhook(
    event_type TEXT,
    webhook_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    subscription_id TEXT;
    customer_id TEXT;
    school_uuid UUID;
BEGIN
    -- イベントタイプに応じた処理
    CASE event_type
        WHEN 'customer.subscription.updated' THEN
            subscription_id := webhook_data->>'id';
            
            UPDATE school_subscriptions 
            SET 
                status = webhook_data->>'status',
                current_period_start = TO_TIMESTAMP((webhook_data->>'current_period_start')::INTEGER),
                current_period_end = TO_TIMESTAMP((webhook_data->>'current_period_end')::INTEGER),
                updated_at = NOW()
            WHERE stripe_subscription_id = subscription_id;
            
        WHEN 'invoice.payment_succeeded' THEN
            customer_id := webhook_data->>'customer';
            
            -- 決済履歴を更新
            UPDATE payment_history 
            SET 
                status = 'succeeded',
                paid_at = TO_TIMESTAMP((webhook_data->>'status_transitions'->>'paid_at')::INTEGER),
                updated_at = NOW()
            WHERE stripe_invoice_id = webhook_data->>'id';
            
        WHEN 'invoice.payment_failed' THEN
            customer_id := webhook_data->>'customer';
            
            -- 決済履歴を更新
            UPDATE payment_history 
            SET 
                status = 'failed',
                failure_reason = webhook_data->>'last_finalization_error'->>'message',
                updated_at = NOW()
            WHERE stripe_invoice_id = webhook_data->>'id';
            
    END CASE;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- エラーログを記録（実際の実装では適切なログシステムを使用）
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;