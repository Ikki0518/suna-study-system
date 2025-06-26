-- Suna Study System Database Schema for Existing Supabase DB
-- 既存の Suna-ToDo-db との共存版

-- ============================================
-- 1. Study Schools (スクール管理)
-- ============================================
CREATE TABLE study_schools (
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
-- 2. Study User Profiles (ユーザー管理) - Supabase Authと連携
-- ============================================
CREATE TABLE study_user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'instructor', 'student')) NOT NULL DEFAULT 'student',
    school_id UUID REFERENCES study_schools(id),
    grade VARCHAR(20),
    school_division VARCHAR(20),
    tags JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active',
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Study Subjects (科目管理)
-- ============================================
CREATE TABLE study_subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    school_id UUID REFERENCES study_schools(id),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(key, school_id)
);

-- ============================================
-- 4. Study Courses (コース管理)
-- ============================================
CREATE TABLE study_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES study_subjects(id) ON DELETE CASCADE,
    school_id UUID REFERENCES study_schools(id),
    instructor_id UUID REFERENCES study_user_profiles(id),
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_hours INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. Study Chapters (章管理)
-- ============================================
CREATE TABLE study_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES study_courses(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. Study Lessons (講義管理)
-- ============================================
CREATE TABLE study_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    chapter_id UUID REFERENCES study_chapters(id) ON DELETE CASCADE,
    video_url TEXT,
    video_file_path TEXT,
    pdf_file_path TEXT,
    duration_minutes INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. Study Student Progress (学習進捗管理)
-- ============================================
CREATE TABLE study_student_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES study_user_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES study_lessons(id) ON DELETE CASCADE,
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
-- 8. Study Course Enrollments (コース受講管理)
-- ============================================
CREATE TABLE study_course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES study_user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES study_courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- ============================================
-- インデックス作成
-- ============================================
CREATE INDEX idx_study_user_profiles_school_id ON study_user_profiles(school_id);
CREATE INDEX idx_study_user_profiles_role ON study_user_profiles(role);
CREATE INDEX idx_study_subjects_school_id ON study_subjects(school_id);
CREATE INDEX idx_study_courses_subject_id ON study_courses(subject_id);
CREATE INDEX idx_study_courses_school_id ON study_courses(school_id);
CREATE INDEX idx_study_courses_instructor_id ON study_courses(instructor_id);
CREATE INDEX idx_study_chapters_course_id ON study_chapters(course_id);
CREATE INDEX idx_study_lessons_chapter_id ON study_lessons(chapter_id);
CREATE INDEX idx_study_student_progress_student_id ON study_student_progress(student_id);
CREATE INDEX idx_study_student_progress_lesson_id ON study_student_progress(lesson_id);
CREATE INDEX idx_study_course_enrollments_student_id ON study_course_enrollments(student_id);
CREATE INDEX idx_study_course_enrollments_course_id ON study_course_enrollments(course_id);

-- ============================================
-- 初期データ投入
-- ============================================
INSERT INTO study_schools (name, description, color, is_default, instructors) VALUES
('🎒 小学部', '小学生向けコース', '#fbbf24', true, '["田中先生", "佐藤先生"]'),
('📖 中学部', '中学生向けコース', '#8b5cf6', false, '["鈴木先生", "高橋先生"]'),
('🎓 高校部', '高校生向けコース', '#10b981', false, '["中村先生", "小林先生"]');

-- ============================================
-- RLS (Row Level Security) ポリシー
-- ============================================
ALTER TABLE study_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_course_enrollments ENABLE ROW LEVEL SECURITY;

-- Study Schools: 全ユーザーが読み取り可能、管理者のみ編集可能
CREATE POLICY "Study schools are viewable by everyone" ON study_schools FOR SELECT USING (true);
CREATE POLICY "Study schools are editable by admins" ON study_schools FOR ALL USING (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Study User Profiles: 自分のプロフィールは編集可能、管理者は全て閲覧可能
CREATE POLICY "Users can view own study profile" ON study_user_profiles FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'instructor')
    )
);

CREATE POLICY "Users can update own study profile" ON study_user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can insert study profiles" ON study_user_profiles FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM study_user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);