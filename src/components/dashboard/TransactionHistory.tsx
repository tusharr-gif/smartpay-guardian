import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  ArrowUpRight, ArrowDownLeft, Shield, Search, Filter, 
  ChevronRight, Calendar, Info, ShieldCheck, ShieldAlert,
  ArrowRight, CreditCard, Banknote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TransactionHistory = () => {
  const { currentUser, transactions } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "sent" | "received">("all");
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  if (!currentUser) return null;

  const userTx = transactions
    .filter(t => t.senderId === currentUser.id || t.receiverId === currentUser.id)
    .filter(t => {
      const matchesSearch = 
        t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery);
      
      if (activeFilter === "sent") return matchesSearch && t.senderId === currentUser.id;
      if (activeFilter === "received") return matchesSearch && t.receiverId === currentUser.id;
      return matchesSearch;
    });

  const statusColor = (s: string) => {
    if (s === "completed") return "text-success bg-success/10 border-success/20";
    if (s === "flagged") return "text-warning bg-warning/10 border-warning/20";
    if (s === "blocked") return "text-danger bg-danger/10 border-danger/20";
    return "text-muted-foreground bg-muted border-border";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="sticky top-14 md:top-0 z-20 bg-background/95 pb-2 backdrop-blur-sm -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 items-center mb-4 pt-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, amount..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-2xl bg-muted/50 border-none shadow-inner"
                />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl border-none bg-muted/50">
                <Filter className="h-4 w-4" />
            </Button>
        </div>

        <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl border border-border overflow-x-auto no-scrollbar">
            {(["all", "sent", "received"] as const).map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                        "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap",
                        activeFilter === filter ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:bg-card/30"
                    )}
                >
                    {filter}
                </button>
            ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pb-24">
        {userTx.length > 0 ? (
          userTx.map((tx, i) => {
            const isSend = tx.senderId === currentUser.id;
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTx(tx)}
                className="group relative flex items-center justify-between rounded-3xl border border-border bg-card p-4 transition-all hover:bg-muted/10 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold border",
                    isSend ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  )}>
                    {isSend ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownLeft className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight">{isSend ? tx.receiverName : tx.senderName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="text-[10px] text-muted-foreground font-mono font-bold">
                         {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </span>
                       <span className="text-[10px] text-muted-foreground">•</span>
                       <span className={cn(
                         "text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded-full border",
                         statusColor(tx.status)
                       )}>
                         {tx.status}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <p className={cn(
                      "font-mono font-black text-base leading-none",
                      isSend ? "text-red-600" : "text-emerald-600"
                    )}>
                      {isSend ? "-" : "+"}₹{tx.amount.toLocaleString()}
                    </p>
                    {tx.riskScore > 40 && (
                      <div className="flex items-center gap-1 mt-1">
                        <ShieldAlert className="h-2.5 w-2.5 text-warning" />
                        <span className="text-[8px] font-black text-warning uppercase">AI Alert</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
             <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Search className="h-10 w-10 opacity-20" />
             </div>
             <p className="font-bold">No transactions found</p>
             <p className="text-xs">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Transaction Details Modal/Sheet */}
      <AnimatePresence>
        {selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 md:items-center"
            onClick={() => setSelectedTx(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-lg rounded-[40px] bg-card p-6 shadow-2xl md:rounded-3xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-muted md:hidden" />
              
              <div className="text-center mb-8">
                 <div className={cn(
                    "mx-auto flex h-20 w-20 items-center justify-center rounded-[32px] border-4 border-card shadow-lg mb-4",
                    selectedTx.senderId === currentUser.id ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                 )}>
                    {selectedTx.senderId === currentUser.id ? <ArrowUpRight className="h-10 w-10" /> : <ArrowDownLeft className="h-10 w-10" />}
                 </div>
                 <h2 className="text-3xl font-black font-mono tracking-tighter">
                   {selectedTx.senderId === currentUser.id ? "-" : "+"}₹{selectedTx.amount.toLocaleString()}
                 </h2>
                 <p className="text-sm font-bold text-muted-foreground mt-1">
                   {selectedTx.senderId === currentUser.id ? "Sent to" : "Received from"} {selectedTx.senderId === currentUser.id ? selectedTx.receiverName : selectedTx.senderName}
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
                       <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Status</p>
                       <div className="flex items-center gap-2">
                          <CheckCircle2 className={cn("h-4 w-4", selectedTx.status === "completed" ? "text-success" : "text-warning")} />
                          <span className="text-xs font-black uppercase">{selectedTx.status}</span>
                       </div>
                    </div>
                    <div className="rounded-2xl bg-muted/30 p-4 border border-border/50">
                       <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Method</p>
                       <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-xs font-black uppercase">UPI / Wallet</span>
                       </div>
                    </div>
                 </div>

                 <div className={cn(
                   "rounded-3xl p-5 border",
                   selectedTx.riskScore < 30 ? "bg-success/5 border-success/20" : 
                   selectedTx.riskScore < 70 ? "bg-warning/5 border-warning/20" : "bg-danger/5 border-danger/20"
                 )}>
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                          {selectedTx.riskScore < 30 ? <ShieldCheck className="h-5 w-5 text-success" /> : <ShieldAlert className="h-5 w-5 text-danger" />}
                          <h4 className="text-sm font-black uppercase">Guardian AI Analysis</h4>
                       </div>
                       <span className={cn("text-xs font-black font-mono", selectedTx.riskScore > 50 ? "text-danger" : "text-success")}>
                          Score: {selectedTx.riskScore}/100
                       </span>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                       Transaction analyzed by BHIM v2.4 protocol. Risk assessment based on {selectedTx.riskScore > 50 ? "unusual amount spike and behavioral biometric verification" : "previously trusted contact and secure QR signature verification"}.
                    </p>
                 </div>

                 <div className="pt-2">
                    <Button className="w-full h-14 rounded-2xl font-black gradient-primary shadow-glow border-none" onClick={() => setSelectedTx(null)}>
                       CLOSE DETAILS
                    </Button>
                    <Button variant="ghost" className="w-full mt-2 h-10 rounded-xl font-bold text-xs text-muted-foreground">
                       DOWNLOAD RECEIPT
                    </Button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default TransactionHistory;

