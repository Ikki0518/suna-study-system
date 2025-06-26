// Supabase設定
const SUPABASE_URL = 'https://wjpcfsjtjgxvhijczxnj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcGNmc2p0amd4dmhpamN6eG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDYxOTcsImV4cCI6MjA2NTg4MjE5N30.TRMV3BrHkCKH-7RYFD6rGLdYq1kxUqZYQr3uD-WaPy0';

// Supabaseクライアントの初期化
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Supabase統合クラス
class SupabaseManager {
    constructor() {
        this.supabase = supabase;
        this.currentUser = null;
    }

    // 認証状態の監視
    async initAuth() {
        const { data: { user } } = await this.supabase.auth.getUser();
        this.currentUser = user;
        
        // 認証状態の変更を監視
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.currentUser = session?.user || null;
            this.handleAuthStateChange(event, session);
        });
    }

    // 認証状態変更の処理
    handleAuthStateChange(event, session) {
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session.user);
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
        }
    }

    // メール認証でのサインアップ
    async signUp(email, password, userData) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // メール認証でのサインイン
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // サインアウト
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // ユーザープロファイルの作成
    async createUserProfile(userId, profileData) {
        try {
            const { data, error } = await this.supabase
                .from('study_user_profiles')
                .insert([{
                    user_id: userId,
                    ...profileData
                }]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create profile error:', error);
            return { success: false, error: error.message };
        }
    }
    
        // === 科目（subjects）CRUD ===
    
        // 科目一覧取得
        async getSubjects() {
            const { data, error } = await this.supabase
                .from('subjects')
                .select('*')
                .order('created_at');
            if (error) {
                console.error('getSubjects error:', error);
                return [];
            }
            return data;
        }
    
        // 科目追加
        async addSubject(subject) {
            const { data, error } = await this.supabase
                .from('subjects')
                .insert([subject])
                .select();
            if (error) {
                console.error('addSubject error:', error);
                return null;
            }
            return data[0];
        }
    
        // 科目更新
        async updateSubject(id, updates) {
            const { data, error } = await this.supabase
                .from('subjects')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) {
                console.error('updateSubject error:', error);
                return null;
            }
            return data[0];
        }
    
        // 科目削除
        async deleteSubject(id) {
            const { error } = await this.supabase
                .from('subjects')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('deleteSubject error:', error);
                return false;
            }
            return true;
        }
    
        // === コース（courses）CRUD ===
    
        async getCourses(subjectId) {
            const query = this.supabase
                .from('courses')
                .select('*')
                .order('created_at');
            if (subjectId) query.eq('subject_id', subjectId);
            const { data, error } = await query;
            if (error) {
                console.error('getCourses error:', error);
                return [];
            }
            return data;
        }
    
        async addCourse(course) {
            const { data, error } = await this.supabase
                .from('courses')
                .insert([course])
                .select();
            if (error) {
                console.error('addCourse error:', error);
                return null;
            }
            return data[0];
        }
    
        async updateCourse(id, updates) {
            const { data, error } = await this.supabase
                .from('courses')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) {
                console.error('updateCourse error:', error);
                return null;
            }
            return data[0];
        }
    
        async deleteCourse(id) {
            const { error } = await this.supabase
                .from('courses')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('deleteCourse error:', error);
                return false;
            }
            return true;
        }
    
        // === レッスン（lessons）CRUD ===
    
        async getLessons(courseId) {
            const query = this.supabase
                .from('lessons')
                .select('*')
                .order('created_at');
            if (courseId) query.eq('course_id', courseId);
            const { data, error } = await query;
            if (error) {
                console.error('getLessons error:', error);
                return [];
            }
            return data;
        }
    
        async addLesson(lesson) {
            const { data, error } = await this.supabase
                .from('lessons')
                .insert([lesson])
                .select();
            if (error) {
                console.error('addLesson error:', error);
                return null;
            }
            return data[0];
        }
    
        async updateLesson(id, updates) {
            const { data, error } = await this.supabase
                .from('lessons')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) {
                console.error('updateLesson error:', error);
                return null;
            }
            return data[0];
        }
    
        async deleteLesson(id) {
            const { error } = await this.supabase
                .from('lessons')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('deleteLesson error:', error);
                return false;
            }
            return true;
        }

    // 招待の作成
    async createInvitation(invitationData) {
        try {
            const { data, error } = await this.supabase
                .from('study_invitations')
                .insert([invitationData]);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create invitation error:', error);
            return { success: false, error: error.message };
        }
    }

    // 招待の検証
    async validateInvitation(invitationCode) {
        try {
            const { data, error } = await this.supabase
                .from('study_invitations')
                .select('*')
                .eq('invitation_code', invitationCode)
                .eq('status', 'pending')
                .gt('expires_at', new Date().toISOString())
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Validate invitation error:', error);
            return { success: false, error: error.message };
        }
    }

    // 招待ステータスの更新
    async updateInvitationStatus(invitationCode, status) {
        try {
            const { data, error } = await this.supabase
                .from('study_invitations')
                .update({ 
                    status: status,
                    accepted_at: status === 'accepted' ? new Date().toISOString() : null
                })
                .eq('invitation_code', invitationCode);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update invitation status error:', error);
            return { success: false, error: error.message };
        }
    }

    // スクール一覧の取得
    async getSchools() {
        try {
            const { data, error } = await this.supabase
                .from('study_schools')
                .select('*')
                .order('name');

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get schools error:', error);
            return { success: false, error: error.message };
        }
    }

    // 受講生一覧の取得（管理者用）
    async getStudents(schoolId) {
        try {
            const { data, error } = await this.supabase
                .from('study_user_profiles')
                .select(`
                    *,
                    study_course_enrollments (
                        course_id,
                        enrolled_at,
                        study_student_progress (
                            lesson_id,
                            completed_at,
                            progress_percentage
                        )
                    )
                `)
                .eq('school_id', schoolId)
                .eq('role', 'student');

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get students error:', error);
            return { success: false, error: error.message };
        }
    }

    // メール送信（実際のメール送信APIと統合）
    async sendInvitationEmail(invitation) {
        // 実際の実装では、SendGrid、Resend、またはSupabase Edge Functionsを使用
        console.log('Sending invitation email:', invitation);
        
        // デモ用のシミュレーション
        return { success: true };
    }
}

// グローバルインスタンス
window.supabaseManager = new SupabaseManager(); 