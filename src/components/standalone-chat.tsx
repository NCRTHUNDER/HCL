
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Loader2, Paperclip, Send, X, User, Bot, Sparkles, MessageSquare, Quote, Trash2, Upload, Copy, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getAnswer, getSuggestions } from "@/app/actions";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const formSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

interface Message {
  id: string;
  sender: "user" | "ai";
  text?: string;
  confidenceScore?: number;
  citations?: string[];
}

export function StandaloneChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [researchMode, setResearchMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("chatHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
    }
  }, []);

  const updateHistory = (newQuestion: string) => {
    setHistory(prevHistory => {
      const updatedHistory = [newQuestion, ...prevHistory.filter(h => h !== newQuestion)].slice(0, 5);
      try {
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
      }
      return updatedHistory;
    });
  };
  
  const deleteHistoryItem = (itemToDelete: string) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(h => h !== itemToDelete);
       try {
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
      }
      return updatedHistory;
    });
  }

  const fetchSuggestions = useCallback(async (docContent: string | null) => {
    try {
        const result = await getSuggestions({ documentContent: docContent });
        if (result.suggestions) {
          setSuggestions(result.suggestions);
        }
    } catch (e) {
        // Don't show toast for suggestion errors
        console.error("Failed to fetch suggestions", e);
    }
  }, []);

  useEffect(() => {
    // We wrap this in a timeout to avoid a race condition during the initial render.
    setTimeout(() => {
      fetchSuggestions(null); // Initial general suggestions
    }, 1);
  }, [fetchSuggestions]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages])

  const processFile = (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setDocumentContent(content);
        toast({
            title: "File Uploaded",
            description: `${file.name} is ready for questions.`,
        });
        fetchSuggestions(content);
      };
      reader.readAsText(file);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeFile = () => {
    setFileName(null);
    setDocumentContent(null);
    setSuggestions([]);
    fetchSuggestions(null);
    toast({
        title: "File Removed",
        description: "The document has been removed from the chat.",
    });
  }

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("question", suggestion);
    onSubmit({ question: suggestion });
  }
  
  const handleHistoryClick = (item: string) => {
    form.setValue("question", item);
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "The AI's response has been copied.",
    });
  };

  const clearChat = () => {
    setMessages([]);
    setSuggestions([]);
    fetchSuggestions(documentContent);
    toast({
        title: "Chat Cleared",
        description: "The conversation has been reset.",
    });
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  async function onSubmit(values: FormValues) {
    const userMessage: Message = { id: `user-${Date.now()}`, text: values.question, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setSuggestions([]);
    updateHistory(values.question);
    form.reset();

    const input = documentContent
      ? { documentContent: documentContent, question: values.question, researchMode: researchMode }
      : { question: values.question, researchMode: researchMode };
    
    const result = await getAnswer(input);

    setIsLoading(false);

    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
      const aiErrorMessage: Message = { id: `ai-error-${Date.now()}`, text: "Sorry, I couldn't generate a response.", sender: "ai"};
      setMessages((prev) => [...prev, aiErrorMessage]);

    } else {
      const { answer, confidenceScore, citations } = result as any;
      const aiMessage: Message = { 
        id: `ai-${Date.now()}`, 
        text: answer, 
        sender: "ai",
        confidenceScore: confidenceScore,
        citations: citations,
      };
      setMessages((prev) => [...prev, aiMessage]);
      fetchSuggestions(documentContent);
    }
  }

  return (
    <div className="flex flex-col h-full w-full p-4 pt-0 relative">
       {messages.length > 0 && (
          <div className="flex items-center justify-end my-2">
              <Button variant="outline" size="sm" onClick={clearChat} className="gap-1.5 text-xs h-7">
                  <Trash2 className="h-3.5 w-3.5"/>
                  Clear
              </Button>
          </div>
      )}
      <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
        <div className="space-y-6 pb-4">
          {messages.length === 0 && !isLoading && (
               <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop} 
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary text-center text-muted-foreground p-8 min-h-[calc(60vh-250px)] transition-colors",
                  isDragging ? "border-primary bg-primary/10" : ""
                )}
               >
                   <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Welcome to Intituas AI</h3>
                  <p className="text-sm mt-1">Start a conversation by typing below or upload a document to begin.</p>
              </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : '')}>
                {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("rounded-lg px-3 py-2 max-w-[85%] space-y-2", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                    {message.sender === 'ai' && message.text && (
                      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                        {message.confidenceScore && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                  <Badge variant="outline" className="gap-1.5">
                                    <Sparkles className="h-3 w-3" />
                                    {message.confidenceScore.toFixed(0)}%
                                  </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Confidence Score</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {message.citations && message.citations.length > 0 && (
                           <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="gap-1.5 cursor-help">
                                  <Quote className="h-3 w-3" />
                                  {message.citations.length}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-bold mb-2">Citations:</p>
                                <ul className="list-disc pl-4 space-y-2">
                                  {message.citations.map((c, i) => <li key={i} className="text-xs">"{c}"</li>)}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto"
                            onClick={() => handleCopy(message.text!)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="sr-only">Copy message</span>
                          </Button>
                      </div>
                    )}
                </div>
                 {message.sender === 'user' && (
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                )}
            </div>
          ))}
          {isLoading && messages[messages.length -1]?.sender !== 'ai' && (
            <div className="flex items-start gap-3">
               <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
               </Avatar>
              <div className="rounded-lg px-3 py-2 max-w-[85%] bg-secondary w-full">
                  <div className="flex items-start gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="space-y-2 flex-1">
                          <Skeleton className="h-3 w-4/5" />
                          <Skeleton className="h-3 w-3/5" />
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="mt-auto pt-4 border-t bg-background">
        {history.length > 0 && !isLoading && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Recent</p>
            </div>
            <ScrollArea className="max-h-24">
                <div className="flex items-center gap-2 flex-wrap">
                    {history.map((h, i) => (
                        <div key={i} className="flex items-center gap-1 rounded-full bg-secondary pr-2">
                            <Button size="sm" variant="ghost" onClick={() => handleHistoryClick(h)} className="text-xs h-auto py-1 px-2 rounded-full">{h}</Button>
                            <button onClick={() => deleteHistoryItem(h)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
          </div>
        )}

        {suggestions.length > 0 && !isLoading && (
            <ScrollArea className="max-h-24">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {suggestions.map((s, i) => (
                        <Button key={i} size="sm" variant="outline" onClick={() => handleSuggestionClick(s)} className="text-xs">{s}</Button>
                    ))}
                </div>
            </ScrollArea>
        )}

         {fileName && (
            <Card className="mb-2 bg-secondary border-dashed">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                            <p className="font-semibold text-xs truncate">{fileName}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={removeFile}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        )}

        <div className="flex items-center justify-between mb-2">
             <label htmlFor="file-upload-button-widget" className="cursor-pointer">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Paperclip className="h-4 w-4"/>
                    <span className="text-xs font-medium">{documentContent ? "Change Doc" : "Attach Doc"}</span>
                </div>
                <Input id="file-upload-button-widget" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.ppt,.pptx,.doc,.docx" />
            </label>
            <div className="flex items-center space-x-2">
              <Switch id="research-mode-widget" checked={researchMode} onCheckedChange={setResearchMode} />
              <Label htmlFor="research-mode-widget" className="text-xs">Research</Label>
            </div>
        </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                            <div className="relative">
                                <Input placeholder="Ask anything..." {...field} className="text-sm" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading} size="icon" aria-label="Send message">
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}

    