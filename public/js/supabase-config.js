// ローカルストレージのsubjects/courses/lessonsをSupabaseに一括インポートする関数
async function migrateLocalSubjectsToSupabase() {
    const localSubjects = JSON.parse(localStorage.getItem('subjects') || '{}');
    if (!localSubjects || Object.keys(localSubjects).length === 0) {
        alert('ローカルストレージにsubjectsデータがありません');
        return;
    }
    const manager = window.supabaseManager;
    if (!manager) {
        alert('supabaseManagerが初期化されていません');
        return;
    }
    for (const subjectId in localSubjects) {
        const subj = localSubjects[subjectId];
        const subjectRes = await manager.addSubject({
            id: subj.id,
            name: subj.name,
            description: subj.description,
            color: subj.color,
            icon: subj.icon
        });
        if (Array.isArray(subj.courses)) {
            for (const course of subj.courses) {
                const courseRes = await manager.addCourse({
                    id: course.id,
                    subject_id: subj.id,
                    name: course.title || course.name,
                    description: course.description
                });
                if (Array.isArray(course.chapters)) {
                    for (const chapter of course.chapters) {
                        if (Array.isArray(chapter.lessons)) {
                            for (const lesson of chapter.lessons) {
                                await manager.addLesson({
                                    id: lesson.id,
                                    course_id: course.id,
                                    name: lesson.title || lesson.name,
                                    description: lesson.description,
                                    video_url: lesson.videoUrl || ''
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    alert('ローカルストレージのsubjectsデータをSupabaseに移行しました');
}
window.migrateLocalSubjectsToSupabase = migrateLocalSubjectsToSupabase;