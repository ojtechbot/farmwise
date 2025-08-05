/**
 * @fileOverview Types and schemas for the avatar generation AI flow.
 */

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
