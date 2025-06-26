import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env (if present)
dotenv.config();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-demo-key'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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

const app = express();

// Determine __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve static files (HTML, CSS, JS, etc.) from the project root
app.use(express.static(path.join(__dirname, '.')));

// ----- API ROUTES -----

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

// サブスクリプション作成
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { schoolId, planId, paymentMethodId, billingCycle = 'monthly' } = req.body;

    // プラン情報を取得
    const { data: plan, error: planError } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return res.status(404).json({ error: 'プランが見つかりません' });
    }

    // スクール情報を取得
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (schoolError || !school) {
      return res.status(404).json({ error: 'スクールが見つかりません' });
    }

    // Stripeカスタマー作成または取得
    let customerId;
    const { data: existingSubscription } = await supabase
      .from('school_subscriptions')
      .select('stripe_customer_id')
      .eq('school_id', schoolId)
      .limit(1)
      .single();

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        name: school.name,
        metadata: { schoolId }
      });
      customerId = customer.id;
    }

    // 決済方法をカスタマーにアタッチ
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // デフォルト決済方法として設定
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // サブスクリプション作成
    const priceId = billingCycle === 'yearly' ? plan.stripe_price_id_yearly : plan.stripe_price_id_monthly;
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 14, // 14日間のトライアル
    });

    // データベースに記録
    const { error: dbError } = await supabase
      .from('school_subscriptions')
      .insert({
        school_id: schoolId,
        pricing_plan_id: planId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        billing_cycle: billingCycle,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      });

    if (dbError) throw dbError;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'サブスクリプションの作成に失敗しました' });
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

// サブスクリプションキャンセル
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { schoolId, immediate = false } = req.body;

    const { data: subscription, error } = await supabase
      .from('school_subscriptions')
      .select('stripe_subscription_id')
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      return res.status(404).json({ error: 'アクティブなサブスクリプションが見つかりません' });
    }

    // Stripeでサブスクリプションをキャンセル
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: !immediate,
        ...(immediate && { cancel_at: Math.floor(Date.now() / 1000) })
      }
    );

    // データベースを更新
    const { error: updateError } = await supabase
      .from('school_subscriptions')
      .update({
        status: immediate ? 'canceled' : 'active',
        canceled_at: new Date(),
        ...(immediate && { ended_at: new Date() })
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: immediate ? 'サブスクリプションを即座にキャンセルしました' : '期間終了時にキャンセルされます'
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'サブスクリプションのキャンセルに失敗しました' });
  }
});

// Stripe Webhook
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdate(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook処理関数
async function handleSubscriptionUpdate(subscription) {
  await supabase
    .from('school_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentSucceeded(invoice) {
  await supabase
    .from('payment_history')
    .update({
      status: 'succeeded',
      paid_at: new Date(),
      receipt_url: invoice.hosted_invoice_url
    })
    .eq('stripe_invoice_id', invoice.id);
}

async function handlePaymentFailed(invoice) {
  await supabase
    .from('payment_history')
    .update({
      status: 'failed',
      failure_reason: invoice.last_finalization_error?.message || 'Payment failed'
    })
    .eq('stripe_invoice_id', invoice.id);
}

// ============================================
// AI サポート API
// ============================================

app.post('/api/support-ai', async (req, res) => {
  try {
    const { messages, courseContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Base system instructions
    let systemContent = `あなたは「Suna Study System」の学習サポートAIです。\n` +
      `受講生の学習を支援することが目的です。以下のガイドラインに従って回答してください：\n\n` +
      `1. 日本語で丁寧に回答する\n` +
      `2. 学習に関する質問には具体的で分かりやすい説明をする\n` +
      `3. 勉強方法やコツについてアドバイスを提供する\n` +
      `4. 分からない問題には段階的な解法を示す\n` +
      `5. 励ましの言葉を含めて学習意欲を高める\n` +
      `6. 学習以外の質問には適切な範囲で回答し、学習に集中するよう促す\n` +
      `7. 回答は簡潔で理解しやすい形にする`;

    // If lesson context is provided, embed it into the prompt
    if (courseContext) {
      systemContent += `\n\n【現在学習中の講座情報】\n` +
        `講座名: ${courseContext.title || '不明'}\n` +
        `科目: ${courseContext.subject || '不明'}\n` +
        `章: ${courseContext.chapter || '不明'}\n\n` +
        `【講座内容】\n${courseContext.content || '内容が取得できませんでした'}\n\n` +
        `上記の講座内容を踏まえて、受講生の質問に答えてください。講座の内容に関する質問には、この情報を基に詳しく説明してください。`;
    }

    const systemMessage = {
      role: 'system',
      content: systemContent,
    };

    // Compose final message array
    const chatMessages = [systemMessage, ...messages];

    // Call OpenAI Chat Completion (GPT-4o)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'すみません、回答を生成できませんでした。';

    return res.status(200).json({
      reply,
      usage: completion.usage,
      model: 'gpt-4o',
      hasContext: !!courseContext,
    });
  } catch (error) {
    console.error('Support-AI API error:', error);

    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ error: 'APIの使用制限に達しました' });
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'APIキーが無効です' });
    }

    return res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Catch-all for 404 on API routes
app.all('/api/*', (_, res) => res.status(404).json({ error: 'Not Found' }));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Suna Study System server running at http://localhost:${PORT}`);
}); 