# **App Name**: DocuQuery

## Core Features:

- Document Upload & Parsing: Allow users to upload PDF and Markdown files for analysis.
- Text Chunking & Embedding: Automatically chunk the text content into smaller segments and create vector embeddings for efficient retrieval. Uses prebuilt embeddings and vector store (such as FAISS or ChromaDB) due to not including database components.
- Question Embedding: Embed the user's question upon submission to retrieve related chunks using vector similarity search.
- Retrieval-Augmented Generation: Leverage the LLM as a tool, incorporating retrieved document chunks to generate accurate and relevant answers based on the document content.
- Answer Display: Presents generated answers to users in a readable and understandable format, using UI elements.
- Reference Citations: Display snippets from the document relevant to the answer inline in the UI.

## Style Guidelines:

- Primary color: Slate blue (#708090) to evoke feelings of knowledge and neutrality.
- Background color: Light gray (#F0F8FF) for a clean and unobtrusive background.
- Accent color: Teal (#008080) for important UI elements.
- Body and headline font: 'Inter' sans-serif for clear readability and a modern feel.
- Code font: 'Source Code Pro' for displaying any extracted code snippets.
- Simple, single-column layout for ease of use and focused content consumption.
- Subtle loading animations and transitions for a smooth user experience.