'use server';

/**
 * @fileOverview This file defines a Genkit flow for forecasting crop yield and profit.
 *
 * It includes:
 * - `predictYieldAndProfit`: An exported function that takes crop name, area, and location.
 * - `YieldForecastingInput`: The input type for the function.
 * - `YieldForecastingOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YieldForecastingInputSchema = z.object({
  crop: z.string().describe('The name of the crop.'),
  area: z.number().describe('The area of land in acres.'),
  location: z.string().describe('The location of the farm.'),
});
export type YieldForecastingInput = z.infer<typeof YieldForecastingInputSchema>;

const YieldForecastingOutputSchema = z.object({
  expectedYield: z.number().describe('Expected yield in kg/acre.'),
  totalYield: z.number().describe('Total expected yield for the given area in kg.'),
  predictedPrice: z.number().describe('Predicted market price per kg in ₹.'),
  totalIncome: z.number().describe('Total expected income in ₹.'),
  bestSellDate: z.string().describe('Recommended date to sell the produce.'),
  recommendedMandi: z.string().describe('The recommended market (mandi) to sell at.'),
});
export type YieldForecastingOutput = z.infer<typeof YieldForecastingOutputSchema>;

export async function predictYieldAndProfit(input: YieldForecastingInput): Promise<YieldForecastingOutput> {
  return yieldForecastingFlow(input);
}

const yieldForecastingPrompt = ai.definePrompt({
  name: 'yieldForecastingPrompt',
  input: {schema: YieldForecastingInputSchema},
  output: {schema: YieldForecastingOutputSchema},
  prompt: `You are an agricultural AI expert. Based on the crop type '{{{crop}}}', farm area '{{{area}}}' acres, and '{{{location}}}' location, forecast the yield and profit.
  - Predict the expected yield in kg/acre.
  - Calculate the total yield.
  - Predict the market price per kg.
  - Calculate the total potential income.
  - Suggest the best date to sell.
  - Recommend the best mandi (market) for selling.

  Provide realistic but fictional data for an Indian context.
  Ensure the output is a valid JSON object.`,
});

const yieldForecastingFlow = ai.defineFlow(
  {
    name: 'yieldForecastingFlow',
    inputSchema: YieldForecastingInputSchema,
    outputSchema: YieldForecastingOutputSchema,
  },
  async input => {
    const {output} = await yieldForecastingPrompt(input);
    return output!;
  }
);
