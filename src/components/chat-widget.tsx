"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { StandaloneChat } from "./standalone-chat";

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
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-40px)] sm:w-96"
          >
            <Card className="shadow-2xl h-[60vh] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle className="text-lg">Chat with Intituas AI</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col h-full overflow-hidden">
                <StandaloneChat />
              </CardContent>
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
