// 受講生専用アプリケーション
class StudentApp extends StudyApp {
    constructor() {
        super();
        this.initStudentSpecific();
    }

    initStudentSpecific() {
        console.log('Initializing student-specific features...');
        console.log('AuthManager exists:', !!window.authManager);
        console.log('User data:', window.authManager?.currentUser);
        
        // 受講生権限チェック
        if (!window.authManager || !window.authManager.requireStudentAuth()) {
            console.log('Student auth check failed');
            return;
        }
        
        console.log('StudentApp initialized for student:', window.authManager.currentUser.name);
        this.updateStudentAuthUI();
    }

    // 受講生専用の認証UI更新
    updateStudentAuthUI() {
        const authSection = document.getElementById('auth-section');
        if (!authSection) {
            console.log('Auth section not found');
            return;
        }

        if (window.authManager && window.authManager.isLoggedIn && window.authManager.currentUser) {
            const currentSchool = window.authManager.getCurrentSchool();
            const userName = window.authManager.currentUser.name || window.authManager.currentUser.email;
            
            console.log('Updating auth UI for user:', userName);
            
            authSection.innerHTML = `
                <div class="user-info">
                    <span class="user-name">こんにちは、${userName}さん</span>
                    <div class="school-selector">
                        <select id="student-school-select" onchange="window.authManager.changeSchool(this.value)">
                            ${Object.values(schools).map(school => `
                                <option value="${school.id}" ${currentSchool && currentSchool.id === school.id ? 'selected' : ''}>
                                    ${school.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <button class="logout-btn" onclick="window.authManager.logout()">ログアウト</button>
                </div>
            `;
        } else {
            console.log('User not logged in, showing login buttons');
            authSection.innerHTML = `
                <div class="auth-buttons">
                    <a href="login.html" class="login-btn">ログイン</a>
                    <a href="../signup.html" class="signup-btn">会員登録</a>
                </div>
            `;
        }
    }

    // 管理者画面へのアクセスを防ぐ
    preventAdminAccess() {
        if (authManager.currentUser && authManager.currentUser.role === 'admin') {
            authManager.showMessage('管理者は学習システムを利用できません', 'error');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            return false;
        }
        return true;
    }
}

// 受講生アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Student page DOM loaded');
    
    // AuthManagerの初期化を待つ
    if (typeof AuthManager !== 'undefined') {
        // AuthManagerが存在しない場合は作成
        if (!window.authManager) {
            window.authManager = new AuthManager();
        }
        
        // 少し遅延してからStudentAppを初期化（AuthManagerの初期化完了を待つ）
        setTimeout(() => {
            console.log('Initializing StudentApp...');
            console.log('Current user:', window.authManager.currentUser);
            console.log('Is logged in:', window.authManager.isLoggedIn);
            
            // StudentAppを初期化
            window.app = new StudentApp();
        }, 100);
    } else {
        console.error('AuthManager not found');
    }
});