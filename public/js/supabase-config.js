// Supabase設定
const SUPABASE_URL = 'https://demo.supabase.co';
const SUPABASE_ANON_KEY = 'demo-anon-key';

// デモモード判定
const isDemo = SUPABASE_URL === 'https://demo.supabase.co';

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
if (typeof window !== "undefined") {
  window.migrateLocalSubjectsToSupabase = migrateLocalSubjectsToSupabase;
}
if (typeof window !== "undefined" && typeof migrateLocalSubjectsToSupabase === "function") {
  window.migrateLocalSubjectsToSupabase = migrateLocalSubjectsToSupabase;
}
window.migrateLocalSubjectsToSupabase = migrateLocalSubjectsToSupabase;
window.migrateLocalSubjectsToSupabase = migrateLocalSubjectsToSupabase;