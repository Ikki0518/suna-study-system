// 管理者アプリケーションクラス
class AdminApp {
    constructor() {
        this.students = [];
        this.applications = [];
        this.currentFilter = {
            search: '',
            progress: '',
            subject: ''
        };
        this.currentTab = 'students'; // 'students', 'applications', 'schools'
        this.init();
    }

    init() {
        console.log('AdminApp initialized');
        this.loadMockStudentData();
        this.loadApplicationData();
        this.renderStatsCards();
        this.renderStudentTable();
        this.renderApplicationsSection();
        this.renderSchoolsSection();
        this.renderInvitationsSection();
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
            const currentSchool = authManager.getCurrentSchool();
            authSection.innerHTML = `
                <div class="admin-user-info">
                    <span class="user-name">管理者: ${authManager.currentUser.name || authManager.currentUser.email}</span>
                    <div class="school-selector">
                        <select id="admin-school-select" onchange="authManager.changeSchool(this.value)">
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

    // 申請データの読み込み
    loadApplicationData() {
        // ローカルストレージから申請データを読み込み
        const applications = JSON.parse(localStorage.getItem('pendingApplications') || '[]');
        this.applications = applications;
        this.updateApplicationsBadge();
    }

    // 申請バッジの更新
    updateApplicationsBadge() {
        const badge = document.getElementById('applicationsBadge');
        if (!badge) return;
        
        const pendingCount = this.applications.filter(app => app.status === 'pending').length;
        
        if (pendingCount > 0) {
            badge.textContent = pendingCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    // タブ切り替え
    switchTab(tabName) {
        // タブボタンの状態更新
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');

        // タブパネルの表示切り替え
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const activePanel = document.getElementById(`${tabName}-panel`);
        if (activePanel) activePanel.classList.add('active');

        this.currentTab = tabName;

        // タブに応じてコンテンツを更新
        switch(tabName) {
            case 'students':
                this.renderStudentTable();
                break;
            case 'applications':
                this.renderApplicationsSection();
                break;
            case 'schools':
                this.renderSchoolsSection();
                break;
            case 'invitations':
                this.renderInvitationsSection();
                break;
        }
    }

    // 申請管理セクションのレンダリング
    renderApplicationsSection() {
        const container = document.getElementById('applications-container');
        if (!container) return;

        if (this.applications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>申請がありません</h3>
                    <p>新しい申請が届くとここに表示されます</p>
                </div>
            `;
            return;
        }

        const applicationsHtml = this.applications.map(app => `
            <div class="application-card">
                <div class="application-header">
                    <div class="application-info">
                        <h3>${app.applicant_name}</h3>
                        <p>${app.applicant_email}</p>
                        <p>申請日: ${this.formatDate(app.applied_at)}</p>
                        <p>希望学習塾: ${app.school_id}</p>
                    </div>
                    <div class="application-status ${app.status}">
                        ${app.status === 'pending' ? '承認待ち' : 
                          app.status === 'approved' ? '承認済み' : '拒否'}
                    </div>
                </div>
                
                ${app.message ? `
                    <div class="application-message">
                        "${app.message}"
                    </div>
                ` : ''}
                
                ${app.status === 'pending' ? `
                    <div class="application-actions">
                        <button class="approve-btn" onclick="adminApp.approveApplication('${app.id}')">
                            ✅ 承認
                        </button>
                        <button class="reject-btn" onclick="adminApp.rejectApplication('${app.id}')">
                            ❌ 拒否
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        container.innerHTML = applicationsHtml;
    }

    // 申請承認
    async approveApplication(applicationId) {
        if (!confirm('この申請を承認しますか？')) return;

        try {
            // 申請データを更新
            const appIndex = this.applications.findIndex(app => app.id === applicationId);
            if (appIndex !== -1) {
                this.applications[appIndex].status = 'approved';
                this.applications[appIndex].reviewed_at = new Date().toISOString();
                
                // ローカルストレージを更新
                localStorage.setItem('pendingApplications', JSON.stringify(this.applications));
                
                // UIを更新
                this.renderApplicationsSection();
                this.updateApplicationsBadge();
                
                if (window.authManager) {
                    authManager.showMessage('申請を承認しました。', 'success');
                }
            }
        } catch (error) {
            console.error('Application approval error:', error);
            if (window.authManager) {
                authManager.showMessage('申請の承認に失敗しました。', 'error');
            }
        }
    }

