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
const subjects = {
    'demo-skillplus': {
        id: 'demo-skillplus',
        name: 'スキルプラス活用マスター講座',
        description: 'ビジネススキルを学ぶ実践的な講座',
        color: '#10b981',
        instructor: '塾長',
        schoolId: 'production-school',
        courses: [
            {
                id: 'course-1',
                title: '成長を最大化するマインドセット',
                description: '成長思考と学習効率を高める基礎講座',
                lessons: [
                    {
                        id: 'lesson1-1',
                        title: 'Play your life　〜 Well-being 〜',
                        duration: '20分',
                        completed: false
                    },
                    {
                        id: 'lesson1-2',
                        title: 'Life Time Time (LTT) の考え方',
                        duration: '15分',
                        completed: false
                    },
                    {
                        id: 'lesson1-3',
                        title: 'Giver・Taker の関係性',
                        duration: '18分',
                        completed: false
                    },
                    {
                        id: 'lesson1-4',
                        title: 'ToDo至上主義からの脱却',
                        duration: '22分',
                        completed: false
                    }
                ]
            },
            {
                id: 'course-2',
                title: 'Play my life をするために必要なマインドセット',
                description: '自分らしく生きるための思考法を学ぶ',
                lessons: [
                    {
                        id: 'lesson2-1',
                        title: '自分で解決「できるもの」と「できないもの」を分けて考えよう',
                        duration: '16分',
                        completed: false
                    },
                    {
                        id: 'lesson2-2',
                        title: '「お金がない」を言い訳にしない',
                        duration: '19分',
                        completed: false
                    },
                    {
                        id: 'lesson2-3',
                        title: '「時間がない」はありえない',
                        duration: '14分',
                        completed: false
                    }
                ]
            }
        ]
    },
    'demo-business': {
        id: 'demo-business',
        name: 'ビジネス基礎講座',
        description: 'ビジネスの基本的な知識とスキルを習得',
        color: '#3b82f6',
        instructor: '講師A',
        schoolId: 'production-school',
        courses: [
            {
                id: 'business-course-1',
                title: 'ビジネスマナー基礎',
                description: '社会人として必要なマナーと常識',
                lessons: [
                    {
                        id: 'business1-1',
                        title: '挨拶とコミュニケーション',
                        duration: '12分',
                        completed: false
                    },
                    {
                        id: 'business1-2',
                        title: 'メールの書き方',
                        duration: '15分',
                        completed: false
                    },
                    {
                        id: 'business1-3',
                        title: '会議の進め方',
                        duration: '18分',
                        completed: false
                    }
                ]
            }
        ]
    },
    'demo-programming': {
        id: 'demo-programming',
        name: 'プログラミング入門',
        description: 'プログラミングの基礎から実践まで',
        color: '#8b5cf6',
        instructor: '講師B',
        schoolId: 'production-school',
        courses: [
            {
                id: 'programming-course-1',
                title: 'JavaScript基礎',
                description: 'JavaScript言語の基本文法を学習',
                lessons: [
                    {
                        id: 'js1-1',
                        title: '変数とデータ型',
                        duration: '25分',
                        completed: false
                    },
                    {
                        id: 'js1-2',
                        title: '関数とスコープ',
                        duration: '30分',
                        completed: false
                    },
                    {
                        id: 'js1-3',
                        title: 'オブジェクトと配列',
                        duration: '28分',
                        completed: false
                    }
                ]
            }
        ]
    }
};

// 旧coursesデータを削除し、新しい構造に対応
// const courses = []; // この行を削除

