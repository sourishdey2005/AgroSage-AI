'use server';

/**
 * @fileOverview Analyzes crop suitability across different regions for the Agent Dashboard.
 * 
 * - getCropSuitability: Returns a suitability analysis for various crops and districts.
 * - CropSuitabilityOutput: Output schema for the analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';


const SuitabilityEntrySchema = z.object({
    district: z.string(),
    crop: z.string(),
    suitabilityScore: z.number().min(0).max(100).describe('A score from 0 to 100 indicating suitability.'),
    remark: z.string().describe('A brief AI-generated comment on why the crop is or is not suitable.'),
});

export const CropSuitabilityOutputSchema = z.object({
  suitabilityMap: z.array(SuitabilityEntrySchema),
});
export type CropSuitabilityOutput = z.infer<typeof CropSuitabilityOutputSchema>;


export async function getCropSuitability(): Promise<CropSuitabilityOutput> {
  return cropSuitabilityFlow();
}

const prompt = ai.definePrompt({
    name: 'cropSuitabilityPrompt',
    output: { schema: CropSuitabilityOutputSchema },
    prompt: `You are an AI agricultural analyst. Generate a crop suitability map for India.
    Consider the districts: Pune, Nagpur, Lucknow, Bangalore, Delhi.
    Consider the crops: Wheat, Rice, Cotton, Sugarcane, Soybean.
    
    For each district-crop combination, provide a suitability score (0-100) and a brief remark based on fictional environmental factors (e.g., soil type, climate, water availability).
    
    Example for one entry:
    {
        "district": "Pune",
        "crop": "Sugarcane",
        "suitabilityScore": 85,
        "remark": "Well-suited due to black soil and moderate rainfall."
    }
    
    Generate a total of 25 entries (5 districts x 5 crops). Ensure the output is a valid JSON object.`,
});


const cropSuitabilityFlow = ai.defineFlow(
  {
    name: 'cropSuitabilityFlow',
    outputSchema: CropSuitabilityOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
