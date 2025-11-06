import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { messages, conversations, artifacts } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { eq, and } from 'drizzle-orm';

export const runtime = 'edge';

// Simple simulated AI response with artifact detection
function generateAIResponse(userMessage: string): {
  text: string;
  artifacts: Array<{
    title: string;
    type: string;
    language?: string;
    content: string;
  }>;
} {
  const lowerMessage = userMessage.toLowerCase();

  // Detect code requests
  if (
    lowerMessage.includes('code') ||
    lowerMessage.includes('function') ||
    lowerMessage.includes('component')
  ) {
    if (lowerMessage.includes('react') || lowerMessage.includes('component')) {
      return {
        text: "I'll create a React component for you. Here's a simple example:",
        artifacts: [
          {
            title: 'React Counter Component',
            type: 'react',
            language: 'tsx',
            content: `function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-8 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Counter</h2>
        <div className="text-4xl font-bold text-blue-600 mb-4">{count}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Increment
          </button>
          <button
            onClick={() => setCount(count - 1)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Decrement
          </button>
          <button
            onClick={() => setCount(0)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById('root'));`,
          },
        ],
      };
    } else if (lowerMessage.includes('html')) {
      return {
        text: "I'll create an HTML page for you:",
        artifacts: [
          {
            title: 'Beautiful Landing Page',
            type: 'html',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beautiful Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 1.1em;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome! 👋</h1>
        <p>This is a beautiful landing page created with HTML and CSS. Click the button below to see the magic!</p>
        <button onclick="alert('Hello from Claude AI Clone! 🚀')">Click Me!</button>
    </div>
</body>
</html>`,
          },
        ],
      };
    } else if (lowerMessage.includes('mermaid') || lowerMessage.includes('diagram')) {
      return {
        text: "I'll create a Mermaid diagram for you:",
        artifacts: [
          {
            title: 'System Architecture Diagram',
            type: 'mermaid',
            language: 'mermaid',
            content: `graph TD
    A[User] -->|Sends Request| B[Next.js Frontend]
    B -->|API Call| C[API Routes]
    C -->|Query| D[Drizzle ORM]
    D -->|SQL| E[(PostgreSQL)]
    E -->|Data| D
    D -->|Results| C
    C -->|Response| B
    B -->|Renders| A

    style A fill:#667eea,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#764ba2,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#48bb78,stroke:#333,stroke-width:2px,color:#fff`,
          },
        ],
      };
    } else {
      return {
        text: "Here's a JavaScript code example:",
        artifacts: [
          {
            title: 'JavaScript Function Example',
            type: 'code',
            language: 'javascript',
            content: `// Example function to demonstrate code artifact
function fibonacci(n) {
  if (n <= 1) return n;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}

// Usage example
console.log('Fibonacci sequence:');
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
          },
        ],
      };
    }
  }

  // Default response
  return {
    text: `I understand you said: "${userMessage}". This is a simulated AI response. In production, this would connect to an actual AI API like OpenAI or Anthropic.

Try asking me to create:
- "Create a React component"
- "Show me HTML code"
- "Generate a Mermaid diagram"
- "Write some JavaScript code"`,
    artifacts: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then((mod) => mod.headers()),
    });

    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { content, conversationId } = body;

    if (!content || !conversationId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify conversation belongs to user
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, conversationId), eq(conversations.userId, session.user.id)));

    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create user message
    const [userMessage] = await db
      .insert(messages)
      .values({
        content,
        conversationId,
        userId: session.user.id,
        role: 'user',
      })
      .returning();

    // Generate AI response with artifacts
    const aiResponse = generateAIResponse(content);

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream the text response word by word
        const words = aiResponse.text.split(' ');

        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`)
          );
          // Simulate delay for streaming effect
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Save assistant message
        const [assistantMessage] = await db
          .insert(messages)
          .values({
            content: aiResponse.text,
            conversationId,
            userId: session.user.id,
            role: 'assistant',
          })
          .returning();

        // Create artifacts if any
        if (aiResponse.artifacts.length > 0) {
          for (const artifact of aiResponse.artifacts) {
            const [createdArtifact] = await db
              .insert(artifacts)
              .values({
                title: artifact.title,
                type: artifact.type,
                language: artifact.language,
                content: artifact.content,
                messageId: assistantMessage.id,
                userId: session.user.id,
              })
              .returning();

            // Send artifact data
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'artifact', artifact: createdArtifact })}\n\n`
              )
            );
          }
        }

        // Update conversation timestamp
        await db
          .update(conversations)
          .set({ updatedAt: new Date() })
          .where(eq(conversations.id, conversationId));

        // Send completion signal
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'done', messageId: assistantMessage.id })}\n\n`
          )
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Streaming error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
