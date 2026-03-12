import { useApp } from "@/context/AppContext";
import { ArrowUpRight, ArrowDownLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

const TransactionHistory = () => {
  const { currentUser, transactions } = useApp();
  if (!currentUser) return null;

  const userTx = transactions.filter(t => t.senderId === currentUser.id || t.receiverId === currentUser.id);

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-success/10 text-success";
    if (s === "flagged") return "bg-warning/10 text-warning";
    if (s === "blocked") return "bg-danger/10 text-danger";
    return "bg-muted text-muted-foreground";
  };

  const riskColor = (score: number) => {
    if (score > 70) return "text-danger";
    if (score > 40) return "text-warning";
    return "text-success";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">User</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Amount</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Risk Score</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {userTx.map((tx, i) => {
              const isSend = tx.senderId === currentUser.id;
              return (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${isSend ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                      {isSend ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium">
                      {isSend ? tx.receiverName : tx.senderName}
                      {(() => {
                        const name = isSend ? tx.receiverName : tx.senderName;
                        if (name.includes("Sarah") || name.includes("Admin"))
                          return <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 text-[9px] font-bold uppercase text-success tracking-wider"><Shield className="h-2.5 w-2.5" /> Verified</span>;
                        if (name.includes("Alex"))
                          return <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold uppercase text-primary tracking-wider">Trusted</span>;
                        if (tx.riskScore > 80)
                          return <span className="inline-flex items-center rounded-full bg-danger/20 px-2 py-0.5 text-[9px] font-bold uppercase text-danger tracking-wider">Suspicious</span>;
                        return <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase text-muted-foreground tracking-wider">New</span>;
                      })()}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-mono font-semibold ${isSend ? "text-destructive" : "text-success"}`}>
                    {isSend ? "-" : "+"}${tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${tx.riskScore > 70 ? "bg-danger" : tx.riskScore > 40 ? "bg-warning" : "bg-success"}`} style={{ width: `${tx.riskScore}%` }} />
                      </div>
                      <span className={`font-mono text-xs font-bold ${riskColor(tx.riskScore)}`}>{tx.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${statusColor(tx.status)}`}>{tx.status}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
