// DOM要素の取得
const loginForm = document.getElementById('loginForm');
const googleLoginButton = document.getElementById('googleLogin');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    checkSpecialLoginUrl();
});

// フォーム送信イベント
loginForm.addEventListener('submit', handleLogin);
googleLoginButton.addEventListener('click', handleGoogleLogin);

// 専用URLからのアクセスをチェック
function checkSpecialLoginUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const auto = urlParams.get('auto');
    
    if (email && auto === 'true') {
        // 専用URLからのアクセスの場合
        emailInput.value = decodeURIComponent(email);
        passwordInput.focus(); // パスワード入力にフォーカス
        
        // 専用URL用のメッセージを表示
        showInfo('管理者から発行された専用URLでアクセスしています。パスワードを入力してログインしてください。');
        
        // フォームにヒントを追加
        const formContainer = document.querySelector('.login-form');
        if (formContainer && !document.getElementById('special-url-hint')) {
            const hintDiv = document.createElement('div');
            hintDiv.id = 'special-url-hint';
            hintDiv.className = 'special-url-hint';
            hintDiv.innerHTML = `
                <div class="hint-content">
                    <h4>📝 ログイン方法</h4>
                    <p>管理者から受け取ったパスワードを入力してください</p>
                    <p>パスワードが分からない場合は、管理者にお問い合わせください</p>
                </div>
            `;
            formContainer.insertBefore(hintDiv, formContainer.firstChild);
        }
    }
}

// 通常のログイン処理
async function handleLogin(event) {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // バリデーション
    if (!validateEmail(email)) {
        showError('有効なメールアドレスを入力してください');
        emailInput.focus();
        return;
    }
    
    if (!password) {
        showError('パスワードを入力してください');
        passwordInput.focus();
        return;
    }
    
    // ローディング状態を設定
    setLoading(true);
    
    try {
        // 管理者アカウント作成の特別処理
        if (password === 'admin123' && email !== 'admin@suna.com') {
            // 新しい管理者アカウントを作成
            const result = await createAdminAccount({ email, password });
            
            if (result.success) {
                localStorage.setItem('sunaUser', JSON.stringify({
                    email: email,
                    name: email.split('@')[0], // メールの@より前を名前として使用
                    role: 'admin',
                    loginTime: new Date().toISOString(),
                    isNewAdmin: true
                }));
                
                showLoadingScreen('管理者アカウント作成中...');
                setTimeout(() => {
                    window.location.href = '/pages/admin.html';
                }, 2000);
                return;
            }
        }
        
        // 通常のログイン処理
        const result = await loginUser({ email, password });
        
        if (result.success) {
            // 認証情報をローカルストレージに保存
            localStorage.setItem('sunaUser', JSON.stringify({
                email: email,
                name: result.user.name,
                role: result.user.role,
                loginTime: new Date().toISOString()
            }));
            
            // ローディング画面を表示してからメインページにリダイレクト
            showLoadingScreen('ログイン中...');
            setTimeout(() => {
                // roleに基づいてリダイレクト
                if (result.user.role === 'admin' || result.user.role === 'super_admin') {
                    window.location.href = '/pages/admin.html';
                } else {
                    window.location.href = '/pages/student.html';
                }
            }, 2000);
        } else {
            showError(result.message || 'ログインに失敗しました');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('ネットワークエラーが発生しました。しばらくしてから再度お試しください。');
    } finally {
        setLoading(false);
    }
}

// Googleログイン処理
async function handleGoogleLogin() {
    setGoogleLoading(true);
    
    try {
        // Google認証のシミュレーション
        // 実際の実装では、Google OAuth APIを使用
        showInfo('Google認証を開始しています...');
        
        // デモ用の遅延
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 認証情報をローカルストレージに保存
        localStorage.setItem('sunaUser', JSON.stringify({
            email: 'google-user@example.com',
            name: 'Googleユーザー',
            role: 'student',
            loginTime: new Date().toISOString(),
            provider: 'google'
        }));
        
        // ローディング画面を表示してからメインページにリダイレクト
        showLoadingScreen();
        setTimeout(() => {
            window.location.href = '/pages/student.html';
        }, 2000);
    } catch (error) {
        console.error('Google login error:', error);
        showError('Google認証に失敗しました');
    } finally {
        setGoogleLoading(false);
    }
}

// ユーザーログイン API（デモ版）
async function loginUser(userData) {
    // 実際のAPIコールをシミュレート
    return new Promise((resolve) => {
        setTimeout(() => {
            // スーパー管理者のログイン処理
            if (userData.email === 'ikki_y0518@icloud.com' && userData.password === 'ikki0518') {
                resolve({
                    success: true,
                    user: {
                        email: userData.email,
                        name: 'Ikki Yamamoto',
                        role: 'super_admin'
                    }
                });
            }
            // デモ用認証ロジック - 管理者と受講生アカウントを追加
            else if (userData.email === 'admin@suna.com' && userData.password === 'admin123') {
                resolve({
                    success: true,
                    user: {
                        email: userData.email,
                        name: '管理者',
                        role: 'admin'
                    }
                });
            } else if (userData.email === 'demo@suna.com' && userData.password === 'password123') {
                resolve({
                    success: true,
                    user: {
                        email: userData.email,
                        name: 'デモユーザー',
                        role: 'student'
                    }
                });
            }
            // 管理者から登録された受講生のログイン処理
            else {
                // ローカルストレージから登録された受講生情報を確認
                const registeredUsers = JSON.parse(localStorage.getItem('sunaUsers') || '[]');
                const registeredUser = registeredUsers.find(user => 
                    user.email === userData.email && user.password === userData.password
                );
                
                if (registeredUser) {
                    // 初回ログインの場合、登録データのステータスを更新
                    if (registeredUser.role === 'student') {
                        const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
                        const registration = registrations.find(r => r.id === registeredUser.registrationId);
                        if (registration && registration.status === 'unused') {
                            registration.status = 'active';
                            registration.first_login_at = new Date().toISOString();
                            localStorage.setItem('studentRegistrations', JSON.stringify(registrations));
                        }
                    }
                    
                    resolve({
                        success: true,
                        user: {
                            email: userData.email,
                            name: registeredUser.name,
                            role: registeredUser.role,
                            schoolId: registeredUser.schoolId,
                            grade: registeredUser.grade,
                            isRegisteredStudent: true
                        }
                    });
                }
                // 旧招待システムの互換性チェック
                else {
                    const invitedStudents = JSON.parse(localStorage.getItem('invitedStudents') || '[]');
                    const invitedStudent = invitedStudents.find(student => 
                        student.email === userData.email && student.tempPassword === userData.password
                    );
                    
                    if (invitedStudent) {
                        resolve({
                            success: true,
                            user: {
                                email: userData.email,
                                name: invitedStudent.name,
                                role: 'student',
                                schoolId: invitedStudent.schoolId,
                                grade: invitedStudent.grade,
                                isInvitedStudent: true
                            }
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'メールアドレスまたはパスワードが正しくありません'
                        });
                    }
                }
            }
        }, 1500);
    });
}

// 管理者アカウント作成 API（デモ版）
async function createAdminAccount(userData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                user: {
                    id: Date.now(),
                    name: userData.email.split('@')[0],
                    email: userData.email,
                    role: 'admin'
                }
            });
        }, 1500);
    });
}

