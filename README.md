# 🌊 Suna Study System

学習動画とテキストを統合管理できるWeb学習システムです。コース別に教材を整理し、動画とテキストをセットで効率的に学習できます。

## ✨ 特徴

- **📚 コース別学習**: 複数のコースを体系的に管理
- **🎥 動画学習**: 講義動画をブラウザで直接再生
- **📖 テキスト教材**: 動画と連動した詳細な解説テキスト
- **📱 レスポンシブ対応**: PC・タブレット・スマートフォンに対応
- **🎨 モダンなUI**: 直感的で使いやすいインターフェース

## 🚀 セットアップ

### 1. ファイルの構成

```
Suna Study System/
├── index.html              # メインHTMLファイル
├── styles/
│   └── main.css            # スタイルシート
├── js/
│   └── main.js             # メインJavaScript
├── videos/                 # 動画ファイル格納ディレクトリ
│   ├── README.md          # 動画配置の説明
│   ├── html-basics.mp4    # HTML基礎動画（要配置）
│   ├── css-basics.mp4     # CSS基礎動画（要配置）
│   └── ...                # その他の動画ファイル
└── README.md              # このファイル
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