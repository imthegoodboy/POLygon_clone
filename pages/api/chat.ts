import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant for Polymarket Pro, a decentralized prediction market platform. 
          Help users understand:
          - How prediction markets work (users bet on real-world events)
          - How to connect their wallet (MetaMask)
          - How to place bets (Yes or No on market outcomes)
          - What POLY tokens are (the platform's currency)
          - How markets are created and resolved
          - Portfolio management and tracking wins
          Keep responses concise, friendly, and informative.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_completion_tokens: 300,
    });

    const reply = response.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Failed to get response from AI' });
  }
}
