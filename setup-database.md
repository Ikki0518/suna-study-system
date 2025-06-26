# Supabaseデータベースセットアップ手順

## 1. Supabaseダッシュボードにアクセス
- https://supabase.com/dashboard
- プロジェクト: wjpcfsjtjgxvhijczxnj

## 2. SQL Editorでスキーマを実行
1. 左側メニューから "SQL Editor" を選択
2. "New query" をクリック
3. 以下のSQLファイルの内容をコピー＆ペーストして実行

## 3. 実行するSQLファイル
`database-schema-coexist.sql` の全内容を実行

これにより以下のテーブルが作成されます：
- study_schools (スクール管理)
- study_user_profiles (ユーザー管理)
- study_subjects (科目管理)
- study_courses (コース管理)
- study_chapters (章管理)
- study_lessons (講義管理)
- study_student_progress (進捗管理)
- study_course_enrollments (受講管理)

## 4. 確認方法
- Table Editorで各テーブルが作成されていることを確認
- 初期データ（デモ学習塾など）が投入されていることを確認

## 5. 実行後
- JavaScriptアプリケーションが正常にSupabaseと連携
- 受講生登録・管理機能が本格稼働