// 学習プラットフォーム - メインアプリケーション
class StudyApp {
    constructor() {
        this.subjects = [];
        this.courses = [];
        this.lessons = [];
        this.currentView = 'subjects';
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentChapter = null;
        this.currentLesson = null;
        this.init();
    }

    async init() {
        console.log('🔍 [DIAGNOSIS] StudyApp initializing...');
        console.log('🔍 [DIAGNOSIS] Initial state - currentView:', this.currentView);
        console.log('🔍 [DIAGNOSIS] Supabase client available:', !!window.supabaseClient);
        
        await this.loadData();
        
        console.log('🔍 [DIAGNOSIS] After loadData:');
        console.log('🔍 [DIAGNOSIS] - Subjects loaded:', this.subjects?.length || 0);
        console.log('🔍 [DIAGNOSIS] - First subject:', this.subjects?.[0]);
        
        this.renderCurrentView();
        
        console.log('🔍 [DIAGNOSIS] After renderCurrentView:');
        console.log('🔍 [DIAGNOSIS] - Current view:', this.currentView);
        console.log('🔍 [DIAGNOSIS] - subjects-container exists:', !!document.getElementById('subjects-container'));
        
        this.setupEventListeners();
    }

    async loadData() {
        // Supabaseからデータを取得、失敗時はデモデータを使用
        try {
            if (window.supabaseClient) {
                await this.loadFromSupabase();
            } else {
                this.loadDemoData();
            }
        } catch (error) {
            console.log('Supabase loading failed, using demo data:', error);
            this.loadDemoData();
        }
    }

    async loadFromSupabase() {
        // 実際のSupabaseデータ取得処理
        const { data: subjects, error } = await window.supabaseClient
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
            .eq('is_active', true)
            .order('sort_order');

        if (error) throw error;
        this.subjects = subjects || [];
    }

