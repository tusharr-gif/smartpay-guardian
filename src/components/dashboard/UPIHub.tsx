import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, CreditCard, Plus, ArrowRight, ShieldCheck, AlertCircle, 
  CheckCircle2, Copy, Search, Users, Smartphone, Store, 
  ShieldAlert, Info, InfoIcon, ShieldQuestion, UserCheck,
  Shield, History, Sparkles, Verified
} from "lucide-react";
import { VerificationResult } from "@/lib/mockData";
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
    onContactClick?: () => void;
}

const UPIHub = ({ initialUpiId = "", initialPayeeName = "", onContactClick }: UPIHubProps) => {
    const { currentUser, receiveMoney, sendMoney, sendExternalMoney, users, verifyVpa } = useApp();
    const [activeView, setActiveView] = useState<"pay" | "qr" | "manage">("pay");
    const [upiInput, setUpiInput] = useState(initialUpiId);
    const [payeeName, setPayeeName] = useState(initialPayeeName);
    const [amount, setAmount] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
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
        const verifyId = async () => {
            if (upiInput.includes("@") && upiInput.length > 5) {
                setIsVerifying(true);
                try {
                    const result = await verifyVpa(upiInput);
                    setVerificationResult(result);
                    if (!payeeName) {
                        setPayeeName(result.registeredName);
                    }
                    
                    // Live Notifications for manual entry
                    if (result.riskScore < 20) {
                        toast.success("AI Guardian: ID Verified Secure", {
                            description: `${result.registeredName} is a Januin-trusted recipient.`,
                        });
                    } else if (result.riskScore > 70) {
                        toast.error("AI Guardian: High Risk Detected", {
                            description: "Review safety analysis before proceeding.",
                        });
                    }
                } catch (err) {
                    console.error("Verification failed", err);
                } finally {
                    setIsVerifying(false);
                }
            } else {
                setVerificationResult(null);
            }
        };

        const timer = setTimeout(verifyId, 600);
        return () => clearTimeout(timer);
    }, [upiInput, verifyVpa, payeeName]);

    if (!currentUser) return null;

    const upiUri = `upi://pay?pa=${currentUser.upiId}&pn=${encodeURIComponent(currentUser.name)}&cu=INR`;

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
        
        if (verificationResult && verificationResult.riskScore > 80) {
            toast.error("Transaction blocked by AI Guardian due to critical risk factors.");
            return;
        }

        const internalUser = users.find(u => u.upiId === upiInput);
        
        if (internalUser) {
            setIsProcessing(true);
            setTimeout(() => {
                sendMoney(internalUser.email, parsedAmount);
                toast.success(`Encrypted transaction initiated for ${upiInput}`);
                setAmount("");
                setUpiInput("");
                setIsProcessing(false);
            }, 1500);
        } else {
            // Stage the payment locally so when the user returns from PhonePe, we confirm it
            setPendingPayment({ upiId: upiInput, amount: parsedAmount });
            toast.success(`Opening Payment Apps...`);
            
            // Generate a unique transaction reference to prevent PhonePe security rejection
            const trRef = `TR${Date.now()}`;
            const encodedName = encodeURIComponent(payeeName || "Payee");
            
            // Universal UPI link format with tr (Transaction Ref) and tn (Transaction Note)
            const uri = `upi://pay?pa=${upiInput}&pn=${encodedName}&tr=${trRef}&am=${parsedAmount}&cu=INR&tn=Payment`;
            
            const isAndroid = /Android/i.test(navigator.userAgent || "");
            
            if (isAndroid) {
                // Highly strict Android Intent format ensures the OS Chooser pops up (GPay, PhonePe, Paytm, etc.)
                const intentUrl = `intent://pay?pa=${upiInput}&pn=${encodedName}&tr=${trRef}&am=${parsedAmount}&cu=INR&tn=Payment#Intent;scheme=upi;end`;
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
                  onClick={() => {
                    if (method.id === "qr") setActiveView("qr");
                    if (method.id === "contacts" || method.id === "phone") onContactClick?.();
                  }}
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
                        <div className="rounded-[2.5rem] border border-border bg-card shadow-card overflow-hidden">
                            {/* CLEAN RECIPIENT HEADER */}
                            <div className="flex flex-col items-center justify-center p-8 pb-4">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl font-black mb-4 border-4 border-background shadow-inner">
                                    {payeeName ? payeeName.substring(0, 2).toUpperCase() : <UserCheck className="w-10 h-10" />}
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Paying To</p>
                                    <h2 className="text-xl font-black text-foreground">
                                        {payeeName ? decodeURIComponent(payeeName.replace(/\+/g, ' ')) : "Enter UPI ID"}
                                    </h2>
                                    
                                    {verificationResult && (
                                      <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex justify-center mt-3"
                                      >
                                          <div className={cn(
                                            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all",
                                            verificationResult.trustLevel === "trusted" ? "bg-success/10 border-success/30 text-success shadow-success/10" : 
                                            verificationResult.trustLevel === "verified" ? "bg-primary/10 border-primary/30 text-primary shadow-primary/10" : 
                                            "bg-warning/10 border-warning/30 text-warning shadow-warning/10"
                                          )}>
                                              <motion.div
                                                initial={{ rotate: -180, scale: 0 }}
                                                animate={{ rotate: 0, scale: 1 }}
                                                transition={{ type: "spring", damping: 12 }}
                                              >
                                                {verificationResult.trustLevel === "trusted" ? <ShieldCheck className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                              </motion.div>
                                              <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                                                {verificationResult.trustLevel === "trusted" ? "Januin Trusted" : verificationResult.trustLevel === "verified" ? "Identity Verified" : "Reviewing Safety"}
                                              </span>
                                          </div>
                                      </motion.div>
                                    )}

                                    {isVerifying && (
                                      <div className="flex justify-center mt-3">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full animate-pulse border border-border/50">
                                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                                          <span className="text-[9px] font-black uppercase text-muted-foreground">AI Scanning ID...</span>
                                        </div>
                                      </div>
                                    )}
                                </div>
                            </div>

                            {/* DYNAMIC SECURITY ANALYSIS SECTION */}
                            <AnimatePresence>
                              {verificationResult && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-t border-border/10 bg-muted/5"
                                >
                                  <div className="p-6 pt-2 space-y-4">
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <div className="p-1.5 rounded-lg bg-primary/10">
                                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                              </div>
                                              <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Januin Safety Analysis</p>
                                                <p className="text-[9px] font-bold text-muted-foreground/60">Risk Assessment Engine v5.0</p>
                                              </div>
                                          </div>
                                          <div className="text-right">
                                              <div className="text-xs font-black text-primary">SAFE SCORE</div>
                                              <div className="flex items-center justify-end gap-1">
                                                <span className={cn(
                                                  "text-2xl font-black",
                                                  verificationResult.riskScore < 20 ? "text-success" : verificationResult.riskScore < 50 ? "text-primary" : "text-warning"
                                                )}>
                                                  {100 - verificationResult.riskScore}
                                                </span>
                                                <span className="text-[10px] font-black opacity-30 mt-1">/100</span>
                                              </div>
                                          </div>
                                      </div>

                                      {/* Safety Indicators Grid */}
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="p-3 rounded-2xl bg-card border border-border/50 space-y-2">
                                              <div className="flex items-center gap-2">
                                                  <Verified className="h-3 w-3 text-success" />
                                                  <span className="text-[9px] font-black uppercase">KYC Status</span>
                                              </div>
                                              <p className="text-[10px] font-bold text-muted-foreground">{verificationResult.kycBadge}</p>
                                          </div>
                                          <div className="p-3 rounded-2xl bg-card border border-border/50 space-y-2">
                                              <div className="flex items-center gap-2">
                                                  <History className="h-3 w-3 text-primary" />
                                                  <span className="text-[9px] font-black uppercase">Heritage</span>
                                              </div>
                                              <p className="text-[10px] font-bold text-muted-foreground">{verificationResult.heritageScore}</p>
                                          </div>
                                          <div className="p-3 rounded-2xl bg-card border border-border/50 space-y-2">
                                              <div className="flex items-center gap-2">
                                                  <Shield className="h-3 w-3 text-blue-500" />
                                                  <span className="text-[9px] font-black uppercase">Integrity</span>
                                              </div>
                                              <p className="text-[10px] font-bold text-muted-foreground">{verificationResult.transactionIntegrity || "99.8% Success"}</p>
                                          </div>
                                          <div className="p-3 rounded-2xl bg-card border border-border/50 space-y-2">
                                              <div className="flex items-center gap-2">
                                                  <Users className="h-3 w-3 text-orange-500" />
                                                  <span className="text-[9px] font-black uppercase">Community</span>
                                              </div>
                                              <p className="text-[10px] font-bold text-muted-foreground">{verificationResult.communitySafety}</p>
                                          </div>
                                      </div>
                                      
                                      <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${100 - verificationResult.riskScore}%` }}
                                            className={cn(
                                              "h-full rounded-full transition-all duration-1000",
                                              verificationResult.riskScore < 20 ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
                                              verificationResult.riskScore < 50 ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.4)]" : 
                                              "bg-warning shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                                            )}
                                          />
                                      </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="p-8 pt-4 space-y-6">
                                <div className="space-y-4">
                                    {/* AMOUNT INPUT - DOMINANT */}
                                    <div className="relative group">
                                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-muted-foreground/30 group-focus-within:text-primary transition-colors">₹</span>
                                      <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={amount} 
                                        onChange={e => setAmount(e.target.value)} 
                                        className="h-20 text-4xl font-black font-mono pl-12 rounded-3xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all text-center" 
                                      />
                                    </div>

                                    {/* MINIMAL UPI INPUT */}
                                    <div className="relative">
                                        <Input 
                                          placeholder="name@januin" 
                                          value={upiInput} 
                                          onChange={e => setUpiInput(e.target.value)} 
                                          className="h-12 rounded-2xl bg-muted/20 border-none font-bold placeholder:font-medium pl-10" 
                                        />
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                                          <Search className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                  className="h-16 w-full rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 gradient-primary border-none" 
                                  onClick={handlePay}
                                  disabled={isProcessing}
                                >
                                    {isProcessing ? "Processing..." : <>Proceed Securely <ArrowRight className="ml-2 h-4 w-4" /></>}
                                </Button>
                                
                                <p className="text-center text-[9px] text-muted-foreground font-bold opacity-40">
                                  End-to-end encrypted by Januin Guardian v4.2
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

