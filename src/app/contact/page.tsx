import { ContactForm } from "@/components/contact-form";
import Link from 'next/link';
import { ThemeToggle } from "@/components/theme-toggle";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-lg">Intituas AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="flex-1 w-full container mx-auto max-w-2xl py-12 md:py-20">
          <div className="space-y-4 text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Contact Us</h1>
            <p className="text-muted-foreground md:text-xl">
              Have a question or want to work with us? Drop us a message.
            </p>
          </div>
          <ContactForm />
      </div>
    </main>
  );
}
