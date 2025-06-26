// 基底アプリケーションクラス（Supabase経由でデータ取得・画面遷移管理）
class StudyApp {
    constructor() {
        this.subjects = [];
        this.courses = [];
        this.lessons = [];
        this.currentView = 'subjects';
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentLesson = null;
        this.init();
    }

    async init() {
        console.log('🔍 [StudyApp] Initializing...');
        // subjects一覧をSupabaseから取得
        await this.loadSubjects();
        this.renderSubjects();
    }

    async loadSubjects() {
        console.log('🔍 [StudyApp] Loading subjects...');
        try {
            if (window.supabaseAuth && window.authManager) {
                const currentSchool = window.authManager.getCurrentSchool();
                console.log('🔍 [StudyApp] Current school:', currentSchool);
                
                // Supabaseからsubjectsを取得
                this.subjects = await this.getSubjectsFromSupabase(currentSchool.id);
                console.log('🔍 [StudyApp] Loaded subjects:', this.subjects);
            } else {
                console.log('🔍 [StudyApp] Using fallback subjects (demo mode)');
                this.subjects = this.getFallbackSubjects();
            }
        } catch (error) {
            console.error('🔍 [StudyApp] Error loading subjects:', error);
            this.subjects = this.getFallbackSubjects();
        }
    }

    async getSubjectsFromSupabase(schoolId) {
        // Supabaseから科目データを取得
        if (!window.supabaseClient) {
            throw new Error('Supabase client not available');
        }

        const { data, error } = await window.supabaseClient
            .from('study_subjects')
            .select(`
                *,
                study_courses (
                    *,
                    study_chapters (
                        *,
                        study_lessons (*)
                    )
                )
            `)
            .eq('school_id', schoolId)
            .eq('is_active', true)
            .order('sort_order');

        if (error) {
            throw error;
        }

        return data || [];
    }