    loadDemoData() {
        // デモ用学習データ
        this.subjects = [
            {
                id: 'glucon-relations',
                name: 'グルコン関係',
                description: 'グルコンアーカイブの基本操作と応用',
                color: '#3b82f6',
                icon: '📊',
                study_courses: [
                    {
                        id: 'main-lesson',
                        title: 'メインレッスン',
                        description: 'グルコンアーカイブの基本操作を学習',
                        image: '/api/placeholder/400/200',
                        study_chapters: [
                            {
                                id: 'chapter-1',
                                title: 'グルコンアーカイブの格納方法について',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'lesson-1',
                                        title: 'アーカイブ格納方法の解説',
                                        description: 'グルコンアーカイブ全体の流れ',
                                        video_url: '/videos/archive-explanation.mp4',
                                        duration: '2 min',
                                        views: 17
                                    }
                                ]
                            },
                            {
                                id: 'chapter-2',
                                title: 'AI副業1on1 りえさんへのスプレッドシート共有方法',
                                sort_order: 2,
                                study_lessons: [
                                    {
                                        id: 'lesson-2',
                                        title: 'スプレッドシート共有の手順',
                                        description: 'AI副業での効率的な情報共有方法',
                                        video_url: '/videos/spreadsheet-sharing.mp4',
                                        duration: '3 min',
                                        views: 25
                                    }
                                ]
                            },
                            {
                                id: 'chapter-3',
                                title: 'AI副業1on1 ゆきえさん（yukieさん）のエラー共有',
                                sort_order: 3,
                                study_lessons: [
                                    {
                                        id: 'lesson-3',
                                        title: 'エラー解決とトラブルシューティング',
                                        description: 'よくあるエラーとその対処法',
                                        video_url: '/videos/error-troubleshooting.mp4',
                                        duration: '4 min',
                                        views: 32
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'business-skills',
                name: 'ビジネススキル',
                description: '実践的なビジネススキルを習得',
                color: '#10b981',
                icon: '💼',
                study_courses: [
                    {
                        id: 'business-basics',
                        title: 'ビジネス基礎',
                        description: 'ビジネスの基本スキルを学習',
                        image: '/api/placeholder/400/200',
                        study_chapters: [
                            {
                                id: 'business-chapter-1',
                                title: '請求書提出方法',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'business-lesson-1',
                                        title: '効率的な請求書作成',
                                        description: '請求書の正しい作成方法',
                                        video_url: '/videos/invoice-creation.mp4',
                                        duration: '5 min',
                                        views: 45
                                    }
                                ]
                            },
                            {
                                id: 'business-chapter-2',
                                title: 'ビジョン会議',
                                sort_order: 2,
                                study_lessons: [
                                    {
                                        id: 'business-lesson-2',
                                        title: '効果的な会議運営',
                                        description: 'ビジョン共有のための会議術',
                                        video_url: '/videos/vision-meeting.mp4',
                                        duration: '6 min',
                                        views: 38
                                    }
                                ]
                            },
                            {
                                id: 'business-chapter-3',
                                title: '徹夜明けのパフォーマンス最大化講座',
                                sort_order: 3,
                                study_lessons: [
                                    {
                                        id: 'business-lesson-3',
                                        title: 'パフォーマンス向上テクニック',
                                        description: '疲労時でも最高のパフォーマンスを発揮する方法',
                                        video_url: '/videos/performance-optimization.mp4',
                                        duration: '7 min',
                                        views: 52
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'subjects':
                this.renderSubjects();
                break;
            case 'courses':
                this.renderCourses();
                break;
            case 'chapters':
                this.renderChapters();
                break;
            case 'lesson':
                this.renderLesson();
                break;
        }
        this.updateBreadcrumb();
    }

    renderSubjects() {
        console.log('🔍 [DIAGNOSIS] renderSubjects called');
        const container = document.getElementById('subjects-container');
        console.log('🔍 [DIAGNOSIS] - Container found:', !!container);
        console.log('🔍 [DIAGNOSIS] - Subjects to render:', this.subjects?.length || 0);
        
        if (!container) {
            console.log('🔍 [DIAGNOSIS] - Container not found, aborting render');
            return;
        }

        const subjectsHTML = this.subjects.map(subject => {
            console.log('🔍 [DIAGNOSIS] - Rendering subject:', subject.name);
            return `
                <div class="subject-card" onclick="app.selectSubject('${subject.id}')" style="background: ${subject.color}">
                    <div class="subject-icon">${subject.icon}</div>
                    <h3 class="subject-title">${subject.name}</h3>
                    <p class="subject-description">${subject.description}</p>
                    <div class="subject-stats">
                        <span class="course-count">${subject.study_courses?.length || 0} コース</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="subjects-grid">
                ${subjectsHTML}
            </div>
        `;

        console.log('🔍 [DIAGNOSIS] - HTML rendered, length:', container.innerHTML.length);

        // 他の画面を非表示
        this.hideOtherViews(['subjects-container']);
    }

    renderCourses() {
        const container = document.getElementById('subjects-container');
        if (!container || !this.currentSubject) return;

        const courses = this.currentSubject.study_courses || [];
        const coursesHTML = courses.map(course => `
            <div class="course-card" onclick="app.selectCourse('${course.id}')">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}" onerror="this.src='/api/placeholder/400/200'">
                </div>
                <div class="course-content">
                    <h4 class="course-title">${course.title}</h4>
                    <p class="course-description">${course.description}</p>
                    <div class="course-stats">
                        <span class="chapter-count">${course.study_chapters?.length || 0} 章</span>
                    </div>
                    <button class="course-btn">受講する</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="courses-grid">
                ${coursesHTML}
            </div>
        `;
    }

    renderChapters() {
        const container = document.getElementById('subjects-container');
        if (!container || !this.currentCourse) return;

        const chapters = this.currentCourse.study_chapters || [];
        const chaptersHTML = chapters.map(chapter => `
            <div class="chapter-item" onclick="app.selectChapter('${chapter.id}')">
                <div class="chapter-content">
                    <h4 class="chapter-title">${chapter.title}</h4>
                    <div class="chapter-lessons">
                        ${chapter.study_lessons?.length || 0} レッスン
                    </div>
                </div>
                <button class="chapter-btn">受講する</button>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="chapter-header">
                <h2>${this.currentCourse.title}</h2>
                <p>メインレッスン</p>
            </div>
            <div class="chapters-list">
                ${chaptersHTML}
            </div>
        `;
    }

    renderLesson() {
        const container = document.getElementById('subjects-container');
        if (!container || !this.currentLesson) return;

        container.innerHTML = `
            <div class="lesson-container">
                <div class="lesson-header">
                    <h2>${this.currentLesson.title}</h2>
                </div>
                <div class="lesson-content">
                    <div class="video-container">
                        <video controls poster="/api/placeholder/800/450">
                            <source src="${this.currentLesson.video_url}" type="video/mp4">
                            お使いのブラウザは動画再生に対応していません。
                        </video>
                        <div class="video-info">
                            <div class="video-title">${this.currentLesson.title}</div>
                            <div class="video-stats">
                                <span class="duration">⏱️ ${this.currentLesson.duration}</span>
                                <span class="views">👁️ ${this.currentLesson.views} views</span>
                            </div>
                        </div>
                    </div>
                    <div class="lesson-description">
                        <h3>アーカイブ格納方法の解説</h3>
                        <p>${this.currentLesson.description}</p>
                    </div>
                </div>
            </div>
        `;
    }

    selectSubject(subjectId) {
        this.currentSubject = this.subjects.find(s => s.id === subjectId);
        this.currentView = 'courses';
        this.renderCurrentView();
    }

    selectCourse(courseId) {
        if (!this.currentSubject) return;
        this.currentCourse = this.currentSubject.study_courses.find(c => c.id === courseId);
        this.currentView = 'chapters';
        this.renderCurrentView();
    }

    selectChapter(chapterId) {
        if (!this.currentCourse) return;
        this.currentChapter = this.currentCourse.study_chapters.find(c => c.id === chapterId);
        if (this.currentChapter && this.currentChapter.study_lessons?.length > 0) {
            this.currentLesson = this.currentChapter.study_lessons[0];
            this.currentView = 'lesson';
            this.renderCurrentView();
        }
    }

    goHome() {
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentChapter = null;
        this.currentLesson = null;
        this.currentView = 'subjects';
        this.renderCurrentView();
    }

    goBack() {
        if (this.currentView === 'lesson') {
            this.currentLesson = null;
            this.currentView = 'chapters';
        } else if (this.currentView === 'chapters') {
            this.currentChapter = null;
            this.currentView = 'courses';
        } else if (this.currentView === 'courses') {
            this.currentCourse = null;
            this.currentView = 'subjects';
        }
        this.renderCurrentView();
    }

    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb-content');
        if (!breadcrumb) return;

        let breadcrumbHTML = '<a href="#" onclick="app.goHome()" class="breadcrumb-item">🏠 Home</a>';

        if (this.currentSubject) {
            breadcrumbHTML += ` <span class="breadcrumb-separator">›</span> <span class="breadcrumb-current">${this.currentSubject.name}</span>`;
        }

        if (this.currentCourse) {
            breadcrumbHTML += ` <span class="breadcrumb-separator">›</span> <span class="breadcrumb-current">${this.currentCourse.title}</span>`;
        }

        if (this.currentLesson) {
            breadcrumbHTML += ` <span class="breadcrumb-separator">›</span> <span class="breadcrumb-current">${this.currentLesson.title}</span>`;
        }

        breadcrumb.innerHTML = breadcrumbHTML;
    }

    hideOtherViews(except = []) {
        const views = ['course-view', 'lesson-view'];
        views.forEach(viewId => {
            if (!except.includes(viewId)) {
                const view = document.getElementById(viewId);
                if (view) view.style.display = 'none';
            }
        });
    }

    setupEventListeners() {
        // ESCキーで戻る
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentView !== 'subjects') {
                this.goBack();
            }
        });
    }
}

// グローバル変数とイベントリスナー
window.StudyApp = StudyApp;
let app = null;

// スクール管理システム
function loadSchools() {
    const stored = localStorage.getItem('schools');
    if (stored) {
        return JSON.parse(stored);
    }
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

// AuthManager（認証管理）
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

// 初期化
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎓 Initializing Study Platform...');
    
    // AuthManager初期化
    if (!window.authManager) {
        window.authManager = new AuthManager();
        console.log('[INIT] AuthManager created');
    }
    
    // StudyApp初期化
    if (window.StudyApp) {
        app = new StudyApp();
        window.app = app;
        console.log('[INIT] StudyApp created');
    }
});

window.AuthManager = AuthManager;