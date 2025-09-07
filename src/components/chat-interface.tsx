
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Loader2, Paperclip, Send, X, User, Bot, Sparkles, MessageSquare, Quote, Trash2, Upload, Copy } from "lucide-react";
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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [researchMode, setResearchMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const fetchSuggestions = useCallback(async (docContent: string | null) => {
    const result = await getSuggestions({ documentContent: docContent });
    if (result.suggestions) {
      setSuggestions(result.suggestions);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(null); // Initial general suggestions
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
    <div className="flex flex-col h-full w-full relative">
      {messages.length > 0 && (
          <div className="flex items-center justify-end mb-4">
              <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
                  <Trash2 className="h-4 w-4"/>
                  Clear Chat
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
                  "flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary text-center text-muted-foreground p-12 min-h-[400px] transition-colors",
                  isDragging ? "border-primary bg-primary/10" : ""
                )}
               >
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold tracking-tight">Welcome to Intituas AI</h3>
                  <p className="text-base mt-2">Start a conversation by typing below or upload a document to begin.</p>
              </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : '')}>
                {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("rounded-lg px-4 py-3 max-w-[80%] space-y-2", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
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
                                  {message.citations.length} Citation(s)
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
                            className="h-7 w-7 ml-auto"
                            onClick={() => handleCopy(message.text!)}
                          >
                            <Copy className="h-4 w-4" />
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
              <div className="rounded-lg px-4 py-3 max-w-[80%] bg-secondary w-full">
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
        {suggestions.length > 0 && !isLoading && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <p className="text-sm font-medium text-muted-foreground mr-2">Suggestions:</p>
                {suggestions.map((s, i) => (
                    <Button key={i} size="sm" variant="outline" onClick={() => handleSuggestionClick(s)}>{s}</Button>
                ))}
            </div>
        )}

         {fileName && (
            <Card className="mb-4 bg-secondary border-dashed">
                <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <Paperclip className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                            <p className="font-semibold text-sm truncate">{fileName}</p>
                            <p className="text-xs text-muted-foreground">File is ready to be queried.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeFile}>
                        <X className="h-5 w-5" />
                    </Button>
                </CardContent>
            </Card>
        )}

        <div className="flex items-center justify-between mb-2">
             <label htmlFor="file-upload-button" className="cursor-pointer">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Paperclip className="h-5 w-5"/>
                    <span className="text-sm font-medium">{documentContent ? "Change Document" : "Attach Document"}</span>
                </div>
                <Input id="file-upload-button" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.ppt,.pptx,.doc,.docx" />
            </label>
            <div className="flex items-center space-x-2">
              <Switch id="research-mode" checked={researchMode} onCheckedChange={setResearchMode} />
              <Label htmlFor="research-mode">Research Mode</Label>
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
                                <Input placeholder={documentContent ? "Ask about your document..." : "Ask me anything..."} {...field} className="text-sm" />
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
