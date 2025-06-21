# Supabase セットアップガイド

## 🏗️ **1. Supabaseプロジェクト作成**

### 1.1 アカウント作成
1. [supabase.com](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

### 1.2 新しいプロジェクト作成
1. ダッシュボードで「New Project」をクリック
2. プロジェクト設定：
   - **Name**: `suna-study-system`
   - **Database Password**: 強力なパスワードを生成（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)`
   - **Pricing Plan**: `Free` (開発用)

## 🗄️ **2. データベーススキーマ実行**

### 2.1 SQL Editorでスキーマ実行
1. Supabaseダッシュボードで「SQL Editor」を開く
2. `database-schema.sql`の内容をコピー&ペースト
3. 「Run」をクリックしてスキーマを実行

### 2.2 実行確認
以下のテーブルが作成されることを確認：
- `schools` (スクール管理)
- `user_profiles` (ユーザープロフィール)
- `subjects` (科目)
- `courses` (コース)
- `chapters` (章)
- `lessons` (講義)
- `student_progress` (学習進捗)
- `course_enrollments` (コース受講)

## 🔐 **3. 認証設定**

### 3.1 Authentication設定
1. 「Authentication」→「Settings」を開く
2. **Site URL**: `https://your-vercel-app.vercel.app`
3. **Redirect URLs**: 
   ```
   https://your-vercel-app.vercel.app/auth/callback
   https://your-vercel-app.vercel.app/pages/student.html
   https://your-vercel-app.vercel.app/pages/admin.html
   ```

### 3.2 Email Templates (オプション)
カスタムメールテンプレートを設定可能

## 📁 **4. Storage設定**

### 4.1 Buckets作成
1. 「Storage」を開く
2. 以下のBucketを作成：
   - `videos` (動画ファイル用)
   - `pdfs` (PDF教材用)
   - `avatars` (プロフィール画像用)

### 4.2 Storage Policies設定
```sql
-- Videos bucket policy
CREATE POLICY "Videos are viewable by authenticated users" ON storage.objects
FOR SELECT USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Videos are uploadable by instructors and admins" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'videos' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- PDFs bucket policy
CREATE POLICY "PDFs are viewable by authenticated users" ON storage.objects
FOR SELECT USING (bucket_id = 'pdfs' AND auth.role() = 'authenticated');

CREATE POLICY "PDFs are uploadable by instructors and admins" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pdfs' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

-- Avatars bucket policy
CREATE POLICY "Avatars are viewable by authenticated users" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 🔑 **5. 環境変数設定**

### 5.1 Supabase設定値取得
1. 「Settings」→「API」を開く
2. 以下の値をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5.2 Vercelに環境変数設定
Vercelダッシュボードの「Settings」→「Environment Variables」で設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 **6. 初期データ投入**

### 6.1 デフォルトスクールデータ
スキーマ実行時に自動で作成されます。

### 6.2 科目データ投入
```sql
-- デモ学習塾の科目データ
INSERT INTO subjects (key, name, description, color, icon, school_id) 
SELECT 
  'japanese', '国語', '読解力・文章力・語彙力を総合的に向上', '#dc2626', '📚',
  id FROM schools WHERE name = 'デモ学習塾';

INSERT INTO subjects (key, name, description, color, icon, school_id) 
SELECT 
  'math', '数学', '論理的思考力と問題解決能力を育成', '#2563eb', '🔢',
  id FROM schools WHERE name = 'デモ学習塾';

INSERT INTO subjects (key, name, description, color, icon, school_id) 
SELECT 
  'english', '英語', '4技能をバランスよく習得', '#059669', '🌍',
  id FROM schools WHERE name = 'デモ学習塾';

INSERT INTO subjects (key, name, description, color, icon, school_id) 
SELECT 
  'science', '理科', '科学的思考力と探究心を育む', '#7c3aed', '🔬',
  id FROM schools WHERE name = 'デモ学習塾';

INSERT INTO subjects (key, name, description, color, icon, school_id) 
SELECT 
  'social', '社会', '社会への理解と関心を深める', '#ea580c', '🌏',
  id FROM schools WHERE name = 'デモ学習塾';
```

## 🔧 **7. 開発環境での接続テスト**

### 7.1 Supabaseクライアント設定
```javascript
// js/supabase-client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxxxx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 7.2 接続テスト
```javascript
// 接続テスト用のコード
async function testConnection() {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Supabase接続エラー:', error)
  } else {
    console.log('Supabase接続成功:', data)
  }
}
```

## 📈 **8. 監視とメンテナンス**

### 8.1 ダッシュボード監視
- **Database**: テーブルサイズ、クエリパフォーマンス
- **Auth**: ユーザー登録数、ログイン状況
- **Storage**: ファイル使用量
- **API**: リクエスト数、エラー率

### 8.2 バックアップ設定
- 自動バックアップは無料プランでも利用可能
- 重要なデータは定期的に手動エクスポート推奨

## 🚀 **9. 本番環境への移行**

### 9.1 プロダクションプラン検討
- **Pro Plan**: $25/月 - 本格運用時
- **Team Plan**: $599/月 - 大規模運用時

### 9.2 セキュリティ強化
- RLS（Row Level Security）ポリシーの見直し
- API Key の定期的な更新
- SSL/TLS設定の確認

## 🆘 **10. トラブルシューティング**

### よくある問題と解決策

#### RLSエラー
```
new row violates row-level security policy
```
→ ポリシー設定を確認し、適切な権限を付与

#### 認証エラー
```
Invalid JWT
```
→ 環境変数の設定とSupabase URLを確認

#### ストレージアップロードエラー
```
The resource was not found
```
→ Bucket作成とポリシー設定を確認 