"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Loader2, Paperclip, Send, FileUp, X, User, Bot } from "lucide-react";
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
import { getAnswer } from "@/app/actions";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";


const formSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

interface Message {
  id: string;
  sender: "user" | "ai";
  text?: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [researchMode, setResearchMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setDocumentContent(content);
        toast({
            title: "File Uploaded",
            description: `${file.name} is ready for questions.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setFileName(null);
    setDocumentContent(null);
    toast({
        title: "File Removed",
        description: "The document has been removed from the chat.",
    });
  }

  async function onSubmit(values: FormValues) {
    const userMessage: Message = { id: `user-${Date.now()}`, text: values.question, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    const result = await getAnswer({
        documentContent: documentContent,
        question: values.question,
        researchMode: researchMode,
    });

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
      const aiMessage: Message = { id: `ai-${Date.now()}`, text: result.answer, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
        <div className="space-y-6 pb-4">
          {messages.length === 0 && !isLoading && (
               <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-24">
                  <BrainCircuit className="w-16 h-16 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold">Welcome to Intituas AI</h3>
                  <p className="text-base">Start a conversation below or upload a document to begin.</p>
              </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : '')}>
                {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("rounded-lg px-4 py-2 max-w-[80%]", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
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
              <div className="rounded-lg px-4 py-2 max-w-[80%] bg-secondary">
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                  </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="mt-auto pt-4 border-t bg-background">
         {fileName && (
            <Card className="mb-4 bg-secondary border-dashed">
                <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Paperclip className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-grow">
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
                <Label htmlFor="research-mode" className="text-sm">Research Mode</Label>
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
                            <Input placeholder={documentContent ? "Ask a question about your document..." : "Ask me anything..."} {...field} />
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
