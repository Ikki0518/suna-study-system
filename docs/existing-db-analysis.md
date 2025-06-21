# 既存データベース統合分析

## 📊 **現状確認**

### 既存データベース: `Suna-ToDo-db`
- 他のToDoアプリケーションと共有
- 既存のテーブル構造要確認
- データの重要度を評価して統合方針決定

## 🔄 **統合戦略**

### Option 1: 共存戦略（推奨）
既存のToDoデータを保持しつつ、学習システム用テーブルを追加

**メリット:**
- 既存データを保護
- 段階的な移行が可能
- リスクが低い

**実装方針:**
```sql
-- 既存テーブルはそのまま維持
-- 学習システム用テーブルを新規追加
-- テーブル名に接頭辞を付けて区別
-- 例: study_schools, study_courses, study_lessons
```

### Option 2: データ整理戦略
不要なToDoデータを削除して学習システム専用化

**メリット:**
- データベースがクリーン
- パフォーマンス向上
- 管理が簡単

**実装方針:**
```sql
-- 重要でないToDoデータを削除
-- 学習システムテーブルを追加
-- 統一された命名規則
```

## 📋 **次のステップ**

### 1. 既存データベース構造の確認
```sql
-- テーブル一覧取得
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 各テーブルの構造確認
\d+ table_name
```

### 2. データ重要度の評価
- ToDoアプリのデータ量
- 最終更新日
- 他アプリケーションでの使用状況

### 3. 統合方針の決定
ユーザーの意向に基づいて最適な方針を選択

## 🔧 **統合用SQLスクリプト**

### 共存戦略用スクリプト
```sql
-- 学習システム用テーブルを既存DBに追加
-- テーブル名に study_ 接頭辞を使用

CREATE TABLE study_schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    -- ... 他のフィールド
);

-- 以下、全ての学習システムテーブルを study_ 接頭辞付きで作成
```

### データ整理戦略用スクリプト
```sql
-- 既存ToDoテーブルの削除（必要に応じて）
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS todo_categories;

-- 学習システムテーブルの作成
-- 元のdatabase-schema.sqlをそのまま使用
``` 