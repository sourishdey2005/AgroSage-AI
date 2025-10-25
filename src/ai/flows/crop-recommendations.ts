'use server';

/**
 * @fileOverview Provides AI-driven crop recommendations based on market trends.
 * 
 * - getCropRecommendations: Returns a list of crops with high demand potential.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendationSchema = z.object({
  crop: z.string().describe('The name of the recommended crop.'),
  reason: z.string().describe('The reason for the recommendation (e.g., market trend, seasonal demand).'),
  demandScore: z.number().min(1).max(10).describe('A score from 1-10 indicating the current demand level.'),
});

const CropRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema),
});
export type CropRecommendationsOutput = z.infer<typeof CropRecommendationsOutputSchema>;

export async function getCropRecommendations(): Promise<CropRecommendationsOutput> {
  return cropRecommendationsFlow();
}

const prompt = ai.definePrompt({
    name: 'cropRecommendationsPrompt',
    output: { schema: CropRecommendationsOutputSchema },
    prompt: `You are an AI agricultural market analyst. Based on simulated market data, upcoming festivals, and export trends, recommend three crops that have high demand potential right now in India.
    
    For each crop, provide a brief reason for the recommendation and a demand score from 1 to 10.
    
    Example response format:
    {
      "recommendations": [
        { "crop": "Mango", "reason": "High seasonal demand for summer and export potential.", "demandScore": 9 },
        { "crop": "Cotton", "reason": "Increased demand from textile industry post-monsoon.", "demandScore": 8 },
        { "crop": "Marigold", "reason": "Upcoming festival season driving demand for flowers.", "demandScore": 10 }
      ]
    }
    
    Generate three unique and realistic recommendations. Ensure the output is a valid JSON object.`,
});

const cropRecommendationsFlow = ai.defineFlow(
  {
    name: 'cropRecommendationsFlow',
    outputSchema: CropRecommendationsOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
