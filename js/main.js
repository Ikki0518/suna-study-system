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
    'demo-japanese': {
        id: 'demo-japanese',
        name: '国語',
        description: '現代文・古文・漢文の総合的な学習',
        color: '#dc2626',
        instructor: '国語担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'japanese-modern',
                title: '現代文基礎',
                description: '読解力と表現力を身につける',
                chapters: [
                    {
                        id: 'japanese-ch1',
                        title: '第1章：文章読解の基本',
                        lessons: [
                            {
                                id: 'japanese1-1',
                                title: '文章の構成と要約',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'japanese1-2',
                                title: '論説文の読み方',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'japanese1-3',
                                title: '小説の読解技法',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-math': {
        id: 'demo-math',
        name: '数学',
        description: '基礎から応用まで体系的に学習',
        color: '#2563eb',
        instructor: '数学担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'math-algebra',
                title: '代数基礎',
                description: '方程式と関数の基本',
                chapters: [
                    {
                        id: 'math-ch1',
                        title: '第1章：方程式の基礎',
                        lessons: [
                            {
                                id: 'math1-1',
                                title: '一次方程式',
                                duration: '20分',
                                completed: false
                            },
                            {
                                id: 'math1-2',
                                title: '連立方程式',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'math1-3',
                                title: '一次関数',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'math1-4',
                                title: '二次方程式',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-science': {
        id: 'demo-science',
        name: '理科',
        description: '物理・化学・生物・地学の基礎',
        color: '#059669',
        instructor: '理科担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'science-physics',
                title: '物理基礎',
                description: '力学と電気の基本原理',
                chapters: [
                    {
                        id: 'physics-ch1',
                        title: '第1章：力学の基本',
                        lessons: [
                            {
                                id: 'physics1-1',
                                title: '運動の法則',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'physics1-2',
                                title: '力とつりあい',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'physics1-3',
                                title: '電流と電圧',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-social': {
        id: 'demo-social',
        name: '社会',
        description: '地理・歴史・公民の総合学習',
        color: '#d97706',
        instructor: '社会担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'social-geography',
                title: '地理基礎',
                description: '日本と世界の地理',
                chapters: [
                    {
                        id: 'geography-ch1',
                        title: '第1章：日本の自然環境',
                        lessons: [
                            {
                                id: 'geo1-1',
                                title: '日本の地形と気候',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'geo1-2',
                                title: '世界の気候区分',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'geo1-3',
                                title: '産業と貿易',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-japanese-history': {
        id: 'demo-japanese-history',
        name: '日本史',
        description: '古代から現代までの日本の歴史',
        color: '#7c3aed',
        instructor: '日本史担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'jhistory-ancient',
                title: '古代・中世の日本',
                description: '奈良時代から鎌倉・室町時代まで',
                chapters: [
                    {
                        id: 'jhistory-ch1',
                        title: '第1章：古代国家の成立',
                        lessons: [
                            {
                                id: 'jhistory1-1',
                                title: '奈良時代と平安時代',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jhistory1-2',
                                title: '鎌倉幕府の成立',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'jhistory1-3',
                                title: '室町時代と戦国時代',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-world-history': {
        id: 'demo-world-history',
        name: '世界史',
        description: '古代文明から現代史まで',
        color: '#be185d',
        instructor: '世界史担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'whistory-ancient',
                title: '古代文明',
                description: '四大文明と古代帝国',
                chapters: [
                    {
                        id: 'whistory-ch1',
                        title: '第1章：文明の起源',
                        lessons: [
                            {
                                id: 'whistory1-1',
                                title: '四大文明の特徴',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory1-2',
                                title: 'ギリシア・ローマ文明',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory1-3',
                                title: '中国古代王朝',
                                duration: '28分',
                                completed: false
                            }
                        ]
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
    'japanese1-1': {
        title: '文章の構成と要約',
        videoUrl: 'videos/japanese-composition.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、文章の基本的な構成を理解し、要約する技術を身につけます。</p>
            </div>

            <h4>文章の基本構成</h4>
            <div class="composition-elements">
                <div class="element">
                    <h5>1. 序論（はじめ）</h5>
                    <p>文章の目的や論点を提示する部分です。読み手の興味を引き、これから何について述べるかを明確にします。</p>
                </div>
                <div class="element">
                    <h5>2. 本論（なか）</h5>
                    <p>具体的な内容を展開する部分です。根拠や例を示しながら、論点を詳しく説明します。</p>
                </div>
                <div class="element">
                    <h5>3. 結論（おわり）</h5>
                    <p>文章全体をまとめ、結論を示す部分です。読み手に印象を残す重要な役割があります。</p>
                </div>
            </div>

            <h4>要約のポイント</h4>
            <ul>
                <li><strong>主題を把握する</strong>：文章で最も伝えたいことは何か</li>
                <li><strong>重要な部分を見つける</strong>：キーワードや重要な文を特定</li>
                <li><strong>不要な部分を削る</strong>：具体例や詳細説明は省略</li>
                <li><strong>自分の言葉で表現</strong>：原文をそのまま写すのではなく言い換える</li>
            </ul>
        `
    },
    'math1-1': {
        title: '一次方程式',
        videoUrl: 'videos/math-linear-equation.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>一次方程式の基本的な解き方を学習します。未知数を求める重要な技術です。</p>
            </div>

            <h4>一次方程式とは</h4>
            <p>文字（未知数）を1つ含み、その文字の最高次数が1である方程式のことです。</p>
            <p>例：2x + 5 = 11</p>

            <h4>基本的な解き方</h4>
            <div class="math-steps">
                <div class="step">
                    <h5>ステップ1：移項</h5>
                    <p>等号を挟んで項を移動する際は、符号を変えます。</p>
                    <p>2x + 5 = 11<br>2x = 11 - 5<br>2x = 6</p>
                </div>
                <div class="step">
                    <h5>ステップ2：両辺を同じ数で割る</h5>
                    <p>係数で両辺を割って、xの値を求めます。</p>
                    <p>2x = 6<br>x = 6 ÷ 2<br>x = 3</p>
                </div>
            </div>

            <h4>検算</h4>
            <p>求めた解を元の式に代入して確認します。</p>
            <p>2 × 3 + 5 = 6 + 5 = 11 ✓</p>
        `
    },
    'physics1-1': {
        title: '運動の法則',
        videoUrl: 'videos/physics-motion.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>物体の運動を理解するための基本法則を学習します。</p>
            </div>

            <h4>ニュートンの運動法則</h4>
            <div class="physics-laws">
                <div class="law">
                    <h5>第1法則（慣性の法則）</h5>
                    <p>物体は、外から力を加えられない限り、静止している物体は静止し続け、運動している物体は等速直線運動を続けます。</p>
                </div>
                <div class="law">
                    <h5>第2法則（運動の法則）</h5>
                    <p>物体の加速度は、作用する力に比例し、質量に反比例します。</p>
                    <p><strong>F = ma</strong></p>
                    <p>F：力[N]、m：質量[kg]、a：加速度[m/s²]</p>
                </div>
                <div class="law">
                    <h5>第3法則（作用・反作用の法則）</h5>
                    <p>物体Aが物体Bに力を加えると、物体Bも物体Aに同じ大きさで逆向きの力を加えます。</p>
                </div>
            </div>

            <h4>具体例</h4>
            <ul>
                <li><strong>慣性</strong>：電車が急停車すると体が前に傾く</li>
                <li><strong>運動の法則</strong>：重い物は動かしにくい</li>
                <li><strong>作用・反作用</strong>：歩くときは地面を押し、地面が足を押し返す</li>
            </ul>
        `
    },
    'geo1-1': {
        title: '日本の地形と気候',
        videoUrl: 'videos/geography-japan.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>日本列島の地形的特徴と気候の特色について学習します。</p>
            </div>

            <h4>日本の地形</h4>
            <div class="geography-features">
                <div class="feature">
                    <h5>山地の特徴</h5>
                    <p>日本の面積の約75％を山地が占めています。主要な山脈：</p>
                    <ul>
                        <li><strong>日本アルプス</strong>：飛騨・木曽・赤石山脈</li>
                        <li><strong>中国山地</strong>：本州西部の山地</li>
                        <li><strong>九州山地</strong>：九州中央部の山地</li>
                    </ul>
                </div>
                <div class="feature">
                    <h5>平野の特徴</h5>
                    <p>人口が集中し、農業や工業が発達しています。主要な平野：</p>
                    <ul>
                        <li><strong>関東平野</strong>：日本最大の平野</li>
                        <li><strong>濃尾平野</strong>：愛知県・岐阜県</li>
                        <li><strong>大阪平野</strong>：近畿地方の中心</li>
                    </ul>
                </div>
            </div>

            <h4>日本の気候</h4>
            <div class="climate-zones">
                <div class="zone">
                    <h5>温帯湿潤気候</h5>
                    <p>本州・四国・九州の大部分。四季がはっきりしており、梅雨と台風の影響を受けます。</p>
                </div>
                <div class="zone">
                    <h5>亜寒帯気候</h5>
                    <p>北海道の大部分。冬は長く厳しく、夏は短く涼しいのが特徴です。</p>
                </div>
            </div>
        `
    },
    'jhistory1-1': {
        title: '奈良時代と平安時代',
        videoUrl: 'videos/history-nara-heian.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>奈良時代から平安時代にかけての政治・文化の変化を学習します。</p>
            </div>

            <h4>奈良時代（710-794年）</h4>
            <div class="historical-period">
                <div class="politics">
                    <h5>政治</h5>
                    <ul>
                        <li><strong>律令制</strong>：中国にならった政治制度</li>
                        <li><strong>平城京</strong>：日本初の本格的な都城</li>
                        <li><strong>聖武天皇</strong>：東大寺・大仏を建立</li>
                    </ul>
                </div>
                <div class="culture">
                    <h5>文化</h5>
                    <ul>
                        <li><strong>天平文化</strong>：仏教中心の国際的文化</li>
                        <li><strong>正倉院</strong>：宝物の保管庫</li>
                        <li><strong>万葉集</strong>：日本最古の歌集</li>
                    </ul>
                </div>
            </div>

            <h4>平安時代（794-1185年）</h4>
            <div class="historical-period">
                <div class="politics">
                    <h5>政治</h5>
                    <ul>
                        <li><strong>平安京</strong>：京都に遷都</li>
                        <li><strong>摂関政治</strong>：藤原氏による政治</li>
                        <li><strong>院政</strong>：上皇による政治</li>
                    </ul>
                </div>
                <div class="culture">
                    <h5>文化</h5>
                    <ul>
                        <li><strong>国風文化</strong>：日本独自の文化</li>
                        <li><strong>ひらがな・カタカナ</strong>：日本の文字</li>
                        <li><strong>源氏物語</strong>：紫式部による世界最古の長編小説</li>
                    </ul>
                </div>
            </div>
        `
    },
    'whistory1-1': {
        title: '四大文明の特徴',
        videoUrl: 'videos/world-history-civilizations.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>人類最初の文明である四大文明の特徴と発展について学習します。</p>
            </div>

            <h4>四大文明とは</h4>
            <p>紀元前3500年頃から紀元前2500年頃にかけて、大河のほとりで発達した4つの古代文明です。</p>

            <div class="civilizations">
                <div class="civilization">
                    <h5>メソポタミア文明（チグリス・ユーフラテス川）</h5>
                    <ul>
                        <li><strong>楔形文字</strong>：世界最古の文字</li>
                        <li><strong>ハンムラビ法典</strong>：成文法の始まり</li>
                        <li><strong>都市国家</strong>：ウル、バビロンなど</li>
                    </ul>
                </div>
                
                <div class="civilization">
                    <h5>エジプト文明（ナイル川）</h5>
                    <ul>
                        <li><strong>ヒエログリフ</strong>：神聖文字</li>
                        <li><strong>ピラミッド</strong>：ファラオの墓</li>
                        <li><strong>ミイラ</strong>：死後の世界への信仰</li>
                    </ul>
                </div>
                
                <div class="civilization">
                    <h5>インダス文明（インダス川）</h5>
                    <ul>
                        <li><strong>計画都市</strong>：モヘンジョ・ダロ</li>
                        <li><strong>下水道</strong>：優れた都市計画</li>
                        <li><strong>印章</strong>：商業の発達</li>
                    </ul>
                </div>
                
                <div class="civilization">
                    <h5>中国文明（黄河）</h5>
                    <ul>
                        <li><strong>漢字</strong>：表意文字</li>
                        <li><strong>殷（商）</strong>：最古の王朝</li>
                        <li><strong>青銅器</strong>：高度な技術</li>
                    </ul>
                </div>
            </div>

            <h4>文明の共通点</h4>
            <ul>
                <li><strong>大河のほとり</strong>：農業に適した土地</li>
                <li><strong>文字の発明</strong>：記録・伝達手段</li>
                <li><strong>都市の形成</strong>：人口の集中</li>
                <li><strong>階級社会</strong>：支配者と被支配者</li>
            </ul>
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
                console.log('No subjects found in localStorage, using default subjects');
                // デフォルト科目データをローカルストレージに保存
                localStorage.setItem('subjects', JSON.stringify(subjects));
                console.log('Saved default subjects to storage:', Object.keys(subjects));
            }
        } catch (error) {
            console.error('Error loading subjects from storage:', error);
            // エラーの場合もデフォルトデータを使用
            console.log('Using default subjects due to error');
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