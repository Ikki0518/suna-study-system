// DOM要素の取得
const signupForm = document.getElementById('signupForm');
const googleSignupButton = document.getElementById('googleSignup');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const roleSelect = document.getElementById('role');
const termsCheckbox = document.getElementById('terms');

// フォーム送信イベント
signupForm.addEventListener('submit', handleSignup);
googleSignupButton.addEventListener('click', handleGoogleSignup);

// 通常のサインアップ処理
async function handleSignup(event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const role = roleSelect.value;
    const termsAccepted = termsCheckbox.checked;
    
    // バリデーション
    if (!validateName(name)) {
        showError('お名前を入力してください');
        nameInput.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showError('有効なメールアドレスを入力してください');
        emailInput.focus();
        return;
    }
    
    if (!validatePassword(password)) {
        showError('パスワードは8文字以上で、数字と文字を含めてください');
        passwordInput.focus();
        return;
    }
    
    if (password !== confirmPassword) {
        showError('パスワードが一致しません');
        confirmPasswordInput.focus();
        return;
    }
    
    if (!role) {
        showError('アカウントタイプを選択してください');
        roleSelect.focus();
        return;
    }
    
    // 管理者権限のチェック
    if (role === 'admin') {
        showError('管理者アカウントは直接作成できません。お問い合わせください。');
        return;
    }
    
    if (!termsAccepted) {
        showError('利用規約とプライバシーポリシーに同意してください');
        return;
    }
    
    // ローディング状態を設定
    setLoading(true);
    
    try {
        // ここでAPIにサインアップ情報を送信
        const result = await signupUser({ name, email, password, role });
        
        if (result.success) {
            // 認証情報をローカルストレージに保存
            localStorage.setItem('sunaUser', JSON.stringify({
                email: email,
                name: name,
                role: role,
                loginTime: new Date().toISOString(),
                isNewUser: true
            }));
            
            // ローディング画面を表示してからメインページにリダイレクト
            showLoadingScreen('アカウント作成中...');
            setTimeout(() => {
                // roleに基づいてリダイレクト
                if (role === 'admin') {
                    window.location.href = 'pages/admin.html';
                } else {
                    window.location.href = 'pages/student.html';
                }
            }, 2000);
        } else {
            showError(result.message || 'アカウント作成に失敗しました');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('ネットワークエラーが発生しました。しばらくしてから再度お試しください。');
    } finally {
        setLoading(false);
    }
}

// Googleサインアップ処理
async function handleGoogleSignup() {
    setGoogleLoading(true);
    
    try {
        // Google認証のシミュレーション
        showInfo('Google認証を開始しています...');
        
        // デモ用の遅延
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 認証情報をローカルストレージに保存
        localStorage.setItem('sunaUser', JSON.stringify({
            email: 'google-user@example.com',
            name: 'Googleユーザー',
            role: 'student',
            loginTime: new Date().toISOString(),
            provider: 'google',
            isNewUser: true
        }));
        
        // ローディング画面を表示してからメインページにリダイレクト
        showLoadingScreen('アカウント作成中...');
        setTimeout(() => {
            window.location.href = 'pages/student.html';
        }, 2000);
    } catch (error) {
        console.error('Google signup error:', error);
        showError('Google認証に失敗しました');
    } finally {
        setGoogleLoading(false);
    }
}

// ユーザー登録 API（デモ版）
async function signupUser(userData) {
    // 実際のAPIコールをシミュレート
    return new Promise((resolve) => {
        setTimeout(() => {
            // 既存ユーザーのチェック（デモ用）
            if (userData.email === 'demo@suna.com') {
                resolve({ 
                    success: false, 
                    message: 'このメールアドレスは既に登録されています' 
                });
            } else {
                resolve({ 
                    success: true, 
                    user: {
                        id: Date.now(),
                        name: userData.name,
                        email: userData.email,
                        role: userData.role
                    }
                });
            }
        }, 1500);
    });
}

// バリデーション関数
function validateName(name) {
    return name.length >= 1;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // 8文字以上で、数字と文字を含む
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    
    return minLength && hasNumber && hasLetter;
}

// ローディング状態の設定
function setLoading(isLoading) {
    const signupButton = document.querySelector('.login-button');
    const buttonText = isLoading ? 'アカウント作成中...' : 'アカウントを作成';
    
    signupButton.textContent = buttonText;
    signupButton.disabled = isLoading;
    
    // フォーム要素の無効化
    nameInput.disabled = isLoading;
    emailInput.disabled = isLoading;
    passwordInput.disabled = isLoading;
    confirmPasswordInput.disabled = isLoading;
    roleSelect.disabled = isLoading;
    termsCheckbox.disabled = isLoading;
}

// Googleサインアップボタンのローディング状態
function setGoogleLoading(isLoading) {
    const buttonText = isLoading ? 'Google認証中...' : 'Googleアカウントで登録';
    
    googleSignupButton.innerHTML = isLoading 
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
    
    googleSignupButton.disabled = isLoading;
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
    
    // 4秒後に自動削除（サインアップの場合は少し長めに表示）
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 4000);
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

// パスワード強度のリアルタイム表示
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const isValid = validatePassword(password);
    
    if (password.length > 0) {
        passwordInput.style.borderColor = isValid ? '#10b981' : '#ef4444';
    } else {
        passwordInput.style.borderColor = '#e5e7eb';
    }
});

// パスワード確認のリアルタイム表示
confirmPasswordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword.length > 0) {
        const isMatch = password === confirmPassword;
        confirmPasswordInput.style.borderColor = isMatch ? '#10b981' : '#ef4444';
    } else {
        confirmPasswordInput.style.borderColor = '#e5e7eb';
    }
});

// エンターキーでのフォーム送信をサポート
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        emailInput.focus();
    }
});

emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmPasswordInput.focus();
    }
});

confirmPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        signupForm.dispatchEvent(new Event('submit'));
    }
});