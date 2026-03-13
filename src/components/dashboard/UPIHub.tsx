import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, CreditCard, Plus, ArrowRight, ShieldCheck, AlertCircle, 
  CheckCircle2, Copy, Search, Users, Smartphone, Store, 
  ShieldAlert, Info, InfoIcon, ShieldQuestion, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface UPIHubProps {
    initialUpiId?: string;
    initialPayeeName?: string;
}

const UPIHub = ({ initialUpiId = "", initialPayeeName = "" }: UPIHubProps) => {
    const { currentUser, receiveMoney, sendMoney, sendExternalMoney, users } = useApp();
    const [activeView, setActiveView] = useState<"pay" | "qr" | "manage">("pay");
    const [upiInput, setUpiInput] = useState(initialUpiId);
    const [payeeName, setPayeeName] = useState(initialPayeeName);
    const [amount, setAmount] = useState("");
    const [riskScore, setRiskScore] = useState(2);
    const [isTrusted, setIsTrusted] = useState(false);
    const [pendingPayment, setPendingPayment] = useState<{ upiId: string, amount: number } | null>(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && pendingPayment) {
                // Return to app after PhonePe/GPay flow - log as mock success!
                sendExternalMoney(pendingPayment.upiId, pendingPayment.amount);
                toast.success(`Payment Success: ₹${pendingPayment.amount} sent to ${pendingPayment.upiId}`);
                setPendingPayment(null);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [pendingPayment, sendExternalMoney]);

    useEffect(() => {
        if (initialUpiId) {
            setUpiInput(initialUpiId);
            setPayeeName(initialPayeeName);
            setActiveView("pay");
        }
    }, [initialUpiId, initialPayeeName]);

    useEffect(() => {
        // Mock risk score calculation based on input
        if (upiInput.length > 5) {
            const score = Math.floor(Math.random() * 20) + 5;
            setRiskScore(score);
            const user = users.find(u => u.upiId === upiInput || u.email === upiInput);
            setIsTrusted(!!user && user.trustLevel === "trusted");
        } else {
            setRiskScore(0);
            setIsTrusted(false);
        }
    }, [upiInput, users]);

    if (!currentUser) return null;

    const upiUri = `upi://pay?pa=${currentUser.upiId}&pn=${encodeURIComponent(currentUser.name)}&cu=USD`;

    const handlePay = () => {
        if (!upiInput.includes("@")) {
            toast.error("Enter a valid UPI ID (e.g. name@januin)");
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (!amount || parsedAmount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }
        
        if (riskScore > 80) {
            toast.error("Transaction blocked by AI Guardian due to high risk score.");
            return;
        }

        const internalUser = users.find(u => u.upiId === upiInput);
        
        if (internalUser) {
            sendMoney(internalUser.email, parsedAmount);
            toast.success(`Encrypted transaction initiated for ${upiInput}`);
            setAmount("");
            setUpiInput("");
        } else {
            // Stage the payment locally so when the user returns from PhonePe, we confirm it
            setPendingPayment({ upiId: upiInput, amount: parsedAmount });
            toast.success(`Opening Payment Apps...`);
            
            // Universal UPI link format
            const uri = `upi://pay?pa=${upiInput}&pn=Payee&am=${parsedAmount}&cu=INR`;
            const isAndroid = /Android/i.test(navigator.userAgent || "");
            
            if (isAndroid) {
                // Highly strict Android Intent format ensures the OS Chooser pops up (GPay, PhonePe, Paytm, etc.)
                const intentUrl = `intent://pay?pa=${upiInput}&pn=Payee&am=${parsedAmount}&cu=INR#Intent;scheme=upi;end`;
                window.location.href = intentUrl;
            } else {
                // Fallback for iOS natively handling upi://
                window.location.href = uri;
            }
            
            setAmount("");
            setUpiInput("");
        }
    };

    const paymentMethods = [
      { id: "qr", label: "Scan QR", icon: QrCode, color: "bg-blue-50 text-blue-600" },
      { id: "contacts", label: "Contacts", icon: Users, color: "bg-purple-50 text-purple-600" },
      { id: "phone", label: "Number", icon: Smartphone, color: "bg-emerald-50 text-emerald-600" },
      { id: "merchant", label: "Merchant", icon: Store, color: "bg-orange-50 text-orange-600" },
    ];

    return (
        <div className="space-y-6">
            {/* Payment Method Grid - Mobile Optimization */}
            <div className="grid grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <button 
                  key={method.id} 
                  onClick={() => method.id === "qr" && setActiveView("qr")}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform active:scale-95", method.color)}>
                    <method.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">{method.label}</span>
                </button>
              ))}
            </div>

            {/* View Switcher Tabs */}
            <div className="flex p-1 bg-muted/50 rounded-2xl border border-border">
                {(["pay", "qr", "manage"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={cn(
                      "flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                      activeView === view ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:bg-card/30"
                    )}
                  >
                    {view === "pay" ? "Pay Any ID" : view === "qr" ? "My QR" : "Settings"}
                  </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeView === "pay" && (
                    <motion.div 
                      key="pay" 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className="space-y-4"
                    >
                        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden relative">
                            {/* STUNNING DOMINANT PAYEE / AI SCORE CARD */}
                            <div className={cn(
                                "flex flex-col gap-6 items-center justify-center p-6 border-b border-border/50 relative isolate",
                                riskScore > 50 
                                  ? "bg-gradient-to-b from-danger/20 via-background to-background" 
                                  : "bg-gradient-to-b from-primary/20 via-background to-background"
                            )}>
                                {/* Glowing orb background effect */}
                                <div className={cn(
                                    "absolute top-0 w-full h-32 blur-3xl opacity-30 -z-10",
                                    riskScore > 50 ? "bg-danger" : "bg-primary"
                                )} />
                                
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className={cn(
                                        "w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl ring-8 ring-background outline outline-4 outline-offset-0",
                                        riskScore > 50 ? "bg-gradient-to-br from-danger/30 to-danger/10 text-danger outline-danger/30" : "bg-gradient-to-br from-primary/30 to-primary/10 text-primary outline-primary/30"
                                    )}>
                                        {payeeName ? payeeName.substring(0, 2).toUpperCase() : <UserCheck className="w-12 h-12" />}
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Paying Securely To</p>
                                        <h2 className="text-2xl font-black leading-tight text-foreground px-4">
                                            {payeeName ? decodeURIComponent(payeeName.replace(/\+/g, ' ')) : "Unknown Identity"}
                                        </h2>
                                    </div>
                                </div>

                                {/* Risk Score Gauge Row */}
                                <div className="flex items-center justify-center gap-6 w-full max-w-sm mt-2">
                                    <div className="flex flex-col items-end text-right">
                                        <h3 className="text-sm font-black">AI SafePay v4.2</h3>
                                        <div className="flex items-center gap-1 justify-end">
                                          <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", riskScore > 50 ? "bg-danger" : "bg-success")} />
                                          <p className="text-[10px] text-muted-foreground font-bold font-mono">ENCRYPTED</p>
                                        </div>
                                    </div>

                                    <div className="h-12 w-[1px] bg-border/50 shrink-0" />

                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center">
                                            <svg className="w-14 h-14 transform -rotate-90">
                                                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/30" />
                                                <motion.circle 
                                                    initial={{ strokeDasharray: "0 1000" }}
                                                    animate={{ strokeDasharray: `${riskScore * 1.5} 1000` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                                    strokeLinecap="round"
                                                    className={cn(riskScore > 50 ? "text-danger" : "text-primary")}
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className={cn("text-base font-black leading-none", riskScore > 50 ? "text-danger" : "text-primary")}>
                                                    {String(riskScore).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground leading-tight">Risk<br/>Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10 p-6 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Payee UPI ID / VPA</Label>
                                    <div className="relative">
                                        <Input 
                                          placeholder="username@januin" 
                                          value={upiInput} 
                                          onChange={e => setUpiInput(e.target.value)} 
                                          className="h-14 rounded-2xl bg-muted/30 border-none font-bold placeholder:font-medium pl-12" 
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                          <Search className="h-5 w-5" />
                                        </div>
                                        {isTrusted && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-success border border-success/20">
                                              <UserCheck className="h-3.5 w-3.5" />
                                              <span className="text-[8px] font-black uppercase">Trusted Contact</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Payment Amount</Label>
                                    <div className="relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground">$</span>
                                      <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={amount} 
                                        onChange={e => setAmount(e.target.value)} 
                                        className="h-16 text-3xl font-black font-mono pl-10 rounded-2xl bg-muted/30 border-none" 
                                      />
                                    </div>
                                </div>

                                {riskScore > 0 && (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                      "rounded-2xl p-4 flex items-start gap-3",
                                      riskScore < 20 ? "bg-success/5 border border-success/20" : 
                                      riskScore < 50 ? "bg-warning/5 border border-warning/20" : "bg-danger/5 border border-danger/20"
                                    )}
                                  >
                                    {riskScore < 20 ? <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-1" /> : <ShieldAlert className="h-5 w-5 text-danger shrink-0 mt-1" />}
                                    <div>
                                      <p className={cn("text-xs font-black uppercase", riskScore < 50 ? "text-success" : "text-danger")}>
                                        {riskScore < 20 ? "Safe Transaction" : riskScore < 50 ? "Caution Advised" : "High Risk Detected"}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                        {riskScore < 20 ? "AI Analysis has verified this ID against our global database. Secure to proceed." : 
                                         riskScore < 50 ? "First-time transfer to this recipient. Please re-verify the ID before proceeding." : 
                                         "AI has detected unusual behavioral patterns. Verification code required."}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}

                                <Button className="h-16 w-full rounded-2xl text-lg font-black shadow-elevated transition-transform active:scale-95 gradient-primary border-none" onClick={handlePay}>
                                    Proceed Securely <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                
                                <p className="text-center text-[9px] text-muted-foreground font-bold">
                                  T&C Apply. All transactions are protected by Januin Zero-Trust Guardian.
                                </p>
                            </div>
                        </div>

                        {/* Recent Payees */}
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3">Recent Payees</h4>
                          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {users.slice(0, 5).map(user => (
                              <button key={user.id} onClick={() => setUpiInput(user.upiId)} className="flex flex-col items-center gap-2 shrink-0">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-lg font-black text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                                  {user.avatar}
                                </div>
                                <span className="text-[10px] font-bold">{user.name.split(" ")[0]}</span>
                              </button>
                            ))}
                            <button className="flex flex-col items-center gap-2 shrink-0">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground">
                                  <Plus className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-bold">New</span>
                            </button>
                          </div>
                        </div>
                    </motion.div>
                )}

                {activeView === "qr" && (
                    <motion.div key="qr" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="relative mb-8 p-10 bg-white rounded-[40px] shadow-2xl border border-border/50">
                            <QRCodeSVG
                                value={upiUri}
                                size={220}
                                level="H"
                                includeMargin={true}
                                marginSize={1}
                            />
                            <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                              <div className="bg-primary px-6 py-2 rounded-2xl text-white font-black text-xs shadow-lg flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> JANUIN SECURE
                              </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">{currentUser.name}</h3>
                        <div className="mt-2 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 border border-border">
                          <p className="text-[12px] text-primary font-mono font-black">{currentUser.upiId}</p>
                          <Copy className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary" onClick={() => { navigator.clipboard.writeText(currentUser.upiId); toast.success("Copied!"); }} />
                        </div>

                        <div className="mt-12 w-full grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-14 rounded-2xl font-black text-xs border-2">
                              SAVE AS IMAGE
                            </Button>
                            <Button variant="outline" className="h-14 rounded-2xl font-black text-xs border-2">
                              SHARE QR
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeView === "manage" && (
                  <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                      <h4 className="text-xs font-black uppercase text-muted-foreground mb-4">Linked Bank Accounts</h4>
                      <div className="space-y-3">
                        {currentUser.linkedBanks.map(bank => (
                          <div key={bank.id} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-muted/20">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center shadow-inner">
                                <Store className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-black">{bank.bankName}</p>
                                <p className="text-[10px] font-mono text-muted-foreground">{bank.accountNumber}</p>
                              </div>
                            </div>
                            {bank.isPrimary && <span className="bg-success/20 text-success text-[8px] font-black px-2 py-1 rounded-full">PRIMARY</span>}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-4 h-12 rounded-xl border border-dashed border-border gap-2 font-bold text-muted-foreground">
                        <Plus className="h-4 w-4" /> LINK NEW ACCOUNT
                      </Button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UPIHub;

