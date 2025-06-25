// UTAGE風管理者アプリケーションクラス
class AdminApp {
    constructor() {
        this.students = [];
        this.applications = [];
        this.currentTab = 'dashboard'; // 'dashboard', 'students', 'lessons'
        this.currentSubjectFilter = null; // 追加: レッスン表示用科目フィルタ
        this.currentFilter = {
            search: '',
            progress: '',
            subject: ''
        };
        this.sortAsc = true; // 受講生並べ替え用フラグ
        
        // スクール管理関連
        this.currentSchool = 'elementary';
        
        this.init();
    }

    init() {
        console.log('AdminApp initialized');
        this.loadStudentData();
        this.renderStatsCards();
        this.renderStudentTable();
        this.renderRecentActivity();
        this.renderLessonsTable();
        this.bindEvents();
        this.updateAuthUI();
        this.checkUrlHash();
        this.initSchoolSelector();
    }

    // 受講生データの読み込み
    loadStudentData() {
        // 実際の登録済み受講生データを読み込み
        const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
        this.students = registrations.map(reg => ({
            id: reg.id,
            name: reg.name,
            email: reg.email,
            grade: reg.grade,
            registrationDate: reg.registrationDate,
            lastAccess: reg.lastAccess || reg.registrationDate,
            status: reg.status || 'active',
            totalProgress: this.calculateTotalProgress(reg.email),
            subjects: this.getStudentSubjects(reg.email)
        }));
    }

    // 受講生の総合進捗を計算
    calculateTotalProgress(email) {
        // ローカルストレージから進捗データを取得
        const progressKey = `progress_${email}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        if (Object.keys(progress).length === 0) return 0;
        
        const progressValues = Object.values(progress);
        return Math.round(progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length);
    }

    // 受講生の科目別進捗を取得
    getStudentSubjects(email) {
        const progressKey = `progress_${email}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        const subjects = {};
        Object.entries(progress).forEach(([subjectId, progressValue]) => {
            subjects[subjectId] = {
                progress: progressValue,
                lastAccess: new Date().toISOString().split('T')[0]
            };
        });
        
        return subjects;
    }

    // 統計カードのレンダリング
    renderStatsCards() {
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid) return;

        const activeStudents = this.students.filter(s => s.status === 'active').length;
        const totalStudents = this.students.length;
        const avgProgress = totalStudents > 0 ? Math.round(this.students.reduce((sum, s) => sum + s.totalProgress, 0) / totalStudents) : 0;
        const highPerformers = this.students.filter(s => s.totalProgress >= 70).length;

        // 科目数を取得
        const subjects = JSON.parse(localStorage.getItem('subjects') || '{}');
        const totalSubjects = Object.keys(subjects).length;
        const totalCourses = Object.values(subjects).reduce((sum, subject) => {
            return sum + (subject.courses ? Object.keys(subject.courses).length : 0);
        }, 0);

        // 追加の統計計算
        const recentlyActive = this.students.filter(s => {
            if (!s.lastAccess) return false;
            const lastAccess = new Date(s.lastAccess);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return lastAccess > weekAgo;
        }).length;

        const needsAttention = this.students.filter(s => {
            // 進捗が30%未満または2週間以上未ログイン
            if (s.totalProgress < 30) return true;
            if (!s.lastAccess) return true;
            const lastAccess = new Date(s.lastAccess);
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            return lastAccess < twoWeeksAgo;
        }).length;

        const stats = [
            {
                title: '総受講生数',
                value: totalStudents,
                icon: '👥',
                change: `${activeStudents}名アクティブ`,
                changeType: 'positive'
            },
            {
                title: '週間アクティブ',
                value: recentlyActive,
                icon: '🔥',
                change: totalStudents > 0 ? `${Math.round((recentlyActive/totalStudents)*100)}%` : '0%',
                changeType: recentlyActive > totalStudents * 0.5 ? 'positive' : 'negative'
            },
            {
                title: '平均進捗率',
                value: `${avgProgress}%`,
                icon: '📈',
                change: `${highPerformers}名が70%以上`,
                changeType: avgProgress >= 60 ? 'positive' : 'negative'
            },
            {
                title: '要注意受講生',
                value: needsAttention,
                icon: '⚠️',
                change: totalStudents > 0 ? `${Math.round((needsAttention/totalStudents)*100)}%` : '0%',
                changeType: needsAttention === 0 ? 'positive' : 'negative'
            }
        ];

