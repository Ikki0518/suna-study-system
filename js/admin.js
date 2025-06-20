// 管理者アプリケーションクラス
class AdminApp {
    constructor() {
        this.students = [];
        this.currentFilter = {
            search: '',
            progress: '',
            subject: ''
        };
        this.init();
    }

    init() {
        console.log('AdminApp initialized');
        this.loadMockStudentData();
        this.renderStatsCards();
        this.renderStudentTable();
        this.bindEvents();
        this.updateAuthUI();
    }

    // モック受講生データの読み込み
    loadMockStudentData() {
        // ログインユーザーの情報を取得
        const currentUser = JSON.parse(localStorage.getItem('sunaUser') || '{}');
        
        // adminアカウントの場合のみデモデータを表示
        if (currentUser.email === 'admin@suna.com') {
            this.students = this.getDefaultStudentData();
        } else {
            // 新規管理者アカウントの場合は空配列
            this.students = [];
        }
    }
    
    // デフォルトの受講生データ
    getDefaultStudentData() {
        return [
            {
                id: 1,
                name: '田中太郎',
                email: 'tanaka@example.com',
                registrationDate: '2024-01-15',
                lastAccess: '2024-06-20',
                status: 'active',
                totalProgress: 78,
                subjects: {
                    japanese: { progress: 85, lastAccess: '2024-06-20' },
                    math: { progress: 70, lastAccess: '2024-06-19' },
                    english: { progress: 80, lastAccess: '2024-06-18' }
                }
            },
            {
                id: 2,
                name: '佐藤花子',
                email: 'sato@example.com',
                registrationDate: '2024-01-10',
                lastAccess: '2024-06-21',
                status: 'active',
                totalProgress: 92,
                subjects: {
                    japanese: { progress: 95, lastAccess: '2024-06-21' },
                    math: { progress: 88, lastAccess: '2024-06-20' },
                    english: { progress: 93, lastAccess: '2024-06-19' },
                    science: { progress: 90, lastAccess: '2024-06-18' }
                }
            },
            {
                id: 3,
                name: '鈴木次郎',
                email: 'suzuki@example.com',
                registrationDate: '2024-02-05',
                lastAccess: '2024-06-15',
                status: 'active',
                totalProgress: 58,
                subjects: {
                    math: { progress: 65, lastAccess: '2024-06-15' },
                    english: { progress: 50, lastAccess: '2024-06-14' },
                    science: { progress: 60, lastAccess: '2024-06-13' }
                }
            },
            {
                id: 4,
                name: '高橋美咲',
                email: 'takahashi@example.com',
                registrationDate: '2024-01-12',
                lastAccess: '2024-06-21',
                status: 'active',
                totalProgress: 73,
                subjects: {
                    japanese: { progress: 80, lastAccess: '2024-06-21' },
                    science: { progress: 70, lastAccess: '2024-06-20' },
                    social: { progress: 68, lastAccess: '2024-06-19' }
                }
            },
            {
                id: 5,
                name: '山田智子',
                email: 'yamada@example.com',
                registrationDate: '2024-01-08',
                lastAccess: '2024-06-22',
                status: 'active',
                totalProgress: 96,
                subjects: {
                    japanese: { progress: 98, lastAccess: '2024-06-22' },
                    math: { progress: 95, lastAccess: '2024-06-21' },
                    english: { progress: 94, lastAccess: '2024-06-20' },
                    science: { progress: 98, lastAccess: '2024-06-19' },
                    social: { progress: 95, lastAccess: '2024-06-18' }
                }
            },
            {
                id: 6,
                name: '中村健太',
                email: 'nakamura@example.com',
                registrationDate: '2024-03-01',
                lastAccess: '2024-06-20',
                status: 'active',
                totalProgress: 45,
                subjects: {
                    math: { progress: 55, lastAccess: '2024-06-20' },
                    english: { progress: 35, lastAccess: '2024-06-18' }
                }
            },
            {
                id: 7,
                name: '加藤あゆみ',
                email: 'kato@example.com',
                registrationDate: '2024-02-20',
                lastAccess: '2024-06-19',
                status: 'active',
                totalProgress: 67,
                subjects: {
                    japanese: { progress: 75, lastAccess: '2024-06-19' },
                    english: { progress: 60, lastAccess: '2024-06-17' },
                    social: { progress: 65, lastAccess: '2024-06-16' }
                }
            },
            {
                id: 8,
                name: '伊藤大輝',
                email: 'ito@example.com',
                registrationDate: '2024-04-10',
                lastAccess: '2024-05-15',
                status: 'inactive',
                totalProgress: 22,
                subjects: {
                    math: { progress: 25, lastAccess: '2024-05-15' },
                    english: { progress: 18, lastAccess: '2024-05-10' }
                }
            }
        ];
    }

