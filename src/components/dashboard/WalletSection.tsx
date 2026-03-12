import { motion } from "framer-motion";
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Globe, 
  ScanLine, Send, Landmark, Plus, ShieldAlert,
  ShieldCheck, ArrowRight, Wallet2
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WalletSection = () => {
  const { currentUser, transactions, fraudAlerts } = useApp();
  if (!currentUser) return null;

  const unresolvedAlerts = fraudAlerts.filter(a => !a.resolved);
  const userTx = transactions.filter(t => t.senderId === currentUser.id || t.receiverId === currentUser.id);
  const sent = userTx.filter(t => t.senderId === currentUser.id).reduce((s, t) => s + t.amount, 0);
  const received = userTx.filter(t => t.receiverId === currentUser.id).reduce((s, t) => s + t.amount, 0);
  const recentTx = userTx.slice(0, 5);

  const quickActions = [
    { id: "scan", label: "Scan & Pay", icon: ScanLine, color: "bg-blue-500" },
    { id: "send", label: "Send Money", icon: Send, color: "bg-purple-500" },
    { id: "request", label: "Request", icon: ArrowDownLeft, color: "bg-emerald-500" },
    { id: "bank", label: "Bank Transfer", icon: Landmark, color: "bg-orange-500" },
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

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-primary-foreground shadow-glow"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Wallet2 className="h-4 w-4" /> Available Balance
            </div>
            <Button size="sm" variant="ghost" className="h-8 rounded-full bg-white/10 hover:bg-white/20 text-xs px-3">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Money
            </Button>
          </div>
          <div className="mt-3 text-4xl font-extrabold font-mono tracking-tighter">
            ${currentUser.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-6 flex gap-4">
            <div className="flex-1 rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-wider opacity-60">Total Sent</p>
              <p className="mt-1 text-sm font-bold font-mono">${sent.toLocaleString()}</p>
            </div>
            <div className="flex-1 rounded-2xl bg-white/10 p-3 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-wider opacity-60">Total Received</p>
              <p className="mt-1 text-sm font-bold font-mono">${received.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      </motion.div>

      {/* Main Action Section - Mobile First Grid */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className={cn(
              "flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95",
              action.color
            )}>
              <action.icon className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <span className="text-[10px] md:text-sm font-semibold text-center leading-tight">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* AI Fraud Alerts Card - If any */}
      {unresolvedAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-danger/30 bg-danger/5 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger text-danger-foreground">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-danger">AI Fraud Warning</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{unresolvedAlerts[0].reason}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10">Action</Button>
          </div>
        </motion.div>
      )}

      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          className="rounded-2xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm">Monthly Insights</h3>
            </div>
            <span className="text-[10px] font-bold text-success font-mono">+12.5%</span>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-xs mb-1 font-medium">
               <span className="text-muted-foreground">Spending</span>
               <span>$1,240 / $2,000</span>
             </div>
             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "62%" }} />
             </div>
             <p className="text-[10px] text-muted-foreground leading-relaxed italic">
               AI Tip: You can save $40 this month by switching to an annual plan for Netflix.
             </p>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block rounded-2xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-success/10 text-success">
              <Globe className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-sm">Eco Score</h3>
          </div>
          <div className="flex items-end gap-3 font-mono">
            <span className="text-3xl font-extrabold text-success">1.2</span>
            <span className="text-xs text-muted-foreground pb-1">kg CO2e</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Your footprint is 15% lower than average.</p>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-primary font-bold">See More</Button>
        </div>
        <div className="space-y-3">
          {recentTx.map((tx, i) => {
            const isSend = tx.senderId === currentUser.id;
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full font-bold",
                    isSend ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {isSend ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{isSend ? tx.receiverName : tx.senderName}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {tx.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-mono font-bold text-sm",
                    isSend ? "text-red-600" : "text-emerald-600"
                  )}>
                    {isSend ? "-" : "+"}${tx.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    {tx.status === "completed" && <ShieldCheck className="h-2.5 w-2.5 text-success" />}
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-tighter",
                      tx.status === "completed" ? "text-success" :
                      tx.status === "flagged" ? "text-warning" :
                      tx.status === "blocked" ? "text-danger" : "text-muted-foreground"
                    )}>{tx.status}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WalletSection;

