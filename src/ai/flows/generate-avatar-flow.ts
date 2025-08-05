'use server';

/**
 * @fileOverview An AI flow to generate a user avatar image.
 *
 * - generateAvatar - A function that generates an avatar image from a text prompt.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateAvatarInput,
  GenerateAvatarInputSchema,
  GenerateAvatarOutput,
  GenerateAvatarOutputSchema
} from '@/ai/flows/generate-avatar-types';


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
