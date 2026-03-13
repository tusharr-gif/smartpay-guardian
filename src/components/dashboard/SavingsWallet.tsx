import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank, Target, ArrowLeft, Plus, TrendingUp, ShieldCheck,
  Clock, Settings2, ChevronRight, ArrowRightCircle, Sparkles,
  CheckCircle2, ExternalLink, Smartphone, X, Pause, Trash2,
  BarChart3, CalendarDays, Edit3, Bell, AlertTriangle, Zap,
  Info, ArrowUpRight, Wallet2, LayoutDashboard, History as HistoryIcon,
  ShieldEllipsis, Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface SavingsWalletProps {
  onBack: () => void;
}

type Step = "dashboard" | "create_plan" | "connect_upi" | "redirecting" | "success" | "mandate_detail" | "analytics";

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

const analyticsData = [
  { month: 'Oct', amount: 1200 },
  { month: 'Nov', amount: 1900 },
  { month: 'Dec', amount: 3200 },
  { month: 'Jan', amount: 4800 },
  { month: 'Feb', amount: 6200 },
  { month: 'Mar', amount: 8450 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

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
  const [isSmartRoundingEnabled, setIsSmartRoundingEnabled] = useState(true);

  // Plans State
  const [plans, setPlans] = useState<SavingsPlan[]>([
    {
      id: "1", goalName: "Emergency Fund", amount: 1500, frequency: "monthly",
      startDate: "2024-11-01", upiApp: "PhonePe", status: "active",
      savedAmount: 6500, targetAmount: 25000, nextDebit: "Apr 1, 2026",
      mandateRef: "MND202411001"
    },
    {
      id: "2", goalName: "Europe Trip", amount: 3000, frequency: "monthly",
      startDate: "2025-01-15", upiApp: "Google Pay", status: "active",
      savedAmount: 9000, targetAmount: 150000, nextDebit: "Apr 15, 2026",
      mandateRef: "MND202501015"
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
    toast.success("Mandate status updated");
    setActiveMandateDetail(null);
    setStep("dashboard");
  };

  const handleCancel = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: "cancelled" } : p));
    toast.error("Mandate cancelled successfully");
    setActiveMandateDetail(null);
    setStep("dashboard");
  };

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // ─── SCREENS ────────────────────────────────────────────────────────────────

  if (step === "redirecting") {
    const appInfo = UPI_APPS.find(a => a.id === selectedApp);
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center p-8 bg-card/30 rounded-[40px] border border-border/50"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="h-32 w-32 rounded-[40px] bg-background flex items-center justify-center text-7xl border-2 border-border shadow-2xl relative z-10"
          >
            {appInfo?.icon}
          </motion.div>
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 -z-0" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <motion.div key={i} animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="h-2.5 w-2.5 rounded-full bg-primary" />
            ))}
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Securing Mandate...</h2>
          <p className="text-sm text-muted-foreground font-semibold px-4">
            We are redirecting you to <span className="text-primary font-bold">{appInfo?.name}</span>.<br />
            Verify the merchant and enter your UPI PIN.
          </p>
        </div>

        <div className="bg-muted/50 backdrop-blur-md border border-border rounded-[32px] p-8 w-full max-w-sm text-left space-y-4 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mandate Authentication</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase">Recipient</span><span className="font-black text-sm">Januin Savings</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase">Amount</span><span className="font-black text-sm">₹{amount}</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase">Interval</span><span className="font-black text-sm capitalize">{frequency}</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase">VPA</span><span className="font-mono font-bold text-[10px] bg-background px-2 py-1 rounded">{upiId}</span></div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-[9px] font-black uppercase text-success tracking-widest">NPCI 2.0 Certified mandate protocol</span>
        </div>
      </motion.div>
    );
  }

  if (step === "success") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] space-y-10 text-center p-8"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="h-32 w-32 rounded-[2.5rem] bg-success flex items-center justify-center shadow-elevated relative z-10"
          >
            <CheckCircle2 className="h-16 w-16 text-white" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-success blur-3xl scale-150 -z-0"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight italic uppercase">Success!</h2>
          <p className="text-muted-foreground font-bold text-lg max-w-xs mx-auto">
            Your mandate is now live. Automated savings for <span className="text-primary">{goalName}</span> starts today.
          </p>
        </div>

        <div className="w-full max-w-sm overflow-hidden rounded-[32px] border border-border bg-card shadow-lg">
           <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold"><span className="text-muted-foreground">REF ID</span><span className="font-mono">{`TXN${Date.now().toString().slice(-8)}`}</span></div>
              <div className="flex justify-between items-center text-xs font-bold"><span className="text-muted-foreground">NEXT DEBIT</span><span>April 1, 2026</span></div>
              <div className="flex justify-between items-center text-xs font-bold"><span className="text-muted-foreground">STATUS</span><span className="text-success uppercase">Active</span></div>
           </div>
           <Button onClick={() => setStep("dashboard")} className="w-full h-16 rounded-none font-black gradient-primary border-t border-white/10 uppercase tracking-widest">
             GO TO DASHBOARD
           </Button>
        </div>
      </motion.div>
    );
  }

  if (step === "analytics") {
    const pieData = [
      { name: 'Emergency', value: 6500 },
      { name: 'Travel', value: 9000 },
      { name: 'Gadgets', value: 2500 },
      { name: 'Other', value: 1450.5 },
    ];

    return (
      <motion.div variants={slideVariants} initial="enter" animate="center" className="space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setStep("dashboard")}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Savings Analytics</h2>
        </div>

        {/* Growth Chart */}
        <div className="rounded-[36px] bg-card border border-border p-6 shadow-xl">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Savings Growth (Net)</h3>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                    itemStyle={{color: '#3b82f6'}}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Allocation */}
           <div className="rounded-[32px] bg-card border border-border p-6 flex flex-col items-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 w-full">Portfolio Allocation</h3>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.name}</span>
                    </div>
                  ))}
              </div>
           </div>

           {/* AI Inisghts */}
           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">AI Wealth Insights</h3>
              <div className="rounded-[28px] bg-primary/5 border border-primary/10 p-5 space-y-3">
                  <div className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-primary" /><p className="text-xs font-black uppercase text-primary">Opportunity Found</p></div>
                  <p className="text-xs font-medium leading-relaxed">You have ₹4,200 idle in your bank. Moving this to your Savings Wallet will earn you ₹270 extra interest annually.</p>
                  <Button variant="outline" size="sm" className="h-8 rounded-xl text-[10px] font-black border-primary/20 text-primary">ACT NOW</Button>
              </div>
              <div className="rounded-[28px] bg-success/5 border border-success/10 p-5 space-y-3">
                  <div className="flex items-center gap-3"><TrendingUp className="h-4 w-4 text-success" /><p className="text-xs font-black uppercase text-success">Consistency Bonus</p></div>
                  <p className="text-xs font-medium leading-relaxed">You've reached your monthly goal 4 days early! Keeping this pace will beat your target by 2 months.</p>
              </div>
           </div>
        </div>

        <Button onClick={() => setStep("dashboard")} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-muted/50 border border-border text-foreground hover:bg-muted">
           BACK TO DASHBOARD
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
          <div className="flex-1">
            <h2 className="text-xl font-black tracking-tighter uppercase">{plan.goalName}</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mandate detail</p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
            plan.status === "active" ? "bg-success text-white" :
            plan.status === "paused" ? "bg-warning text-white" :
            "bg-danger text-white"
          )}>
            {plan.status}
          </span>
        </div>

        {/* Progress Card Highlights */}
        <div className="rounded-[40px] bg-card border border-border p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Saved Amount</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black italic">₹{plan.savedAmount.toLocaleString()}</span>
                    <span className="text-xs font-bold text-muted-foreground">/ ₹{plan.targetAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform">
                <Target className="h-10 w-10" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="p-4 rounded-3xl bg-muted/30 border border-border">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Frequency</p>
                  <p className="font-black text-sm capitalize">{plan.frequency}</p>
               </div>
               <div className="p-4 rounded-3xl bg-muted/30 border border-border">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Next Debit</p>
                  <p className="font-black text-sm">{plan.nextDebit}</p>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-primary">{Math.round(progress)}% Complete</span>
                <span className="text-muted-foreground">₹{(plan.targetAmount - plan.savedAmount).toLocaleString()} Left</span>
              </div>
              <div className="h-4 rounded-full bg-muted/50 p-1 border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full rounded-full gradient-primary shadow-glow"
                />
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
        </div>

        {/* Meta Info */}
        <div className="rounded-[32px] bg-muted/20 border border-border p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2"><Info className="h-4 w-4 text-muted-foreground" /><p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Administrative Info</p></div>
          {[
            { label: "Installment", value: `₹${plan.amount}` },
            { label: "Authentication App", value: `${appInfo?.icon || "📱"} ${plan.upiApp}` },
            { label: "NPCI Mandate Ref", value: plan.mandateRef, mono: true },
            { label: "VPA Auth", value: upiId, mono: true },
            { label: "Creation Date", value: new Date(plan.startDate).toLocaleDateString("en-IN", { month: 'long', day: 'numeric', year: 'numeric' }) },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
              <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
              <span className={cn("text-xs font-black", item.mono && "font-mono text-[10px]")}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handlePause(plan.id)}
            variant="outline"
            className="h-16 rounded-[24px] font-black border-2 gap-3 hover:bg-muted"
          >
            {plan.status === "paused" ? <ArrowUpRight className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            {plan.status === "paused" ? "RESUME" : "PAUSE"}
          </Button>
          <Button
            onClick={() => handleCancel(plan.id)}
            variant="outline"
            className="h-16 rounded-[24px] font-black border-2 border-danger/20 text-danger gap-3 hover:bg-danger/5"
          >
            <Trash2 className="h-5 w-5" /> CANCEL
          </Button>
        </div>

        <div className="rounded-[24px] bg-muted/50 p-5 flex items-center justify-between border border-border">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                    <Edit3 className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-sm font-black">Edit Plan</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Change amount or frequency</p>
                </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
            <h2 className="text-2xl font-black tracking-tighter uppercase">Connect UPI</h2>
            <div className="flex gap-1 mt-1">
                <div className="h-1 w-8 rounded-full bg-primary" />
                <div className="h-1 w-8 rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-card border border-border p-8 shadow-lg space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">VPA / UPI ID</label>
              <div className="group focus-within:ring-2 focus-within:ring-primary/20 rounded-[24px] transition-all">
                <Input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  className="h-16 rounded-[24px] font-bold text-lg px-6 bg-muted/30 border-none shadow-inner"
                />
              </div>
              <div className="flex items-center gap-2 px-1">
                  <span className="h-3 w-3 bg-success rounded-full animate-pulse" />
                  <p className="text-[9px] font-black text-success uppercase tracking-widest">Active Phone Link: {currentUser?.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select UPI Provider</p>
              <div className="grid grid-cols-2 gap-3">
                {UPI_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app.id)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-[28px] border-2 transition-all relative overflow-hidden group",
                      selectedApp === app.id
                        ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                        : `border-border bg-muted/20 ${app.color}`
                    )}
                  >
                    <span className="text-3xl relative z-10">{app.icon}</span>
                    <div className="text-left relative z-10">
                      <p className="font-black text-sm uppercase tracking-tight">{app.name}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">Linked</p>
                    </div>
                    {selectedApp === app.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary ml-auto relative z-10" />
                    )}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* Technical Mandate String (Requested in Point 3) */}
        <div className="rounded-[28px] bg-muted/40 border border-border p-6 space-y-3">
          <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Mandate Intent Payload</p>
              <Gem className="h-3.5 w-3.5 text-primary" />
          </div>
          <code className="text-[9px] font-mono text-muted-foreground block leading-relaxed break-all bg-background/80 p-4 rounded-2xl border border-border shadow-inner">
            {`upi://mandate?pa=januin.savings@icici&pn=Januin+Savings&am=${amount}&cu=INR&recur=${frequency.toUpperCase()}&validity_start=${startDate}&validity_end=2028-12-31&tr=MND${Date.now()}&callback_url=januin://upi-mandate`}
          </code>
        </div>

        <Button
          onClick={handleRedirect}
          disabled={!selectedApp || !upiId}
          className="w-full h-20 rounded-[30px] font-black text-xl gradient-primary shadow-glow gap-4 group transition-transform active:scale-95"
        >
          CONNECT & AUTHORIZE <ExternalLink className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>

        <p className="text-center text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
          Powered by BHIM UPI 2.1 • NPCI Authorized Merchant
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
            <h2 className="text-2xl font-black tracking-tighter uppercase">Initialize Plan</h2>
            <div className="flex gap-1 mt-1">
                <div className="h-1 w-8 rounded-full bg-primary" />
                <div className="h-1 w-8 rounded-full bg-muted" />
            </div>
          </div>
        </div>

        <div className="rounded-[40px] bg-card border border-border p-8 shadow-lg space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-secondary-foreground/60 tracking-widest ml-1">Goal Identifier</label>
            <Input 
                value={goalName} 
                onChange={e => setGoalName(e.target.value)} 
                placeholder="e.g. Higher Education, Retirement..." 
                className="h-16 rounded-[24px] font-bold text-lg bg-muted/30 border-none shadow-inner" 
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-secondary-foreground/60 tracking-widest ml-1">Investment Amount</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary">₹</span>
              <Input 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                type="number" 
                placeholder="500" 
                className="h-20 rounded-[30px] font-black text-3xl pl-12 bg-muted/30 border-none shadow-inner text-center" 
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["500", "1000", "2000", "5000"].map(v => (
                <button 
                    key={v} 
                    onClick={() => setAmount(v)} 
                    className={cn("py-3 rounded-[18px] text-xs font-black transition-all border-2", amount === v ? "border-primary bg-primary text-white" : "border-transparent bg-muted/50 hover:bg-muted")}
                >
                    ₹{v}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-secondary-foreground/60 tracking-widest ml-1">Billing frequency</label>
            <div className="grid grid-cols-3 gap-3">
              {(["daily", "weekly", "monthly"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={cn("py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all border-2",
                    frequency === f ? "border-primary bg-primary/5 text-primary" : "border-border bg-muted/20 hover:bg-muted"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-secondary-foreground/60 tracking-widest ml-1">Commencement Date</label>
            <Input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" className="h-14 rounded-2xl font-bold bg-muted/30 border-none px-6" />
          </div>
        </div>

        <Button onClick={handleCreatePlan} className="w-full h-20 rounded-[30px] font-black text-xl gradient-primary shadow-glow group">
          CONTINUE TO UPI <ArrowRightCircle className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="rounded-[24px] bg-secondary/10 p-5 flex items-start gap-4 border border-border/50">
            <ShieldEllipsis className="h-6 w-6 text-primary shrink-0" />
            <p className="text-xs font-medium text-muted-foreground italic">"Januin uses AI Behavioral Biometrics to ensure these mandates are created by you and you alone."</p>
        </div>
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
          <h2 className="text-2xl font-black tracking-tighter uppercase">Savings Ecosystem</h2>
        </div>
        <div className="flex items-center gap-2 pr-1">
            <Button variant="ghost" size="icon" onClick={() => setStep("analytics")} className="h-10 w-10 rounded-xl bg-muted/50 border border-border">
                <LayoutDashboard className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <gem className="h-5 w-5" />
            </div>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-[48px] bg-[#0a192f] p-10 text-white shadow-2xl group border border-white/5">
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-10">
            <div className="p-4 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10">
                <Plus className="h-8 w-8 text-primary group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-[10px] font-black uppercase tracking-widest text-success">6.5% APY Active</span>
            </div>
          </div>

          <div className="space-y-1 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Total Assets Under Management</p>
            <h1 className="text-6xl font-black italic tracking-tighter">₹{totalSaved.toLocaleString()}</h1>
          </div>

          <div className="flex gap-4">
            <Button
                onClick={() => { setGoalName(""); setAmount(""); setFrequency("monthly"); setSelectedApp(""); setStep("create_plan"); }}
                className="flex-1 h-14 rounded-3xl font-black bg-primary text-white hover:bg-primary/90 shadow-glow uppercase tracking-widest text-xs"
            >
                Start AutoSave
            </Button>
            <Button
                onClick={() => setStep("analytics")}
                className="h-14 px-6 rounded-3xl font-black bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 uppercase tracking-widest text-[10px]"
            >
                Analytics
            </Button>
          </div>
        </div>
        
        {/* Animated Orbs */}
        <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 15 }}
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px] pointer-events-none" 
        />
        <motion.div 
            animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }}
            transition={{ repeat: Infinity, duration: 12 }}
            className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" 
        />
      </div>

      {/* Smart features integration */}
      <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[32px] bg-card border border-border p-6 flex flex-col justify-between h-[180px] hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Gem className="h-6 w-6" />
              </div>
              <div>
                  <h4 className="font-black text-sm uppercase">Smart Roundups</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Enabled • Saved ₹450</p>
              </div>
              <button 
                  onClick={() => {setIsSmartRoundingEnabled(!isSmartRoundingEnabled); toast.success(`Rounding ${isSmartRoundingEnabled ? "Disabled" : "Enabled"}`)}}
                  className={cn("h-6 w-10 rounded-full relative transition-colors", isSmartRoundingEnabled ? "bg-success" : "bg-muted")}
              >
                  <div className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm", isSmartRoundingEnabled ? "left-5" : "left-1")} />
              </button>
          </div>
          <div className="rounded-[32px] bg-card border border-border p-6 flex flex-col justify-between h-[180px] hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
              </div>
              <div>
                  <h4 className="font-black text-sm uppercase">AI Guardian</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Monitoring active</p>
              </div>
              <span className="text-[9px] font-black text-success uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Secure
              </span>
          </div>
      </div>

      {/* Active Mandates - Enhanced List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Portfolio Mandates</h3>
          <Button onClick={() => setStep("analytics")} variant="ghost" className="h-auto p-0 text-[10px] font-black uppercase text-primary">Details <ArrowUpRight className="h-3 w-3 ml-1" /></Button>
        </div>

        {plans.map(plan => {
          const progress = Math.min((plan.savedAmount / plan.targetAmount) * 100, 100);
          const appInfo = UPI_APPS.find(a => a.name === plan.upiApp);
          return (
            <button
              key={plan.id}
              onClick={() => { setActiveMandateDetail(plan); setStep("mandate_detail"); }}
              className="w-full text-left rounded-[32px] bg-card border border-border p-6 transition-all hover:bg-muted/30 active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-background border border-border flex items-center justify-center text-3xl shadow-sm">
                    {appInfo?.icon || "💳"}
                  </div>
                  <div>
                    <p className="font-black text-base italic uppercase tracking-tighter">{plan.goalName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">₹{plan.amount.toLocaleString()}/{plan.frequency}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">{plan.upiApp}</span>
                    </div>
                  </div>
                </div>
                <div className={cn(
                    "h-3 w-3 rounded-full shadow-[0_0_10px]",
                    plan.status === "active" ? "bg-success shadow-success/50" :
                    plan.status === "paused" ? "bg-warning shadow-warning/50" :
                    "bg-danger shadow-danger/50"
                  )} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Total Accumulated</p>
                        <p className="text-xl font-black italic">₹{plan.savedAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[14px] font-black italic text-primary">{Math.round(progress)}%</p>
                    </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                  />
                </div>
              </div>
              
              <div className="absolute top-0 right-0 h-full w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}

        {plans.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[40px]">
            <PiggyBank className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-sm font-black text-muted-foreground uppercase italic">Financial Ecosystem Empty</p>
            <Button onClick={() => setStep("create_plan")} variant="link" className="text-primary font-black uppercase text-xs mt-2">Initialize First Mandate</Button>
          </div>
        )}
      </div>

      {/* Quick History Link */}
      <div className="rounded-[32px] bg-card border border-border p-6 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                  <HistoryIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                  <p className="font-black text-sm uppercase">Deduction History</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Last: ₹500 (2 days ago)</p>
              </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>

      <div className="pt-4 pb-8 space-y-4">
         <div className="flex items-center justify-center gap-3">
             <div className="h-px flex-1 bg-border" />
             <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.5em]">End of Dashboard</p>
             <div className="h-px flex-1 bg-border" />
         </div>
      </div>
    </motion.div>
  );
};

export default SavingsWallet;
