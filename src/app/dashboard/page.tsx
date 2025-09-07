"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { LayoutDashboard, LogOut, Loader2, FileText, Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface HistoryItem {
    id: string;
    question: string;
    answer: string;
    createdAt: Date;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        setIsHistoryLoading(true);
        try {
            const q = query(
                collection(db, "searchHistory"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(5)
            );
            const querySnapshot = await getDocs(q);
            const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
            setHistory(historyData);
        } catch (error) {
            console.error("Error fetching search history: ", error);
        } finally {
            setIsHistoryLoading(false);
        }
      }
    };

    fetchHistory();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary">
       <header className="w-full bg-background py-4 border-b">
        <div className="container mx-auto max-w-5xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-headline">
                Intituas AI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline">Welcome, {user.email}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">Dashboard</h1>
        </div>

        <div className="flex flex-col gap-4">
            <Link href="/chat">
                <Button size="lg" className="w-full">
                    <FileText className="mr-2"/>
                    Start a New Chat
                </Button>
            </Link>
        </div>


        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            {isHistoryLoading ? (
                 <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : history.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {history.map((item) => (
                        <AccordionItem value={item.id} key={item.id}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex items-start gap-3 mt-2">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg px-4 py-2 bg-secondary flex-1">
                                         <p className="text-sm whitespace-pre-wrap">{item.answer}</p>
                                    </div>
                                </div>
                            </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No search history found.</p>
                    <p className="text-sm">Start a new chat to see your history here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
