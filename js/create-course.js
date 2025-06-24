// 講座作成ページの機能管理
class CourseCreator {
    constructor() {
        // ===== 講座（レッスン）データ構造 =====
        this.courseData = {
            title: '',
            description: '',
            subjectId: '',   // 科目ID
            courseId: '',    // コースID
            chapterId: '',   // 章ID
            content: '',
            video: null,
            videoType: 'file', // 'file' or 'url'
            videoUrl: '',
            pdf: null
        };

        // ===== 階層データを保持 =====
        this.hierarchyKey = 'contentHierarchy';
        this.hierarchy = this.loadHierarchy();
        this.editingIndex = null; // 追加: 編集中のインデックス
        this.selectedCourseId = '';
        this.selectedChapterId = '';
        this.init();
    }

    init() {
        console.log('CourseCreator initialized');
        this.bindEvents();
        this.updateAuthUI();
        this.setupDragAndDrop();
        // 階層セレクトを初期化
        this.updateSubjectSelect();
        this.updateCourseSelect();
        this.updateChapterSelect();
        this.renderCoursesList(); // 既存講座を表示
        this.renderCoursesManager();
    }

    // 管理者認証チェック
    checkAdminAuth() {
        if (!authManager || !authManager.requireAdminAuth()) {
            return false;
        }
        return true;
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
                        <select id="create-course-school-select" onchange="authManager.changeSchool(this.value)">
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

    // イベントバインディング
    bindEvents() {
        const form = document.getElementById('course-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // 動画タイプ切り替え
        const videoTypeRadios = document.querySelectorAll('input[name="video-type"]');
        videoTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.toggleVideoSection(e.target.value));
        });

        // ファイルアップロード
        const videoUpload = document.getElementById('video-upload');
        const pdfUpload = document.getElementById('pdf-upload');

        if (videoUpload) {
            videoUpload.addEventListener('change', (e) => this.handleVideoUpload(e));
        }

        if (pdfUpload) {
            pdfUpload.addEventListener('change', (e) => this.handlePdfUpload(e));
        }

        // リアルタイムフォーム更新
        this.bindFormUpdates();

