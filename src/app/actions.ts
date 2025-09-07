
'use server';

import {
  generateAnswerFromDocument,
  GenerateAnswerFromDocumentInput,
  GenerateAnswerFromDocumentOutput,
} from '@/ai/flows/generate-answer-from-document';
import {
  generateAnswer,
  GenerateAnswerInput,
  GenerateAnswerOutput,
} from '@/ai/flows/generate-answer';
import {
  generateSuggestions,
  GenerateSuggestionsInput,
} from '@/ai/flows/generate-suggestions';

// Define a union type for the inputs to make handling them easier.
type AnswerInput = GenerateAnswerFromDocumentInput | GenerateAnswerInput;

// Define a union type for the outputs.
type AnswerOutput =
  | GenerateAnswerFromDocumentOutput
  | GenerateAnswerOutput;

function isDocumentQuestion(
  input: AnswerInput
): input is GenerateAnswerFromDocumentInput {
  return (input as GenerateAnswerFromDocumentInput).documentContent !== undefined;
}

export async function getAnswer(
  input: AnswerInput
): Promise<AnswerOutput | {error: string}> {
  try {
    if (isDocumentQuestion(input)) {
      // The input is for answering from a document.
      return await generateAnswerFromDocument(input);
    } else {
      // The input is for a general question.
      return await generateAnswer(input);
    }
  } catch (e: any) {
    console.error(e);
    return {
      error:
        'Sorry, there was an issue generating an answer. Please check your input and try again.',
    };
  }
}

export async function getSuggestions(
  input: GenerateSuggestionsInput
): Promise<{suggestions?: string[]; error?: string}> {
  try {
    const {suggestions} = await generateSuggestions(input);
    return {suggestions};
  } catch (e: any) {
    console.error(e);
    return {
      error: 'Sorry, there was an issue generating suggestions.',
    };
  }
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    console.log('New contact form submission:', data);
    // Here you would typically save to a database.
    // e.g., await db.collection('contacts').add(data);
    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message:
        'Sorry, there was an error submitting your form. Please try again later.',
    };
  }
}
