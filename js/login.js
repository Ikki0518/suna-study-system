// ログイン機能
class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔐 LoginManager initializing...');
        this.setupEventListeners();
        this.checkExistingLogin();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const demoLoginBtn = document.getElementById('demoLogin');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (demoLoginBtn) {
            demoLoginBtn.addEventListener('click', () => this.handleDemoLogin());
        }
    }

    checkExistingLogin() {
        // 既にログインしている場合は学習画面にリダイレクト
        const currentUser = localStorage.getItem('sunaUser');
        if (currentUser) {
            console.log('🔐 User already logged in, redirecting...');
            this.redirectToStudentPage();
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMeElement = document.getElementById('rememberMe');
        const rememberMe = rememberMeElement ? rememberMeElement.checked : false;

        console.log('🔐 Attempting login for:', email);

        // バリデーション
        if (!email || !password) {
            this.showMessage('メールアドレスとパスワードを入力してください', 'error');
            return;
        }

        try {
            // ローディング状態を表示
            this.setLoginButtonLoading(true);

            // 実際のログイン処理（デモ用）
            const loginResult = await this.authenticateUser(email, password);
            
            if (loginResult.success) {
                // ログイン成功
                const userData = {
                    id: loginResult.user.id,
                    email: loginResult.user.email,
                    name: loginResult.user.name,
                    grade: loginResult.user.grade,
                    role: loginResult.user.role || 'student',
                    loginTime: new Date().toISOString()
                };

                // ローカルストレージに保存
                localStorage.setItem('sunaUser', JSON.stringify(userData));
                
                if (rememberMe) {
                    localStorage.setItem('sunaRememberLogin', 'true');
                }

                this.showMessage('ログインに成功しました！', 'success');
                
                // 少し待ってからリダイレクト
                setTimeout(() => {
                    this.redirectToStudentPage();
                }, 1000);

            } else {
                this.showMessage(loginResult.message || 'ログインに失敗しました', 'error');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('ログイン処理中にエラーが発生しました', 'error');
        } finally {
            this.setLoginButtonLoading(false);
        }
    }

    async authenticateUser(email, password) {
        // デモ用の認証処理
        return new Promise((resolve) => {
            setTimeout(() => {
                // デモユーザーデータ
                const demoUsers = [
                    {
                        id: 'student1',
                        email: 'student@example.com',
                        password: 'password',
                        name: '田中太郎',
                        grade: '高校2年',
                        role: 'student'
                    },
                    {
                        id: 'student2',
                        email: 'demo@suna.com',
                        password: 'demo',
                        name: 'デモユーザー',
                        grade: '高校1年',
                        role: 'student'
                    }
                ];

                const user = demoUsers.find(u => u.email === email && u.password === password);
                
                if (user) {
                    resolve({
                        success: true,
                        user: user
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'メールアドレスまたはパスワードが正しくありません'
                    });
                }
            }, 1000); // 1秒の遅延でリアルな感じを演出
        });
    }

    handleDemoLogin() {
        console.log('🔐 Demo login requested');
        
        // デモユーザーの情報を自動入力
        document.getElementById('email').value = 'demo@suna.com';
        document.getElementById('password').value = 'demo';
        
        // フォームを送信
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }

    setLoginButtonLoading(isLoading) {
        const loginButton = document.querySelector('.login-button');
        
        if (!loginButton) return;

        if (isLoading) {
            loginButton.disabled = true;
            loginButton.style.opacity = '0.7';
            loginButton.textContent = 'ログイン中...';
        } else {
            loginButton.disabled = false;
            loginButton.style.opacity = '1';
            loginButton.textContent = 'ログイン';
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messageContainer');
        const messageElement = document.getElementById('message');
        
        if (messageContainer && messageElement) {
            messageElement.textContent = message;
            messageElement.className = `message ${type}`;
            messageContainer.style.display = 'block';
            
            // 3秒後に自動で非表示
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 3000);
        }
    }

    redirectToStudentPage() {
        console.log('🔐 Redirecting to student page...');
        window.location.href = 'pages/student.html';
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Login page loaded');
    new LoginManager();
});

// グローバルに公開（デバッグ用）
window.LoginManager = LoginManager;