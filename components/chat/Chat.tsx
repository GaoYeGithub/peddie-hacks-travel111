'use client';

import { useState } from 'react';
import { Message, continueConversation } from './actions';
import { readStreamableValue } from 'ai/rsc';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Markdown from 'react-markdown';
import { Ellipsis } from 'lucide-react';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat({prompt}:{prompt:string}) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  return (
    <div className="flex flex-col h-screen">
      <p className='text-3xl font-bold text-center'>{prompt}</p>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
                <Markdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1 pl-1" {...props} />,
                }}
              >
              {message.content}
              </Markdown>
            </div>
          </div>
        ))}
          {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-black p-3 rounded-lg">
            <Ellipsis className='animate-pulse' />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={input}
            onChange={event => {
              setInput(event.target.value);
            }}
            className="flex-1"
            placeholder="Type your message..."
          />
          <Button
            onClick={async () => {
              setConversation(prev => [...prev, { role: 'user', content: input },
              ]);
              setIsTyping(true)
              const { messages, newMessage } = await continueConversation([
                ...conversation,
                { role: 'user', content: input }
              ], prompt);
              setInput('');
              let textContent = '';
              for await (const delta of readStreamableValue(newMessage)) {
                textContent = `${textContent}${delta}`;
                setConversation([
                  ...messages,
                  { role: 'assistant', content: textContent },
                ]);
              }
              setIsTyping(false)

            }}
            
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}