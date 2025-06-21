-- Suna Study System Database Schema for Supabase
-- 作成日: 2024年

-- ============================================
-- 1. Schools (スクール管理)
-- ============================================
CREATE TABLE schools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#ec4899',
    is_default BOOLEAN DEFAULT false,
    instructors JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. Users (ユーザー管理) - Supabase Authと連携
-- ============================================
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'instructor', 'student')) NOT NULL DEFAULT 'student',
    school_id UUID REFERENCES schools(id),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Subjects (科目管理)
-- ============================================
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL, -- 'japanese', 'math', etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    school_id UUID REFERENCES schools(id),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. Courses (コース管理)
-- ============================================
CREATE TABLE courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id),
    instructor_id UUID REFERENCES user_profiles(id),
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_hours INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. Chapters (章管理)
-- ============================================
CREATE TABLE chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. Lessons (講義管理)
-- ============================================
CREATE TABLE lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT, -- HTML/Markdown形式のテキストコンテンツ
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    video_url TEXT,
    video_file_path TEXT, -- Supabase Storageのパス
    pdf_file_path TEXT, -- 教材PDFのパス
    duration_minutes INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. Student Progress (学習進捗管理)
-- ============================================
CREATE TABLE student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    watch_time_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- ============================================
-- 8. Course Enrollments (コース受講管理)
-- ============================================
CREATE TABLE course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- ============================================
-- 9. Assignments (課題管理) - 将来の拡張用
-- ============================================
CREATE TABLE assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES user_profiles(id),
    due_date TIMESTAMP WITH TIME ZONE,
    max_score INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 10. Assignment Submissions (課題提出管理)
-- ============================================
CREATE TABLE assignment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_path TEXT, -- 提出ファイルのパス
    score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES user_profiles(id),
    UNIQUE(assignment_id, student_id)
);

-- ============================================
-- インデックス作成
-- ============================================

-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_subjects_school_id ON subjects(school_id);
CREATE INDEX idx_courses_subject_id ON courses(subject_id);
CREATE INDEX idx_courses_school_id ON courses(school_id);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_chapters_course_id ON chapters(course_id);
CREATE INDEX idx_lessons_chapter_id ON lessons(chapter_id);
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_lesson_id ON student_progress(lesson_id);
CREATE INDEX idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course_id ON course_enrollments(course_id);

-- ============================================
-- RLS (Row Level Security) ポリシー
-- ============================================

-- RLSを有効化
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Schools: 全ユーザーが読み取り可能、管理者のみ編集可能
CREATE POLICY "Schools are viewable by everyone" ON schools FOR SELECT USING (true);
CREATE POLICY "Schools are editable by admins" ON schools FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- User Profiles: 自分のプロフィールは編集可能、管理者は全て閲覧可能
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
);

CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Subjects: スクール内で共有
CREATE POLICY "Subjects viewable by school members" ON subjects FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = subjects.school_id
    )
);

-- Courses: スクール内で共有、インストラクター/管理者が編集可能
CREATE POLICY "Courses viewable by school members" ON courses FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = courses.school_id
    )
);

CREATE POLICY "Courses editable by instructors and admins" ON courses FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND school_id = courses.school_id 
        AND role IN ('admin', 'instructor')
    )
);

-- Student Progress: 学生は自分の進捗のみ、インストラクター/管理者は担当コースの進捗を閲覧
CREATE POLICY "Students can view own progress" ON student_progress FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
);

CREATE POLICY "Students can update own progress" ON student_progress FOR ALL USING (
    auth.uid() = student_id
);

-- ============================================
-- 初期データ投入
-- ============================================

-- デフォルトスクールの作成
INSERT INTO schools (name, description, color, is_default, instructors) VALUES
('デモ学習塾', 'システムデモ用の学習塾です', '#ec4899', true, '["田中先生", "佐藤先生", "山田先生"]'),
('さくら塾', '地域密着型の進学塾', '#f97316', false, '["鈴木先生", "高橋先生", "伊藤先生"]'),
('未来アカデミー', '最新の学習メソッドで未来を創る', '#3b82f6', false, '["中村先生", "小林先生", "加藤先生"]'),
('シャイニングスターズ', '一人ひとりが輝く個別指導塾', '#8b5cf6', false, '["渡辺先生", "松本先生", "木村先生"]');

-- ============================================
-- 関数とトリガー
-- ============================================

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにupdated_atトリガーを設定
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 進捗率自動計算関数
CREATE OR REPLACE FUNCTION calculate_course_progress(course_uuid UUID, student_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- コース内の総講義数を取得
    SELECT COUNT(l.id) INTO total_lessons
    FROM lessons l
    JOIN chapters c ON l.chapter_id = c.id
    WHERE c.course_id = course_uuid AND l.is_active = true;
    
    -- 完了した講義数を取得
    SELECT COUNT(sp.id) INTO completed_lessons
    FROM student_progress sp
    JOIN lessons l ON sp.lesson_id = l.id
    JOIN chapters c ON l.chapter_id = c.id
    WHERE c.course_id = course_uuid 
    AND sp.student_id = student_uuid 
    AND sp.completed = true;
    
    -- 進捗率を計算
    IF total_lessons > 0 THEN
        progress_percentage := (completed_lessons * 100) / total_lessons;
    ELSE
        progress_percentage := 0;
    END IF;
    
    -- course_enrollmentsテーブルを更新
    UPDATE course_enrollments 
    SET progress_percentage = progress_percentage,
        last_accessed_at = NOW()
    WHERE course_id = course_uuid AND student_id = student_uuid;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- 進捗更新時に自動で進捗率を計算するトリガー
CREATE OR REPLACE FUNCTION trigger_calculate_course_progress()
RETURNS TRIGGER AS $$
DECLARE
    course_uuid UUID;
BEGIN
    -- 講義が属するコースIDを取得
    SELECT c.course_id INTO course_uuid
    FROM chapters c
    JOIN lessons l ON c.id = l.chapter_id
    WHERE l.id = NEW.lesson_id;
    
    -- 進捗率を計算・更新
    PERFORM calculate_course_progress(course_uuid, NEW.student_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_progress_on_lesson_completion
    AFTER INSERT OR UPDATE ON student_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_calculate_course_progress(); 