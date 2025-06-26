// 決済機能管理クラス
class PaymentManager {
    constructor() {
        this.stripe = null;
        this.currentSchool = null;
        this.pricingPlans = [];
        this.currentSubscription = null;
        
        this.init();
    }

    async init() {
        // Stripeの初期化（デモモード対応）
        if (typeof Stripe !== 'undefined') {
            this.stripe = Stripe('pk_test_demo_key'); // デモ用キー
        }
        
        // 現在のユーザー情報を取得
        await this.loadCurrentUser();
        
        // 料金プランを読み込み
        await this.loadPricingPlans();
        
        // サブスクリプション状況を確認
        if (this.currentSchool) {
            await this.loadSubscriptionStatus();
        }
    }

    async loadCurrentUser() {
        try {
            const userProfile = await getCurrentUserProfile();
            if (userProfile && userProfile.schools) {
                this.currentSchool = userProfile.schools;
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }

    async loadPricingPlans() {
        try {
            const response = await fetch('/api/pricing-plans');
            const data = await response.json();
            
            if (response.ok) {
                this.pricingPlans = data.plans;
                this.renderPricingPlans();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading pricing plans:', error);
            this.showError('料金プランの読み込みに失敗しました');
        }
    }

    async loadSubscriptionStatus() {
        try {
            const response = await fetch(`/api/subscription-status/${this.currentSchool.id}`);
            const data = await response.json();
            
            if (response.ok) {
                this.currentSubscription = data.hasSubscription ? data.subscription : null;
                this.renderSubscriptionStatus(data);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading subscription status:', error);
        }
    }

    renderPricingPlans() {
        const container = document.getElementById('pricing-plans-container');
        if (!container) return;

        container.innerHTML = this.pricingPlans.map(plan => `
            <div class="pricing-card ${plan.is_popular ? 'popular' : ''}" data-plan-id="${plan.id}">
                ${plan.is_popular ? '<div class="popular-badge">人気プラン</div>' : ''}
                <div class="plan-header">
                    <h3 class="plan-name">${plan.name}</h3>
                    <p class="plan-description">${plan.description}</p>
                </div>
                <div class="plan-pricing">
                    <div class="price-monthly">
                        <span class="price">¥${plan.price_monthly.toLocaleString()}</span>
                        <span class="period">/月</span>
                    </div>
                    ${plan.price_yearly ? `
                        <div class="price-yearly">
                            年額: ¥${plan.price_yearly.toLocaleString()} 
                            <span class="discount">(${Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}% お得)</span>
                        </div>
                    ` : ''}
                </div>
                <div class="plan-features">
                    <ul>
                        ${JSON.parse(plan.features).map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="plan-limits">
                    ${plan.max_students ? `<p>最大生徒数: ${plan.max_students}名</p>` : '<p>生徒数: 無制限</p>'}
                    ${plan.max_courses ? `<p>最大コース数: ${plan.max_courses}</p>` : '<p>コース数: 無制限</p>'}
                </div>
                <div class="plan-actions">
                    <button class="btn-select-plan" onclick="paymentManager.selectPlan('${plan.id}')">
                        このプランを選択
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderSubscriptionStatus(data) {
        const container = document.getElementById('subscription-status');
        if (!container) return;

        if (!data.hasSubscription) {
            container.innerHTML = `
                <div class="no-subscription">
                    <h3>サブスクリプションが設定されていません</h3>
                    <p>学習システムを利用するには、プランの選択が必要です。</p>
                    <button class="btn-primary" onclick="paymentManager.showPricingPlans()">
                        プランを選択する
                    </button>
                </div>
            `;
            return;
        }

        const subscription = data.subscription;
        const plan = subscription.pricing_plans;
        const usage = data.usage;

        container.innerHTML = `
            <div class="subscription-active">
                <div class="subscription-header">
                    <h3>現在のプラン: ${plan.name}</h3>
                    <span class="status-badge status-${subscription.status}">${this.getStatusText(subscription.status)}</span>
                </div>
                
                <div class="subscription-details">
                    <div class="billing-info">
                        <p><strong>料金:</strong> ¥${(subscription.billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly).toLocaleString()}</p>
                        <p><strong>請求サイクル:</strong> ${subscription.billing_cycle === 'yearly' ? '年額' : '月額'}</p>
                        <p><strong>次回請求日:</strong> ${new Date(subscription.current_period_end).toLocaleDateString('ja-JP')}</p>
                    </div>
                    
                    ${usage ? `
                        <div class="usage-info">
                            <h4>使用状況</h4>
                            <div class="usage-item">
                                <span>生徒数:</span>
                                <span>${usage.current_students} / ${usage.max_students || '無制限'}</span>
                                <div class="usage-bar">
                                    <div class="usage-fill" style="width: ${usage.max_students ? (usage.current_students / usage.max_students * 100) : 50}%"></div>
                                </div>
                            </div>
                            <div class="usage-item">
                                <span>コース数:</span>
                                <span>${usage.current_courses} / ${usage.max_courses || '無制限'}</span>
                                <div class="usage-bar">
                                    <div class="usage-fill" style="width: ${usage.max_courses ? (usage.current_courses / usage.max_courses * 100) : 50}%"></div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="subscription-actions">
                    <button class="btn-secondary" onclick="paymentManager.showPaymentHistory()">
                        決済履歴を見る
                    </button>
                    <button class="btn-danger" onclick="paymentManager.showCancelDialog()">
                        サブスクリプションをキャンセル
                    </button>
                </div>
            </div>
        `;
    }

    async selectPlan(planId) {
        if (!this.currentSchool) {
            this.showError('スクール情報が見つかりません');
            return;
        }

        const plan = this.pricingPlans.find(p => p.id === planId);
        if (!plan) {
            this.showError('プランが見つかりません');
            return;
        }

        // 決済フォームを表示
        this.showPaymentForm(plan);
    }

    showPaymentForm(plan) {
        const modal = document.getElementById('payment-modal');
        if (!modal) {
            this.createPaymentModal();
        }

        const modalContent = document.getElementById('payment-modal-content');
        modalContent.innerHTML = `
            <div class="payment-form">
                <h3>${plan.name}の購入</h3>
                <div class="selected-plan-info">
                    <p><strong>プラン:</strong> ${plan.name}</p>
                    <p><strong>説明:</strong> ${plan.description}</p>
                </div>
                
                <div class="billing-cycle-selector">
                    <h4>請求サイクル</h4>
                    <div class="cycle-options">
                        <label class="cycle-option">
                            <input type="radio" name="billing-cycle" value="monthly" checked>
                            <span>月額 ¥${plan.price_monthly.toLocaleString()}</span>
                        </label>
                        ${plan.price_yearly ? `
                            <label class="cycle-option">
                                <input type="radio" name="billing-cycle" value="yearly">
                                <span>年額 ¥${plan.price_yearly.toLocaleString()} 
                                    <small>(${Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}% お得)</small>
                                </span>
                            </label>
                        ` : ''}
                    </div>
                </div>
                
                <div class="card-element-container">
                    <h4>決済情報</h4>
                    <div id="card-element"></div>
                    <div id="card-errors" role="alert"></div>
                </div>
                
                <div class="payment-actions">
                    <button class="btn-secondary" onclick="paymentManager.hidePaymentForm()">キャンセル</button>
                    <button class="btn-primary" id="submit-payment" onclick="paymentManager.processPayment('${plan.id}')">
                        14日間無料トライアルを開始
                    </button>
                </div>
            </div>
        `;

        // Stripe Elements を初期化
        this.initializeCardElement();
        
        modal.style.display = 'block';
    }

    initializeCardElement() {
        const elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
            },
        });

        this.cardElement.mount('#card-element');

        this.cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }

    async processPayment(planId) {
        const submitButton = document.getElementById('submit-payment');
        submitButton.disabled = true;
        submitButton.textContent = '処理中...';

        try {
            // 請求サイクルを取得
            const billingCycle = document.querySelector('input[name="billing-cycle"]:checked').value;

            // 決済方法を作成
            const { error, paymentMethod } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
            });

            if (error) {
                throw new Error(error.message);
            }

            // サーバーでサブスクリプションを作成
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schoolId: this.currentSchool.id,
                    planId: planId,
                    paymentMethodId: paymentMethod.id,
                    billingCycle: billingCycle
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error);
            }

            // 決済の確認
            if (data.clientSecret) {
                const { error: confirmError } = await this.stripe.confirmCardPayment(data.clientSecret);
                
                if (confirmError) {
                    throw new Error(confirmError.message);
                }
            }

            // 成功
            this.showSuccess('サブスクリプションが正常に作成されました！');
            this.hidePaymentForm();
            await this.loadSubscriptionStatus();

        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message || '決済処理中にエラーが発生しました');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = '14日間無料トライアルを開始';
        }
    }

    async showPaymentHistory() {
        try {
            const response = await fetch(`/api/payment-history/${this.currentSchool.id}`);
            const data = await response.json();
            
            if (response.ok) {
                this.renderPaymentHistory(data);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading payment history:', error);
            this.showError('決済履歴の読み込みに失敗しました');
        }
    }

    renderPaymentHistory(data) {
        const modal = this.createModal('payment-history-modal', '決済履歴');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <h3>決済履歴</h3>
            <div class="payment-history-list">
                ${data.payments.length > 0 ? data.payments.map(payment => `
                    <div class="payment-item">
                        <div class="payment-date">${new Date(payment.created_at).toLocaleDateString('ja-JP')}</div>
                        <div class="payment-amount">¥${payment.amount.toLocaleString()}</div>
                        <div class="payment-status status-${payment.status}">${this.getPaymentStatusText(payment.status)}</div>
                        ${payment.receipt_url ? `<a href="${payment.receipt_url}" target="_blank" class="receipt-link">領収書</a>` : ''}
                    </div>
                `).join('') : '<p>決済履歴がありません</p>'}
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="paymentManager.hideModal('payment-history-modal')">閉じる</button>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    showCancelDialog() {
        const modal = this.createModal('cancel-dialog', 'サブスクリプションキャンセル');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <h3>サブスクリプションをキャンセルしますか？</h3>
            <p>キャンセル後も、現在の請求期間の終了まではサービスをご利用いただけます。</p>
            <div class="cancel-options">
                <label>
                    <input type="radio" name="cancel-type" value="end-of-period" checked>
                    期間終了時にキャンセル（推奨）
                </label>
                <label>
                    <input type="radio" name="cancel-type" value="immediate">
                    即座にキャンセル
                </label>
            </div>
            <div class="modal-actions">
                <button class="btn-secondary" onclick="paymentManager.hideModal('cancel-dialog')">キャンセル</button>
                <button class="btn-danger" onclick="paymentManager.confirmCancel()">確認してキャンセル</button>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    async confirmCancel() {
        try {
            const cancelType = document.querySelector('input[name="cancel-type"]:checked').value;
            const immediate = cancelType === 'immediate';

            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schoolId: this.currentSchool.id,
                    immediate: immediate
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showSuccess(data.message);
                this.hideModal('cancel-dialog');
                await this.loadSubscriptionStatus();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
            this.showError('キャンセル処理中にエラーが発生しました');
        }
    }

    // ユーティリティ関数
    createPaymentModal() {
        const modal = document.createElement('div');
        modal.id = 'payment-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="paymentManager.hidePaymentForm()"></div>
            <div class="modal-content" id="payment-modal-content"></div>
        `;
        document.body.appendChild(modal);
    }

    createModal(id, title) {
        let modal = document.getElementById(id);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = id;
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-backdrop" onclick="paymentManager.hideModal('${id}')"></div>
                <div class="modal-content"></div>
            `;
            document.body.appendChild(modal);
        }
        return modal;
    }

    hidePaymentForm() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showPricingPlans() {
        // 料金プラン画面に遷移またはモーダル表示
        window.location.href = '#pricing';
    }

    getStatusText(status) {
        const statusMap = {
            'trialing': 'トライアル中',
            'active': '有効',
            'past_due': '支払い期限超過',
            'canceled': 'キャンセル済み',
            'unpaid': '未払い'
        };
        return statusMap[status] || status;
    }

    getPaymentStatusText(status) {
        const statusMap = {
            'pending': '処理中',
            'succeeded': '成功',
            'failed': '失敗',
            'canceled': 'キャンセル',
            'refunded': '返金済み'
        };
        return statusMap[status] || status;
    }

    showError(message) {
        // エラー表示の実装
        console.error(message);
        alert(message); // 実際にはより良いUI実装を使用
    }

    showSuccess(message) {
        // 成功メッセージ表示の実装
        console.log(message);
        alert(message); // 実際にはより良いUI実装を使用
    }
}

// グローバルインスタンス作成
let paymentManager;

document.addEventListener('DOMContentLoaded', () => {
    paymentManager = new PaymentManager();
});