    // 統計カードのレンダリング
    renderStatsCards() {
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid) return;

        const activeStudents = this.students.filter(s => s.status === 'active').length;
        const totalStudents = this.students.length;
        const avgProgress = totalStudents > 0 ? Math.round(this.students.reduce((sum, s) => sum + s.totalProgress, 0) / totalStudents) : 0;
        const highPerformers = this.students.filter(s => s.totalProgress >= 70).length;
        const recentActiveStudents = this.students.filter(s => {
            const lastAccess = new Date(s.lastAccess);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastAccess >= weekAgo;
        }).length;

        const stats = [
            {
                title: '総受講生数',
                value: totalStudents,
                icon: '👥',
                change: '+3名',
                changeType: 'positive'
            },
            {
                title: 'アクティブ受講生',
                value: `${activeStudents}名`,
                icon: '✅',
                change: totalStudents > 0 ? `${Math.round((activeStudents/totalStudents)*100)}%` : '0%',
                changeType: 'positive'
            },
            {
                title: '平均進捗率',
                value: `${avgProgress}%`,
                icon: '📊',
                change: '+12%',
                changeType: 'positive'
            },
            {
                title: '優秀者数',
                value: `${highPerformers}名`,
                icon: '🏆',
                change: `70%以上`,
                changeType: 'positive'
            }
        ];

