# 既存データベース統合セットアップ手順

## 🎯 **実行計画**

既存の `Suna-ToDo-db` を使って学習システムを構築します。

### ✅ **メリット**
- 既存のToDoデータを保護
- 新しいデータベース作成制限を回避
- 段階的な移行が可能

## 📝 **実行手順**

### Step 1: データベース接続
1. Supabaseダッシュボードで `Suna-ToDo-db` に接続
2. 「SQL Editor」を開く

### Step 2: 学習システムテーブル作成
1. `database-schema-coexist.sql` の内容をコピー
2. SQL Editorにペーストして実行
3. 以下のテーブルが作成されることを確認：
   - `study_schools`
   - `study_user_profiles`
   - `study_subjects`
   - `study_courses`
   - `study_chapters`
   - `study_lessons`
   - `study_student_progress`
   - `study_course_enrollments`

### Step 3: 初期データ投入
1. `initial-study-data.sql` の内容をコピー
2. SQL Editorで実行
3. デモデータが正常に投入されることを確認

### Step 4: 既存データとの共存確認
```sql
-- 既存テーブル確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'study_%';

-- 学習システムテーブル確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'study_%';
```

## 🔧 **JavaScript側の対応**

### テーブル名の変更対応
```javascript
// Before: 元のテーブル名
const { data } = await supabase.from('schools').select('*');

// After: study_ 接頭辞付きテーブル名
const { data } = await supabase.from('study_schools').select('*');
```

### 主要な変更箇所
- `schools` → `study_schools`
- `user_profiles` → `study_user_profiles`
- `subjects` → `study_subjects`
- `courses` → `study_courses`
- `chapters` → `study_chapters`
- `lessons` → `study_lessons`
- `student_progress` → `study_student_progress`
- `course_enrollments` → `study_course_enrollments`

## 📊 **データ構造確認**

### 作成されるデータ例
```sql
-- スクール
SELECT * FROM study_schools;
-- 4つのデモスクールが作成される

-- 科目
SELECT * FROM study_subjects;
-- 5科目（国語、数学、英語、理科、社会）が作成される

-- コース
SELECT * FROM study_courses;
-- 各科目に2つずつ、計10コースが作成される

-- 章・講義
SELECT * FROM study_chapters;
SELECT * FROM study_lessons;
-- サンプルの章・講義データが作成される
```

## 🚨 **注意事項**

### 1. 既存データの保護
- ToDoアプリのデータには一切影響しません
- `study_` 接頭辞により名前空間を分離

### 2. RLSポリシー
- 学習システム専用のセキュリティポリシーが適用されます
- 既存のToDoデータとは独立したアクセス制御

### 3. 関数・トリガー
- 学習システム専用の関数が作成されます
- 既存の関数との競合は発生しません

## 🔄 **ロールバック手順**

万が一問題が発生した場合：

```sql
-- 学習システムテーブルの削除
DROP TABLE IF EXISTS study_assignment_submissions CASCADE;
DROP TABLE IF EXISTS study_assignments CASCADE;
DROP TABLE IF EXISTS study_course_enrollments CASCADE;
DROP TABLE IF EXISTS study_student_progress CASCADE;
DROP TABLE IF EXISTS study_lessons CASCADE;
DROP TABLE IF EXISTS study_chapters CASCADE;
DROP TABLE IF EXISTS study_courses CASCADE;
DROP TABLE IF EXISTS study_subjects CASCADE;
DROP TABLE IF EXISTS study_user_profiles CASCADE;
DROP TABLE IF EXISTS study_schools CASCADE;

-- 関数の削除
DROP FUNCTION IF EXISTS calculate_study_course_progress(UUID, UUID);
DROP FUNCTION IF EXISTS trigger_calculate_study_course_progress();
DROP FUNCTION IF EXISTS update_study_updated_at_column();
```

## ✅ **実行チェックリスト**

- [ ] Supabase `Suna-ToDo-db` に接続
- [ ] `database-schema-coexist.sql` 実行
- [ ] テーブル作成確認
- [ ] `initial-study-data.sql` 実行
- [ ] 初期データ投入確認
- [ ] 既存ToDoデータの無事確認
- [ ] JavaScript側のテーブル名対応
- [ ] 動作テスト実施

## 🎉 **完了後の状態**

- 既存のToDoアプリは正常動作
- 学習システム用テーブルが追加済み
- 初期データが投入済み
- セキュリティポリシー適用済み
- 段階的な機能実装準備完了 