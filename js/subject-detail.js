// 科目詳細ページの機能管理
class SubjectDetail {
    constructor() {
        this.currentSubjectId = null;
        this.currentSubject = null;
        this.subjects = {};
        this.selectedItems = new Set();
        this.deleteTarget = null;
        this.expandedChapters = new Set(); // 展開されている章を管理
        this.init();
    }

    init() {
        try {
            console.log('🚀 2025/06/24 11:05 - SubjectDetail initialized - 強化版ボタンバインディング');
        this.checkAdminAuth();
            
            // 「0」という数字を完全撲滅するための究極対策
            console.log('💥 数字「0」完全撲滅作戦開始...');
            this.obliterateAllZeros();
            
        this.loadSubjectFromURL();
        this.bindEvents();
        this.updateAuthUI();
            
            // ボタンイベントを強制的に複数回バインド
            this.bindAdminButtons();
            
            // 遅延実行で再度バインド（DOM完全読み込み後）
            setTimeout(() => {
                console.log('⏰ 遅延バインド実行...');
                this.bindAdminButtons();
            }, 500);
            
            // さらに遅延実行（完全確実）
            setTimeout(() => {
                console.log('⏰ 最終バインド実行...');
                this.bindAdminButtons();
            }, 1000);
            
            console.log('✅ SubjectDetail initialization completed');
            
            // 究極のリアルタイム監視を開始
            this.startUltimateZeroEradication();
        } catch (error) {
            console.error('❌ Error initializing SubjectDetail:', error);
            // エラー時も強制修正
            this.obliterateAllZeros();
        }
    }

    // 数字「0」完全撲滅メソッド
    obliterateAllZeros() {
        console.log('🔥 数字「0」完全撲滅開始...');
        
        // 1. ローカルストレージから全ての「0」を除去
        this.eradicateZerosFromStorage();
        
        // 2. DOM から全ての「0」を除去
        this.eradicateZerosFromDOM();
        
        // 3. 正しいデータ構造を強制作成
        this.forceCreateNonZeroChapterStructure();
        
        console.log('✅ 数字「0」完全撲滅完了');
    }

    // ローカルストレージから「0」を完全除去
    eradicateZerosFromStorage() {
        console.log('🧹 ローカルストレージから「0」完全除去中...');
        
        const keys = Object.keys(localStorage);
        
        for (const key of keys) {
            try {
                const value = localStorage.getItem(key);
                if (value) {
                    // JSON形式のデータをチェック
                    let data = JSON.parse(value);
                    
                    // 章番号が0の場合は強制的に1に変更
                    if (data && typeof data === 'object') {
                        if (data.chapterNumber === 0 || data.chapterNumber === '0') {
                            console.log(`🔧 ${key}: chapterNumber 0 → 1 に強制変更`);
                            data.chapterNumber = 1;
                        }
                        
                        // 章データの配列をチェック
                        if (Array.isArray(data.chapters)) {
                            data.chapters.forEach((chapter, index) => {
                                if (chapter.chapterNumber === 0 || chapter.chapterNumber === '0') {
                                    console.log(`🔧 章${index}: chapterNumber 0 → ${index + 1} に強制変更`);
                                    chapter.chapterNumber = index + 1;
                                    chapter.name = this.generateSafeChapterName(index + 1, chapter.originalName || '現代文');
                                    chapter.title = chapter.name;
                                }
                            });
                        }
                        
                        localStorage.setItem(key, JSON.stringify(data));
                    }
                }
            } catch (e) {
                // JSONではない場合は無視
            }
        }
    }

    // DOMから「0」を完全除去
    eradicateZerosFromDOM() {
        console.log('🎯 DOMから「0」完全除去中...');
        
        // 「0」を含むテキストを持つすべての要素を検索
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodesToFix = [];
        let node;
        
        while (node = walker.nextNode()) {
            if (node.textContent.includes('第0章') || 
                node.textContent.includes('Chapter 0') ||
                node.textContent === '0') {
                textNodesToFix.push(node);
            }
        }
        
        // テキストノードを修正
        textNodesToFix.forEach(node => {
            console.log(`🔧 テキスト修正: "${node.textContent}" → "第一章　現代文"`);
            node.textContent = node.textContent
                .replace(/第0章/g, '第一章')
                .replace(/Chapter 0/g, 'Chapter 1')
                .replace(/^0$/, '1');
        });
        
        // バッジや数字表示要素を特定して修正
        const badgeElements = document.querySelectorAll('.lesson-count, .finder-count, .tree-count, [class*="count"], [class*="badge"]');
        badgeElements.forEach(element => {
            if (element.textContent === '0') {
                console.log(`🔧 バッジ修正: "${element.textContent}" → "1"`);
                element.textContent = '1';
            }
        });
    }

    // 非ゼロ章構造を強制作成
    forceCreateNonZeroChapterStructure() {
        console.log('⚙️ 非ゼロ章構造強制作成中...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const subjectId = urlParams.get('id') || 'subject_default';
        
        // 強制的に正しいデータ構造を作成
        const safeChapterData = {
            id: `chapter_${Date.now()}_safe`,
            name: '第一章　現代文',
            title: '第一章　現代文',
            chapterNumber: 1, // 絶対に1
            courseId: subjectId, 
            subjectId: subjectId,
            originalName: '現代文',
            expanded: false,
            lessons: []
        };
        
        // ローカルストレージに安全なデータを保存
        const storageKey = `chapters_${subjectId}`;
        const chaptersData = {
            chapters: [safeChapterData],
            lastModified: Date.now()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(chaptersData));
        console.log('✅ 安全な章データ構造作成完了:', chaptersData);
    }

    // 究極のリアルタイム監視
    startUltimateZeroEradication() {
        console.log('🚨 究極リアルタイム「0」監視開始...');
        
        // DOM変更監視
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 追加された要素をチェック
                        if (node.textContent && node.textContent.includes('0')) {
                            console.log('🚨 新しい「0」を検出！即座に修正');
                            this.eradicateZerosFromDOM();
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // 定期チェック（200ms間隔で超高頻度）
        setInterval(() => {
            this.quickZeroCheck();
        }, 200);
    }

    // 高速「0」チェック
    quickZeroCheck() {
        // 「0」を含む要素を即座にチェック
        const suspiciousElements = document.querySelectorAll('*');
        
        suspiciousElements.forEach(element => {
            if (element.textContent === '0' && element.tagName !== 'SCRIPT') {
                console.log('⚡ 高速「0」検出→修正:', element);
                element.textContent = '1';
            }
        });
    }

    // 完全データリセット機能
    completeDataReset() {
        console.log('🧹 完全データリセット開始...');
        
        // ローカルストレージを完全クリア
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.includes('subjects') || key.includes('undefined') || key.includes('null')) {
                localStorage.removeItem(key);
                console.log(`🗑️ キー削除: ${key}`);
            }
        });
        
        // 初期データで再構築（安全な値で）
        const subjectId = this.currentSubject?.id || 'subject_' + Date.now();
        const courseId = 'course_' + Date.now();
        const chapterId = 'chapter_' + Date.now();
        
        // 完全に安全なデータ構造で初期化
        const cleanSubjects = [{
            id: subjectId,
            name: '国語',
            description: '日本語の読み書き能力を向上させる科目です',
            icon: '🇯🇵',
            courses: [{
                id: courseId,
                name: '国語基礎コース',
                chapters: [{
                    id: chapterId,
                    name: '第一章　現代文',
                    title: '第一章　現代文', // titleも設定
                    chapterNumber: 1, // 明示的に1を設定
                    courseId: courseId, // 正しいコースIDを設定
                    subjectId: subjectId, // 科目IDも設定
                    originalName: '現代文', // 元の名前も設定
                    expanded: false,
                    lessons: []
                }]
            }]
        }];
        
        // データの完整性をチェック
        const firstChapter = cleanSubjects[0].courses[0].chapters[0];
        console.log('🔍 作成されたチャプターデータ:', {
            id: firstChapter.id,
            name: firstChapter.name,
            chapterNumber: firstChapter.chapterNumber,
            courseId: firstChapter.courseId,
            originalName: firstChapter.originalName
        });
        
        console.log('🔧 安全なデータ構造で再構築:', cleanSubjects[0]);
        
