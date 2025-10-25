'use server';

/**
 * @fileOverview This file defines a Genkit flow for forecasting crop prices for the next 7 days.
 *
 * It includes:
 * - `predictCropPrice`: An exported function that takes a crop name and location as input and returns a price forecast for the next 7 days.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PriceForecastingInputSchema = z.object({
  crop: z.string().describe('The name of the crop to forecast the price for.'),
  location: z.string().describe('The location for which to forecast the price.'),
});
export type PriceForecastingInput = z.infer<typeof PriceForecastingInputSchema>;

const PriceForecastingOutputSchema = z.object({
  prices: z.array(z.number()).describe('An array of predicted prices for the next 7 days.'),
  unit: z.string().describe('The unit of the predicted prices (e.g., ₹/kg).'),
  trend: z.string().describe('The trend of the prices (e.g., increasing, decreasing, stable).'),
});
export type PriceForecastingOutput = z.infer<typeof PriceForecastingOutputSchema>;

export async function predictCropPrice(input: PriceForecastingInput): Promise<PriceForecastingOutput> {
  return priceForecastingFlow(input);
}

const priceForecastingPrompt = ai.definePrompt({
  name: 'priceForecastingPrompt',
  input: {schema: PriceForecastingInputSchema},
  output: {schema: PriceForecastingOutputSchema},
  prompt: `You are an AI assistant that predicts the price of crops for farmers.
  Given the crop name: {{{crop}}} and location: {{{location}}},
  predict the prices for the next 7 days. Also, provide the unit of the predicted prices and the trend of the prices.
  The prices should be in Indian Rupees.
  Ensure that the output is a valid JSON object.`,
});

const priceForecastingFlow = ai.defineFlow(
  {
    name: 'priceForecastingFlow',
    inputSchema: PriceForecastingInputSchema,
    outputSchema: PriceForecastingOutputSchema,
  },
  async input => {
    const {output} = await priceForecastingPrompt(input);
    return output!;
  }
);