// 学習塾選択・申請システム

class SchoolSelectionApp {
    constructor() {
        this.currentStep = 1;
        this.selectedSchool = null;
        this.schools = [];
        
        this.init();
    }
    
    async init() {
        await this.loadSchools();
        this.renderSchools();
        this.setupEventListeners();
    }
    
    // 学習塾データの読み込み（将来的にはSupabaseから取得）
    async loadSchools() {
        // 現在はハードコードされたデータを使用
        // 後でSupabaseから取得するように変更
        this.schools = [
            {
                id: 'demo-school',
                name: 'デモ学習塾',
                description: 'システムデモ用の学習塾です。基本的な学習機能をお試しいただけます。',
                color: '#ec4899',
                icon: '🏫',
                instructors: ['田中先生', '佐藤先生', '山田先生']
            },
            {
                id: 'sakura-juku',
                name: 'さくら塾',
                description: '地域密着型の進学塾です。一人ひとりに寄り添った指導を心がけています。',
                color: '#f97316',
                icon: '🌸',
                instructors: ['鈴木先生', '高橋先生', '伊藤先生']
            },
            {
                id: 'future-academy',
                name: '未来アカデミー',
                description: '最新の学習メソッドで未来を創る進学塾です。ITを活用した効率的な学習を提供します。',
                color: '#3b82f6',
                icon: '🚀',
                instructors: ['中村先生', '小林先生', '加藤先生']
            },
            {
                id: 'shining-stars',
                name: 'シャイニングスターズ',
                description: '一人ひとりが輝く個別指導塾です。生徒の可能性を最大限に引き出します。',
                color: '#8b5cf6',
                icon: '⭐',
                instructors: ['渡辺先生', '松本先生', '木村先生']
            }
        ];
    }
    
    // 学習塾一覧の表示
    renderSchools() {
        const schoolsGrid = document.getElementById('schoolsGrid');
        schoolsGrid.innerHTML = '';
        
        this.schools.forEach(school => {
            const schoolCard = document.createElement('div');
            schoolCard.className = 'school-card';
            schoolCard.style.setProperty('--school-color', school.color);
            schoolCard.dataset.schoolId = school.id;
            
            schoolCard.innerHTML = `
                <div class="school-header">
                    <div class="school-icon">${school.icon}</div>
                    <div class="school-info">
                        <h3>${school.name}</h3>
                        <p>講師${school.instructors.length}名</p>
                    </div>
                </div>
                <div class="school-description">
                    ${school.description}
                </div>
                <div class="school-instructors">
                    ${school.instructors.map(instructor => 
                        `<span class="instructor-tag">${instructor}</span>`
                    ).join('')}
                </div>
            `;
            
            schoolCard.addEventListener('click', () => this.selectSchool(school));
            schoolsGrid.appendChild(schoolCard);
        });
    }
    