        statsGrid.innerHTML = stats.map(stat => `
            <div class="utage-stat-card">
                <div class="utage-stat-card-header">
                    <h3 class="utage-stat-card-title">${stat.title}</h3>
                    <span class="utage-stat-card-icon">${stat.icon}</span>
                </div>
                <p class="utage-stat-card-value">${stat.value}</p>
                <p class="utage-stat-card-change ${stat.changeType}">${stat.change}</p>
            </div>
        `).join('');
    }

    // 最近の活動をレンダリング
    renderRecentActivity() {
        const table = document.getElementById('recent-activity-table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // 最近の活動データを生成（実際の実装では実データを使用）
        const activities = this.students.slice(0, 5).map(student => ({
            time: this.formatTime(student.lastAccess),
            student: student.name,
            action: '学習完了',
            detail: this.getRandomSubject()
        }));

        if (activities.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="utage-empty-state">
                        <div class="utage-empty-state-icon">📊</div>
                        <h3>活動データがありません</h3>
                        <p>受講生の学習が開始されると表示されます</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.time}</td>
                <td>${activity.student}</td>
                <td><span class="utage-status-badge active">${activity.action}</span></td>
                <td>${activity.detail}</td>
            </tr>
        `).join('');
    }

    // 受講生テーブルのレンダリング
    renderStudentTable() {
        const table = document.getElementById('student-table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const filteredStudents = this.getFilteredStudents();

        if (filteredStudents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="utage-empty-state">
                        <div class="utage-empty-state-icon">👥</div>
                        <h3>受講生がいません</h3>
                        <p>新しい受講生を追加してください</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredStudents.map(student => `
            <tr>
                <td><input type="checkbox" class="utage-checkbox"></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-weight: 500;">${student.name}</span>
                        <span style="color: #64748b; font-size: 12px;">${student.grade || ''}</span>
                    </div>
                    <div style="color: #64748b; font-size: 12px;">${student.email}</div>
                </td>
                <td><span class="utage-status-badge ${student.status}">${this.getStatusText(student.status)}</span></td>
                <td>${this.formatDate(student.registrationDate)}</td>
                <td>${this.formatDate(student.lastAccess)}</td>
                <td>
                    <div class="utage-action-buttons">
                        <button class="utage-action-btn edit" onclick="adminApp.editStudent(${student.id})">✏️</button>
                        <button class="utage-action-btn delete" onclick="adminApp.deleteStudent(${student.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // レッスンテーブルのレンダリング
    renderLessonsTable() {
        // タブエリア生成
        const tabsContainer = document.querySelector('#lessons-panel .utage-tabs');
        if (tabsContainer) {
            // subjects list
            const subjectsData = JSON.parse(localStorage.getItem('subjects') || '{}');
            const allSubjectNames = Object.values(subjectsData).map(s => s.name || '無題科目');
            // 初期選択
            if (!this.currentSubjectFilter && allSubjectNames.length) this.currentSubjectFilter = allSubjectNames[0];

            tabsContainer.innerHTML = allSubjectNames.map(n => `<button class="utage-tab-btn ${this.currentSubjectFilter===n?'active':''}" data-subject-filter="${n}">${n}</button>`).join('');

            tabsContainer.querySelectorAll('[data-subject-filter]').forEach(btn => {
                btn.onclick = () => {
                    this.currentSubjectFilter = btn.dataset.subjectFilter;
                    // ボタン active 切替
                    tabsContainer.querySelectorAll('.utage-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.renderLessonsTable();
                };
            });
        }

        const table = document.getElementById('lessons-table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // 科目データからレッスンを生成
        const subjects = JSON.parse(localStorage.getItem('subjects') || '{}');
        const lessons = [];

        Object.entries(subjects).forEach(([subjectId, subject]) => {
            if (this.currentSubjectFilter && subject.name !== this.currentSubjectFilter) return; // フィルタ適用
            if (subject.courses) {
                Object.entries(subject.courses).forEach(([courseId, course]) => {
                    if (course.chapters) {
                        Object.entries(course.chapters).forEach(([chapterId, chapter]) => {
                            if (chapter.lessons) {
                                Object.entries(chapter.lessons).forEach(([lessonId, lesson]) => {
                                    lessons.push({
                                        id: lessonId,
                                        name: lesson.title || lesson.name || 'Untitled Lesson',
                                        subject: subject.name,
                                        course: course.title || course.name || '無題コース',
                                        chapter: chapter.title || chapter.name || '無題章',
                                        status: lesson.status || 'draft',
                                        createdDate: lesson.created_at || '2025/6/22',
                                        updatedDate: lesson.updated_at || '2025/6/22'
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });

        if (lessons.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="utage-empty-state">
                        <div class="utage-empty-state-icon">📚</div>
                        <h3>レッスンがありません</h3>
                        <p>コンテンツ管理でレッスンを作成してください</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = lessons.map(lesson => {
            const badgeClass = lesson.status === 'published' ? 'active' : 'pending';
            const badgeLabel = lesson.status === 'published' ? '公開' : '下書き';
            return `
                <tr data-lesson-id="${lesson.id}">
                    <td><input type="checkbox" class="utage-checkbox"></td>
                    <td>
                        <div style="font-weight: 500;">${lesson.name}</div>
                        <div style="color: #64748b; font-size: 12px;">${lesson.subject} > ${lesson.course} > ${lesson.chapter}</div>
                    </td>
                    <td><span class="utage-status-badge ${badgeClass}" data-toggle-status="${lesson.id}">${badgeLabel}</span></td>
                    <td>${lesson.createdDate}</td>
                    <td>${lesson.updatedDate}</td>
                    <td>
                        <div class="utage-action-buttons">
                            <button class="utage-action-btn edit" data-edit="${lesson.id}">✏️</button>
                            <button class="utage-action-btn delete" data-delete="${lesson.id}">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // バッジクリックでトグル
        tbody.querySelectorAll('[data-toggle-status]').forEach(badge => {
            badge.onclick = () => {
                const id = badge.dataset.toggleStatus;
                const current = badge.textContent.trim() === '公開' ? 'published' : 'draft';
                const next = current === 'published' ? 'draft' : 'published';
                this.updateLessonStatus(id, next);
            };
        });

        // 削除イベント
        tbody.querySelectorAll('[data-delete]').forEach(btn=>{
            btn.onclick=()=>{
                const id=btn.dataset.delete;
                if(!confirm('このレッスンを削除しますか？')) return;
                this.deleteLesson(id);
            };
        });

        // 編集イベント
        tbody.querySelectorAll('[data-edit]').forEach(btn=>{
            btn.onclick=()=>{
                const id=btn.dataset.edit;
                // TODO: 編集モーダル実装または既存ページ遷移
                location.href=`create-course.html?lessonId=${id}`;
            };
        });
    }

    // フィルタリングされた受講生を取得
    getFilteredStudents() {
        return this.students.filter(student => {
            const matchesSearch = !this.currentFilter.search || 
                student.name.toLowerCase().includes(this.currentFilter.search.toLowerCase()) ||
                student.email.toLowerCase().includes(this.currentFilter.search.toLowerCase());
            
            const matchesProgress = !this.currentFilter.progress || 
                this.getProgressCategory(student.totalProgress) === this.currentFilter.progress;
            
            return matchesSearch && matchesProgress;
        });
    }

    // タブ切り替え
    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // サイドバーのアクティブ状態を更新
        document.querySelectorAll('.utage-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // タブパネルの表示切り替え
        document.querySelectorAll('.utage-tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const activePanel = document.getElementById(`${tabName}-panel`);
        if (activePanel) {
            activePanel.classList.add('active');
        }

        this.currentTab = tabName;

        // タブ切り替え時にデータを更新
        if (tabName === 'dashboard') {
            this.renderStatsCards();
            this.renderRecentActivity();
            this.renderAttentionStudents();
            this.renderTopStudents();
        } else if (tabName === 'students') {
            this.loadStudentData();
            this.renderStudentTable();
        } else if (tabName === 'lessons') {
            this.renderLessonsTable();
        }
    }

    // イベントバインディング
    bindEvents() {
        // 検索フィルター
        const searchInput = document.getElementById('student-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.renderStudentTable();
            });
        }

        // グループ管理ボタン
        const groupBtn = document.getElementById('group-management-btn');
        if (groupBtn) {
            groupBtn.addEventListener('click', () => {
                this.showGroupManagementModal();
            });
        }

        // 並べ替えボタン
        const sortBtn = document.getElementById('sort-students-btn');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                this.toggleStudentSort();
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
    }

    // 認証UIの更新
    updateAuthUI() {
        const authInfo = document.getElementById('admin-user-info');
        const schoolSelect = document.getElementById('admin-school-select');
        if (!authInfo) return;

        const currentUser = JSON.parse(localStorage.getItem('sunaUser') || '{}');
        if (currentUser.email) {
            const userName = currentUser.name || currentUser.email.split('@')[0];
            authInfo.textContent = `管理者: ${userName}`;

            // 学校セレクトをセット
            if (schoolSelect) {
                const schools = JSON.parse(localStorage.getItem('schools') || '{}');
                const currentSchoolId = currentUser.schoolId || Object.keys(schools)[0];
                schoolSelect.innerHTML = Object.values(schools).map(s=>`<option value="${s.id}" ${s.id===currentSchoolId?'selected':''}>${s.name}</option>`).join('');
                schoolSelect.onchange = () => {
                    currentUser.schoolId = schoolSelect.value;
                    localStorage.setItem('sunaUser', JSON.stringify(currentUser));
                    // 再読み込みで反映
                    location.reload();
                };
            }
        }
    }

    // ユーティリティメソッド
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP');
    }

    formatTime(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) return '1時間以内';
        if (diffHours < 24) return `${diffHours}時間前`;
        return `${Math.floor(diffHours / 24)}日前`;
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'アクティブ',
            'inactive': '非アクティブ',
            'pending': '保留中'
        };
        return statusMap[status] || status;
    }

    getProgressCategory(progress) {
        if (progress >= 70) return 'high';
        if (progress >= 30) return 'medium';
        return 'low';
    }

    getRandomSubject() {
        const subjects = ['国語', '数学', '英語', '理科', '社会'];
        return subjects[Math.floor(Math.random() * subjects.length)];
    }

    // 受講生登録モーダル関連
    showRegistrationModal() {
        const modal = document.getElementById('registration-modal');
        if (modal) {
            // 表示してフェードイン
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        }
    }

    closeRegistrationModal() {
        const modal = document.getElementById('registration-modal');
        if (modal) {
            // フェードアウト
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        // 互換用 invite-modal も閉じる
        const inviteModal = document.getElementById('invite-modal');
        if (inviteModal) {
            inviteModal.classList.remove('active');
            setTimeout(() => {
                inviteModal.style.display = 'none';
            }, 300);
        }

        // フォームをリセット
        const form = document.getElementById('registration-form');
        if (form) {
            form.reset();
        }
    }

    // 受講生登録処理
    async registerStudent(event) {
        event.preventDefault();
        
        const email = document.getElementById('reg-email')?.value || document.getElementById('invite-email')?.value;
        const name = document.getElementById('reg-name')?.value || document.getElementById('invite-name')?.value;
        const grade = document.getElementById('reg-grade')?.value || document.getElementById('invite-grade')?.value;

        if (!email || !name || !grade) {
            this.showMessage('すべての項目を入力してください', 'error');
            return;
        }

        // パスワード生成
        const password = this.generatePassword();
        
        // 受講生データを保存
        const registration = {
            id: Date.now(),
            email: email,
            name: name,
            grade: grade,
            password: password,
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'active',
            createdBy: 'admin'
        };

        // ローカルストレージに保存
        const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
        registrations.push(registration);
        localStorage.setItem('studentRegistrations', JSON.stringify(registrations));

        // ユーザーアカウントも作成
        const users = JSON.parse(localStorage.getItem('sunaUsers') || '[]');
        users.push({
            email: email,
            password: password,
            name: name,
            role: 'student',
            grade: grade,
            registrationDate: registration.registrationDate
        });
        localStorage.setItem('sunaUsers', JSON.stringify(users));

        this.showMessage(`受講生「${name}」を登録しました`, 'success');
        
        // データを更新
        this.loadStudentData();
        this.renderStatsCards();
        this.renderStudentTable();
        this.closeRegistrationModal();

        // ログイン情報を表示
        this.showLoginInfo(email, password);
    }

    // ログイン情報表示
    showLoginInfo(email, password) {
        const loginInfo = `
            メールアドレス: ${email}
            パスワード: ${password}
            ログインURL: ${window.location.origin}/pages/login.html?email=${encodeURIComponent(email)}&auto=true
        `;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(loginInfo).then(() => {
                this.showMessage('ログイン情報をクリップボードにコピーしました', 'success');
            });
        } else {
            alert(`ログイン情報:\n\n${loginInfo}`);
        }
    }

    // パスワード生成
    generatePassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // 受講生編集
    editStudent(studentId) {
        console.log('Edit student:', studentId);
        
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            this.showMessage('受講生が見つかりません', 'error');
            return;
        }
        
        // 編集モーダルを表示
        this.showEditStudentModal(student);
    }

    // 受講生削除
    deleteStudent(studentId) {
        if (!confirm('この受講生を削除しますか？')) return;
        
        const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
        const updatedRegistrations = registrations.filter(reg => reg.id !== studentId);
        localStorage.setItem('studentRegistrations', JSON.stringify(updatedRegistrations));
        
        this.loadStudentData();
        this.renderStatsCards();
        this.renderStudentTable();
        this.showMessage('受講生を削除しました', 'success');
    }

    // 活動更新
    refreshActivity() {
        this.renderRecentActivity();
        this.showMessage('活動データを更新しました', 'success');
    }

    // メッセージ表示
    showMessage(message, type = 'info') {
        // 既存のメッセージを削除
        const existingMessage = document.querySelector('.utage-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // メッセージ要素を作成
        const messageEl = document.createElement('div');
        messageEl.className = `utage-message utage-message-${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2001;
            font-size: 14px;
            font-weight: 500;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        messageEl.textContent = message;

        // CSS アニメーションを追加
        if (!document.querySelector('#utage-message-styles')) {
            const style = document.createElement('style');
            style.id = 'utage-message-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(messageEl);

        // 3秒後に自動削除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // 受講生編集モーダルを表示
    showEditStudentModal(student) {
        // 既存のモーダルを削除
        const existingModal = document.getElementById('edit-student-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 編集モーダルを作成
        const modal = document.createElement('div');
        modal.id = 'edit-student-modal';
        modal.className = 'utage-modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="utage-modal-content">
                <div class="utage-modal-header">
                    <h3 class="utage-modal-title">✏️ 受講生情報を編集</h3>
                    <button class="utage-modal-close" onclick="adminApp.closeEditStudentModal()">&times;</button>
                </div>
                <div class="utage-modal-body">
                    <form id="edit-student-form" onsubmit="adminApp.updateStudent(event, ${student.id})">
                        <div class="utage-form-group">
                            <label for="edit-email">メールアドレス</label>
                            <input type="email" id="edit-email" value="${student.email}" required class="utage-form-input" readonly>
                            <p class="utage-form-help">メールアドレスは変更できません</p>
                        </div>
                        <div class="utage-form-group">
                            <label for="edit-name">受講生名</label>
                            <input type="text" id="edit-name" value="${student.name}" required class="utage-form-input">
                        </div>
                        <div class="utage-form-group">
                            <label for="edit-grade">学年</label>
                            <select id="edit-grade" required class="utage-form-select">
                                <option value="">学年を選択</option>
                                <option value="小学1年" ${student.grade === '小学1年' ? 'selected' : ''}>小学1年</option>
                                <option value="小学2年" ${student.grade === '小学2年' ? 'selected' : ''}>小学2年</option>
                                <option value="小学3年" ${student.grade === '小学3年' ? 'selected' : ''}>小学3年</option>
                                <option value="小学4年" ${student.grade === '小学4年' ? 'selected' : ''}>小学4年</option>
                                <option value="小学5年" ${student.grade === '小学5年' ? 'selected' : ''}>小学5年</option>
                                <option value="小学6年" ${student.grade === '小学6年' ? 'selected' : ''}>小学6年</option>
                                <option value="中学1年" ${student.grade === '中学1年' ? 'selected' : ''}>中学1年</option>
                                <option value="中学2年" ${student.grade === '中学2年' ? 'selected' : ''}>中学2年</option>
                                <option value="中学3年" ${student.grade === '中学3年' ? 'selected' : ''}>中学3年</option>
                                <option value="高校1年" ${student.grade === '高校1年' ? 'selected' : ''}>高校1年</option>
                                <option value="高校2年" ${student.grade === '高校2年' ? 'selected' : ''}>高校2年</option>
                                <option value="高校3年" ${student.grade === '高校3年' ? 'selected' : ''}>高校3年</option>
                            </select>
                        </div>
                        <div class="utage-form-group">
                            <label for="edit-status">ステータス</label>
                            <select id="edit-status" required class="utage-form-select">
                                <option value="active" ${student.status === 'active' ? 'selected' : ''}>アクティブ</option>
                                <option value="inactive" ${student.status === 'inactive' ? 'selected' : ''}>非アクティブ</option>
                                <option value="pending" ${student.status === 'pending' ? 'selected' : ''}>保留中</option>
                            </select>
                        </div>
                        <div class="utage-form-actions">
                            <button type="button" class="utage-btn utage-btn-secondary" onclick="adminApp.closeEditStudentModal()">
                                キャンセル
                            </button>
                            <button type="submit" class="utage-btn utage-btn-primary">
                                ✏️ 更新
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        // 追加: 少し遅延して active クラスを付与しフェードインさせる
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    // 受講生編集モーダルを閉じる
    closeEditStudentModal() {
        const modal = document.getElementById('edit-student-modal');
        if (modal) {
            // フェードアウト用に active クラスを外し、アニメーション後に削除
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) modal.remove();
            }, 300); // CSS の transition と同期
        }
    }

    // 受講生情報を更新
    async updateStudent(event, studentId) {
        event.preventDefault();
        
        const name = document.getElementById('edit-name').value.trim();
        const grade = document.getElementById('edit-grade').value;
        const status = document.getElementById('edit-status').value;

        if (!name || !grade || !status) {
            this.showMessage('すべての項目を入力してください', 'error');
            return;
        }

        // ローカルストレージから受講生データを更新
        const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
        const registrationIndex = registrations.findIndex(reg => reg.id === studentId);
        
        if (registrationIndex !== -1) {
            registrations[registrationIndex].name = name;
            registrations[registrationIndex].grade = grade;
            registrations[registrationIndex].status = status;
            localStorage.setItem('studentRegistrations', JSON.stringify(registrations));

            // ユーザーデータも更新
            const users = JSON.parse(localStorage.getItem('sunaUsers') || '[]');
            const userIndex = users.findIndex(user => user.email === registrations[registrationIndex].email);
            if (userIndex !== -1) {
                users[userIndex].name = name;
                users[userIndex].grade = grade;
                localStorage.setItem('sunaUsers', JSON.stringify(users));
            }

            this.showMessage(`受講生「${name}」の情報を更新しました`, 'success');
            
            // データを再読み込みして表示を更新
            this.loadStudentData();
            this.renderStatsCards();
            this.renderStudentTable();
            this.closeEditStudentModal();
        } else {
            this.showMessage('受講生データの更新に失敗しました', 'error');
        }
    }

    // URLハッシュをチェックしてタブを切り替え
    checkUrlHash() {
        const hash = window.location.hash.substring(1); // #を削除
        if (hash) {
            console.log('URL hash detected:', hash);
            switch (hash) {
                case 'students':
                    this.switchTab('students');
                    break;
                case 'lessons':
                    this.switchTab('lessons');
                    break;
                case 'dashboard':
                    this.switchTab('dashboard');
                    break;
                default:
                    // 不明なハッシュの場合はデフォルトのダッシュボードを表示
                    this.switchTab('dashboard');
                    break;
            }
        }
    }

    // ログアウト
    logout() {
        if (confirm('ログアウトしますか？')) {
            localStorage.removeItem('sunaUser');
            window.location.href = '../pages/login.html';
        }
    }

    // レッスンステータス更新
    updateLessonStatus(lessonId, status) {
        // subjects localStorage を走査して更新
        const subjectsData = JSON.parse(localStorage.getItem('subjects') || '{}');
        let found = false;
        Object.values(subjectsData).forEach(sub => {
            Object.values(sub.courses || {}).forEach(course => {
                Object.values(course.chapters || {}).forEach(chap => {
                    const ls = chap.lessons && chap.lessons[lessonId];
                    if (ls) {
                        ls.status = status;
                        ls.updated_at = new Date().toISOString().split('T')[0];
                        found = true;
                    }
                });
            });
        });
        if (found) {
            localStorage.setItem('subjects', JSON.stringify(subjectsData));
            // テーブルの表示も更新
            this.renderLessonsTable();
        }
    }

    // レッスン削除
    deleteLesson(lessonId) {
        const subjectsData = JSON.parse(localStorage.getItem('subjects') || '{}');
        let removed = false;
        Object.values(subjectsData).forEach(sub => {
            Object.values(sub.courses || {}).forEach(course => {
                Object.values(course.chapters || {}).forEach(chap => {
                    if (chap.lessons && chap.lessons[lessonId]) {
                        delete chap.lessons[lessonId];
                        removed = true;
                    }
                });
            });
        });
        if (removed) {
            localStorage.setItem('subjects', JSON.stringify(subjectsData));
            // テーブル再描画
            this.renderLessonsTable();
        }
    }

    // グループ管理（簡易）
    showGroupManagementModal() {
        console.log('showGroupManagementModal clicked');
        this.showMessage('グループ管理機能は現在準備中です 🛠️', 'info');
    }

    // 並べ替えトグル
    toggleStudentSort() {
        // 名前で昇順 / 降順を切り替え
        this.sortAsc = !this.sortAsc;
        console.log('toggleStudentSort: sortAsc =', this.sortAsc);
        this.students.sort((a, b) => {
// 要注意受講生のレンダリング
    renderAttentionStudents() {
        const container = document.getElementById('attention-students-list');
        if (!container) return;

        const attentionStudents = this.students.filter(s => {
            // 進捗が30%未満または2週間以上未ログイン
            if (s.totalProgress < 30) return true;
            if (!s.lastAccess) return true;
            const lastAccess = new Date(s.lastAccess);
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            return lastAccess < twoWeeksAgo;
        }).slice(0, 5); // 最大5名表示

        if (attentionStudents.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">すべての受講生が順調に進行中です 🎉</p>';
            return;
        }

        container.innerHTML = attentionStudents.map(student => {
            const initial = student.name.charAt(0);
            const reason = student.totalProgress < 30 ? '進捗不足' : '長期未ログイン';
            const progressClass = student.totalProgress < 15 ? 'attention' : 'low';
            
            return `
                <div class="student-item">
                    <div class="student-info">
                        <div class="student-avatar">${initial}</div>
                        <div class="student-details">
                            <h4>${student.name}</h4>
                            <p>${student.grade} • ${reason}</p>
                        </div>
                    </div>
                    <div class="student-progress">
                        <div class="progress-circle ${progressClass}">${student.totalProgress}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 優秀受講生のレンダリング
    renderTopStudents() {
        const container = document.getElementById('top-students-list');
        if (!container) return;

        const topStudents = this.students
            .filter(s => s.totalProgress >= 70)
            .sort((a, b) => b.totalProgress - a.totalProgress)
            .slice(0, 5); // 最大5名表示

        if (topStudents.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">まだ優秀者はいません。頑張りましょう！ 💪</p>';
            return;
        }

        container.innerHTML = topStudents.map((student, index) => {
            const initial = student.name.charAt(0);
            const rank = index + 1;
            const progressClass = student.totalProgress >= 90 ? 'high' : 'medium';
            const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏆';
            
            return `
                <div class="student-item">
                    <div class="student-info">
                        <div class="student-avatar">${initial}</div>
                        <div class="student-details">
                            <h4>${medalIcon} ${student.name}</h4>
                            <p>${student.grade} • 第${rank}位</p>
                        </div>
                    </div>
                    <div class="student-progress">
                        <div class="progress-circle ${progressClass}">${student.totalProgress}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }
            const res = a.name.localeCompare(b.name, 'ja');
            return this.sortAsc ? res : -res;
        });
        this.renderStudentTable();
        this.showMessage(`受講生リストを名前${this.sortAsc ? '昇順' : '降順'}で並べ替えました`, 'success');
// ===== スクール管理機能 =====
    
    // スクール管理の初期化
    initSchoolManagement() {
        this.updateSchoolSelectorDisplay();
        this.updateActiveSchoolOption(this.currentSchool);
    }
    
    // スクールメニューの開閉切り替え
    toggleSchoolMenu() {
        const dropdown = document.getElementById('school-dropdown');
        const arrow = document.getElementById('school-dropdown-arrow');
        const button = document.querySelector('.school-selector-button');
        
        if (!dropdown || !arrow || !button) return;
        
        this.schoolMenuExpanded = !this.schoolMenuExpanded;
        
        if (this.schoolMenuExpanded) {
            dropdown.classList.add('open');
            arrow.classList.add('rotated');
            button.classList.add('active');
        } else {
            dropdown.classList.remove('open');
            arrow.classList.remove('rotated');
            button.classList.remove('active');
        }
    }
    
    // スクール選択
    selectSchool(schoolId, schoolName, schoolIcon) {
        this.currentSchool = schoolId;
        
        // スクール情報を更新（新しいスクールの場合）
        if (!this.schools[schoolId]) {
            this.schools[schoolId] = { name: schoolName, icon: schoolIcon };
        }
        
        // ローカルストレージに保存
        localStorage.setItem('selectedSchool', schoolId);
        localStorage.setItem('schools', JSON.stringify(this.schools));
        
        // 選択されたスクールの表示を更新
        this.updateSchoolSelectorDisplay();
        
        // アクティブなスクールオプションを更新
        this.updateActiveSchoolOption(schoolId);
        
        // スクールメニューを閉じる
        this.schoolMenuExpanded = true; // 現在の状態を反転させるため
        this.toggleSchoolMenu();
        
        // データを再読み込み（選択されたスクールに基づいて）
        this.loadStudentData();
        this.renderStatsCards();
        this.renderStudentTable();
        this.renderRecentActivity();
        this.renderLessonsTable();
        
        // 成功メッセージを表示
        this.showMessage(`${schoolName}に切り替えました`, 'success');
    }
    
    // スクールセレクターの表示を更新
    updateSchoolSelectorDisplay() {
        const icon = document.getElementById('selected-school-icon');
        const text = document.getElementById('selected-school-text');
        
        if (!icon || !text) return;
        
        const school = this.schools[this.currentSchool];
        if (school) {
            icon.textContent = school.icon;
            text.textContent = school.name;
        } else {
            icon.textContent = '🏫';
            text.textContent = 'スクール選択';
        }
    }
    
    
    // アクティブなスクールオプションを更新
    updateActiveSchoolOption(schoolId) {
        // 全てのスクールオプションからselectedクラスを削除
        const schoolOptions = document.querySelectorAll('.school-option');
        schoolOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // 選択されたスクールオプションにselectedクラスを追加
        const selectedOption = document.querySelector(`[data-school="${schoolId}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
    
    // 新しいスクール追加機能
    addNewSchool() {
        const schoolName = prompt('新しいスクール名を入力してください:');
        if (!schoolName || schoolName.trim() === '') return;
        
        const schoolIcon = prompt('スクールのアイコン（絵文字）を入力してください:', '🏫');
        if (!schoolIcon || schoolIcon.trim() === '') return;
        
        // ユニークなIDを生成
        const schoolId = 'custom_' + Date.now();
        
        // 新しいスクールを追加
        this.schools[schoolId] = {
            name: schoolName.trim(),
            icon: schoolIcon.trim()
        };
        
        // ローカルストレージに保存
        localStorage.setItem('schools', JSON.stringify(this.schools));
        
        // ドロップダウンに新しいオプションを追加
        this.addSchoolOptionToDropdown(schoolId, schoolName.trim(), schoolIcon.trim());
        
        // 新しいスクールを選択
        this.selectSchool(schoolId, schoolName.trim(), schoolIcon.trim());
        
        this.showMessage(`新しいスクール「${schoolName.trim()}」を追加しました`, 'success');
    }
    
    // ドロップダウンに新しいスクールオプションを追加
    addSchoolOptionToDropdown(schoolId, schoolName, schoolIcon) {
        const dropdown = document.getElementById('school-dropdown');
        const addButton = dropdown.querySelector('.add-school');
        
        if (!dropdown || !addButton) return;
        
        const newOption = document.createElement('div');
        newOption.className = 'school-option';
        newOption.setAttribute('data-school', schoolId);
        newOption.onclick = () => this.selectSchool(schoolId, schoolName, schoolIcon);
        
        newOption.innerHTML = `
            <span class="school-option-icon">${schoolIcon}</span>
            <span>${schoolName}</span>
        `;
        
        // 追加ボタンの前に挿入
        dropdown.insertBefore(newOption, addButton);
    }
    
    // 現在のスクールに基づいてデータをフィルタリング
    filterDataBySchool(data) {
        if (!data || !Array.isArray(data)) return data;
        
        // スクール別にデータをフィルタリング
        // ここでは学年に基づいてフィルタリング
        const schoolGrades = {
            elementary: ['小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年'],
            junior: ['中学1年', '中学2年', '中学3年'],
            senior: ['高校1年', '高校2年', '高校3年']
        };
        
        const currentGrades = schoolGrades[this.currentSchool] || [];
        return data.filter(item => {
            if (item.grade) {
                return currentGrades.includes(item.grade);
            }
            return true; // 学年情報がない場合は表示
        });
    }
}

// アプリケーションの初期化
let adminApp;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing AdminApp...');
    
    // 認証チェック
    const currentUser = JSON.parse(localStorage.getItem('sunaUser') || '{}');
    if (!currentUser.email || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
        console.log('No admin user found, redirecting to login...');
        window.location.href = '../pages/login.html';
        return;
    }

    adminApp = new AdminApp();
    window.adminApp = adminApp;
});

// 互換性のため古い関数名も残す
function showRegistrationModal() {
    if (adminApp) adminApp.showRegistrationModal();
}

function closeRegistrationModal() {
    if (adminApp) adminApp.closeRegistrationModal();
}

function registerStudent(event) {
    if (adminApp) adminApp.registerStudent(event);
}
// グローバル関数（HTMLのonclickから呼び出し可能）
function switchTab(tabName) {
    if (window.adminApp) window.adminApp.switchTab(tabName);
}