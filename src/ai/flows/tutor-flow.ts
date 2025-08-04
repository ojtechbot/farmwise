'use server';

/**
 * @fileOverview An AI tutor flow for the FarmWise platform.
 *
 * - tutor - A function that provides AI-driven tutoring to a user.
 * - TutorInput - The input type for the tutor function.
 * - TutorOutput - The return type for the tutor function.
 * - ChatMessage - A type for individual chat messages.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const TutorInputSchema = z.object({
  lessonTitle: z.string().describe('The title of the current lesson.'),
  lessonContent: z.string().describe('The full text content of the current lesson.'),
  userProfile: z.object({
    displayName: z.string().optional().describe("The user's name."),
    interests: z.string().optional().describe("The user's stated interests."),
  }),
  learningProgress: z.string().describe('A summary of the modules and quizzes the user has completed.'),
  chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
  userMessage: z.string().describe('The latest message from the user.'),
});
export type TutorInput = z.infer<typeof TutorInputSchema>;

const TutorOutputSchema = z.object({
  tutorResponse: z.string().describe("The AI tutor's response to the user."),
});
export type TutorOutput = z.infer<typeof TutorOutputSchema>;

export async function tutor(input: TutorInput): Promise<TutorOutput> {
  return tutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tutorPrompt',
  input: {schema: TutorInputSchema},
  output: {schema: TutorOutputSchema},
  prompt: `You are FarmWise Tutor, an expert AI assistant specializing in agriculture and aquaculture. Your goal is to help users learn effectively. You are friendly, encouraging, and an expert in breaking down complex topics.

  Your current student is {{userProfile.displayName}}, who is interested in {{userProfile.interests}}.
  Their progress so far: {{learningProgress}}.

  You are tutoring them on the lesson: "{{lessonTitle}}".
  Here is the lesson content:
  ---
  {{{lessonContent}}}
  ---

  Below is the conversation history. The user's latest message is at the end.
  {{#each chatHistory}}
  **{{role}}**: {{{content}}}
  {{/each}}
  **user**: {{{userMessage}}}

  Based on the lesson content and the conversation, provide a helpful and encouraging response to the user.
  - If the user asks a question, answer it clearly using the lesson content as the primary source.
  - If the user is confused, break down the concept into simpler terms.
  - If the user is seeking more information, provide relevant details or suggest what to focus on next in the lesson.
  - Keep your responses concise and focused on the user's message.
  - Address the user by name ({{userProfile.displayName}}) when appropriate.
  - Do not ask what they want to do next, instead, provide a clear explanation or answer and encourage them to ask more questions if they have any.
  `,
});

const tutorFlow = ai.defineFlow(
  {
    name: 'tutorFlow',
    inputSchema: TutorInputSchema,
    outputSchema: TutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
