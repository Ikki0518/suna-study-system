// スクール管理システム
const schools = {
    'demo-school': {
        id: 'demo-school',
        name: 'デモ学習塾',
        description: 'システムデモ用の学習塾です',
        color: '#ec4899',
        instructors: ['田中先生', '佐藤先生', '山田先生'],
        isDefault: true
    }
};

// 科目とコースデータの定義（新しい階層構造）
// 各スクールで異なるコンテンツを配信可能
const subjects = {
    japanese: {
        id: 'japanese',
        name: '国語',
        description: '読解力・文章力・語彙力を総合的に向上',
        color: '#dc2626',
        icon: '📚',
        courses: [
            {
                id: 'reading-comprehension',
                title: '読解力向上コース',
                description: '文章を正確に読み取る力を身につける',
                progress: 30,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本的な読解技術',
        lessons: [
                            { id: 'jp-read-1-1', title: '講義1：文章の構造を理解しよう', completed: true },
                            { id: 'jp-read-1-2', title: '講義2：キーワードを見つける方法', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'writing-skills',
                title: '作文・小論文コース',
                description: '論理的で説得力のある文章を書く',
                progress: 0,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：文章の基本構成',
                        lessons: [
                            { id: 'jp-write-1-1', title: '講義1：起承転結の使い方', completed: false },
                            { id: 'jp-write-1-2', title: '講義2：段落の組み立て方', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'vocabulary',
                title: '語彙力強化コース',
                description: '豊富な語彙で表現力をアップ',
                progress: 45,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本語彙の習得',
                        lessons: [
                            { id: 'jp-vocab-1-1', title: '講義1：同義語・類義語の使い分け', completed: true },
                            { id: 'jp-vocab-1-2', title: '講義2：敬語の正しい使い方', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'classical-japanese',
                title: '古典・漢文コース',
                description: '古文・漢文の基礎から応用まで',
                progress: 20,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：古文の基本',
                        lessons: [
                            { id: 'jp-classical-1-1', title: '講義1：歴史的仮名遣い', completed: false },
                            { id: 'jp-classical-1-2', title: '講義2：古典文法の基礎', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'literature',
                title: '文学作品研究コース',
                description: '名作を通して読解力と感性を育む',
                progress: 10,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：近現代文学',
                        lessons: [
                            { id: 'jp-lit-1-1', title: '講義1：夏目漱石の世界', completed: false },
                            { id: 'jp-lit-1-2', title: '講義2：芥川龍之介の短編', completed: false }
                        ]
                    }
                ]
            }
        ]
    },
    math: {
        id: 'math',
        name: '数学',
        description: '論理的思考力と問題解決能力を育成',
        color: '#2563eb',
        icon: '🔢',
        courses: [
            {
                id: 'algebra',
                title: '代数コース',
                description: '方程式・関数の基礎から応用まで',
                progress: 45,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：一次関数',
                        lessons: [
                            { id: 'math-alg-1-1', title: '講義1：一次関数の基本', completed: true },
                            { id: 'math-alg-1-2', title: '講義2：グラフの描き方', completed: true },
                            { id: 'math-alg-1-3', title: '講義3：実生活での応用', completed: false }
                        ]
                    },
                    {
                        id: 'chapter2',
                        title: '第2章：二次関数',
                        lessons: [
                            { id: 'math-alg-2-1', title: '講義1：二次関数の基本形', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'geometry',
                title: '幾何コース',
                description: '図形の性質と証明を学ぶ',
                progress: 20,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：平面図形',
                        lessons: [
                            { id: 'math-geo-1-1', title: '講義1：三角形の性質', completed: false },
                            { id: 'math-geo-1-2', title: '講義2：円の性質', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'probability',
                title: '確率・統計コース',
                description: 'データ分析と確率の基礎理論',
                progress: 30,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：確率の基礎',
                        lessons: [
                            { id: 'math-prob-1-1', title: '講義1：場合の数と順列', completed: true },
                            { id: 'math-prob-1-2', title: '講義2：組み合わせの計算', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'calculus',
                title: '微分・積分コース',
                description: '変化率と面積の数学的理解',
                progress: 10,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：微分の基礎',
                        lessons: [
                            { id: 'math-calc-1-1', title: '講義1：導関数の概念', completed: false },
                            { id: 'math-calc-1-2', title: '講義2：微分の公式', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'number-theory',
                title: '数論・整数コース',
                description: '整数の性質と数学的思考力',
                progress: 0,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：素数と約数',
                        lessons: [
                            { id: 'math-num-1-1', title: '講義1：素数の性質', completed: false },
                            { id: 'math-num-1-2', title: '講義2：最大公約数と最小公倍数', completed: false }
                        ]
                    }
                ]
            }
        ]
    },
    english: {
        id: 'english',
        name: '英語',
        description: '4技能（読む・書く・聞く・話す）をバランスよく習得',
        color: '#059669',
        icon: '🌍',
        courses: [
            {
                id: 'grammar',
                title: '英文法コース',
                description: '基礎から応用まで体系的に文法を学習',
                progress: 60,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本文型',
                        lessons: [
                            { id: 'eng-gram-1-1', title: '講義1：be動詞の使い方', completed: true },
                            { id: 'eng-gram-1-2', title: '講義2：一般動詞の使い方', completed: true }
                        ]
                    },
                    {
                        id: 'chapter2',
                        title: '第2章：時制',
                        lessons: [
                            { id: 'eng-gram-2-1', title: '講義1：現在形と過去形', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'reading',
                title: '英語読解コース',
                description: '長文読解力を段階的に向上',
                progress: 25,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本的な読解技術',
                        lessons: [
                            { id: 'eng-read-1-1', title: '講義1：スキミング・スキャニング', completed: false },
                            { id: 'eng-read-1-2', title: '講義2：文脈から意味を推測する', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'speaking',
                title: '英会話・スピーキングコース',
                description: '実践的な英会話スキルを習得',
                progress: 40,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本的な会話表現',
                        lessons: [
                            { id: 'eng-speak-1-1', title: '講義1：自己紹介の仕方', completed: true },
                            { id: 'eng-speak-1-2', title: '講義2：日常会話の基本', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'writing',
                title: '英作文コース',
                description: '正確で伝わりやすい英文を書く',
                progress: 15,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本的な文章構成',
                        lessons: [
                            { id: 'eng-write-1-1', title: '講義1：パラグラフライティング', completed: false },
                            { id: 'eng-write-1-2', title: '講義2：エッセイの構造', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'listening',
                title: 'リスニングコース',
                description: 'ネイティブの英語を聞き取る力を養成',
                progress: 35,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本的な聞き取り技術',
                        lessons: [
                            { id: 'eng-listen-1-1', title: '講義1：音の変化を理解する', completed: true },
                            { id: 'eng-listen-1-2', title: '講義2：会話の流れを掴む', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'vocabulary',
                title: '英単語・熟語コース',
                description: '語彙力を系統的に強化',
                progress: 50,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：基本語彙の習得',
                        lessons: [
                            { id: 'eng-vocab-1-1', title: '講義1：品詞別語彙学習法', completed: true },
                            { id: 'eng-vocab-1-2', title: '講義2：コロケーションの活用', completed: true }
                        ]
                    }
                ]
            }
        ]
    },
    science: {
        id: 'science',
        name: '理科',
        description: '自然現象の理解と科学的思考力を養成',
        color: '#7c3aed',
        icon: '🔬',
        courses: [
            {
                id: 'physics',
                title: '物理コース',
                description: '力学・熱力学・電磁気学の基礎',
                progress: 15,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：力と運動',
                        lessons: [
                            { id: 'sci-phy-1-1', title: '講義1：ニュートンの法則', completed: false },
                            { id: 'sci-phy-1-2', title: '講義2：摩擦力と抵抗', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'chemistry',
                title: '化学コース',
                description: '原子・分子から化学反応まで',
                progress: 35,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：原子の構造',
                        lessons: [
                            { id: 'sci-chem-1-1', title: '講義1：原子と電子', completed: true },
                            { id: 'sci-chem-1-2', title: '講義2：電子配置と周期表', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'biology',
                title: '生物コース',
                description: '生命の仕組みと進化のメカニズム',
                progress: 50,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：細胞の構造と機能',
                        lessons: [
                            { id: 'sci-bio-1-1', title: '講義1：細胞の基本構造', completed: true },
                            { id: 'sci-bio-1-2', title: '講義2：細胞膜の働き', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'earth-science',
                title: '地学コース',
                description: '地球の構造と宇宙の仕組み',
                progress: 20,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：地球の内部構造',
                        lessons: [
                            { id: 'sci-earth-1-1', title: '講義1：プレートテクトニクス', completed: false },
                            { id: 'sci-earth-1-2', title: '講義2：火山と地震のメカニズム', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'experiment',
                title: '実験・観察コース',
                description: '科学的手法と実験技術の習得',
                progress: 10,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：実験の基本',
                        lessons: [
                            { id: 'sci-exp-1-1', title: '講義1：実験器具の使い方', completed: false },
                            { id: 'sci-exp-1-2', title: '講義2：データの記録と分析', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'environmental',
                title: '環境科学コース',
                description: '地球環境問題と持続可能な社会',
                progress: 0,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：環境問題の現状',
                        lessons: [
                            { id: 'sci-env-1-1', title: '講義1：地球温暖化のメカニズム', completed: false },
                            { id: 'sci-env-1-2', title: '講義2：生物多様性の重要性', completed: false }
                        ]
                    }
                ]
            }
        ]
    },
    social: {
        id: 'social',
        name: '社会',
        description: '歴史・地理・公民の総合的な理解',
        color: '#ea580c',
        icon: '🌏',
        courses: [
            {
                id: 'history',
                title: '日本史コース',
                description: '古代から現代までの日本の歴史',
                progress: 40,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：古代日本',
                        lessons: [
                            { id: 'soc-hist-1-1', title: '講義1：縄文・弥生時代', completed: true },
                            { id: 'soc-hist-1-2', title: '講義2：古墳時代と大和政権', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'world-history',
                title: '世界史コース',
                description: '世界の歴史と文明の発展',
                progress: 25,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：古代文明',
                        lessons: [
                            { id: 'soc-world-1-1', title: '講義1：メソポタミア文明', completed: true },
                            { id: 'soc-world-1-2', title: '講義2：エジプト文明', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'geography',
                title: '地理コース',
                description: '世界と日本の地理的特徴を学ぶ',
                progress: 10,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：世界の気候',
                        lessons: [
                            { id: 'soc-geo-1-1', title: '講義1：気候区分の基礎', completed: false },
                            { id: 'soc-geo-1-2', title: '講義2：気候と人間生活', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'civics',
                title: '公民・政治経済コース',
                description: '現代社会の仕組みと課題',
                progress: 30,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：政治制度の基礎',
                        lessons: [
                            { id: 'soc-civics-1-1', title: '講義1：民主主義と選挙制度', completed: true },
                            { id: 'soc-civics-1-2', title: '講義2：三権分立の仕組み', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'economics',
                title: '経済学入門コース',
                description: '経済の基本原理と市場の仕組み',
                progress: 20,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：経済の基本概念',
                        lessons: [
                            { id: 'soc-econ-1-1', title: '講義1：需要と供給の法則', completed: false },
                            { id: 'soc-econ-1-2', title: '講義2：市場経済の特徴', completed: false }
                        ]
                    }
                ]
            },
            {
                id: 'current-events',
                title: '現代社会・時事問題コース',
                description: '今日の社会問題と国際情勢',
                progress: 15,
                chapters: [
                    {
                        id: 'chapter1',
                        title: '第1章：グローバル化と国際関係',
                        lessons: [
                            { id: 'soc-current-1-1', title: '講義1：国際連合の役割', completed: false },
                            { id: 'soc-current-1-2', title: '講義2：地球規模の課題', completed: false }
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
            this.currentSchool = schools['demo-school'];
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
        return this.currentSchool || schools['demo-school'];
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

        if (!this.currentUser.role || this.currentUser.role !== 'admin') {
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
        this.renderSubjects(); // 科目選択画面を表示
        this.updateSidebar();
        this.bindEvents();
    }

    // 科目選択画面を表示
    renderSubjects() {
        const homeView = document.getElementById('home-view');
        if (!homeView) return;
        
        homeView.innerHTML = `
            <div class="subjects-header">
                <h2>学習科目を選択してください</h2>
                <p>興味のある科目から学習を始めましょう</p>
            </div>
            <div class="subjects-grid" id="subjects-grid">
            </div>
        `;

        const subjectsGrid = document.getElementById('subjects-grid');
        
        Object.values(subjects).forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <div class="subject-icon" style="color: ${subject.color}">
                    ${subject.icon}
                </div>
                <h3 class="subject-name">${subject.name}</h3>
                <p class="subject-description">${subject.description}</p>
                <div class="subject-stats">
                    <span class="course-count">${subject.courses.length}コース</span>
                    <span class="total-lessons">${this.getTotalLessons(subject)}講義</span>
                </div>
                <button class="subject-button" style="background-color: ${subject.color}">
                    学習を開始
                </button>
            `;
            
            subjectCard.addEventListener('click', () => {
                if (authManager.requireAuth()) {
                    this.showSubject(subject);
                }
            });
            
            subjectsGrid.appendChild(subjectCard);
        });
    }

    // コース一覧を表示
    renderCourses(subject) {
        const homeView = document.getElementById('home-view');
        if (!homeView) return;
        
        homeView.innerHTML = `
            <div class="courses-header">
                <h2>${subject.icon} ${subject.name}のコース一覧</h2>
                <p>${subject.description}</p>
            </div>
            <div class="course-list" id="course-list">
            </div>
        `;

        const courseList = document.getElementById('course-list');

        subject.courses.forEach(course => {
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
                if (authManager.requireAuth()) {
                this.showCourse(course);
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
        
        if (this.currentView === 'subjects' || this.currentView === 'courses') {
            sidebar.style.display = 'none';
            container.classList.remove('with-sidebar');
        } else {
            sidebar.style.display = 'block';
            container.classList.add('with-sidebar');
            
            if (this.currentCourse && chapterList) {
                chapterList.innerHTML = '';
                
                this.currentCourse.chapters.forEach(chapter => {
                    const chapterItem = document.createElement('div');
                    chapterItem.className = 'chapter-item';
                    chapterItem.innerHTML = chapter.title;
                    chapterItem.addEventListener('click', () => {
                        this.showCourse(this.currentCourse);
                    });
                    chapterList.appendChild(chapterItem);
                    
                    chapter.lessons.forEach(lesson => {
                        const lessonItem = document.createElement('div');
                        lessonItem.className = 'chapter-item lesson-item-sidebar';
                        lessonItem.innerHTML = lesson.title;
                        lessonItem.addEventListener('click', () => {
                            this.showLesson(lesson.id);
                        });
                        chapterList.appendChild(lessonItem);
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
                                <div class="lesson-checkbox ${lesson.completed ? 'completed' : ''}">
                                    ${lesson.completed ? '✓' : ''}
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
        this.currentView = 'courses';
        this.currentSubject = subject;
        this.currentCourse = null;
        this.currentLesson = null;

        this.hideAllViews();
        this.updateSidebar();
        this.updateBreadcrumb();
        
        document.getElementById('home-view').style.display = 'block';
        this.renderCourses(subject);
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
        subject.courses.forEach(course => {
            course.chapters.forEach(chapter => {
                total += chapter.lessons.length;
            });
        });
        return total;
    }

    // レッスンIDから講義を検索
    findLessonById(lessonId) {
        for (const subject of Object.values(subjects)) {
            for (const course of subject.courses) {
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

    // 講義を完了状態にマーク
    markLessonCompleted(lessonId) {
        for (const subject of Object.values(subjects)) {
            for (const course of subject.courses) {
                for (const chapter of course.chapters) {
                    const lesson = chapter.lessons.find(l => l.id === lessonId);
                    if (lesson) {
                        lesson.completed = true;
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
                if (lesson.completed) {
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
    app = new StudyApp();
    window.app = app; // グローバルアクセス用
    window.authManager = authManager; // グローバルアクセス用
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