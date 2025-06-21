// 受講生専用アプリケーション
class StudentApp extends StudyApp {
    constructor() {
        super();
        this.initStudentSpecific();
    }

    initStudentSpecific() {
        // 受講生権限チェック
        if (!authManager.requireStudentAuth()) {
            return;
        }
        
        console.log('StudentApp initialized for student');
        this.updateStudentAuthUI();
    }

    // 受講生専用の認証UI更新
    updateStudentAuthUI() {
        const authSection = document.getElementById('auth-section');
        if (!authSection) return;

        if (authManager && authManager.isLoggedIn && authManager.currentUser) {
            const currentSchool = authManager.getCurrentSchool();
            authSection.innerHTML = `
                <div class="user-info">
                    <span class="user-name">こんにちは、${authManager.currentUser.name || authManager.currentUser.email}さん</span>
                    <div class="school-selector">
                        <select id="student-school-select" onchange="authManager.changeSchool(this.value)">
                            ${Object.values(schools).map(school => `
                                <option value="${school.id}" ${currentSchool && currentSchool.id === school.id ? 'selected' : ''}>
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
    // 既存のグローバル変数を上書き
    if (typeof authManager !== 'undefined' && authManager) {
        app = new StudentApp();
        window.app = app; // グローバルアクセス用
    }
});