// レッスンの詳細コンテンツ
const lessonContents = {
    'lesson1-1': {
        title: 'Play your life　〜 Well-being 〜',
        videoUrl: 'videos/wellbeing.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、人生を主体的に生きるためのきっかけとなるWell-beingの概念について学習します。Well-beingは人間の幸福を意味する
あらゆる概念の仮訳のことであり、これは記載された決定であることで、より多幸で楽しい人生を送ることができます。</p>
            </div>

            <h4>Well-beingの5つの要素</h4>
            
            <div class="wellbeing-elements">
                <div class="element">
                    <h5>1. 欲求の解消</h5>
                    <p>やりたいことを実現し、悔ややそれた思うことは終幸の一要素です。ただし、こんばんは困難確あるする間際には状況ません。</p>
                </div>
                
                <div class="element">
                    <h5>2. 意味性</h5>
                    <p>自分のやっていることに意味や意義を見出すことが、複々な欲求の解决上位向问的な回転を高じるうえでも重要です。</p>
                </div>
                
                <div class="element">
                    <h5>3. 成長実感</h5>
                    <p>人间は成长することに喜びを見出す生き物てあします。新しいことができるようになる、スキルの向上を実感できることが要素です。</p>
                </div>
                
                <div class="element">
                    <h5>4. 没頭</h5>
                    <p>自分の物事に集中して取り積み取る時間、时间它中かられる程度に没胜することも、幸せな人生には重要です。</p>
                </div>
                
                <div class="element">
                    <h5>5. 豊かな人間関係</h5>
                    <p>上記4つの要素をに過还されさうる内朋の存在、ポジティブな人閒関係は豊かな人生には区分をい要素です。</p>
                </div>
            </div>

            <h4>「楽をする」ことと「人生を楽しむ」ことの違い</h4>
            
            <div class="concept-comparison">
                <div class="concept">
                    <h5>楽をすることの本質</h5>
                    <p>楽をするとは、数手イノ中の課題を越けて、成果の解消だけを求めることです。</p>
                    
                    <ul>
                        <li><strong>課題目の興除</strong><br>自分の行動を都过や問题を理解する</li>
                        <li><strong>責任持成の阴台</strong><br>会的義務や非期を満え</li>
                        <li><strong>成長課题の興阴</strong><br>物事について深く考えない</li>
                        <li><strong>白己理解の興阴</strong><br>自己理解の向上自会えよい</li>
                    </ul>
                </div>
                
                <div class="concept">
                    <h5>人生課題の本質</h5>
                    <p>期間とは、興阵に限定をるものからエス、周世とのかかるり人間形や文書奏</p>
                    
                    <ul>
                        <li><strong>期間は間题に対して优しい</strong><br>間的の問题をよ使してい、实界对象と自について学んでい習</li>
                        <li><strong>本整美问の經取</strong><br>新しいことに挑戦しに</li>
                        <li><strong>自己理解の向上を通讯</strong><br>何際の興えは自己実現を図る</li>
                        <li><strong>人際関係の築除</strong><br>周囲と連視してきる人との関係を築委事</li>
                    </ul>
                </div>
            </div>

            <h4>まとめと次のステップ</h4>
            <p>Well-beingは、整う「楽」や「快楽」を経あつたものの、より深いほ心の女受益を表現えず。</p>
            <p>次章は、これら5つの要素をどうことによって、其界对象な方法において学んでいている解す。</p>
        `
    },
    'lesson1-2': {
        title: 'Life Time Time (LTT) の考え方',
        videoUrl: 'videos/ltt.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、時間の概念を見直し、より充実した人生を送るためのLife Time Time（LTT）について学習します。</p>
            </div>

            <h4>LTTとは何か</h4>
            <p>Life Time Time（LTT）とは、自分の人生における時間の使い方を戦略的に考える概念です。単なる時間管理ではなく、人生全体の時間配分を最適化することを目指します。</p>

            <h4>従来の時間管理との違い</h4>
            <ul>
                <li><strong>短期的な効率</strong> → <strong>長期的な価値創造</strong></li>
                <li><strong>タスクの消化</strong> → <strong>人生の充実度向上</strong></li>
                <li><strong>忙しさの追求</strong> → <strong>意味のある活動の選択</strong></li>
            </ul>

            <h4>LTTの3つの軸</h4>
            <div class="ltt-elements">
                <div class="element">
                    <h5>1. 投資時間</h5>
                    <p>将来の自分のための時間投資。学習、スキル向上、人間関係構築など。</p>
                </div>
                <div class="element">
                    <h5>2. 享受時間</h5>
                    <p>現在の幸福感を得る時間。趣味、娯楽、リラクゼーションなど。</p>
                </div>
                <div class="element">
                    <h5>3. 必要時間</h5>
                    <p>生活維持に必要な時間。仕事、家事、睡眠など。</p>
                </div>
            </div>
        `
    },
    'business1-1': {
        title: '挨拶とコミュニケーション',
        videoUrl: 'videos/business-greeting.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>ビジネスシーンにおける適切な挨拶とコミュニケーションの基本を学習します。</p>
            </div>

            <h4>基本的な挨拶</h4>
            <ul>
                <li><strong>おはようございます</strong> - 朝の挨拶（午前中）</li>
                <li><strong>お疲れ様です</strong> - 日中の挨拶</li>
                <li><strong>失礼いたします</strong> - 退社時の挨拶</li>
            </ul>

            <h4>名刺交換のマナー</h4>
            <ol>
                <li>両手で相手の名刺を受け取る</li>
                <li>「お預かりいたします」と言う</li>
                <li>机の上の左上に置く</li>
                <li>会議終了まで丁寧に扱う</li>
            </ol>

            <h4>電話応対の基本</h4>
            <p>「お忙しい中、お電話いただきありがとうございます。〇〇の△△と申します。」</p>
        `
    },
    'js1-1': {
        title: '変数とデータ型',
        videoUrl: 'videos/js-variables.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>JavaScriptにおける変数の宣言方法とデータ型について学習します。</p>
            </div>

            <h4>変数の宣言</h4>
            <pre><code>// let - 再代入可能
let name = "田中";
let age = 25;

// const - 再代入不可
const PI = 3.14159;

// var - 古い書き方（非推奨）
var oldStyle = "使わない方が良い";</code></pre>

            <h4>データ型</h4>
            <ul>
                <li><strong>string（文字列）</strong>: "Hello World"</li>
                <li><strong>number（数値）</strong>: 42, 3.14</li>
                <li><strong>boolean（真偽値）</strong>: true, false</li>
                <li><strong>undefined</strong>: 未定義</li>
                <li><strong>null</strong>: 空の値</li>
            </ul>

            <h4>型の確認</h4>
            <pre><code>console.log(typeof "Hello"); // "string"
console.log(typeof 42);     // "number"
console.log(typeof true);   // "boolean"</code></pre>
        `
    }
};

