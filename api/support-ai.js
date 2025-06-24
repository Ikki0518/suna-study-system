import { OpenAI } from 'openai';

// OpenAI API設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // プリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, courseContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // 講座コンテキストがある場合のシステムメッセージ
    let systemContent = `あなたは「Suna Study System」の学習サポートAIです。
受講生の学習を支援することが目的です。以下のガイドラインに従って回答してください：

1. 日本語で丁寧に回答する
2. 学習に関する質問には具体的で分かりやすい説明をする
3. 勉強方法やコツについてアドバイスを提供する
4. 分からない問題には段階的な解法を示す
5. 励ましの言葉を含めて学習意欲を高める
6. 学習以外の質問には適切な範囲で回答し、学習に集中するよう促す
7. 回答は簡潔で理解しやすい形にする`;

    // 講座コンテキストを追加
    if (courseContext) {
      systemContent += `

【現在学習中の講座情報】
講座名: ${courseContext.title || '不明'}
科目: ${courseContext.subject || '不明'}
章: ${courseContext.chapter || '不明'}

【講座内容】
${courseContext.content || '内容が取得できませんでした'}

上記の講座内容を踏まえて、受講生の質問に答えてください。講座の内容に関する質問には、この情報を基に詳しく説明してください。`;
    }

    const systemMessage = {
      role: 'system',
      content: systemContent
    };

    // メッセージを構築
    const chatMessages = [systemMessage, ...messages];

    // OpenAI API呼び出し (GPT-4o latest)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      max_tokens: 1500,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const reply = completion.choices[0]?.message?.content || 'すみません、回答を生成できませんでした。';

    return res.status(200).json({
      reply: reply,
      usage: completion.usage,
      model: 'gpt-4o',
      hasContext: !!courseContext
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // OpenAI APIのエラーハンドリング
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'APIの使用制限に達しました。しばらく時間をおいてから再度お試しください。'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'API設定に問題があります。管理者にお問い合わせください。'
      });
    }

    return res.status(500).json({
      error: 'サーバーエラーが発生しました。時間をおいて再度お試しください。'
    });
  }
}