    // 学習塾選択
    selectSchool(school) {
        // 既存の選択を解除
        document.querySelectorAll('.school-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 新しい選択を適用
        const selectedCard = document.querySelector(`[data-school-id="${school.id}"]`);
        selectedCard.classList.add('selected');
        
        this.selectedSchool = school;
        
        // 次のステップに進むボタンを表示
        this.showNextStepButton();
    }
    
    // 次のステップボタンを表示
    showNextStepButton() {
        let nextButton = document.getElementById('nextStepButton');
        if (!nextButton) {
            nextButton = document.createElement('button');
            nextButton.id = 'nextStepButton';
            nextButton.className = 'btn btn-primary';
            nextButton.textContent = '申請情報を入力';
            nextButton.onclick = () => this.goToStep(2);
            
            const step1 = document.getElementById('step1');
            step1.appendChild(nextButton);
        }
        nextButton.style.display = 'block';
    }
    
    // ステップ移動
    goToStep(stepNumber) {
        if (stepNumber === 2 && !this.selectedSchool) {
            this.showError('学習塾を選択してください。');
            return;
        }
        
        // 現在のステップを非表示
        document.getElementById(`step${this.currentStep}`).classList.add('hidden');
        
        // ステップインジケーターを更新
        document.querySelector(`[data-step="${this.currentStep}"]`).classList.remove('active');
        if (stepNumber > this.currentStep) {
            document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('completed');
        }
        
        // 新しいステップを表示
        this.currentStep = stepNumber;
        document.getElementById(`step${this.currentStep}`).classList.remove('hidden');
        document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
        
        // ステップ2の場合、選択した学習塾の情報を表示
        if (stepNumber === 2) {
            this.renderSelectedSchool();
        }
    }
    
    // 選択した学習塾の情報表示
    renderSelectedSchool() {
        const display = document.getElementById('selectedSchoolDisplay');
        display.style.setProperty('--school-color', this.selectedSchool.color);
        display.innerHTML = `
            <div class="selected-school-icon">${this.selectedSchool.icon}</div>
            <div class="selected-school-info">
                <h3>${this.selectedSchool.name}</h3>
                <p>${this.selectedSchool.description}</p>
            </div>
        `;
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        const form = document.getElementById('applicationForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // 申請フォームの送信処理
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const applicationData = {
            applicant_name: formData.get('applicantName'),
            applicant_email: formData.get('applicantEmail'),
            message: formData.get('applicationMessage'),
            school_id: this.selectedSchool.id
        };
        
        // バリデーション
        if (!applicationData.applicant_name || !applicationData.applicant_email) {
            this.showError('お名前とメールアドレスは必須項目です。');
            return;
        }
        
        // メールアドレスの形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(applicationData.applicant_email)) {
            this.showError('正しいメールアドレスを入力してください。');
            return;
        }
        
        try {
            this.showLoading(true);
            
            // 申請データを送信（将来的にはSupabaseに送信）
            await this.submitApplication(applicationData);
            
            this.showLoading(false);
            this.goToStep(3);
            
        } catch (error) {
            this.showLoading(false);
            this.showError('申請の送信に失敗しました。しばらく後でもう一度お試しください。');
            console.error('Application submission error:', error);
        }
    }
    
    // 申請データの送信（将来的にSupabaseに実装）
    async submitApplication(applicationData) {
        // 現在は模擬的な処理
        // 将来的にはSupabaseのAPIを使用
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Application submitted:', applicationData);
                // ローカルストレージに一時保存
                const applications = JSON.parse(localStorage.getItem('pendingApplications') || '[]');
                applications.push({
                    ...applicationData,
                    id: Date.now().toString(),
                    status: 'pending',
                    applied_at: new Date().toISOString()
                });
                localStorage.setItem('pendingApplications', JSON.stringify(applications));
                resolve();
            }, 2000);
        });
    }
    
    // ローディング表示の制御
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }
    
    // エラーメッセージの表示
    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }
    
    // エラーメッセージの非表示
    hideError() {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.classList.add('hidden');
    }
}

// グローバル関数（HTMLから呼び出し用）
function goToStep(stepNumber) {
    if (window.schoolApp) {
        window.schoolApp.goToStep(stepNumber);
    }
}

function hideError() {
    if (window.schoolApp) {
        window.schoolApp.hideError();
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    window.schoolApp = new SchoolSelectionApp();
});

// Supabase統合用の関数（将来的に使用）
/*
// Supabaseクライアントの設定
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// 学習塾データをSupabaseから取得
async function loadSchoolsFromSupabase() {
    const { data, error } = await supabase
        .from('study_schools')
        .select('*')
        .order('name');
    
    if (error) {
        console.error('Error loading schools:', error);
        return [];
    }
    
    return data;
}

// 申請データをSupabaseに送信
async function submitApplicationToSupabase(applicationData) {
    const { data, error } = await supabase
        .from('study_applications')
        .insert([applicationData]);
    
    if (error) {
        throw error;
    }
    
    return data;
}
*/ 