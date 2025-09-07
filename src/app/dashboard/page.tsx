"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { LayoutDashboard, LogOut, Loader2, FileText, Bot, PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface HistoryItem {
    id: string;
    question: string;
    answer: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
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
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              
              <span className="inline-block font-bold text-lg">Intituas AI</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <span className="text-sm font-medium hidden sm:inline mr-4">
                Welcome, {user.email?.split('@')[0]}
              </span>
               <Link href="/chat">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> New Chat
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto max-w-5xl py-12 px-4">
        <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
                View your recent conversations or start a new one.
            </p>
        </div>

        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5"/>
                        Recent History
                    </CardTitle>
                    <CardDescription>
                        Here are your last five interactions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isHistoryLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : history.length > 0 ? (
                        <div className="space-y-6">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 rounded-lg border bg-secondary/50">
                                    <p className="font-semibold text-foreground truncate">{item.question}</p>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.answer}</p>
                                    <p className="text-xs text-muted-foreground mt-3">
                                      {formatDistanceToNow(new Date(item.createdAt.seconds * 1000), { addSuffix: true })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                             <MessageSquare className="mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-medium">No History Found</h3>
                            <p className="mt-2 text-sm">Start a new chat to see your history here.</p>
                            <Link href="/chat" className="mt-6">
                               <Button>Start Chatting</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
