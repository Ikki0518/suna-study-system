# 🌊 Suna Study System

**マルチテナント対応の塾向けeラーニングプラットフォーム**

スキルプラス風の学習管理システムで、複数の塾が独立してコース・講義を管理できる本格的な学習プラットフォームです。

## ✨ 特徴

### 🏫 **マルチテナント機能**
- **複数塾対応**: 各塾が独立したデータ空間で運用
- **スクール切り替え**: ユーザーは複数塾に所属可能
- **権限管理**: 管理者・講師・学生の3段階権限

### 📚 **学習管理機能**
- **4階層構造**: 科目→コース→章→講義の体系的管理
- **28コース**: 国語・数学・英語・理科・社会の充実したコンテンツ
- **進捗管理**: 講義完了・コース進捗の自動追跡
- **講義ナビゲーション**: 次の講義への自動遷移

### 🎓 **教育機能**
- **動画学習**: 講義動画とテキストの統合表示
- **講座作成**: 講師が独自コンテンツを作成・投稿
- **ファイル管理**: 動画・PDF教材のアップロード機能
- **学習履歴**: 詳細な学習データの記録・分析

### 🔐 **認証・セキュリティ**
- **Supabase Auth**: 安全なユーザー認証システム
- **Row Level Security**: データアクセス制御
- **ロールベース権限**: 適切なアクセス権限管理

## 🏗️ **アーキテクチャ**

- **フロントエンド**: Vanilla JavaScript + HTML5/CSS3
- **バックエンド**: Supabase (PostgreSQL + Auth + Storage)
- **デプロイ**: Vercel
- **認証**: Supabase Auth
- **ファイルストレージ**: Supabase Storage
- **データベース**: PostgreSQL (10テーブル構成)

## 🚀 セットアップ

### 🔧 **開発環境セットアップ**

#### 1. リポジトリクローン
```bash
git clone https://github.com/Ikki0518/suna-study-system.git
cd suna-study-system
```

#### 2. ローカルサーバー起動
```bash
# Python 3を使用
python3 -m http.server 8000

# Node.jsを使用
npx serve .

# VS Code Live Server拡張機能も利用可能
```

### 🗄️ **Supabaseセットアップ**

#### 1. Supabaseプロジェクト作成
1. [supabase.com](https://supabase.com) でプロジェクト作成
2. データベーススキーマ実行: `database-schema.sql`
3. 認証・ストレージ設定

詳細は [`docs/supabase-setup.md`](docs/supabase-setup.md) を参照

#### 2. 環境変数設定
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 📁 **ファイル構成**

```
Suna Study System/
├── index.html                    # メインページ
├── login.html                    # ログインページ  
├── signup.html                   # 新規登録ページ
├── pages/                        # 各機能ページ
│   ├── admin.html               # 管理者ダッシュボード
│   ├── student.html             # 学生ダッシュボード
│   └── create-course.html       # 講座作成ページ
├── js/                          # JavaScript
│   ├── main.js                  # メイン機能
│   ├── admin.js                 # 管理者機能
│   ├── student.js               # 学生機能
│   ├── login.js                 # ログイン機能
│   ├── signup.js                # 新規登録機能
│   └── create-course.js         # 講座作成機能
├── styles/                      # CSS
│   ├── main.css                 # メインスタイル
│   ├── admin.css                # 管理者スタイル
│   ├── login.css                # ログインスタイル
│   └── create-course.css        # 講座作成スタイル
├── videos/                      # 動画ファイル
├── docs/                        # ドキュメント
│   ├── supabase-setup.md        # Supabaseセットアップ
│   └── migration-plan.md        # 移行計画
├── database-schema.sql          # データベーススキーマ
└── README.md                    # このファイル
```

### 2. 動画ファイルの準備

`videos/` ディレクトリに以下の動画ファイルを配置してください：

- `html-basics.mp4`
- `css-basics.mp4`
- `javascript-basics.mp4`
- `react-intro.mp4`
- `react-components.mp4`
- `python-intro.mp4`
- `python-datastructures.mp4`

### 3. 起動方法

1. **ローカルサーバーを使用（推奨）**
   ```bash
   # Python 3がインストールされている場合
   python3 -m http.server 8080
   
   # Node.jsがインストールされている場合
   npx serve .
   
   # VS Codeを使用している場合
   Live Server拡張機能を使用
   ```

2. **直接ブラウザで開く**
   ```
   index.htmlをブラウザにドラッグ&ドロップ
   ```

## 📋 使用方法

### 基本的な操作

1. **コース選択**: トップページからコースを選択
2. **講義選択**: コース内の講義一覧から学習したい講義を選択
3. **学習**: 動画とテキストを並べて効率的に学習
4. **ナビゲーション**: 戻るボタンやESCキーで前の画面に戻る

### キーボードショートカット

- `Escape`: 前の画面に戻る

## 🔧 カスタマイズ

### 新しいコースの追加

`js/main.js` の `courses` 配列に新しいコースを追加：

```javascript
const courses = [
    // 既存のコース...
    {
        id: 'new-course',
        title: '新しいコース',
        description: 'コースの説明',
        lessons: [
            {
                id: 'lesson-1',
                title: '講義1',
                videoUrl: 'videos/lesson-1.mp4',
                textContent: `
                    <h4>講義の内容</h4>
                    <p>講義の説明...</p>
                `
            }
        ]
    }
];
```

### 新しい講義の追加

既存のコースに新しい講義を追加：

```javascript
// 既存のコースのlessons配列に追加
lessons: [
    // 既存の講義...
    {
        id: 'new-lesson',
        title: '新しい講義',
        videoUrl: 'videos/new-lesson.mp4',
        textContent: `講義内容のHTML`
    }
]
```

### スタイルのカスタマイズ

`styles/main.css` を編集して、色やレイアウトを変更できます：

- **メインカラー**: `.course-card` のグラデーション
- **フォント**: `body` の `font-family`
- **レイアウト**: グリッドやフレックスボックスの設定

## 🎯 現在利用可能なコース

### 1. Web開発基礎コース
- HTML基礎
- CSS基礎
- JavaScript基礎

### 2. React開発コース
- React入門
- コンポーネントの作成

### 3. Python基礎コース
- Python入門
- データ構造

## 🔮 今後の拡張予定

- [ ] 学習進捗の保存機能
- [ ] ユーザー認証システム
- [ ] コメント・メモ機能
- [ ] 検索機能
- [ ] ダークモード対応
- [ ] 動画の速度調整機能
- [ ] 字幕表示機能

## 🛠️ 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなスタイリング（Grid、Flexbox、アニメーション）
- **Vanilla JavaScript**: フレームワークを使わないシンプルな実装
- **MP4 Video**: 動画再生機能

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献方法

1. このリポジトリをフォーク
2. 新しい機能ブランチを作成 (`git checkout -b feature/new-feature`)
3. 変更をコミット (`git commit -am 'Add new feature'`)
4. ブランチにプッシュ (`git push origin feature/new-feature`)
5. プルリクエストを作成

## 📞 サポート

質問や問題がある場合は、GitHubのIssueを作成してください。

---

**作成者**: Suna Study System Development Team  
**バージョン**: 1.0.0  
**最終更新**: 2024年6月