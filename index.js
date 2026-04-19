import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

const imageData = fs.readFileSync('test-stats.png').toString('base64');

const message = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: imageData,
          },
        },
        {
          type: 'text',
          text: 'Extract the Rainbow Six Siege player stats from this Tracker Network screenshot. Return ONLY a JSON object with these fields: username, kd, winRate, headshotPercentage, matchesPlayed, topOperators (array of operator names if visible). Use null for any field not visible. No explanation, just the JSON.',
        },
      ],
    },
  ],
});

console.log(message.content[0].text);