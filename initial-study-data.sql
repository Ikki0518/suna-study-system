-- 初期データ投入スクリプト (study_ テーブル用)
-- 既存の Suna-ToDo-db に学習システムデータを追加

-- ============================================
-- 科目データの投入
-- ============================================

-- デモ学習塾の科目データ
INSERT INTO study_subjects (key, name, description, color, icon, school_id) 
SELECT 
  'japanese', '国語', '読解力・文章力・語彙力を総合的に向上させる', '#dc2626', '📚',
  id FROM study_schools WHERE name = 'デモ学習塾';

INSERT INTO study_subjects (key, name, description, color, icon, school_id) 
SELECT 
  'math', '数学', '論理的思考力と問題解決能力を育成する', '#2563eb', '🔢',
  id FROM study_schools WHERE name = 'デモ学習塾';

INSERT INTO study_subjects (key, name, description, color, icon, school_id) 
SELECT 
  'english', '英語', '4技能（読む・聞く・話す・書く）をバランスよく習得', '#059669', '🌍',
  id FROM study_schools WHERE name = 'デモ学習塾';

INSERT INTO study_subjects (key, name, description, color, icon, school_id) 
SELECT 
  'science', '理科', '科学的思考力と探究心を育む実験・観察重視の学習', '#7c3aed', '🔬',
  id FROM study_schools WHERE name = 'デモ学習塾';

INSERT INTO study_subjects (key, name, description, color, icon, school_id) 
SELECT 
  'social', '社会', '社会への理解と関心を深め、批判的思考力を養う', '#ea580c', '🌏',
  id FROM study_schools WHERE name = 'デモ学習塾';

-- ============================================
-- サンプルコースデータの投入
-- ============================================

-- 国語コース
INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '読解力向上コース', '文章を正確に読み取り、内容を理解する力を養います', 
  s.id, s.school_id, 2, 20, 1
FROM study_subjects s WHERE s.key = 'japanese';

INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '作文・小論文コース', '論理的で説得力のある文章を書く技術を身につけます', 
  s.id, s.school_id, 3, 15, 2
FROM study_subjects s WHERE s.key = 'japanese';

-- 数学コース
INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '代数基礎コース', '方程式・不等式・関数の基礎を確実に習得します', 
  s.id, s.school_id, 2, 25, 1
FROM study_subjects s WHERE s.key = 'math';

INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '幾何学入門コース', '図形の性質と証明の基礎を学びます', 
  s.id, s.school_id, 3, 20, 2
FROM study_subjects s WHERE s.key = 'math';

-- 英語コース
INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '英文法基礎コース', '英語の基本文法を体系的に学習します', 
  s.id, s.school_id, 2, 30, 1
FROM study_subjects s WHERE s.key = 'english';

INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '英語読解コース', '様々なジャンルの英文を読み解く力を養います', 
  s.id, s.school_id, 3, 25, 2
FROM study_subjects s WHERE s.key = 'english';

-- 理科コース
INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '物理基礎コース', '力学・電磁気学の基本概念を理解します', 
  s.id, s.school_id, 3, 30, 1
FROM study_subjects s WHERE s.key = 'science';

INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '化学基礎コース', '原子・分子の構造と化学反応を学びます', 
  s.id, s.school_id, 3, 28, 2
FROM study_subjects s WHERE s.key = 'science';

-- 社会コース
INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '日本史コース', '古代から現代まで日本の歴史を体系的に学習', 
  s.id, s.school_id, 2, 35, 1
FROM study_subjects s WHERE s.key = 'social';

INSERT INTO study_courses (title, description, subject_id, school_id, difficulty_level, estimated_hours, sort_order)
SELECT 
  '世界史コース', '世界各地の文明と歴史の流れを理解します', 
  s.id, s.school_id, 3, 40, 2
FROM study_subjects s WHERE s.key = 'social';

-- ============================================
-- サンプル章・講義データの投入
-- ============================================

-- 読解力向上コースの章
INSERT INTO study_chapters (title, description, course_id, sort_order)
SELECT 
  '基本的な読解技術', '文章を読む際の基本的なアプローチを学びます', 
  c.id, 1
FROM study_courses c WHERE c.title = '読解力向上コース';

INSERT INTO study_chapters (title, description, course_id, sort_order)
SELECT 
  '文章の構造分析', '文章の論理構造を把握する方法を習得します', 
  c.id, 2
FROM study_courses c WHERE c.title = '読解力向上コース';

-- 基本的な読解技術の講義
INSERT INTO study_lessons (title, description, content, chapter_id, duration_minutes, sort_order)
SELECT 
  '速読の基本テクニック', '効率的に文章を読むための基本的な技術', 
  '<h4>速読の基本</h4><p>文章を速く正確に読むためには、以下のポイントが重要です：</p><ul><li>キーワードに注目する</li><li>文章の構造を把握する</li><li>予測しながら読む</li></ul><p>これらの技術を身につけることで、読解速度と理解度の両方を向上させることができます。</p>',
  ch.id, 15, 1
FROM study_chapters ch WHERE ch.title = '基本的な読解技術';

INSERT INTO study_lessons (title, description, content, chapter_id, duration_minutes, sort_order)
SELECT 
  '要約の技術', '文章の要点を的確に抽出する方法', 
  '<h4>要約のステップ</h4><p>効果的な要約を作成するには以下の手順を踏みます：</p><ol><li>全体を通読して主題を把握</li><li>各段落の要点を抽出</li><li>重要度に応じて情報を整理</li><li>簡潔で分かりやすい文章にまとめる</li></ol><p>練習を重ねることで、短時間で的確な要約ができるようになります。</p>',
  ch.id, 20, 2
FROM study_chapters ch WHERE ch.title = '基本的な読解技術';

-- 代数基礎コースの章
INSERT INTO study_chapters (title, description, course_id, sort_order)
SELECT 
  '一次方程式', '一次方程式の解法を基礎から学習します', 
  c.id, 1
FROM study_courses c WHERE c.title = '代数基礎コース';

INSERT INTO study_chapters (title, description, course_id, sort_order)
SELECT 
  '二次方程式', '二次方程式の様々な解法を習得します', 
  c.id, 2
FROM study_courses c WHERE c.title = '代数基礎コース';

-- 一次方程式の講義
INSERT INTO study_lessons (title, description, content, chapter_id, duration_minutes, sort_order)
SELECT 
  '一次方程式の基本', '一次方程式の定義と基本的な解法', 
  '<h4>一次方程式とは</h4><p>一次方程式は ax + b = 0 の形で表される方程式です。</p><h5>解法の手順</h5><ol><li>同類項をまとめる</li><li>移項を行う</li><li>両辺を係数で割る</li></ol><p>例：2x + 3 = 7<br>2x = 7 - 3<br>2x = 4<br>x = 2</p>',
  ch.id, 25, 1
FROM study_chapters ch WHERE ch.title = '一次方程式';

INSERT INTO study_lessons (title, description, content, chapter_id, duration_minutes, sort_order)
SELECT 
  '文章題への応用', '実際の問題を一次方程式で解く方法', 
  '<h4>文章題の解き方</h4><p>文章題を方程式で解くには以下のステップを踏みます：</p><ol><li>問題文を注意深く読む</li><li>未知数を設定する</li><li>条件を方程式で表現する</li><li>方程式を解く</li><li>答えが妥当かチェックする</li></ol><p>例題：太郎君の年齢は花子さんの2倍より3歳少ない。太郎君が15歳のとき、花子さんは何歳か？</p>',
  ch.id, 30, 2
FROM study_chapters ch WHERE ch.title = '一次方程式'; 