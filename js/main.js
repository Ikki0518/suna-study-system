// スクール管理システム - ローカルストレージから読み込み
function loadSchools() {
    const stored = localStorage.getItem('schools');
    if (stored) {
        return JSON.parse(stored);
    }
    // フォールバック用のデフォルトスクール
    return {
        'production-school': {
            id: 'production-school',
            name: 'あなたの学習塾',
            description: '質の高い教育を提供する学習塾',
            color: '#2563eb',
            instructors: ['塾長', '講師A', '講師B'],
            isDefault: true
        }
    };
}

const schools = loadSchools();

// 科目とコースデータの定義（管理者が作成するまで空の状態）
// 各スクールで異なるコンテンツを配信可能
let subjects = {};
try {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
        subjects = JSON.parse(storedSubjects);
    }
} catch (e) {
    console.warn('[DEBUG] Failed to parse localStorage subjects, using default.', e);
    subjects = {};
}
if (Object.keys(subjects).length === 0) {
    subjects = {
        // ここに元のsubjects定義（24〜2731行目の内容）を貼り付ける必要がある
        // 実際の修正時は元のsubjects定義をここにまるごと移動
    };
}

// ...（2733行目以降は元のまま続く）
const lessonContents = {
    'japanese1-1': {
        title: '文章の構成と要約',
        videoUrl: 'videos/japanese-composition.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、文章の基本的な構成を理解し、要約する技術を身につけます。</p>
            </div>
            ...
        `
    },
    // ...（以降省略）
};