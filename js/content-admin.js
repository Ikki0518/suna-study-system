// コース / 章 管理用共通スクリプト
(function(){
    const hierarchyKey = 'contentHierarchy';
    const categoriesKey = 'contentCategories';
    const CATEGORY_TABLE = 'study_subject_categories'; // Supabaseテーブル名

    // -------  ローカルストレージ版 -------
    function loadCategoriesLocal(){
        try{
            const data = JSON.parse(localStorage.getItem(categoriesKey));
            if(Array.isArray(data) && data.length) return data;
        }catch(e){}
        return ['未分類','小学生向け','中学生向け','高校生向け','冬季講習'];
    }

    function saveCategoriesLocal(list){
        localStorage.setItem(categoriesKey, JSON.stringify(list));
    }

    // -------  Supabase版 -------
    async function fetchCategoriesFromSupabase(){
        if(!window.supabaseManager) throw new Error('SupabaseManager not ready');
        const { data, error } = await window.supabaseManager.supabase
            .from(CATEGORY_TABLE)
            .select('name, sort_order')
            .order('sort_order', { ascending: true });
        if(error) throw error;
        return data.map(row=>row.name);
    }

    async function addCategoryToSupabase(name){
        if(!window.supabaseManager) return; // オフライン時は無視
        const { error } = await window.supabaseManager.supabase
            .from(CATEGORY_TABLE)
            .insert([{ name }]);
        if(error) console.error('Supabase カテゴリ追加失敗', error);
    }

    // -------  共通 -------
    let categories = loadCategoriesLocal();

    async function refreshCategories(){
        try{
            const remote = await fetchCategoriesFromSupabase();
            if(remote && remote.length){
                categories = remote;
                saveCategoriesLocal(categories); // ローカルにも保存しておく
            }
        }catch(err){
            console.warn('Supabaseからカテゴリ取得に失敗、ローカルを使用', err.message);
            categories = loadCategoriesLocal();
        }
    }

    function loadHierarchy(){
        try{ return JSON.parse(localStorage.getItem(hierarchyKey)||'{"subjects":[]}'); }catch(e){return {subjects:[]};}
    }
    function saveHierarchy(data){ localStorage.setItem(hierarchyKey, JSON.stringify(data)); }
    function generateId(prefix){ return prefix+'-'+Date.now(); }

    const params = new URLSearchParams(location.search);
    const courseId = params.get('courseId');

    if(document.getElementById('subjects-table')){
        // Supabaseからカテゴリをロードしてから描画
        refreshCategories().finally(()=>{
            renderSubjectsPage();
        });
    }else if(document.getElementById('courses-table')){
        renderCoursesPage();
    }else if(document.getElementById('lessons-table')){
        renderLessonsPage();
    }else if(document.getElementById('chapters-table')){
        renderChaptersPage();
    }

    function renderCoursesPage(){
        const hierarchy = loadHierarchy();

        const urlParams=new URLSearchParams(location.search);
        const subjectId=urlParams.get('subjectId');

        const courses=[];
        hierarchy.subjects.forEach(s=>{
            if(subjectId && s.id!==subjectId) return;
            s.courses.forEach(c=>courses.push({...c,subjectName:s.name,subjectId:s.id}));
        });

        const table=document.getElementById('courses-table');
        table.innerHTML=courses.map(c=>`<tr data-id="${c.id}" data-subject="${c.subjectId}"><td>${c.name}</td>${subjectId?'':`<td>${c.subjectName}</td>`}</tr>`).join('')||'<tr><td>コースがありません</td></tr>';
        table.querySelectorAll('tr[data-id]').forEach(row=>{
            row.onclick=()=>location.href=`chapters-admin.html?subjectId=${row.dataset.subject}&courseId=${row.dataset.id}`;
        });
        const addBtn=document.getElementById('add-course-btn');
        if(addBtn) addBtn.onclick=()=>{
            const name=prompt('コース名');
            if(!name)return;
            let subj;
            if(subjectId){
                subj=hierarchy.subjects.find(s=>s.id===subjectId);
                if(!subj){alert('科目が見つかりません');return;}
            }else{
                // 未分類 or 先頭
                subj= hierarchy.subjects[0]||{id:generateId('subj'),name:'未分類',courses:[]};
                if(!hierarchy.subjects.length) hierarchy.subjects.push(subj);
            }
            subj.courses.push({id:generateId('course'),name,chapters:[]});
            saveHierarchy(hierarchy);
            renderCoursesPage();
        };
    }

    function renderChaptersPage(){
        if(!courseId){ alert('courseId missing'); return; }
        const hierarchy=loadHierarchy();
        let course=null;
        hierarchy.subjects.forEach(s=>{ const c=s.courses.find(cc=>cc.id===courseId); if(c) course=c; });
        if(!course){ alert('コースが見つかりません'); history.back(); return; }
        document.getElementById('course-name').textContent=course.name;
        const table=document.getElementById('chapters-table');
        table.innerHTML=course.chapters.map(ch=>`<tr data-id="${ch.id}"><td>${ch.name}</td></tr>`).join('')||'<tr><td>章がありません</td></tr>';
        table.querySelectorAll('tr[data-id]').forEach(row=>{
            const chapId=row.dataset.id;
            row.onclick=()=>location.href=`lessons-admin.html?courseId=${courseId}&chapterId=${chapId}`;
        });
        document.getElementById('add-chapter-btn').onclick=()=>{
            const name=prompt('章名'); if(!name) return;
            course.chapters.push({id:generateId('chap'),name,lessons:[]});
            saveHierarchy(hierarchy);
            renderChaptersPage();
        };
    }

    function renderSubjectsPage(){
        const hierarchy=loadHierarchy();
        // 最新のカテゴリを取得（すでにrefreshCategoriesで反映済みだが念のため）
        categories = loadCategoriesLocal();

        const table=document.getElementById('subjects-table');
        let html='';
        categories.forEach(cat=>{
            html+=`<tr class="category-row"><th colspan="3">${cat}</th></tr>`;
            const subjectsByCat=hierarchy.subjects.filter(s=> (s.category||'未分類')===cat);
            if(subjectsByCat.length){
                html+=subjectsByCat.map(s=>`<tr data-id="${s.id}"><td>${s.name}</td><td>${s.courses.length}</td></tr>`).join('');
            }else{
                html+='<tr><td colspan="3" style="color:#6b7280;">（なし）</td></tr>';
            }
        });
        table.innerHTML=html;
        table.querySelectorAll('tr[data-id]').forEach(row=>{
            row.onclick=()=>location.href=`courses-admin.html?subjectId=${row.dataset.id}`;
        });

        document.getElementById('add-subject-btn').onclick=()=>{
            // --- 1) カテゴリ選択 ---
            categories = loadCategoriesLocal();
            const catPromptLines = categories.map((c,i)=>`${i+1}: ${c}`).join('\n');
            const catChoiceRaw = prompt(`追加する枠（カテゴリ）を選択してください:\n${catPromptLines}\n0: 新しい枠を作成`,`1`);
            if(catChoiceRaw===null) return; // キャンセル
            let selectedCategory = '';

            const catIdx = parseInt(catChoiceRaw,10);
            if(Number.isNaN(catIdx)) return alert('番号で入力してください');

            if(catIdx === 0){
                // 新規カテゴリ
                const newCat = prompt('新しい枠（カテゴリ）名を入力してください');
                if(!newCat) return;
                categories.push(newCat);
                saveCategoriesLocal(categories);
                addCategoryToSupabase(newCat);
                selectedCategory = newCat;
            }else if(catIdx > 0 && catIdx <= categories.length){
                selectedCategory = categories[catIdx-1];
            }else{
                return alert('無効な番号です');
            }

            // --- 2) 科目名入力 ---
            const name = prompt('追加する科目名を入力してください');
            if(!name) return;

            hierarchy.subjects.push({id:generateId('subj'),name,category:selectedCategory,courses:[]});
            saveHierarchy(hierarchy);
            renderSubjectsPage();
        };
    }

    function renderLessonsPage(){
        const params=new URLSearchParams(location.search);
        const courseId=params.get('courseId');
        const chapterId=params.get('chapterId');
        if(!courseId||!chapterId){alert('URL パラメータ不足');history.back();return;}

        const hierarchy=loadHierarchy();
        let course=null,chapter=null,subject=null;
        hierarchy.subjects.forEach(s=>{
            s.courses.forEach(c=>{
                if(c.id===courseId){course=c;subject=s;}
            });
        });
        if(!course){alert('コースが見つかりません');history.back();return;}
        chapter=course.chapters.find(ch=>ch.id===chapterId);
        if(!chapter){alert('章が見つかりません');history.back();return;}

        // breadcrumb & titles
        document.getElementById('breadcrumb-subject').textContent=subject.name;
        document.getElementById('breadcrumb-subject').href=`courses-admin.html?subjectId=${subject.id}`;
        document.getElementById('breadcrumb-course').textContent=course.name;
        document.getElementById('breadcrumb-course').href=`chapters-admin.html?subjectId=${subject.id}&courseId=${course.id}`;
        document.getElementById('breadcrumb-chapter').textContent=chapter.name;
        document.getElementById('chapter-name').textContent=chapter.name;

        const table=document.getElementById('lessons-table');
        const lessons=chapter.lessons||[];
        table.innerHTML= lessons.map(ls=>`<tr data-id="${ls.id}"><td>${ls.name}</td><td>${ls.status||'下書き'}</td></tr>`).join('')||'<tr><td>レッスンがありません</td></tr>';
        table.querySelectorAll('tr[data-id]').forEach(row=>{
            row.onclick=()=>location.href=`create-course.html?courseId=${courseId}&chapterId=${chapterId}&lessonId=${row.dataset.id}`;
        });

        document.getElementById('add-lesson-btn').onclick=()=>{
            const name=prompt('レッスン名'); if(!name) return;
            const newLesson={id:generateId('lesson'),name,status:'下書き'};
            chapter.lessons.push(newLesson);
            saveHierarchy(hierarchy);
            renderLessonsPage();
        };
    }
})(); 