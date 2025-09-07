import { FileQuestion } from "lucide-react";
import { DocuQueryForm } from "@/components/docu-query-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="container mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:py-20">
        <header className="flex flex-col items-center gap-3 text-center">
          <FileQuestion className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
            DocuQuery
          </h1>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Paste your document content, ask a question, and get an intelligent, context-aware answer powered by AI.
          </p>
        </header>

        <div className="w-full">
          <DocuQueryForm />
        </div>
      </div>
    </main>
  );
}
