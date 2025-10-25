'use server';

/**
 * @fileOverview Predicts price spikes for a given crop across multiple mandis for the Agent Dashboard.
 * 
 * - agentPricePrediction: Predicts future prices and identifies potential spikes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgentPricePredictionInputSchema = z.object({
  crop: z.string().describe('The crop to predict prices for.'),
});
export type AgentPricePredictionInput = z.infer<typeof AgentPricePredictionInputSchema>;

const DailyPriceSchema = z.object({
    day: z.string(),
    price: z.number(),
    isSpike: z.boolean().describe('True if this day represents a significant price spike.'),
});

const MandiPredictionSchema = z.object({
    mandi: z.string(),
    forecast: z.array(DailyPriceSchema),
});

const AgentPricePredictionOutputSchema = z.object({
  predictions: z.array(MandiPredictionSchema),
});
export type AgentPricePredictionOutput = z.infer<typeof AgentPricePredictionOutputSchema>;


export async function agentPricePrediction(input: AgentPricePredictionInput): Promise<AgentPricePredictionOutput> {
  return agentPricePredictionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'agentPricePredictionPrompt',
    input: { schema: AgentPricePredictionInputSchema },
    output: { schema: AgentPricePredictionOutputSchema },
    prompt: `You are an AI market analyst for agricultural commodities in India.
    Given the crop: {{{crop}}}, predict the prices for the next 7 days across the mandis of Pune, Nagpur, Bangalore, and Delhi.
    Identify any significant price spikes (unusually high price increases) in your forecast.
    Provide a realistic but fictional forecast. Prices should be in INR per quintal.
    
    Example for one mandi:
    {
        "mandi": "Pune",
        "forecast": [
            {"day": "Day 1", "price": 2550, "isSpike": false},
            {"day": "Day 2", "price": 2600, "isSpike": false},
            {"day": "Day 3", "price": 2950, "isSpike": true},
            {"day": "Day 4", "price": 2800, "isSpike": false},
            {"day": "Day 5", "price": 2850, "isSpike": false},
            {"day": "Day 6", "price": 2900, "isSpike": false},
            {"day": "Day 7", "price": 2920, "isSpike": false}
        ]
    }
    
    Generate predictions for all four mandis. Ensure the output is a valid JSON object.`,
});


const agentPricePredictionFlow = ai.defineFlow(
  {
    name: 'agentPricePredictionFlow',
    inputSchema: AgentPricePredictionInputSchema,
    outputSchema: AgentPricePredictionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);