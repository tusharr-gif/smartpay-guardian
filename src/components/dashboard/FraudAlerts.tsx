import { useApp } from "@/context/AppContext";
import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { motion } from "framer-motion";

const FraudAlerts = () => {
  const { fraudAlerts } = useApp();

  return (
    <div className="space-y-4">
      {fraudAlerts.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <Shield className="h-12 w-12 text-success" />
          <p className="mt-4 text-lg font-medium">No fraud alerts</p>
          <p className="text-sm text-muted-foreground">All transactions are looking safe</p>
        </div>
      )}
      {fraudAlerts.map((alert, i) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`rounded-2xl border p-6 shadow-card ${alert.resolved ? "border-border bg-card" : "border-warning/30 bg-warning/5"
            }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${alert.resolved ? "bg-success/10" : "bg-warning/10"}`}>
                {alert.resolved ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertTriangle className="h-5 w-5 text-warning" />}
              </div>
              <div>
                <h3 className="font-semibold">{alert.userName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{alert.reason}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()} · Transaction {alert.transactionId}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-extrabold font-mono ${alert.riskScore > 90 ? "text-danger" : "text-warning"}`}>
                {alert.riskScore}
              </div>
              <div className="text-[10px] uppercase text-muted-foreground">risk score</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FraudAlerts;
