import { useState } from "react";
import { Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const SendMoney = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "result">("form");
  const [lastTx, setLastTx] = useState<any>(null);
  const [isEscrow, setIsEscrow] = useState(false);
  const [generatedOtp] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const { sendMoney, currentUser } = useApp();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > (currentUser?.walletBalance || 0)) { toast.error("Insufficient balance"); return; }
    toast.info(`OTP sent: ${generatedOtp} (simulated)`);
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) { toast.error("Invalid OTP"); return; }
    const tx = sendMoney(email, parseFloat(amount));
    if (tx) {
      setLastTx(tx);
      setStep("result");
      if (tx.status === "flagged") {
        toast.warning(`Transaction flagged! Risk score: ${tx.riskScore}/100`);
      } else {
        toast.success("Transaction completed!");
      }
    } else {
      toast.error("Transfer failed. Check recipient email.");
    }
  };

  const reset = () => {
    setEmail("");
    setAmount("");
    setOtp("");
    setStep("form");
    setLastTx(null);
  };

  return (
    <div className="mx-auto max-w-lg">
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
              <Send className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold">Secure Transfer</h2>
            <p className="mt-1 text-sm text-muted-foreground">Transfer funds securely with AI Guardian protection</p>
            <form onSubmit={handleSend} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Recipient Mail</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@example.com" required />
                {email.includes("@") && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 flex items-center justify-between rounded-lg bg-muted/50 p-2 text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${email.includes("sarah") || email.includes("admin") ? "bg-success" : "bg-warning"}`} />
                      <span className="font-bold uppercase tracking-wider">AI Recipient Trust</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">Score: {email.includes("sarah") || email.includes("admin") ? "98" : "45"}/100</span>
                      <span className={`rounded px-1 text-[8px] font-black uppercase text-white ${email.includes("sarah") || email.includes("admin") ? "bg-success" : "bg-warning"}`}>
                        {email.includes("sarah") || email.includes("admin") ? "Verified" : "New"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input type="number" step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
              </div>

              <div
                className={`flex cursor-pointer select-none items-center justify-between rounded-xl border p-4 transition-all ${isEscrow ? "border-primary/50 bg-primary/5 shadow-inner" : "border-border bg-card"}`}
                onClick={() => setIsEscrow(!isEscrow)}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isEscrow ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Escrow Mode</h4>
                    <p className="text-[10px] text-muted-foreground leading-tight">Funds held securely in Guardian Vault until work is approved.</p>
                  </div>
                </div>
                <div className={`h-5 w-10 rounded-full p-1 transition-colors ${isEscrow ? "bg-primary" : "bg-muted"}`}>
                  <div className={`h-3 w-3 rounded-full bg-white transition-transform ${isEscrow ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                Available balance: <span className="font-mono font-semibold text-foreground">${currentUser?.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Continue</Button>
            </form>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
              <AlertTriangle className="h-7 w-7 text-warning" />
            </div>
            <h2 className="text-xl font-bold">Verify Transaction</h2>
            <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit OTP to confirm</p>
            <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between items-center">
                <span>Sending <span className="font-mono font-bold">${parseFloat(amount).toLocaleString()}</span> to <span className="font-medium">{email}</span></span>
                {isEscrow && <span className="text-[9px] font-bold uppercase text-primary border border-primary/30 px-1.5 py-0.5 rounded bg-primary/5">Escrow Active</span>}
              </div>
            </div>
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>OTP Code</Label>
                <Input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} className="text-center text-lg font-mono tracking-widest" required />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Verify & Send</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("form")}>Back</Button>
            </form>
          </motion.div>
        )}

        {step === "result" && lastTx && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${lastTx.status === "flagged" ? "bg-warning/10" : "bg-success/10"}`}>
              {lastTx.status === "flagged" ? <AlertTriangle className="h-8 w-8 text-warning" /> : <CheckCircle2 className="h-8 w-8 text-success" />}
            </div>
            <h2 className="text-xl font-bold">{lastTx.status === "flagged" ? "Transaction Flagged" : "Transaction Complete"}</h2>
            <p className="mt-2 text-3xl font-extrabold font-mono">${lastTx.amount.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted-foreground">to {lastTx.receiverName}</p>
            <div className="mt-6 rounded-lg bg-muted p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Risk Score</span><span className={`font-mono font-bold ${lastTx.riskScore > 70 ? "text-danger" : lastTx.riskScore > 40 ? "text-warning" : "text-success"}`}>{lastTx.riskScore}/100</span></div>
              <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium uppercase">{lastTx.status}</span></div>
              {isEscrow && <div className="mt-2 flex justify-between"><span className="text-primary font-bold">Type</span><span className="font-bold text-primary italic uppercase text-[10px]">Guardian Escrow</span></div>}
              <div className="mt-2 flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono text-xs">{lastTx.id}</span></div>
            </div>
            <Button onClick={reset} className="mt-6 w-full gradient-primary border-0 text-primary-foreground">Send Another</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SendMoney;
