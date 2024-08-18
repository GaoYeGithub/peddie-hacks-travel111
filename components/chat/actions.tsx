'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation(history: Message[], prompt:string) {
  'use server';
  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-3.5-turbo'),
      system:
        `You are a helpful travel assistant provide info about the place provided. Return all contents in markdown!
        You are going to be discussing information about this attraction: ${prompt}, and the location around or near it.
        Including the city its in, nearby attractions, hotels, etc..
        `,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}