// メールアドレスのバリデーション
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ローディング状態の設定
function setLoading(isLoading) {
    const loginButton = document.querySelector('.login-button');
    const buttonText = isLoading ? 'ログイン中...' : 'ログイン';
    
    loginButton.textContent = buttonText;
    loginButton.disabled = isLoading;
    
    // フォーム要素の無効化
    emailInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
}

// Googleログインボタンのローディング状態
function setGoogleLoading(isLoading) {
    const buttonText = isLoading ? 'Google認証中...' : 'Googleアカウントでログイン';
    
    googleLoginButton.innerHTML = isLoading 
        ? buttonText 
        : `
            <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75 4.8 4.8 0 0 1-4.52-3.31H1.83v2.08A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.46 10.46a4.8 4.8 0 0 1-.25-1.46c0-.51.09-.98.25-1.46V5.46H1.83a8 8 0 0 0 0 7.08l2.63-2.08z"/>
                <path fill="#EA4335" d="M8.98 4.24c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98 1a8 8 0 0 0-7.15 4.46l2.63 2.08A4.8 4.8 0 0 1 8.98 4.24z"/>
            </svg>
            ${buttonText}
        `;
    
    googleLoginButton.disabled = isLoading;
}

// 通知メッセージの表示
function showMessage(message, type = 'info') {
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

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showInfo(message) {
    showMessage(message, 'info');
}

// ローディング画面を表示
function showLoadingScreen(message = 'ログイン中...') {
    // フォームを非表示にする
    const loginFormContainer = document.querySelector('.login-form-container');
    if (loginFormContainer) {
        loginFormContainer.style.display = 'none';
    }
    
    // ローディング画面を作成
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <svg width="115" height="55" viewBox="0 0 115 55">
                    <!-- 大きな円（右上、明るいターコイズブルー） -->
                    <circle cx="90" cy="20" r="13" fill="#67E8F9" opacity="0.85" class="bubble bubble-1"/>
                    
                    <!-- 中くらいの円（左中央、濃いブルー） -->
                    <circle cx="73" cy="28" r="8" fill="#2563EB" opacity="0.9" class="bubble bubble-2"/>
                    
                    <!-- 小さな円（右下、薄いターコイズ） -->
                    <circle cx="83" cy="35" r="5" fill="#A7F3D0" opacity="0.75" class="bubble bubble-3"/>
                    
                    <!-- テキスト "suna" -->
                    <text x="0" y="42" font-size="26" font-weight="700" fill="#1E293B" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" letter-spacing="-1.2px">
                        suna
                    </text>
                </svg>
            </div>
            <p class="loading-text">${message}</p>
        </div>
    `;
    
    // ローディング画面をメインコンテナに追加
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
        loginContainer.appendChild(loadingScreen);
    }
}

// アニメーションCSS
const style = document.createElement('style');
style.textContent = `
    /* ローディング画面のスタイル */
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .loading-content {
        text-align: center;
    }
    
    .loading-logo {
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
    }
    
    .loading-text {
        font-size: 18px;
        color: #64748b;
        font-weight: 500;
        margin: 0;
    }
    
    /* 泡のアニメーション */
    .bubble {
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
    }
    
    .bubble-1 {
        animation-name: float1;
        animation-delay: 0s;
    }
    
    .bubble-2 {
        animation-name: float2;
        animation-delay: 0.5s;
    }
    
    .bubble-3 {
        animation-name: float3;
        animation-delay: 1s;
    }
    
    @keyframes float1 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.85; }
        50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
    }
    
    @keyframes float2 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.9; }
        50% { transform: translateY(-8px) scale(1.05); opacity: 1; }
    }
    
    @keyframes float3 {
        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.75; }
        50% { transform: translateY(-6px) scale(1.15); opacity: 1; }
    }
    
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
`;
document.head.appendChild(style);

// デモ用のヘルプメッセージ
window.addEventListener('load', () => {
    setTimeout(() => {
        showInfo('デモ用 - 受講生: demo@suna.com / password123、管理者: admin@suna.com / admin123');
    }, 1000);
});

// エンターキーでのフォーム送信をサポート
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});