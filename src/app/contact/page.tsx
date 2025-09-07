import { Bot } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="w-full px-4 md:px-6 py-4 flex items-center justify-between fixed top-0 z-50 bg-background/80 backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-2">
                
                <h1 className="text-xl font-bold tracking-tight font-headline">
                    Intituas AI
                </h1>
                </Link>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1">
                <section className="w-full pt-32 pb-20 md:pt-48 md:pb-24 lg:pt-56 lg:pb-32 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-background -z-10"></div>
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                                    Contact Us
                                </h1>
                                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                                    Have a question or feedback? We'd love to hear from you.
                                </p>
                            </div>
                        </div>
                         <div className="mx-auto max-w-lg mt-12">
                            <ContactForm />
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
        </div>
    );
}
