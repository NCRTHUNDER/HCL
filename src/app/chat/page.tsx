import { ChatInterface } from "@/components/chat-interface";
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { ThemeToggle } from "@/components/theme-toggle";

export default function ChatPage() {
  return (
    <main className="flex h-screen flex-col items-center bg-background">
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
      
      <div className="flex-1 w-full container mx-auto max-w-3xl py-8 flex flex-col">
          <ChatInterface />
      </div>

    </main>
  );
}