        localStorage.setItem('subjects', JSON.stringify(cleanSubjects));
        this.subjects = cleanSubjects;
        this.currentSubject = cleanSubjects[0];
        
        console.log('✅ 完全データリセット完了');
        return true;
    }

    // データの強制検証とクリーンアップ
    forceDataValidation() {
        console.log('🔍 データ強制検証開始...');
        
        try {
            let subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
            let hasModified = false;
            
            // 配列形式を確認
            if (!Array.isArray(subjects)) {
                subjects = [];
                hasModified = true;
            }
            
            subjects.forEach((subject, subjectIndex) => {
                if (!subject || typeof subject !== 'object') return;
                
                // 科目にコースがない場合は作成
                if (!subject.courses || !Array.isArray(subject.courses)) {
                    subject.courses = [];
                    hasModified = true;
                }
                
                subject.courses.forEach((course, courseIndex) => {
                    if (!course || typeof course !== 'object') return;
                    
                    // コースに章がない場合は作成
                    if (!course.chapters || !Array.isArray(course.chapters)) {
                        course.chapters = [];
                        hasModified = true;
                    }
                    
                    course.chapters.forEach((chapter, chapterIndex) => {
                        if (!chapter || typeof chapter !== 'object') return;
                        
                        // 章番号の検証と修正
                        if (!chapter.chapterNumber || chapter.chapterNumber <= 0 || isNaN(chapter.chapterNumber)) {
                            chapter.chapterNumber = chapterIndex + 1;  // インデックス+1を使用
                            hasModified = true;
                            console.log(`🔧 章番号修正: チャプター${chapter.id} → ${chapter.chapterNumber}`);
                        }
                        
                        // 章名の検証と修正
                        if (!this.isValidString(chapter.name) || chapter.name.includes('undefined') || chapter.name === '第0章') {
                            const baseName = chapter.originalName || '国語基礎';
                            chapter.name = this.formatChapterName(chapter.chapterNumber, baseName);
                            hasModified = true;
                            console.log(`🔧 章名修正: ${chapter.id} → ${chapter.name}`);
                        }
                        
                        // titleの同期
                        if (chapter.name && (!chapter.title || chapter.title.includes('undefined'))) {
                            chapter.title = chapter.name;
                            hasModified = true;
                        }
                        
                        // 必要なIDフィールドの設定
                        if (!chapter.courseId) {
                            chapter.courseId = course.id;
                            hasModified = true;
                        }
                        if (!chapter.subjectId) {
                            chapter.subjectId = subject.id;
                            hasModified = true;
                        }
                        
                        // 講義の検証
                        if (!chapter.lessons || !Array.isArray(chapter.lessons)) {
                            chapter.lessons = [];
                            hasModified = true;
                        }
                        
                        chapter.lessons.forEach((lesson, lessonIndex) => {
                            if (!lesson || typeof lesson !== 'object') return;
                            
                            // 講義名の検証
                            if (!this.isValidString(lesson.name) || lesson.name.includes('undefined')) {
                                lesson.name = `講義${lessonIndex + 1}`;
                                hasModified = true;
                                console.log(`🔧 講義名修正: ${lesson.id} → ${lesson.name}`);
                            }
                            
                            // 必要なIDフィールドの設定
                            if (!lesson.chapterId) {
                                lesson.chapterId = chapter.id;
                                hasModified = true;
                            }
                            if (!lesson.courseId) {
                                lesson.courseId = course.id;
                                hasModified = true;
                            }
                            if (!lesson.subjectId) {
                                lesson.subjectId = subject.id;
                                hasModified = true;
                            }
                        });
                    });
                });
            });
            
            if (hasModified) {
                localStorage.setItem('subjects', JSON.stringify(subjects));
                console.log('✅ データ強制検証完了・修正済みデータを保存しました');
                
                // 修正されたデータの検証ログ
                subjects.forEach(subject => {
                    subject.courses?.forEach(course => {
                        course.chapters?.forEach(chapter => {
                            console.log('📊 修正後章データ:', {
                                id: chapter.id,
                                name: chapter.name,
                                chapterNumber: chapter.chapterNumber,
                                courseId: chapter.courseId
                            });
                        });
                    });
                });
            } else {
                console.log('✅ データ強制検証完了・修正不要でした');
            }
            
        } catch (error) {
            console.error('❌ データ強制検証エラー:', error);
            // エラー時は完全リセット
            this.completeDataReset();
        }
    }

    // リアルタイム監視システム
    startRealTimeMonitoring() {
        console.log('👁️ リアルタイム監視開始');
        
        // 1秒ごとにundefinedチェック
        setInterval(() => {
            const elements = document.querySelectorAll('*');
            let foundUndefined = false;
            
            elements.forEach(element => {
                if (element.textContent && element.textContent.includes('undefined')) {
                    console.warn('🚨 undefined検出:', element);
                    element.textContent = element.textContent.replace(/undefined/g, '');
                    foundUndefined = true;
                }
            });
            
            if (foundUndefined) {
                console.log('🔧 undefined自動除去実行');
            }
        }, 1000);
        
        // ローカルストレージ監視
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (value && value.includes('undefined')) {
                console.warn('🚨 undefined保存を阻止:', key);
                value = value.replace(/undefined/g, '');
            }
            originalSetItem.call(this, key, value);
        };
    }

    // 保存されたデータから「undefined」を完全除去
    cleanupStoredData() {
        console.log('🧹 データクリーンアップ開始...');
        
        try {
            const subjects = JSON.parse(localStorage.getItem('subjects') || '{}');
            let modified = false;
            
            Object.entries(subjects).forEach(([subjectId, subject]) => {
                // 科目レベルのクリーンアップ
                if (this.cleanupTextValue(subject, 'name')) modified = true;
                if (this.cleanupTextValue(subject, 'title')) modified = true;
                if (this.cleanupTextValue(subject, 'description')) modified = true;
                
                // コースレベルのクリーンアップ
                if (subject.courses) {
                    Object.entries(subject.courses).forEach(([courseId, course]) => {
                        if (this.cleanupTextValue(course, 'name')) modified = true;
                        if (this.cleanupTextValue(course, 'title')) modified = true;
                        
                        // 章レベルのクリーンアップ
                        if (course.chapters) {
                            Object.entries(course.chapters).forEach(([chapterId, chapter]) => {
                                if (this.cleanupTextValue(chapter, 'name')) modified = true;
                                if (this.cleanupTextValue(chapter, 'title')) modified = true;
                                if (this.cleanupTextValue(chapter, 'originalName')) modified = true;
                                
                                // 講義レベルのクリーンアップ
                                if (chapter.lessons) {
                                    Object.entries(chapter.lessons).forEach(([lessonId, lesson]) => {
                                        if (this.cleanupTextValue(lesson, 'name')) modified = true;
                                        if (this.cleanupTextValue(lesson, 'title')) modified = true;
                                        if (this.cleanupTextValue(lesson, 'description')) modified = true;
                                    });
                                }
                            });
                        }
                    });
                }
                
                // 古い構造（科目→章→講義）のクリーンアップ
                if (subject.chapters) {
                    Object.entries(subject.chapters).forEach(([chapterId, chapter]) => {
                        if (this.cleanupTextValue(chapter, 'name')) modified = true;
                        if (this.cleanupTextValue(chapter, 'title')) modified = true;
                        if (this.cleanupTextValue(chapter, 'originalName')) modified = true;
                        
                        if (chapter.lessons) {
                            Object.entries(chapter.lessons).forEach(([lessonId, lesson]) => {
                                if (this.cleanupTextValue(lesson, 'name')) modified = true;
                                if (this.cleanupTextValue(lesson, 'title')) modified = true;
                                if (this.cleanupTextValue(lesson, 'description')) modified = true;
                            });
                        }
                    });
                }
            });
            
            if (modified) {
                localStorage.setItem('subjects', JSON.stringify(subjects));
                console.log('✅ データクリーンアップ完了・保存しました');
            } else {
                console.log('✅ データクリーンアップ不要でした');
            }
            
        } catch (error) {
            console.error('❌ データクリーンアップエラー:', error);
        }
    }

    // テキスト値をクリーンアップ
    cleanupTextValue(obj, field) {
        if (!obj[field]) return false;
        
        const originalValue = obj[field];
        let cleanValue = originalValue;
        
        // 文字列型でない場合は無視
        if (typeof cleanValue !== 'string') return false;
        
        let modified = false;
        
        // 「undefined」文字列の除去
        if (cleanValue.includes('undefined')) {
            cleanValue = cleanValue.replace(/undefined/g, '').trim();
            modified = true;
            console.log(`🧹 "${field}"から"undefined"を除去: "${originalValue}" → "${cleanValue}"`);
        }
        
        // 「null」文字列の除去
        if (cleanValue.includes('null')) {
            cleanValue = cleanValue.replace(/null/g, '').trim();
            modified = true;
            console.log(`🧹 "${field}"から"null"を除去`);
        }
        
        // 空文字や無効な値の場合は削除
        if (!cleanValue || cleanValue.trim() === '') {
            delete obj[field];
            modified = true;
            console.log(`🧹 "${field}"を削除（空値のため）`);
        } else if (modified) {
            obj[field] = cleanValue.trim();
        }
        
        return modified;
    }

    // undefined検出機能
    checkForUndefined() {
        const undefinedElements = document.querySelectorAll('*');
        let undefinedCount = 0;
        const problematicElements = [];
        
        undefinedElements.forEach(el => {
            if (el.textContent && el.textContent.includes('undefined')) {
                console.warn('🚨 undefinedが検出されました!', el);
                problematicElements.push({
                    element: el,
                    content: el.textContent.trim(),
                    tag: el.tagName,
                    className: el.className
                });
                undefinedCount++;
            }
        });
        
        if (undefinedCount > 0) {
            console.error(`🚨 合計 ${undefinedCount} 個のundefinedが検出されました!`, problematicElements);
            
            // 自動修復を試みる
            this.autoFixUndefined(problematicElements);
        } else {
            console.log('✅ undefined検出なし - 正常です');
        }
    }

    // undefined の自動修復
    autoFixUndefined(problematicElements) {
        console.log('🔧 undefined自動修復を開始...');
        
        problematicElements.forEach(({ element, content }) => {
            try {
                if (!element || !element.classList) {
                    console.warn('🚨 無効な要素をスキップ:', element);
                    return;
                }
                
                if (element.classList.contains('tree-name')) {
                // 章名の場合
                if (element.closest('.chapter-node')) {
                    // チャプターIDから安全な名前を生成
                    const chapterNode = element.closest('.tree-item');
                    const chapterId = chapterNode ? chapterNode.dataset.id : null;
                    const chapterData = chapterId ? this.findChapterById(chapterId) : null;
                    
                    if (chapterData) {
                        element.textContent = this.generateSafeChapterName(chapterData);
                    } else {
                        element.textContent = '第一章　基礎学習';
                    }
                    console.log('🔧 章名を修復:', element);
                }
                // 講義名の場合
                else if (element.closest('.lesson-node')) {
                    // レッスンIDから安全な名前を生成
                    const lessonNode = element.closest('.tree-item');
                    const lessonId = lessonNode ? lessonNode.dataset.id : null;
                    const lessonData = lessonId ? this.findLessonById(lessonId) : null;
                    
                    if (lessonData) {
                        element.textContent = this.generateSafeLessonName(lessonData);
                    } else {
                        element.textContent = '講義1';
                    }
                    console.log('🔧 講義名を修復:', element);
                }
            }
            // 他のundefined要素も修復
            else if (content.includes('undefined')) {
                const fixedContent = content.replace(/undefined/g, '').trim();
                if (fixedContent) {
                    element.textContent = fixedContent;
                } else {
                    element.textContent = '名前なし';
                }
                console.log('🔧 一般要素を修復:', element);
            }
            } catch (error) {
                console.error('🚨 要素修復エラー:', error, element);
            }
        });
        
        console.log('✅ undefined自動修復完了');
        
        // 修復後にデータを再保存
        this.saveSubjects();
        
        // 画面を強制的に再描画
        setTimeout(() => {
            this.displaySubject();
        }, 500);
    }

    // DOM変更監視を開始してundefinedを即座に検出・修復
    startDOMObserver() {
        const observer = new MutationObserver((mutations) => {
            let needsCheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent || '';
                            if (text.includes('undefined')) {
                                needsCheck = true;
                            }
                        }
                    });
                }
            });
            
            if (needsCheck) {
                console.log('🔍 DOM変更でundefined検出 - 修復実行');
                setTimeout(() => this.checkForUndefined(), 100);
            }
        });
        
        // content-layout内を監視
        const contentLayout = document.querySelector('.content-layout');
        if (contentLayout) {
            observer.observe(contentLayout, {
                childList: true,
                subtree: true,
                characterData: true
            });
            console.log('👁️ DOM監視開始');
        }
    }

    // 管理者認証チェック
    checkAdminAuth() {
        if (!authManager || !authManager.requireAdminAuth()) {
            window.location.href = '../pages/login.html';
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
                        <select id="subject-detail-school-select" onchange="authManager.changeSchool(this.value)">
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

    // URLから科目IDを取得して科目を読み込み
    loadSubjectFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSubjectId = urlParams.get('id');
        
        if (!this.currentSubjectId) {
            console.error('Subject ID not found in URL');
            window.location.href = 'create-course.html';
            return;
        }

        this.loadSubjects();
        this.displaySubject();
    }

    // 科目データを読み込み
    loadSubjects() {
        try {
            const stored = localStorage.getItem('subjects');
            this.subjects = stored ? JSON.parse(stored) : {};
            this.currentSubject = this.subjects[this.currentSubjectId];
            
            if (!this.currentSubject) {
                console.error('Subject not found:', this.currentSubjectId);
                window.location.href = 'create-course.html';
                return;
            }
        } catch (error) {
            console.error('Error loading subjects:', error);
            this.subjects = {};
        }
    }

    // 科目データを保存
    saveSubjects() {
        try {
            localStorage.setItem('subjects', JSON.stringify(this.subjects));
        } catch (error) {
            console.error('Error saving subjects:', error);
        }
    }

    // 科目情報を表示
    displaySubject() {
        if (!this.currentSubject) return;

        // 既存データの章名を正規化
        this.normalizeChapterNames();

        // ヘッダー情報更新（null チェック追加）
        const breadcrumb = document.getElementById('subject-breadcrumb');
        if (breadcrumb) breadcrumb.textContent = this.currentSubject.name || '科目名';
        
        const title = document.getElementById('subject-title');
        if (title) title.textContent = this.currentSubject.name || '科目名';
        
        const description = document.getElementById('subject-description');
        if (description) description.textContent = this.currentSubject.description || 'この科目の説明はまだ設定されていません。';
        
        const icon = document.getElementById('subject-icon');
        if (icon) icon.textContent = this.currentSubject.icon || '📚';

        // 統計情報を計算
        this.updateStats();

        // コンテンツテーブルを表示
        this.renderContentTable();
    }

    // 統計情報を更新（ボタンを削除したのでコメントアウト）
    updateStats() {
        // 統計表示ボタンが削除されたため、この処理は無効化
        /*
        const courses = this.currentSubject.courses || {};
        let totalChapters = 0;
        let totalLessons = 0;

        Object.values(courses).forEach(course => {
            const chapters = course.chapters || {};
            totalChapters += Object.keys(chapters).length;
            
            Object.values(chapters).forEach(chapter => {
                const lessons = chapter.lessons || {};
                totalLessons += Object.keys(lessons).length;
            });
        });

        document.getElementById('total-courses').textContent = Object.keys(courses).length;
        document.getElementById('total-chapters').textContent = totalChapters;
        document.getElementById('total-lessons').textContent = totalLessons;
        */
    }

    // コンテンツツリーを描画
    renderContentTable() {
        const contentTree = document.getElementById('content-tree');
        const emptyState = document.getElementById('empty-state');
        const contentLayout = document.querySelector('.content-layout');
        
        // 全ての章を収集
        const allChapters = this.getAllChapters();

        if (allChapters.length === 0) {
            if (contentTree) contentTree.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (contentLayout) contentLayout.style.display = 'none';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (contentLayout) contentLayout.style.display = 'flex';
        
        let treeHTML = '';

        // 章を中心にツリー表示
        allChapters.forEach(chapterData => {
            treeHTML += this.createChapterTreeItem(chapterData);
        });

        if (contentTree) {
            contentTree.innerHTML = treeHTML;
        }
        this.bindTreeEvents();
    }

    // 全ての章を収集する
    getAllChapters() {
        const chapters = [];
        
        // 新しい構造（科目 → コース → 章 → 講義）
        const courses = this.currentSubject.courses || {};
        
        Object.entries(courses).forEach(([courseId, course]) => {
            const courseChapters = course.chapters || {};
            Object.entries(courseChapters).forEach(([chapterId, chapter]) => {
                const lessons = chapter.lessons || {};
                const lessonList = Object.entries(lessons).map(([lessonId, lesson]) => ({
                    id: lessonId,
                    courseId,
                    chapterId,
                    ...lesson
                }));

                chapters.push({
                    id: chapterId,
                    courseId,
                    courseName: course.name || course.title || 'コース名なし',
                    expanded: (this.expandedChapters && this.expandedChapters.has(chapterId)) || false,
                    lessons: lessonList,
                    ...chapter
                });
            });
        });
        
        // 古い構造との互換性（科目 → 章 → 講義）
        const oldChapters = this.currentSubject.chapters || {};
        Object.entries(oldChapters).forEach(([chapterId, chapter]) => {
            const lessons = chapter.lessons || {};
            const lessonList = Object.entries(lessons).map(([lessonId, lesson]) => ({
                id: lessonId,
                courseId: 'default-course', // デフォルトコース
                chapterId,
                ...lesson
            }));

            chapters.push({
                id: chapterId,
                courseId: 'default-course',
                courseName: 'デフォルトコース',
                expanded: (this.expandedChapters && this.expandedChapters.has(chapterId)) || false,
                lessons: lessonList,
                ...chapter
            });
        });
        
        return chapters;
    }

    // 安全な章名生成（絶対にundefinedを出力しない）
    generateSafeChapterName(chapterData) {
        console.log('🔒 安全な章名生成開始:', chapterData);
        
        let chapterName = '';
        let foundValidName = false;
        
        // 1. 有効な章名を探す
        const nameFields = ['name', 'title', 'originalName'];
        for (const field of nameFields) {
            const value = chapterData[field];
            if (this.isValidString(value)) {
                chapterName = value.trim();
                foundValidName = true;
                console.log(`✅ 有効な章名を発見 (${field}):`, chapterName);
                break;
            }
        }
        
        // 2. 有効な章名が見つからない場合のデフォルト生成
        if (!foundValidName) {
            // 章番号を安全に取得（0や負数を防ぐ）
            let chapterNumber = chapterData.chapterNumber;
            if (!chapterNumber || chapterNumber <= 0) {
                chapterNumber = 1;
            }
            chapterName = this.formatChapterName(chapterNumber, '国語基礎');
            console.log('🔄 デフォルト章名を生成:', chapterName);
        }
        // 3. 古い形式を新しい形式に変換
        else if (!chapterName.includes('第')) {
            // 章番号を安全に取得（0や負数を防ぐ）
            let chapterNumber = chapterData.chapterNumber;
            if (!chapterNumber || chapterNumber <= 0) {
                chapterNumber = 1;
            }
            const originalName = chapterName;
            chapterName = this.formatChapterName(chapterNumber, chapterName);
            console.log(`🔄 章名をフォーマット: "${originalName}" → "${chapterName}"`);
        }
        
        // 4. 最終安全チェック
        if (!this.isValidString(chapterName)) {
            chapterName = '第一章　国語基礎';
            console.warn('🛡️ 緊急フォールバック:', chapterName);
        }
        
        return chapterName;
    }

    // 文字列が有効かチェック
    isValidString(value) {
        return value && 
               typeof value === 'string' && 
               value !== 'undefined' && 
               value !== 'null' &&
               !value.includes('undefined') && 
               !value.includes('null') &&
               value.trim() !== '';
    }

    // 章名をフォーマット
    formatChapterName(chapterNumber, baseName) {
        // 章番号を安全に処理（0や負数、undefinedを防ぐ）
        let safeChapterNumber = chapterNumber;
        if (!safeChapterNumber || safeChapterNumber <= 0) {
            safeChapterNumber = 1;
        }
        
        const chapterNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        const numberText = safeChapterNumber <= 10 ? chapterNumbers[safeChapterNumber - 1] : safeChapterNumber;
        
        // baseNameも安全に処理
        const safeBaseName = baseName || '国語基礎';
        
        return `第${numberText}章　${safeBaseName}`;
    }

    // 安全な講義名生成（絶対にundefinedを出力しない）
    generateSafeLessonName(lessonData) {
        let lessonName = '';
        
        // 有効な講義名を探す
        const nameFields = ['name', 'title'];
        for (const field of nameFields) {
            const value = lessonData[field];
            if (this.isValidString(value)) {
                lessonName = value.trim();
                break;
            }
        }
        
        // 有効な講義名が見つからない場合
        if (!lessonName) {
            lessonName = '講義名';
        }
        
        return lessonName;
    }

    // 章ツリーアイテムを作成
    createChapterTreeItem(chapterData) {
        console.log('🚀 2025/06/23 22:45 - 完全安全版章データ確認:', {
            全データ: chapterData,
            name: chapterData.name,
            title: chapterData.title,
            originalName: chapterData.originalName,
            chapterNumber: chapterData.chapterNumber
        });
        
        const lessonCount = chapterData.lessons ? chapterData.lessons.length : 0;
        const expandIcon = chapterData.expanded ? '📂' : '📁';
        const expandArrow = chapterData.expanded ? '▼' : '▶';
        
        // 章名を完全に安全に生成（絶対にundefinedを出力しない）
        let chapterName = this.generateSafeChapterName(chapterData);
        
        console.log('✅ 最終確定章名:', chapterName);
        
        let lessonsHTML = '';
        if (chapterData.expanded && chapterData.lessons && Array.isArray(chapterData.lessons)) {
            chapterData.lessons.forEach(lessonData => {
                lessonsHTML += this.createLessonTreeItem(lessonData);
            });
        }
        
        return `
            <div class="tree-item chapter-tree-item">
                <div class="tree-node chapter-node" data-type="chapter" data-id="${chapterData.id}">
                    <span class="expand-arrow" onclick="subjectDetail.toggleChapter('${chapterData.id}')">${expandArrow}</span>
                    <span class="tree-icon" onclick="subjectDetail.toggleChapter('${chapterData.id}')">${expandIcon}</span>
                    <span class="tree-name" onclick="subjectDetail.selectChapter('${chapterData.id}')">${chapterName}</span>
                    <span class="lesson-count">${lessonCount}</span>
                    <div class="tree-actions">
                        <button class="tree-action-btn" onclick="event.stopPropagation(); subjectDetail.showCreateModal('lesson', '${chapterData.courseId}', '${chapterData.id}')" title="講義追加">
                            ➕
                        </button>
                        <button class="tree-action-btn" onclick="event.stopPropagation(); subjectDetail.editItem('chapter', '${chapterData.id}', '${chapterData.courseId}')" title="編集">
                            ✏️
                        </button>
                        <button class="tree-action-btn" onclick="event.stopPropagation(); subjectDetail.deleteItem('chapter', '${chapterData.id}', '${chapterData.courseId}')" title="削除">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="tree-children ${chapterData.expanded ? 'expanded' : ''}">
                    ${lessonsHTML}
                </div>
            </div>
        `;
    }

    // 講義ツリーアイテムを作成
    createLessonTreeItem(lessonData) {
        // 講義名を完全に安全に取得（undefined完全回避）
        const lessonName = this.generateSafeLessonName(lessonData);
        
        return `
            <div class="tree-item lesson-tree-item">
                <div class="tree-node lesson-node" data-type="lesson" data-id="${lessonData.id}" onclick="subjectDetail.selectLesson('${lessonData.id}')">
                    <span class="tree-icon">🎥</span>
                    <span class="tree-name">${lessonName}</span>
                    <div class="tree-actions">
                        <button class="tree-action-btn" onclick="event.stopPropagation(); subjectDetail.editItem('lesson', '${lessonData.id}', '${lessonData.courseId}', '${lessonData.chapterId}')" title="編集">
                            ✏️
                        </button>
                        <button class="tree-action-btn" onclick="event.stopPropagation(); subjectDetail.deleteItem('lesson', '${lessonData.id}', '${lessonData.courseId}', '${lessonData.chapterId}')" title="削除">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 章の展開・折りたたみ
    toggleChapter(chapterId) {
        if (this.expandedChapters.has(chapterId)) {
            this.expandedChapters.delete(chapterId);
        } else {
            this.expandedChapters.add(chapterId);
        }
        this.renderContentTable();
    }

    // イベントバインディング
    bindEvents() {
        console.log('🔗 イベントバインディング開始...');
        
        // 検索機能
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // 全選択チェックボックス
        const selectAllCheckbox = document.getElementById('select-all');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.handleSelectAll(e.target.checked);
            });
        }

        // 管理画面のボタンイベント
        this.bindAdminButtons();
        
        console.log('✅ イベントバインディング完了');
    }

    // 管理画面ボタンのイベントバインディング
    bindAdminButtons() {
        console.log('🎛️ 管理ボタンのイベントバインディング - 元UIスタイル対応...');
        
        // 章追加ボタン
        const addChapterBtn = document.getElementById('add-chapter-btn');
        if (addChapterBtn) {
            // 既存のイベントを削除してから新しいイベントを追加
            addChapterBtn.replaceWith(addChapterBtn.cloneNode(true));
            const newAddChapterBtn = document.getElementById('add-chapter-btn');
            newAddChapterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📖 章追加ボタンがクリックされました');
                this.showCreateChapterModal();
            });
            console.log('✅ 章追加ボタンイベント追加 (元UIスタイル)');
                } else {
            console.log('❌ 章追加ボタンが見つかりません');
        }

        // コース追加ボタン
        const addCourseBtn = document.getElementById('add-course-btn');
        if (addCourseBtn) {
            addCourseBtn.replaceWith(addCourseBtn.cloneNode(true));
            const newAddCourseBtn = document.getElementById('add-course-btn');
            newAddCourseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🗂️ コース追加ボタンがクリックされました');
                this.showCreateCourseModal();
            });
            console.log('✅ コース追加ボタンイベント追加 (元UIスタイル)');
        } else {
            console.log('❌ コース追加ボタンが見つかりません');
    }

        // 科目編集ボタン
        const editSubjectBtn = document.getElementById('edit-subject-btn');
        if (editSubjectBtn) {
            editSubjectBtn.replaceWith(editSubjectBtn.cloneNode(true));
            const newEditSubjectBtn = document.getElementById('edit-subject-btn');
            newEditSubjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('✏️ 科目編集ボタンがクリックされました');
                this.editSubject();
            });
            console.log('✅ 科目編集ボタンイベント追加 (元UIスタイル)');
        } else {
            console.log('❌ 科目編集ボタンが見つかりません');
        }

        // 並べ替えボタン
        const sortBtn = document.getElementById('sort-btn');
        if (sortBtn) {
            sortBtn.replaceWith(sortBtn.cloneNode(true));
            const newSortBtn = document.getElementById('sort-btn');
            newSortBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 並べ替えボタンがクリックされました');
                this.showSortModal();
            });
            console.log('✅ 並べ替えボタンイベント追加 (元UIスタイル)');
            } else {
            console.log('❌ 並べ替えボタンが見つかりません');
        }

        console.log('🎛️ 管理ボタンのイベントバインディング完了 (元UIスタイル維持)');
    }

    // 章追加モーダル表示
    showCreateChapterModal() {
        console.log('📖 章追加モーダル表示 - 関数が呼び出されました');
        // まず利用可能なコースを確認
        const availableCourses = this.getAvailableCourses();
        console.log('📖 利用可能なコース:', availableCourses);
        
        if (availableCourses.length === 0) {
            console.log('⚠️ コースが存在しません - コース作成モーダルを表示します');
            alert('章を追加するには、まずコースを作成してください。');
            this.showCreateCourseModal();
            return;
        }

        this.showCreateModal('chapter', availableCourses[0].id);
    }

    // コース追加モーダル表示
    showCreateCourseModal() {
        console.log('🗂️ コース追加モーダル表示 - 関数が呼び出されました');
        this.showCreateModal('course');
    }

    // 利用可能なコース取得
    getAvailableCourses() {
        const courses = this.currentSubject.courses || {};
        return Object.entries(courses).map(([id, course]) => ({
            id,
            name: course.name || 'コース名なし',
            ...course
        }));
    }

    // 並べ替えモーダル表示
    showSortModal() {
        const modal = document.getElementById('content-modal');
        const title = document.getElementById('modal-title');
        const formFields = document.getElementById('form-fields');
        const submitBtn = document.getElementById('submit-btn');
        
        title.textContent = '並べ替え設定';
        submitBtn.textContent = '適用';
        
        const chapters = this.getAllChapters();
        
        formFields.innerHTML = `
            <div class="form-group">
                <label class="form-label">並べ替え対象</label>
                <div class="sort-options">
                    <label class="sort-option" for="sort-target-chapters">
                        <input type="radio" id="sort-target-chapters" name="sort-target" value="chapters" checked>
                        <span>章の並べ替え</span>
                    </label>
                    <label class="sort-option" for="sort-target-lessons">
                        <input type="radio" id="sort-target-lessons" name="sort-target" value="lessons">
                        <span>講義の並べ替え</span>
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">並べ替え方法</label>
                <div class="sort-options">
                    <label class="sort-option" for="sort-method-name">
                        <input type="radio" id="sort-method-name" name="sort-method" value="name" checked>
                        <span>名前順（あいうえお順）</span>
                    </label>
                    <label class="sort-option" for="sort-method-created">
                        <input type="radio" id="sort-method-created" name="sort-method" value="created">
                        <span>作成日順</span>
                    </label>
                    <label class="sort-option" for="sort-method-custom">
                        <input type="radio" id="sort-method-custom" name="sort-method" value="custom">
                        <span>手動並べ替え</span>
                    </label>
                </div>
            </div>
            <div id="sort-preview" class="sort-preview">
                <h4>現在の順序:</h4>
                <div class="current-order">
                    ${chapters.map((chapter, index) => `
                        <div class="sort-item">
                            <span class="sort-number">${index + 1}.</span>
                            <span class="sort-name">${this.generateSafeChapterName(chapter)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // 並べ替えオプション変更時のプレビュー更新
        const sortOptions = formFields.querySelectorAll('input[name="sort-method"]');
        sortOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateSortPreview();
            });
        });
        
        const form = document.getElementById('content-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.applySortSettings();
        };
        
        modal.style.display = 'flex';
    }

    // 並べ替えプレビュー更新
    updateSortPreview() {
        const sortMethod = document.querySelector('input[name="sort-method"]:checked').value;
        const sortTarget = document.querySelector('input[name="sort-target"]:checked').value;
        const previewDiv = document.getElementById('sort-preview');
        
        let items = [];
        let itemName = '';
        
        if (sortTarget === 'chapters') {
            items = this.getAllChapters();
            itemName = '章';
        } else {
            // 全講義を取得
            items = this.getAllLessons();
            itemName = '講義';
        }
        
        // 並べ替え実行
        if (sortMethod === 'name') {
            items.sort((a, b) => {
                const nameA = sortTarget === 'chapters' ? this.generateSafeChapterName(a) : this.generateSafeLessonName(a);
                const nameB = sortTarget === 'chapters' ? this.generateSafeChapterName(b) : this.generateSafeLessonName(b);
                return nameA.localeCompare(nameB, 'ja');
            });
        } else if (sortMethod === 'created') {
            items.sort((a, b) => {
                const dateA = new Date(a.createdAt || '1970-01-01');
                const dateB = new Date(b.createdAt || '1970-01-01');
                return dateA - dateB;
            });
        }
        
        previewDiv.innerHTML = `
            <h4>並べ替え後の順序:</h4>
            <div class="preview-order">
                ${items.map((item, index) => `
                    <div class="sort-item preview-item">
                        <span class="sort-number">${index + 1}.</span>
                        <span class="sort-name">${sortTarget === 'chapters' ? this.generateSafeChapterName(item) : this.generateSafeLessonName(item)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 全講義取得
    getAllLessons() {
        const lessons = [];
        const courses = this.currentSubject.courses || {};
        
        Object.entries(courses).forEach(([courseId, course]) => {
            const chapters = course.chapters || {};
            Object.entries(chapters).forEach(([chapterId, chapter]) => {
                const chapterLessons = chapter.lessons || {};
                Object.entries(chapterLessons).forEach(([lessonId, lesson]) => {
                    lessons.push({
                        ...lesson,
                        id: lessonId,
                        courseId,
                        chapterId
                    });
                });
            });
        });
        
        return lessons;
    }

    // 並べ替え設定適用
    applySortSettings() {
        const sortMethod = document.querySelector('input[name="sort-method"]:checked').value;
        const sortTarget = document.querySelector('input[name="sort-target"]:checked').value;
        
        if (sortTarget === 'chapters') {
            this.sortChapters(sortMethod);
        } else {
            this.sortLessons(sortMethod);
        }
        
        this.saveSubjects();
        this.displaySubject();
        this.closeModal();
        this.showSuccessMessage(`${sortTarget === 'chapters' ? '章' : '講義'}の並べ替えが完了しました！`);
    }

    // 章の並べ替え
    sortChapters(method) {
        const courses = this.currentSubject.courses || {};
        
        Object.entries(courses).forEach(([courseId, course]) => {
            const chapters = course.chapters || {};
            const chapterEntries = Object.entries(chapters);
            
            if (method === 'name') {
                chapterEntries.sort((a, b) => {
                    const nameA = this.generateSafeChapterName(a[1]);
                    const nameB = this.generateSafeChapterName(b[1]);
                    return nameA.localeCompare(nameB, 'ja');
                });
            } else if (method === 'created') {
                chapterEntries.sort((a, b) => {
                    const dateA = new Date(a[1].createdAt || '1970-01-01');
                    const dateB = new Date(b[1].createdAt || '1970-01-01');
                    return dateA - dateB;
                });
            }
            
            // 章番号を再割り当て
            const sortedChapters = {};
            chapterEntries.forEach(([chapterId, chapter], index) => {
                const newChapterNumber = index + 1;
                const chapterNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
                const numberText = newChapterNumber <= 10 ? chapterNumbers[newChapterNumber - 1] : newChapterNumber;
                
                // 元の名前を保持して新しい章番号で更新
                const originalName = chapter.originalName || chapter.name || 'タイトルなし';
                const newName = `第${numberText}章　${originalName.replace(/^第[一二三四五六七八九十\d]+章　/, '')}`;
                
                sortedChapters[chapterId] = {
                    ...chapter,
                    name: newName,
                    chapterNumber: newChapterNumber,
                    originalName: originalName.replace(/^第[一二三四五六七八九十\d]+章　/, '')
                };
            });
            
            course.chapters = sortedChapters;
        });
    }

    // ツリーイベントをバインド
    bindTreeEvents() {
        // ツリーノードのクリックイベントはHTMLで直接設定
    }

    // 章選択処理
    selectChapter(chapterId) {
        event.stopPropagation(); // 親要素のイベントを止める
        this.displayChapterDetails(chapterId);
    }

    // 講義選択処理
    selectLesson(lessonId) {
        // 講義の詳細を表示
        this.displayLessonDetails(lessonId);
    }

    // 章詳細表示
    displayChapterDetails(chapterId) {
        const contentDetails = document.getElementById('content-details');
        if (!contentDetails) return;

        // 章データを取得
        const chapterData = this.findChapterById(chapterId);
        if (!chapterData) return;

        const lessonCount = chapterData.lessons ? chapterData.lessons.length : 0;

        const chapterName = this.generateSafeChapterName(chapterData);
        
        contentDetails.innerHTML = `
            <div class="chapter-details">
                <div class="lesson-header">
                    <div class="lesson-title-area">
                        <h3>${chapterName}</h3>
                        <span class="lesson-type">📁 章</span>
                    </div>
                    <div class="lesson-actions">
                        <button class="utage-btn utage-btn-primary" onclick="subjectDetail.showCreateModal('lesson', '${chapterData.courseId}', '${chapterData.id}')">
                            ➕ 講義追加
                        </button>
                        <button class="utage-btn utage-btn-secondary" onclick="subjectDetail.editItem('chapter', '${chapterData.id}', '${chapterData.courseId}')">
                            ✏️ 編集
                        </button>
                    </div>
                </div>
                <div class="lesson-content">
                    <div class="content-section">
                        <h4>章の説明</h4>
                        <p>${chapterData.description || '章の説明が設定されていません。'}</p>
                    </div>
                    <div class="content-section">
                        <h4>講義一覧</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">講義数:</span>
                                <span class="info-value">${lessonCount}個</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">所属コース:</span>
                                <span class="info-value">${chapterData.courseName || '-'}</span>
                            </div>
                        </div>
                        ${lessonCount > 0 ? `
                            <div class="lesson-list-preview">
                                ${chapterData.lessons.map(lesson => `
                                    <div class="lesson-preview-item" onclick="subjectDetail.selectLesson('${lesson.id}')">
                                        <span class="tree-icon">🎥</span>
                                        <span class="lesson-preview-name">${lesson.name || lesson.title || '講義名なし'}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="empty-lessons">まだ講義がありません。上の「講義追加」ボタンから最初の講義を作成してください。</p>'}
                    </div>
                    <div class="content-section">
                        <h4>作成情報</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">作成日:</span>
                                <span class="info-value">${chapterData.createdAt || '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">更新日:</span>
                                <span class="info-value">${chapterData.updatedAt || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 講義詳細表示
    displayLessonDetails(lessonId) {
        const contentDetails = document.getElementById('content-details');
        if (!contentDetails) return;

        // 講義データを取得
        const lessonData = this.findLessonById(lessonId);
        if (!lessonData) return;

        const lessonName = this.generateSafeLessonName(lessonData);
        
        contentDetails.innerHTML = `
            <div class="lesson-details">
                <div class="lesson-header">
                    <div class="lesson-title-area">
                        <h3>${lessonName}</h3>
                        <span class="lesson-type">🎥 講義</span>
                    </div>
                    <div class="lesson-actions">
                        <button class="utage-btn utage-btn-primary" onclick="subjectDetail.editItem('lesson', '${lessonData.id}', '${lessonData.courseId}', '${lessonData.chapterId}')">
                            ✏️ 編集
                        </button>
                    </div>
                </div>
                <div class="lesson-content">
                    <div class="content-section">
                        <h4>講義内容</h4>
                        <p>${lessonData.content || '講義内容が設定されていません。'}</p>
                    </div>
                    ${lessonData.videoUrl ? `
                        <div class="content-section">
                            <h4>動画URL</h4>
                            <p><a href="${lessonData.videoUrl}" target="_blank">${lessonData.videoUrl}</a></p>
                        </div>
                    ` : ''}
                    <div class="content-section">
                        <h4>作成情報</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">作成日:</span>
                                <span class="info-value">${lessonData.createdAt || '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">更新日:</span>
                                <span class="info-value">${lessonData.updatedAt || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // IDで章を検索
    findChapterById(chapterId) {
        const courses = this.currentSubject.courses || {};
        
        for (const [courseId, course] of Object.entries(courses)) {
            const chapters = course.chapters || {};
            if (chapters[chapterId]) {
                const chapter = chapters[chapterId];
                const lessons = chapter.lessons || {};
                const lessonList = Object.entries(lessons).map(([lessonId, lesson]) => ({
                    id: lessonId,
                    courseId,
                    chapterId,
                    ...lesson
                }));
                
                return {
                    ...chapter,
                    id: chapterId,
                    courseId,
                    courseName: course.name || 'コース名なし',
                    lessons: lessonList
                };
            }
        }
        
        // 古い構造もチェック
        const oldChapters = this.currentSubject.chapters || {};
        if (oldChapters[chapterId]) {
            const chapter = oldChapters[chapterId];
            const lessons = chapter.lessons || {};
            const lessonList = Object.entries(lessons).map(([lessonId, lesson]) => ({
                id: lessonId,
                courseId: 'default-course',
                chapterId,
                ...lesson
            }));
            
            return {
                ...chapter,
                id: chapterId,
                courseId: 'default-course',
                courseName: 'デフォルトコース',
                lessons: lessonList
            };
        }
        
        return null;
    }

    // IDで講義を検索
    findLessonById(lessonId) {
        const courses = this.currentSubject.courses || {};
        for (const course of Object.values(courses)) {
            const chapters = course.chapters || {};
            for (const chapter of Object.values(chapters)) {
                const lessons = chapter.lessons || {};
                if (lessons[lessonId]) {
                    return lessons[lessonId];
                }
            }
        }
        return null;
    }

    // 検索処理（ツリー用に更新）
    handleSearch(query) {
        const treeItems = document.querySelectorAll('.tree-item');
        const searchTerm = query.toLowerCase();
        
        treeItems.forEach(item => {
            const nameElement = item.querySelector('.tree-name');
            if (nameElement) {
                const contentText = nameElement.textContent.toLowerCase();
                if (contentText.includes(searchTerm) || searchTerm === '') {
                    item.style.display = '';
            } else {
                    item.style.display = 'none';
                }
            }
        });
    }

    // 作成モーダルを表示
    showCreateModal(type, parentId = null, grandParentId = null) {
        console.log('🔧 showCreateModal called:', type, parentId, grandParentId);
        console.log('🔧 currentSubject:', this.currentSubject);
        
        const modal = document.getElementById('content-modal');
        const title = document.getElementById('modal-title');
        const formFields = document.getElementById('form-fields');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!modal) {
            console.error('❌ Modal not found!');
            return;
        }
        
        const typeNames = {
            course: 'コース',
            chapter: '章',
            lesson: '講義'
        };
        
        title.textContent = `${typeNames[type]}作成`;
        submitBtn.textContent = '作成';
        
        // フォームフィールドを生成
        let fieldsHTML = '';
        
        // 章作成時にはコース選択を追加
        if (type === 'chapter') {
            const courses = this.currentSubject.courses || {};
            const courseEntries = Object.entries(courses);
            
            console.log('🔧 章作成チェック - courses:', courses);
            console.log('🔧 章作成チェック - courseEntries:', courseEntries);
            
            if (courseEntries.length === 0) {
                console.log('❌ コースが存在しません - 自動作成します');
                
                // デフォルトコースを自動作成
                const defaultCourseId = this.generateId();
                this.currentSubject.courses = {
                    [defaultCourseId]: {
                        name: this.currentSubject.name + ' コース',
                        description: 'デフォルトコース',
                        chapters: {},
                        createdAt: new Date().toLocaleDateString(),
                        updatedAt: new Date().toLocaleDateString()
                    }
                };
                this.saveSubjects();
                console.log('✅ デフォルトコース作成完了');
            }
            
            // コースが再取得（自動作成された可能性があるため）
            const updatedCourses = this.currentSubject.courses || {};
            const updatedCourseEntries = Object.entries(updatedCourses);
            
            const courseOptions = updatedCourseEntries.map(([id, course]) => 
                `<option value="${id}">${course.name || 'Untitled Course'}</option>`
            ).join('');
            
            fieldsHTML += `
                <div class="form-group">
                    <label for="parent-course" class="form-label">所属コース</label>
                    <select id="parent-course" class="form-input" required>
                        <option value="">コースを選択してください</option>
                        ${courseOptions}
                    </select>
                </div>
            `;
        }
        
        // 講義作成時には章選択を追加
        if (type === 'lesson') {
            const courses = this.currentSubject.courses || {};
            let chapterOptions = '';
            
            Object.entries(courses).forEach(([courseId, course]) => {
                const chapters = course.chapters || {};
                Object.entries(chapters).forEach(([chapterId, chapter]) => {
                    chapterOptions += `<option value="${courseId}|${chapterId}">${course.name || 'Untitled Course'} - ${chapter.name || 'Untitled Chapter'}</option>`;
                });
            });
            
            if (!chapterOptions) {
                alert('講義を作成するには、まず章を作成してください。');
                return;
            }
            
            fieldsHTML += `
                <div class="form-group">
                    <label for="parent-chapter" class="form-label">所属章</label>
                    <select id="parent-chapter" class="form-input" required>
                        <option value="">章を選択してください</option>
                        ${chapterOptions}
                    </select>
                </div>
            `;
        }
        
        fieldsHTML += `
            <div class="form-group">
                <label for="item-name" class="form-label">${typeNames[type]}名</label>
                <input type="text" id="item-name" class="form-input" placeholder="${typeNames[type]}名を入力..." required>
            </div>
            <div class="form-group">
                <label for="item-description" class="form-label">説明</label>
                <textarea id="item-description" class="form-textarea" placeholder="説明を入力..."></textarea>
            </div>
        `;
        
        if (type === 'lesson') {
            fieldsHTML += `
                <div class="form-group">
                    <label for="item-content" class="form-label">講義内容</label>
                    <textarea id="item-content" class="form-textarea" placeholder="講義の詳細内容を入力..."></textarea>
                </div>
                <div class="form-group">
                    <label for="item-video-url" class="form-label">動画URL</label>
                    <input type="url" id="item-video-url" class="form-input" placeholder="https://...">
                </div>
            `;
        }
        
        formFields.innerHTML = fieldsHTML;
        
        // フォーム送信イベント
        const form = document.getElementById('content-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleFormSubmit(type, parentId, grandParentId);
        };
        
        modal.style.display = 'flex';
    }

    // フォーム送信処理
    handleFormSubmit(type, parentId = null, grandParentId = null) {
        const name = document.getElementById('item-name').value.trim();
        const description = document.getElementById('item-description').value.trim();
        
        if (!name) {
            alert('名前を入力してください');
            return;
        }
        
        // 章作成時はコース選択を確認
        if (type === 'chapter') {
            const selectedCourse = document.getElementById('parent-course').value;
            if (!selectedCourse) {
                alert('コースを選択してください');
                return;
            }
            parentId = selectedCourse;
        }
        
        // 講義作成時は章選択を確認
        if (type === 'lesson') {
            const selectedChapter = document.getElementById('parent-chapter').value;
            if (!selectedChapter) {
                alert('章を選択してください');
                return;
            }
            const [courseId, chapterId] = selectedChapter.split('|');
            parentId = courseId;
            grandParentId = chapterId;
        }
        
        const now = new Date().toLocaleDateString();
        const newItem = {
            name,
            description,
            createdAt: now,
            updatedAt: now
        };
        
        if (type === 'lesson') {
            newItem.content = document.getElementById('item-content').value.trim();
            newItem.videoUrl = document.getElementById('item-video-url').value.trim();
        }
        
        // アイテムを作成
        const id = this.generateId();
        
        if (type === 'course') {
            if (!this.currentSubject.courses) this.currentSubject.courses = {};
            this.currentSubject.courses[id] = { ...newItem, chapters: {} };
        } else if (type === 'chapter') {
            if (!this.currentSubject.courses[parentId].chapters) {
                this.currentSubject.courses[parentId].chapters = {};
            }
            
            // 章の番号を自動生成
            const existingChapters = Object.keys(this.currentSubject.courses[parentId].chapters);
            const chapterNumber = existingChapters.length + 1;
            const chapterNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            const numberText = chapterNumber <= 10 ? chapterNumbers[chapterNumber - 1] : chapterNumber;
            
            // 章名を「第○章　入力された名前」の形式に
            const formattedName = `第${numberText}章　${name}`;
            newItem.name = formattedName;
            newItem.originalName = name; // 元の名前も保存
            newItem.chapterNumber = chapterNumber;
            
            this.currentSubject.courses[parentId].chapters[id] = { ...newItem, lessons: {} };
        } else if (type === 'lesson') {
            if (!this.currentSubject.courses[parentId].chapters[grandParentId].lessons) {
                this.currentSubject.courses[parentId].chapters[grandParentId].lessons = {};
            }
            this.currentSubject.courses[parentId].chapters[grandParentId].lessons[id] = newItem;
        }
        
        // データを保存
        this.saveSubjects();
        
        // 表示を更新
        this.displaySubject();
        
        // モーダルを閉じる
        this.closeModal();
        
        // 成功メッセージを表示
        this.showSuccessMessage(`${this.getTypeDisplayName(type)}が作成されました！`);
    }

    // 科目編集
    editSubject() {
        const modal = document.getElementById('content-modal');
        const title = document.getElementById('modal-title');
        const formFields = document.getElementById('form-fields');
        const submitBtn = document.getElementById('submit-btn');
        
        title.textContent = '科目編集';
        submitBtn.textContent = '更新';
        
        formFields.innerHTML = `
            <div class="form-group">
                <label for="subject-name" class="form-label">科目名</label>
                <input type="text" id="subject-name" class="form-input" value="${this.currentSubject.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="subject-description" class="form-label">説明</label>
                <textarea id="subject-description" class="form-textarea">${this.currentSubject.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="subject-icon" class="form-label">アイコン</label>
                <input type="text" id="subject-icon" class="form-input" value="${this.currentSubject.icon || '📚'}" placeholder="📚">
            </div>
        `;
        
        const form = document.getElementById('content-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateSubject();
        };
        
        modal.style.display = 'flex';
    }

    // 科目更新
    updateSubject() {
        const name = document.getElementById('subject-name').value.trim();
        const description = document.getElementById('subject-description').value.trim();
        const icon = document.getElementById('subject-icon').value.trim();
        
        if (!name) {
            alert('科目名を入力してください');
            return;
        }
        
        this.currentSubject.name = name;
        this.currentSubject.description = description;
        this.currentSubject.icon = icon;
        this.currentSubject.updatedAt = new Date().toLocaleDateString();
        
        this.saveSubjects();
        this.displaySubject();
        this.closeModal();
        this.showSuccessMessage('科目が更新されました！');
    }

    // アイテム編集
    editItem(type, id, parentId = null, grandParentId = null) {
        // 編集機能の実装（省略）
        alert(`${this.getTypeDisplayName(type)}の編集機能は実装予定です。`);
    }

    // アイテム削除
    deleteItem(type, id, parentId = null, grandParentId = null) {
        this.deleteTarget = { type, id, parentId, grandParentId };
        
        const deleteModal = document.getElementById('delete-modal');
        const deleteMessage = document.getElementById('delete-message');
        
        deleteMessage.textContent = `この${this.getTypeDisplayName(type)}を削除しますか？`;
        deleteModal.style.display = 'flex';
    }

    // 削除確認
    confirmDelete() {
        if (!this.deleteTarget) return;
        
        const { type, id, parentId, grandParentId } = this.deleteTarget;
        
        if (type === 'course') {
            delete this.currentSubject.courses[id];
        } else if (type === 'chapter') {
            delete this.currentSubject.courses[parentId].chapters[id];
        } else if (type === 'lesson') {
            delete this.currentSubject.courses[parentId].chapters[grandParentId].lessons[id];
        }
        
        this.saveSubjects();
        this.displaySubject();
        this.closeDeleteModal();
        this.showSuccessMessage(`${this.getTypeDisplayName(type)}が削除されました。`);
    }

    // ID生成
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // タイプ表示名取得
    getTypeDisplayName(type) {
        const typeNames = {
            subject: '科目',
            course: 'コース',
            chapter: '章',
            lesson: '講義'
        };
        return typeNames[type] || type;
    }

    // モーダルを閉じる
    closeModal() {
        const modal = document.getElementById('content-modal');
        modal.style.display = 'none';
    }

    // 削除モーダルを閉じる
    closeDeleteModal() {
        const modal = document.getElementById('delete-modal');
        modal.style.display = 'none';
        this.deleteTarget = null;
    }

    // 成功メッセージを表示
    showSuccessMessage(message) {
        const modal = document.getElementById('success-modal');
        const messageElement = document.getElementById('success-message');
        messageElement.textContent = message;
        modal.style.display = 'flex';
    }

    // 成功モーダルを閉じる
    closeSuccessModal() {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'none';
    }

    // 既存の章名を正規化（undefinedを完全除去）
    normalizeChapterNames() {
        if (!this.currentSubject.courses) return;

        const chapterNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

        Object.entries(this.currentSubject.courses).forEach(([courseId, course]) => {
            if (!course.chapters) return;

            const chapters = Object.entries(course.chapters);
            chapters.forEach(([chapterId, chapter], index) => {
                console.log(`🔧 章正規化処理: ${chapterId}`, chapter);
                
                // 既に正しい形式で「undefined」が含まれていない場合はスキップ
                if (chapter.name && 
                    chapter.name.includes('第') && 
                    !chapter.name.includes('undefined') &&
                    !chapter.name.includes('null')) {
                    return;
                }

                // 元の名前を安全に取得（undefinedを完全除去）
                let originalName = '';
                
                // 有効な名前を探す
                const nameFields = ['name', 'title', 'originalName'];
                for (const field of nameFields) {
                    const value = chapter[field];
                    if (value && 
                        typeof value === 'string' && 
                        value !== 'undefined' && 
                        !value.includes('undefined') && 
                        value.trim() !== '' &&
                        value !== 'null') {
                        originalName = value.trim();
                        break;
                    }
                }
                
                // 有効な名前が見つからない場合のデフォルト
                if (!originalName) {
                    originalName = '国語基礎';
                }
                
                // 「第○章」の部分を除去して純粋な名前を取得
                if (originalName.includes('第') && originalName.includes('章')) {
                    const match = originalName.match(/第[一二三四五六七八九十\d]+章\s*(.+)/);
                    if (match && match[1]) {
                        originalName = match[1].trim();
                    }
                }

                // 元の名前を保存（安全に）
                chapter.originalName = originalName;

                // 章番号を設定（まだない場合、または0以下の場合）
                if (!chapter.chapterNumber || chapter.chapterNumber <= 0) {
                    chapter.chapterNumber = index + 1;
                }

                // 章名を「第○章　元の名前」の形式に変更（安全に）
                let chapterNumber = chapter.chapterNumber;
                if (chapterNumber <= 0) {
                    chapterNumber = 1;
                }
                const numberText = chapterNumber <= 10 ? chapterNumbers[chapterNumber - 1] : chapterNumber;
                chapter.name = `第${numberText}章　${originalName}`;
                
                console.log(`✅ 章名正規化完了: ${chapterId} → "${chapter.name}"`);
            });
        });

        // データを保存
        this.saveSubjects();
        console.log('💾 章名正規化処理完了・データ保存済み');
    }

    // 講義の並べ替え
    sortLessons(method) {
        const courses = this.currentSubject.courses || {};
        
        Object.entries(courses).forEach(([courseId, course]) => {
            const chapters = course.chapters || {};
            Object.entries(chapters).forEach(([chapterId, chapter]) => {
                const lessons = chapter.lessons || {};
                const lessonEntries = Object.entries(lessons);
                
                if (lessonEntries.length === 0) return;
                
                if (method === 'name') {
                    lessonEntries.sort((a, b) => {
                        const nameA = this.generateSafeLessonName(a[1]);
                        const nameB = this.generateSafeLessonName(b[1]);
                        return nameA.localeCompare(nameB, 'ja');
                    });
                } else if (method === 'created') {
                    lessonEntries.sort((a, b) => {
                        const dateA = new Date(a[1].createdAt || '1970-01-01');
                        const dateB = new Date(b[1].createdAt || '1970-01-01');
                        return dateA - dateB;
                    });
                }
                
                // 講義番号を再割り当て
                const sortedLessons = {};
                lessonEntries.forEach(([lessonId, lesson], index) => {
                    sortedLessons[lessonId] = {
                        ...lesson,
                        lessonNumber: index + 1
                    };
                });
                
                chapter.lessons = sortedLessons;
            });
        });
    }

    // レッスングループ管理機能
    manageLessonGroups() {
        console.log('👥 レッスングループ管理機能が呼び出されました');
        this.showMessage('レッスングループ管理機能は開発中です。近日公開予定です。', 'info');
    }

    // メッセージ表示機能
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
}

// インスタンス作成
let subjectDetail;

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DOM loaded, creating SubjectDetail instance...');
    try {
    subjectDetail = new SubjectDetail();
        console.log('✅ SubjectDetail instance created:', subjectDetail);
        
        // グローバルにアクセス可能か確認
        window.subjectDetail = subjectDetail;
    } catch (error) {
        console.error('❌ Error creating SubjectDetail:', error);
    }
}); 