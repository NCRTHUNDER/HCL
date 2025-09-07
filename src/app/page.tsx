import { Bot, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                    Intituas AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Unlock the knowledge within your documents. Simply paste your text, ask your questions, and receive
                    intelligent, AI-powered answers instantly.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/chat">
                    <Button size="lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                height="550"
                src="https://picsum.photos/550/310"
                width="550"
                data-ai-hint="ai document"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies information retrieval into three easy steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold">1. Paste Content</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Copy the text from any document—be it a PDF, an article, or your own notes—and paste it into the
                  text area.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold">2. Ask a Question</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Formulate any question you have about the provided content. The more specific your question, the
                  better the answer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold">3. Get Your Answer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes the document in context of your question and provides a concise, relevant answer.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/chat">
                <Button size="lg">
                  Try it now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center w-full h-16 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Intituas AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
