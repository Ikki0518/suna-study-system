import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();

// Determine __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe (デモモード対応)
const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_demo_key'
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Initialize Supabase client (デモモード対応)
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://demo.supabase.co'
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// デモ用データ
const DEMO_PRICING_PLANS = [
  {
    id: 'plan-starter',
    name: 'スタータープラン',
    description: '小規模な塾や個人指導に最適',
    price_monthly: 3980,
    price_yearly: 39800,
    max_students: 20,
    max_courses: 10,
    features: '["基本的な学習管理", "進捗追跡", "5科目対応", "基本サポート"]',
    is_popular: false,
    stripe_price_id_monthly: 'price_demo_starter_monthly',
    stripe_price_id_yearly: 'price_demo_starter_yearly',
    sort_order: 1
  },
  {
    id: 'plan-standard',
    name: 'スタンダードプラン',
    description: '中規模な塾におすすめ',
    price_monthly: 9980,
    price_yearly: 99800,
    max_students: 100,
    max_courses: 50,
    features: '["全機能利用可能", "詳細な分析機能", "カスタマイズ可能", "優先サポート", "データエクスポート"]',
    is_popular: true,
    stripe_price_id_monthly: 'price_demo_standard_monthly',
    stripe_price_id_yearly: 'price_demo_standard_yearly',
    sort_order: 2
  },
  {
    id: 'plan-premium',
    name: 'プレミアムプラン',
    description: '大規模な塾や法人向け',
    price_monthly: 19980,
    price_yearly: 199800,
    max_students: 500,
    max_courses: 0,
    features: '["無制限のコース作成", "高度な分析機能", "専用サポート", "API アクセス", "白ラベル対応", "シングルサインオン"]',
    is_popular: false,
    stripe_price_id_monthly: 'price_demo_premium_monthly',
    stripe_price_id_yearly: 'price_demo_premium_yearly',
    sort_order: 3
  },
  {
    id: 'plan-enterprise',
    name: 'エンタープライズ',
    description: '教育機関向けカスタムプラン',
    price_monthly: 0,
    price_yearly: 0,
    max_students: 0,
    max_courses: 0,
    features: '["完全カスタマイズ", "専用サーバー", "24/7サポート", "研修プログラム", "導入コンサルティング"]',
    is_popular: false,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    sort_order: 4
  }
];

const DEMO_SUBSCRIPTION = {
  id: 'sub-demo',
  school_id: 'school-demo',
  pricing_plan_id: 'plan-standard',
  status: 'trialing',
  billing_cycle: 'monthly',
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  pricing_plans: DEMO_PRICING_PLANS[1]
};

const DEMO_USAGE = {
  current_students: 25,
  max_students: 100,
  current_courses: 12,
  max_courses: 50,
  can_add_students: true,
  can_add_courses: true,
  plan_name: 'スタンダードプラン'
};

const DEMO_PAYMENT_HISTORY = [
  {
    id: 'pay-1',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 9980,
    status: 'succeeded',
    payment_method: 'card',
    description: 'スタンダードプラン - 月額',
    receipt_url: '#'
  },
  {
    id: 'pay-2', 
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 9980,
    status: 'succeeded',
    payment_method: 'card',
    description: 'スタンダードプラン - 月額',
    receipt_url: '#'
  }
];

