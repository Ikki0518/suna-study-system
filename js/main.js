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
        // 要件に合わせた学習データ（科目→コース→章→講座の階層構造）
        this.subjects = [
            {
                id: 'japanese',
                name: '国語',
                description: '読解力・文章力・語彙力を総合的に向上',
                color: '#dc2626',
                icon: '📚',
                study_courses: [
                    {
                        id: 'modern-japanese',
                        title: '現代文',
                        description: '現代文の読解力と表現力を身につける',
                        image: '/api/placeholder/400/200',
                        thumbnail: '📖',
                        study_chapters: [
                            {
                                id: 'narrative-text',
                                title: '物語文',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'narrative-lesson-1',
                                        title: '第一問：登場人物の心情理解',
                                        description: '物語文における登場人物の心情を読み取る技法',
                                        video_url: '/videos/narrative-1.mp4',
                                        pdf_url: '/pdfs/narrative-1.pdf',
                                        text_content: '物語文では、登場人物の心情を正確に読み取ることが重要です...',
                                        duration: '15 min',
                                        views: 124
                                    },
                                    {
                                        id: 'narrative-lesson-2',
                                        title: '第二問：場面設定の理解',
                                        description: '物語の場面設定と雰囲気の読み取り方',
                                        video_url: '/videos/narrative-2.mp4',
                                        pdf_url: '/pdfs/narrative-2.pdf',
                                        text_content: '場面設定は物語の理解において基礎となる要素です...',
                                        duration: '12 min',
                                        views: 98
                                    }
                                ]
                            },
                            {
                                id: 'kanji-study',
                                title: '漢字',
                                sort_order: 2,
                                study_lessons: [
                                    {
                                        id: 'kanji-lesson-1',
                                        title: '第一問：常用漢字の読み方',
                                        description: '高校レベルの常用漢字の正しい読み方',
                                        video_url: '/videos/kanji-1.mp4',
                                        pdf_url: '/pdfs/kanji-1.pdf',
                                        text_content: '常用漢字は日常生活で使用頻度の高い漢字です...',
                                        duration: '10 min',
                                        views: 156
                                    }
                                ]
                            },
                            {
                                id: 'composition',
                                title: '作文',
                                sort_order: 3,
                                study_lessons: [
                                    {
                                        id: 'composition-lesson-1',
                                        title: '第一問：論理的な文章構成',
                                        description: '説得力のある文章の書き方',
                                        video_url: '/videos/composition-1.mp4',
                                        pdf_url: '/pdfs/composition-1.pdf',
                                        text_content: '論理的な文章を書くためには、明確な構成が必要です...',
                                        duration: '20 min',
                                        views: 89
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'classical-japanese',
                        title: '古文',
                        description: '古典文学の読解と文法を学習',
                        image: '/api/placeholder/400/200',
                        thumbnail: '🏛️',
                        study_chapters: [
                            {
                                id: 'classical-grammar',
                                title: '古典文法',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'grammar-lesson-1',
                                        title: '第一問：助動詞の活用',
                                        description: '古文における助動詞の正しい活用形',
                                        video_url: '/videos/classical-grammar-1.mp4',
                                        pdf_url: '/pdfs/classical-grammar-1.pdf',
                                        text_content: '古文の助動詞は現代語とは異なる活用をします...',
                                        duration: '18 min',
                                        views: 67
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'chinese-classics',
                        title: '漢文',
                        description: '漢文の読み方と古典中国文学',
                        image: '/api/placeholder/400/200',
                        thumbnail: '🏮',
                        study_chapters: [
                            {
                                id: 'chinese-reading',
                                title: '漢文読解',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'chinese-lesson-1',
                                        title: '第一問：返り点の読み方',
                                        description: '漢文における返り点の正しい読み方',
                                        video_url: '/videos/chinese-1.mp4',
                                        pdf_url: '/pdfs/chinese-1.pdf',
                                        text_content: '返り点は漢文を日本語として読むための重要な記号です...',
                                        duration: '14 min',
                                        views: 45
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'mathematics',
                name: '数学',
                description: '論理的思考力と問題解決能力を育成',
                color: '#2563eb',
                icon: '🧮',
                study_courses: [
                    {
                        id: 'math-1a',
                        title: '数学I・A',
                        description: '高校数学の基礎となる数学I・Aを学習',
                        image: '/api/placeholder/400/200',
                        thumbnail: '📐',
                        study_chapters: [
                            {
                                id: 'quadratic-functions',
                                title: '二次関数',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'quadratic-lesson-1',
                                        title: '第一問：二次関数のグラフ',
                                        description: '二次関数のグラフの性質と描き方',
                                        video_url: '/videos/quadratic-1.mp4',
                                        pdf_url: '/pdfs/quadratic-1.pdf',
                                        text_content: '二次関数 y = ax² + bx + c のグラフは放物線になります...',
                                        duration: '25 min',
                                        views: 203
                                    }
                                ]
                            },
                            {
                                id: 'probability',
                                title: '確率',
                                sort_order: 2,
                                study_lessons: [
                                    {
                                        id: 'probability-lesson-1',
                                        title: '第一問：順列と組み合わせ',
                                        description: '順列と組み合わせの基本概念と計算方法',
                                        video_url: '/videos/probability-1.mp4',
                                        pdf_url: '/pdfs/probability-1.pdf',
                                        text_content: '順列は順序を考慮した並べ方、組み合わせは順序を考慮しない選び方です...',
                                        duration: '22 min',
                                        views: 178
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'math-2b',
                        title: '数学II・B',
                        description: '発展的な数学概念を学習',
                        image: '/api/placeholder/400/200',
                        thumbnail: '📊',
                        study_chapters: [
                            {
                                id: 'trigonometry',
                                title: '三角関数',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'trig-lesson-1',
                                        title: '第一問：三角関数の基本',
                                        description: 'sin、cos、tanの基本的な性質',
                                        video_url: '/videos/trigonometry-1.mp4',
                                        pdf_url: '/pdfs/trigonometry-1.pdf',
                                        text_content: '三角関数は角度と比の関係を表す重要な関数です...',
                                        duration: '28 min',
                                        views: 145
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english',
                name: '英語',
                description: '英語コミュニケーション、論理・表現を総合学習',
                color: '#059669',
                icon: '🌍',
                study_courses: [
                    {
                        id: 'english-communication',
                        title: '英語コミュニケーション',
                        description: '実践的な英語コミュニケーション能力を育成',
                        image: '/api/placeholder/400/200',
                        thumbnail: '💬',
                        study_chapters: [
                            {
                                id: 'reading-comprehension',
                                title: '長文読解',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'reading-lesson-1',
                                        title: '第一問：スキミング技法',
                                        description: '英語長文を効率的に読むスキミング技法',
                                        video_url: '/videos/reading-1.mp4',
                                        pdf_url: '/pdfs/reading-1.pdf',
                                        text_content: 'スキミングは文章全体の概要を素早く把握する読解技法です...',
                                        duration: '16 min',
                                        views: 234
                                    }
                                ]
                            },
                            {
                                id: 'grammar',
                                title: '英文法',
                                sort_order: 2,
                                study_lessons: [
                                    {
                                        id: 'grammar-lesson-1',
                                        title: '第一問：関係代名詞の用法',
                                        description: '関係代名詞の基本的な使い方と応用',
                                        video_url: '/videos/grammar-1.mp4',
                                        pdf_url: '/pdfs/grammar-1.pdf',
                                        text_content: '関係代名詞は2つの文を1つにまとめる重要な文法項目です...',
                                        duration: '19 min',
                                        views: 189
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science',
                name: '理科',
                description: '実験と観察を通じて科学的思考力を養成',
                color: '#7c3aed',
                icon: '🔬',
                study_courses: [
                    {
                        id: 'physics',
                        title: '物理',
                        description: '力学・電磁気学・波動を体系的に学習',
                        image: '/api/placeholder/400/200',
                        thumbnail: '⚛️',
                        study_chapters: [
                            {
                                id: 'mechanics',
                                title: '力学',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'mechanics-lesson-1',
                                        title: '第一問：運動の法則',
                                        description: 'ニュートンの運動法則の理解と応用',
                                        video_url: '/videos/mechanics-1.mp4',
                                        pdf_url: '/pdfs/mechanics-1.pdf',
                                        text_content: 'ニュートンの運動法則は物理学の基礎となる重要な法則です...',
                                        duration: '30 min',
                                        views: 167
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'chemistry',
                        title: '化学',
                        description: '原子・分子の世界から化学反応まで',
                        image: '/api/placeholder/400/200',
                        thumbnail: '🧪',
                        study_chapters: [
                            {
                                id: 'atomic-structure',
                                title: '原子構造',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'atomic-lesson-1',
                                        title: '第一問：電子配置',
                                        description: '原子の電子配置と周期表の関係',
                                        video_url: '/videos/atomic-1.mp4',
                                        pdf_url: '/pdfs/atomic-1.pdf',
                                        text_content: '原子の電子配置は化学の性質を決定する重要な要素です...',
                                        duration: '24 min',
                                        views: 134
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social_studies',
                name: '社会',
                description: '歴史・地理・公民を通じて社会理解を深化',
                color: '#ea580c',
                icon: '🌏',
                study_courses: [
                    {
                        id: 'history',
                        title: '日本史',
                        description: '古代から現代まで日本の歴史を学習',
                        image: '/api/placeholder/400/200',
                        thumbnail: '🏯',
                        study_chapters: [
                            {
                                id: 'ancient-japan',
                                title: '古代日本',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'ancient-lesson-1',
                                        title: '第一問：飛鳥時代の政治',
                                        description: '聖徳太子と飛鳥時代の政治制度',
                                        video_url: '/videos/ancient-1.mp4',
                                        pdf_url: '/pdfs/ancient-1.pdf',
                                        text_content: '飛鳥時代は日本の古代国家形成期として重要な時代です...',
                                        duration: '26 min',
                                        views: 198
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'geography',
                        title: '地理',
                        description: '自然地理と人文地理を総合的に学習',
                        image: '/api/placeholder/400/200',
                        thumbnail: '🗺️',
                        study_chapters: [
                            {
                                id: 'physical-geography',
                                title: '自然地理',
                                sort_order: 1,
                                study_lessons: [
                                    {
                                        id: 'geography-lesson-1',
                                        title: '第一問：気候と植生',
                                        description: '世界の気候区分と植生分布',
                                        video_url: '/videos/geography-1.mp4',
                                        pdf_url: '/pdfs/geography-1.pdf',
                                        text_content: '気候は植生分布に大きな影響を与える重要な要素です...',
                                        duration: '22 min',
                                        views: 156
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
            case 'lessons':
                this.renderLessons();
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

        // 要件適合性チェック
        console.log('📋 [UI REQUIREMENTS] Checking subject card requirements...');
        console.log('📋 [UI REQUIREMENTS] - Expected: Card format for subject selection');
        console.log('📋 [UI REQUIREMENTS] - Expected: Multiple subjects displayed as cards');
        console.log('📋 [UI REQUIREMENTS] - Current subjects data:', this.subjects);

        const subjectsHTML = this.subjects.map(subject => {
            console.log('🔍 [DIAGNOSIS] - Rendering subject:', subject.name);
            console.log('📋 [UI REQUIREMENTS] - Subject color:', subject.color);
            console.log('📋 [UI REQUIREMENTS] - Subject icon:', subject.icon);
            
            // 総講義数を計算
            const totalLessons = subject.study_courses?.reduce((total, course) => {
                return total + (course.study_chapters?.reduce((chapterTotal, chapter) => {
                    return chapterTotal + (chapter.study_lessons?.length || 0);
                }, 0) || 0);
            }, 0) || 0;
            
            return `
                <div class="new-subject-card" onclick="app.selectSubject('${subject.id}')" data-subject-color="${subject.color}">
                    <div class="subject-icon-large">${subject.icon}</div>
                    <h3 class="subject-name">${subject.name}</h3>
                    <p class="subject-description-new">${subject.description}</p>
                    <div class="subject-stats-new">
                        <div class="course-count-new">
                            <span class="count-number">${subject.study_courses?.length || 0}</span>
                            <span class="count-label">コース</span>
                        </div>
                        <div class="lesson-count-new">
                            <span class="count-number">${totalLessons}</span>
                            <span class="count-label">講義</span>
                        </div>
                    </div>
                    <button class="start-learning-btn" style="background-color: ${subject.color}">
                        学習を開始
                    </button>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="subjects-grid">
                ${subjectsHTML}
            </div>
        `;

        console.log('🔍 [DIAGNOSIS] - HTML rendered, length:', container.innerHTML.length);
        console.log('📋 [UI REQUIREMENTS] - Subjects grid HTML:', container.innerHTML.substring(0, 200) + '...');

        // 他の画面を非表示
        this.hideOtherViews(['subjects-container']);
    }

    renderCourses(subject) {
        console.log('🎓 [COURSE DEBUG] renderCourses called for:', subject?.name || this.currentSubject?.name);
        const container = document.getElementById('subjects-container');
        if (!container) return;
        
        const targetSubject = subject || this.currentSubject;
        if (!targetSubject) return;

        const courses = targetSubject.study_courses || [];
        console.log('📋 [UI REQUIREMENTS] Rendering courses in card format with thumbnails');
        
        const coursesHTML = courses.map(course => `
            <div class="course-card" onclick="app.selectCourse('${course.id}')">
                <div class="course-thumbnail">
                    <div class="course-thumbnail-icon">${course.thumbnail || '📚'}</div>
                    <div class="course-thumbnail-edit" onclick="event.stopPropagation(); app.changeThumbnail('${course.id}')">
                        ✏️
                    </div>
                </div>
                <div class="course-content">
                    <h4 class="course-title">${course.title}</h4>
                    <p class="course-description">${course.description}</p>
                    <div class="course-stats">
                        <span class="chapter-count">${course.study_chapters?.length || 0} 章</span>
                        <span class="lesson-count">${this.getTotalLessons(course)} 講座</span>
                    </div>
                    <button class="course-btn">受講する</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="course-header">
                <h2>${targetSubject.name}</h2>
                <p>コースを選択してください</p>
            </div>
            <div class="courses-grid">
                ${coursesHTML}
            </div>
        `;

        // 他の画面を非表示
        this.hideOtherViews(['subjects-container']);
    }

    renderChapters() {
        console.log('📋 [UI REQUIREMENTS] Rendering chapters in list format');
        const container = document.getElementById('subjects-container');
        if (!container || !this.currentCourse) return;

        const chapters = this.currentCourse.study_chapters || [];
        const chaptersHTML = chapters.map((chapter, index) => `
            <div class="chapter-list-item" onclick="app.selectChapter('${chapter.id}')">
                <div class="chapter-number">${index + 1}</div>
                <div class="chapter-content">
                    <h4 class="chapter-title">${chapter.title}</h4>
                    <div class="chapter-meta">
                        <span class="lesson-count">${chapter.study_lessons?.length || 0} 講座</span>
                        <span class="chapter-duration">${this.getChapterDuration(chapter)}</span>
                    </div>
                </div>
                <div class="chapter-arrow">▶</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="chapter-header">
                <h2>${this.currentCourse.title}</h2>
                <p>章を選択してください</p>
            </div>
            <div class="chapters-list">
                ${chaptersHTML}
            </div>
        `;

        // 他の画面を非表示
        this.hideOtherViews(['subjects-container']);
    }

    renderLessons() {
        console.log('📋 [UI REQUIREMENTS] Rendering lessons in list format');
        const container = document.getElementById('subjects-container');
        if (!container || !this.currentChapter) return;

        const lessons = this.currentChapter.study_lessons || [];
        const lessonsHTML = lessons.map((lesson, index) => `
            <div class="lesson-list-item" onclick="app.selectLesson('${lesson.id}')">
                <div class="lesson-number">${index + 1}</div>
                <div class="lesson-content">
                    <h4 class="lesson-title">${lesson.title}</h4>
                    <p class="lesson-description">${lesson.description}</p>
                    <div class="lesson-meta">
                        <span class="lesson-duration">⏱️ ${lesson.duration}</span>
                        <span class="lesson-views">👁️ ${lesson.views} views</span>
                    </div>
                </div>
                <div class="lesson-arrow">▶</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="lesson-header">
                <h2>${this.currentChapter.title}</h2>
                <p>講座を選択してください</p>
            </div>
            <div class="lessons-list">
                ${lessonsHTML}
            </div>
        `;

        // 他の画面を非表示
        this.hideOtherViews(['subjects-container']);
    }

    renderLesson() {
        console.log('📋 [UI REQUIREMENTS] Rendering lesson with simple unified content');
        const container = document.getElementById('subjects-container');
        if (!container || !this.currentLesson) return;

        const lesson = this.currentLesson;
        
        // コンテンツの存在チェック
        const hasVideo = lesson.video_url && lesson.video_url.trim() !== '';
        const hasPDF = lesson.pdf_url && lesson.pdf_url.trim() !== '';
        const hasText = lesson.text_content && lesson.text_content.trim() !== '';
        
        container.innerHTML = `
            <div class="lesson-container-simple">
                <div class="lesson-header-simple">
                    <h1>${lesson.title}</h1>
                    <div class="lesson-meta-simple">
                        <span class="duration">⏱️ ${lesson.duration}</span>
                        <span class="views">👁️ ${lesson.views} views</span>
                    </div>
                    <p class="lesson-description-simple">${lesson.description}</p>
                </div>
                
                <div class="lesson-content-simple">
                    ${hasVideo ? `
                    <div class="video-container-simple">
                        <video controls>
                            <source src="${lesson.video_url}" type="video/mp4">
                            お使いのブラウザは動画再生に対応していません。
                        </video>
                    </div>
                    ` : ''}
                    
                    ${hasPDF ? `
                    <div class="pdf-section-simple">
                        <div class="pdf-header-simple">
                            <span>📋 PDF資料</span>
                            <a href="${lesson.pdf_url}" target="_blank" class="pdf-download-simple">ダウンロード</a>
                        </div>
                        <iframe src="${lesson.pdf_url}" class="pdf-iframe-simple"></iframe>
                    </div>
                    ` : ''}
                    
                    ${hasText ? `
                    <div class="text-content-simple">
                        ${lesson.text_content}
                    </div>
                    ` : ''}
                    
                    ${!hasVideo && !hasPDF && !hasText ? `
                    <div class="no-content-message">
                        <p>📝 講座コンテンツを準備中です</p>
                    </div>
                    ` : ''}
                </div>

                <div class="lesson-navigation-simple">
                    <button class="nav-btn-simple secondary" onclick="app.goBack()">← 戻る</button>
                    <button class="nav-btn-simple primary" onclick="app.nextLesson()">次の講座 →</button>
                </div>
            </div>
        `;

        // 他の画面を非表示
        this.hideOtherViews(['subjects-container']);
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
        this.currentView = 'lessons';
        this.renderCurrentView();
    }

    selectLesson(lessonId) {
        if (!this.currentChapter) return;
        this.currentLesson = this.currentChapter.study_lessons.find(l => l.id === lessonId);
        this.currentView = 'lesson';
        this.renderCurrentView();
    }

    // ヘルパーメソッド
    getTotalLessons(course) {
        let total = 0;
        if (course.study_chapters) {
            course.study_chapters.forEach(chapter => {
                total += chapter.study_lessons?.length || 0;
            });
        }
        return total;
    }

    getChapterDuration(chapter) {
        if (!chapter.study_lessons) return '0 min';
        let totalMinutes = 0;
        chapter.study_lessons.forEach(lesson => {
            const duration = lesson.duration || '0 min';
            const minutes = parseInt(duration.match(/\d+/)?.[0] || '0');
            totalMinutes += minutes;
        });
        return `${totalMinutes} min`;
    }

    changeThumbnail(courseId) {
        const thumbnails = ['📚', '📖', '📝', '🎓', '💡', '🔬', '🎨', '🎵', '⚽', '🌟'];
        const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
        
        // 現在の科目のコースを更新
        if (this.currentSubject) {
            const course = this.currentSubject.study_courses.find(c => c.id === courseId);
            if (course) {
                course.thumbnail = randomThumbnail;
                this.renderCurrentView(); // 再描画
            }
        }
    }

    switchTab(tabName) {
        // タブボタンの状態を更新
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // コンテンツセクションの表示を切り替え
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`${tabName}-section`)?.classList.add('active');
    }

    nextLesson() {
        if (!this.currentChapter || !this.currentLesson) return;
        
        const lessons = this.currentChapter.study_lessons;
        const currentIndex = lessons.findIndex(l => l.id === this.currentLesson.id);
        
        if (currentIndex < lessons.length - 1) {
            this.currentLesson = lessons[currentIndex + 1];
            this.renderCurrentView();
        } else {
            alert('これが最後の講座です。');
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
            this.currentView = 'lessons';
        } else if (this.currentView === 'lessons') {
            this.currentChapter = null;
            this.currentView = 'chapters';
        } else if (this.currentView === 'chapters') {
            this.currentCourse = null;
            this.currentView = 'courses';
        } else if (this.currentView === 'courses') {
            this.currentSubject = null;
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
        this.isLoggedIn = false;
        this.currentUser = null;
        this.currentSchool = { id: "production-school", name: "あなたの学習塾" };
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        console.log('🔐 Checking login status...');
        const userData = localStorage.getItem('sunaUser');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
                console.log('🔐 User is logged in:', this.currentUser.name);
            } catch (error) {
                console.error('🔐 Error parsing user data:', error);
                this.logout();
            }
        } else {
            console.log('🔐 No user data found');
            this.isLoggedIn = false;
        }
    }

    requireStudentAuth() {
        // 一時的に認証チェックを無効化
        return true;
        // if (!this.isLoggedIn || !this.currentUser) {
        //     console.log('🔐 Authentication required, redirecting to login...');
        //     this.redirectToLogin();
        //     return false;
        // }
        // return true;
    }

    redirectToLogin() {
        // 現在のページがログインページでない場合のみリダイレクト
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    getCurrentSchool() {
        return this.currentSchool;
    }

    logout() {
        console.log('🔐 Logging out user...');
        localStorage.removeItem('sunaUser');
        localStorage.removeItem('sunaRememberLogin');
        this.isLoggedIn = false;
        this.currentUser = null;
        this.redirectToLogin();
    }

    showMessage(msg, type) {
        // より良いメッセージ表示（将来的にはトースト通知など）
        console.log(`[${type.toUpperCase()}] ${msg}`);
        alert(`[${type}] ${msg}`);
    }

    changeSchool(schoolId) {
        this.currentSchool = { id: schoolId, name: schoolId };
    }
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