// 認証管理クラス
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.currentSchool = null;
        this.superAdminEmail = 'ikki_y0518@icloud.com'; // スーパー管理者のメールアドレス
        this.init();
    }

    init() {
        // ローカルストレージから認証情報を復元
        const savedUser = localStorage.getItem('sunaUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
        }
        
        // 現在のスクール情報を復元
        const savedSchool = localStorage.getItem('currentSchool');
        if (savedSchool) {
            this.currentSchool = JSON.parse(savedSchool);
        } else {
            // デフォルトスクールを設定
            this.currentSchool = schools['production-school'];
            localStorage.setItem('currentSchool', JSON.stringify(this.currentSchool));
        }
        
        this.updateAuthUI();
    }

    login(userData) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        localStorage.setItem('sunaUser', JSON.stringify(userData));
        this.updateAuthUI();
        this.showWelcomeMessage();
        
        // roleに基づいてリダイレクト
        this.redirectByRole();
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('sunaUser');
        this.updateAuthUI();
        
        // 現在のページに応じて適切なパスでログインページにリダイレクト
        if (window.location.pathname.includes('/pages/')) {
            // pagesディレクトリ内からのログアウト
            window.location.href = 'login.html';
} else {
            // ルートディレクトリからのログアウト
            window.location.href = '/pages/login.html';
        }
    }

    // スクール変更機能
    changeSchool(schoolId) {
        const school = schools[schoolId];
        if (school) {
            this.currentSchool = school;
            localStorage.setItem('currentSchool', JSON.stringify(school));
            this.showMessage(`${school.name}に切り替えました`, 'success');
            
            // ページをリロードしてスクール固有のコンテンツを反映
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    // スーパー管理者チェック
    isSuperAdmin() {
        return this.currentUser && this.currentUser.email === this.superAdminEmail;
    }

    // 管理者権限チェック（スーパー管理者も含む）
    isAdmin() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.isSuperAdmin());
    }

    // スクール一覧を取得（スーパー管理者は全て、通常管理者は所属スクールのみ）
    getSchools() {
        // スクールデータを再読み込み
        const updatedSchools = loadSchools();
        Object.assign(schools, updatedSchools);
        
        if (this.isSuperAdmin()) {
            return Object.values(schools);
        }
        return Object.values(schools);
    }

    // 現在のユーザー情報を取得
    getCurrentUser() {
        return this.currentUser;
    }

    // 現在のスクール情報を取得
    getCurrentSchool() {
        // スクールデータを再読み込み
        const updatedSchools = loadSchools();
        Object.assign(schools, updatedSchools);
        
        return this.currentSchool || Object.values(schools).find(s => s.isDefault) || Object.values(schools)[0];
    }

    updateAuthUI() {
        const authSection = document.getElementById('auth-section');
        if (!authSection) return;

        if (this.isLoggedIn && this.currentUser) {
            const userDisplayName = this.currentUser.name || this.currentUser.email;
            const superAdminBadge = this.isSuperAdmin() ? '<span class="super-admin-badge">👑 SUPER ADMIN</span>' : '';
            
            authSection.innerHTML = `
                <div class="user-info">
                    <span class="user-name">こんにちは、${userDisplayName}さん ${superAdminBadge}</span>
                    <div class="school-selector">
                        <select id="school-select" onchange="authManager.changeSchool(this.value)">
                            ${Object.values(schools).map(school => `
                                <option value="${school.id}" ${this.currentSchool && this.currentSchool.id === school.id ? 'selected' : ''}>
                                    ${school.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <button class="logout-btn" onclick="authManager.logout()">ログアウト</button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <div class="auth-buttons">
                    <a href="/pages/login.html" class="login-btn">ログイン</a>
                    <a href="/signup.html" class="signup-btn">会員登録</a>
                </div>
            `;
        }
    }

    showWelcomeMessage() {
        this.showMessage(`${this.currentUser.name || this.currentUser.email}さん、おかえりなさい！`, 'success');
    }

    showLogoutMessage() {
        this.showMessage('ログアウトしました', 'info');
    }

    showMessage(message, type = 'info') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 新しい通知を作成
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 通知のスタイル
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        // タイプ別の色設定
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                break;
            case 'info':
                notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                break;
        }
        
        document.body.appendChild(notification);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 3000);
    }

    requireAuth() {
        if (!this.isLoggedIn) {
            this.showMessage('この機能を利用するにはログインが必要です', 'error');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = '/pages/login.html';
                }
            }, 1500);
            return false;
        }
        return true;
    }

    // roleに基づくリダイレクト
    redirectByRole() {
        if (!this.currentUser || !this.currentUser.role) {
            // roleが設定されていない場合はstudentとして扱う
            this.currentUser.role = 'student';
        }

        switch (this.currentUser.role) {
            case 'admin':
                window.location.href = '/pages/admin.html';
                break;
            case 'student':
            default:
                window.location.href = '/pages/student.html';
                break;
        }
    }

    // 管理者権限チェック
    requireAdminAuth() {
        if (!this.isLoggedIn) {
            this.showMessage('ログインが必要です', 'error');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = '/pages/login.html';
                }
            }, 1500);
            return false;
        }

        // スーパー管理者または管理者の場合のみ許可
        if (!this.currentUser.role || (this.currentUser.role !== 'admin' && this.currentUser.role !== 'super_admin')) {
            this.showMessage('管理者権限が必要です', 'error');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = '/pages/login.html';
                }
            }, 1500);
            return false;
        }

        return true;
    }

    // 受講生権限チェック
    requireStudentAuth() {
        if (!this.isLoggedIn) {
            this.showMessage('ログインが必要です', 'error');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 1500);
            return false;
        }

        if (this.currentUser.role && this.currentUser.role !== 'student') {
            this.showMessage('受講生権限が必要です', 'error');
            setTimeout(() => {
                window.location.href = '/pages/admin.html';
            }, 1500);
            return false;
        }

        return true;
    }
}

// アプリケーションの状態管理
class StudyApp {
    constructor() {
        this.currentView = 'subjects'; // 科目選択画面から開始
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentLesson = null;
        this.init();
    }

    init() {
        console.log('StudyApp initialized');
        
        // ローカルストレージから管理者が作成した科目データを読み込み
        this.loadSubjectsFromStorage();
        
        this.renderSubjects(); // 科目選択画面を表示
        this.updateSidebar();
        this.bindEvents();
        
        // 定期的にローカルストレージをチェック（管理者が新しい科目を追加した場合）
        this.setupStorageListener();
    }
    
    // ローカルストレージの変更を監視
    setupStorageListener() {
        // 他のタブでローカルストレージが変更された場合の処理
        window.addEventListener('storage', (e) => {
            if (e.key === 'subjects') {
                console.log('Subjects data changed in another tab, reloading...');
                this.loadSubjectsFromStorage();
                this.renderSubjects();
            }
        });
        
        // 同一タブ内での変更も監視（5秒間隔）
        setInterval(() => {
            const currentKeys = Object.keys(subjects);
            const storedSubjects = localStorage.getItem('subjects');
            if (storedSubjects) {
                const parsedSubjects = JSON.parse(storedSubjects);
                const storedKeys = Object.keys(parsedSubjects);
                
                // キーの数が変わった場合は再読み込み
                if (currentKeys.length !== storedKeys.length) {
                    console.log('Subjects count changed, reloading...');
                    this.loadSubjectsFromStorage();
                    this.renderSubjects();
                }
            }
        }, 5000);
    }
    
    // ローカルストレージから科目データを読み込む
    loadSubjectsFromStorage() {
        try {
            const storedSubjects = localStorage.getItem('subjects');
            if (storedSubjects) {
                const parsedSubjects = JSON.parse(storedSubjects);
                // グローバルのsubjectsオブジェクトを更新
                Object.assign(subjects, parsedSubjects);
                console.log('Loaded subjects from storage:', Object.keys(subjects));
            } else {
                console.log('No subjects found in localStorage');
            }
        } catch (error) {
            console.error('Error loading subjects from storage:', error);
        }
    }

    // 科目選択画面を表示
    renderSubjects() {
        const homeView = document.getElementById('home-view');
        if (!homeView) return;
        
        // 科目が空の場合の表示
        const subjectValues = Object.values(subjects);
        if (subjectValues.length === 0) {
            homeView.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h2>科目がまだ作成されていません</h2>
                    <p>管理者によって科目とコースが作成されるまでお待ちください。</p>
                    <div class="empty-state-note">
                        <p>💡 管理者の方は、コンテンツ管理システムから科目やコースを作成してください。</p>
                    </div>
                </div>
            `;
            return;
        }
        
        homeView.innerHTML = `
            <div class="subjects-header">
                <h2>学習科目を選択してください</h2>
                <p>興味のある科目から学習を始めましょう</p>
            </div>
            <div class="subjects-grid" id="subjects-grid">
            </div>
        `;

        const subjectsGrid = document.getElementById('subjects-grid');
        
        subjectValues.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <div class="subject-icon" style="color: ${subject.color}">
                    ${subject.icon}
                </div>
                <h3 class="subject-name">${subject.name}</h3>
                <p class="subject-description">${subject.description}</p>
                <div class="subject-stats">
                    <span class="course-count">${subject.courses ? subject.courses.length : 0}コース</span>
                    <span class="total-lessons">${this.getTotalLessons(subject)}講義</span>
                </div>
                <button class="subject-button" style="background-color: ${subject.color}">
                    学習を開始
                </button>
            `;
            
            subjectCard.addEventListener('click', () => {
                console.log('Subject clicked:', subject.name);
                console.log('AuthManager exists:', !!authManager);
                console.log('User logged in:', authManager?.isLoggedIn);
                
                if (authManager && authManager.requireAuth()) {
                    console.log('Auth passed, showing subject:', subject.name);
                    this.showSubject(subject);
                } else {
                    console.log('Auth failed or authManager not available');
                }
            });
            
            subjectsGrid.appendChild(subjectCard);
        });
    }

    // コース一覧を表示
    renderCourses(subject) {
        console.log('renderCourses called for subject:', subject.name);
        const homeView = document.getElementById('home-view');
        if (!homeView) {
            console.log('home-view element not found');
            return;
        }
        
        // コースが空の場合の表示
        if (!subject.courses || subject.courses.length === 0) {
            homeView.innerHTML = `
                <div class="courses-header">
                    <h2>${subject.icon} ${subject.name}のコース一覧</h2>
                    <p>${subject.description}</p>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h2>まだコースが作成されていません</h2>
                    <p>「${subject.name}」のコースが管理者によって作成されるまでお待ちください。</p>
                    <div class="empty-state-note">
                        <p>💡 管理者の方は、コンテンツ管理システムから「${subject.name}」にコースを追加してください。</p>
                    </div>
                </div>
            `;
            return;
        }
        
        homeView.innerHTML = `
            <div class="courses-header">
                <h2>${subject.icon} ${subject.name}のコース一覧</h2>
                <p>${subject.description}</p>
            </div>
            <div class="course-list" id="course-list">
            </div>
        `;

        const courseList = document.getElementById('course-list');

        // coursesがオブジェクトの場合は配列に変換
        const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});

        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-card-image">
                    <div class="course-logo-container">
                        <svg width="140" height="70" viewBox="0 0 115 55" class="course-suna-logo">
                            <!-- 大きな円（右上、明るいターコイズブルー） -->
                            <circle cx="90" cy="20" r="13" fill="#67E8F9" opacity="0.85"/>

                            <!-- 中くらいの円（左中央、濃いブルー） -->
                            <circle cx="73" cy="28" r="8" fill="#2563EB" opacity="0.9"/>

                            <!-- 小さな円（右下、薄いターコイズ） -->
                            <circle cx="83" cy="35" r="5" fill="#A7F3D0" opacity="0.75"/>

                            <!-- テキスト "suna" - 太字、濃いネイビー -->
                            <text x="0" y="42" font-size="26" font-weight="700" fill="#1E293B" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" letter-spacing="-1.2px">
                                suna
                            </text>
                        </svg>
                    </div>
                </div>
                <div class="course-card-content">
                    <h4 class="course-card-title">${course.title}</h4>
                    <p class="course-card-description">${course.description}</p>
                    <div class="course-card-footer">
                        <span class="course-progress">${course.progress}% 完了</span>
                        <button class="course-button">受講する</button>
                    </div>
                </div>
            `;
            
            courseCard.addEventListener('click', () => {
                console.log('Course clicked:', course.title);
                if (authManager && authManager.requireAuth()) {
                    console.log('Course auth passed, showing course:', course.title);
                this.showCourse(course);
                } else {
                    console.log('Course auth failed');
                }
            });
            
            courseList.appendChild(courseCard);
        });
    }

    // サイドバーの更新
    updateSidebar() {
        const sidebar = document.getElementById('sidebar');
        const chapterList = document.getElementById('chapter-list');
        const container = document.querySelector('.main-content .container');
        
        // 要素が存在しない場合は早期リターン（コンテンツ管理画面など）
        if (!sidebar || !container) {
            return;
        }
        
        if (this.currentView === 'subjects' || this.currentView === 'courses') {
            sidebar.style.display = 'none';
            container.classList.remove('with-sidebar');
        } else {
            sidebar.style.display = 'block';
            container.classList.add('with-sidebar');
            
            if (this.currentCourse && chapterList) {
                chapterList.innerHTML = '';
                
                // コース全体のフォルダを作成
                const courseFolder = document.createElement('div');
                courseFolder.className = 'finder-item finder-folder';
                courseFolder.innerHTML = `
                    <div class="finder-item-content">
                        <span class="finder-icon">📁</span>
                        <span class="finder-name">${this.currentCourse.title}</span>
                    </div>
                `;
                courseFolder.addEventListener('click', () => {
                    this.showCourse(this.currentCourse);
                });
                chapterList.appendChild(courseFolder);
                
                // 各章をフォルダとして表示
                this.currentCourse.chapters.forEach((chapter, chapterIndex) => {
                    const chapterFolder = document.createElement('div');
                    chapterFolder.className = 'finder-item finder-folder chapter-folder';
                    chapterFolder.dataset.chapterIndex = chapterIndex;
                    
                    const isExpanded = chapterIndex === 0; // 最初の章は展開
                    
                    chapterFolder.innerHTML = `
                        <div class="finder-item-content">
                            <span class="finder-expand-icon">${isExpanded ? '▼' : '▶'}</span>
                            <span class="finder-icon">📂</span>
                            <span class="finder-name">${chapter.title}</span>
                            <span class="finder-count">(${chapter.lessons.length})</span>
                        </div>
                    `;
                    
                    // 章の展開・折りたたみ
                    chapterFolder.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const expandIcon = chapterFolder.querySelector('.finder-expand-icon');
                        const isCurrentlyExpanded = chapterFolder.classList.contains('expanded');
                        
                        if (isCurrentlyExpanded) {
                            chapterFolder.classList.remove('expanded');
                            expandIcon.textContent = '▶';
                            // 講義アイテムを非表示
                            const lessonItems = chapterList.querySelectorAll(`[data-chapter="${chapterIndex}"]`);
                            lessonItems.forEach(item => item.style.display = 'none');
                        } else {
                            chapterFolder.classList.add('expanded');
                            expandIcon.textContent = '▼';
                            // 講義アイテムを表示
                            const lessonItems = chapterList.querySelectorAll(`[data-chapter="${chapterIndex}"]`);
                            lessonItems.forEach(item => item.style.display = 'block');
                        }
                    });
                    
                    if (isExpanded) {
                        chapterFolder.classList.add('expanded');
                    }
                    
                    chapterList.appendChild(chapterFolder);
                    
                    // 各講義をファイルとして表示
                    chapter.lessons.forEach((lesson, lessonIndex) => {
                        const lessonFile = document.createElement('div');
                        lessonFile.className = 'finder-item finder-file lesson-file';
                        lessonFile.dataset.chapter = chapterIndex;
                        lessonFile.style.display = isExpanded ? 'block' : 'none';
                        
                        const isCompleted = this.isLessonCompleted(lesson.id);
                        const isCurrentLesson = this.currentLesson === lesson.id;
                        
                        lessonFile.innerHTML = `
                            <div class="finder-item-content">
                                <span class="finder-indent"></span>
                                <span class="finder-icon">${isCompleted ? '✅' : '📄'}</span>
                                <span class="finder-name ${isCurrentLesson ? 'current-lesson' : ''}">${lesson.title}</span>
                                ${isCompleted ? '<span class="finder-badge">完了</span>' : ''}
                            </div>
                        `;
                        
                        lessonFile.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.showLesson(lesson.id);
                        });
                        
                        chapterList.appendChild(lessonFile);
                    });
                });
            }
        }
    }

    // パンくずナビゲーションの更新
    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb-content');
        if (!breadcrumb) return;
        
        let breadcrumbHTML = '<a href="#" onclick="app.showSubjects()" class="breadcrumb-item">科目選択</a>';
        
        if (this.currentSubject) {
            breadcrumbHTML += `<a href="#" onclick="app.showSubject(subjects.${this.currentSubject.id})" class="breadcrumb-item">${this.currentSubject.name}</a>`;
        }
        
        if (this.currentCourse) {
            breadcrumbHTML += `<span class="breadcrumb-item">${this.currentCourse.title}</span>`;
        }
        
        if (this.currentLesson) {
            const lesson = this.findLessonById(this.currentLesson);
            if (lesson) {
                breadcrumbHTML += `<span class="breadcrumb-item">${lesson.title}</span>`;
            }
        }
        
        breadcrumb.innerHTML = breadcrumbHTML;
    }

    // 特定のコースを表示
    showCourse(course) {
        this.currentView = 'course';
        this.currentCourse = course;
        this.currentLesson = null;
        
        this.hideAllViews();
        this.updateSidebar();
        this.updateBreadcrumb();
        
        const courseView = document.getElementById('course-view');
        courseView.style.display = 'block';
        courseView.innerHTML = `
            <div class="course-detail-header">
                <h2 class="course-detail-title">${course.title}</h2>
                <p class="course-detail-subtitle">${course.description}</p>
            </div>
            
            ${course.chapters.map(chapter => `
                <div class="chapter-section">
                    <div class="chapter-header">
                        <h3 class="chapter-title">${chapter.title}</h3>
            </div>
            <div class="lesson-list">
                        ${chapter.lessons.map(lesson => `
                            <div class="lesson-item" onclick="app.showLesson('${lesson.id}')">
                                <div class="lesson-checkbox ${this.isLessonCompleted(lesson.id) ? 'completed' : ''}">
                                    ${this.isLessonCompleted(lesson.id) ? '✓' : ''}
                                </div>
                                <div class="lesson-content">
                                    <div class="lesson-title">${lesson.title}</div>
                                    <div class="lesson-subtitle">動画とテキストで学習</div>
                                </div>
                                <button class="lesson-button">受講する</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        `;
    }

    // 特定の講義を表示
    showLesson(lessonId) {
        const lesson = this.findLessonById(lessonId);
        if (!lesson) return;

        this.currentView = 'lesson';
        this.currentLesson = lessonId;
        
        // 講義を完了状態にマーク
        this.markLessonCompleted(lessonId);
        
        this.hideAllViews();
        this.updateSidebar();
        this.updateBreadcrumb();

        const lessonView = document.getElementById('lesson-view');
        lessonView.style.display = 'block';
        
        const content = lessonContents[lessonId] || {
            title: lesson.title,
            videoUrl: 'videos/sample.mp4',
            textContent: '<p>コンテンツを準備中です。</p>'
        };

        const lessonPosition = this.getLessonPosition(lessonId);
        
        lessonView.innerHTML = `
            <div class="lesson-header">
                <div class="lesson-progress-info">
                    <span class="lesson-number">${lessonPosition.position} / ${lessonPosition.total}</span>
                    <div class="lesson-progress-bar">
                        <div class="lesson-progress-fill" style="width: ${(lessonPosition.position / lessonPosition.total) * 100}%"></div>
            </div>
                </div>
                <h2 class="lesson-title-main">${content.title}</h2>
                <p class="lesson-course-name">${this.currentCourse.title}</p>
            </div>
            
            <div class="lesson-content-grid">
                <div class="video-section">
                    <h3>🎥 講義動画</h3>
                    <div class="video-container">
                        <video controls preload="metadata">
                            <source src="${content.videoUrl}" type="video/mp4">
                            <p>お使いのブラウザは動画の再生に対応していません。</p>
                        </video>
                    </div>
                </div>
                
                <div class="text-section">
                    <h3>📖 講義テキスト</h3>
                    <div class="text-content">
                        ${content.textContent}
                    </div>
                </div>
            </div>
            
            <div class="nav-buttons">
                <button class="nav-btn" onclick="app.showCourse(app.currentCourse)">コース一覧</button>
                <div class="lesson-navigation">
                    ${this.findPrevLesson(lessonId) ? 
                        `<button class="nav-btn secondary" onclick="app.prevLesson()">← 前の講義</button>` : 
                        `<button class="nav-btn secondary disabled">← 前の講義</button>`
                    }
                    ${this.findNextLesson(lessonId) ? 
                        `<button class="nav-btn primary" onclick="app.nextLesson()">次の講義 →</button>` : 
                        `<button class="nav-btn primary" onclick="app.nextLesson()">コース完了 🎉</button>`
                    }
                </div>
            </div>
        `;
    }

    // 科目選択画面を表示
    showSubjects() {
        this.currentView = 'subjects';
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentLesson = null;

        this.hideAllViews();
        this.updateSidebar();
        this.updateBreadcrumb();
        
        document.getElementById('home-view').style.display = 'block';
        this.renderSubjects();
    }

    // 特定の科目のコース一覧を表示
    showSubject(subject) {
        console.log('showSubject called with:', subject.name);
        console.log('Subject courses:', subject.courses ? subject.courses.length : 0);
        
        // coursesプロパティが存在しない場合は初期化
        if (!subject.courses) {
            subject.courses = [];
        }
        
        this.currentView = 'courses';
        this.currentSubject = subject;
        this.currentCourse = null;
        this.currentLesson = null;

        this.hideAllViews();
        this.updateSidebar();
        this.updateBreadcrumb();
        
        document.getElementById('home-view').style.display = 'block';
        this.renderCourses(subject);
        
        console.log('showSubject completed');
    }

    // 全てのビューを非表示
    hideAllViews() {
        document.getElementById('home-view').style.display = 'none';
        document.getElementById('course-view').style.display = 'none';
        document.getElementById('lesson-view').style.display = 'none';
    }

    // 科目の総講義数を取得
    getTotalLessons(subject) {
        let total = 0;
        // coursesが存在しない場合は0を返す
        if (!subject.courses) {
            return 0;
        }
        
        // coursesがオブジェクトの場合は配列に変換
        const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses);
        
        courses.forEach(course => {
            if (course.chapters && Array.isArray(course.chapters)) {
                course.chapters.forEach(chapter => {
                    if (chapter.lessons && Array.isArray(chapter.lessons)) {
                        total += chapter.lessons.length;
                    }
                });
            }
        });
        return total;
    }

    // レッスンIDから講義を検索
    findLessonById(lessonId) {
        for (const subject of Object.values(subjects)) {
            const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});
            for (const course of courses) {
                for (const chapter of course.chapters) {
                    const lesson = chapter.lessons.find(l => l.id === lessonId);
                    if (lesson) return lesson;
                }
            }
        }
        return null;
    }

    // 次の講義に進む
    nextLesson() {
        if (!this.currentLesson || !this.currentCourse) return;
        
        const nextLesson = this.findNextLesson(this.currentLesson);
        if (nextLesson) {
            this.showLesson(nextLesson.id);
        } else {
            // 最後の講義の場合、コース完了メッセージを表示
            this.showCourseCompletionMessage();
        }
    }

    // 前の講義に戻る
    prevLesson() {
        if (!this.currentLesson || !this.currentCourse) return;
        
        const prevLesson = this.findPrevLesson(this.currentLesson);
        if (prevLesson) {
            this.showLesson(prevLesson.id);
        } else {
            // 最初の講義の場合、コース詳細に戻る
            this.showCourse(this.currentCourse);
        }
    }

    // 次の講義を検索
    findNextLesson(currentLessonId) {
        for (const chapter of this.currentCourse.chapters) {
            const lessons = chapter.lessons;
            const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
            
            if (currentIndex !== -1) {
                // 同じ章の次の講義
                if (currentIndex < lessons.length - 1) {
                    return lessons[currentIndex + 1];
                }
                
                // 次の章の最初の講義
                const chapterIndex = this.currentCourse.chapters.findIndex(c => c.id === chapter.id);
                if (chapterIndex < this.currentCourse.chapters.length - 1) {
                    const nextChapter = this.currentCourse.chapters[chapterIndex + 1];
                    return nextChapter.lessons[0];
                }
                
                // 最後の講義
                return null;
            }
        }
        return null;
    }

    // 前の講義を検索
    findPrevLesson(currentLessonId) {
        for (const chapter of this.currentCourse.chapters) {
            const lessons = chapter.lessons;
            const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
            
            if (currentIndex !== -1) {
                // 同じ章の前の講義
                if (currentIndex > 0) {
                    return lessons[currentIndex - 1];
                }
                
                // 前の章の最後の講義
                const chapterIndex = this.currentCourse.chapters.findIndex(c => c.id === chapter.id);
                if (chapterIndex > 0) {
                    const prevChapter = this.currentCourse.chapters[chapterIndex - 1];
                    return prevChapter.lessons[prevChapter.lessons.length - 1];
                }
                
                // 最初の講義
                return null;
            }
        }
        return null;
    }

    // コース完了メッセージを表示
    showCourseCompletionMessage() {
        const lessonView = document.getElementById('lesson-view');
        lessonView.innerHTML = `
            <div class="course-completion">
                <div class="completion-icon">🎉</div>
                <h2>コース完了おめでとうございます！</h2>
                <p class="completion-message">
                    「${this.currentCourse.title}」のすべての講義を完了しました。<br>
                    お疲れさまでした！
                </p>
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.getTotalCourseLessons(this.currentCourse)}</span>
                        <span class="stat-label">講義完了</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.currentCourse.chapters.length}</span>
                        <span class="stat-label">章完了</span>
                    </div>
                    </div>
                <div class="completion-actions">
                    <button class="completion-btn primary" onclick="app.showSubject(app.currentSubject)">
                        他のコースを見る
                    </button>
                    <button class="completion-btn secondary" onclick="app.showSubjects()">
                        科目選択に戻る
                    </button>
                </div>
            </div>
        `;
    }

    // コースの総講義数を取得
    getTotalCourseLessons(course) {
        let total = 0;
        course.chapters.forEach(chapter => {
            total += chapter.lessons.length;
        });
        return total;
    }

    // ユーザー進捗データを取得
    getUserProgress() {
        if (!window.authManager || !window.authManager.currentUser) {
            return {};
        }
        const userId = window.authManager.currentUser.email;
        const progressKey = `user_progress_${userId}`;
        const saved = localStorage.getItem(progressKey);
        return saved ? JSON.parse(saved) : {};
    }

    // ユーザー進捗データを保存
    saveUserProgress(progress) {
        if (!window.authManager || !window.authManager.currentUser) {
            return;
        }
        const userId = window.authManager.currentUser.email;
        const progressKey = `user_progress_${userId}`;
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    // 講義の完了状態を取得
    isLessonCompleted(lessonId) {
        const progress = this.getUserProgress();
        return progress[lessonId] === true;
    }

    // 講義を完了状態にマーク
    markLessonCompleted(lessonId) {
        const progress = this.getUserProgress();
        progress[lessonId] = true;
        this.saveUserProgress(progress);
        
        // コース進捗を更新
        for (const subject of Object.values(subjects)) {
            const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});
            for (const course of courses) {
                for (const chapter of course.chapters) {
                    const lesson = chapter.lessons.find(l => l.id === lessonId);
                    if (lesson) {
                        this.updateCourseProgress(course);
                        return;
                    }
                }
            }
        }
    }

    // コースの進捗を更新
    updateCourseProgress(course) {
        let completedLessons = 0;
        let totalLessons = 0;
        
        course.chapters.forEach(chapter => {
            chapter.lessons.forEach(lesson => {
                totalLessons++;
                if (this.isLessonCompleted(lesson.id)) {
                    completedLessons++;
                }
            });
        });
        
        course.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    // 講義の現在位置を取得
    getLessonPosition(lessonId) {
        let position = 0;
        let total = 0;
        let found = false;
        
        for (const chapter of this.currentCourse.chapters) {
            for (const lesson of chapter.lessons) {
                total++;
                if (lesson.id === lessonId) {
                    position = total;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        
        return { position, total };
    }

    // イベントリスナーの設定
    bindEvents() {
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentView === 'lesson') {
                    this.showCourse(this.currentCourse);
                } else if (this.currentView === 'course') {
                    this.showSubject(this.currentSubject);
                } else if (this.currentView === 'courses') {
                    this.showSubjects();
                }
            }
        });
    }
}

// アプリケーションの初期化
let app;
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    window.authManager = authManager; // グローバルアクセス用
    
    // 学習関連ページ（index.html、student.html）でのみStudyAppを初期化
    const isStudyPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname.includes('student.html') ||
                       window.location.pathname === '/' ||
                       window.location.pathname.endsWith('/');
    
    if (isStudyPage) {
    app = new StudyApp();
        window.app = app; // グローバルアクセス用
    }
});

// アニメーションCSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .super-admin-badge {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #92400e;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        margin-left: 8px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from {
            box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
        }
        to {
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);
        }
    }
`;
document.head.appendChild(style);