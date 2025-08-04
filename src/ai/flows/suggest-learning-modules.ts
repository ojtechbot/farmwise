'use server';

/**
 * @fileOverview AI flow to suggest relevant learning modules based on user profile and progress.
 *
 * - suggestLearningModules - Function to suggest learning modules.
 * - SuggestLearningModulesInput - Input type for suggestLearningModules function.
 * - SuggestLearningModulesOutput - Output type for suggestLearningModules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLearningModulesInputSchema = z.object({
  userProfile: z
    .string()
    .describe('Description of the user, their farming experience, and interests.'),
  learningProgress: z
    .string()
    .describe('The user current learning progress and completed modules.'),
  availableModules: z.string().describe('A list of available learning modules.'),
});
export type SuggestLearningModulesInput = z.infer<
  typeof SuggestLearningModulesInputSchema
>;

const SuggestLearningModulesOutputSchema = z.object({
  suggestedModules: z
    .string()
    .describe('A list of suggested learning modules tailored to the user.'),
  reasoning: z
    .string()
    .describe('Explanation of why these modules were suggested.'),
});
export type SuggestLearningModulesOutput = z.infer<
  typeof SuggestLearningModulesOutputSchema
>;

export async function suggestLearningModules(
  input: SuggestLearningModulesInput
): Promise<SuggestLearningModulesOutput> {
  return suggestLearningModulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLearningModulesPrompt',
  input: {schema: SuggestLearningModulesInputSchema},
  output: {schema: SuggestLearningModulesOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant learning modules for farmers.

  Based on the farmer's profile, their current learning progress, and available modules, recommend the most helpful modules for their specific needs.

  Farmer Profile: {{{userProfile}}}
  Learning Progress: {{{learningProgress}}}
  Available Modules: {{{availableModules}}}

  Consider the farmer's experience level, interests, and any specific challenges they may be facing.
  Explain why you are suggesting these specific modules and how they can benefit the farmer.

  Output the suggested modules and reasoning in a JSON format.
  `,
});

const suggestLearningModulesFlow = ai.defineFlow(
  {
    name: 'suggestLearningModulesFlow',
    inputSchema: SuggestLearningModulesInputSchema,
    outputSchema: SuggestLearningModulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
