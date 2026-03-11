import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { useApp } from "@/context/AppContext";

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

      {/* Recent */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
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
                  <span className={`text-[10px] font-medium uppercase ${
                    tx.status === "completed" ? "text-success" :
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
