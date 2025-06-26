# 決済機能セットアップガイド
Suna Study System - Payment Integration Setup Guide

## 概要

Suna Study Systemに決済機能（Stripe + Supabase）を統合するためのセットアップガイドです。
このガイドに従って、サブスクリプション決済とユーザー管理システムを導入できます。

## 前提条件

- Node.js 14以上がインストール済み
- Supabaseプロジェクトが作成済み
- Stripeアカウントが作成済み
- 基本的なJavaScript/Node.jsの知識

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install stripe @supabase/supabase-js
```

### 2. Supabase設定

#### 2.1. データベーススキーマの作成

Supabaseの「SQL Editor」で以下のファイルを順番に実行してください：

1. `database-schema.sql` - 基本スキーマ
2. `database-extension-payments.sql` - 決済機能拡張

#### 2.2. Row Level Security (RLS) の確認

すべてのテーブルでRLSが有効になっていることを確認してください。

#### 2.3. Supabase API設定

1. Supabaseダッシュボードから「Settings」→「API」に移動
2. 以下の値をメモ：
   - Project URL
   - API Keys (anon public / service_role)

### 3. Stripe設定

#### 3.1. Stripeダッシュボードでの設定

1. [Stripe Dashboard](https://dashboard.stripe.com/)にログイン
2. 「Developers」→「API keys」から以下をメモ：
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

#### 3.2. 料金プランの作成

1. 「Products」→「Add product」で各プランを作成
2. 以下のプランを推奨：
   - スタータープラン: ¥3,980/月
   - スタンダードプラン: ¥9,980/月
   - プレミアムプラン: ¥19,980/月

#### 3.3. Webhookの設定

1. 「Developers」→「Webhooks」→「Add endpoint」
2. エンドポイントURL: `https://yourdomain.com/api/webhooks/stripe`
3. 監視するイベント：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Webhook signing secretをメモ

### 4. 環境変数の設定

`.env`ファイルを作成し、以下の値を設定：

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Application Settings
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

### 5. データベースの初期化

#### 5.1. 料金プランデータの更新

Supabaseの「SQL Editor」で以下のクエリを実行し、Stripe Price IDを更新：

```sql
-- スタータープラン
UPDATE pricing_plans 
SET stripe_price_id_monthly = 'price_your_starter_monthly_id',
    stripe_price_id_yearly = 'price_your_starter_yearly_id'
WHERE name = 'スタータープラン';

-- スタンダードプラン
UPDATE pricing_plans 
SET stripe_price_id_monthly = 'price_your_standard_monthly_id',
    stripe_price_id_yearly = 'price_your_standard_yearly_id'
WHERE name = 'スタンダードプラン';

-- プレミアムプラン
UPDATE pricing_plans 
SET stripe_price_id_monthly = 'price_your_premium_monthly_id',
    stripe_price_id_yearly = 'price_your_premium_yearly_id'
WHERE name = 'プレミアムプラン';
```

### 6. フロントエンド設定

#### 6.1. Supabase設定の更新

`js/supabase-config.js`の以下の値を実際の値に更新：

```javascript
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

#### 6.2. Stripe設定の更新

`js/payment.js`の以下の値を実際の値に更新：

```javascript
this.stripe = Stripe('pk_test_your-stripe-publishable-key');
```

### 7. サーバーの起動とテスト

#### 7.1. サーバー起動

```bash
npm start
```

#### 7.2. 機能テスト

1. **認証テスト**
   - 新規ユーザー登録
   - ログイン/ログアウト

2. **料金プラン表示テスト**
   - `/pages/pricing.html`にアクセス
   - プランが正しく表示されることを確認

3. **決済フローテスト**（テストモード）
   - プランを選択
   - テストカード番号で決済テスト
   - Webhook通知の確認

### 8. 本番環境への移行

#### 8.1. Stripe本番キーの設定

1. Stripeダッシュボードで「Live mode」に切り替え
2. 本番用API keyを取得
3. 環境変数を本番用キーに更新

#### 8.2. セキュリティ設定

1. **CORS設定**
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

2. **HTTPS必須**
   - 本番環境では必ずHTTPS使用
   - SSL証明書の設定

3. **環境変数の保護**
   - 秘匿情報を環境変数で管理
   - `.env`ファイルを`.gitignore`に追加

## 使用方法

### 管理者側

1. **ダッシュボードへアクセス**
   - `/pages/admin.html`
   - 決済管理メニューから各機能にアクセス

2. **サブスクリプション管理**
   - `/pages/subscription.html`
   - 現在の契約状況確認
   - 決済履歴の確認

3. **プラン変更**
   - `/pages/pricing.html`
   - プランの選択・変更

### 生徒・保護者側

1. **プラン選択**
   - 初回登録時にプラン選択
   - 14日間無料トライアル利用可能

2. **決済情報管理**
   - カード情報の更新
   - 決済履歴の確認

## トラブルシューティング

### よくある問題

#### 1. 決済が失敗する

**症状**: 決済処理でエラーが発生
**解決方法**:
- Stripe APIキーが正しく設定されているか確認
- テストモードの場合、テストカード番号を使用
- ブラウザの開発者ツールでエラーログを確認

#### 2. Webhookが動作しない

**症状**: Stripe側で決済成功しても、システムに反映されない
**解決方法**:
- Webhook URL（`/api/webhooks/stripe`）が正しく設定されているか確認
- Webhook署名の検証が正しく行われているか確認
- サーバーログでWebhookリクエストを確認

#### 3. Supabaseとの連携エラー

**症状**: データベース操作でエラーが発生
**解決方法**:
- Supabase URL/API Keyが正しいか確認
- RLSポリシーが正しく設定されているか確認
- ネットワーク接続を確認

### デバッグ方法

#### 1. ログの確認

```bash
# サーバーログ
tail -f logs/server.log

# ブラウザコンソール
開発者ツール → Console
```

#### 2. Stripe Dashboard

- 「Logs」セクションで決済状況を確認
- 「Webhooks」でWebhook通知履歴を確認

#### 3. Supabase Dashboard

- 「Logs」でデータベースクエリを確認
- 「Authentication」でユーザー状況を確認

## セキュリティ考慮事項

### 1. API Key管理

- 秘匿キーを環境変数で管理
- Git履歴に秘匿情報を含めない
- 定期的なキーローテーション

### 2. 決済データ保護

- PCI DSS準拠（Stripeが対応）
- カード情報の直接保存禁止
- Webhook署名の検証必須

### 3. ユーザーデータ保護

- 個人情報の適切な暗号化
- 最小権限の原則
- 定期的なセキュリティ監査

## 監視とメンテナンス

### 1. 監視項目

- 決済成功率
- Webhook通知の遅延
- エラーログの監視
- サーバーリソース使用率

### 2. 定期メンテナンス

- ログファイルのローテーション
- データベースの最適化
- セキュリティアップデート

### 3. バックアップ

- データベースの定期バックアップ
- 設定ファイルのバックアップ
- 復旧手順の文書化

## サポート情報

### 公式ドキュメント

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### コミュニティ

- [Stripe Discord](https://discord.gg/stripe)
- [Supabase Discord](https://discord.supabase.com/)

---

## 更新履歴

- 2024/01/26: 初版作成
- 2024/01/26: セキュリティセクション追加
- 2024/01/26: トラブルシューティング充実

---

このガイドに関するご質問やフィードバックがございましたら、開発チームまでお問い合わせください。