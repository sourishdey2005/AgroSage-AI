'use server';
/**
 * @fileOverview An AI policy advisor for government officials that recommends policy adjustments based on current agricultural data.
 *
 * - getPolicyRecommendation - A function that retrieves policy recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyAdvisorInputSchema = z.object({
  districtWiseYieldIndex: z.string().describe('Ranked visualization of yield by district.'),
  mspComplianceChart: z.string().describe('Comparison of current vs. MSP prices.'),
  complaintHeatmap: z.string().describe('NLP sentiment map of farmer grievances.'),
});
export type PolicyAdvisorInput = z.infer<typeof PolicyAdvisorInputSchema>;

const PolicyRecommendationOutputSchema = z.object({
  policyRecommendation: z.string().describe('Recommended policy adjustments.'),
});
export type PolicyRecommendationOutput = z.infer<typeof PolicyRecommendationOutputSchema>;

export async function getPolicyRecommendation(input: PolicyAdvisorInput): Promise<PolicyRecommendationOutput> {
  return policyAdvisorFlow(input);
}

const policyAdvisorPrompt = ai.definePrompt({
  name: 'policyAdvisorPrompt',
  input: {schema: PolicyAdvisorInputSchema},
  output: {schema: PolicyRecommendationOutputSchema},
  prompt: `You are an AI policy advisor for government officials. Based on the current agricultural data, provide a policy recommendation.

District-Wise Yield Index: {{{districtWiseYieldIndex}}}
MSP Compliance Chart: {{{mspComplianceChart}}}
Complaint Heatmap: {{{complaintHeatmap}}}

Policy Recommendation:`,
});

const policyAdvisorFlow = ai.defineFlow(
  {
    name: 'policyAdvisorFlow',
    inputSchema: PolicyAdvisorInputSchema,
    outputSchema: PolicyRecommendationOutputSchema,
  },
  async input => {
    const {output} = await policyAdvisorPrompt(input);
    return output!;
  }
);