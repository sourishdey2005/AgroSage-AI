'use server';

/**
 * @fileOverview An AI chatbot flow that provides assistance to farmers by answering questions about farming practices and market trends.
 *
 * - agrobotAssistance - A function that handles the chatbot assistance process.
 * - AgrobotAssistanceInput - The input type for the agrobotAssistance function.
 * - AgrobotAssistanceOutput - The return type for the agrobotAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgrobotAssistanceInputSchema = z.object({
  query: z.string().describe('The question or query from the farmer.'),
});
export type AgrobotAssistanceInput = z.infer<typeof AgrobotAssistanceInputSchema>;

const AgrobotAssistanceOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot.'),
});
export type AgrobotAssistanceOutput = z.infer<typeof AgrobotAssistanceOutputSchema>;

export async function agrobotAssistance(input: AgrobotAssistanceInput): Promise<AgrobotAssistanceOutput> {
  return agrobotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agrobotAssistancePrompt',
  input: {schema: AgrobotAssistanceInputSchema},
  output: {schema: AgrobotAssistanceOutputSchema},
  prompt: `You are an AI chatbot named AgroBot designed to assist farmers with their queries.
  Provide informative and helpful responses related to farming practices, market trends, and crop management.
  Use the following question to formulate your response:

  Question: {{{query}}}
  `,
});

const agrobotAssistanceFlow = ai.defineFlow(
  {
    name: 'agrobotAssistanceFlow',
    inputSchema: AgrobotAssistanceInputSchema,
    outputSchema: AgrobotAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
