// Support AI Chat Widget
// Author: Suna Study System
// ------------------------------
// This script dynamically injects a chat widget on the bottom-right of the page for students.
// It communicates with a backend endpoint (e.g., Vercel Serverless Function or Supabase Edge Function)
// that wraps the OpenAI Chat Completion API. Update ENDPOINT_URL if you expose the function elsewhere.
// ------------------------------

console.log('🤖 Support AI script loaded!');

(function () {
    console.log('🤖 Support AI IIFE started');
    // Configuration (change to your deployed function URL if necessary)
    const ENDPOINT_URL = '/api/support-ai'; // Relative path on Vercel /functions/v1/support-ai on Supabase, etc.

    // Keeps conversation context (optional, first N exchanges)
    let conversationHistory = [];

    // Utility to create DOM from HTML string
    function htmlToElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    // 現在の講座コンテキストを取得する関数
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

            // 現在のレッスンデータがある場合はそれも使用
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
            console.warn('講座コンテキストの取得に失敗しました:', error);
            return null;
        }
    }

    // Append the widget container to body
    function mountWidget() {
        console.log('🤖 Support AI mountWidget() called');
        if (document.getElementById('support-ai-widget')) {
            console.log('🤖 Support AI widget already exists, skipping mount');
            return; // Already mounted
        }
        console.log('🤖 Creating new Support AI widget');

        const widgetHTML = `
            <div id="support-ai-widget">
                <button class="support-ai-toggle" id="support-ai-toggle" aria-label="チャットを開く" title="質問はこちら">💬</button>

                <div class="support-ai-chat hidden" id="support-ai-chat" role="dialog" aria-label="学習サポートAIチャット">
                    <div class="support-ai-header">
                        <span>学習サポートAI</span>
                        <button class="support-ai-close" id="support-ai-close" aria-label="閉じる">&times;</button>
                    </div>
                    <div class="support-ai-messages" id="support-ai-messages"></div>
                    <form class="support-ai-form" id="support-ai-form">
                        <input type="text" id="support-ai-input" placeholder="質問を入力..." aria-label="メッセージ" required autocomplete="off" />
                        <button type="submit" aria-label="送信">送信</button>
                    </form>
                </div>
            </div>
        `;

        const widget = htmlToElement(widgetHTML);
        document.body.appendChild(widget);

        // Add event listeners
        const toggleBtn = document.getElementById('support-ai-toggle');
        const chatBox = document.getElementById('support-ai-chat');
        const closeBtn = document.getElementById('support-ai-close');
        const form = document.getElementById('support-ai-form');
        const input = document.getElementById('support-ai-input');
        const messagesDiv = document.getElementById('support-ai-messages');

        // Helper to add message bubbles
        function appendMessage(sender, text) {
            const msgEl = document.createElement('div');
            msgEl.className = `support-ai-message ${sender}`;
            msgEl.textContent = text;
            messagesDiv.appendChild(msgEl);
            // Scroll to bottom
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return msgEl;
        }

        toggleBtn.addEventListener('click', () => {
            chatBox.classList.toggle('hidden');
            if (!chatBox.classList.contains('hidden')) {
                input.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            chatBox.classList.add('hidden');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            // Show user message
            appendMessage('user', text);
            // Add to history
            conversationHistory.push({ role: 'user', content: text });
            // Reset field
            input.value = '';

            // Placeholder AI message (spinner)
            const aiMsgEl = appendMessage('ai', '回答を考えています...');

            try {
                // 現在の講座コンテキストを取得
                const courseContext = getCurrentCourseContext();
                
                // リクエストボディを構築
                const requestBody = {
                    messages: conversationHistory.slice(-10) // send last 10 turns
                };
                
                // 講座コンテキストがある場合は追加
                if (courseContext) {
                    requestBody.courseContext = courseContext;
                    console.log('講座コンテキストを送信:', courseContext);
                }

                const response = await fetch(ENDPOINT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                const replyText = data.reply || 'すみません、うまく応答できませんでした。';

                aiMsgEl.textContent = replyText;
                conversationHistory.push({ role: 'assistant', content: replyText });
                
                // デバッグ情報をコンソールに出力
                if (data.hasContext) {
                    console.log('✅ 講座コンテキストを使用して回答しました');
                }
                if (data.model) {
                    console.log('使用モデル:', data.model);
                }
                
            } catch (err) {
                console.error('Support AI error:', err);
                aiMsgEl.textContent = 'エラーが発生しました。時間をおいて再度お試しください。';
            }
        });
    }

    // Wait for DOM to be ready
    console.log('🤖 Checking DOM ready state:', document.readyState);
    if (document.readyState === 'loading') {
        console.log('🤖 DOM loading, adding event listener');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🤖 DOMContentLoaded fired, mounting widget');
            mountWidget();
        });
    } else {
        console.log('🤖 DOM already ready, mounting widget immediately');
        mountWidget();
    }
    console.log('🤖 Support AI script setup complete');
})();