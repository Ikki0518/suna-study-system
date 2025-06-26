// 受講生専用アプリケーション
class StudentApp extends StudyApp {
    constructor() {
        super();
        this.initStudentSpecific();
    }

    initStudentSpecific() {
        console.log('🔍 [DIAGNOSIS] Initializing student-specific features...');
        console.log('🔍 [DIAGNOSIS] AuthManager exists:', !!window.authManager);
        console.log('🔍 [DIAGNOSIS] User data:', window.authManager?.currentUser);
        console.log('🔍 [DIAGNOSIS] Current subjects data:', this.subjects);
        console.log('🔍 [DIAGNOSIS] Current view:', this.currentView);
        console.log('🔍 [DIAGNOSIS] DOM elements check:');
        console.log('🔍 [DIAGNOSIS] - subjects-container:', !!document.getElementById('subjects-container'));
        console.log('🔍 [DIAGNOSIS] - main-content:', !!document.getElementById('main-content'));
        console.log('🔍 [DIAGNOSIS] - home-view:', !!document.getElementById('home-view'));
        
        // 受講生権限チェック
        if (!window.authManager || !window.authManager.requireStudentAuth()) {
            console.log('🔍 [DIAGNOSIS] Student auth check failed');
            return;
        }
        
        console.log('🔍 [DIAGNOSIS] StudentApp initialized for student:', window.authManager.currentUser.name);
        this.updateStudentAuthUI();
        
        // データとUI状態の診断
        setTimeout(() => {
            console.log('🔍 [DIAGNOSIS] Post-init check:');
            console.log('🔍 [DIAGNOSIS] - Subjects loaded:', this.subjects?.length || 0);
            console.log('🔍 [DIAGNOSIS] - Current view after init:', this.currentView);
            console.log('🔍 [DIAGNOSIS] - subjects-container content:', document.getElementById('subjects-container')?.innerHTML?.length || 0);
        }, 1000);
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
                    <button class="student-change-password-btn" id="student-password-change-btn">🔐 パスワード変更</button>
                    <button class="logout-btn" onclick="window.authManager.logout()">ログアウト</button>
                </div>
            `;
            
            // HTMLを更新した直後にイベントリスナーを設定
            setTimeout(() => {
                this.setupPasswordChangeButton();
            }, 50);
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

    // パスワード変更ボタンのイベントリスナー設定
    setupPasswordChangeButton() {
        console.log('Setting up password change button...');
        setTimeout(() => {
            const passwordChangeBtn = document.getElementById('student-password-change-btn');
            console.log('Password change button found:', !!passwordChangeBtn);
            if (passwordChangeBtn) {
                // 既存のイベントリスナーを削除してから新しいものを追加
                passwordChangeBtn.onclick = null;
                passwordChangeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Password change button clicked!');
                    this.showChangePasswordModal();
                });
                console.log('Event listener added to password change button');
            } else {
                console.log('Password change button not found, retrying...');
                // ボタンが見つからない場合は再試行
                setTimeout(() => this.setupPasswordChangeButton(), 100);
            }
        }, 100);
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

    // パスワード変更モーダル表示
    showChangePasswordModal() {
        console.log('showChangePasswordModal called');
        const modal = document.getElementById('student-change-password-modal');
        console.log('Modal found:', !!modal);
        if (modal) {
            console.log('Setting modal display to flex');
            modal.style.display = 'flex';
            // フォームをリセット
            const form = document.getElementById('student-change-password-form');
            if (form) {
                form.reset();
            }
            // モーダル内のイベントリスナーを設定
            this.setupModalEventListeners();
        } else {
            console.error('Modal not found!');
        }
    }

    // モーダル内のイベントリスナー設定
    setupModalEventListeners() {
        // 閉じるボタン
        const closeBtn = document.getElementById('student-password-modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeChangePasswordModal();
        }

        // キャンセルボタン
        const cancelBtn = document.getElementById('student-password-cancel-btn');
        if (cancelBtn) {
            cancelBtn.onclick = () => this.closeChangePasswordModal();
        }

        // フォーム送信
        const form = document.getElementById('student-change-password-form');
        if (form) {
            form.onsubmit = (event) => this.changePassword(event);
        }
    }

    // パスワード変更モーダル閉じる
    closeChangePasswordModal() {
        const modal = document.getElementById('student-change-password-modal');
        if (modal) {
            modal.style.display = 'none';
            // フォームをリセット
            const form = document.getElementById('student-change-password-form');
            if (form) {
                form.reset();
            }
        }
    }

    // パスワード変更処理
    async changePassword(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('student-current-password').value;
        const newPassword = document.getElementById('student-new-password').value;
        const confirmPassword = document.getElementById('student-confirm-password').value;
        
        // バリデーション
        if (!currentPassword || !newPassword || !confirmPassword) {
            if (window.authManager) {
                authManager.showMessage('すべての項目を入力してください', 'error');
            }
            return;
        }
        
        if (newPassword.length < 6) {
            if (window.authManager) {
                authManager.showMessage('新しいパスワードは6文字以上で入力してください', 'error');
            }
            return;
        }
        
        if (newPassword !== confirmPassword) {
            if (window.authManager) {
                authManager.showMessage('新しいパスワードと確認パスワードが一致しません', 'error');
            }
            return;
        }
        
        try {
            // 現在のユーザー情報を取得
            const currentUser = JSON.parse(localStorage.getItem('sunaUser') || '{}');
            if (!currentUser.email) {
                throw new Error('ユーザー情報が見つかりません');
            }
            
            // 現在のパスワードを確認
            const users = JSON.parse(localStorage.getItem('sunaUsers') || '[]');
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            
            if (userIndex === -1) {
                throw new Error('ユーザーが見つかりません');
            }
            
            const user = users[userIndex];
            if (user.password !== currentPassword) {
                if (window.authManager) {
                    authManager.showMessage('現在のパスワードが正しくありません', 'error');
                }
                return;
            }
            
            // パスワードを更新
            users[userIndex].password = newPassword;
            users[userIndex].passwordChangedAt = new Date().toISOString();
            
            // ローカルストレージに保存
            localStorage.setItem('sunaUsers', JSON.stringify(users));
            
            // 現在のユーザー情報も更新
            currentUser.password = newPassword;
            localStorage.setItem('sunaUser', JSON.stringify(currentUser));
            
            // 成功メッセージとモーダルを閉じる
            if (window.authManager) {
                authManager.showMessage('パスワードが正常に変更されました', 'success');
            }
            
            this.closeChangePasswordModal();
            
        } catch (error) {
            console.error('Password change error:', error);
            if (window.authManager) {
                authManager.showMessage('パスワードの変更に失敗しました: ' + error.message, 'error');
            }
        }
    }

    // 学年→タグ
    getGradeCategory(gradeStr = '') {
        if (gradeStr.startsWith('小学')) return '小学';
        if (gradeStr.startsWith('中学')) return '中学';
        if (gradeStr.startsWith('高校')) return '高校';
        return 'その他';
    }

    // StudyApp のコース描画をオーバーライドし、学年タグでフィルタ
    renderCourses(subject) {
        console.log('🎓 [STUDENT DEBUG] renderCourses called for:', subject.name);
        const student = window.authManager?.currentUser || {};
        const gradeTag = this.getGradeCategory(student.grade);
        console.log('🎓 [STUDENT DEBUG] Student grade:', student.grade);
        console.log('🎓 [STUDENT DEBUG] Grade tag:', gradeTag);

        const allCourses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});
        console.log('🎓 [STUDENT DEBUG] All courses count:', allCourses.length);

        // コースの targetGrades (例: ["小学", "冬季講習"]) があり、かつ学年タグが含まれていない場合は除外
        const filteredCourses = allCourses.filter(c => {
            console.log('🎓 [STUDENT DEBUG] Checking course:', c.title, 'targetGrades:', c.targetGrades);
            if (c.targetGrades && Array.isArray(c.targetGrades) && c.targetGrades.length > 0) {
                const isIncluded = c.targetGrades.includes(gradeTag);
                console.log('🎓 [STUDENT DEBUG] Course', c.title, 'includes grade?', isIncluded);
                return isIncluded;
            }
            console.log('🎓 [STUDENT DEBUG] Course', c.title, 'has no targetGrades - including');
            return true; // タグ未設定なら全員閲覧可
        });

        console.log('🎓 [STUDENT DEBUG] Filtered courses count:', filteredCourses.length);

        // フィルタ後の subject コピーを作成
        const subjectCopy = { ...subject, courses: filteredCourses };

        // 基底クラスのメソッドを呼び出し
        super.renderCourses(subjectCopy);
    }
}

// 受講生アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎓 [STUDENT INIT] Student page DOM loaded');
    
    // main.jsで既にStudyAppが初期化されている場合は、StudentAppに置き換える
    setTimeout(() => {
        console.log('🎓 [STUDENT INIT] Checking for StudyApp and AuthManager...');
        console.log('🎓 [STUDENT INIT] window.app exists?', !!window.app);
        console.log('🎓 [STUDENT INIT] window.authManager exists?', !!window.authManager);
        
        if (window.app && window.authManager) {
            console.log('🎓 [STUDENT INIT] Replacing StudyApp with StudentApp...');
            console.log('🎓 [STUDENT INIT] Current user:', window.authManager.currentUser);
            console.log('🎓 [STUDENT INIT] Is logged in:', window.authManager.isLoggedIn);
            
            // StudentAppを初期化（既存のStudyAppを置き換え）
            window.app = new StudentApp();
            window.studentApp = window.app; // グローバルアクセス用
            console.log('🎓 [STUDENT INIT] StudentApp created and set to window.app');
        } else {
            console.log('🎓 [STUDENT INIT] StudyApp or AuthManager not found, cannot initialize StudentApp');
            console.log('🎓 [STUDENT INIT] window.app:', window.app);
            console.log('🎓 [STUDENT INIT] window.authManager:', window.authManager);
        }
    }, 200); // main.jsの初期化完了を待つ
    
    // 確実にstudentAppを設定するための追加処理
    setTimeout(() => {
        console.log('🎓 [STUDENT INIT] Final check for StudentApp reference...');
        if (window.app && !window.studentApp) {
            window.studentApp = window.app;
            console.log('🎓 [STUDENT INIT] StudentApp global reference set');
        }
        console.log('🎓 [STUDENT INIT] Final window.studentApp:', !!window.studentApp);
    }, 500);
});

// 学生用パスワード変更ボタンのスタイル追加
const studentStyle = document.createElement('style');
studentStyle.textContent = `
    /* 学生用パスワード変更ボタンのスタイル */
    .student-change-password-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-right: 8px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    
    .student-change-password-btn:hover {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    .student-change-password-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(studentStyle);