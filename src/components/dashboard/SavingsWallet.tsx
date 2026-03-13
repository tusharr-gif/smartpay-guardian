import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PiggyBank, Target, ArrowLeft, Plus, History, 
  TrendingUp, ShieldCheck, Clock, Settings2, 
  ChevronRight, ArrowRightCircle, Sparkles, CheckCircle2,
  ExternalLink, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SavingsWalletProps {
    onBack: () => void;
}

const SavingsWallet = ({ onBack }: SavingsWalletProps) => {
  const { currentUser, sendExternalMoney } = useApp();
  const [savingsBalance, setSavingsBalance] = useState(2540.50);
  const [isAutoPayEnabled, setIsAutoPayEnabled] = useState(true);
  const [autoPayAmount, setAutoPayAmount] = useState("500");
  const [showSetup, setShowSetup] = useState(false);
  const [showAppChooser, setShowAppChooser] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "autopay" | null>(null);

  const savingsPortfolios = [
    { title: "Emergency Fund", balance: 1200, color: "from-blue-500/20 to-blue-500/5", icon: ShieldCheck },
    { title: "New Laptop", balance: 840.50, color: "from-purple-500/20 to-purple-500/5", icon: Target },
    { title: "Vacation", balance: 500, color: "from-amber-500/20 to-amber-500/5", icon: Sparkles },
  ];

  const handleUpiRedirect = (appName: string) => {
    const actionText = pendingAction === "add" ? "Adding Funds" : "Setting up Auto-Pay";
    toast.info(`Redirecting to ${appName} for ${actionText}...`);
    
    // Simulate intent response
    setTimeout(() => {
        if(pendingAction === "add") {
            setSavingsBalance(prev => prev + 500);
            toast.success(`₹500 added to Savings via ${appName}`);
        } else {
            setIsAutoPayEnabled(true);
            toast.success(`Auto-Pay mandate active on ${appName} for ₹${autoPayAmount}/mo`);
        }
        setShowAppChooser(false);
        setPendingAction(null);
    }, 2000);
  };

  const initiateUpiAction = (type: "add" | "autopay") => {
    setPendingAction(type);
    setShowAppChooser(true);
    if (type === "autopay") setShowSetup(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Savings Wallet</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
           <TrendingUp className="h-3.5 w-3.5 text-primary" />
           <span className="text-[10px] font-black text-primary uppercase">6.5% APY</span>
        </div>
      </div>

      {/* Main Balance Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden rounded-[40px] bg-card border border-border p-8 shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Savings</p>
               <h1 className="text-5xl font-black tracking-tighter">₹{savingsBalance.toLocaleString()}</h1>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-glow">
               <PiggyBank className="h-8 w-8" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
                onClick={() => initiateUpiAction("add")}
                className="h-14 rounded-2xl font-black gradient-primary shadow-glow group"
            >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" /> ADD FUNDS
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl font-black border-2 border-primary/20 text-primary">
                WITHDRAW
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-success/5 blur-[60px] rounded-full -ml-10 -mb-10" />
      </motion.div>

      {/* Auto-Pay System Card */}
      <div className="rounded-[32px] bg-gradient-to-br from-card to-muted/30 border border-border p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                 <Clock className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="font-bold text-sm">Monthly Auto-Savings</h3>
                 <p className="text-[10px] text-muted-foreground font-bold">Never miss your savings goal</p>
              </div>
           </div>
           <button 
             onClick={() => setIsAutoPayEnabled(!isAutoPayEnabled)}
             className={cn(
                "h-7 w-12 rounded-full transition-colors relative",
                isAutoPayEnabled ? "bg-primary" : "bg-muted-foreground/30"
             )}
           >
              <div className={cn(
                "absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-all shadow-sm",
                isAutoPayEnabled ? "translate-x-5" : "translate-x-0"
              )} />
           </button>
        </div>

        {isAutoPayEnabled ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Monthly Deduction</p>
                    <p className="text-xl font-black">₹{autoPayAmount} <span className="text-[10px] font-bold text-muted-foreground">/ month</span></p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSetup(true)} className="h-10 rounded-xl font-bold bg-primary/5 hover:bg-primary/10 text-primary">
                   Change <Settings2 className="h-4 w-4 ml-2" />
                </Button>
            </div>
        ) : (
            <div className="py-4 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-4">Set up a monthly auto-savings plan via UPI Mandate.</p>
                <Button onClick={() => setShowSetup(true)} className="gradient-primary h-12 px-8 rounded-xl font-bold">ENABLE AUTO-SAVINGS</Button>
            </div>
        )}

        <div className="mt-4 flex items-center gap-2 px-2">
           <CheckCircle2 className="h-3 w-3 text-success" />
           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Linked: {currentUser?.phone || "No Number linked"}</p>
        </div>
      </div>

      {/* Setup Modal Overlay */}
      <AnimatePresence>
        {showSetup && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
           >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="w-full max-w-md bg-card rounded-[40px] border border-border p-8 shadow-2xl"
             >
                <h3 className="text-xl font-black mb-2">Setup Auto-Savings</h3>
                <p className="text-sm text-muted-foreground mb-8">This will create a monthly UPI Mandate in your preferred app.</p>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Monthly Amount (₹)</label>
                        <Input 
                          type="number"
                          value={autoPayAmount}
                          onChange={(e) => setAutoPayAmount(e.target.value)}
                          className="h-16 rounded-2xl text-2xl font-black text-center"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {["100", "500", "1000"].map(val => (
                            <button 
                               key={val}
                               onClick={() => setAutoPayAmount(val)}
                               className={cn(
                                 "py-3 rounded-xl font-black text-xs transition-all",
                                 autoPayAmount === val ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                               )}
                            >
                                ₹{val}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" onClick={() => setShowSetup(false)} className="flex-1 h-14 rounded-2xl font-bold">CANCEL</Button>
                        <Button onClick={() => initiateUpiAction("autopay")} className="flex-1 h-14 rounded-2xl font-black gradient-primary shadow-glow flex items-center justify-center gap-2">
                            PROCEED <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* UPI App Chooser Modal */}
      <AnimatePresence>
        {showAppChooser && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
           >
             <motion.div 
               initial={{ y: 100 }}
               animate={{ y: 0 }}
               exit={{ y: 100 }}
               className="w-full max-w-md bg-card rounded-[40px] border border-border p-8 shadow-2xl overflow-hidden relative"
             >
                <div className="mb-8 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Smartphone className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">Choose UPI App</h3>
                    <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-wide">Secure Redirect to external PSP</p>
                </div>

                <div className="space-y-4">
                    {[
                        { name: "PhonePe", icon: "🟣", color: "hover:bg-purple-500/10 hover:border-purple-500/30" },
                        { name: "Google Pay", icon: "🔴", color: "hover:bg-red-500/10 hover:border-red-500/30" },
                        { name: "Paytm", icon: "🔵", color: "hover:bg-blue-500/10 hover:border-blue-500/30" }
                    ].map(app => (
                        <button 
                           key={app.name}
                           onClick={() => handleUpiRedirect(app.name)}
                           className={cn(
                             "w-full flex items-center justify-between p-5 rounded-[24px] border border-border bg-muted/30 transition-all active:scale-[0.98] group",
                             app.color
                           )}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{app.icon}</span>
                                <span className="font-black text-sm uppercase tracking-tight">{app.name}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                    ))}
                </div>

                <Button 
                    variant="ghost" 
                    onClick={() => { setShowAppChooser(false); setPendingAction(null); }} 
                    className="w-full mt-6 h-12 rounded-xl text-[10px] font-black uppercase text-muted-foreground hover:text-foreground"
                >
                    Cancel Transaction
                </Button>

                {/* Secure Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                    <ShieldCheck className="h-3 w-3 text-success" />
                    <span className="text-[8px] font-black text-success uppercase">NPCI Certified</span>
                </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolios / Categorized Savings */}
      <div>
         <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-4">Savings Portfolios</h3>
         <div className="grid grid-cols-1 gap-3">
            {savingsPortfolios.map((item, i) => (
                <button key={i} className="flex items-center justify-between p-5 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-md group">
                    <div className="flex items-center gap-4">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br", item.color)}>
                            <item.icon className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-sm tracking-tight">{item.title}</p>
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Balance: ₹{item.balance}</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
            ))}
         </div>
      </div>

      {/* History Card */}
      <div className="rounded-[32px] border border-border p-6 bg-card/50">
         <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Saving Activity</h4>
            <Button variant="link" className="text-[10px] font-black uppercase h-auto p-0 text-primary">View All</Button>
         </div>
         <div className="space-y-4">
            {[1, 2].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center text-success">
                            <ArrowRightCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold">Monthly Auto-Save</p>
                            <p className="text-[9px] text-muted-foreground font-medium">March 1, 2026</p>
                        </div>
                    </div>
                    <span className="text-xs font-black text-success">+₹500.00</span>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SavingsWallet;