    // 申請拒否
    async rejectApplication(applicationId) {
        const reason = prompt('拒否理由を入力してください（任意）：');
        if (reason === null) return; // キャンセルされた場合

        try {
            // 申請データを更新
            const appIndex = this.applications.findIndex(app => app.id === applicationId);
            if (appIndex !== -1) {
                this.applications[appIndex].status = 'rejected';
                this.applications[appIndex].reviewed_at = new Date().toISOString();
                this.applications[appIndex].rejection_reason = reason;
                
                // ローカルストレージを更新
                localStorage.setItem('pendingApplications', JSON.stringify(this.applications));
                
                // UIを更新
                this.renderApplicationsSection();
                this.updateApplicationsBadge();
                
                if (window.authManager) {
                    authManager.showMessage('申請を拒否しました。', 'info');
                }
            }
        } catch (error) {
            console.error('Application rejection error:', error);
            if (window.authManager) {
                authManager.showMessage('申請の拒否に失敗しました。', 'error');
            }
        }
    }

    // 申請データの更新
    refreshApplications() {
        this.loadApplicationData();
        this.renderApplicationsSection();
        if (window.authManager) {
            authManager.showMessage('申請データを更新しました。', 'success');
        }
    }

    // スクール管理セクションのレンダリング
    renderSchoolsSection() {
        const container = document.getElementById('schools-container');
        if (!container) return;

        // AuthManagerからスクールデータを取得
        const schools = window.authManager ? window.authManager.getSchools() : [];

        const schoolsHtml = schools.map(school => `
            <div class="school-card" style="--school-color: ${school.color}">
                <div class="school-card-header">
                    <div class="school-icon">${school.icon}</div>
                    <div class="school-info">
                        <h3>${school.name}</h3>
                        <p>講師 ${school.instructors.length}名</p>
                    </div>
                </div>
                <p>${school.description}</p>
                <div class="school-instructors">
                    ${school.instructors.map(instructor => 
                        `<span class="instructor-tag">${instructor}</span>`
                    ).join('')}
                </div>
                <div class="school-actions">
                    <button class="action-btn-small edit" onclick="adminApp.editSchool('${school.id}')">
                        ✏️ 編集
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = schoolsHtml;
    }

    // スクール編集（プレースホルダー）
    editSchool(schoolId) {
        if (window.authManager) {
            authManager.showMessage(`スクール編集機能は実装予定です（ID: ${schoolId}）`, 'info');
        }
    }

    // 招待管理セクションのレンダリング
    renderInvitationsSection() {
        const container = document.getElementById('invitations-container');
        if (!container) return;

        // 招待データ（将来的にはSupabaseから取得）
        const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');

        if (invitations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✉️</div>
                    <h3>招待がありません</h3>
                    <p>新しい招待を送信するには「受講生を招待」ボタンをクリックしてください</p>
                </div>
            `;
            return;
        }

        const invitationsHtml = invitations.map(invitation => {
            const isExpired = new Date(invitation.expires_at) < new Date();
            const statusText = invitation.status === 'pending' 
                ? (isExpired ? '期限切れ' : '送信済み')
                : invitation.status === 'accepted' ? '承諾済み' : '期限切れ';
            
            return `
                <div class="invitation-card">
                    <div class="invitation-header">
                        <div class="invitation-info">
                            <h3>${invitation.name}</h3>
                            <p>📧 ${invitation.email}</p>
                            <p>🎓 ${invitation.grade}</p>
                            <p>🏫 ${invitation.school_name}</p>
                            <p>📅 招待日: ${this.formatDate(invitation.created_at)}</p>
                            <p>⏰ 有効期限: ${this.formatDate(invitation.expires_at)}</p>
                            ${invitation.accepted_at ? `<p>✅ 承諾日: ${this.formatDate(invitation.accepted_at)}</p>` : ''}
                        </div>
                        <div class="invitation-status ${invitation.status} ${isExpired ? 'expired' : ''}">
                            ${statusText}
                        </div>
                    </div>
                    <div class="invitation-details">
                        <div class="invitation-code">
                            <strong>招待コード:</strong> ${invitation.invitation_code}
                        </div>
                        ${invitation.message ? `
                            <div class="invitation-message">
                                <strong>メッセージ:</strong> ${invitation.message}
                            </div>
                        ` : ''}
                        <div class="invitation-link">
                            <strong>招待リンク:</strong> 
                            <a href="signup.html?code=${invitation.invitation_code}" target="_blank">
                                ${window.location.origin}/signup.html?code=${invitation.invitation_code}
                            </a>
                        </div>
                    </div>
                    ${invitation.status === 'pending' && !isExpired ? `
                        <div class="invitation-actions">
                            <button class="action-btn secondary" onclick="adminApp.resendInvitation('${invitation.invitation_code}')">
                                📧 再送信
                            </button>
                            <button class="action-btn danger" onclick="adminApp.cancelInvitation('${invitation.invitation_code}')">
                                ❌ キャンセル
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = invitationsHtml;
    }

    // 招待モーダル表示
    showInviteModal() {
        const modal = document.getElementById('invite-modal');
        if (modal) {
            modal.style.display = 'flex';
            // フォームをリセット
            document.getElementById('invite-form').reset();
            
            // スーパー管理者の場合のみロール選択を表示
            const roleGroup = document.getElementById('invite-role-group');
            if (roleGroup) {
                roleGroup.style.display = authManager.isSuperAdmin() ? 'block' : 'none';
            }
        }
    }

    // 招待モーダルを閉じる
    closeInviteModal() {
        const modal = document.getElementById('invite-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 招待を送信
    async sendInvitation(event) {
        event.preventDefault();
        
        const email = document.getElementById('invite-email').value;
        const name = document.getElementById('invite-name').value;
        const grade = document.getElementById('invite-grade').value;
        const message = document.getElementById('invite-message').value;
        const role = document.getElementById('invite-role') ? document.getElementById('invite-role').value : 'student';

        // 招待コードを生成
        const invitationCode = this.generateInvitationCode();
        
        // 現在のスクール情報を取得
        const currentSchool = authManager.getCurrentSchool();
        
        // 招待データを作成
        const invitation = {
            id: Date.now(),
            email: email,
            name: name,
            grade: grade,
            message: message,
            role: role,
            invitation_code: invitationCode,
            school_id: currentSchool.id,
            school_name: currentSchool.name,
            status: 'pending',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7日後
            created_by_super_admin: authManager.isSuperAdmin() // スーパー管理者フラグ
        };

        // ローカルストレージに保存
        const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
        invitations.push(invitation);
        localStorage.setItem('invitations', JSON.stringify(invitations));

        // 招待メールをシミュレート（実際のプロダクションではメール送信API）
        this.simulateEmailSend(invitation);

        // モーダルを閉じる
        this.closeInviteModal();
        
        // 招待一覧を更新
        this.renderInvitationsSection();
        
        // 成功メッセージ
        if (window.authManager) {
            authManager.showMessage(`${email} に招待メールを送信しました！`, 'success');
        }
    }

    // 招待コード生成
    generateInvitationCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // メール送信シミュレーション
    simulateEmailSend(invitation) {
        console.log('=== 招待メール送信シミュレーション ===');
        console.log(`To: ${invitation.email}`);
        console.log(`Subject: ${invitation.school_name}からの学習システム招待`);
        console.log(`
招待内容:
---
${invitation.name}様

${invitation.school_name}から学習システム「Suna Study System」への招待です。

${invitation.message || 'こんにちは！一緒に学習を始めましょう！'}

以下のリンクから登録を完了してください：
http://localhost:8001/signup.html?code=${invitation.invitation_code}

招待コード: ${invitation.invitation_code}
学年: ${invitation.grade}
有効期限: ${new Date(invitation.expires_at).toLocaleDateString()}

※この招待は7日間有効です。

${invitation.school_name}
---
        `);
    }

    // スクール追加モーダル表示
    showAddSchoolModal() {
        const modal = document.getElementById('add-school-modal');
        if (modal) {
            modal.style.display = 'flex';
            // フォームをリセット
            document.getElementById('add-school-form').reset();
        }
    }

    // スクール追加モーダルを閉じる
    closeAddSchoolModal() {
        const modal = document.getElementById('add-school-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // スクール追加
    addSchool(event) {
        event.preventDefault();
        
        const name = document.getElementById('school-name').value;
        const color = document.getElementById('school-color').value;
        const description = document.getElementById('school-description').value;

        // 新しいスクールを作成
        const newSchool = {
            id: Date.now(),
            name: name,
            color: color,
            description: description,
            teachers: [authManager.getCurrentUser().name || 'システム管理者'],
            created_at: new Date().toISOString()
        };

        // 既存のスクールリストに追加
        const schools = authManager.getSchools();
        schools.push(newSchool);
        localStorage.setItem('schools', JSON.stringify(schools));

        // モーダルを閉じる
        this.closeAddSchoolModal();
        
        // スクール一覧を更新
        this.renderSchoolsSection();
        
        // 成功メッセージ
        if (window.authManager) {
            authManager.showMessage(`スクール「${name}」を追加しました！`, 'success');
        }
    }

    // 招待再送信
    resendInvitation(invitationCode) {
        const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
        const invitation = invitations.find(inv => inv.invitation_code === invitationCode);
        
        if (invitation) {
            // 有効期限を延長
            invitation.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem('invitations', JSON.stringify(invitations));
            
            // メール再送信をシミュレート
            this.simulateEmailSend(invitation);
            
            // 招待一覧を更新
            this.renderInvitationsSection();
            
            // 成功メッセージ
            if (window.authManager) {
                authManager.showMessage(`${invitation.email} に招待メールを再送信しました！`, 'success');
            }
        }
    }

    // 招待キャンセル
    cancelInvitation(invitationCode) {
        if (confirm('この招待をキャンセルしますか？')) {
            const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
            const invitationIndex = invitations.findIndex(inv => inv.invitation_code === invitationCode);
            
            if (invitationIndex !== -1) {
                invitations[invitationIndex].status = 'cancelled';
                invitations[invitationIndex].cancelled_at = new Date().toISOString();
                localStorage.setItem('invitations', JSON.stringify(invitations));
                
                // 招待一覧を更新
                this.renderInvitationsSection();
                
                // 成功メッセージ
                if (window.authManager) {
                    authManager.showMessage('招待をキャンセルしました', 'success');
                }
            }
        }
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
    
    /* 招待カードのスタイル */
    .invitation-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 16px;
        border: 1px solid #e5e7eb;
    }
    
    .invitation-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
    }
    
    .invitation-info h3 {
        margin: 0 0 8px 0;
        color: #1f2937;
        font-size: 18px;
        font-weight: 600;
    }
    
    .invitation-info p {
        margin: 4px 0;
        color: #6b7280;
        font-size: 14px;
    }
    
    .invitation-status {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        min-width: 80px;
    }
    
    .invitation-status.pending {
        background: #fef3c7;
        color: #92400e;
    }
    
    .invitation-status.accepted {
        background: #d1fae5;
        color: #065f46;
    }
    
    .invitation-status.expired {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .invitation-details {
        background: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
    }
    
    .invitation-code,
    .invitation-message,
    .invitation-link {
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .invitation-link a {
        color: #2563eb;
        text-decoration: none;
        word-break: break-all;
    }
    
    .invitation-link a:hover {
        text-decoration: underline;
    }
    
    .invitation-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
    
    .invitation-actions .action-btn {
        padding: 8px 16px;
        font-size: 12px;
    }
    
    .action-btn.danger {
        background: #ef4444;
        color: white;
        border: none;
    }
    
    .action-btn.danger:hover {
        background: #dc2626;
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