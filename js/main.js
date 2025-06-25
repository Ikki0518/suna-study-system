// スクール管理システム - ローカルストレージから読み込み
function loadSchools() {
    const stored = localStorage.getItem('schools');
    if (stored) {
        return JSON.parse(stored);
    }
    // フォールバック用のデフォルトスクール
    return {
        'production-school': {
            id: 'production-school',
            name: 'あなたの学習塾',
            description: '質の高い教育を提供する学習塾',
            color: '#2563eb',
            instructors: ['塾長', '講師A', '講師B'],
            isDefault: true
        }
    };
}

const schools = loadSchools();

// 科目とコースデータの定義（管理者が作成するまで空の状態）
// 各スクールで異なるコンテンツを配信可能
const subjects = {
    'demo-japanese': {
        id: 'demo-japanese',
        name: '国語',
        description: '現代文・古文・漢文の総合的な学習',
        color: '#dc2626',
        icon: '📚',
        instructor: '国語担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'japanese-modern',
                title: '現代文基礎',
                description: '読解力と表現力を身につける',
                progress: 0,
                chapters: [
                    {
                        id: 'japanese-ch1',
                        title: '第1章：文章読解の基本',
                        lessons: [
                            {
                                id: 'japanese1-1',
                                title: '文章の構成と要約',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'japanese1-2',
                                title: '論説文の読み方',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'japanese1-3',
                                title: '小説の読解技法',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-classical',
                title: '古文入門',
                description: '古典文学の基礎から応用まで',
                progress: 0,
                chapters: [
                    {
                        id: 'classical-ch1',
                        title: '第1章：古文の基礎知識',
                        lessons: [
                            {
                                id: 'classical1-1',
                                title: '古文の文法基礎',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'classical1-2',
                                title: '枕草子を読む',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'classical1-3',
                                title: '源氏物語の世界',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-chinese',
                title: '漢文基礎',
                description: '漢文の読み方と古典中国文学',
                progress: 0,
                chapters: [
                    {
                        id: 'chinese-ch1',
                        title: '第1章：漢文の読み方',
                        lessons: [
                            {
                                id: 'chinese1-1',
                                title: '返り点の基礎',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'chinese1-2',
                                title: '書き下し文の作り方',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'chinese1-3',
                                title: '論語を読む',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-essay',
                title: '小論文対策',
                description: '論理的な文章の書き方をマスター',
                progress: 0,
                chapters: [
                    {
                        id: 'essay-ch1',
                        title: '第1章：小論文の基本構成',
                        lessons: [
                            {
                                id: 'essay1-1',
                                title: '序論・本論・結論の組み立て',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'essay1-2',
                                title: '論理的な文章構成',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'essay1-3',
                                title: '具体例の効果的な使い方',
                                duration: '25分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-reading',
                title: '読解応用',
                description: '入試レベルの読解力を養成',
                progress: 0,
                chapters: [
                    {
                        id: 'reading-ch1',
                        title: '第1章：応用読解技法',
                        lessons: [
                            {
                                id: 'reading1-1',
                                title: '評論文の読解',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'reading1-2',
                                title: '随筆文の読解',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'reading1-3',
                                title: '詩歌の鑑賞',
                                duration: '25分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-grammar',
                title: '現代文法',
                description: '文法の基礎から応用まで',
                progress: 0,
                chapters: [
                    {
                        id: 'grammar-ch1',
                        title: '第1章：品詞と活用',
                        lessons: [
                            {
                                id: 'grammar1-1',
                                title: '動詞の活用',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'grammar1-2',
                                title: '形容詞・形容動詞',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'grammar1-3',
                                title: '助詞・助動詞',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-creative',
                title: '創作文学',
                description: '文学作品の創作技法を学ぶ',
                progress: 0,
                chapters: [
                    {
                        id: 'creative-ch1',
                        title: '第1章：創作の基本',
                        lessons: [
                            {
                                id: 'creative1-1',
                                title: '短編小説の書き方',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'creative1-2',
                                title: '詩の創作技法',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'creative1-3',
                                title: 'エッセイの書き方',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-history',
                title: '文学史',
                description: '日本文学の歴史と変遷',
                progress: 0,
                chapters: [
                    {
                        id: 'history-ch1',
                        title: '第1章：古代から中世',
                        lessons: [
                            {
                                id: 'history1-1',
                                title: '万葉集と古今和歌集',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'history1-2',
                                title: '平安文学の世界',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'history1-3',
                                title: '鎌倉・室町の文学',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-modern-lit',
                title: '近現代文学',
                description: '明治以降の文学作品を読む',
                progress: 0,
                chapters: [
                    {
                        id: 'modern-ch1',
                        title: '第1章：明治・大正文学',
                        lessons: [
                            {
                                id: 'modern1-1',
                                title: '夏目漱石の作品',
                                duration: '45分',
                                completed: false
                            },
                            {
                                id: 'modern1-2',
                                title: '森鴎外の文学',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'modern1-3',
                                title: '芥川龍之介の短編',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'japanese-exam',
                title: '入試対策',
                description: '大学入試に向けた総合対策',
                progress: 0,
                chapters: [
                    {
                        id: 'exam-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'exam1-1',
                                title: '共通テスト対策',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'exam1-2',
                                title: '記述問題の解き方',
                                duration: '50分',
                                completed: false
                            },
                            {
                                id: 'exam1-3',
                                title: '時間配分のコツ',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-math': {
        id: 'demo-math',
        name: '数学',
        description: '基礎から応用まで体系的に学習',
        color: '#2563eb',
        icon: '🔢',
        instructor: '数学担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'math-algebra',
                title: '代数基礎',
                description: '方程式と関数の基本',
                progress: 0,
                chapters: [
                    {
                        id: 'math-ch1',
                        title: '第1章：方程式の基礎',
                        lessons: [
                            {
                                id: 'math1-1',
                                title: '一次方程式',
                                duration: '20分',
                                completed: false
                            },
                            {
                                id: 'math1-2',
                                title: '連立方程式',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'math1-3',
                                title: '一次関数',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'math1-4',
                                title: '二次方程式',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-geometry',
                title: '幾何学入門',
                description: '図形の性質と証明の基礎',
                progress: 0,
                chapters: [
                    {
                        id: 'geometry-ch1',
                        title: '第1章：平面図形の基礎',
                        lessons: [
                            {
                                id: 'geometry1-1',
                                title: '三角形の性質',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'geometry1-2',
                                title: '四角形と円',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'geometry1-3',
                                title: '証明の基本',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-calculus',
                title: '微分積分基礎',
                description: '変化率と面積の概念を理解',
                progress: 0,
                chapters: [
                    {
                        id: 'calculus-ch1',
                        title: '第1章：微分の基礎',
                        lessons: [
                            {
                                id: 'calculus1-1',
                                title: '極限の概念',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'calculus1-2',
                                title: '導関数の計算',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'calculus1-3',
                                title: '微分の応用',
                                duration: '45分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-statistics',
                title: '確率・統計入門',
                description: 'データ分析と確率の基本概念',
                progress: 0,
                chapters: [
                    {
                        id: 'statistics-ch1',
                        title: '第1章：確率の基礎',
                        lessons: [
                            {
                                id: 'statistics1-1',
                                title: '確率の基本法則',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'statistics1-2',
                                title: '平均と分散',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'statistics1-3',
                                title: 'データの可視化',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-trigonometry',
                title: '三角関数',
                description: '三角関数の性質と応用',
                progress: 0,
                chapters: [
                    {
                        id: 'trig-ch1',
                        title: '第1章：三角比の基礎',
                        lessons: [
                            {
                                id: 'trig1-1',
                                title: 'sin・cos・tanの定義',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'trig1-2',
                                title: '三角関数のグラフ',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'trig1-3',
                                title: '加法定理',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-vectors',
                title: 'ベクトル',
                description: 'ベクトルの概念と計算',
                progress: 0,
                chapters: [
                    {
                        id: 'vectors-ch1',
                        title: '第1章：平面ベクトル',
                        lessons: [
                            {
                                id: 'vectors1-1',
                                title: 'ベクトルの基本',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'vectors1-2',
                                title: '内積と外積',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'vectors1-3',
                                title: '空間ベクトル',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-sequences',
                title: '数列',
                description: '等差・等比数列と漸化式',
                progress: 0,
                chapters: [
                    {
                        id: 'sequences-ch1',
                        title: '第1章：数列の基本',
                        lessons: [
                            {
                                id: 'sequences1-1',
                                title: '等差数列',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'sequences1-2',
                                title: '等比数列',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'sequences1-3',
                                title: '漸化式',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-matrices',
                title: '行列',
                description: '行列の計算と応用',
                progress: 0,
                chapters: [
                    {
                        id: 'matrices-ch1',
                        title: '第1章：行列の基本',
                        lessons: [
                            {
                                id: 'matrices1-1',
                                title: '行列の計算',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'matrices1-2',
                                title: '逆行列',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'matrices1-3',
                                title: '連立方程式への応用',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-complex',
                title: '複素数',
                description: '複素数の概念と計算',
                progress: 0,
                chapters: [
                    {
                        id: 'complex-ch1',
                        title: '第1章：複素数の基本',
                        lessons: [
                            {
                                id: 'complex1-1',
                                title: '複素数の定義',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'complex1-2',
                                title: '複素数平面',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'complex1-3',
                                title: 'ド・モアブルの定理',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-exponential',
                title: '指数・対数関数',
                description: '指数関数と対数関数の性質',
                progress: 0,
                chapters: [
                    {
                        id: 'exponential-ch1',
                        title: '第1章：指数関数',
                        lessons: [
                            {
                                id: 'exponential1-1',
                                title: '指数法則',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'exponential1-2',
                                title: '指数関数のグラフ',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'exponential1-3',
                                title: '対数関数',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-analytic-geometry',
                title: '解析幾何',
                description: '座標平面と図形の方程式',
                progress: 0,
                chapters: [
                    {
                        id: 'analytic-ch1',
                        title: '第1章：図形と方程式',
                        lessons: [
                            {
                                id: 'analytic1-1',
                                title: '直線の方程式',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'analytic1-2',
                                title: '円の方程式',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'analytic1-3',
                                title: '楕円・双曲線・放物線',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-integration',
                title: '積分法',
                description: '積分の計算と応用',
                progress: 0,
                chapters: [
                    {
                        id: 'integration-ch1',
                        title: '第1章：不定積分',
                        lessons: [
                            {
                                id: 'integration1-1',
                                title: '基本的な積分',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'integration1-2',
                                title: '置換積分',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'integration1-3',
                                title: '部分積分',
                                duration: '45分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'math-exam-prep',
                title: '数学入試対策',
                description: '大学入試数学の総合演習',
                progress: 0,
                chapters: [
                    {
                        id: 'exam-prep-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'exam-prep1-1',
                                title: '数学IA総合演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'exam-prep1-2',
                                title: '数学IIB総合演習',
                                duration: '70分',
                                completed: false
                            },
                            {
                                id: 'exam-prep1-3',
                                title: '数学III総合演習',
                                duration: '80分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-science': {
        id: 'demo-science',
        name: '理科',
        description: '物理・化学・生物・地学の基礎',
        color: '#059669',
        icon: '🧪',
        instructor: '理科担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'science-physics',
                title: '物理基礎',
                description: '力学と電気の基本原理',
                progress: 0,
                chapters: [
                    {
                        id: 'physics-ch1',
                        title: '第1章：力学の基本',
                        lessons: [
                            {
                                id: 'physics1-1',
                                title: '運動の法則',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'physics1-2',
                                title: '力とつりあい',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'physics1-3',
                                title: '電流と電圧',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-chemistry',
                title: '化学基礎',
                description: '原子・分子から化学反応まで',
                progress: 0,
                chapters: [
                    {
                        id: 'chemistry-ch1',
                        title: '第1章：原子と分子',
                        lessons: [
                            {
                                id: 'chemistry1-1',
                                title: '原子の構造',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'chemistry1-2',
                                title: '元素の周期表',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'chemistry1-3',
                                title: '化学結合の基礎',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-biology',
                title: '生物基礎',
                description: '生命現象の仕組みを理解する',
                progress: 0,
                chapters: [
                    {
                        id: 'biology-ch1',
                        title: '第1章：細胞の構造と機能',
                        lessons: [
                            {
                                id: 'biology1-1',
                                title: '細胞の基本構造',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'biology1-2',
                                title: 'DNA と遺伝',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'biology1-3',
                                title: '生態系と環境',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-earth',
                title: '地学基礎',
                description: '地球と宇宙の科学',
                progress: 0,
                chapters: [
                    {
                        id: 'earth-ch1',
                        title: '第1章：地球の構造',
                        lessons: [
                            {
                                id: 'earth1-1',
                                title: '地球の内部構造',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'earth1-2',
                                title: '天気と気象',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'earth1-3',
                                title: '太陽系と惑星',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-advanced-physics',
                title: '物理',
                description: '力学・電磁気・波動・熱力学',
                progress: 0,
                chapters: [
                    {
                        id: 'advanced-physics-ch1',
                        title: '第1章：力学の応用',
                        lessons: [
                            {
                                id: 'advanced-physics1-1',
                                title: '円運動と万有引力',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'advanced-physics1-2',
                                title: '単振動と波動',
                                duration: '45分',
                                completed: false
                            },
                            {
                                id: 'advanced-physics1-3',
                                title: '電磁気学基礎',
                                duration: '50分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-advanced-chemistry',
                title: '化学',
                description: '無機・有機・物理化学の基礎',
                progress: 0,
                chapters: [
                    {
                        id: 'advanced-chemistry-ch1',
                        title: '第1章：無機化学',
                        lessons: [
                            {
                                id: 'advanced-chemistry1-1',
                                title: '典型元素の性質',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'advanced-chemistry1-2',
                                title: '遷移元素と錯体',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'advanced-chemistry1-3',
                                title: '酸化還元反応',
                                duration: '45分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-organic-chemistry',
                title: '有機化学',
                description: '炭素化合物の構造と反応',
                progress: 0,
                chapters: [
                    {
                        id: 'organic-ch1',
                        title: '第1章：炭化水素',
                        lessons: [
                            {
                                id: 'organic1-1',
                                title: 'アルカンとアルケン',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'organic1-2',
                                title: 'ベンゼンと芳香族化合物',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'organic1-3',
                                title: '官能基の反応',
                                duration: '45分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-advanced-biology',
                title: '生物',
                description: '生命現象の詳細なメカニズム',
                progress: 0,
                chapters: [
                    {
                        id: 'advanced-biology-ch1',
                        title: '第1章：分子生物学',
                        lessons: [
                            {
                                id: 'advanced-biology1-1',
                                title: 'タンパク質の構造と機能',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'advanced-biology1-2',
                                title: '遺伝子発現の調節',
                                duration: '45分',
                                completed: false
                            },
                            {
                                id: 'advanced-biology1-3',
                                title: '細胞分裂と減数分裂',
                                duration: '50分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-genetics',
                title: '遺伝学',
                description: '遺伝の法則とバイオテクノロジー',
                progress: 0,
                chapters: [
                    {
                        id: 'genetics-ch1',
                        title: '第1章：メンデルの法則',
                        lessons: [
                            {
                                id: 'genetics1-1',
                                title: '優性・劣性の法則',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'genetics1-2',
                                title: '連鎖と組換え',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'genetics1-3',
                                title: 'PCRとDNA解析',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-ecology',
                title: '生態学',
                description: '生物と環境の相互作用',
                progress: 0,
                chapters: [
                    {
                        id: 'ecology-ch1',
                        title: '第1章：個体群と群集',
                        lessons: [
                            {
                                id: 'ecology1-1',
                                title: '個体群の動態',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'ecology1-2',
                                title: '食物連鎖と食物網',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'ecology1-3',
                                title: '生物多様性と保全',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-astronomy',
                title: '天文学',
                description: '宇宙の構造と進化',
                progress: 0,
                chapters: [
                    {
                        id: 'astronomy-ch1',
                        title: '第1章：恒星の進化',
                        lessons: [
                            {
                                id: 'astronomy1-1',
                                title: '星の誕生と死',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'astronomy1-2',
                                title: '銀河系と銀河',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'astronomy1-3',
                                title: 'ビッグバン理論',
                                duration: '45分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-geology',
                title: '地質学',
                description: '地球の歴史と岩石',
                progress: 0,
                chapters: [
                    {
                        id: 'geology-ch1',
                        title: '第1章：岩石と鉱物',
                        lessons: [
                            {
                                id: 'geology1-1',
                                title: '火成岩・堆積岩・変成岩',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'geology1-2',
                                title: '地層と化石',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'geology1-3',
                                title: 'プレートテクトニクス',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-meteorology',
                title: '気象学',
                description: '大気現象と気候変動',
                progress: 0,
                chapters: [
                    {
                        id: 'meteorology-ch1',
                        title: '第1章：大気の構造',
                        lessons: [
                            {
                                id: 'meteorology1-1',
                                title: '大気の層構造',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'meteorology1-2',
                                title: '低気圧と高気圧',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'meteorology1-3',
                                title: '気候変動の仕組み',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'science-exam-prep',
                title: '理科入試対策',
                description: '大学入試理科の総合演習',
                progress: 0,
                chapters: [
                    {
                        id: 'science-exam-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'science-exam1-1',
                                title: '物理総合演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'science-exam1-2',
                                title: '化学総合演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'science-exam1-3',
                                title: '生物総合演習',
                                duration: '60分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-social': {
        id: 'demo-social',
        name: '社会',
        description: '地理・歴史・公民の総合学習',
        color: '#d97706',
        icon: '🏛️',
        instructor: '社会担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'social-geography',
                title: '地理基礎',
                description: '日本と世界の地理',
                progress: 0,
                chapters: [
                    {
                        id: 'geography-ch1',
                        title: '第1章：日本の自然環境',
                        lessons: [
                            {
                                id: 'geo1-1',
                                title: '日本の地形と気候',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'geo1-2',
                                title: '世界の気候区分',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'geo1-3',
                                title: '産業と貿易',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-civics',
                title: '公民・政治経済',
                description: '現代社会の仕組みと政治経済の基礎',
                progress: 0,
                chapters: [
                    {
                        id: 'civics-ch1',
                        title: '第1章：現代社会の特色',
                        lessons: [
                            {
                                id: 'civics1-1',
                                title: '民主主義と人権',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'civics1-2',
                                title: '日本国憲法の基本原理',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'civics1-3',
                                title: '市場経済の仕組み',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-japanese-history',
                title: '日本史概観',
                description: '古代から現代までの日本史の流れ',
                progress: 0,
                chapters: [
                    {
                        id: 'jpnhistory-ch1',
                        title: '第1章：古代から中世へ',
                        lessons: [
                            {
                                id: 'jpnhistory1-1',
                                title: '縄文・弥生・古墳時代',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jpnhistory1-2',
                                title: '飛鳥・奈良時代',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jpnhistory1-3',
                                title: '平安時代の文化',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-world-geography',
                title: '世界地理',
                description: '世界各地の自然環境と文化',
                progress: 0,
                chapters: [
                    {
                        id: 'world-geo-ch1',
                        title: '第1章：アジア・オセアニア',
                        lessons: [
                            {
                                id: 'world-geo1-1',
                                title: '東アジアの地理',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'world-geo1-2',
                                title: '東南アジアの地理',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'world-geo1-3',
                                title: 'オセアニアの地理',
                                duration: '25分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-world-history',
                title: '世界史',
                description: '古代から現代までの世界の歴史',
                progress: 0,
                chapters: [
                    {
                        id: 'world-history-ch1',
                        title: '第1章：古代文明',
                        lessons: [
                            {
                                id: 'world-history1-1',
                                title: 'メソポタミア文明',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'world-history1-2',
                                title: 'エジプト文明',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'world-history1-3',
                                title: 'ギリシャ・ローマ文明',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-economics',
                title: '経済学基礎',
                description: '市場経済と経済理論の基礎',
                progress: 0,
                chapters: [
                    {
                        id: 'economics-ch1',
                        title: '第1章：需要と供給',
                        lessons: [
                            {
                                id: 'economics1-1',
                                title: '市場メカニズム',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'economics1-2',
                                title: '価格決定理論',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'economics1-3',
                                title: 'マクロ経済学入門',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-law',
                title: '法学入門',
                description: '法の基本概念と日本の法制度',
                progress: 0,
                chapters: [
                    {
                        id: 'law-ch1',
                        title: '第1章：法の基本概念',
                        lessons: [
                            {
                                id: 'law1-1',
                                title: '法とは何か',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'law1-2',
                                title: '憲法の基本原理',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'law1-3',
                                title: '民法と刑法の基礎',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-politics',
                title: '政治学',
                description: '政治制度と政治思想',
                progress: 0,
                chapters: [
                    {
                        id: 'politics-ch1',
                        title: '第1章：民主主義理論',
                        lessons: [
                            {
                                id: 'politics1-1',
                                title: '代議制民主主義',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'politics1-2',
                                title: '政党政治',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'politics1-3',
                                title: '国際政治の基礎',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-philosophy',
                title: '倫理・哲学',
                description: '西洋・東洋思想と現代の倫理問題',
                progress: 0,
                chapters: [
                    {
                        id: 'philosophy-ch1',
                        title: '第1章：古代ギリシャ哲学',
                        lessons: [
                            {
                                id: 'philosophy1-1',
                                title: 'ソクラテス・プラトン・アリストテレス',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'philosophy1-2',
                                title: '東洋思想の基礎',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'philosophy1-3',
                                title: '現代倫理学',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-anthropology',
                title: '文化人類学',
                description: '人間の文化と社会の多様性',
                progress: 0,
                chapters: [
                    {
                        id: 'anthropology-ch1',
                        title: '第1章：文化の概念',
                        lessons: [
                            {
                                id: 'anthropology1-1',
                                title: '文化相対主義',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'anthropology1-2',
                                title: '社会の構造と機能',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'anthropology1-3',
                                title: 'グローバル化と文化',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-sociology',
                title: '社会学',
                description: '現代社会の構造と変動',
                progress: 0,
                chapters: [
                    {
                        id: 'sociology-ch1',
                        title: '第1章：社会学の基礎概念',
                        lessons: [
                            {
                                id: 'sociology1-1',
                                title: '社会階層と社会移動',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'sociology1-2',
                                title: '都市化と情報化',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'sociology1-3',
                                title: '家族と教育の社会学',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-international',
                title: '国際関係論',
                description: '国際政治と外交の基礎',
                progress: 0,
                chapters: [
                    {
                        id: 'international-ch1',
                        title: '第1章：国際システム',
                        lessons: [
                            {
                                id: 'international1-1',
                                title: '主権国家システム',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'international1-2',
                                title: '国際機構の役割',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'international1-3',
                                title: '外交と安全保障',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'social-exam-prep',
                title: '社会科入試対策',
                description: '大学入試社会科の総合演習',
                progress: 0,
                chapters: [
                    {
                        id: 'social-exam-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'social-exam1-1',
                                title: '地理総合演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'social-exam1-2',
                                title: '歴史総合演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'social-exam1-3',
                                title: '公民総合演習',
                                duration: '60分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-japanese-history': {
        id: 'demo-japanese-history',
        name: '日本史',
        description: '古代から現代までの日本の歴史',
        color: '#7c3aed',
        icon: '🏯',
        instructor: '日本史担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'jhistory-ancient',
                title: '古代・中世の日本',
                description: '奈良時代から鎌倉・室町時代まで',
                progress: 0,
                chapters: [
                    {
                        id: 'jhistory-ch1',
                        title: '第1章：古代国家の成立',
                        lessons: [
                            {
                                id: 'jhistory1-1',
                                title: '奈良時代と平安時代',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jhistory1-2',
                                title: '鎌倉幕府の成立',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'jhistory1-3',
                                title: '室町時代と戦国時代',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-early-modern',
                title: '近世日本の発展',
                description: '戦国時代から江戸時代まで',
                progress: 0,
                chapters: [
                    {
                        id: 'jhistory-modern-ch1',
                        title: '第1章：戦国時代の統一',
                        lessons: [
                            {
                                id: 'jhistory-modern1-1',
                                title: '織田信長の革新',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jhistory-modern1-2',
                                title: '豊臣秀吉の天下統一',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jhistory-modern1-3',
                                title: '徳川幕府の成立',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-modern',
                title: '近現代日本史',
                description: '明治維新から現代まで',
                progress: 0,
                chapters: [
                    {
                        id: 'jhistory-modern2-ch1',
                        title: '第1章：明治維新と近代化',
                        lessons: [
                            {
                                id: 'jhistory-modern2-1',
                                title: '黒船来航と開国',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'jhistory-modern2-2',
                                title: '明治維新の改革',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jhistory-modern2-3',
                                title: '大正デモクラシー',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-cultural',
                title: '日本文化史',
                description: '日本の文化と芸術の発展',
                progress: 0,
                chapters: [
                    {
                        id: 'jculture-ch1',
                        title: '第1章：古代から中世の文化',
                        lessons: [
                            {
                                id: 'jculture1-1',
                                title: '仏教文化の伝来',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jculture1-2',
                                title: '平安時代の国風文化',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'jculture1-3',
                                title: '鎌倉・室町文化',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-economic',
                title: '日本経済史',
                description: '日本の経済発展の歩み',
                progress: 0,
                chapters: [
                    {
                        id: 'jeconomic-ch1',
                        title: '第1章：近世商業の発展',
                        lessons: [
                            {
                                id: 'jeconomic1-1',
                                title: '商業と手工業の発達',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jeconomic1-2',
                                title: '明治維新と資本主義',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jeconomic1-3',
                                title: '戦後復興と高度成長',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-social',
                title: '日本社会史',
                description: '庶民生活と社会構造の変遷',
                progress: 0,
                chapters: [
                    {
                        id: 'jsocial-ch1',
                        title: '第1章：身分制社会',
                        lessons: [
                            {
                                id: 'jsocial1-1',
                                title: '律令制と貴族社会',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jsocial1-2',
                                title: '武士の台頭',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jsocial1-3',
                                title: '江戸時代の身分制',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-women',
                title: '日本女性史',
                description: '女性の地位と役割の変化',
                progress: 0,
                chapters: [
                    {
                        id: 'jwomen-ch1',
                        title: '第1章：古代から近世の女性',
                        lessons: [
                            {
                                id: 'jwomen1-1',
                                title: '古代の女性と権力',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jwomen1-2',
                                title: '平安貴族女性の文学',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jwomen1-3',
                                title: '近現代女性の社会進出',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-diplomacy',
                title: '日本外交史',
                description: '日本の対外関係の変遷',
                progress: 0,
                chapters: [
                    {
                        id: 'jdiplomacy-ch1',
                        title: '第1章：古代から近世の外交',
                        lessons: [
                            {
                                id: 'jdiplomacy1-1',
                                title: '遣唐使と遣隋使',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jdiplomacy1-2',
                                title: '鎖国政策',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jdiplomacy1-3',
                                title: '明治外交と不平等条約',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-regional',
                title: '地域史研究',
                description: '地方の歴史と特色',
                progress: 0,
                chapters: [
                    {
                        id: 'jregional-ch1',
                        title: '第1章：関東地方の歴史',
                        lessons: [
                            {
                                id: 'jregional1-1',
                                title: '鎌倉幕府と関東武士',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'jregional1-2',
                                title: '江戸の発展',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'jregional1-3',
                                title: '関西の歴史と文化',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'jhistory-exam',
                title: '日本史入試対策',
                description: '大学入試日本史の総合演習',
                progress: 0,
                chapters: [
                    {
                        id: 'jhistory-exam-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'jhistory-exam1-1',
                                title: '古代・中世史演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'jhistory-exam1-2',
                                title: '近世史演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'jhistory-exam1-3',
                                title: '近現代史演習',
                                duration: '60分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-world-history': {
        id: 'demo-world-history',
        name: '世界史',
        description: '古代文明から現代史まで',
        color: '#be185d',
        icon: '🌍',
        instructor: '世界史担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'whistory-ancient',
                title: '古代文明',
                description: '四大文明と古代帝国',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-ch1',
                        title: '第1章：文明の起源',
                        lessons: [
                            {
                                id: 'whistory1-1',
                                title: '四大文明の特徴',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory1-2',
                                title: 'ギリシア・ローマ文明',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory1-3',
                                title: '中国古代王朝',
                                duration: '28分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-medieval',
                title: '中世ヨーロッパ史',
                description: 'フランク王国から十字軍まで',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-medieval-ch1',
                        title: '第1章：中世ヨーロッパの成立',
                        lessons: [
                            {
                                id: 'whistory-medieval1-1',
                                title: 'フランク王国の発展',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory-medieval1-2',
                                title: '封建制度の確立',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-medieval1-3',
                                title: '十字軍とその影響',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-early-modern',
                title: '大航海時代と絶対王政',
                description: 'ルネサンスから市民革命まで',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-early-modern-ch1',
                        title: '第1章：大航海時代',
                        lessons: [
                            {
                                id: 'whistory-early-modern1-1',
                                title: 'ルネサンスと地理上の発見',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-early-modern1-2',
                                title: '絶対王政の確立',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory-early-modern1-3',
                                title: '宗教改革の展開',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-modern',
                title: '近現代世界史',
                description: '産業革命から現代グローバル化まで',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-modern-ch1',
                        title: '第1章：市民革命と産業革命',
                        lessons: [
                            {
                                id: 'whistory-modern1-1',
                                title: 'イギリス産業革命',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory-modern1-2',
                                title: 'フランス革命とナポレオン',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'whistory-modern1-3',
                                title: '帝国主義と植民地支配',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-asian',
                title: 'アジア史',
                description: '中国・インド・東南アジアの歴史',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-asian-ch1',
                        title: '第1章：中国王朝史',
                        lessons: [
                            {
                                id: 'whistory-asian1-1',
                                title: '秦・漢帝国の統一',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-asian1-2',
                                title: '唐・宋時代の文化',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'whistory-asian1-3',
                                title: '明・清朝の発展',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-islamic',
                title: 'イスラーム史',
                description: 'イスラーム世界の成立と発展',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-islamic-ch1',
                        title: '第1章：イスラーム教の誕生',
                        lessons: [
                            {
                                id: 'whistory-islamic1-1',
                                title: 'ムハンマドと初期イスラーム',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory-islamic1-2',
                                title: 'ウマイヤ朝とアッバース朝',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-islamic1-3',
                                title: 'オスマン帝国の隆盛',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-american',
                title: 'アメリカ史',
                description: '新大陸発見から現代アメリカまで',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-american-ch1',
                        title: '第1章：植民地時代',
                        lessons: [
                            {
                                id: 'whistory-american1-1',
                                title: 'ヨーロッパ人の新大陸到達',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory-american1-2',
                                title: 'アメリカ独立革命',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-american1-3',
                                title: '南北戦争と西部開拓',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-african',
                title: 'アフリカ史',
                description: 'アフリカ大陸の歴史と文明',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-african-ch1',
                        title: '第1章：古代アフリカ文明',
                        lessons: [
                            {
                                id: 'whistory-african1-1',
                                title: 'エジプト文明とヌビア',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-african1-2',
                                title: 'サハラ交易とマリ王国',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'whistory-african1-3',
                                title: '植民地化と独立運動',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-wars',
                title: '戦争史',
                description: '世界大戦と近現代の戦争',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-wars-ch1',
                        title: '第1章：第一次世界大戦',
                        lessons: [
                            {
                                id: 'whistory-wars1-1',
                                title: '大戦勃発の背景',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-wars1-2',
                                title: '第二次世界大戦',
                                duration: '45分',
                                completed: false
                            },
                            {
                                id: 'whistory-wars1-3',
                                title: '冷戦の始まり',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-economics',
                title: '世界経済史',
                description: '資本主義の発展と世界経済',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-economics-ch1',
                        title: '第1章：重商主義から自由主義へ',
                        lessons: [
                            {
                                id: 'whistory-economics1-1',
                                title: '産業革命と資本主義',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-economics1-2',
                                title: '世界恐慌とニューディール',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'whistory-economics1-3',
                                title: 'グローバル経済の形成',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-culture',
                title: '世界文化史',
                description: '芸術・思想・科学の発展',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-culture-ch1',
                        title: '第1章：ルネサンスと啓蒙思想',
                        lessons: [
                            {
                                id: 'whistory-culture1-1',
                                title: 'ルネサンス芸術',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'whistory-culture1-2',
                                title: '科学革命と啓蒙思想',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'whistory-culture1-3',
                                title: '19世紀の文化と思想',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'whistory-exam',
                title: '世界史入試対策',
                description: '大学入試世界史の総合演習',
                progress: 0,
                chapters: [
                    {
                        id: 'whistory-exam-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'whistory-exam1-1',
                                title: '古代・中世史演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'whistory-exam1-2',
                                title: '近世史演習',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'whistory-exam1-3',
                                title: '近現代史演習',
                                duration: '60分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'demo-english': {
        id: 'demo-english',
        name: '英語',
        description: '基礎から応用まで総合的な英語力向上',
        color: '#dc2626',
        icon: '🌐',
        instructor: '英語担当',
        schoolId: 'production-school',
        courses: [
            {
                id: 'english-grammar',
                title: '英文法基礎',
                description: '基本的な英文法の理解',
                progress: 0,
                chapters: [
                    {
                        id: 'grammar-ch1',
                        title: '第1章：品詞と文型',
                        lessons: [
                            {
                                id: 'grammar1-1',
                                title: '名詞・代名詞・形容詞',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'grammar1-2',
                                title: '動詞と時制',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'grammar1-3',
                                title: '5つの基本文型',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-reading',
                title: '英語読解',
                description: '英文読解力の向上',
                progress: 0,
                chapters: [
                    {
                        id: 'reading-ch1',
                        title: '第1章：基本的な読解技法',
                        lessons: [
                            {
                                id: 'reading1-1',
                                title: 'パラグラフリーディング',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'reading1-2',
                                title: '速読のコツ',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'reading1-3',
                                title: '要約と論理展開',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-listening',
                title: 'リスニング',
                description: '英語聞き取り能力の向上',
                progress: 0,
                chapters: [
                    {
                        id: 'listening-ch1',
                        title: '第1章：基本的な聞き取り',
                        lessons: [
                            {
                                id: 'listening1-1',
                                title: '音の変化を理解する',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'listening1-2',
                                title: '会話の聞き取り',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'listening1-3',
                                title: '長文の聞き取り',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-writing',
                title: '英作文',
                description: '英語での表現力向上',
                progress: 0,
                chapters: [
                    {
                        id: 'writing-ch1',
                        title: '第1章：基本的な英作文',
                        lessons: [
                            {
                                id: 'writing1-1',
                                title: '和文英訳の基本',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'writing1-2',
                                title: '自由英作文',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'writing1-3',
                                title: 'エッセイの書き方',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-vocabulary',
                title: '語彙力強化',
                description: '効率的な単語学習法',
                progress: 0,
                chapters: [
                    {
                        id: 'vocabulary-ch1',
                        title: '第1章：基本語彙',
                        lessons: [
                            {
                                id: 'vocabulary1-1',
                                title: '高校基本単語',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'vocabulary1-2',
                                title: '語根・接頭辞・接尾辞',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'vocabulary1-3',
                                title: 'イディオム・熟語',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-conversation',
                title: '英会話',
                description: '実践的な英語コミュニケーション',
                progress: 0,
                chapters: [
                    {
                        id: 'conversation-ch1',
                        title: '第1章：日常会話',
                        lessons: [
                            {
                                id: 'conversation1-1',
                                title: '自己紹介と挨拶',
                                duration: '20分',
                                completed: false
                            },
                            {
                                id: 'conversation1-2',
                                title: '趣味や興味について',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'conversation1-3',
                                title: '意見を述べる',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-pronunciation',
                title: '発音・音読',
                description: '正しい英語の発音',
                progress: 0,
                chapters: [
                    {
                        id: 'pronunciation-ch1',
                        title: '第1章：発音の基礎',
                        lessons: [
                            {
                                id: 'pronunciation1-1',
                                title: '母音の発音',
                                duration: '25分',
                                completed: false
                            },
                            {
                                id: 'pronunciation1-2',
                                title: '子音の発音',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'pronunciation1-3',
                                title: 'アクセントとイントネーション',
                                duration: '35分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-literature',
                title: '英文学',
                description: '英語圏の文学作品',
                progress: 0,
                chapters: [
                    {
                        id: 'literature-ch1',
                        title: '第1章：英文学の基礎',
                        lessons: [
                            {
                                id: 'literature1-1',
                                title: 'シェイクスピア入門',
                                duration: '40分',
                                completed: false
                            },
                            {
                                id: 'literature1-2',
                                title: '19世紀英文学',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'literature1-3',
                                title: '現代英文学',
                                duration: '30分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-business',
                title: 'ビジネス英語',
                description: '実務で使える英語',
                progress: 0,
                chapters: [
                    {
                        id: 'business-ch1',
                        title: '第1章：ビジネス基礎',
                        lessons: [
                            {
                                id: 'business1-1',
                                title: 'ビジネスメール',
                                duration: '30分',
                                completed: false
                            },
                            {
                                id: 'business1-2',
                                title: 'プレゼンテーション',
                                duration: '35分',
                                completed: false
                            },
                            {
                                id: 'business1-3',
                                title: '会議での英語',
                                duration: '40分',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            {
                id: 'english-exam',
                title: '英語入試対策',
                description: '大学入試英語の総合演習',
                progress: 0,
                chapters: [
                    {
                        id: 'english-exam-ch1',
                        title: '第1章：入試問題演習',
                        lessons: [
                            {
                                id: 'english-exam1-1',
                                title: '共通テスト対策',
                                duration: '60分',
                                completed: false
                            },
                            {
                                id: 'english-exam1-2',
                                title: '私立大学対策',
                                duration: '70分',
                                completed: false
                            },
                            {
                                id: 'english-exam1-3',
                                title: '国立大学対策',
                                duration: '80分',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// 旧coursesデータを削除し、新しい構造に対応
// const courses = []; // この行を削除

// レッスンの詳細コンテンツ
const lessonContents = {
    'japanese1-1': {
        title: '文章の構成と要約',
        videoUrl: 'videos/japanese-composition.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>この講義では、文章の基本的な構成を理解し、要約する技術を身につけます。</p>
            </div>

            <h4>文章の基本構成</h4>
            <div class="composition-elements">
                <div class="element">
                    <h5>1. 序論（はじめ）</h5>
                    <p>文章の目的や論点を提示する部分です。読み手の興味を引き、これから何について述べるかを明確にします。</p>
                </div>
                <div class="element">
                    <h5>2. 本論（なか）</h5>
                    <p>具体的な内容を展開する部分です。根拠や例を示しながら、論点を詳しく説明します。</p>
                </div>
                <div class="element">
                    <h5>3. 結論（おわり）</h5>
                    <p>文章全体をまとめ、結論を示す部分です。読み手に印象を残す重要な役割があります。</p>
                </div>
            </div>

            <h4>要約のポイント</h4>
            <ul>
                <li><strong>主題を把握する</strong>：文章で最も伝えたいことは何か</li>
                <li><strong>重要な部分を見つける</strong>：キーワードや重要な文を特定</li>
                <li><strong>不要な部分を削る</strong>：具体例や詳細説明は省略</li>
                <li><strong>自分の言葉で表現</strong>：原文をそのまま写すのではなく言い換える</li>
            </ul>
        `
    },
    'math1-1': {
        title: '一次方程式',
        videoUrl: 'videos/math-linear-equation.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>一次方程式の基本的な解き方を学習します。未知数を求める重要な技術です。</p>
            </div>

            <h4>一次方程式とは</h4>
            <p>文字（未知数）を1つ含み、その文字の最高次数が1である方程式のことです。</p>
            <p>例：2x + 5 = 11</p>

            <h4>基本的な解き方</h4>
            <div class="math-steps">
                <div class="step">
                    <h5>ステップ1：移項</h5>
                    <p>等号を挟んで項を移動する際は、符号を変えます。</p>
                    <p>2x + 5 = 11<br>2x = 11 - 5<br>2x = 6</p>
                </div>
                <div class="step">
                    <h5>ステップ2：両辺を同じ数で割る</h5>
                    <p>係数で両辺を割って、xの値を求めます。</p>
                    <p>2x = 6<br>x = 6 ÷ 2<br>x = 3</p>
                </div>
            </div>

            <h4>検算</h4>
            <p>求めた解を元の式に代入して確認します。</p>
            <p>2 × 3 + 5 = 6 + 5 = 11 ✓</p>
        `
    },
    'physics1-1': {
        title: '運動の法則',
        videoUrl: 'videos/physics-motion.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>物体の運動を理解するための基本法則を学習します。</p>
            </div>

            <h4>ニュートンの運動法則</h4>
            <div class="physics-laws">
                <div class="law">
                    <h5>第1法則（慣性の法則）</h5>
                    <p>物体は、外から力を加えられない限り、静止している物体は静止し続け、運動している物体は等速直線運動を続けます。</p>
                </div>
                <div class="law">
                    <h5>第2法則（運動の法則）</h5>
                    <p>物体の加速度は、作用する力に比例し、質量に反比例します。</p>
                    <p><strong>F = ma</strong></p>
                    <p>F：力[N]、m：質量[kg]、a：加速度[m/s²]</p>
                </div>
                <div class="law">
                    <h5>第3法則（作用・反作用の法則）</h5>
                    <p>物体Aが物体Bに力を加えると、物体Bも物体Aに同じ大きさで逆向きの力を加えます。</p>
                </div>
            </div>

            <h4>具体例</h4>
            <ul>
                <li><strong>慣性</strong>：電車が急停車すると体が前に傾く</li>
                <li><strong>運動の法則</strong>：重い物は動かしにくい</li>
                <li><strong>作用・反作用</strong>：歩くときは地面を押し、地面が足を押し返す</li>
            </ul>
        `
    },
    'geo1-1': {
        title: '日本の地形と気候',
        videoUrl: 'videos/geography-japan.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>日本列島の地形的特徴と気候の特色について学習します。</p>
            </div>

            <h4>日本の地形</h4>
            <div class="geography-features">
                <div class="feature">
                    <h5>山地の特徴</h5>
                    <p>日本の面積の約75％を山地が占めています。主要な山脈：</p>
                    <ul>
                        <li><strong>日本アルプス</strong>：飛騨・木曽・赤石山脈</li>
                        <li><strong>中国山地</strong>：本州西部の山地</li>
                        <li><strong>九州山地</strong>：九州中央部の山地</li>
                    </ul>
                </div>
                <div class="feature">
                    <h5>平野の特徴</h5>
                    <p>人口が集中し、農業や工業が発達しています。主要な平野：</p>
                    <ul>
                        <li><strong>関東平野</strong>：日本最大の平野</li>
                        <li><strong>濃尾平野</strong>：愛知県・岐阜県</li>
                        <li><strong>大阪平野</strong>：近畿地方の中心</li>
                    </ul>
                </div>
            </div>

            <h4>日本の気候</h4>
            <div class="climate-zones">
                <div class="zone">
                    <h5>温帯湿潤気候</h5>
                    <p>本州・四国・九州の大部分。四季がはっきりしており、梅雨と台風の影響を受けます。</p>
                </div>
                <div class="zone">
                    <h5>亜寒帯気候</h5>
                    <p>北海道の大部分。冬は長く厳しく、夏は短く涼しいのが特徴です。</p>
                </div>
            </div>
        `
    },
    'jhistory1-1': {
        title: '奈良時代と平安時代',
        videoUrl: 'videos/history-nara-heian.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>奈良時代から平安時代にかけての政治・文化の変化を学習します。</p>
            </div>

            <h4>奈良時代（710-794年）</h4>
            <div class="historical-period">
                <div class="politics">
                    <h5>政治</h5>
                    <ul>
                        <li><strong>律令制</strong>：中国にならった政治制度</li>
                        <li><strong>平城京</strong>：日本初の本格的な都城</li>
                        <li><strong>聖武天皇</strong>：東大寺・大仏を建立</li>
                    </ul>
                </div>
                <div class="culture">
                    <h5>文化</h5>
                    <ul>
                        <li><strong>天平文化</strong>：仏教中心の国際的文化</li>
                        <li><strong>正倉院</strong>：宝物の保管庫</li>
                        <li><strong>万葉集</strong>：日本最古の歌集</li>
                    </ul>
                </div>
            </div>

            <h4>平安時代（794-1185年）</h4>
            <div class="historical-period">
                <div class="politics">
                    <h5>政治</h5>
                    <ul>
                        <li><strong>平安京</strong>：京都に遷都</li>
                        <li><strong>摂関政治</strong>：藤原氏による政治</li>
                        <li><strong>院政</strong>：上皇による政治</li>
                    </ul>
                </div>
                <div class="culture">
                    <h5>文化</h5>
                    <ul>
                        <li><strong>国風文化</strong>：日本独自の文化</li>
                        <li><strong>ひらがな・カタカナ</strong>：日本の文字</li>
                        <li><strong>源氏物語</strong>：紫式部による世界最古の長編小説</li>
                    </ul>
                </div>
            </div>
        `
    },
    'whistory1-1': {
        title: '四大文明の特徴',
        videoUrl: 'videos/world-history-civilizations.mp4',
        textContent: `
            <div class="lesson-intro">
                <p>人類最初の文明である四大文明の特徴と発展について学習します。</p>
            </div>

            <h4>四大文明とは</h4>
            <p>紀元前3500年頃から紀元前2500年頃にかけて、大河のほとりで発達した4つの古代文明です。</p>

            <div class="civilizations">
                <div class="civilization">
                    <h5>メソポタミア文明（チグリス・ユーフラテス川）</h5>
                    <ul>
                        <li><strong>楔形文字</strong>：世界最古の文字</li>
                        <li><strong>ハンムラビ法典</strong>：成文法の始まり</li>
                        <li><strong>都市国家</strong>：ウル、バビロンなど</li>
                    </ul>
                </div>
                
                <div class="civilization">
                    <h5>エジプト文明（ナイル川）</h5>
                    <ul>
                        <li><strong>ヒエログリフ</strong>：神聖文字</li>
                        <li><strong>ピラミッド</strong>：ファラオの墓</li>
                        <li><strong>ミイラ</strong>：死後の世界への信仰</li>
                    </ul>
                </div>
                
                <div class="civilization">
                    <h5>インダス文明（インダス川）</h5>
                    <ul>
                        <li><strong>計画都市</strong>：モヘンジョ・ダロ</li>
                        <li><strong>下水道</strong>：優れた都市計画</li>
                        <li><strong>印章</strong>：商業の発達</li>
                    </ul>
                </div>
                
                <div class="civilization">
                    <h5>中国文明（黄河）</h5>
                    <ul>
                        <li><strong>漢字</strong>：表意文字</li>
                        <li><strong>殷（商）</strong>：最古の王朝</li>
                        <li><strong>青銅器</strong>：高度な技術</li>
                    </ul>
                </div>
            </div>

            <h4>文明の共通点</h4>
            <ul>
                <li><strong>大河のほとり</strong>：農業に適した土地</li>
                <li><strong>文字の発明</strong>：記録・伝達手段</li>
                <li><strong>都市の形成</strong>：人口の集中</li>
                <li><strong>階級社会</strong>：支配者と被支配者</li>
            </ul>
        `
    }
};

// 認証管理クラス
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.currentSchool = null;
        this.superAdminEmail = 'ikki_y0518@icloud.com'; // スーパー管理者のメールアドレス
        this.init();
    }

    init() {
        // ローカルストレージから認証情報を復元
        const savedUser = localStorage.getItem('sunaUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
        }
        
        // 現在のスクール情報を復元
        const savedSchool = localStorage.getItem('currentSchool');
        if (savedSchool) {
            this.currentSchool = JSON.parse(savedSchool);
        } else {
            // デフォルトスクールを設定
            this.currentSchool = schools['production-school'];
            localStorage.setItem('currentSchool', JSON.stringify(this.currentSchool));
        }
        
        this.updateAuthUI();
    }

    login(userData) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        localStorage.setItem('sunaUser', JSON.stringify(userData));
        this.updateAuthUI();
        this.showWelcomeMessage();
        
        // roleに基づいてリダイレクト
        this.redirectByRole();
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('sunaUser');
        this.updateAuthUI();
        
        // 現在のページに応じて適切なパスでログインページにリダイレクト
        if (window.location.pathname.includes('/pages/')) {
            // pagesディレクトリ内からのログアウト
            window.location.href = 'login.html';
} else {
            // ルートディレクトリからのログアウト
            window.location.href = '/pages/login.html';
        }
    }

    // スクール変更機能
    changeSchool(schoolId) {
        const school = schools[schoolId];
        if (school) {
            this.currentSchool = school;
            localStorage.setItem('currentSchool', JSON.stringify(school));
            this.showMessage(`${school.name}に切り替えました`, 'success');
            
            // ページをリロードしてスクール固有のコンテンツを反映
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    // スーパー管理者チェック
    isSuperAdmin() {
        return this.currentUser && this.currentUser.email === this.superAdminEmail;
    }

    // 管理者権限チェック（スーパー管理者も含む）
    isAdmin() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.isSuperAdmin());
    }

    // スクール一覧を取得（スーパー管理者は全て、通常管理者は所属スクールのみ）
    getSchools() {
        // スクールデータを再読み込み
        const updatedSchools = loadSchools();
        Object.assign(schools, updatedSchools);
        
        if (this.isSuperAdmin()) {
            return Object.values(schools);
        }
        return Object.values(schools);
    }

    // 現在のユーザー情報を取得
    getCurrentUser() {
        return this.currentUser;
    }

    // 現在のスクール情報を取得
    getCurrentSchool() {
        // スクールデータを再読み込み
        const updatedSchools = loadSchools();
        Object.assign(schools, updatedSchools);
        
        return this.currentSchool || Object.values(schools).find(s => s.isDefault) || Object.values(schools)[0];
    }

    updateAuthUI() {
        const authSection = document.getElementById('auth-section');
        if (!authSection) return;

        if (this.isLoggedIn && this.currentUser) {
            const userDisplayName = this.currentUser.name || this.currentUser.email;
            const superAdminBadge = this.isSuperAdmin() ? '<span class="super-admin-badge">👑 SUPER ADMIN</span>' : '';
            
            authSection.innerHTML = `
                <div class="user-info">
                    <span class="user-name">こんにちは、${userDisplayName}さん ${superAdminBadge}</span>
                    <div class="school-selector">
                        <select id="school-select" onchange="authManager.changeSchool(this.value)">
                            ${Object.values(schools).map(school => `
                                <option value="${school.id}" ${this.currentSchool && this.currentSchool.id === school.id ? 'selected' : ''}>
                                    ${school.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <button class="logout-btn" onclick="authManager.logout()">ログアウト</button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <div class="auth-buttons">
                    <a href="/pages/login.html" class="login-btn">ログイン</a>
                    <a href="/signup.html" class="signup-btn">会員登録</a>
                </div>
            `;
        }
    }

    showWelcomeMessage() {
        this.showMessage(`${this.currentUser.name || this.currentUser.email}さん、おかえりなさい！`, 'success');
    }

    showLogoutMessage() {
        this.showMessage('ログアウトしました', 'info');
    }

    showMessage(message, type = 'info') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 新しい通知を作成
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 通知のスタイル
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        // タイプ別の色設定
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                break;
            case 'info':
                notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                break;
        }
        
        document.body.appendChild(notification);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 3000);
    }

    requireAuth() {
        if (!this.isLoggedIn) {
            this.showMessage('この機能を利用するにはログインが必要です', 'error');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = '/pages/login.html';
                }
            }, 1500);
            return false;
        }
        return true;
    }

    // roleに基づくリダイレクト
    redirectByRole() {
        if (!this.currentUser || !this.currentUser.role) {
            // roleが設定されていない場合はstudentとして扱う
            this.currentUser.role = 'student';
        }

        switch (this.currentUser.role) {
            case 'admin':
                window.location.href = '/pages/admin.html';
                break;
            case 'student':
            default:
                window.location.href = '/pages/student.html';
                break;
        }
    }

    // 管理者権限チェック
    requireAdminAuth() {
        if (!this.isLoggedIn) {
            this.showMessage('ログインが必要です', 'error');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = '/pages/login.html';
                }
            }, 1500);
            return false;
        }

        // スーパー管理者または管理者の場合のみ許可
        if (!this.currentUser.role || (this.currentUser.role !== 'admin' && this.currentUser.role !== 'super_admin')) {
            this.showMessage('管理者権限が必要です', 'error');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = '/pages/login.html';
                }
            }, 1500);
            return false;
        }

        return true;
    }

    // 受講生権限チェック
    requireStudentAuth() {
        if (!this.isLoggedIn) {
            this.showMessage('ログインが必要です', 'error');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 1500);
            return false;
        }

        if (this.currentUser.role && this.currentUser.role !== 'student') {
            this.showMessage('受講生権限が必要です', 'error');
            setTimeout(() => {
                window.location.href = '/pages/admin.html';
            }, 1500);
            return false;
        }

        return true;
    }
}

// アプリケーションの状態管理
class StudyApp {
    constructor() {
        this.currentView = 'subjects'; // 科目選択画面から開始
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentLesson = null;
        this.init();
    }

    init() {
        console.log('StudyApp initialized');
        
        // ローカルストレージから管理者が作成した科目データを読み込み
        this.loadSubjectsFromStorage();
        
        this.renderSubjects(); // 科目選択画面を表示
        this.updateSidebar();
        this.updateNavigation(); // ナビゲーション初期化
        this.bindEvents();
        
        // 定期的にローカルストレージをチェック（管理者が新しい科目を追加した場合）
        this.setupStorageListener();
    }
    
    // ローカルストレージの変更を監視
    setupStorageListener() {
        // 他のタブでローカルストレージが変更された場合の処理
        window.addEventListener('storage', (e) => {
            if (e.key === 'subjects') {
                console.log('Subjects data changed in another tab, reloading...');
                this.loadSubjectsFromStorage();
                this.renderSubjects();
            }
        });
        
        // 同一タブ内での変更も監視（5秒間隔）
        setInterval(() => {
            const currentKeys = Object.keys(subjects);
            const storedSubjects = localStorage.getItem('subjects');
            if (storedSubjects) {
                const parsedSubjects = JSON.parse(storedSubjects);
                const storedKeys = Object.keys(parsedSubjects);
                
                // キーの数が変わった場合は再読み込み
                if (currentKeys.length !== storedKeys.length) {
                    console.log('Subjects count changed, reloading...');
                    this.loadSubjectsFromStorage();
                    this.renderSubjects();
                }
            }
        }, 5000);
    }
    
    // ローカルストレージから科目データを読み込む
    loadSubjectsFromStorage() {
        try {
            const storedSubjects = localStorage.getItem('subjects');
            if (storedSubjects) {
                const parsedSubjects = JSON.parse(storedSubjects);
                
                // 既存データにアイコンが含まれているかチェック
                let needsUpdate = false;
                for (const [key, storedSubject] of Object.entries(parsedSubjects)) {
                    if (!storedSubject.icon && subjects[key] && subjects[key].icon) {
                        storedSubject.icon = subjects[key].icon;
                        needsUpdate = true;
                    }
                }
                
                // 更新が必要な場合はローカルストレージを更新
                if (needsUpdate) {
                    localStorage.setItem('subjects', JSON.stringify(parsedSubjects));
                    console.log('Updated subjects with missing icons');
                }
                
                // グローバルのsubjectsオブジェクトを更新
                Object.assign(subjects, parsedSubjects);
                console.log('Loaded subjects from storage:', Object.keys(subjects));
            } else {
                console.log('No subjects found in localStorage, using default subjects');
                // デフォルト科目データをローカルストレージに保存
                localStorage.setItem('subjects', JSON.stringify(subjects));
                console.log('Saved default subjects to storage:', Object.keys(subjects));
            }
        } catch (error) {
            console.error('Error loading subjects from storage:', error);
            // エラーの場合もデフォルトデータを使用
            console.log('Using default subjects due to error');
        }
    }

    // 科目選択画面を表示
    renderSubjects() {
        // ホームビューを表示
        this.hideAllViews();
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.style.display = 'block';
        }
        
        // 科目コンテナを取得
        const subjectsContainer = document.getElementById('subjects-container');
        if (!subjectsContainer) return;
        
        // 学校に関連する科目をフィルタリング
        let filteredSubjects = this.getFilteredSubjects();
        
        console.log('Total subjects:', Object.keys(subjects).length);
        console.log('Filtered subjects:', filteredSubjects.length);
        console.log('Current user school:', authManager?.getCurrentSchool()?.id);
        
        // 科目が空の場合の表示
        if (filteredSubjects.length === 0) {
            subjectsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h2>科目がまだ作成されていません</h2>
                    <p>管理者によって科目とコースが作成されるまでお待ちください。</p>
                    <div class="empty-state-note">
                        <p>💡 管理者の方は、コンテンツ管理システムから科目やコースを作成してください。</p>
                    </div>
                </div>
            `;
        } else {
            subjectsContainer.innerHTML = `
                <div class="subjects-header">
                    <h2>学習科目を選択してください</h2>
                    <p>興味のある科目から学習を始めましょう</p>
                </div>
                <div class="subjects-grid" id="subjects-grid">
                </div>
            `;

            const subjectsGrid = document.getElementById('subjects-grid');
            this.populateSubjectsGrid(subjectsGrid, filteredSubjects);
        }
    }

    // 学校に関連する科目をフィルタリング
    getFilteredSubjects() {
        const allSubjects = Object.values(subjects);
        
        // ログインしていない場合はすべて表示
        if (!authManager || !authManager.isLoggedIn) {
            return allSubjects;
        }
        
        const currentSchool = authManager.getCurrentSchool();
        if (!currentSchool) {
            console.log('No current school found, showing all subjects');
            return allSubjects;
        }
        
        console.log('Filtering subjects for school:', currentSchool.id);
        
        // 学校IDが一致する科目をフィルタリング
        const filtered = allSubjects.filter(subject => {
            // デモ用：production-schoolの科目は全ての学校で利用可能にする
            if (subject.schoolId === 'production-school') {
                return true;
            }
            // 通常の学校フィルタリング
            return subject.schoolId === currentSchool.id;
        });
        
        console.log('Filtered subjects count:', filtered.length);
        return filtered;
    }

    // 科目グリッドに科目を追加
    populateSubjectsGrid(subjectsGrid, subjectValues) {
        if (!subjectsGrid) return;
        
        subjectValues.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'subject-card';
            subjectCard.innerHTML = `
                <div class="subject-icon" style="color: ${subject.color}">
                    ${subject.icon}
                </div>
                <h3 class="subject-name">${subject.name}</h3>
                <p class="subject-description">${subject.description}</p>
                <div class="subject-stats">
                    <span class="course-count">${subject.courses ? subject.courses.length : 0}コース</span>
                    <span class="total-lessons">${this.getTotalLessons(subject)}講義</span>
                </div>
                <button class="subject-button" style="background-color: ${subject.color}">
                    学習を開始
                </button>
            `;
            
            subjectCard.addEventListener('click', () => {
                console.log('Subject clicked:', subject.name);
                console.log('AuthManager exists:', !!authManager);
                console.log('User logged in:', authManager?.isLoggedIn);
                
                if (authManager && authManager.requireAuth()) {
                    console.log('Auth passed, showing subject:', subject.name);
                    this.showSubject(subject);
                } else {
                    console.log('Auth failed or authManager not available');
                }
            });
            
            subjectsGrid.appendChild(subjectCard);
        });
    }

    // コース一覧を表示
    renderCourses(subject) {
        console.log('renderCourses called for subject:', subject.name);
        const homeView = document.getElementById('home-view');
        if (!homeView) {
            console.log('home-view element not found');
            return;
        }
        
        // コースが空の場合の表示
        if (!subject.courses || subject.courses.length === 0) {
            homeView.innerHTML = `
                <div class="courses-header">
                    <h2>${subject.icon} ${subject.name}のコース一覧</h2>
                    <p>${subject.description}</p>
                </div>
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <h2>まだコースが作成されていません</h2>
                    <p>「${subject.name}」のコースが管理者によって作成されるまでお待ちください。</p>
                    <div class="empty-state-note">
                        <p>💡 管理者の方は、コンテンツ管理システムから「${subject.name}」にコースを追加してください。</p>
                    </div>
                </div>
            `;
            return;
        }
        
        homeView.innerHTML = `
            <div class="courses-header">
                <button class="back-to-subjects-btn" id="back-to-subjects-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    科目一覧に戻る
                </button>
                <div class="courses-header-main">
                    <h2>${subject.icon} ${subject.name}のコース一覧</h2>
                    <p>${subject.description}</p>
                </div>
            </div>
            <div class="course-list" id="course-list">
            </div>
        `;

        // 戻るボタンのイベントリスナーを設定（複数の方法で確実に）
        setTimeout(() => {
            const backBtn = document.getElementById('back-to-subjects-btn');
            console.log('Looking for back button:', backBtn);
            if (backBtn) {
                // 既存のイベントリスナーをクリア
                backBtn.replaceWith(backBtn.cloneNode(true));
                const newBackBtn = document.getElementById('back-to-subjects-btn');
                
                newBackBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Back to subjects button clicked via addEventListener');
                    this.showSubjects();
                });
                
                // onclick属性でも設定（フォールバック）
                newBackBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Back to subjects button clicked via onclick');
                    this.showSubjects();
                };
                
                console.log('Back button event listeners set');
            } else {
                console.log('Back button not found');
            }
        }, 100);

        const courseList = document.getElementById('course-list');

        // coursesがオブジェクトの場合は配列に変換
        const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});

        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-card-image">
                    <div class="course-logo-container">
                        <svg width="140" height="70" viewBox="0 0 115 55" class="course-suna-logo">
                            <!-- 大きな円（右上、明るいターコイズブルー） -->
                            <circle cx="90" cy="20" r="13" fill="#67E8F9" opacity="0.85"/>

                            <!-- 中くらいの円（左中央、濃いブルー） -->
                            <circle cx="73" cy="28" r="8" fill="#2563EB" opacity="0.9"/>

                            <!-- 小さな円（右下、薄いターコイズ） -->
                            <circle cx="83" cy="35" r="5" fill="#A7F3D0" opacity="0.75"/>

                            <!-- テキスト "suna" - 太字、濃いネイビー -->
                            <text x="0" y="42" font-size="26" font-weight="700" fill="#1E293B" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" letter-spacing="-1.2px">
                                suna
                            </text>
                        </svg>
                    </div>
                </div>
                <div class="course-card-content">
                    <h4 class="course-card-title">${course.title}</h4>
                    <p class="course-card-description">${course.description}</p>
                    <div class="course-card-footer">
                        <span class="course-progress">${course.progress}% 完了</span>
                        <button class="course-button">受講する</button>
                    </div>
                </div>
            `;
            
            courseCard.addEventListener('click', () => {
                console.log('Course clicked:', course.title);
                if (authManager && authManager.requireAuth()) {
                    console.log('Course auth passed, showing course:', course.title);
                this.showCourse(course);
                } else {
                    console.log('Course auth failed');
                }
            });
            
            courseList.appendChild(courseCard);
        });
    }

    // サイドバーの更新
    updateSidebar() {
        const sidebar = document.getElementById('sidebar');
        const chapterList = document.getElementById('chapter-list');
        const container = document.querySelector('.main-content .container');
        
        // 要素が存在しない場合は早期リターン（コンテンツ管理画面など）
        if (!sidebar || !container) {
            return;
        }
        
        if (this.currentView === 'subjects' || this.currentView === 'courses') {
            sidebar.style.display = 'none';
            container.classList.remove('with-sidebar');
        } else {
            sidebar.style.display = 'block';
            container.classList.add('with-sidebar');
            
            if (this.currentCourse && chapterList) {
                chapterList.innerHTML = '';
                
                // コース全体のフォルダを作成
                const courseFolder = document.createElement('div');
                courseFolder.className = 'finder-item finder-folder';
                courseFolder.innerHTML = `
                    <div class="finder-item-content">
                        <span class="finder-icon">📁</span>
                        <span class="finder-name">${this.currentCourse.title}</span>
                    </div>
                `;
                courseFolder.addEventListener('click', () => {
                    this.showCourse(this.currentCourse);
                });
                chapterList.appendChild(courseFolder);
                
                // 各章をフォルダとして表示
                this.currentCourse.chapters.forEach((chapter, chapterIndex) => {
                    const chapterFolder = document.createElement('div');
                    chapterFolder.className = 'finder-item finder-folder chapter-folder';
                    chapterFolder.dataset.chapterIndex = chapterIndex;
                    
                    const isExpanded = chapterIndex === 0; // 最初の章は展開
                    
                    chapterFolder.innerHTML = `
                        <div class="finder-item-content">
                            <span class="finder-expand-icon">${isExpanded ? '▼' : '▶'}</span>
                            <span class="finder-icon">📂</span>
                            <span class="finder-name">${chapter.title}</span>
                            <span class="finder-count">(${chapter.lessons.length})</span>
                        </div>
                    `;
                    
                    // 章の展開・折りたたみ
                    chapterFolder.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const expandIcon = chapterFolder.querySelector('.finder-expand-icon');
                        const isCurrentlyExpanded = chapterFolder.classList.contains('expanded');
                        
                        if (isCurrentlyExpanded) {
                            chapterFolder.classList.remove('expanded');
                            expandIcon.textContent = '▶';
                            // 講義アイテムを非表示
                            const lessonItems = chapterList.querySelectorAll(`[data-chapter="${chapterIndex}"]`);
                            lessonItems.forEach(item => item.style.display = 'none');
                        } else {
                            chapterFolder.classList.add('expanded');
                            expandIcon.textContent = '▼';
                            // 講義アイテムを表示
                            const lessonItems = chapterList.querySelectorAll(`[data-chapter="${chapterIndex}"]`);
                            lessonItems.forEach(item => item.style.display = 'block');
                        }
                    });
                    
                    if (isExpanded) {
                        chapterFolder.classList.add('expanded');
                    }
                    
                    chapterList.appendChild(chapterFolder);
                    
                    // 各講義をファイルとして表示
                    chapter.lessons.forEach((lesson, lessonIndex) => {
                        const lessonFile = document.createElement('div');
                        lessonFile.className = 'finder-item finder-file lesson-file';
                        lessonFile.dataset.chapter = chapterIndex;
                        lessonFile.style.display = isExpanded ? 'block' : 'none';
                        
                        const isCompleted = this.isLessonCompleted(lesson.id);
                        const isCurrentLesson = this.currentLesson === lesson.id;
                        
                        lessonFile.innerHTML = `
                            <div class="finder-item-content">
                                <span class="finder-indent"></span>
                                <span class="finder-icon">${isCompleted ? '✅' : '📄'}</span>
                                <span class="finder-name ${isCurrentLesson ? 'current-lesson' : ''}">${lesson.title}</span>
                                ${isCompleted ? '<span class="finder-badge">完了</span>' : ''}
                            </div>
                        `;
                        
                        lessonFile.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.showLesson(lesson.id);
                        });
                        
                        chapterList.appendChild(lessonFile);
                    });
                });
            }
        }
    }

    // パンくずナビゲーションの更新
    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb-content');
        if (!breadcrumb) return;
        
        let breadcrumbHTML = '<a href="#" onclick="app.showSubjects()" class="breadcrumb-item">科目選択</a>';
        
        if (this.currentSubject) {
            breadcrumbHTML += `<a href="#" onclick="app.showSubject(subjects.${this.currentSubject.id})" class="breadcrumb-item">${this.currentSubject.name}</a>`;
        }
        
        if (this.currentCourse) {
            breadcrumbHTML += `<span class="breadcrumb-item">${this.currentCourse.title}</span>`;
        }
        
        if (this.currentLesson) {
            const lesson = this.findLessonById(this.currentLesson);
            if (lesson) {
                breadcrumbHTML += `<span class="breadcrumb-item">${lesson.title}</span>`;
            }
        }
        
        breadcrumb.innerHTML = breadcrumbHTML;
    }

    // 特定のコースを表示
    showCourse(course) {
        console.log('showCourse called with:', course);
        console.log('Setting currentCourse to:', course?.title);
        
        this.currentView = 'course';
        this.currentCourse = course;
        this.currentLesson = null;
        
        this.hideAllViews();
        this.updateSidebar();
        this.updateNavigation();
        
        const courseView = document.getElementById('course-view');
        courseView.style.display = 'block';
        courseView.innerHTML = `
            <div class="course-detail-header">
                <h2 class="course-detail-title">${course.title}</h2>
                <p class="course-detail-subtitle">${course.description}</p>
            </div>
            
            ${course.chapters.map(chapter => `
                <div class="chapter-section">
                    <div class="chapter-header">
                        <h3 class="chapter-title">${chapter.title}</h3>
            </div>
            <div class="lesson-list">
                        ${chapter.lessons.map(lesson => `
                            <div class="lesson-item" onclick="event.stopPropagation(); app.showLesson('${lesson.id}'); return false;">
                                <div class="lesson-checkbox ${this.isLessonCompleted(lesson.id) ? 'completed' : ''}">
                                    ${this.isLessonCompleted(lesson.id) ? '✓' : ''}
                                </div>
                                <div class="lesson-content">
                                    <div class="lesson-title">${lesson.title}</div>
                                    <div class="lesson-subtitle">動画とテキストで学習</div>
                                </div>
                                <button class="lesson-button" onclick="event.stopPropagation(); app.showLesson('${lesson.id}'); return false;">受講する</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            `).join('')}
        `;
    }

    // 特定の講義を表示
    showLesson(lessonId) {
        console.log('=== showLesson START ===');
        console.log('showLesson called with:', lessonId);
        console.log('Current course before find:', this.currentCourse?.title);
        console.log('Current view before:', this.currentView);
        
        const lessonData = this.findLessonById(lessonId);
        console.log('Found lesson data:', lessonData);
        
        if (!lessonData) {
            console.log('❌ Lesson not found, returning to previous view');
            console.log('Previous view was:', this.currentView);
            return;
        }

        // レッスンが異なるコースから呼ばれた場合のみ、コース/科目情報を更新
        if (lessonData._course && lessonData._subject) {
            console.log('📌 Setting course context from lesson data');
            this.currentCourse = lessonData._course;
            this.currentSubject = lessonData._subject;
            console.log('Current course after update:', this.currentCourse?.title);
            console.log('Current subject after update:', this.currentSubject?.name);
        }

        console.log('✅ Setting currentView to lesson');
        this.currentView = 'lesson';
        this.currentLesson = lessonId;
        
        console.log('📚 Marking lesson completed:', lessonId);
        // 講義を完了状態にマーク
        this.markLessonCompleted(lessonId);
        
        console.log('🖥️ Hiding all views');
        this.hideAllViews();
        console.log('📋 Updating sidebar');
        this.updateSidebar();
        console.log('🧭 Updating navigation');
        this.updateNavigation();

        const lessonView = document.getElementById('lesson-view');
        console.log('📖 Lesson view element:', lessonView);
        lessonView.style.display = 'block';
        console.log('✅ Lesson view displayed');
        
        const content = lessonContents[lessonId] || {
            title: lessonData.title,
            videoUrl: 'videos/sample.mp4',
            textContent: '<p>コンテンツを準備中です。</p>'
        };

        const lessonPosition = this.getLessonPosition(lessonId);
        
        lessonView.innerHTML = `
            <div class="lesson-header">
                <div class="lesson-progress-info">
                    <span class="lesson-number">${lessonPosition.position} / ${lessonPosition.total}</span>
                    <div class="lesson-progress-bar">
                        <div class="lesson-progress-fill" style="width: ${(lessonPosition.position / lessonPosition.total) * 100}%"></div>
            </div>
                </div>
                <h2 class="lesson-title-main">${content.title}</h2>
                <p class="lesson-course-name">${this.currentCourse.title}</p>
            </div>
            
            <div class="lesson-content-grid">
                <div class="video-section">
                    <h3>🎥 講義動画</h3>
                    <div class="video-container">
                        <video controls preload="metadata">
                            <source src="${content.videoUrl}" type="video/mp4">
                            <p>お使いのブラウザは動画の再生に対応していません。</p>
                        </video>
                    </div>
                </div>
                
                <div class="text-section">
                    <h3>📖 講義テキスト</h3>
                    <div class="text-content">
                        ${content.textContent}
                    </div>
                </div>
            </div>
            
            <div class="nav-buttons">
                <button class="nav-btn" onclick="app.showCourse(app.currentCourse)">📚 コース詳細に戻る</button>
                <div class="lesson-navigation">
                    ${this.findPrevLesson(lessonId) ? 
                        `<button class="nav-btn secondary" onclick="app.prevLesson()">← 前の講義</button>` : 
                        `<button class="nav-btn secondary disabled">← 前の講義</button>`
                    }
                    ${this.findNextLesson(lessonId) ? 
                        `<button class="nav-btn primary" onclick="app.nextLesson()">次の講義 →</button>` : 
                        `<button class="nav-btn primary" onclick="app.nextLesson()">コース完了 🎉</button>`
                    }
                </div>
            </div>
        `;
    }

    // 科目選択画面を表示
    showSubjects() {
        console.log('showSubjects called');
        this.currentView = 'subjects';
        this.currentSubject = null;
        this.currentCourse = null;
        this.currentLesson = null;

        this.hideAllViews();
        this.updateSidebar();
        this.updateNavigation();
        
        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.style.display = 'block';
            console.log('Home view displayed');
        } else {
            console.log('Home view element not found');
        }
        this.renderSubjects();
        console.log('showSubjects completed');
    }

    // 特定の科目のコース一覧を表示
    showSubject(subject) {
        console.log('showSubject called with:', subject.name);
        console.log('Subject courses:', subject.courses ? subject.courses.length : 0);
        
        // coursesプロパティが存在しない場合は初期化
        if (!subject.courses) {
            subject.courses = [];
        }
        
        this.currentView = 'courses';
        this.currentSubject = subject;
        this.currentCourse = null;
        this.currentLesson = null;

        this.hideAllViews();
        this.updateSidebar();
        this.updateNavigation();
        
        document.getElementById('home-view').style.display = 'block';
        this.renderCourses(subject);
        
        console.log('showSubject completed');
    }

    // 全てのビューを非表示
    hideAllViews() {
        document.getElementById('home-view').style.display = 'none';
        document.getElementById('course-view').style.display = 'none';
        document.getElementById('lesson-view').style.display = 'none';
    }

    // 科目の総講義数を取得
    getTotalLessons(subject) {
        let total = 0;
        // coursesが存在しない場合は0を返す
        if (!subject.courses) {
            return 0;
        }
        
        // coursesがオブジェクトの場合は配列に変換
        const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses);
        
        courses.forEach(course => {
            if (course.chapters && Array.isArray(course.chapters)) {
                course.chapters.forEach(chapter => {
                    if (chapter.lessons && Array.isArray(chapter.lessons)) {
                        total += chapter.lessons.length;
                    }
                });
            }
        });
        return total;
    }

    // レッスンIDから講義を検索（状態は変更しない）
    findLessonById(lessonId) {
        console.log('Searching for lesson ID:', lessonId);
        console.log('Available subjects:', Object.keys(subjects));
        
        for (const subject of Object.values(subjects)) {
            const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});
            for (const course of courses) {
                if (course.chapters) {
                    for (const chapter of course.chapters) {
                        if (chapter.lessons) {
                            const lesson = chapter.lessons.find(l => l.id === lessonId);
                            if (lesson) {
                                console.log('Found lesson:', lesson, 'in course:', course.title);
                                // レッスンオブジェクトにコース情報と科目情報を付加して返す
                                return {
                                    ...lesson,
                                    _course: course,
                                    _subject: subject
                                };
                            }
                        }
                    }
                }
            }
        }
        console.log('Lesson not found:', lessonId);
        return null;
    }

    // 次の講義に進む
    nextLesson() {
        if (!this.currentLesson || !this.currentCourse) return;
        
        const nextLesson = this.findNextLesson(this.currentLesson);
        if (nextLesson) {
            this.showLesson(nextLesson.id);
        } else {
            // 最後の講義の場合、コース完了メッセージを表示
            this.showCourseCompletionMessage();
        }
    }

    // 前の講義に戻る
    prevLesson() {
        if (!this.currentLesson || !this.currentCourse) return;
        
        const prevLesson = this.findPrevLesson(this.currentLesson);
        if (prevLesson) {
            this.showLesson(prevLesson.id);
        } else {
            // 最初の講義の場合、コース詳細に戻る
            this.showCourse(this.currentCourse);
        }
    }

    // 次の講義を検索
    findNextLesson(currentLessonId) {
        for (const chapter of this.currentCourse.chapters) {
            const lessons = chapter.lessons;
            const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
            
            if (currentIndex !== -1) {
                // 同じ章の次の講義
                if (currentIndex < lessons.length - 1) {
                    return lessons[currentIndex + 1];
                }
                
                // 次の章の最初の講義
                const chapterIndex = this.currentCourse.chapters.findIndex(c => c.id === chapter.id);
                if (chapterIndex < this.currentCourse.chapters.length - 1) {
                    const nextChapter = this.currentCourse.chapters[chapterIndex + 1];
                    return nextChapter.lessons[0];
                }
                
                // 最後の講義
                return null;
            }
        }
        return null;
    }

    // 前の講義を検索
    findPrevLesson(currentLessonId) {
        for (const chapter of this.currentCourse.chapters) {
            const lessons = chapter.lessons;
            const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
            
            if (currentIndex !== -1) {
                // 同じ章の前の講義
                if (currentIndex > 0) {
                    return lessons[currentIndex - 1];
                }
                
                // 前の章の最後の講義
                const chapterIndex = this.currentCourse.chapters.findIndex(c => c.id === chapter.id);
                if (chapterIndex > 0) {
                    const prevChapter = this.currentCourse.chapters[chapterIndex - 1];
                    return prevChapter.lessons[prevChapter.lessons.length - 1];
                }
                
                // 最初の講義
                return null;
            }
        }
        return null;
    }

    // コース完了メッセージを表示
    showCourseCompletionMessage() {
        const lessonView = document.getElementById('lesson-view');
        lessonView.innerHTML = `
            <div class="course-completion">
                <div class="completion-icon">🎉</div>
                <h2>コース完了おめでとうございます！</h2>
                <p class="completion-message">
                    「${this.currentCourse.title}」のすべての講義を完了しました。<br>
                    お疲れさまでした！
                </p>
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.getTotalCourseLessons(this.currentCourse)}</span>
                        <span class="stat-label">講義完了</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.currentCourse.chapters.length}</span>
                        <span class="stat-label">章完了</span>
                    </div>
                    </div>
                <div class="completion-actions">
                    <button class="completion-btn primary" onclick="app.showSubject(app.currentSubject)">
                        他のコースを見る
                    </button>
                    <button class="completion-btn secondary" onclick="app.showSubjects()">
                        科目選択に戻る
                    </button>
                </div>
            </div>
        `;
    }

    // コースの総講義数を取得
    getTotalCourseLessons(course) {
        let total = 0;
        course.chapters.forEach(chapter => {
            total += chapter.lessons.length;
        });
        return total;
    }

    // ユーザー進捗データを取得
    getUserProgress() {
        if (!window.authManager || !window.authManager.currentUser) {
            return {};
        }
        const userId = window.authManager.currentUser.email;
        const progressKey = `user_progress_${userId}`;
        const saved = localStorage.getItem(progressKey);
        return saved ? JSON.parse(saved) : {};
    }

    // ユーザー進捗データを保存
    saveUserProgress(progress) {
        if (!window.authManager || !window.authManager.currentUser) {
            return;
        }
        const userId = window.authManager.currentUser.email;
        const progressKey = `user_progress_${userId}`;
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    // 講義の完了状態を取得
    isLessonCompleted(lessonId) {
        const progress = this.getUserProgress();
        return progress[lessonId] === true;
    }

    // 講義を完了状態にマーク
    markLessonCompleted(lessonId) {
        const progress = this.getUserProgress();
        progress[lessonId] = true;
        this.saveUserProgress(progress);
        
        // コース進捗を更新
        for (const subject of Object.values(subjects)) {
            const courses = Array.isArray(subject.courses) ? subject.courses : Object.values(subject.courses || {});
            for (const course of courses) {
                for (const chapter of course.chapters) {
                    const lesson = chapter.lessons.find(l => l.id === lessonId);
                    if (lesson) {
                        this.updateCourseProgress(course);
                        return;
                    }
                }
            }
        }
    }

    // コースの進捗を更新
    updateCourseProgress(course) {
        let completedLessons = 0;
        let totalLessons = 0;
        
        course.chapters.forEach(chapter => {
            chapter.lessons.forEach(lesson => {
                totalLessons++;
                if (this.isLessonCompleted(lesson.id)) {
                    completedLessons++;
                }
            });
        });
        
        course.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    // 講義の現在位置を取得
    getLessonPosition(lessonId) {
        let position = 0;
        let total = 0;
        let found = false;
        
        // currentCourseがnullでないことを確認
        if (!this.currentCourse || !this.currentCourse.chapters) {
            console.log('currentCourse or chapters not available:', this.currentCourse);
            return { position: 1, total: 1 };
        }
        
        for (const chapter of this.currentCourse.chapters) {
            for (const lesson of chapter.lessons) {
                total++;
                if (lesson.id === lessonId) {
                    position = total;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        
        return { position, total };
    }

    // イベントリスナーの設定
    bindEvents() {
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentView === 'lesson') {
                    this.showCourse(this.currentCourse);
                } else if (this.currentView === 'course') {
                    this.showSubject(this.currentSubject);
                } else if (this.currentView === 'courses') {
                    this.showSubjects();
                }
            }
        });
    }

    // ナビゲーション機能
    updateNavigation() {
        // 新しいブレッドクラムナビゲーションを更新
        this.updateBreadcrumbNav();
        
        const homeView = document.getElementById('home-view');
        if (!homeView) return;

        // 既存のナビゲーションを削除
        const existingNav = homeView.querySelector('.page-navigation');
        if (existingNav) {
            existingNav.remove();
        }

        // ナビゲーションHTML作成
        let navigationHtml = '';

        if (this.currentView !== 'subjects') {
            navigationHtml = `
                <div class="page-navigation">
                    <div class="nav-breadcrumb">
                        ${this.generateBreadcrumb()}
                    </div>
                    <div class="nav-actions">
                        ${this.generateBackButton()}
                        ${this.generateProgressIndicator()}
                    </div>
                </div>
            `;
        }

        if (navigationHtml) {
            homeView.insertAdjacentHTML('afterbegin', navigationHtml);
            this.bindNavigationEvents();
        }
    }

    // 新しいブレッドクラムナビゲーションを更新
    updateBreadcrumbNav() {
        const breadcrumbNav = document.getElementById('breadcrumb-nav');
        const breadcrumbPath = document.getElementById('breadcrumb-path');
        const backBtn = document.getElementById('back-btn');
        
        if (!breadcrumbNav || !breadcrumbPath || !backBtn) return;

        // 科目選択画面の場合はブレッドクラムを隠す
        if (this.currentView === 'subjects') {
            breadcrumbNav.style.display = 'none';
            return;
        }

        // ブレッドクラムを表示
        breadcrumbNav.style.display = 'block';

        // 戻るボタンのイベントを設定
        backBtn.onclick = () => this.handleBackNavigation();

        // パスを生成
        let pathHtml = `
            <div class="breadcrumb-item">
                <a href="#" onclick="app.showSubjects(); return false;">科目一覧</a>
            </div>
        `;

        if (this.currentView === 'courses' && this.currentSubject) {
            pathHtml += `
                <span class="breadcrumb-separator">></span>
                <div class="breadcrumb-item">
                    <span class="breadcrumb-current">${this.currentSubject.name}</span>
                </div>
            `;
        } else if (this.currentView === 'course' && this.currentSubject && this.currentCourse) {
            pathHtml += `
                <span class="breadcrumb-separator">></span>
                <div class="breadcrumb-item">
                    <a href="#" onclick="app.showSubject(app.currentSubject); return false;">${this.currentSubject.name}</a>
                </div>
                <span class="breadcrumb-separator">></span>
                <div class="breadcrumb-item">
                    <span class="breadcrumb-current">${this.currentCourse.title}</span>
                </div>
            `;
        } else if (this.currentView === 'lesson' && this.currentSubject && this.currentCourse && this.currentLesson) {
            const currentLessonData = this.findLessonById(this.currentLesson);
            const lessonTitle = currentLessonData ? currentLessonData.title : 'レッスン';
            pathHtml += `
                <span class="breadcrumb-separator">></span>
                <div class="breadcrumb-item">
                    <a href="#" onclick="app.showSubject(app.currentSubject); return false;">${this.currentSubject.name}</a>
                </div>
                <span class="breadcrumb-separator">></span>
                <div class="breadcrumb-item">
                    <a href="#" onclick="app.showCourse(app.currentCourse); return false;">${this.currentCourse.title}</a>
                </div>
                <span class="breadcrumb-separator">></span>
                <div class="breadcrumb-item">
                    <span class="breadcrumb-current">${lessonTitle}</span>
                </div>
            `;
        }

        breadcrumbPath.innerHTML = pathHtml;
    }

    // 戻るボタンの処理
    handleBackNavigation() {
        if (this.currentView === 'lesson') {
            this.showCourse(this.currentCourse);
        } else if (this.currentView === 'course') {
            this.showSubject(this.currentSubject);
        } else if (this.currentView === 'courses') {
            this.showSubjects();
        }
    }

    generateBreadcrumb() {
        let breadcrumb = `
            <div class="breadcrumb-item">
                <a href="#" class="breadcrumb-link" onclick="app.showSubjects()">
                    <span class="icon">🏠</span>
                    科目一覧
                </a>
            </div>
        `;

        if (this.currentView === 'courses' && this.currentSubject) {
            breadcrumb += `
                <span class="breadcrumb-separator">›</span>
                <div class="breadcrumb-item">
                    <span class="breadcrumb-current">${this.currentSubject.name}</span>
                </div>
            `;
        } else if (this.currentView === 'course' && this.currentSubject && this.currentCourse) {
            breadcrumb += `
                <span class="breadcrumb-separator">›</span>
                <div class="breadcrumb-item">
                    <a href="#" class="breadcrumb-link" onclick="app.showSubject(app.currentSubject)">
                        ${this.currentSubject.name}
                    </a>
                </div>
                <span class="breadcrumb-separator">›</span>
                <div class="breadcrumb-item">
                    <span class="breadcrumb-current">${this.currentCourse.title}</span>
                </div>
            `;
        } else if (this.currentView === 'lesson' && this.currentSubject && this.currentCourse) {
            const lesson = this.findLessonById(this.currentLesson);
            breadcrumb += `
                <span class="breadcrumb-separator">›</span>
                <div class="breadcrumb-item">
                    <a href="#" class="breadcrumb-link" onclick="app.showSubject(app.currentSubject)">
                        ${this.currentSubject.name}
                    </a>
                </div>
                <span class="breadcrumb-separator">›</span>
                <div class="breadcrumb-item">
                    <a href="#" class="breadcrumb-link" onclick="app.showCourse(app.currentCourse)">
                        ${this.currentCourse.title}
                    </a>
                </div>
                <span class="breadcrumb-separator">›</span>
                <div class="breadcrumb-item">
                    <span class="breadcrumb-current">${lesson ? lesson.title : 'レッスン'}</span>
                </div>
            `;
        }

        return breadcrumb;
    }

    generateBackButton() {
        let backAction = '';
        let backText = '';

        switch (this.currentView) {
            case 'courses':
                backAction = 'app.showSubjects()';
                backText = '科目一覧に戻る';
                break;
            case 'course':
                backAction = 'app.showSubject(app.currentSubject)';
                backText = `${this.currentSubject ? this.currentSubject.name : 'コース一覧'}に戻る`;
                break;
            case 'lesson':
                backAction = 'app.showCourse(app.currentCourse)';
                backText = 'コース詳細に戻る';
                break;
            default:
                return '';
        }

        return `
            <button class="back-button" onclick="${backAction}">
                <span class="icon">←</span>
                ${backText}
            </button>
        `;
    }

    generateProgressIndicator() {
        if (this.currentView === 'lesson' && this.currentCourse) {
            const position = this.getLessonPosition(this.currentLesson);
            const progressPercent = (position.position / position.total) * 100;
            
            return `
                <div class="progress-indicator">
                    <span>進捗: ${position.position} / ${position.total}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            `;
        }
        return '';
    }

    bindNavigationEvents() {
        // ナビゲーションボタンの追加イベントがあればここに追加
    }

    // 進捗ダッシュボードの初期化
    initializeProgressDashboard() {
        const dashboardElement = document.querySelector('.progress-dashboard');
        if (!dashboardElement) return;

        this.updateProgressDashboard();
    }

    // 進捗ダッシュボードの更新
    updateProgressDashboard() {
        // 全体の統計を計算
        const stats = this.calculateOverallStats();
        
        // 各統計の更新
        const totalCoursesEl = document.getElementById('total-courses');
        const completedLessonsEl = document.getElementById('completed-lessons');
        const studyTimeEl = document.getElementById('study-time');
        const streakDaysEl = document.getElementById('streak-days');
        
        if (totalCoursesEl) totalCoursesEl.textContent = stats.totalCourses;
        if (completedLessonsEl) completedLessonsEl.textContent = stats.completedLessons;
        if (studyTimeEl) studyTimeEl.textContent = `${Math.floor(stats.completedLessons * 0.5)}h`;
        if (streakDaysEl) streakDaysEl.textContent = stats.studyStreak;
        
        // 科目別進捗の更新
        this.updateSubjectsProgress(stats);
    }

    // 全体統計の計算
    calculateOverallStats() {
        const progress = this.getUserProgress();
        let totalLessons = 0;
        let completedLessons = 0;
        let totalCourses = 0;
        
        Object.values(subjects).forEach(subject => {
            if (subject.courses) {
                totalCourses += subject.courses.length;
                subject.courses.forEach(course => {
                    if (course.chapters) {
                        course.chapters.forEach(chapter => {
                            totalLessons += chapter.lessons.length;
                            chapter.lessons.forEach(lesson => {
                                if (progress[lesson.id]) {
                                    completedLessons++;
                                }
                            });
                        });
                    }
                });
            }
        });

        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        const studyStreak = this.calculateStudyStreak();

        return {
            totalSubjects: Object.keys(subjects).length,
            totalCourses,
            totalLessons,
            completedLessons,
            completionRate,
            studyStreak
        };
    }

    // 連続学習日数の計算
    calculateStudyStreak() {
        // 簡単な実装：完了したレッスン数に基づいて計算
        const progress = this.getUserProgress();
        const completedCount = Object.keys(progress).length;
        return Math.floor(completedCount / 3); // 3レッスンで1日と仮定
    }

    // 科目別進捗の更新
    updateSubjectsProgress(stats) {
        const container = document.getElementById('subjects-progress');
        if (!container) return;

        const progress = this.getUserProgress();
        let html = '';

        Object.values(subjects).forEach(subject => {
            if (subject.courses) {
                let subjectTotal = 0;
                let subjectCompleted = 0;

                subject.courses.forEach(course => {
                    if (course.chapters) {
                        course.chapters.forEach(chapter => {
                            subjectTotal += chapter.lessons.length;
                            chapter.lessons.forEach(lesson => {
                                if (progress[lesson.id]) {
                                    subjectCompleted++;
                                }
                            });
                        });
                    }
                });

                const subjectProgress = subjectTotal > 0 ? Math.round((subjectCompleted / subjectTotal) * 100) : 0;
                
                html += `
                    <div class="subject-progress-item">
                        <div class="subject-progress-header">
                            <span class="subject-icon">${subject.icon}</span>
                            <span class="subject-name">${subject.name}</span>
                            <span class="progress-percentage">${subjectProgress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${subjectProgress}%"></div>
                        </div>
                        <div class="progress-details">
                            ${subjectCompleted} / ${subjectTotal} レッスン完了
                        </div>
                    </div>
                `;
            }
        });

        container.innerHTML = html;
    }

    // 検索・フィルタ機能の初期化
    initializeSearchAndFilter() {
        const searchInput = document.getElementById('course-search');
        const clearButton = document.getElementById('clear-search');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
                // 検索語があるときにクリアボタンを表示
                if (clearButton) {
                    clearButton.style.display = e.target.value ? 'block' : 'none';
                }
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                this.performSearch('');
                clearButton.style.display = 'none';
            });
        }

        // フィルタボタンのイベントリスナー
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // アクティブクラスの切り替え
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                this.filterByLevel(filter);
            });
        });
    }

    // 科目フィルタオプションの追加
    populateSubjectFilter() {
        const subjectFilter = document.getElementById('subjectFilter');
        if (!subjectFilter) return;

        let options = '<option value="">すべての科目</option>';
        Object.values(subjects).forEach(subject => {
            options += `<option value="${subject.id}">${subject.name}</option>`;
        });
        
        subjectFilter.innerHTML = options;
    }

    // 検索機能の実装
    performSearch(query) {
        if (!query.trim()) {
            this.showAllSubjects();
            return;
        }

        const filteredSubjects = {};
        Object.entries(subjects).forEach(([key, subject]) => {
            // 科目名での検索
            if (subject.name.toLowerCase().includes(query.toLowerCase())) {
                filteredSubjects[key] = subject;
                return;
            }

            // コース名での検索
            const matchingCourses = [];
            if (subject.courses) {
                subject.courses.forEach(course => {
                    if (course.title.toLowerCase().includes(query.toLowerCase())) {
                        matchingCourses.push(course);
                    }
                });
            }

            if (matchingCourses.length > 0) {
                filteredSubjects[key] = {
                    ...subject,
                    courses: matchingCourses
                };
            }
        });

        this.renderFilteredSubjects(filteredSubjects);
    }

    // レベル別フィルタ機能の実装
    filterByLevel(level) {
        if (level === 'all') {
            this.showAllSubjects();
            return;
        }

        // 現在の実装では全て表示（将来的にレベル情報を追加する場合のための準備）
        const filteredSubjects = {};
        Object.entries(subjects).forEach(([key, subject]) => {
            // レベル情報が追加されたら、ここでフィルタリング
            filteredSubjects[key] = subject;
        });

        this.renderFilteredSubjects(filteredSubjects);
    }

    // フィルタされた科目の表示
    renderFilteredSubjects(filteredSubjects) {
        const container = document.getElementById('subjects-container');
        if (!container) return;

        if (Object.keys(filteredSubjects).length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>検索結果がありません</h3>
                    <p>別のキーワードで検索してみてください。</p>
                </div>
            `;
            return;
        }

        let html = '<div class="subjects-grid">';
        Object.values(filteredSubjects).forEach(subject => {
            const courseCount = subject.courses ? subject.courses.length : 0;
            html += `
                <div class="subject-card" onclick="app.showSubject(subjects.${subject.id})">
                    <div class="subject-icon">${subject.icon}</div>
                    <h3 class="subject-title">${subject.name}</h3>
                    <p class="subject-description">${subject.description}</p>
                    <div class="subject-stats">
                        <span class="course-count">${courseCount}コース</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    // すべての科目を表示
    showAllSubjects() {
        this.renderSubjects();
    }

    // 既存メソッドでナビゲーション更新を呼び出す
    showSubject(subject) {
        this.currentView = 'courses';
        this.currentSubject = subject;
        this.renderCourses(subject);
        this.updateSidebar();
        this.updateNavigation();
    }
}

// アプリケーションの初期化
let app;
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    window.authManager = authManager; // グローバルアクセス用
    
    // 学習関連ページ（index.html、student.html）でのみStudyAppを初期化
    const isStudyPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname.includes('student.html') ||
                       window.location.pathname === '/' ||
                       window.location.pathname.endsWith('/');
    
    if (isStudyPage) {
    app = new StudyApp();
        window.app = app; // グローバルアクセス用
    }
});

// アニメーションCSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .super-admin-badge {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #92400e;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        margin-left: 8px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from {
            box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
        }
        to {
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);
        }
    }
`;
document.head.appendChild(style);