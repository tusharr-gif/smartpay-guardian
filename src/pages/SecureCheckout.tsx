import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Fingerprint, Lock, ShieldAlert, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const SecureCheckout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const vpa = searchParams.get("vpa") || "unknown@januin";
    const amount = searchParams.get("am") || "0.00";
    const name = searchParams.get("pn") || "Verified Merchant";

    const [status, setStatus] = useState<"verifying" | "auth" | "processing" | "success">("verifying");
    const [verificationData, setVerificationData] = useState<any>(null);

    const { currentUser, receiveMoney, verifyVpa } = useApp();

    useEffect(() => {
        const runVerification = async () => {
            const data = await verifyVpa(vpa);
            setVerificationData(data);
            setStatus("auth");
        };
        runVerification();
    }, [vpa, verifyVpa]);

    const handleAuthenticate = () => {
        setStatus("processing");
        setTimeout(() => {
            if (currentUser) {
                receiveMoney(parseFloat(amount), verificationData?.registeredName || "QR Checkout");
            }
            setStatus("success");
        }, 3000);
    };

    const getTrustColor = (level: string) => {
        switch (level) {
            case "trusted": return "text-success";
            case "verified": return "text-primary";
            case "suspicious":
            case "flagged": return "text-destructive";
            default: return "text-muted-foreground";
        }
    };

    const getTrustBg = (level: string) => {
        switch (level) {
            case "trusted": return "bg-success/10 border-success/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]";
            case "verified": return "bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]";
            case "suspicious":
            case "flagged": return "bg-destructive/10 border-destructive/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
            default: return "bg-muted/10 border-muted/20";
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans selection:bg-primary/30">
            <div className="w-full max-w-sm space-y-6">
                {/* Brand Header */}
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center mb-2 border border-white/10 shadow-glow"
                    >
                        <img src="/logo.png" alt="Januin" className="h-8 w-8 object-contain" />
                    </motion.div>
                </div>

                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0d0d0d] shadow-2xl">
                    {/* Glassmorphism Background elements */}
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl opacity-50" />
                    <div className="absolute -right-10 bottom-10 h-32 w-32 rounded-full bg-success/5 blur-3xl opacity-50" />

                    <AnimatePresence mode="wait">
                        {status === "verifying" && (
                            <motion.div
                                key="verifying"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-12 px-8"
                            >
                                <div className="relative mb-8">
                                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                    <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                                </div>
                                <h3 className="text-lg font-black italic tracking-tighter mb-6 uppercase">Guardian Analysis</h3>
                                <div className="space-y-4 w-full">
                                    {[
                                        "Scanning Identity Authenticity",
                                        "Verifying NPCI Registry",
                                        "Executing Threat Matrix"
                                    ].map((step, i) => (
                                        <motion.div 
                                            key={step}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.4 }}
                                            className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                                        >
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                            {step}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {status === "auth" && (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 pt-8 pb-6 px-6"
                            >
                                <div className="text-center space-y-2">
                                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/50">Payment To</p>
                                    <h2 className="text-2xl font-black tracking-tight">{verificationData?.registeredName || name}</h2>
                                    <p className="text-xs text-primary/80 font-mono font-medium">{vpa}</p>
                                    
                                    <div className="flex justify-center mt-4">
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${getTrustBg(verificationData?.trustLevel)}`}
                                        >
                                            <ShieldCheck className={`h-3.5 w-3.5 ${getTrustColor(verificationData?.trustLevel)}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${getTrustColor(verificationData?.trustLevel)}`}>
                                                Guardian {verificationData?.trustLevel || 'Verified'}
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Surety Factors Section */}
                                <div className="bg-white/[0.03] rounded-3xl border border-white/5 p-4 space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/40">Trust Surety Factors</span>
                                        <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" title="Live" />
                                    </div>
                                    
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between text-[10px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-success" />
                                                <span className="font-bold text-white/50">NPCI Name Match</span>
                                            </div>
                                            <span className="font-black text-success uppercase italic">Matched</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-[10px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary" />
                                                <span className="font-bold text-white/50">KYC Status</span>
                                            </div>
                                            <span className="font-black text-primary uppercase italic">{verificationData?.kycBadge}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-white/20 uppercase mb-1">Account Age</p>
                                                <p className="text-[9px] font-bold text-white/80">{verificationData?.heritageScore}</p>
                                            </div>
                                            <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-white/20 uppercase mb-1">Integrity Rate</p>
                                                <p className="text-[9px] font-bold text-white/80">{verificationData?.transactionIntegrity}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1 w-1 rounded-full ${verificationData?.trustLevel === 'suspicious' ? 'bg-destructive' : 'bg-success'}`} />
                                                <span className="font-bold text-white/50">Safety Flags</span>
                                            </div>
                                            <span className={`font-black uppercase italic ${verificationData?.trustLevel === 'suspicious' ? 'text-destructive' : 'text-success'}`}>
                                                {verificationData?.communitySafety}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center py-2">
                                    <span className="text-4xl font-black font-mono tracking-tighter text-white/90">${amount}</span>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleAuthenticate}
                                        className="w-full h-24 rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-white/[0.05] active:scale-[0.98] transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Fingerprint className="h-10 w-10 text-primary animate-pulse" />
                                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em]">Hold to Confirm</p>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {status === "processing" && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center py-16 px-8"
                            >
                                <div className="relative h-20 w-20 mb-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                    />
                                    <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
                                </div>
                                <h3 className="text-lg font-black italic tracking-tighter uppercase">Securing Asset</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-3 animate-pulse">End-to-End Encrypted</p>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-8 px-8 text-center"
                            >
                                <div className="h-20 w-20 bg-success/10 rounded-full flex items-center justify-center mb-6 border border-success/30 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                                    <CheckCircle2 className="h-10 w-10 text-success" />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white/95 leading-none">Complete</h3>
                                <p className="text-[10px] text-muted-foreground font-mono mt-3 opacity-40 uppercase tracking-widest">Transaction Verified</p>

                                <div className="w-full mt-10 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                        <span>Status</span>
                                        <span className="text-success italic">Delivered</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-black pt-4 border-t border-white/5">
                                        <span className="text-white/40 uppercase text-[10px] tracking-widest">Total</span>
                                        <span className="font-mono text-2xl text-primary tracking-tighter">${amount}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-10 rounded-[1.5rem] font-black h-14 bg-white text-black hover:bg-white/90 text-xs tracking-[0.2em] uppercase shadow-xl shadow-white/5"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Return to Vault
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-center gap-8 opacity-20">
                    <div className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Quantum Safe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3.5 w-3.5" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">PCI-DSS GOLD</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecureCheckout;
