# 🚀 Supabase テーブル作成手順

## 1. SQL実行準備
- Supabaseダッシュボード: https://supabase.com/dashboard
- プロジェクト: wjpcfsjtjgxvhijczxnj
- SQL Editor → New query

## 2. 実行するSQL
以下のファイルの**全内容**をコピーして実行：
`database-schema-coexist.sql`

## 3. 作成されるテーブル一覧
✅ study_schools (スクール管理)
✅ study_user_profiles (ユーザー管理) 
✅ study_subjects (科目管理)
✅ study_courses (コース管理)  
✅ study_chapters (章管理)
✅ study_lessons (講義管理)
✅ study_student_progress (進捗管理)
✅ study_course_enrollments (受講管理)

## 4. 初期データ
- デモ学習塾
- さくら塾  
- 未来アカデミー
- シャイニングスターズ

## 5. セキュリティ機能
- Row Level Security (RLS) 有効
- 管理者/受講生別アクセス制御
- スクール別データ分離

## 6. 実行後の確認
- Table Editor で各テーブル確認
- 初期データが投入されていることを確認
- JavaScriptアプリが正常に動作することを確認

## 注意事項
⚠️ 全361行のSQLを一度に実行してください
⚠️ エラーが出た場合は、すでに存在するテーブルの可能性があります