        statsGrid.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-card-header">
                    <h3 class="stat-card-title">${stat.title}</h3>
                    <span class="stat-card-icon">${stat.icon}</span>
                </div>
                <div class="stat-card-value">${stat.value}</div>
                <div class="stat-card-change ${stat.changeType}">
                    ${stat.change} ${stat.title === '総受講生数' && totalStudents > 0 ? '今月増加' : ''}
                </div>
            </div>
        `).join('');
    }

    // 受講生テーブルのレンダリング
    renderStudentTable() {
        const studentTable = document.getElementById('student-table');
        if (!studentTable) return;

        const filteredStudents = this.getFilteredStudents();

        if (filteredStudents.length === 0) {
            studentTable.innerHTML = `
                <thead>
                    <tr>
                        <th>受講生名</th>
                        <th>メールアドレス</th>
                        <th>登録日</th>
                        <th>最終アクセス</th>
                        <th>ステータス</th>
                        <th>総合進捗</th>
                        <th>主要科目</th>
                        <th>アクション</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px; color: #6b7280;">
                            まだ受講生が登録されていません
                        </td>
                    </tr>
                </tbody>
            `;
            return;
        }

        studentTable.innerHTML = `
            <thead>
                <tr>
                    <th>受講生名</th>
                    <th>メールアドレス</th>
                    <th>登録日</th>
                    <th>最終アクセス</th>
                    <th>ステータス</th>
                    <th>総合進捗</th>
                    <th>主要科目</th>
                    <th>アクション</th>
                </tr>
            </thead>
            <tbody>
                ${filteredStudents.map(student => `
                    <tr>
                        <td>
                            <div style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${student.name}</div>
                        </td>
                        <td>${student.email}</td>
                        <td>${this.formatDate(student.registrationDate)}</td>
                        <td>${this.formatDate(student.lastAccess)}</td>
                        <td>
                            <span class="status-badge ${student.status}">
                                ${student.status === 'active' ? 'アクティブ' : '非アクティブ'}
                            </span>
                        </td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                                <div class="progress-bar">
                                    <div class="progress-fill ${this.getProgressClass(student.totalProgress)}" 
                                         style="width: ${student.totalProgress}%"></div>
                                </div>
                                <span style="font-size: 12px; color: #6b7280;">${student.totalProgress}%</span>
                            </div>
                        </td>
                        <td>
                            <div style="display: flex; gap: 2px; align-items: center; white-space: nowrap;">
                                ${Object.keys(student.subjects).slice(0, 3).map(subject => `
                                    <span style="font-size: 10px; background: #f3f4f6; padding: 1px 4px; border-radius: 3px; white-space: nowrap;">
                                        ${this.getSubjectName(subject)}: ${student.subjects[subject].progress}%
                                    </span>
                                `).join('')}
                            </div>
                        </td>
                        <td>
                            <div class="action-buttons" style="white-space: nowrap;">
                                <button class="action-btn-small view" onclick="adminApp.showStudentDetail(${student.id})">
                                    詳細
                                </button>
                                <button class="action-btn-small edit" onclick="adminApp.editStudent(${student.id})">
                                    編集
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }

    // フィルター処理
    getFilteredStudents() {
        return this.students.filter(student => {
            // 検索フィルター
            if (this.currentFilter.search) {
                const searchTerm = this.currentFilter.search.toLowerCase();
                if (!student.name.toLowerCase().includes(searchTerm) && 
                    !student.email.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            // 進捗フィルター
            if (this.currentFilter.progress) {
                switch (this.currentFilter.progress) {
                    case 'high':
                        if (student.totalProgress < 70) return false;
                        break;
                    case 'medium':
                        if (student.totalProgress < 30 || student.totalProgress >= 70) return false;
                        break;
                    case 'low':
                        if (student.totalProgress >= 30) return false;
                        break;
                }
            }

            // 科目フィルター
            if (this.currentFilter.subject) {
                if (!student.subjects[this.currentFilter.subject]) return false;
            }

            return true;
        });
    }

    // 受講生詳細表示
    showStudentDetail(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const modal = document.getElementById('student-detail-modal');
        const content = document.getElementById('student-detail-content');

        content.innerHTML = `
            <div class="student-detail">
                <div class="student-info-grid">
                    <div class="info-section">
                        <h4>基本情報</h4>
                        <div class="info-item">
                            <span class="info-label">氏名:</span>
                            <span class="info-value">${student.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">メール:</span>
                            <span class="info-value">${student.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">登録日:</span>
                            <span class="info-value">${this.formatDate(student.registrationDate)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">最終アクセス:</span>
                            <span class="info-value">${this.formatDate(student.lastAccess)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">ステータス:</span>
                            <span class="status-badge ${student.status}">
                                ${student.status === 'active' ? 'アクティブ' : '非アクティブ'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="progress-section">
                        <h4>学習進捗</h4>
                        <div class="overall-progress">
                            <div class="progress-label">総合進捗: ${student.totalProgress}%</div>
                            <div class="progress-bar" style="width: 100%; height: 12px;">
                                <div class="progress-fill ${this.getProgressClass(student.totalProgress)}" 
                                     style="width: ${student.totalProgress}%"></div>
                            </div>
                        </div>
                        
                        <div class="subject-progress">
                            <h5>科目別進捗</h5>
                            ${Object.entries(student.subjects).map(([subject, data]) => `
                                <div class="subject-item">
                                    <div class="subject-info">
                                        <span class="subject-name">${this.getSubjectName(subject)}</span>
                                        <span class="subject-percent">${data.progress}%</span>
                                    </div>
                                    <div class="progress-bar" style="height: 8px;">
                                        <div class="progress-fill ${this.getProgressClass(data.progress)}" 
                                             style="width: ${data.progress}%"></div>
                                    </div>
                                    <div class="subject-last-access">
                                        最終アクセス: ${this.formatDate(data.lastAccess)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    // 受講生詳細モーダルを閉じる
    closeStudentDetail() {
        const modal = document.getElementById('student-detail-modal');
        modal.style.display = 'none';
    }

    // 受講生編集（プレースホルダー）
    editStudent(studentId) {
        authManager.showMessage(`受講生ID: ${studentId}の編集機能は実装予定です`, 'info');
    }

    // 受講生リスト更新
    refreshStudentList() {
        this.loadMockStudentData();
        this.renderStatsCards();
        this.renderStudentTable();
        authManager.showMessage('受講生リストを更新しました', 'success');
    }

    // データエクスポート（プレースホルダー）
    exportStudentData() {
        authManager.showMessage('データエクスポート機能は実装予定です', 'info');
    }

    // イベントバインディング
    bindEvents() {
        // 検索機能
        const searchInput = document.getElementById('student-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.renderStudentTable();
            });
        }

        // 進捗フィルター
        const progressFilter = document.getElementById('progress-filter');
        if (progressFilter) {
            progressFilter.addEventListener('change', (e) => {
                this.currentFilter.progress = e.target.value;
                this.renderStudentTable();
            });
        }

        // 科目フィルター
        const subjectFilter = document.getElementById('subject-filter');
        if (subjectFilter) {
            subjectFilter.addEventListener('change', (e) => {
                this.currentFilter.subject = e.target.value;
                this.renderStudentTable();
            });
        }

        // モーダルクリックアウトサイド
        const modal = document.getElementById('student-detail-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeStudentDetail();
                }
            });
        }

        // ESCキーでモーダル閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeStudentDetail();
            }
        });
    }

    // 認証UI更新
    updateAuthUI() {
        const authSection = document.getElementById('admin-auth-section');
        if (!authSection) return;

        if (authManager && authManager.isLoggedIn && authManager.currentUser) {
            authSection.innerHTML = `
                <div class="admin-user-info">
                    <span class="user-name">管理者: ${authManager.currentUser.name || authManager.currentUser.email}</span>
                    <button class="logout-btn" onclick="authManager.logout()">ログアウト</button>
                </div>
            `;
        }
    }

    // ヘルパーメソッド
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    getProgressClass(progress) {
        if (progress >= 70) return 'high';
        if (progress >= 30) return 'medium';
        return 'low';
    }

    getSubjectName(subjectId) {
        const subjectNames = {
            japanese: '国語',
            math: '数学',
            english: '英語',
            science: '理科',
            social: '社会'
        };
        return subjectNames[subjectId] || subjectId;
    }
}

// CSSの追加
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    .student-detail {
        font-size: 14px;
    }
    
    .student-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    
    .info-section h4,
    .progress-section h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        border-bottom: 2px solid #f3f4f6;
        padding-bottom: 8px;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .info-label {
        font-weight: 500;
        color: #6b7280;
    }
    
    .info-value {
        color: #1f2937;
    }
    
    .overall-progress {
        margin-bottom: 20px;
    }
    
    .progress-label {
        font-weight: 500;
        margin-bottom: 8px;
        color: #1f2937;
    }
    
    .subject-progress h5 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
    }
    
    .subject-item {
        margin-bottom: 16px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 6px;
    }
    
    .subject-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }
    
    .subject-name {
        font-weight: 500;
        color: #1f2937;
    }
    
    .subject-percent {
        font-size: 12px;
        color: #6b7280;
    }
    
    .subject-last-access {
        font-size: 11px;
        color: #9ca3af;
        margin-top: 4px;
    }
    
    @media (max-width: 768px) {
        .student-info-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(adminStyle);

// 管理者アプリケーションの初期化
let adminApp;
document.addEventListener('DOMContentLoaded', () => {
    // AuthManagerの初期化を待つ
    setTimeout(() => {
        if (typeof authManager !== 'undefined' && authManager) {
            if (authManager.requireAdminAuth()) {
                adminApp = new AdminApp();
                window.adminApp = adminApp; // グローバルアクセス用
            }
        } else {
            // AuthManagerが存在しない場合
            const notification = document.createElement('div');
            notification.className = 'notification notification-error';
            notification.textContent = '認証システムエラーが発生しました';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                font-weight: 500;
                z-index: 1000;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }, 100);
});