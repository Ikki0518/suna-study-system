# Suna Study System デプロイガイド

## 🚀 本格デプロイ手順

### 1. Supabaseプロジェクトのセットアップ

#### 1.1 既存プロジェクトの確認
```bash
# Supabaseにログイン
npx supabase login

# 既存プロジェクト一覧を確認
npx supabase projects list
```

#### 1.2 データベーススキーマの適用
```sql
-- 1. 基本スキーマを適用
-- docs/database-schema-coexist.sql を実行

-- 2. 招待システム拡張を適用
-- database-extension-invitations.sql を実行

-- 3. 初期データを投入
-- initial-study-data.sql を実行
```

#### 1.3 Supabase設定の取得
```bash
# プロジェクトURLとAPIキーを取得
# Supabase Dashboard > Settings > API
```

### 2. 環境変数の設定

#### 2.1 ローカル開発用
```bash
# .env.local ファイルを作成
echo "SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "SUPABASE_ANON_KEY=your-anon-key" >> .env.local
```

#### 2.2 Vercel本番用
```bash
# Vercel環境変数を設定
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

### 3. Vercelデプロイ

#### 3.1 Vercelプロジェクトの初期化
```bash
# Vercel CLIをインストール
npm install -g vercel

# プロジェクトを初期化
vercel

# 設定例:
# ? Set up and deploy "~/Suna Study System"? [Y/n] y
# ? Which scope do you want to deploy to? Your Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? suna-study-system
# ? In which directory is your code located? ./
```

#### 3.2 本番デプロイ
```bash
# 本番環境にデプロイ
vercel --prod

# デプロイ完了後のURL例:
# https://suna-study-system.vercel.app
```

### 4. ドメイン設定（オプション）

#### 4.1 カスタムドメインの追加
```bash
# Vercel Dashboardで設定
# Project Settings > Domains
# 例: study.suna-system.com
```

### 5. Supabase認証の設定

#### 5.1 認証プロバイダーの設定
```sql
-- Supabase Dashboard > Authentication > Settings
-- Site URL: https://suna-study-system.vercel.app
-- Redirect URLs: 
--   - https://suna-study-system.vercel.app/pages/student.html
--   - https://suna-study-system.vercel.app/pages/admin.html
```

### 6. メール設定

#### 6.1 SMTP設定
```bash
# Supabase Dashboard > Settings > Auth
# SMTP Settings を設定
# または SendGrid, Resend等のサービスを利用
```

### 7. セキュリティ設定

#### 7.1 RLS (Row Level Security) の有効化
```sql
-- 全テーブルでRLSを有効化
ALTER TABLE study_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_invitations ENABLE ROW LEVEL SECURITY;
-- 他のテーブルも同様に設定
```

#### 7.2 APIキーの制限
```bash
# Supabase Dashboard > Settings > API
# anon keyの権限を制限
```

## 🔧 設定ファイルの更新

### js/supabase-config.js
```javascript
// 本番環境用の設定に更新
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

## 📊 監視とメンテナンス

### 1. ログ監視
```bash
# Vercel Function Logs
vercel logs

# Supabase Logs
# Supabase Dashboard > Logs
```

### 2. パフォーマンス監視
```bash
# Vercel Analytics
# Vercel Dashboard > Analytics

# Supabase Database Statistics
# Supabase Dashboard > Database
```

### 3. 定期メンテナンス
```sql
-- 期限切れ招待の削除（月次実行推奨）
SELECT update_expired_invitations();

-- データベース統計の更新
ANALYZE;
```

## 🎯 スーパー管理者アカウント

### アカウント情報
- **メールアドレス**: ikki_y0518@icloud.com
- **パスワード**: ikki0518
- **権限**: 全システム管理権限

### 特別機能
- ✅ 全スクールへのアクセス
- ✅ 管理者アカウントの招待
- ✅ システム全体の統計表示
- ✅ 全データの管理権限

## 🚨 トラブルシューティング

### よくある問題

#### 1. 認証エラー
```bash
# Supabase URLとキーを確認
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### 2. デプロイエラー
```bash
# Vercelログを確認
vercel logs --follow
```

#### 3. データベース接続エラー
```sql
-- Supabase Dashboard > SQL Editor で接続テスト
SELECT NOW();
```

## 📞 サポート

問題が発生した場合は、以下の情報を含めてお問い合わせください：

1. エラーメッセージ
2. 発生時刻
3. 実行していた操作
4. ブラウザとバージョン
5. デバイス情報

---

## 🎉 デプロイ完了チェックリスト

- [ ] Supabaseデータベース設定完了
- [ ] 環境変数設定完了
- [ ] Vercelデプロイ完了
- [ ] ドメイン設定完了（オプション）
- [ ] 認証設定完了
- [ ] メール設定完了
- [ ] セキュリティ設定完了
- [ ] スーパー管理者ログイン確認
- [ ] 招待機能テスト完了
- [ ] 全機能動作確認完了

デプロイが完了すると、世界中からアクセス可能な本格的な学習管理システムが利用できます！ 