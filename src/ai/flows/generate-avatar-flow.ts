'use server';

/**
 * @fileOverview An AI flow to generate a user avatar image.
 *
 * - generateAvatar - A function that generates an avatar image from a text prompt.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateAvatarInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired avatar.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

export const GenerateAvatarOutputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The generated avatar image as a data URI, including MIME type and Base64 encoding. E.g., 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A cute, modern, vector-style avatar for a user profile based on the following prompt: ${prompt}. The background should be a simple, pleasing solid color.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed.');
    }
    
    return { photoDataUri: media.url };
  }
);
