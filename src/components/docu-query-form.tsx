
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrainCircuit, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAnswer } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  documentContent: z
    .string()
    .min(100, "Document content must be at least 100 characters.")
    .max(50000, "Document content is too long. Please use a smaller chunk of text."),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters.")
    .max(500, "Question is too long."),
});

type FormValues = z.infer<typeof formSchema>;

export function DocuQueryForm() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentContent: "",
      question: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnswer(null);

    const result = await getAnswer(values);

    setIsLoading(false);

    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
    } else {
      setAnswer(result.answer);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg bg-background">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="documentContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">1. Provide Document Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the content of your PDF, Markdown file, or article here."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The quality of the answer depends on the quality of the provided text.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">2. Ask your Question</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., What is the difference between supervised and unsupervised learning?" {...field} />
                    </FormControl>
                     <FormDescription>
                      Ask a natural language question about the document content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full !mt-8" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Answer...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Generate Answer
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || answer) && (
        <Card className="shadow-lg bg-background">
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap font-body text-foreground/90 leading-relaxed">
                {answer}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
