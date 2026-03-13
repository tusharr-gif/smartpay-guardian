import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank, Target, ArrowLeft, Plus, TrendingUp, ShieldCheck,
  Clock, Settings2, ChevronRight, ArrowRightCircle, Sparkles,
  CheckCircle2, ExternalLink, Smartphone, X, Pause, Trash2,
  BarChart3, CalendarDays, Edit3, Bell, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SavingsWalletProps {
  onBack: () => void;
}

type Step = "dashboard" | "create_plan" | "connect_upi" | "redirecting" | "success" | "mandate_detail";

interface SavingsPlan {
  id: string;
  goalName: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly";
  startDate: string;
  upiApp: string;
  status: "active" | "paused" | "cancelled";
  savedAmount: number;
  targetAmount: number;
  nextDebit: string;
  mandateRef: string;
}

const UPI_APPS = [
  { id: "phonepe", name: "PhonePe", icon: "🟣", color: "hover:border-purple-500/50 hover:bg-purple-500/5", active: "#7C3AED" },
  { id: "gpay", name: "Google Pay", icon: "🔴", color: "hover:border-red-500/50 hover:bg-red-500/5", active: "#DC2626" },
  { id: "paytm", name: "Paytm", icon: "🔵", color: "hover:border-blue-500/50 hover:bg-blue-500/5", active: "#2563EB" },
  { id: "jiopay", name: "JioPay", icon: "🟢", color: "hover:border-green-500/50 hover:bg-green-500/5", active: "#16A34A" },
];

