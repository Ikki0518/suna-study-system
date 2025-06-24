// 本番用学習塾選択システム
class SchoolSelection {
    constructor() {
        this.loadSchools();
        this.init();
    }

    // スクールデータをローカルストレージから読み込み
    loadSchools() {
        const stored = localStorage.getItem('schools');
        if (stored) {
            this.schools = JSON.parse(stored);
        } else {
            // フォールバック用のデフォルトスクール
            this.schools = {
                'production-school': {
                    id: 'production-school',
                    name: 'あなたの学習塾',
                    description: '質の高い教育を提供する学習塾',
                    color: '#2563eb',
                    instructors: ['塾長', '講師A', '講師B'],
                    isDefault: true
                }
            };
        }
    }

    init() {
        this.renderSchools();
        this.bindEvents();
    }

    renderSchools() {
        const container = document.getElementById('schools-container');
        if (!container) return;

        const schoolsHtml = Object.values(this.schools).map(school => `
            <div class="school-card" data-school-id="${school.id}" style="--school-color: ${school.color}">
                <div class="school-header">
                    <h3 class="school-name">${school.name}</h3>
                    <div class="school-badge">推奨</div>
                </div>
                <p class="school-description">${school.description}</p>
                <div class="school-instructors">
                    <h4>講師陣</h4>
                    <div class="instructor-list">
                        ${school.instructors.map(instructor => 
                            `<span class="instructor-tag">${instructor}</span>`
                        ).join('')}
                    </div>
                </div>
                <button class="select-school-btn" onclick="schoolSelection.selectSchool('${school.id}')">
                    この学習塾を選択
                </button>
            </div>
        `).join('');

        container.innerHTML = schoolsHtml;
    }

    selectSchool(schoolId) {
        const school = this.schools[schoolId];
        if (!school) return;

        // 選択した学習塾をローカルストレージに保存
        localStorage.setItem('selectedSchool', JSON.stringify(school));
        
        // 成功メッセージを表示
        this.showMessage(`${school.name}を選択しました。`, 'success');
        
        // 少し遅延してからログイン画面にリダイレクト
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 1500);
    }

    showMessage(message, type = 'info') {
        // 既存のメッセージを削除
        const existingMessage = document.querySelector('.notification');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 新しいメッセージを作成
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        // タイプに応じて背景色を設定
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        }

        document.body.appendChild(notification);

        // 3秒後に自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    bindEvents() {
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = 'signup.html';
            }
        });
    }
}

// アプリケーションの初期化
let schoolSelection;
document.addEventListener('DOMContentLoaded', () => {
    schoolSelection = new SchoolSelection();
});

// アニメーション用CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 