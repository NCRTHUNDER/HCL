import { Bot, FileText, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="w-full px-4 md:px-6 py-4 flex items-center justify-between fixed top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight font-headline">
            Intituas AI
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">
              Login
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button>
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-24 lg:pt-56 lg:pb-32 relative">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-background -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-4">
                   <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">AI-Powered Analysis</div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
                    Unlock Insights from Your Documents
                  </h1>
                  <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                    Intituas AI transforms your documents into interactive knowledge bases. Ask questions in natural language and get instant, intelligent answers.
                  </p>
                </div>
                <div className="flex justify-center flex-col gap-4 min-[400px]:flex-row">
                  <Link href="/chat">
                    <Button size="lg">
                      Try the Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                   <Link href="/signup">
                    <Button size="lg" variant="outline">
                      Get Started for Free
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-semibold">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies information retrieval into three easy steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg">
                <div className="flex justify-center items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FileText className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">1. Upload Document</h3>
                <p className="text-muted-foreground">
                  Securely upload any document format - PDF, DOCX, TXT, and more. Your data is encrypted and private.
                </p>
              </div>
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg">
                 <div className="flex justify-center items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">2. Ask Anything</h3>
                <p className="text-muted-foreground">
                  Ask complex questions in plain English. Our AI understands context and delivers precise answers.
                </p>
              </div>
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg">
                <div className="flex justify-center items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ArrowRight className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">3. Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive instant, accurate answers with references to the source text. No more manual searching.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <div className="container flex items-center justify-between px-4 md:px-6">
            <p className="text-sm text-muted-foreground">&copy; 2024 Intituas AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
