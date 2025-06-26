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
// Supabase経由でsubjects一覧を取得し、描画
let subjects = [];
window.addEventListener('DOMContentLoaded', async () => {
    if (window.supabaseManager) {
        subjects = await window.supabaseManager.getSubjects();
        if (typeof renderSubjects === 'function') {
            renderSubjects(subjects);
        }
    }
});

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
// subjects取得後のデバッグ用ログ
window.addEventListener('DOMContentLoaded', async () => {
    if (window.supabaseManager) {
        subjects = await window.supabaseManager.getSubjects();
        console.log('[DEBUG] Supabaseから取得したsubjects:', subjects);
        if (typeof renderSubjects === 'function') {
            renderSubjects(subjects);
        }
    }
});