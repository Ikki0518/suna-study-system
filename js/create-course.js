// 講座作成ページの機能管理
class CourseCreator {
    constructor() {
        this.courseData = {
            title: '',
            description: '',
            subject: '',
            content: '',
            video: null,
            videoType: 'file', // 'file' or 'url'
            videoUrl: '',
            pdf: null
        };
        this.init();
    }

    init() {
        console.log('CourseCreator initialized');
        this.bindEvents();
        this.updateAuthUI();
        this.setupDragAndDrop();
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
    }

    // フォーム要素の変更を監視
    bindFormUpdates() {
        const formInputs = ['course-title', 'course-description', 'course-subject', 'course-content', 'video-link'];
        
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
        this.courseData.subject = document.getElementById('course-subject').value;
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

        if (!this.courseData.subject) {
            errors.push('科目を選択してください');
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
        const courseId = 'course_' + Date.now();
        const courseDataToSave = {
            id: courseId,
            title: this.courseData.title,
            description: this.courseData.description,
            subject: this.courseData.subject,
            content: this.courseData.content,
            videoType: this.courseData.videoType,
            videoUrl: this.courseData.videoUrl,
            createdAt: new Date().toISOString(),
            createdBy: authManager.currentUser.email
        };

        // ファイルデータをBase64で保存（実際のプロダクションでは適さない）
        if (this.courseData.video) {
            courseDataToSave.videoData = await this.fileToBase64(this.courseData.video);
            courseDataToSave.videoName = this.courseData.video.name;
            courseDataToSave.videoType = this.courseData.video.type;
        }

        if (this.courseData.pdf) {
            courseDataToSave.pdfData = await this.fileToBase64(this.courseData.pdf);
            courseDataToSave.pdfName = this.courseData.pdf.name;
        }

        // 管理者用の講座データとして保存
        const existingCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
        existingCourses.push(courseDataToSave);
        localStorage.setItem('adminCourses', JSON.stringify(existingCourses));

        // 学習システムのsubjectsデータに統合
        this.integrateCourseIntoSystem(courseDataToSave);

        console.log('講座が保存され、学習システムに統合されました:', courseDataToSave);
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
        const subjectKey = this.mapSubjectToKey(courseData.subject);
        if (!subjects[subjectKey]) {
            // 科目が存在しない場合は新しく作成
            subjects[subjectKey] = {
                name: this.getSubjectDisplayName(courseData.subject),
                color: this.getSubjectColor(courseData.subject),
                icon: this.getSubjectIcon(courseData.subject),
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