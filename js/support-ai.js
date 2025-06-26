// Support AI Sidebar Chat
// Author: Suna Study System
// ------------------------------
// 右側サイドバー式のAIチャット機能
// ------------------------------

console.log('🤖 AI Sidebar Chat script loaded!');

(function () {
    console.log('🤖 AI Sidebar Chat IIFE started');
    
    // API エンドポイント
    const ENDPOINT_URL = (window.location.protocol === 'file:' ? 'http://localhost:8000' : '') + '/api/support-ai';
    
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
        // AIトグルボタン
        aiToggleBtn.addEventListener('click', openAISidebar);
        
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
                handleSendMessage();
            }
        });
        
        // 入力欄のリサイズ
        aiInput.addEventListener('input', autoResizeTextarea);
    }

    // 入力状態の監視
    function monitorInputState() {
        aiInput.addEventListener('input', () => {
            const hasText = aiInput.value.trim().length > 0;
            aiSendBtn.disabled = !hasText || isAIResponding;
        });
    }

    // テキストエリアの自動リサイズ
    function autoResizeTextarea() {
        aiInput.style.height = 'auto';
        aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + 'px';
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
    async function handleSendMessage() {
        const message = aiInput.value.trim();
        if (!message || isAIResponding) return;

        console.log('🤖 Sending message:', message);

        // ユーザーメッセージを表示
        appendMessage('user', message);
        
        // 会話履歴に追加
        conversationHistory.push({ role: 'user', content: message });
        
        // 入力欄をクリア
        aiInput.value = '';
        autoResizeTextarea();
        
        // AI応答中状態に設定
        setAIResponding(true);
        
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
            const response = await fetch(ENDPOINT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const aiReply = data.reply || 'すみません、回答を生成できませんでした。';

            // AIメッセージを表示
            appendMessage('assistant', aiReply);
            
            // 会話履歴に追加
            conversationHistory.push({ role: 'assistant', content: aiReply });
            
            console.log('🤖 AI response received successfully');
            
        } catch (error) {
            console.error('🤖 AI API Error:', error);
            appendMessage('assistant', 'すみません、エラーが発生しました。しばらく時間をおいてから再度お試しください。');
        } finally {
            setAIResponding(false);
        }
    }

    // AI応答中状態の管理
    function setAIResponding(responding) {
        isAIResponding = responding;
        aiSendBtn.disabled = responding || aiInput.value.trim().length === 0;
        
        if (responding) {
            aiLoading.style.display = 'flex';
        } else {
            aiLoading.style.display = 'none';
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

    // 現在の講座コンテキストを取得
    function getCurrentCourseContext() {
        try {
            // 現在表示されているレッスンの情報を取得
            const lessonView = document.getElementById('lesson-view');
            if (!lessonView || lessonView.style.display === 'none') {
                return null;
            }

            // レッスンタイトルを取得
            const titleElement = lessonView.querySelector('.lesson-title, h1, h2, h3');
            const title = titleElement ? titleElement.textContent.trim() : '';

            // レッスン内容を取得
            const contentElement = lessonView.querySelector('.lesson-content, .text-content, .lesson-body');
            let content = '';
            
            if (contentElement) {
                // HTMLタグを除去してテキストのみ抽出
                content = contentElement.innerText || contentElement.textContent || '';
                // 長すぎる場合は最初の2000文字のみ使用
                content = content.substring(0, 2000);
            }

            // パンくずから科目・章情報を取得
            const breadcrumb = document.querySelector('.breadcrumb-content');
            let subject = '';
            let chapter = '';
            
            if (breadcrumb) {
                const breadcrumbText = breadcrumb.textContent || '';
                const parts = breadcrumbText.split('›').map(part => part.trim());
                if (parts.length > 1) {
                    subject = parts[1] || '';
                }
                if (parts.length > 2) {
                    chapter = parts[2] || '';
                }
            }

            // StudyAppの現在のレッスンデータがある場合はそれも使用
            if (window.app && window.app.currentLesson) {
                const lesson = window.app.currentLesson;
                return {
                    title: title || lesson.title || '',
                    subject: subject || lesson.subject || '',
                    chapter: chapter || lesson.chapter || '',
                    content: content || lesson.content || lesson.textContent || ''
                };
            }

            return title || content ? {
                title: title,
                subject: subject,
                chapter: chapter,
                content: content
            } : null;

        } catch (error) {
            console.warn('🤖 Failed to get course context:', error);
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