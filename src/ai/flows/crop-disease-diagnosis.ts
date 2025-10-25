'use server';

/**
 * @fileOverview Crop disease diagnosis AI agent.
 *
 * - diagnoseCropDisease - A function that handles the crop disease diagnosis process.
 * - DiagnoseCropDiseaseInput - The input type for the diagnoseCropDisease function.
 * - DiagnoseCropDiseaseOutput - The return type for the diagnoseCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseCropDiseaseInput = z.infer<typeof DiagnoseCropDiseaseInputSchema>;

const DiagnoseCropDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease, or null if no disease is detected.'),
  severity: z.string().describe('The severity of the disease (e.g., low, medium, high).'),
  confidence: z.number().describe('The confidence level of the disease detection (0-1).'),
  treatmentSuggestion: z.string().describe('A suggested treatment for the detected disease.'),
});
export type DiagnoseCropDiseaseOutput = z.infer<typeof DiagnoseCropDiseaseOutputSchema>;

export async function diagnoseCropDisease(input: DiagnoseCropDiseaseInput): Promise<DiagnoseCropDiseaseOutput> {
  return diagnoseCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: {schema: DiagnoseCropDiseaseInputSchema},
  output: {schema: DiagnoseCropDiseaseOutputSchema},
  prompt: `You are an AI assistant specialized in diagnosing crop diseases from images.

  Analyze the provided crop image and identify any diseases present.
  If a disease is detected, provide the disease name, severity (low, medium, high), and a confidence level (0-1).
  Also, suggest a treatment for the detected disease.
  If no disease is detected, set diseaseName to null and provide a message indicating that the crop appears healthy.

  Here is the crop image:
  {{media url=photoDataUri}}
  Response in JSON:
  {
    "diseaseName": "string",
    "severity": "string",
    "confidence": number,
    "treatmentSuggestion": "string"
  }`,
});

const diagnoseCropDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseCropDiseaseFlow',
    inputSchema: DiagnoseCropDiseaseInputSchema,
    outputSchema: DiagnoseCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
