// Support AI Sidebar Chat - DISABLED IN PRODUCTION
// Author: Suna Study System
// ------------------------------
// AIチャット機能は現在無効化されています
// ------------------------------

console.log('🤖 AI Sidebar Chat disabled in production');

(function () {
    console.log('🤖 AI Sidebar Chat disabled - no fetch calls will be made');
    
    // API は完全に無効化
    const ENDPOINT_URL = null;
    
    // 会話履歴を保持
    let conversationHistory = [];
    let isAIResponding = false;

    // DOM要素
    let aiToggleBtn, aiSidebar, aiCloseBtn, aiInput, aiSendBtn, aiMessages, aiLoading, mainContainer;

    // 初期化関数
    function initAISidebar() {
        console.log('🤖 Initializing AI Sidebar...');
        
        // DOM要素を取得
        aiToggleBtn = document.getElementById('ai-toggle-btn');
        aiSidebar = document.getElementById('ai-sidebar');
        aiCloseBtn = document.getElementById('ai-close-btn');
        aiInput = document.getElementById('ai-input');
        aiSendBtn = document.getElementById('ai-send-btn');
        aiMessages = document.getElementById('ai-messages');
        aiLoading = document.getElementById('ai-loading');
        mainContainer = document.getElementById('main-container');

        if (!aiToggleBtn || !aiSidebar) {
            console.warn('🤖 AI Sidebar elements not found, skipping initialization');
            return;
        }

        console.log('🤖 AI Sidebar elements found, setting up event listeners...');

        // イベントリスナーを設定
        setupEventListeners();
        
        // 入力フィールドの状態を監視
        monitorInputState();

        console.log('🤖 AI Sidebar initialization complete');
    }

    // イベントリスナーの設定
    function setupEventListeners() {
        // AIトグルボタン（トグル式）
        aiToggleBtn.addEventListener('click', toggleAISidebar);
        
        // AI閉じるボタン
        aiCloseBtn.addEventListener('click', closeAISidebar);
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && aiSidebar.classList.contains('open')) {
                closeAISidebar();
            }
        });
        
        // 送信ボタン
        aiSendBtn.addEventListener('click', handleSendMessage);
        
        // Enter キーで送信
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                handleSendMessage(e);
            }
        });
        
        // 入力欄のリサイズ
        aiInput.addEventListener('input', autoResizeTextarea);
    }

    // 入力状態の監視
    function monitorInputState() {
        aiInput.addEventListener('input', () => {
            updateSendButtonState();
            autoResizeTextarea();
        });
    }

    // 送信ボタンの状態を更新
    function updateSendButtonState(hasText = null) {
        if (hasText === null) {
            hasText = aiInput.value.trim().length > 0;
        }
        aiSendBtn.disabled = !hasText || isAIResponding;
        
        // ボタンの見た目も更新
        if (aiSendBtn.disabled) {
            aiSendBtn.style.opacity = '0.5';
            aiSendBtn.style.cursor = 'not-allowed';
        } else {
            aiSendBtn.style.opacity = '1';
            aiSendBtn.style.cursor = 'pointer';
        }
    }

    // テキストエリアの自動リサイズ
    function autoResizeTextarea() {
        aiInput.style.height = 'auto';
        aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + 'px';
    }

    // AIサイドバーのトグル（開いてる時は閉じる、閉じてる時は開く）
    function toggleAISidebar() {
        const isOpen = aiSidebar.classList.contains('open');
        
        if (isOpen) {
            closeAISidebar();
        } else {
            openAISidebar();
        }
    }

    // AIサイドバーを開く
    function openAISidebar() {
        console.log('🤖 Opening AI Sidebar...');
        aiSidebar.classList.add('open');
        mainContainer.classList.add('ai-open');
        aiInput.focus();
        
        // 初回開いた時のウェルカムメッセージ（まだメッセージがない場合）
        if (conversationHistory.length === 0) {
            // ウェルカムメッセージは既にHTMLに含まれているのでスキップ
        }
    }

    // AIサイドバーを閉じる
    function closeAISidebar() {
        console.log('🤖 Closing AI Sidebar...');
        aiSidebar.classList.remove('open');
        mainContainer.classList.remove('ai-open');
    }

    // メッセージ送信処理
    async function handleSendMessage(event) {
        console.log('🤖 handleSendMessage called');
        
        // イベントの伝播を防ぐ
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const message = aiInput.value.trim();
        if (!message || isAIResponding) return;

        console.log('🤖 Sending message:', message);

        // 入力欄を即座にクリア（送信前にクリア）
        aiInput.value = '';
        autoResizeTextarea();
        
        // ユーザーメッセージを表示
        appendMessage('user', message);
        
        // 会話履歴に追加
        conversationHistory.push({ role: 'user', content: message });
        
        // AI応答中状態に設定
        setAIResponding(true);
        
        // API が利用できない場合の処理
        if (!ENDPOINT_URL) {
            console.log('🤖 API not available in production environment');
            setTimeout(() => {
                appendMessage('assistant', 'すみません、AI機能は現在開発中です。しばらくお待ちください。');
                setAIResponding(false);
            }, 1000);
            return;
        }
        
        try {
            // 現在の講座コンテキストを取得
            const courseContext = getCurrentCourseContext();
            
            // リクエストボディを構築
            const requestBody = {
                messages: conversationHistory.slice(-10) // 最新10件の会話を送信
            };
            
            // 講座コンテキストがある場合は追加
            if (courseContext) {
                requestBody.courseContext = courseContext;
                console.log('🤖 Course context:', courseContext);
            }

            // API呼び出し
            console.log('🤖 Making API request to:', ENDPOINT_URL);
            
            const response = await fetch(ENDPOINT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            console.log('🤖 API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🤖 API Error Response:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            const aiReply = data.reply || 'すみません、回答を生成できませんでした。';

            // AIメッセージを表示
            appendMessage('assistant', aiReply);
            
            // 会話履歴に追加
            conversationHistory.push({ role: 'assistant', content: aiReply });
            
            console.log('🤖 AI response received successfully');
            
        } catch (error) {
            console.error('🤖 AI API Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            let errorMessage = 'すみません、エラーが発生しました。';
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessage = 'ネットワーク接続に問題があります。インターネット接続を確認してください。';
            } else if (error.message.includes('404')) {
                errorMessage = 'APIエンドポイントが見つかりません。管理者に連絡してください。';
            } else if (error.message.includes('500')) {
                errorMessage = 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。';
            }
            
            appendMessage('assistant', errorMessage);
        } finally {
            setAIResponding(false);
        }
    }

    // AI応答中状態の管理
    function setAIResponding(responding) {
        isAIResponding = responding;
        
        // 送信ボタンの状態を更新
        updateSendButtonState();
        
        if (responding) {
            // 3つの泡のタイピングインジケーターを表示
            showTypingIndicator();
        } else {
            // タイピングインジケーターを削除
            hideTypingIndicator();
        }
    }

    // タイピングインジケーター（3つの泡）を表示
    function showTypingIndicator() {
        // 既存のタイピングインジケーターがあれば削除
        hideTypingIndicator();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-message-assistant ai-typing-indicator';
        typingDiv.id = 'ai-typing-indicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'ai-message-avatar';
        avatarDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#10B981"/>
                <path d="M8 10H16M8 14H16" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        `;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-message-content ai-typing-content';
        contentDiv.innerHTML = `
            <div class="typing-wrapper">
                <span class="typing-text">思考中</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // タイピングインジケーターを削除
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // メッセージを追加
    function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${role}`;
        
        // アバター
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'ai-message-avatar';
        
        if (role === 'assistant') {
            avatarDiv.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#10B981"/>
                    <path d="M8 10H16M8 14H16" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            `;
        } else {
            avatarDiv.textContent = 'あ'; // ユーザーの初文字（仮）
        }
        
        // メッセージ内容
        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-message-content';
        
        // HTMLフォーマット処理
        if (role === 'assistant') {
            contentDiv.innerHTML = formatAIMessage(content);
        } else {
            contentDiv.textContent = content;
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        aiMessages.appendChild(messageDiv);
        
        // スクロールを最下部に
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        return messageDiv;
    }

    // AIメッセージのフォーマット処理
    function formatAIMessage(text) {
        // セキュリティのため基本的なHTMLエスケープ
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // 段落分け（2つ以上の連続する改行）
        const paragraphs = escaped.split(/\n\s*\n/).filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            // 各段落内の処理
            let processed = paragraph
                // 改行文字を <br> に変換
                .replace(/\n/g, '<br>')
                // 太字（**text**）
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                // イタリック（*text*）
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                // 箇条書き（- item）
                .replace(/^- (.+)$/gm, '&bull; $1')
                // 番号付きリスト（1. item）
                .replace(/^(\d+)\. (.+)$/gm, '<strong>$1.</strong> $2');
            
            return `<p>${processed}</p>`;
        }).join('');
    }

    // 現在の講座コンテキストを取得（改善版）
    function getCurrentCourseContext() {
        try {
            console.log('🤖 講座コンテキストを取得中...');
            
            let title = '';
            let subject = '';
            let chapter = '';
            let content = '';

            // 1. メインコンテンツエリア全体から情報を取得
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                // 現在表示されている画面を判定
                const lessonView = document.getElementById('lesson-view');
                const courseView = document.getElementById('course-view');
                const homeView = document.getElementById('home-view');

                // レッスン画面が表示されている場合
                if (lessonView && lessonView.style.display !== 'none') {
                    console.log('🤖 レッスン画面からコンテキストを取得');
                    
                    // タイトルを複数のセレクターで検索
                    const titleSelectors = [
                        '.lesson-title',
                        '.course-title',
                        'h1', 'h2', 'h3',
                        '[data-lesson-title]',
                        '.page-title',
                        '.content-title'
                    ];
                    
                    for (const selector of titleSelectors) {
                        const titleEl = lessonView.querySelector(selector);
                        if (titleEl && titleEl.textContent.trim()) {
                            title = titleEl.textContent.trim();
                            break;
                        }
                    }

                    // コンテンツを複数のセレクターで検索
                    const contentSelectors = [
                        '.lesson-content',
                        '.text-content',
                        '.lesson-body',
                        '.course-content',
                        '.main-content',
                        '.content-body',
                        '[data-lesson-content]'
                    ];
                    
                    for (const selector of contentSelectors) {
                        const contentEl = lessonView.querySelector(selector);
                        if (contentEl) {
                            // HTMLタグを除去してテキストのみ抽出
                            const textContent = contentEl.innerText || contentEl.textContent || '';
                            if (textContent.trim()) {
                                content = textContent.trim().substring(0, 3000); // 3000文字に拡張
                                break;
                            }
                        }
                    }

                    // レッスン画面全体からもコンテンツを取得（フォールバック）
                    if (!content) {
                        const allText = lessonView.innerText || lessonView.textContent || '';
                        if (allText.trim()) {
                            content = allText.trim().substring(0, 2000);
                        }
                    }
                }

                // コース画面が表示されている場合
                else if (courseView && courseView.style.display !== 'none') {
                    console.log('🤖 コース画面からコンテキストを取得');
                    
                    const courseTitleEl = courseView.querySelector('.course-title, h1, h2');
                    if (courseTitleEl) {
                        title = courseTitleEl.textContent.trim();
                    }
                    
                    const courseContentEl = courseView.querySelector('.course-description, .course-content');
                    if (courseContentEl) {
                        content = (courseContentEl.innerText || courseContentEl.textContent || '').substring(0, 2000);
                    }
                }
            }

            // 2. パンくずナビゲーションから科目・章情報を取得
            const breadcrumb = document.querySelector('.breadcrumb-content, .breadcrumb, [data-breadcrumb]');
            if (breadcrumb) {
                const breadcrumbText = breadcrumb.textContent || '';
                const parts = breadcrumbText.split(/[›>\/]/).map(part => part.trim()).filter(part => part && part !== 'Home');
                
                if (parts.length >= 1) subject = parts[0] || '';
                if (parts.length >= 2) chapter = parts[1] || '';
                
                console.log('🤖 パンくず情報:', { subject, chapter });
            }

            // 3. StudyAppのグローバル状態から情報を取得
            if (window.app) {
                if (window.app.currentLesson) {
                    const lesson = window.app.currentLesson;
                    title = title || lesson.title || '';
                    subject = subject || lesson.subject || '';
                    chapter = chapter || lesson.chapter || '';
                    content = content || lesson.content || lesson.textContent || '';
                    console.log('🤖 StudyApp.currentLessonから情報を取得');
                }
                
                if (window.app.currentSubject) {
                    subject = subject || window.app.currentSubject.name || '';
                }
                
                if (window.app.currentCourse) {
                    chapter = chapter || window.app.currentCourse.name || '';
                }
            }

            // 4. ページタイトルからも情報を取得
            if (!title) {
                const pageTitle = document.title;
                if (pageTitle && !pageTitle.includes('スキルプラス')) {
                    title = pageTitle;
                }
            }

            // 5. 結果を構築
            const context = {
                title: title || '現在の講座',
                subject: subject || '学習中の科目',
                chapter: chapter || '学習中の章',
                content: content || '画面に表示されている内容'
            };

            // デバッグ情報をログ出力
            console.log('🤖 取得した講座コンテキスト:', {
                hasTitle: !!context.title,
                hasSubject: !!context.subject,
                hasChapter: !!context.chapter,
                contentLength: context.content.length,
                context: context
            });

            // 有用な情報が取得できた場合のみ返す
            if (context.title !== '現在の講座' || context.content !== '画面に表示されている内容' || context.content.length > 50) {
                return context;
            }

            console.log('🤖 有用な講座コンテキストが見つかりませんでした');
            return null;

        } catch (error) {
            console.error('🤖 講座コンテキスト取得エラー:', error);
            return null;
        }
    }

    // DOM準備完了後に初期化
    function waitForDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAISidebar);
        } else {
            // 少し遅延させてHTMLの動的生成を待つ
            setTimeout(initAISidebar, 100);
        }
    }

    // 初期化実行
    waitForDOM();
    
    console.log('🤖 AI Sidebar Chat script setup complete');
})();