// Middleware
app.use(cors());
app.use(express.json({ 
  limit: '2mb',
  verify: (req, res, buf) => {
    // Preserve raw body for Stripe webhook verification
    if (req.originalUrl === '/api/webhooks/stripe') {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの提供（決済関連のみ）
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ルートページ - 決済システムのダッシュボード
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>決済システム - Suna Study System</title>
        <link rel="stylesheet" href="/styles/main.css">
        <link rel="stylesheet" href="/styles/payment.css">
        <style>
            .payment-dashboard {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .dashboard-header {
                text-align: center;
                margin-bottom: 60px;
            }
            .dashboard-header h1 {
                font-size: 3rem;
                color: #1a365d;
                margin-bottom: 20px;
            }
            .dashboard-header p {
                font-size: 1.2rem;
                color: #718096;
            }
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 30px;
                margin-top: 40px;
            }
            .feature-card {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s ease;
            }
            .feature-card:hover {
                transform: translateY(-5px);
            }
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 20px;
            }
            .feature-title {
                font-size: 1.5rem;
                font-weight: bold;
                color: #2d3748;
                margin-bottom: 15px;
            }
            .feature-description {
                color: #718096;
                margin-bottom: 25px;
            }
            .feature-btn {
                display: inline-block;
                background: linear-gradient(45deg, #007bff, #0056b3);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .feature-btn:hover {
                background: linear-gradient(45deg, #0056b3, #004085);
                transform: translateY(-2px);
            }
            .status-indicator {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                margin-left: 15px;
            }
            .status-demo {
                background: #e3f2fd;
                color: #1976d2;
            }
            .api-status {
                margin-top: 60px;
                padding: 30px;
                background: #f8f9fa;
                border-radius: 15px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="payment-dashboard">
            <div class="dashboard-header">
                <h1>💳 決済システム</h1>
                <p>Suna Study System 決済機能専用サーバー</p>
                <span class="status-indicator status-demo">デモモード</span>
            </div>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <div class="feature-title">料金プラン</div>
                    <div class="feature-description">
                        4つの料金プランから選択可能。<br>
                        14日間の無料トライアル付き。
                    </div>
                    <a href="/pricing" class="feature-btn">プランを見る</a>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">サブスクリプション管理</div>
                    <div class="feature-description">
                        現在の契約状況と使用量を<br>
                        リアルタイムで確認できます。
                    </div>
                    <a href="/subscription" class="feature-btn">管理画面</a>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔧</div>
                    <div class="feature-title">API ドキュメント</div>
                    <div class="feature-description">
                        決済APIの仕様と<br>
                        テスト用エンドポイント。
                    </div>
                    <a href="/api-docs" class="feature-btn">API確認</a>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <div class="feature-title">決済テスト</div>
                    <div class="feature-description">
                        Stripe決済フローの<br>
                        デモンストレーション。
                    </div>
                    <a href="/test-payment" class="feature-btn">テスト実行</a>
                </div>
            </div>
            
            <div class="api-status">
                <h3>API ステータス</h3>
                <p>
                    <strong>サーバー:</strong> 稼働中 ✅<br>
                    <strong>Stripe:</strong> ${stripe ? '本番モード' : 'デモモード'} <br>
                    <strong>Supabase:</strong> ${supabase ? '接続済み' : 'デモモード'}
                </p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 料金プランページ
app.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'pricing.html'));
});

// サブスクリプション管理ページ
app.get('/subscription', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'subscription.html'));
});

