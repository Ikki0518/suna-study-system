# ローカルストレージ → Supabase 移行計画

## 📋 **移行概要**

現在のローカルストレージベースのシステムをSupabaseを使った本格的なデータベースシステムに移行します。

### 移行の利点
- ✅ **データの永続化**: ブラウザに依存しない安全なデータ保存
- ✅ **リアルタイム同期**: 複数デバイス・ブラウザ間でのデータ同期
- ✅ **スケーラビリティ**: 大量のユーザー・データに対応
- ✅ **セキュリティ**: 認証・認可の強化
- ✅ **ファイル管理**: 動画・PDF等の適切なストレージ

## 🗓️ **移行スケジュール**

### Phase 1: 基盤構築 (1-2日)
- [x] データベーススキーマ設計
- [x] Supabaseプロジェクト作成
- [ ] 初期データ投入
- [ ] 認証システム設定

### Phase 2: バックエンド移行 (2-3日)
- [ ] Supabaseクライアント実装
- [ ] 認証機能の移行
- [ ] データ操作API実装
- [ ] ファイルアップロード機能

### Phase 3: フロントエンド更新 (2-3日)
- [ ] 既存コードのSupabase対応
- [ ] 進捗管理システム更新
- [ ] 管理者機能の強化
- [ ] エラーハンドリング追加

### Phase 4: テスト・デプロイ (1-2日)
- [ ] 機能テスト
- [ ] パフォーマンステスト
- [ ] Vercelデプロイ設定
- [ ] 本番環境テスト

## 🔄 **移行対象データ**

### 1. ユーザーデータ
```javascript
// 現在 (localStorage)
{
  email: 'user@example.com',
  name: 'ユーザー名',
  role: 'student',
  loginTime: '2024-06-21T00:00:00.000Z'
}

// 移行後 (Supabase)
user_profiles {
  id: UUID,
  email: 'user@example.com',
  name: 'ユーザー名',
  role: 'student',
  school_id: UUID,
  created_at: TIMESTAMP
}
```

### 2. スクールデータ
```javascript
// 現在 (ハードコード)
const schools = {
  'demo-school': {
    name: 'デモ学習塾',
    color: '#ec4899'
  }
}

// 移行後 (Supabase)
schools {
  id: UUID,
  name: 'デモ学習塾',
  color: '#ec4899',
  instructors: JSONB
}
```

### 3. 学習進捗データ
```javascript
// 現在 (localStorage + ハードコード)
// 進捗データは講義完了時にローカルで管理

// 移行後 (Supabase)
student_progress {
  student_id: UUID,
  lesson_id: UUID,
  completed: BOOLEAN,
  completion_date: TIMESTAMP,
  watch_time_seconds: INTEGER
}
```

## 🔧 **技術的変更点**

### 1. 認証システム
```javascript
// Before: カスタム認証
class AuthManager {
  login(userData) {
    localStorage.setItem('sunaUser', JSON.stringify(userData));
  }
}

// After: Supabase Auth
import { supabase } from './supabase-client.js';

class AuthManager {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    return { data, error };
  }
}
```

### 2. データ取得
```javascript
// Before: ハードコードされたデータ
const subjects = {
  japanese: { name: '国語', courses: [...] }
};

// After: データベースから動的取得
async function getSubjects(schoolId) {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      courses (
        *,
        chapters (
          *,
          lessons (*)
        )
      )
    `)
    .eq('school_id', schoolId);
  
  return { data, error };
}
```

### 3. 進捗管理
```javascript
// Before: ローカル管理
markLessonCompleted(lessonId) {
  // ローカルでの処理のみ
}

// After: データベース連携
async markLessonCompleted(lessonId) {
  const { data, error } = await supabase
    .from('student_progress')
    .upsert({
      student_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completion_date: new Date().toISOString()
    });
  
  return { data, error };
}
```

## 📁 **ファイル構造変更**

### 新規追加ファイル
```
js/
├── supabase-client.js      # Supabaseクライアント設定
├── api/
│   ├── auth.js            # 認証API
│   ├── schools.js         # スクール管理API
│   ├── courses.js         # コース管理API
│   ├── progress.js        # 進捗管理API
│   └── storage.js         # ファイルストレージAPI
└── utils/
    ├── database.js        # データベースユーティリティ
    └── validation.js      # バリデーション関数
```

### 変更対象ファイル
```
js/
├── main.js               # Supabase対応
├── admin.js              # データベース連携
├── student.js            # 進捗管理更新
├── login.js              # Supabase Auth対応
├── signup.js             # ユーザー登録更新
└── create-course.js      # ファイルアップロード対応
```

## 🔒 **セキュリティ強化**

### Row Level Security (RLS)
- **学生**: 自分の進捗データのみ閲覧・編集可能
- **講師**: 担当コースの受講生データ閲覧可能
- **管理者**: スクール内全データ管理可能

### ファイルアクセス制御
- **動画・PDF**: 認証済みユーザーのみアクセス可能
- **アップロード**: 講師・管理者のみ実行可能
- **プロフィール画像**: 本人のみアップロード可能

## 📊 **パフォーマンス最適化**

### 1. データベースインデックス
- 頻繁にクエリされるカラムにインデックス設定
- 複合インデックスでクエリ最適化

### 2. リアルタイム機能
```javascript
// 進捗更新のリアルタイム同期
supabase
  .channel('progress-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'student_progress'
  }, (payload) => {
    updateProgressUI(payload.new);
  })
  .subscribe();
```

### 3. キャッシュ戦略
- 静的データ（科目・コース）のローカルキャッシュ
- 進捗データのリアルタイム更新

## 🧪 **テスト戦略**

### 1. 単体テスト
- API関数のテスト
- データバリデーションテスト
- 認証フローテスト

### 2. 統合テスト
- フロントエンド・バックエンド連携テスト
- ファイルアップロード・ダウンロードテスト
- リアルタイム同期テスト

### 3. ユーザーテスト
- 学生・講師・管理者の各ロールでの動作確認
- 異なるブラウザ・デバイスでの動作確認

## 🚀 **デプロイ戦略**

### 1. 段階的移行
1. **開発環境**: Supabase開発インスタンスで機能開発
2. **ステージング**: Vercel Previewでテスト
3. **本番環境**: 段階的な機能リリース

### 2. ロールバック計画
- 既存のローカルストレージ版を一時的に維持
- 問題発生時の即座な切り戻し手順

### 3. 監視・アラート
- Supabaseダッシュボードでの監視
- エラー発生時のSlack通知設定

## 📈 **成功指標**

### 技術指標
- [ ] データベース応答時間 < 100ms
- [ ] ファイルアップロード成功率 > 99%
- [ ] 認証エラー率 < 0.1%

### ユーザー体験指標
- [ ] ページ読み込み時間 < 2秒
- [ ] 進捗同期の遅延 < 1秒
- [ ] ユーザーエラー報告 = 0件

## 🔄 **移行後の運用**

### 1. 定期メンテナンス
- データベースパフォーマンス監視
- 不要データのクリーンアップ
- セキュリティアップデート

### 2. 機能拡張計画
- 課題・テスト機能の追加
- レポート・分析機能の強化
- モバイルアプリ対応

### 3. ユーザーサポート
- 移行に関するFAQ作成
- ユーザー向けガイド作成
- サポート体制の構築 