// AI Service — supports real OpenAI API or simulated streaming fallback

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function getApiKey(): string | null {
  return localStorage.getItem('openai_api_key');
}

export function setApiKey(key: string) {
  localStorage.setItem('openai_api_key', key);
}

// Simulate streaming when no API key is configured
async function* simulateStream(prompt: string, delayMs = 28): AsyncGenerator<string> {
  const responses: Record<string, string> = {
    default: "I'd be happy to help you with your document. Here's what I suggest: start with a clear structure, use concise language, and ensure each paragraph has a single focus. Consider adding subheadings to improve readability and guide the reader through your content.",
    improve: "Here's an improved version of your text with better flow and clarity. The key changes include stronger word choices, tighter sentence structure, and more engaging transitions between ideas.",
    summarize: "Summary: The document covers key topics with supporting evidence. Main points include the core argument, relevant context, and actionable conclusions drawn from the analysis.",
    expand: "Expanding on this concept: there are several dimensions worth exploring in depth. First, consider the historical context and how it shapes current understanding. Second, examine the practical implications for real-world applications. Third, explore alternative perspectives that challenge conventional thinking.",
    shorten: "Concise version: The main point is clear and direct. Key details are preserved while unnecessary filler is removed.",
    grammar: "Grammar and style corrections applied. Sentence structure improved, punctuation standardized, and clarity enhanced throughout the selected text.",
  };

  const key = Object.keys(responses).find(k => prompt.toLowerCase().includes(k)) || 'default';
  const text = responses[key];
  const words = text.split(' ');

  for (const word of words) {
    yield word + ' ';
    await new Promise(r => setTimeout(r, delayMs));
  }
}

// Real OpenAI streaming
async function* openAIStream(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): AsyncGenerator<string> {
  const apiKey = getApiKey();
  if (!apiKey) { yield* simulateStream(messages[messages.length - 1]?.content || ''); return; }

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, stream: true, max_tokens: 800 }),
  });

  if (!res.ok || !res.body) { yield* simulateStream(messages[messages.length - 1]?.content || ''); return; }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const token = json.choices?.[0]?.delta?.content;
        if (token) yield token;
      } catch { /* skip malformed */ }
    }
  }
}

export interface ChatMessage { role: 'user' | 'assistant'; content: string; }

// Main AI completion — returns async generator of token strings
export async function* streamCompletion(
  userPrompt: string,
  context?: string,
  history: ChatMessage[] = []
): AsyncGenerator<string> {
  const systemPrompt = `You are an AI writing assistant embedded in Open Documents, a Google Docs alternative. 
Help users write, edit, improve, and analyze their documents. Be concise and helpful.
${context ? `\nDocument context:\n"""\n${context.slice(0, 1200)}\n"""` : ''}`;

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })),
    { role: 'user', content: userPrompt },
  ];

  yield* openAIStream(messages);
}

// Quick one-shot actions for the floating bar
export const AI_ACTIONS = [
  { id: 'improve', label: 'Improve writing', prompt: 'Improve the writing quality, clarity and flow of this text: ' },
  { id: 'summarize', label: 'Summarize', prompt: 'Summarize the following text concisely: ' },
  { id: 'expand', label: 'Expand', prompt: 'Expand and elaborate on the following text with more detail: ' },
  { id: 'shorten', label: 'Make shorter', prompt: 'Make this text more concise while keeping the key points: ' },
  { id: 'grammar', label: 'Fix grammar', prompt: 'Fix all grammar, spelling, and punctuation errors in: ' },
  { id: 'formal', label: 'Make formal', prompt: 'Rewrite this text in a more formal, professional tone: ' },
  { id: 'casual', label: 'Make casual', prompt: 'Rewrite this text in a more casual, conversational tone: ' },
  { id: 'translate', label: 'Translate to English', prompt: 'Translate the following text to English: ' },
] as const;
