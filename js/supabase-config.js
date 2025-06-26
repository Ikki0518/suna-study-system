// Supabase設定
// 注意: 以下のANON_KEYを実際の値に置き換えてください
// Supabaseダッシュボード: https://supabase.com/dashboard/project/wjpcfsjtjgxvhijczxnj/settings/api
const SUPABASE_URL = 'https://wjpcfsjtjgxvhijczxnj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcGNmc2p0amd4dmhpamN6eG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDYxOTcsImV4cCI6MjA2NTg4MjE5N30.TRMV3BrHkCKH-7RYFD6rGLdYq1kxUqZYQr3uD-WaPy0';

// デバッグログ追加
console.log('🔍 [SUPABASE DEBUG] Configuration loaded');
console.log('🔍 [SUPABASE DEBUG] SUPABASE_URL:', SUPABASE_URL);
console.log('🔍 [SUPABASE DEBUG] SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY_HERE' ? 'SET' : 'NOT SET');

// デモモード判定
const isDemo = SUPABASE_URL === 'https://demo.supabase.co' || SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE';
console.log('🔍 [SUPABASE DEBUG] Demo mode:', isDemo);
console.log('🔍 [SUPABASE DEBUG] Reason for demo mode:', SUPABASE_ANON_KEY === 'YOUR_ANON_KEY_HERE' ? 'Missing API key' : 'Demo URL');

// Supabaseクライアントの初期化（デモモード対応）
let supabaseClient = null;
if (!isDemo && typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// デモ用ユーザープロフィール
const DEMO_USER_PROFILE = {
    id: 'demo-user-id',
    email: 'demo@example.com',
    name: 'デモユーザー',
    role: 'admin',
    school_id: 'school-demo',
    schools: {
        id: 'school-demo',
        name: 'デモ学習塾',
        description: 'システムデモ用の学習塾',
        color: '#ec4899'
    }
};

// 認証状態の管理
let currentUser = null;

// 認証状態の監視
if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        currentUser = session?.user || null;
        
        // 認証状態に応じてUIを更新
        updateAuthUI();
    });
} else if (isDemo) {
    // デモモードでは常に認証済みとして扱う
    currentUser = { id: 'demo-user-id' };
    updateAuthUI();
}

// 認証UI更新関数
function updateAuthUI() {
    const loginElements = document.querySelectorAll('.login-required');
    const logoutElements = document.querySelectorAll('.logout-required');
    
    if (currentUser) {
        loginElements.forEach(el => el.style.display = 'none');
        logoutElements.forEach(el => el.style.display = 'block');
    } else {
        loginElements.forEach(el => el.style.display = 'block');
        logoutElements.forEach(el => el.style.display = 'none');
    }
}

// ユーザープロフィール取得
async function getCurrentUserProfile() {
    // デモモードの場合
    if (isDemo) {
        return DEMO_USER_PROFILE;
    }
    
    if (!currentUser) return null;
    
    try {
        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select(`
                *,
                schools (*)
            `)
            .eq('id', currentUser.id)
            .single();
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

// スクール情報取得
async function getSchoolById(schoolId) {
    try {
        const { data, error } = await supabaseClient
            .from('schools')
            .select('*')
            .eq('id', schoolId)
            .single();
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching school:', error);
        return null;
    }
}

// コース一覧取得
async function getCoursesBySchool(schoolId) {
    try {
        const { data, error } = await supabaseClient
            .from('courses')
            .select(`
                *,
                subjects (*),
                user_profiles!courses_instructor_id_fkey (name)
            `)
            .eq('school_id', schoolId)
            .eq('is_active', true)
            .order('sort_order');
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

// 学習進捗取得
async function getStudentProgress(studentId, courseId = null) {
    try {
        let query = supabaseClient
            .from('student_progress')
            .select(`
                *,
                lessons (
                    *,
                    chapters (
                        *,
                        courses (*)
                    )
                )
            `)
            .eq('student_id', studentId);
            
        if (courseId) {
            query = query.eq('lessons.chapters.course_id', courseId);
        }
            
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching student progress:', error);
        return [];
    }
}

// 進捗更新
async function updateLessonProgress(studentId, lessonId, completed, watchTime = 0, lastPosition = 0, notes = '') {
    try {
        const { data, error } = await supabaseClient
            .from('student_progress')
            .upsert({
                student_id: studentId,
                lesson_id: lessonId,
                completed,
                completion_date: completed ? new Date().toISOString() : null,
                watch_time_seconds: watchTime,
                last_position_seconds: lastPosition,
                notes
            });
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating progress:', error);
        throw error;
    }
}

// コース受講登録
async function enrollInCourse(studentId, courseId) {
    try {
        const { data, error } = await supabaseClient
            .from('course_enrollments')
            .upsert({
                student_id: studentId,
                course_id: courseId,
                enrolled_at: new Date().toISOString()
            });
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error enrolling in course:', error);
        throw error;
    }
}

// 認証関数
async function signUp(email, password, userData) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

async function signIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// エクスポート（グローバルで使用可能にする）
window.supabaseClient = supabaseClient;
window.supabaseAuth = {
    getCurrentUserProfile,
    getSchoolById,
    getCoursesBySchool,
    getStudentProgress,
    updateLessonProgress,
    enrollInCourse,
    signUp,
    signIn,
    signOut
};
// migrateLocalSubjectsToSupabase関数の定義（デモ用）
async function migrateLocalSubjectsToSupabase() {
    console.log('🔍 [SUPABASE DEBUG] migrateLocalSubjectsToSupabase called (demo mode)');
    if (isDemo) {
        console.log('🔍 [SUPABASE DEBUG] Demo mode - migration skipped');
        return { success: true, message: 'Demo mode - migration not needed' };
    }
    // 実際の移行処理はここに実装
    return { success: false, message: 'Migration not implemented for production mode' };
}

if (typeof window !== "undefined") {
  window.migrateLocalSubjectsToSupabase = migrateLocalSubjectsToSupabase;
}