'use server';

import {
  generateAnswerFromDocument,
  GenerateAnswerFromDocumentInput,
} from '@/ai/flows/generate-answer-from-document';
import { generateAnswer, GenerateAnswerInput } from '@/ai/flows/generate-answer';
import { auth, db } from '@/lib/firebase-admin';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, writeBatch } from 'firebase/firestore';


async function saveSearchHistory(userId: string, question: string, answer: string) {
    if (!userId) return;

    const historyCollection = collection(db, 'searchHistory');
    
    // Add new history entry
    await addDoc(historyCollection, {
        userId,
        question,
        answer,
        createdAt: serverTimestamp(),
    });

    // Enforce a limit of 5 history items
    const q = query(
        historyCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 5) {
        const batch = writeBatch(db);
        const docsToDelete = querySnapshot.docs.slice(5);
        docsToDelete.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
}


export async function getAnswer(
  input: (GenerateAnswerFromDocumentInput | GenerateAnswerInput) & { userId?: string }
): Promise<{ answer: string } | { error: string }> {
  try {
    let output;
    if ('documentContent' in input && input.documentContent) {
       output = await generateAnswerFromDocument(input as GenerateAnswerFromDocumentInput);
    } else {
        output = await generateAnswer(input as GenerateAnswerInput);
    }

    if(input.userId) {
        await saveSearchHistory(input.userId, input.question, output.answer);
    }

    return { answer: output.answer };

  } catch (e: any) {
    console.error(e);
    return { error: 'Sorry, there was an issue generating an answer. Please check your input and try again.' };
  }
}

interface ContactFormInput {
    name: string;
    email: string;
    message: string;
}

export async function submitContactForm(input: ContactFormInput): Promise<{ success: boolean; message: string }> {
    try {
        const contactsCollection = collection(db, 'contacts');
        await addDoc(contactsCollection, {
            ...input,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: 'Thank you for your message! We will get back to you soon.' };
    } catch (error) {
        console.error('Error saving contact form submission:', error);
        return { success: false, message: 'Sorry, there was an issue submitting your form. Please try again later.' };
    }
}