        // 階層関連ボタンイベント
        this.bindHierarchyButtonEvents();
    }

    // フォーム要素の変更を監視
    bindFormUpdates() {
        const formInputs = ['course-title', 'course-description', 'course-subject', 'course-course', 'course-chapter', 'course-content', 'video-link'];
        
        formInputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.addEventListener('input', () => this.updateCourseData());
            }
        });
    }

    // 講座データ更新
    updateCourseData() {
        this.courseData.title = document.getElementById('course-title').value;
        this.courseData.description = document.getElementById('course-description').value;
        const subjSel = document.getElementById('course-subject');
        const courseSel = document.getElementById('course-course');
        const chapSel = document.getElementById('course-chapter');

        this.courseData.subjectId = subjSel ? subjSel.value : '';
        this.courseData.courseId = courseSel ? courseSel.value : '';
        this.courseData.chapterId = chapSel ? chapSel.value : '';
        this.courseData.content = document.getElementById('course-content').value;
        
        const videoTypeChecked = document.querySelector('input[name="video-type"]:checked');
        if (videoTypeChecked) {
            this.courseData.videoType = videoTypeChecked.value;
        }
        
        if (this.courseData.videoType === 'url') {
            this.courseData.videoUrl = document.getElementById('video-link').value;
        }
    }

    // 動画セクション切り替え
    toggleVideoSection(type) {
        const fileSection = document.getElementById('video-file-section');
        const urlSection = document.getElementById('video-url-section');

        if (type === 'file') {
            fileSection.style.display = 'block';
            urlSection.style.display = 'none';
        } else {
            fileSection.style.display = 'none';
            urlSection.style.display = 'block';
        }

        this.courseData.videoType = type;
    }

    // ドラッグ＆ドロップ設定
    setupDragAndDrop() {
        this.setupFileDropArea('video-upload-area', 'video-upload');
        this.setupFileDropArea('pdf-upload-area', 'pdf-upload');
    }

    // ファイルドロップエリア設定
    setupFileDropArea(areaId, inputId) {
        const area = document.getElementById(areaId);
        const input = document.getElementById(inputId);

        if (!area || !input) return;

        // ドラッグオーバー
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        // ドラッグリーブ
        area.addEventListener('dragleave', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
        });

        // ドロップ
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                
                if (inputId === 'video-upload') {
                    this.handleVideoUpload({ target: input });
                } else if (inputId === 'pdf-upload') {
                    this.handlePdfUpload({ target: input });
                }
            }
        });
    }

    // 動画アップロード処理
    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // ファイルタイプチェック
        if (!file.type.startsWith('video/')) {
            this.showError('動画ファイルを選択してください');
            return;
        }

        // ファイルサイズチェック（100MB制限）
        if (file.size > 100 * 1024 * 1024) {
            this.showError('ファイルサイズは100MB以下にしてください');
            return;
        }

        this.courseData.video = file;
        this.showVideoPreview(file);
    }

    // PDF アップロード処理
    handlePdfUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // ファイルタイプチェック
        if (file.type !== 'application/pdf') {
            this.showError('PDFファイルを選択してください');
            return;
        }

        // ファイルサイズチェック（50MB制限）
        if (file.size > 50 * 1024 * 1024) {
            this.showError('ファイルサイズは50MB以下にしてください');
            return;
        }

        this.courseData.pdf = file;
        this.showPdfPreview(file);
    }

    // 動画プレビュー表示
    showVideoPreview(file) {
        const preview = document.getElementById('video-preview');
        const placeholder = document.querySelector('#video-upload-area .upload-placeholder');
        
        if (!preview || !placeholder) return;

        const fileSize = this.formatFileSize(file.size);
        
        preview.innerHTML = `
            <div class="file-info">
                <div class="file-icon">🎬</div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>サイズ: ${fileSize} | タイプ: ${file.type}</p>
                </div>
            </div>
            <div class="file-actions">
                <button type="button" class="file-action remove" onclick="courseCreator.removeVideo()">削除</button>
            </div>
        `;

        placeholder.style.display = 'none';
        preview.style.display = 'block';
    }

    // PDF プレビュー表示
    showPdfPreview(file) {
        const preview = document.getElementById('pdf-preview');
        const placeholder = document.querySelector('#pdf-upload-area .upload-placeholder');
        
        if (!preview || !placeholder) return;

        const fileSize = this.formatFileSize(file.size);
        
        preview.innerHTML = `
            <div class="file-info">
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>サイズ: ${fileSize} | ページ数: 読み込み中...</p>
                </div>
            </div>
            <div class="file-actions">
                <button type="button" class="file-action" onclick="courseCreator.previewPdf()">プレビュー</button>
                <button type="button" class="file-action remove" onclick="courseCreator.removePdf()">削除</button>
            </div>
        `;

        placeholder.style.display = 'none';
        preview.style.display = 'block';

        // PDF情報を読み取り
        this.loadPdfInfo(file);
    }

    // PDF情報読み取り
    async loadPdfInfo(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            const pageCountElement = document.querySelector('#pdf-preview .file-details p');
            if (pageCountElement) {
                const fileSize = this.formatFileSize(file.size);
                pageCountElement.textContent = `サイズ: ${fileSize} | ページ数: ${pdf.numPages}`;
            }
        } catch (error) {
            console.error('PDF読み込みエラー:', error);
        }
    }

    // ファイルサイズフォーマット
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 動画削除
    removeVideo() {
        this.courseData.video = null;
        const preview = document.getElementById('video-preview');
        const placeholder = document.querySelector('#video-upload-area .upload-placeholder');
        const input = document.getElementById('video-upload');
        
        if (preview) preview.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        if (input) input.value = '';
    }

    // PDF削除
    removePdf() {
        this.courseData.pdf = null;
        const preview = document.getElementById('pdf-preview');
        const placeholder = document.querySelector('#pdf-upload-area .upload-placeholder');
        const input = document.getElementById('pdf-upload');
        
        if (preview) preview.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        if (input) input.value = '';
    }

    // PDF プレビュー
    previewPdf() {
        if (!this.courseData.pdf) return;
        
        // 新しいウィンドウでPDFを開く
        const url = URL.createObjectURL(this.courseData.pdf);
        window.open(url, '_blank');
    }

    // フォーム送信処理
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.checkAdminAuth()) return;

        this.updateCourseData();

        // バリデーション
        if (!this.validateForm()) {
            return;
        }

        // 送信ボタンを無効化
        const submitButton = event.target.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = '作成中...';
        }

        try {
            // 講座データを保存
            await this.saveCourse();
            
            // 成功モーダル表示
            this.showSuccessModal();
            
        } catch (error) {
            console.error('講座作成エラー:', error);
            this.showError('講座の作成に失敗しました');
        } finally {
            // 送信ボタンを復元
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = '✅ 講座を作成';
            }
        }
    }

    // フォームバリデーション
    validateForm() {
        const errors = [];

        if (!this.courseData.title.trim()) {
            errors.push('講座タイトルを入力してください');
        }

        if (!this.courseData.description.trim()) {
            errors.push('講座説明を入力してください');
        }

        if (!this.courseData.subjectId) {
            errors.push('科目を選択してください');
        }

        if (!this.courseData.courseId) {
            errors.push('コースを選択してください');
        }

        if (!this.courseData.chapterId) {
            errors.push('章を選択してください');
        }

        if (!this.courseData.content.trim()) {
            errors.push('講義本文を入力してください');
        }

        // 動画は任意（必須ではない）
        if (this.courseData.videoType === 'url' && this.courseData.videoUrl.trim() && !this.isValidUrl(this.courseData.videoUrl)) {
            errors.push('有効な動画URLを入力してください');
        }

        if (errors.length > 0) {
            this.showError(errors.join('\n'));
            return false;
        }

        return true;
    }

    // URL有効性チェック
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // 講座保存
    async saveCourse() {
        // 編集モードのときは更新、そうでなければ新規追加
        const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');

        const courseDataToSave = { ...this.courseData, createdAt: Date.now() };

        if (this.editingIndex !== null) {
            courses[this.editingIndex] = courseDataToSave;
            this.editingIndex = null;
            document.querySelector('#course-form .btn-primary').textContent = '✅ 講座を更新';
        } else {
            courses.push(courseDataToSave);
        }

        localStorage.setItem('adminCourses', JSON.stringify(courses));

        // subjects 統合は新規時のみ実施（旧システム）。
        // 新しい階層管理では不要のため一旦スキップ。

        this.renderCoursesList();

        this.showSuccessModal();
    }

    // 作成した講座を学習システムに統合
    integrateCourseIntoSystem(courseData) {
        // メインシステムのsubjectsデータを取得
        let subjects = JSON.parse(localStorage.getItem('subjects') || 'null');
        
        // subjectsが存在しない場合は、デフォルトの構造を作成
        if (!subjects) {
            subjects = this.getDefaultSubjects();
        }

        // 講座データを適切な科目に追加
        const subjectKey = this.mapSubjectToKey(courseData.subjectId);
        if (!subjects[subjectKey]) {
            // 科目が存在しない場合は新しく作成
            subjects[subjectKey] = {
                name: this.getSubjectDisplayName(courseData.subjectId),
                color: this.getSubjectColor(courseData.subjectId),
                icon: this.getSubjectIcon(courseData.subjectId),
                courses: {}
            };
        }

        // 新しいコースとして追加
        const newCourse = {
            title: courseData.title,
            description: courseData.description,
            color: subjects[subjectKey].color,
            chapters: {
                "chapter1": {
                    title: "第1章",
                    lessons: {
                        "lesson1": {
                            title: courseData.title,
                            description: courseData.description,
                            content: courseData.content,
                            videoUrl: courseData.videoType === 'url' ? courseData.videoUrl : 
                                     courseData.videoData ? `data:${courseData.videoType};base64,${courseData.videoData.split(',')[1]}` : 
                                     null,
                            completed: false,
                            duration: "約30分",
                            pdfData: courseData.pdfData || null,
                            pdfName: courseData.pdfName || null
                        }
                    }
                }
            }
        };

        // 新しいコースIDを生成
        const newCourseId = `custom_${Date.now()}`;
        subjects[subjectKey].courses[newCourseId] = newCourse;

        // ローカルストレージに保存
        localStorage.setItem('subjects', JSON.stringify(subjects));
        
        console.log(`講座「${courseData.title}」が${subjects[subjectKey].name}に追加されました`);
    }

    // 科目マッピング
    mapSubjectToKey(subject) {
        const mapping = {
            'japanese': 'japanese',
            'math': 'math',
            'english': 'english',
            'science': 'science',
            'social': 'social',
            'programming': 'programming',
            'other': 'other'
        };
        return mapping[subject] || 'other';
    }

    // 科目表示名取得
    getSubjectDisplayName(subject) {
        const names = {
            'japanese': '国語',
            'math': '数学',
            'english': '英語',
            'science': '理科',
            'social': '社会',
            'programming': 'プログラミング',
            'other': 'その他'
        };
        return names[subject] || 'その他';
    }

    // 科目カラー取得
    getSubjectColor(subject) {
        const colors = {
            'japanese': '#dc2626',
            'math': '#2563eb',
            'english': '#059669',
            'science': '#7c3aed',
            'social': '#ea580c',
            'programming': '#0891b2',
            'other': '#6b7280'
        };
        return colors[subject] || '#6b7280';
    }

    // 科目アイコン取得
    getSubjectIcon(subject) {
        const icons = {
            'japanese': '📚',
            'math': '🔢',
            'english': '🌍',
            'science': '🔬',
            'social': '🌏',
            'programming': '💻',
            'other': '📖'
        };
        return icons[subject] || '📖';
    }

    // デフォルトのsubjects構造を取得
    getDefaultSubjects() {
        return {
            japanese: {
                name: '国語',
                color: '#dc2626',
                icon: '📚',
                courses: {}
            },
            math: {
                name: '数学',
                color: '#2563eb', 
                icon: '🔢',
                courses: {}
            },
            english: {
                name: '英語',
                color: '#059669',
                icon: '🌍',
                courses: {}
            },
            science: {
                name: '理科',
                color: '#7c3aed',
                icon: '🔬',
                courses: {}
            },
            social: {
                name: '社会',
                color: '#ea580c',
                icon: '🌏',
                courses: {}
            },
            programming: {
                name: 'プログラミング',
                color: '#0891b2',
                icon: '💻',
                courses: {}
            },
            other: {
                name: 'その他',
                color: '#6b7280',
                icon: '📖',
                courses: {}
            }
        };
    }

    // ファイルをBase64に変換
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // 下書き保存
    saveDraft() {
        this.updateCourseData();
        localStorage.setItem('courseDraft', JSON.stringify(this.courseData));
        this.showSuccess('下書きを保存しました');
    }

    // プレビュー表示
    showPreview() {
        this.updateCourseData();
        
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        let videoHtml = '';
        if (this.courseData.videoType === 'url' && this.courseData.videoUrl) {
            videoHtml = this.generateVideoEmbed(this.courseData.videoUrl);
        } else if (this.courseData.video) {
            const videoUrl = URL.createObjectURL(this.courseData.video);
            videoHtml = `
                <div class="video-container">
                    <video controls style="width: 100%; max-width: 400px;">
                        <source src="${videoUrl}" type="${this.courseData.video.type}">
                        お使いのブラウザは動画の再生に対応していません。
                    </video>
                </div>
            `;
        }

        let pdfHtml = '';
        if (this.courseData.pdf) {
            pdfHtml = `
                <div class="pdf-container">
                    <p><strong>PDFファイル:</strong> ${this.courseData.pdf.name}</p>
                    <button type="button" onclick="courseCreator.previewPdf()" class="btn btn-secondary">PDFを開く</button>
                </div>
            `;
        }

        previewContent.innerHTML = `
            <div class="preview-course">
                <h1>${this.courseData.title || '講座タイトル'}</h1>
                <div class="course-description">${this.courseData.description || '講座説明'}</div>
                ${videoHtml}
                <div class="course-content">${this.courseData.content || '講義本文'}</div>
                ${pdfHtml}
            </div>
        `;
    }

    // 動画埋め込みHTML生成
    generateVideoEmbed(url) {
        // YouTube URL の変換
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            return `
                <div class="video-container">
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${youtubeMatch[1]}" 
                            frameborder="0" allowfullscreen style="max-width: 400px;"></iframe>
                </div>
            `;
        }

        // Vimeo URL の変換
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `
                <div class="video-container">
                    <iframe width="100%" height="315" src="https://player.vimeo.com/video/${vimeoMatch[1]}" 
                            frameborder="0" allowfullscreen style="max-width: 400px;"></iframe>
                </div>
            `;
        }

        return `<p>対応していない動画URLです: ${url}</p>`;
    }

    // プレビュー非表示
    hidePreview() {
        const previewContent = document.getElementById('preview-content');
        if (previewContent) {
            previewContent.innerHTML = '<p class="preview-empty">プレビューボタンを押すと、作成中の講座内容を確認できます</p>';
        }
    }

    // 成功モーダル表示
    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // エラーメッセージ表示
    showError(message) {
        if (typeof authManager !== 'undefined' && authManager) {
            authManager.showMessage(message, 'error');
        } else {
            alert(message);
        }
    }

    // 成功メッセージ表示
    showSuccess(message) {
        if (typeof authManager !== 'undefined' && authManager) {
            authManager.showMessage(message, 'success');
        } else {
            alert(message);
        }
    }

    // 各項目の追加・編集・削除
    addCourse(subjectId) {
        this.showCreateModal('course', subjectId);
    }

    addChapter(subjectId) {
        console.log('🔥 addChapter called with subjectId:', subjectId);
        console.log('🔥 Available subjects before modal:', Object.keys(this.subjects));
        console.log('🔥 Subject exists:', !!this.subjects[subjectId]);
        this.showCreateModal('chapter', subjectId);
    }

    addLesson(chapterId) {
        this.showCreateModal('lesson', chapterId);
    }

    showCreateModal(type, parentId) {
            switch (type) {
                case 'subject':
                success = this.createSubject(name, description);
                    break;
            case 'course':
                if (!parentId) {
                    alert('コースを作成するには科目を選択してください');
                    return;
                }
                success = this.createCourse(parentId, name, description);
                break;
            case 'chapter':
                console.log('Creating chapter with parentId:', parentId);
                console.log('Available subjects:', Object.keys(this.subjects));
                
                if (!parentId) {
                    alert('章を作成するには科目を選択してください');
                    return;
                }
                
                if (!this.subjects[parentId]) {
                    console.error('Subject not found for ID:', parentId);
                    console.log('Available subjects data:', this.subjects);
                    alert(`科目が見つかりません（ID: ${parentId}）`);
                    return;
                }
                success = this.createChapter(parentId, name, description);
                break;
            case 'lesson':
                if (!parentId) {
                    alert('講義を作成するには章を選択してください');
                    return;
                }
                success = this.createLesson(parentId, name, description);
                break;
            }
        }

    /* ======== 講座一覧の管理 ======== */

    // 講座一覧をレンダリング
    renderCoursesList() {
        const listEl = document.getElementById('courses-list');
        if (!listEl) return;

        const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
        if (courses.length === 0) {
            listEl.innerHTML = '<p style="color:#6b7280;">まだ講座がありません</p>';
            return;
        }

        listEl.innerHTML = courses.map((c, idx) => this.generateCourseCard(c, idx)).join('');
    }

    // カード HTML 生成
    generateCourseCard(course, index) {
        const subjObj = this.hierarchy.subjects.find(s => s.id === course.subjectId);
        const subjectName = subjObj ? subjObj.name : '－';
        return `
            <div class="course-card" style="height: auto;">
                <div class="course-card-content">
                    <h4 class="course-card-title">${course.title}</h4>
                    <p class="course-card-description">${course.description}</p>
                    <div class="course-card-footer" style="margin-top:12px;">
                        <span class="course-progress">${subjectName}</span>
                        <div>
                            <button class="course-button" style="background:#6b7280;margin-right:6px;" onclick="courseCreator.loadCourseToForm(${index})">編集</button>
                            <button class="course-button" style="background:#dc2626;" onclick="courseCreator.deleteCourse(${index})">削除</button>
                            </div>
                        </div>
                    </div>
                    </div>
        `;
    }

    // 講座をフォームに読み込む
    loadCourseToForm(index) {
        const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
        const course = courses[index];
        if (!course) return;

        // フォームへ値反映
        document.getElementById('course-title').value = course.title;
        document.getElementById('course-description').value = course.description;
        document.getElementById('course-subject').value = course.subjectId;
        document.getElementById('course-content').value = course.content;

        if (course.videoType === 'url') {
            document.getElementById('video-url').checked = true;
            this.toggleVideoSection('url');
            document.getElementById('video-link').value = course.videoUrl;
        } else {
            document.getElementById('video-file').checked = true;
            this.toggleVideoSection('file');
            // ファイルは再設定できないので無視
        }

        this.editingIndex = index;
        document.querySelector('#course-form .btn-primary').textContent = '✅ 講座を更新';
        this.updateCourseData();

        // セレクト連動更新
        this.updateCourseSelect();
        document.getElementById('course-course').value = course.courseId || '';
        this.updateChapterSelect();
        document.getElementById('course-chapter').value = course.chapterId || '';
    }

    // 講座を削除
    deleteCourse(index) {
        if (!confirm('この講座を削除しますか？')) return;
        const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
        courses.splice(index, 1);
        localStorage.setItem('adminCourses', JSON.stringify(courses));
        this.renderCoursesList();
        alert('削除しました');
    }

    /* ================= 階層データの読み書き ================= */

    loadHierarchy() {
        const raw = localStorage.getItem(this.hierarchyKey);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                console.error('階層データのパースに失敗', e);
            }
        }
        // デフォルト構造
        const initial = { subjects: [] };
        localStorage.setItem(this.hierarchyKey, JSON.stringify(initial));
        return initial;
    }

    saveHierarchy() {
        localStorage.setItem(this.hierarchyKey, JSON.stringify(this.hierarchy));
    }

    generateId(prefix) {
        return `${prefix}_${Date.now()}`;
    }

    /* ===== 追加メソッド ===== */

    createSubject(name, description = '') {
        const id = this.generateId('sub');
        this.hierarchy.subjects.push({ id, name, description, courses: [] });
        this.saveHierarchy();
        this.updateSubjectSelect();
        return id;
    }

    createCourse(subjectId, name, description = '') {
        const subject = this.hierarchy.subjects.find(s => s.id === subjectId);
        if (!subject) return null;
        const id = this.generateId('course');
        subject.courses.push({ id, name, description, chapters: [] });
        this.saveHierarchy();
        this.updateCourseSelect();
        return id;
    }

    createChapter(courseId, name, description = '') {
        for (const subject of this.hierarchy.subjects) {
            const course = subject.courses.find(c => c.id === courseId);
            if (course) {
                const id = this.generateId('chap');
                course.chapters.push({ id, name, description, lessons: [] });
                this.saveHierarchy();
                this.updateChapterSelect();
                return id;
            }
        }
        return null;
    }

    /* ================= セレクト更新 ================= */

    updateSubjectSelect() {
        const select = document.getElementById('course-subject');
        if (!select) return;
        // 現在値を保持
        const current = select.value;
        select.innerHTML = '<option value="">科目を選択してください</option>' +
            this.hierarchy.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        select.value = current;
        // コースセレクトを連動
        this.updateCourseSelect();
    }

    updateCourseSelect() {
        const subjectId = document.getElementById('course-subject').value;
        const courseSelect = document.getElementById('course-course');
        if (!courseSelect) return;
        if (!subjectId) {
            courseSelect.innerHTML = '<option value="">コースを選択してください</option>';
            courseSelect.disabled = true;
            this.updateChapterSelect();
            return;
        }
        const subject = this.hierarchy.subjects.find(s => s.id === subjectId);
        const options = subject ? subject.courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('') : '';
        courseSelect.innerHTML = '<option value="">コースを選択してください</option>' + options;
        courseSelect.disabled = false;
        // chapter update
        this.updateChapterSelect();
    }

    updateChapterSelect() {
        const courseId = document.getElementById('course-course').value;
        const chapterSelect = document.getElementById('course-chapter');
        if (!chapterSelect) return;
        if (!courseId) {
            chapterSelect.innerHTML = '<option value="">章を選択してください</option>';
            chapterSelect.disabled = true;
            return;
        }
        let chapters = [];
        for (const subject of this.hierarchy.subjects) {
            const course = subject.courses.find(c => c.id === courseId);
            if (course) { chapters = course.chapters; break; }
        }
        const options = chapters.map(ch => `<option value="${ch.id}">${ch.name}</option>`).join('');
        chapterSelect.innerHTML = '<option value="">章を選択してください</option>' + options;
        chapterSelect.disabled = false;
    }

    /* ================= UIイベント ================= */

    bindHierarchyButtonEvents() {
        const addSubjectBtn = document.getElementById('add-subject-btn');
        const addCourseBtn = document.getElementById('add-course-btn');
        const addChapterBtn = document.getElementById('add-chapter-btn');

        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => {
                const name = prompt('新しい科目名を入力');
                if (name) {
                    this.createSubject(name);
                }
            });
        }

        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => {
                const subjectId = document.getElementById('course-subject').value;
                if (!subjectId) {
                    alert('先に科目を選択してください');
                    return;
                }
                const name = prompt('新しいコース名を入力');
                if (name) {
                    this.createCourse(subjectId, name);
                }
            });
        }

        if (addChapterBtn) {
            addChapterBtn.addEventListener('click', () => {
                const courseId = document.getElementById('course-course').value;
                if (!courseId) {
                    alert('先にコースを選択してください');
                    return;
                }
                const name = prompt('新しい章のタイトルを入力');
                if (name) {
                    this.createChapter(courseId, name);
                }
            });
        }

        // セレクト連動
        const subjectSelect = document.getElementById('course-subject');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', () => this.updateCourseSelect());
        }
        const courseSelect = document.getElementById('course-course');
        if (courseSelect) {
            courseSelect.addEventListener('change', () => this.updateChapterSelect());
        }
    }

    /* ========= コース/章 表示 ========= */
    renderCoursesManager() {
        this.renderCoursesTable();
        this.renderChaptersTable();

        // グローバル追加ボタン
        const addCourseBtn = document.getElementById('global-add-course-btn');
        if (addCourseBtn) {
            addCourseBtn.onclick = () => {
                const name = prompt('コース名を入力');
                if (name) {
                    const subjId = this.courseData.subjectId || this.hierarchy.subjects[0]?.id || this.createSubject('未分類');
                    this.createCourse(subjId, name);
                    this.renderCoursesTable();
                }
            };
        }

        const addChapterBtn = document.getElementById('global-add-chapter-btn');
        if (addChapterBtn) {
            addChapterBtn.onclick = () => {
                if (!this.selectedCourseId) {
                    alert('先にコースを選択してください');
                    return;
                }
                const name = prompt('章タイトルを入力');
                if (name) {
                    this.createChapter(this.selectedCourseId, name);
                    this.renderChaptersTable();
                }
            };
        }
    }

    renderCoursesTable() {
        const table = document.getElementById('courses-table');
        if (!table) return;
        const courses = [];
        this.hierarchy.subjects.forEach(s => s.courses.forEach(c => courses.push({...c, subjectName: s.name})));
        table.innerHTML = courses.map(c => `<tr data-id="${c.id}" class="${c.id===this.selectedCourseId?'selected-row':''}"><td>${c.name}</td><td>${c.subjectName}</td></tr>`).join('') || '<tr><td>コースがありません</td></tr>';
        Array.from(table.querySelectorAll('tr[data-id]')).forEach(row=>{
            row.onclick = ()=>{
                this.selectedCourseId = row.dataset.id;
                this.selectedChapterId='';
                this.renderCoursesTable();
                this.renderChaptersTable();
                document.getElementById('chapters-block').style.display='block';
                document.getElementById('current-course-name').textContent = row.cells[0].textContent;
            };
        });
    }

    renderChaptersTable() {
        const table = document.getElementById('chapters-table');
        if (!table) return;
        if (!this.selectedCourseId) { table.innerHTML=''; return; }
        let chapters=[];
        this.hierarchy.subjects.forEach(s=>{
            const course=s.courses.find(c=>c.id===this.selectedCourseId);
            if (course) chapters=course.chapters;
        });
        table.innerHTML = chapters.map(ch=>`<tr data-id="${ch.id}" class="${ch.id===this.selectedChapterId?'selected-row':''}"><td>${ch.name}</td></tr>`).join('') || '<tr><td>章がありません</td></tr>';
        Array.from(table.querySelectorAll('tr[data-id]')).forEach(row=>{
            row.onclick=()=>{
                this.selectedChapterId=row.dataset.id;
                this.renderChaptersTable();
                // フォームを開く
                document.getElementById('lesson-editor-block').style.display='block';
                document.getElementById('course-course').value=this.selectedCourseId;
                this.updateChapterSelect();
                document.getElementById('course-chapter').value=this.selectedChapterId;
                this.updateCourseData();
            };
        });
    }
}

// グローバル関数
function showPreview() {
    courseCreator.showPreview();
}

function hidePreview() {
    courseCreator.hidePreview();
}

function saveDraft() {
    courseCreator.saveDraft();
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

function createAnother() {
    window.location.reload();
}

// 講座作成アプリケーションの初期化
let courseCreator;
document.addEventListener('DOMContentLoaded', () => {
    // AuthManagerの初期化を待つ
    setTimeout(() => {
        if (typeof authManager !== 'undefined' && authManager) {
            if (authManager.requireAdminAuth()) {
                    courseCreator = new CourseCreator();
                window.courseCreator = courseCreator; // グローバルアクセス用
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