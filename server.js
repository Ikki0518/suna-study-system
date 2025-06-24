import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables from .env (if present)
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// Determine __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, etc.) from the project root
app.use(express.static(path.join(__dirname, '.')));

// ----- API ROUTES -----
app.post('/api/support-ai', async (req, res) => {
  try {
    const { messages, courseContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Base system instructions
    let systemContent = `あなたは「Suna Study System」の学習サポートAIです。\n` +
      `受講生の学習を支援することが目的です。以下のガイドラインに従って回答してください：\n\n` +
      `1. 日本語で丁寧に回答する\n` +
      `2. 学習に関する質問には具体的で分かりやすい説明をする\n` +
      `3. 勉強方法やコツについてアドバイスを提供する\n` +
      `4. 分からない問題には段階的な解法を示す\n` +
      `5. 励ましの言葉を含めて学習意欲を高める\n` +
      `6. 学習以外の質問には適切な範囲で回答し、学習に集中するよう促す\n` +
      `7. 回答は簡潔で理解しやすい形にする`;

    // If lesson context is provided, embed it into the prompt
    if (courseContext) {
      systemContent += `\n\n【現在学習中の講座情報】\n` +
        `講座名: ${courseContext.title || '不明'}\n` +
        `科目: ${courseContext.subject || '不明'}\n` +
        `章: ${courseContext.chapter || '不明'}\n\n` +
        `【講座内容】\n${courseContext.content || '内容が取得できませんでした'}\n\n` +
        `上記の講座内容を踏まえて、受講生の質問に答えてください。講座の内容に関する質問には、この情報を基に詳しく説明してください。`;
    }

    const systemMessage = {
      role: 'system',
      content: systemContent,
    };

    // Compose final message array
    const chatMessages = [systemMessage, ...messages];

    // Call OpenAI Chat Completion (GPT-4o)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'すみません、回答を生成できませんでした。';

    return res.status(200).json({
      reply,
      usage: completion.usage,
      model: 'gpt-4o',
      hasContext: !!courseContext,
    });
  } catch (error) {
    console.error('Support-AI API error:', error);

    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ error: 'APIの使用制限に達しました' });
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'APIキーが無効です' });
    }

    return res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Catch-all for 404 on API routes
app.all('/api/*', (_, res) => res.status(404).json({ error: 'Not Found' }));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Suna Study System server running at http://localhost:${PORT}`);
}); 