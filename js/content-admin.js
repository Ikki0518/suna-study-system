// コース / 章 管理用共通スクリプト
(function(){
    const hierarchyKey = 'contentHierarchy';
    function loadHierarchy(){
        try{ return JSON.parse(localStorage.getItem(hierarchyKey)||'{"subjects":[]}'); }catch(e){return {subjects:[]};}
    }
    function saveHierarchy(data){ localStorage.setItem(hierarchyKey, JSON.stringify(data)); }
    function generateId(prefix){ return prefix+'-'+Date.now(); }

    const params = new URLSearchParams(location.search);
    const courseId = params.get('courseId');

    if(document.getElementById('courses-table')){
        renderCoursesPage();
    }else if(document.getElementById('chapters-table')){
        renderChaptersPage();
    }

    function renderCoursesPage(){
        const hierarchy = loadHierarchy();
        const courses=[];
        hierarchy.subjects.forEach(s=>s.courses.forEach(c=>courses.push({...c,subjectName:s.name})));

        const table=document.getElementById('courses-table');
        table.innerHTML=courses.map(c=>`<tr data-id="${c.id}"><td>${c.name}</td><td>${c.subjectName}</td></tr>`).join('')||'<tr><td>コースがありません</td></tr>';
        table.querySelectorAll('tr[data-id]').forEach(row=>{
            row.onclick=()=>location.href=`chapters-admin.html?courseId=${row.dataset.id}`;
        });
        document.getElementById('add-course-btn').onclick=()=>{
            const name=prompt('コース名');
            if(!name)return;
            const subj= hierarchy.subjects[0]||{id:generateId('subj'),name:'未分類',courses:[]};
            if(!hierarchy.subjects.length) hierarchy.subjects.push(subj);
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
            row.onclick=()=>location.href=`create-course.html?courseId=${courseId}&chapterId=${row.dataset.id}`;
        });
        document.getElementById('add-chapter-btn').onclick=()=>{
            const name=prompt('章名'); if(!name) return;
            course.chapters.push({id:generateId('chap'),name,lessons:[]});
            saveHierarchy(hierarchy);
            renderChaptersPage();
        };
    }
})(); 