// API ドキュメントページ
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API ドキュメント - 決済システム</title>
        <link rel="stylesheet" href="/styles/main.css">
        <style>
            .api-docs {
                max-width: 900px;
                margin: 0 auto;
                padding: 40px 20px;
                font-family: 'Courier New', monospace;
            }
            .endpoint {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #007bff;
            }
            .method {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                margin-right: 10px;
            }
            .get { background: #28a745; color: white; }
            .post { background: #007bff; color: white; }
            .response {
                background: #2d3748;
                color: #e2e8f0;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
                overflow-x: auto;
            }
            h1 { color: #1a365d; }
            h2 { color: #2d3748; margin-top: 40px; }
        </style>
    </head>
    <body>
        <div class="api-docs">
            <h1>💻 決済API ドキュメント</h1>
            <p>Suna Study System 決済機能のAPI仕様書</p>
            
            <h2>📋 利用可能なエンドポイント</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span><strong>/api/pricing-plans</strong>
                <p>料金プラン一覧を取得します。</p>
                <div class="response">
{
  "plans": [
    {
      "id": "plan-starter",
      "name": "スタータープラン",
      "price_monthly": 3980,
      "price_yearly": 39800,
      "max_students": 20,
      "features": ["基本的な学習管理", "進捗追跡"]
    }
  ]
}
                </div>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span><strong>/api/subscription-status/:schoolId</strong>
                <p>指定したスクールのサブスクリプション状況を取得します。</p>
                <div class="response">
{
  "hasSubscription": true,
  "subscription": {
    "status": "trialing",
    "billing_cycle": "monthly",
    "pricing_plans": {...}
  },
  "usage": {
    "current_students": 25,
    "max_students": 100
  }
}
                </div>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span><strong>/api/payment-history/:schoolId</strong>
                <p>指定したスクールの決済履歴を取得します。</p>
                <div class="response">
{
  "payments": [
    {
      "id": "pay-1",
      "amount": 9980,
      "status": "succeeded",
      "created_at": "2025-01-26T..."
    }
  ],
  "total": 2,
  "page": 1
}
                </div>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span><strong>/api/create-subscription</strong>
                <p>新しいサブスクリプションを作成します。</p>
                <div class="response">
// Request Body
{
  "schoolId": "school-demo",
  "planId": "plan-standard",
  "paymentMethodId": "pm_...",
  "billingCycle": "monthly"
}

// Response
{
  "subscriptionId": "sub_...",
  "clientSecret": "pi_...",
  "status": "trialing"
}
                </div>
            </div>
            
            <h2>🔧 テスト方法</h2>
            <p>以下のcurlコマンドでAPIをテストできます：</p>
            <div class="response">
# 料金プラン取得
curl http://localhost:4000/api/pricing-plans

# サブスクリプション状況確認
curl http://localhost:4000/api/subscription-status/school-demo

# 決済履歴取得
curl http://localhost:4000/api/payment-history/school-demo
            </div>
            
            <p><a href="/">← ダッシュボードに戻る</a></p>
        </div>
    </body>
    </html>
  `);
});

// 決済テストページ
app.get('/test-payment', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>決済テスト - 決済システム</title>
        <link rel="stylesheet" href="/styles/main.css">
        <link rel="stylesheet" href="/styles/payment.css">
        <script src="https://js.stripe.com/v3/"></script>
    </head>
    <body>
        <div class="payment-container">
            <h1>💳 決済テスト</h1>
            <p>Stripe決済フローのデモンストレーション</p>
            
            <div class="test-section">
                <h2>テスト用クレジットカード番号</h2>
                <div class="test-cards">
                    <div class="test-card">
                        <strong>Visa:</strong> 4242 4242 4242 4242
                    </div>
                    <div class="test-card">
                        <strong>Mastercard:</strong> 5555 5555 5555 4444
                    </div>
                    <div class="test-card">
                        <strong>失敗テスト:</strong> 4000 0000 0000 0002
                    </div>
                </div>
            </div>
            
            <div class="test-section">
                <h2>APIテスト</h2>
                <button onclick="testPricingPlans()" class="btn-primary">料金プラン取得テスト</button>
                <button onclick="testSubscriptionStatus()" class="btn-primary">サブスクリプション状況テスト</button>
                <button onclick="testPaymentHistory()" class="btn-primary">決済履歴テスト</button>
                
                <div id="test-results" style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <h3>テスト結果</h3>
                    <pre id="results-content">ボタンをクリックしてAPIをテストしてください</pre>
                </div>
            </div>
            
            <p><a href="/">← ダッシュボードに戻る</a></p>
        </div>
        
        <script>
            async function testPricingPlans() {
                try {
                    const response = await fetch('/api/pricing-plans');
                    const data = await response.json();
                    document.getElementById('results-content').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById('results-content').textContent = 'エラー: ' + error.message;
                }
            }
            
            async function testSubscriptionStatus() {
                try {
                    const response = await fetch('/api/subscription-status/school-demo');
                    const data = await response.json();
                    document.getElementById('results-content').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById('results-content').textContent = 'エラー: ' + error.message;
                }
            }
            
            async function testPaymentHistory() {
                try {
                    const response = await fetch('/api/payment-history/school-demo');
                    const data = await response.json();
                    document.getElementById('results-content').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById('results-content').textContent = 'エラー: ' + error.message;
                }
            }
        </script>
        
        <style>
            .test-section {
                margin: 40px 0;
                padding: 30px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .test-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            .test-card {
                padding: 15px;
                background: #e3f2fd;
                border-radius: 8px;
                font-family: monospace;
            }
            .btn-primary {
                background: linear-gradient(45deg, #007bff, #0056b3);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                margin: 10px;
                cursor: pointer;
                font-weight: bold;
            }
            .btn-primary:hover {
                background: linear-gradient(45deg, #0056b3, #004085);
            }
        </style>
    </body>
    </html>
  `);
});

// ============================================
// 決済関連API
// ============================================

// 料金プラン一覧取得
app.get('/api/pricing-plans', async (req, res) => {
  try {
    // デモモードの場合
    if (!supabase) {
      return res.json({ plans: DEMO_PRICING_PLANS });
    }

    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;

    res.json({ plans: data });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({ error: 'プランの取得に失敗しました' });
  }
});

// サブスクリプション状況取得
app.get('/api/subscription-status/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;

    // デモモードの場合
    if (!supabase) {
      return res.json({
        hasSubscription: true,
        subscription: DEMO_SUBSCRIPTION,
        usage: DEMO_USAGE
      });
    }

    const { data, error } = await supabase
      .from('school_subscriptions')
      .select(`
        *,
        pricing_plans (*)
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.json({ hasSubscription: false });
    }

    // 使用量制限チェック
    const { data: usageData } = await supabase
      .rpc('check_school_usage_limits', { school_uuid: schoolId });

    res.json({
      hasSubscription: true,
      subscription: data,
      usage: usageData
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'サブスクリプション状況の取得に失敗しました' });
  }
});

// 決済履歴取得
app.get('/api/payment-history/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // デモモードの場合
    if (!supabase) {
      return res.json({
        payments: DEMO_PAYMENT_HISTORY,
        total: DEMO_PAYMENT_HISTORY.length,
        page: parseInt(page),
        totalPages: Math.ceil(DEMO_PAYMENT_HISTORY.length / limit)
      });
    }

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('payment_history')
      .select('*', { count: 'exact' })
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      payments: data || [],
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: '決済履歴の取得に失敗しました' });
  }
});

// サブスクリプション作成（デモ版）
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { schoolId, planId, paymentMethodId, billingCycle = 'monthly' } = req.body;

    // デモモードの場合
    if (!stripe) {
      return res.json({
        subscriptionId: 'sub_demo_' + Date.now(),
        clientSecret: 'pi_demo_' + Date.now(),
        status: 'trialing',
        message: 'デモモードでの擬似決済が完了しました'
      });
    }

    // 実際のStripe処理（本番環境用）
    // ... Stripe実装

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'サブスクリプションの作成に失敗しました' });
  }
});

// サブスクリプションキャンセル（デモ版）
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { schoolId, immediate = false } = req.body;

    // デモモードの場合
    if (!stripe) {
      return res.json({
        success: true,
        message: immediate ? 'デモサブスクリプションを即座にキャンセルしました' : 'デモサブスクリプションは期間終了時にキャンセルされます'
      });
    }

    // 実際のStripe処理（本番環境用）
    // ... Stripe実装

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'サブスクリプションのキャンセルに失敗しました' });
  }
});

// Stripe Webhook（デモ版）
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!stripe) {
    console.log('Webhook received in demo mode');
    return res.json({ received: true, mode: 'demo' });
  }

  // 実際のWebhook処理（本番環境用）
  // ... Stripe webhook実装
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: '決済システム専用サーバー',
    mode: stripe ? 'production' : 'demo',
    supabase: supabase ? 'connected' : 'demo'
  });
});

// 404エラーハンドリング
app.all('/api/*', (_, res) => res.status(404).json({ error: 'API endpoint not found' }));

// サーバー起動
const PORT = process.env.PAYMENT_PORT || 4000;
app.listen(PORT, () => {
  console.log(`💳 決済システム専用サーバーが起動しました`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 ダッシュボード: http://localhost:${PORT}`);
  console.log(`💰 料金プラン: http://localhost:${PORT}/pricing`);
  console.log(`📈 管理画面: http://localhost:${PORT}/subscription`);
  console.log(`🔧 API テスト: http://localhost:${PORT}/test-payment`);
  console.log(`📖 API docs: http://localhost:${PORT}/api-docs`);
  console.log(`🔧 モード: ${stripe ? '本番' : 'デモ'}`);
});