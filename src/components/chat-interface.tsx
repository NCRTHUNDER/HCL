
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Loader2, Paperclip, Send, FileUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAnswer } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const formSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

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
            title: "File uploaded",
            description: `${file.name} has been loaded. You can now ask questions about it.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setFileName(null);
    setDocumentContent(null);
    toast({
        title: "File removed",
        description: "The document has been removed.",
    });
  }

  async function onSubmit(values: FormValues) {
    if (!documentContent) {
        toast({
            variant: "destructive",
            title: "No document provided.",
            description: "Please upload a document before asking a question.",
        });
        return;
    }

    const userMessage: Message = { id: `user-${Date.now()}`, text: values.question, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    const result = await getAnswer({
        documentContent,
        question: values.question
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
    <div className="space-y-4">
      <Card className="shadow-lg bg-background flex flex-col h-[60vh]">
        <CardContent className="pt-6 flex-1 flex flex-col gap-4">
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.length === 0 && !isLoading && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <BrainCircuit className="w-16 h-16 mb-4" />
                    <h3 className="text-lg font-semibold">Welcome to Intituas AI</h3>
                    <p className="text-sm">Upload a document and start asking questions.</p>
                </div>
            )}
            {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                    {message.sender === 'ai' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                     {message.sender === 'user' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                 </Avatar>
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-secondary">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Thinking...</p>
                    </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto pt-4 border-t">
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                            <div className="relative">
                               <Input placeholder="Ask a question about your document..." {...field} className="pr-12" />
                               <label htmlFor="file-upload-button" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary">
                                    <Paperclip className="h-5 w-5"/>
                                    <Input id="file-upload-button" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.ppt,.pptx,.doc,.docx" />
                               </label>
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} size="icon">
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      
      {!fileName && (
        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <FileUp className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Document</h3>
            <p className="text-sm text-muted-foreground mb-4">Supported formats: TXT, PDF, PPTX, DOCX</p>
            <Button asChild>
                <label htmlFor="file-upload-main">
                    Browse Files
                    <Input id="file-upload-main" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.ppt,.pptx,.doc,.docx" />
                </label>
            </Button>
        </div>
      )}


      {fileName && (
        <Card className="shadow-lg bg-background">
            <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Paperclip className="h-5 w-5 text-primary" />
                    <div>
                        <p className="font-semibold">{fileName}</p>
                        <p className="text-sm text-muted-foreground">Ready to be queried.</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-5 w-5" />
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
