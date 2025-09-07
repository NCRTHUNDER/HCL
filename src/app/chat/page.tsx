import { DocuQueryForm } from "@/components/docu-query-form";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-secondary">
       <header className="w-full bg-background py-4 border-b">
        <div className="container mx-auto max-w-5xl px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
            Intituas AI
          </h1>
        </div>
      </header>
      
      <section id="try-it" className="w-full flex-1 py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="flex flex-col items-center gap-3 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
              Query Your Document
            </h2>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Experience the power of AI-driven document analysis firsthand.
            </p>
          </header>
          <DocuQueryForm />
        </div>
      </section>

      <footer className="w-full py-6 bg-background border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Intituas AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
