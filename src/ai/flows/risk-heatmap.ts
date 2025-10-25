'use server';

/**
 * @fileOverview Generates a risk heatmap for various crops.
 * 
 * - getRiskHeatmap: Returns risk analysis data for crops.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RiskEntrySchema = z.object({
  crop: z.string(),
  diseaseRisk: z.number().min(1).max(10).describe('A score from 1-10 indicating disease risk.'),
  supplyChainRisk: z.number().min(1).max(10).describe('A score from 1-10 indicating supply chain fragility.'),
  marketVolatility: z.number().min(1).max(10).describe('A score from 1-10 indicating price volatility.'),
  overallRisk: z.number().min(1).max(10).describe('A weighted average of all risks.'),
});

const RiskHeatmapOutputSchema = z.object({
  riskData: z.array(RiskEntrySchema),
});
export type RiskHeatmapOutput = z.infer<typeof RiskHeatmapOutputSchema>;

export async function getRiskHeatmap(): Promise<RiskHeatmapOutput> {
  return riskHeatmapFlow();
}

const prompt = ai.definePrompt({
    name: 'riskHeatmapPrompt',
    output: { schema: RiskHeatmapOutputSchema },
    prompt: `You are an AI agricultural risk analyst. Generate a risk heatmap for the following crops: Tomato, Onion, Wheat, Potato, Rice, Sugarcane, Cotton.
    
    For each crop, provide a risk score (1-10, where 10 is highest risk) for:
    1.  Disease Risk (susceptibility to common diseases)
    2.  Supply Chain Risk (fragility due to transport, storage needs)
    3.  Market Volatility (price fluctuation)
    4.  Overall Risk (a weighted average)

    Provide realistic but fictional scores based on general knowledge of these crops in the Indian context.
    
    Example for one crop:
    {
        "crop": "Tomato",
        "diseaseRisk": 7,
        "supplyChainRisk": 8,
        "marketVolatility": 9,
        "overallRisk": 8
    }
    
    Generate entries for all listed crops. Ensure the output is a valid JSON object.`,
});

const riskHeatmapFlow = ai.defineFlow(
  {
    name: 'riskHeatmapFlow',
    outputSchema: RiskHeatmapOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
