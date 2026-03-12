import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Globe, 
  ScanLine, Send, Landmark, Plus, ShieldAlert,
  ShieldCheck, ArrowRight, Wallet2, Smartphone, Zap, Tv, Home, Shield, Heart, Star, Lock, History
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WalletSectionProps {
  onScanClick: () => void;
}

const WalletSection = ({ onScanClick }: WalletSectionProps) => {
  const { currentUser, transactions, fraudAlerts } = useApp();
  const [balanceState, setBalanceState] = useState<"hidden" | "pin" | "visible">("hidden");
  const [pin, setPin] = useState("");

  if (!currentUser) return null;

  const unresolvedAlerts = fraudAlerts.filter(a => !a.resolved);
  const userTx = transactions.filter(t => t.senderId === currentUser.id || t.receiverId === currentUser.id);
  const sent = userTx.filter(t => t.senderId === currentUser.id).reduce((s, t) => s + t.amount, 0);
  const received = userTx.filter(t => t.receiverId === currentUser.id).reduce((s, t) => s + t.amount, 0);
  const recentTx = userTx.slice(0, 5);

  const handleCheckBalance = () => {
    if(pin.length >= 4) {
        toast.success("UPI PIN Verified Successfully");
        setBalanceState("visible");
        setPin("");
        setTimeout(() => setBalanceState("hidden"), 8000); // Auto hide after 8s
    } else {
        toast.error("Please enter a valid 4-digit UPI PIN");
    }
  };

  const quickActions = [
    { id: "scan", label: "Scan QR", icon: ScanLine, color: "bg-blue-500", action: onScanClick },
    { id: "send", label: "To Contact", icon: Send, color: "bg-purple-500" },
    { id: "bank", label: "To Bank/UPI", icon: Landmark, color: "bg-orange-500" },
    { id: "self", label: "To Self", icon: Wallet2, color: "bg-emerald-500" },
  ];

  const billActions = [
    { id: "recharge", label: "Mobile Recharge", icon: Smartphone, color: "text-blue-500 bg-blue-50" },
    { id: "electricity", label: "Electricity", icon: Zap, color: "text-amber-500 bg-amber-50" },
    { id: "dth", label: "DTH / Cable", icon: Tv, color: "text-purple-500 bg-purple-50" },
    { id: "rent", label: "Rent", icon: Home, color: "text-emerald-500 bg-emerald-50" },
  ];

  const investActions = [
    { id: "bike", label: "Bike Insurance", icon: Shield, color: "text-indigo-500 bg-indigo-50" },
    { id: "health", label: "Health", icon: Heart, color: "text-red-500 bg-red-50" },
    { id: "sip", label: "Mutual Funds", icon: TrendingUp, color: "text-success bg-success/10" },
    { id: "memberships", label: "Memberships", icon: Star, color: "text-orange-500 bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      {/* AI Fraud Protection Indicator - Mobile Only */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="md:hidden flex items-center justify-between rounded-2xl bg-success/10 p-3 text-success border border-success/20"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-bold">AI Active Protection Level: Maximum</span>
        </div>
        <div className="h-2 w-16 bg-success/20 rounded-full overflow-hidden">
          <div className="h-full bg-success w-[90%]" />
        </div>
      </motion.div>

      {/* Main Action Section - UPI Style */}
      <div>
        <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest ml-2 mb-3">Transfer Money</h3>
        <div className="grid grid-cols-4 gap-2 md:gap-4 bg-card rounded-3xl p-4 border border-border shadow-sm">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => action.action?.()}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={cn(
                "flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-active:scale-95",
                action.color
              )}>
                <action.icon className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <span className="text-[10px] md:text-sm font-semibold text-center leading-tight group-hover:text-primary transition-colors">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recharge & Pay Bills */}
      <div>
        <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest ml-2 mb-3">Recharge & Pay Bills</h3>
        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {billActions.map((action, i) => (
                <button key={action.id} className="flex flex-col items-center gap-2 group">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-active:scale-95", action.color)}>
                      <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight text-muted-foreground group-hover:text-foreground line-clamp-2">{action.label}</span>
                </button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 text-center">
             <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-primary">View All Services <ArrowRight className="h-3 w-3 ml-1" /></Button>
          </div>
        </div>
      </div>

      {/* Insurance & Investments */}
      <div>
        <div className="flex items-center justify-between ml-2 mb-3">
           <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Insurance & Invest</h3>
           <div className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[8px] font-black uppercase border border-success/20">Tax Saving</div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {investActions.map((action, i) => (
                <button key={action.id} className="flex flex-col items-center gap-2 group">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-active:scale-95", action.color)}>
                      <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight text-muted-foreground group-hover:text-foreground line-clamp-2">{action.label}</span>
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Bank Account Card with PIN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-primary-foreground shadow-glow"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-inner text-primary">
                 <Landmark className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white/90">Januin Bank Ltd.</h4>
                <p className="text-[10px] font-mono opacity-60">Saving A/c •••• 1234</p>
              </div>
            </div>
            <div className="bg-white/20 px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider backdrop-blur-md border border-white/10 text-success-foreground">
              Primary
            </div>
          </div>
          
          <AnimatePresence mode="wait">
             {balanceState === "hidden" && (
                <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-2 pb-2">
                  <Button onClick={() => setBalanceState("pin")} className="w-full bg-white/20 hover:bg-white/30 text-white rounded-2xl h-12 font-bold shadow-sm border border-white/10 transition-all active:scale-95">
                    <Lock className="h-4 w-4 mr-2" /> Check Bank Balance
                  </Button>
                </motion.div>
             )}
             
             {balanceState === "pin" && (
                <motion.div key="pin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-2 flex items-center gap-3">
                   <Input 
                     type="password" 
                     maxLength={4} 
                     placeholder="ENTER UPI PIN" 
                     value={pin}
                     onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                     className="h-12 flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center tracking-widest font-mono font-bold rounded-2xl"
                   />
                   <Button onClick={handleCheckBalance} className="h-12 px-6 rounded-2xl bg-white text-primary font-black hover:bg-white/90 shadow-md">
                     Submit
                   </Button>
                </motion.div>
             )}

             {balanceState === "visible" && (
                <motion.div key="visible" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-1">
                   <div className="flex justify-between items-end">
                     <div>
                       <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1 font-bold">Available Balance</p>
                       <p className="text-4xl font-black font-mono tracking-tighter drop-shadow-md">
                         ${currentUser.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                       </p>
                     </div>
                     <Button size="sm" variant="ghost" onClick={() => setBalanceState("hidden")} className="h-8 rounded-full bg-black/20 hover:bg-black/30 text-[10px] px-3 font-bold">
                       Hide
                     </Button>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      </motion.div>

      {/* AI Fraud Alerts Card - If any */}
      {unresolvedAlerts.length > 0 && (
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="rounded-3xl border border-danger/30 bg-gradient-to-r from-danger/10 to-transparent p-4 flex items-center gap-4"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger shadow-lg shadow-danger/20 text-white">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-danger">AI Fraud Warning</h3>
            <p className="text-xs text-muted-foreground font-medium">{unresolvedAlerts[0].reason}</p>
          </div>
          <Button size="sm" className="rounded-xl bg-danger hover:bg-danger/90 text-[10px] font-black uppercase">Review</Button>
        </motion.div>
      )}

      {/* Check Recent Activity Banner */}
      <div className="rounded-3xl border border-border bg-card p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors">
         <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
               <History className="h-5 w-5" />
            </div>
            <div>
               <h3 className="font-bold text-sm">Transaction History</h3>
               <p className="text-[10px] text-muted-foreground">View all your recent transactions</p>
            </div>
         </div>
         <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default WalletSection;