    getFallbackSubjects() {
        // フォールバック用のデモデータ
        return [
            {
                id: 'demo-math',
                name: '数学',
                description: '基礎から応用まで幅広く学習',
                color: '#3b82f6',
                study_courses: [
                    {
                        id: 'demo-math-basic',
                        title: '基礎数学',
                        description: '数学の基礎を学びます',
                        targetGrades: ['高校'],
                        study_chapters: [
                            {
                                id: 'demo-chapter-1',
                                title: '第1章: 数と式',
                                study_lessons: [
                                    {
                                        id: 'demo-lesson-1',
                                        title: '整数と有理数',
                                        description: '整数と有理数の基本概念'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'demo-english',
                name: '英語',
                description: '実践的な英語力を身につける',
                color: '#10b981',
                study_courses: [
                    {
                        id: 'demo-english-basic',
                        title: '基礎英語',
                        description: '英語の基礎を学びます',
                        targetGrades: ['高校'],
                        study_chapters: [
                            {
                                id: 'demo-chapter-2',
                                title: '第1章: 基本文法',
                                study_lessons: [
                                    {
                                        id: 'demo-lesson-2',
                                        title: '現在形と過去形',
                                        description: '基本的な時制の使い方'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }

    renderSubjects() {
        console.log('🔍 [StudyApp] Rendering subjects...');
        const container = document.getElementById('subjects-container');
        if (!container) {
            console.error('🔍 [StudyApp] subjects-container not found');
            return;
        }

        if (!this.subjects || this.subjects.length === 0) {
            container.innerHTML = `
                <div class="no-subjects">
                    <h3>科目が見つかりません</h3>
                    <p>管理者によって科目が追加されるまでお待ちください。</p>
                </div>
            `;
            return;
        }

        // 元のUIスタイルに合わせた科目カード生成
        const subjectsHTML = this.subjects.map(subject => `
            <div class="subject-card" onclick="app.showSubject('${subject.id}')" style="background-color: ${subject.color || '#6b7280'}">
                <div class="subject-icon">📚</div>
                <h3 class="subject-title">${subject.name}</h3>
                <p class="subject-description">${subject.description || ''}</p>
                <div class="subject-stats">
                    <span class="course-count">${(subject.study_courses || []).length} コース</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = subjectsHTML;
    }

    showSubject(subjectId) {
        console.log('🔍 [StudyApp] Showing subject:', subjectId);
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) {
            console.error('🔍 [StudyApp] Subject not found:', subjectId);
            return;
        }

        this.currentSubject = subject;
        this.renderCourses(subject);
    }

    renderCourses(subject) {
        console.log('🔍 [StudyApp] Rendering courses for subject:', subject.name);
        
        // ホーム画面を非表示にしてコース画面を表示
        const homeView = document.getElementById('home-view');
        const courseView = document.getElementById('course-view');
        
        if (homeView) homeView.style.display = 'none';
        if (courseView) {
            courseView.style.display = 'block';
            
            const courses = subject.study_courses || [];
            const coursesHTML = courses.map(course => `
                <div class="course-card" onclick="app.showCourse('${course.id}')">
                    <div class="course-icon">📖</div>
                    <h4 class="course-title">${course.title}</h4>
                    <p class="course-description">${course.description || ''}</p>
                    <div class="course-stats">
                        <span class="chapter-count">${(course.study_chapters || []).length} 章</span>
                    </div>
                </div>
            `).join('');

            courseView.innerHTML = `
                <div class="course-header">
                    <div class="breadcrumb">
                        <button onclick="app.showHome()" class="breadcrumb-btn">ホーム</button>
                        <span class="breadcrumb-separator">></span>
                        <span class="breadcrumb-current">${subject.name}</span>
                    </div>
                    <h2 class="course-view-title">${subject.name}</h2>
                </div>
                <div class="courses-container">
                    ${coursesHTML}
                </div>
            `;
        }
    }

    showHome() {
        console.log('🔍 [StudyApp] Showing home');
        this.currentSubject = null;
        this.currentCourse = null;
        
        // ホーム画面を表示し、他の画面を非表示
        const homeView = document.getElementById('home-view');
        const courseView = document.getElementById('course-view');
        const lessonView = document.getElementById('lesson-view');
        
        if (homeView) homeView.style.display = 'block';
        if (courseView) courseView.style.display = 'none';
        if (lessonView) lessonView.style.display = 'none';
        
        this.renderSubjects();
    }

    showCourse(courseId) {
        console.log('🔍 [StudyApp] Showing course:', courseId);
        // コース詳細表示の実装
    }

    // 画面遷移やデータ取得のメソッドは必要に応じて追加
}
window.StudyApp = StudyApp;
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

// レッスンコンテンツ（デモ用）
const lessonContents = {
    'demo-lesson-1': {
        title: '整数と有理数',
        videoUrl: 'videos/math-integers.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、整数と有理数の基本概念を学習します。</p>
            </div>
            <div class="lesson-content">
                <h4>整数とは</h4>
                <p>整数は、正の整数、負の整数、および0を含む数の集合です。</p>
                <h4>有理数とは</h4>
                <p>有理数は、二つの整数の比として表すことができる数です。</p>
            </div>
        `
    },
    'demo-lesson-2': {
        title: '現在形と過去形',
        videoUrl: 'videos/english-tenses.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、英語の基本的な時制について学習します。</p>
            </div>
            <div class="lesson-content">
                <h4>現在形</h4>
                <p>現在の状態や習慣を表す時制です。</p>
                <h4>過去形</h4>
                <p>過去に起こった出来事を表す時制です。</p>
            </div>
        `
    }
};
window.addEventListener('DOMContentLoaded', () => {
    if (window.StudyApp) {
        window.app = new StudyApp();
        console.log('[STUDENT INIT] window.app created:', !!window.app);
    }
    // AuthManagerのグローバル生成も必要ならここで
    if (typeof AuthManager === 'function' && !window.authManager) {
        window.authManager = new AuthManager();
        console.log('[STUDENT INIT] window.authManager created:', !!window.authManager);
    }
});
// 最小限のAuthManagerクラス（ダミー実装、必要に応じて拡張）
class AuthManager {
    constructor() {
        this.isLoggedIn = true;
        this.currentUser = { name: "ゲスト", email: "guest@example.com", grade: "高校1年" };
        this.currentSchool = { id: "production-school", name: "あなたの学習塾" };
    }
    requireStudentAuth() { return true; }
    getCurrentSchool() { return this.currentSchool; }
    logout() { alert("ログアウト（ダミー）"); }
    showMessage(msg, type) { alert(`[${type}] ${msg}`); }
    changeSchool(schoolId) { this.currentSchool = { id: schoolId, name: schoolId }; }
}
window.AuthManager = AuthManager;