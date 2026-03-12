import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Globe } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

const WalletSection = () => {
  const { currentUser, transactions } = useApp();
  if (!currentUser) return null;

  const userTx = transactions.filter(t => t.senderId === currentUser.id || t.receiverId === currentUser.id);
  const sent = userTx.filter(t => t.senderId === currentUser.id).reduce((s, t) => s + t.amount, 0);
  const received = userTx.filter(t => t.receiverId === currentUser.id).reduce((s, t) => s + t.amount, 0);
  const recentTx = userTx.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-primary p-8 text-primary-foreground shadow-glow"
      >
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Wallet className="h-4 w-4" /> Available Balance
        </div>
        <div className="mt-2 text-4xl font-extrabold font-mono">
          ${currentUser.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-primary-foreground/10 p-4">
            <div className="flex items-center gap-1.5 text-xs opacity-70"><ArrowUpRight className="h-3.5 w-3.5" /> Total Sent</div>
            <div className="mt-1 text-lg font-bold font-mono">${sent.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 p-4">
            <div className="flex items-center gap-1.5 text-xs opacity-70"><ArrowDownLeft className="h-3.5 w-3.5" /> Total Received</div>
            <div className="mt-1 text-lg font-bold font-mono">${received.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </motion.div>

      {/* Smart Analysis Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm">AI Spending Insights</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>Food & Dining</span>
                <span>42%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "42%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>Subscription Services</span>
                <span>18%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "18%" }} />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic">AI Prediction: You are likely to spend $120 more on entertainment this month.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe className="h-12 w-12" />
          </div>
          <h3 className="font-bold text-sm mb-4">Carbon Footprint</h3>
          <div className="flex items-end gap-3 font-mono">
            <span className="text-3xl font-extrabold text-success">1.2</span>
            <span className="text-xs text-muted-foreground pb-1">kg CO2e / tx avg</span>
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">Your digital usage is 15% lower than the local average. Keep it up!</p>
          <div className="mt-4 flex gap-1 h-1">
            {[30, 70, 45, 90, 20, 50, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-success/20 rounded-t-full" style={{ height: `${h}%` }} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
        </div>
        <div className="space-y-3">
          {recentTx.map(tx => {
            const isSend = tx.senderId === currentUser.id;
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isSend ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                    {isSend ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{isSend ? tx.receiverName : tx.senderName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${isSend ? "text-destructive" : "text-success"}`}>
                    {isSend ? "-" : "+"}${tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-medium uppercase ${tx.status === "completed" ? "text-success" :
                    tx.status === "flagged" ? "text-warning" :
                      tx.status === "blocked" ? "text-danger" : "text-muted-foreground"
                    }`}>{tx.status}</span>
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
