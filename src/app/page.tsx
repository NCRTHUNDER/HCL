import { Bot, FileText, Share2 } from "lucide-react";
import { DocuQueryForm } from "@/components/docu-query-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <header className="w-full bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary md:text-6xl font-headline">
            Intituas AI
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
            Unlock the knowledge within your documents.
            <br />
            Simply paste your text, ask your questions, and receive intelligent, AI-powered answers instantly.
          </p>
        </div>
      </header>

      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Our platform simplifies information retrieval into three easy steps.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">1. Paste Content</h3>
                  <p className="mt-1 text-muted-foreground">
                    Copy the text from any document—be it a PDF, an article, or your own notes—and paste it into the text area.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">2. Ask a Question</h3>
                  <p className="mt-1 text-muted-foreground">
                    Formulate any question you have about the provided content. The more specific your question, the better the answer.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Share2 className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">3. Get Your Answer</h3>
                  <p className="mt-1 text-muted-foreground">
                    Our AI analyzes the document in context of your question and provides a concise, relevant answer.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
             <Image
                src="https://picsum.photos/600/500"
                alt="AI reading a document"
                width={600}
                height={500}
                className="w-full h-full object-cover"
                data-ai-hint="ai document"
              />
          </div>
        </div>
      </section>
      
      <section id="try-it" className="w-full bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="flex flex-col items-center gap-3 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
              Give it a try
            </h2>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Experience the power of AI-driven document analysis firsthand.
            </p>
          </header>
          <DocuQueryForm />
        </div>
      </section>

      <footer className="w-full py-8 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Intituas AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
