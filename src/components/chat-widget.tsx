"use client";

import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-5 z-50"
          >
            <Card className="w-80 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-lg">Chat with us!</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 border-t h-80 flex items-center justify-center text-center">
                <p className="text-muted-foreground">
                  This is a demo chat. <br /> Sign up to start a real conversation!
                </p>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center gap-2">
                  <input
                    placeholder="Type a message..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                  <Button disabled size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="fixed bottom-5 right-5 z-50 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat widget"
      >
        <AnimatePresence>
        {isOpen ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="x">
                <X className="h-7 w-7" />
            </motion.div>
        ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="message">
                <MessageSquare className="h-7 w-7" />
            </motion.div>
        )}
        </AnimatePresence>
      </Button>
    </>
  );
}