const SavingsWallet = ({ onBack }: SavingsWalletProps) => {
  const { currentUser } = useApp();
  const [step, setStep] = useState<Step>("dashboard");
  const [activeMandateDetail, setActiveMandateDetail] = useState<SavingsPlan | null>(null);

  // Form State
  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedApp, setSelectedApp] = useState("");
  const [upiId, setUpiId] = useState(currentUser?.phone ? `${currentUser.phone.replace(/\s/g,"")}@ybl` : "");

  // Plans State
  const [plans, setPlans] = useState<SavingsPlan[]>([
    {
      id: "1", goalName: "Emergency Fund", amount: 500, frequency: "monthly",
      startDate: "2026-03-01", upiApp: "PhonePe", status: "active",
      savedAmount: 1500, targetAmount: 10000, nextDebit: "Apr 1, 2026",
      mandateRef: "MND202603001"
    },
    {
      id: "2", goalName: "Vacation 2027", amount: 200, frequency: "weekly",
      startDate: "2026-02-15", upiApp: "Google Pay", status: "paused",
      savedAmount: 800, targetAmount: 5000, nextDebit: "Paused",
      mandateRef: "MND202602015"
    },
  ]);

  const totalSaved = plans.reduce((s, p) => s + p.savedAmount, 0);

  const handleCreatePlan = () => {
    if (!goalName || !amount || Number(amount) <= 0) {
      toast.error("Please fill in all fields");
      return;
    }
    setStep("connect_upi");
  };

  const handleRedirect = () => {
    if (!selectedApp || !upiId) {
      toast.error("Please select a UPI app and enter UPI ID");
      return;
    }
    setStep("redirecting");

    const appInfo = UPI_APPS.find(a => a.id === selectedApp);
    toast.info(`Opening ${appInfo?.name}...`, { duration: 2000 });

    setTimeout(() => {
      const newPlan: SavingsPlan = {
        id: Date.now().toString(),
        goalName,
        amount: Number(amount),
        frequency,
        startDate,
        upiApp: appInfo?.name || selectedApp,
        status: "active",
        savedAmount: 0,
        targetAmount: Number(amount) * 24,
        nextDebit: "Apr 1, 2026",
        mandateRef: `MND${Date.now()}`
      };
      setPlans(prev => [newPlan, ...prev]);
      setStep("success");
    }, 3000);
  };

  const handlePause = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "paused" ? "active" : "paused" } : p));
    toast.success("Mandate updated");
    setActiveMandateDetail(null);
    setStep("dashboard");
  };

  const handleCancel = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: "cancelled" } : p));
    toast.error("Mandate cancelled");
    setActiveMandateDetail(null);
    setStep("dashboard");
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  // ─── SCREENS ────────────────────────────────────────────────────────────────

  if (step === "redirecting") {
    const appInfo = UPI_APPS.find(a => a.id === selectedApp);
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center p-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-32 w-32 rounded-[40px] bg-card flex items-center justify-center text-7xl border-2 border-border shadow-2xl"
        >
          {UPI_APPS.find(a => a.id === selectedApp)?.icon}
        </motion.div>

        <div className="space-y-3">
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.4 }}
                className="h-2 w-2 rounded-full bg-primary" />
            ))}
          </div>
          <h2 className="text-2xl font-black">Redirecting to {appInfo?.name}</h2>
          <p className="text-sm text-muted-foreground font-medium">Please authorize the mandate in the app.<br />Do not press back.</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm text-left space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mandate Summary</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Goal</span><span className="font-bold">{goalName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-bold">₹{amount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Frequency</span><span className="font-bold capitalize">{frequency}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">UPI ID</span><span className="font-bold font-mono text-xs">{upiId}</span></div>
          </div>
        </div>

        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">NPCI Compliant • End-to-End Encrypted</p>
      </motion.div>
    );
  }

  if (step === "success") {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="h-28 w-28 rounded-full bg-success flex items-center justify-center shadow-2xl shadow-success/30"
        >
          <CheckCircle2 className="h-14 w-14 text-white" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black">Mandate Active!</h2>
          <p className="text-muted-foreground font-medium max-w-xs">
            Your <span className="text-primary font-black">{goalName}</span> AutoSave of <span className="text-primary font-black">₹{amount}/{frequency}</span> is now live.
          </p>
        </div>
        <div className="bg-success/5 border border-success/20 rounded-3xl p-6 w-full max-w-sm text-left space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <p className="text-[10px] font-black uppercase text-success">NPCI Mandate Confirmed</p>
          </div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Mandate Ref</span><span className="font-mono font-bold">MND{Date.now().toString().slice(-6)}</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">First Debit</span><span className="font-bold">Apr 1, 2026</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Linked App</span><span className="font-bold">{UPI_APPS.find(a => a.id === selectedApp)?.name}</span></div>
        </div>
        <Button onClick={() => setStep("dashboard")} className="w-full max-w-sm h-14 rounded-2xl font-black gradient-primary shadow-glow">
          VIEW MY MANDATES
        </Button>
      </motion.div>
    );
  }

  if (step === "mandate_detail" && activeMandateDetail) {
    const plan = activeMandateDetail;
    const progress = Math.min((plan.savedAmount / plan.targetAmount) * 100, 100);
    const appInfo = UPI_APPS.find(a => a.name === plan.upiApp);

    return (
      <motion.div variants={slideVariants} initial="enter" animate="center" className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setStep("dashboard")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-xl font-black tracking-tighter uppercase">{plan.goalName}</h2>
          <span className={cn("ml-auto px-3 py-1 rounded-full text-[9px] font-black uppercase",
            plan.status === "active" ? "bg-success/10 text-success border border-success/20" :
            plan.status === "paused" ? "bg-warning/10 text-warning border border-warning/20" :
            "bg-danger/10 text-danger border border-danger/20"
          )}>
            {plan.status}
          </span>
        </div>

        {/* Progress Card */}
        <div className="rounded-[36px] bg-card border border-border p-8 shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Saved So Far</p>
                <p className="text-4xl font-black">₹{plan.savedAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">of ₹{plan.targetAmount.toLocaleString()} goal</p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Target className="h-8 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground font-bold">
                <span>{Math.round(progress)}% reached</span>
                <span>{100 - Math.round(progress)}% remaining</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full gradient-primary"
                />
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Mandate Info */}
        <div className="rounded-[28px] bg-card border border-border p-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mandate Details</p>
          {[
            { label: "Amount", value: `₹${plan.amount}/${plan.frequency}` },
            { label: "UPI App", value: `${appInfo?.icon || "💳"} ${plan.upiApp}` },
            { label: "Mandate Ref", value: plan.mandateRef },
            { label: "Next Debit", value: plan.nextDebit },
            { label: "Started", value: new Date(plan.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
              <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
              <span className="text-xs font-black">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handlePause(plan.id)}
            variant="outline"
            className="h-14 rounded-2xl font-black border-2 gap-2"
          >
            <Pause className="h-4 w-4" />
            {plan.status === "paused" ? "RESUME" : "PAUSE"}
          </Button>
          <Button
            onClick={() => handleCancel(plan.id)}
            variant="outline"
            className="h-14 rounded-2xl font-black border-2 border-danger/30 text-danger gap-2 hover:bg-danger/5"
          >
            <Trash2 className="h-4 w-4" /> CANCEL
          </Button>
        </div>

        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
          <p className="text-[10px] font-bold text-warning/80">Pausing will stop future debits but not affect your saved amount. Cancellation is irreversible.</p>
        </div>
      </motion.div>
    );
  }

  if (step === "connect_upi") {
    return (
      <motion.div variants={slideVariants} initial="enter" animate="center" className="space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setStep("create_plan")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">Connect UPI Account</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Step 2 of 2</p>
          </div>
        </div>

        {/* Step bar */}
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Your UPI ID (auto-detected)</label>
          <Input
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            placeholder="yourphone@ybl"
            className="h-14 rounded-2xl font-mono font-bold"
          />
          <p className="text-[9px] text-muted-foreground ml-1">Your UPI ID is fetched from your registered mobile number.</p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select UPI App for Mandate</p>
          <div className="grid grid-cols-2 gap-3">
            {UPI_APPS.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all active:scale-95",
                  selectedApp === app.id
                    ? "border-primary bg-primary/5"
                    : `border-border ${app.color}`
                )}
              >
                <span className="text-3xl">{app.icon}</span>
                <div className="text-left">
                  <p className="font-black text-sm">{app.name}</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase">UPI Mandate</p>
                </div>
                {selectedApp === app.id && (
                  <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mandate preview */}
        <div className="rounded-[28px] bg-muted/30 border border-border p-6 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deep Link that will be triggered</p>
          <code className="text-[9px] font-mono text-muted-foreground block leading-relaxed break-all bg-background/50 p-3 rounded-xl border border-border">
            {`upi://mandate?pa=januin.savings@icici&pn=Januin+Savings&am=${amount}&cu=INR&recur=${frequency.toUpperCase()}&tn=${goalName.replace(/ /g,"+")}&tr=MND${Date.now()}`}
          </code>
        </div>

        <Button
          onClick={handleRedirect}
          disabled={!selectedApp || !upiId}
          className="w-full h-16 rounded-[24px] font-black text-lg gradient-primary shadow-glow gap-3"
        >
          AUTHORIZE MANDATE <ExternalLink className="h-5 w-5" />
        </Button>

        <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          NPCI Compliant • Your PIN is never stored or shared
        </p>
      </motion.div>
    );
  }

  if (step === "create_plan") {
    return (
      <motion.div variants={slideVariants} initial="enter" animate="center" className="space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setStep("dashboard")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">New Savings Plan</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Step 1 of 2</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-muted" />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Savings Goal Name</label>
            <Input value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="e.g. Emergency Fund, Trip to Goa..." className="h-14 rounded-2xl font-bold" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Amount to Save</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">₹</span>
              <Input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="500" className="h-14 rounded-2xl font-black text-xl pl-10" />
            </div>
            <div className="flex gap-2 mt-2">
              {["100", "500", "1000", "2000"].map(v => (
                <button key={v} onClick={() => setAmount(v)} className={cn("flex-1 py-2 rounded-xl text-xs font-black transition-all", amount === v ? "bg-primary text-white" : "bg-muted hover:bg-muted/80")}>₹{v}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Frequency</label>
            <div className="grid grid-cols-3 gap-3">
              {(["daily", "weekly", "monthly"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={cn("py-4 rounded-2xl font-black text-sm capitalize transition-all border-2",
                    frequency === f ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 hover:bg-muted"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Start Date</label>
            <Input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" className="h-14 rounded-2xl font-bold" />
          </div>
        </div>

        <Button onClick={handleCreatePlan} className="w-full h-16 rounded-[24px] font-black text-lg gradient-primary shadow-glow">
          NEXT: CONNECT UPI →
        </Button>
      </motion.div>
    );
  }

  // ─── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <motion.div variants={slideVariants} initial="enter" animate="center" className="space-y-8">
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

      {/* Total card */}
      <div className="relative overflow-hidden rounded-[40px] gradient-primary p-8 text-white shadow-glow">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Total Saved</p>
          <h1 className="text-5xl font-black tracking-tighter">₹{totalSaved.toLocaleString()}</h1>
          <p className="text-xs text-white/70 mt-2 font-bold">{plans.filter(p => p.status === "active").length} Active Mandates</p>
          <Button
            onClick={() => { setGoalName(""); setAmount(""); setFrequency("monthly"); setSelectedApp(""); setStep("create_plan"); }}
            className="mt-5 h-12 px-6 rounded-2xl font-black bg-white text-primary hover:bg-white/90 shadow-lg gap-2"
          >
            <Plus className="h-5 w-5" /> NEW AUTO-SAVE
          </Button>
        </div>
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "This Month", value: "₹700", icon: BarChart3, color: "text-primary bg-primary/10" },
          { label: "Next Debit", value: "Apr 1", icon: CalendarDays, color: "text-amber-500 bg-amber-500/10" },
          { label: "AI Score", value: "92/100", icon: ShieldCheck, color: "text-success bg-success/10" },
        ].map(stat => (
          <div key={stat.label} className="rounded-[24px] bg-card border border-border p-4 flex flex-col items-center gap-2">
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-black">{stat.value}</p>
            <p className="text-[8px] font-bold text-muted-foreground uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mandates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Mandates</h3>
          <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase text-primary">View History</Button>
        </div>

        {plans.map(plan => {
          const progress = Math.min((plan.savedAmount / plan.targetAmount) * 100, 100);
          const appInfo = UPI_APPS.find(a => a.name === plan.upiApp);
          return (
            <button
              key={plan.id}
              onClick={() => { setActiveMandateDetail(plan); setStep("mandate_detail"); }}
              className="w-full text-left rounded-[28px] bg-card border border-border p-5 transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-2xl">
                    {appInfo?.icon || "💳"}
                  </div>
                  <div>
                    <p className="font-black text-sm">{plan.goalName}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">₹{plan.amount}/{plan.frequency} via {plan.upiApp}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[8px] font-black uppercase",
                    plan.status === "active" ? "bg-success/10 text-success" :
                    plan.status === "paused" ? "bg-warning/10 text-warning" :
                    "bg-danger/10 text-danger"
                  )}>
                    {plan.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase">
                  <span>₹{plan.savedAmount.toLocaleString()} saved</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Bell className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[9px] font-bold text-muted-foreground">Next: {plan.nextDebit}</span>
                </div>
              </div>
            </button>
          );
        })}

        {plans.length === 0 && (
          <div className="py-16 text-center">
            <PiggyBank className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm font-black text-muted-foreground">No savings mandates yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Start your first Auto-Save above!</p>
          </div>
        )}
      </div>

      {/* AI Tip */}
      <div className="relative overflow-hidden rounded-[28px] bg-card border border-border p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-black text-primary uppercase tracking-wide mb-1">AI Savings Tip</p>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              Increase your Emergency Fund by ₹200/month to reach your goal 4 months faster. You spent 18% less this week — a great time to top up!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SavingsWallet;
