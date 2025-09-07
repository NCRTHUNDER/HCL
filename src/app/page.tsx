import { FileText, ArrowRight, LogIn, Share2, MessageSquare, ShieldCheck, BrainCircuit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="w-full px-4 md:px-6 py-4 flex items-center justify-between fixed top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          
          <h1 className="text-xl font-bold tracking-tight font-headline">
            Intituas AI
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/contact">
            <Button variant="ghost">
              Contact
            </Button>
          </Link>
          <Link href="/chat">
            <Button>
              Try the Demo
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
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
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
                  Our platform simplifies information retrieval into four easy steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16 mt-12">
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg hover:-translate-y-2">
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
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg hover:-translate-y-2">
                 <div className="flex justify-center items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">2. Ask Anything</h3>
                <p className="text-muted-foreground">
                  Ask complex questions in plain English. Our AI understands context and delivers precise answers instantly.
                </p>
              </div>
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg hover:-translate-y-2">
                <div className="flex justify-center items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">3. Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive accurate answers with references to the source text. No more manual searching.
                </p>
              </div>
              <div className="grid gap-4 text-center p-6 rounded-lg transition-all hover:bg-background/50 hover:shadow-lg hover:-translate-y-2">
                <div className="flex justify-center items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Share2 className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold">4. Share & Export</h3>
                <p className="text-muted-foreground">
                  Easily export conversations or share your findings with colleagues for seamless collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
               <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">Why Choose Us?</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                The Smartest Way to Interact with Your Documents
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform leverages cutting-edge AI to provide an unparalleled analysis experience.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-4 sm:max-w-5xl sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0">
              <div className="grid gap-2 text-center p-6 rounded-lg transition-all hover:bg-secondary/50 hover:shadow-lg">
                <ShieldCheck className="w-10 h-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Secure and Private</h3>
                <p className="text-sm text-muted-foreground">Your documents are encrypted and processed in a secure environment. We prioritize your privacy.</p>
              </div>
              <div className="grid gap-2 text-center p-6 rounded-lg transition-all hover:bg-secondary/50 hover:shadow-lg">
                <BrainCircuit className="w-10 h-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Powerful AI Engine</h3>
                <p className="text-sm text-muted-foreground">Powered by advanced LLMs, our AI understands context, nuance, and complex queries.</p>
              </div>
              <div className="grid gap-2 text-center p-6 rounded-lg transition-all hover:bg-secondary/50 hover:shadow-lg">
                <Users className="w-10 h-10 mx-auto text-primary" />
                <h3 className="text-lg font-bold">Built for Collaboration</h3>
                <p className="text-sm text-muted-foreground">Easily share insights and collaborate with your team to make data-driven decisions faster.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Dive In?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Try the interactive demo and start transforming your documents into actionable knowledge.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
                <Link href="/chat">
                    <Button size="lg">
                        Try the Demo
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <div className="container flex items-center justify-between px-4 md:px-6">
            <p className="text-sm text-muted-foreground">&copy; 2025 Intituas AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}
