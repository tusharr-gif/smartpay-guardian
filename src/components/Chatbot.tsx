import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const INITIAL_MESSAGE: Message = {
  id: "init-1",
  sender: "bot",
  text: "Hi this is JASSSSS MADE BY MASTER TUSHAR. How can I help you explore Januin Pay today?",
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("scan") || lowerText.includes("qr")) {
      return "To scan a QR code, just click the 'Scan QR' button on your My Wallet dashboard. Our AI Guardian will automatically analyze the QR for any fraud risks before you pay!";
    }
    if (lowerText.includes("fraud") || lowerText.includes("safe") || lowerText.includes("risk")) {
      return "Januin Pay uses advanced AI Guardian technology. It analyzes transactions, checks KYC, and calculates a dynamic Risk Score to keep you safe from scams. Try scanning a QR with 'fraud' in the name to see it in action!";
    }
    if (lowerText.includes("pay") || lowerText.includes("send") || lowerText.includes("money")) {
      return "You can send money by going to 'UPI Payments' or 'Contacts Hub'. Search for any number or UPI ID, select them, and our AI will verify their safety before you enter your amount.";
    }
    if (lowerText.includes("wallet") || lowerText.includes("balance")) {
      return "Your Unified Bank Wallet shows your total balance. You can securely check your balance by entering your 4-digit PIN in the My Wallet section.";
    }
    if (lowerText.includes("reward") || lowerText.includes("scratch")) {
      return "You earn scratch cards for making payments! Check out the 'Rewards' section from the sidebar to scratch cards and win cashback.";
    }
    if (lowerText.includes("jasssss") || lowerText.includes("tushar")) {
      return "Yes! I am JASSSSS, your AI assistant crafted by Master Tushar. I'm here to guide you through this awesome project!";
    }
    return "I am JASSSSS, your virtual assistant. You can ask me about scanning QRs, checking fraud alerts, sending money, or viewing your wallet features!";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: generateResponse(userMsg.text),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full gradient-primary shadow-glow flex items-center justify-center text-white z-50 transition-all",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <MessageSquare className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="h-16 gradient-primary flex items-center justify-between px-4 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-widest uppercase flex items-center gap-1">
                    JASSSSS <Sparkles className="h-3 w-3" />
                  </h3>
                  <p className="text-[10px] font-bold opacity-80">AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-card border border-border rounded-bl-none text-foreground font-medium"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground mt-1 px-1 uppercase">
                    {msg.sender === "user" ? "You" : "JASSSSS"}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-card border-t border-border flex items-center gap-2 shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about Januin Pay..."
                className="flex-1 bg-muted/50 border-transparent focus-visible:ring-primary rounded-xl"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className="h-10 w-10 p-0 rounded-xl gradient-primary shadow-md shrink-0 disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
