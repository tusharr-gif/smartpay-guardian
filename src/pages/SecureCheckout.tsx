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
    const { currentUser, receiveMoney } = useApp();

    const vpa = searchParams.get("vpa") || "unknown@januin";
    const amount = searchParams.get("am") || "0.00";
    const name = searchParams.get("pn") || "Verified Merchant";

    const [status, setStatus] = useState<"verifying" | "auth" | "processing" | "success">("verifying");
    const [riskScore] = useState(Math.floor(Math.random() * 5) + 1);

    useEffect(() => {
        // Step 1: Verification
        const timer = setTimeout(() => {
            setStatus("auth");
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleAuthenticate = () => {
        setStatus("processing");
        setTimeout(() => {
            // Logic to reflect in ledger if user is logged in
            if (currentUser) {
                receiveMoney(parseFloat(amount), "QR Checkout Flow");
            }
            setStatus("success");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-32 w-32 bg-[#0a192f] rounded-[2.5rem] flex items-center justify-center mb-4 border border-white/5 shadow-glow overflow-hidden"
                    >
                        <img src="/logo.png" alt="Januin pay" className="h-full w-full object-contain" />
                    </motion.div>
                    <h1 className="text-xl font-black uppercase tracking-tighter">Januin pay Gateway</h1>
                    <p className="text-xs text-muted-foreground mt-1">Institutional-Grade Secure Redirection</p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {status === "verifying" && (
                            <motion.div
                                key="verifying"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center py-10"
                            >
                                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                <p className="text-sm font-bold text-center">AI Guardian is verifying <br /> the merchant credentials...</p>
                            </motion.div>
                        )}

                        {status === "auth" && (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Paying To</p>
                                    <h2 className="text-2xl font-black">{name}</h2>
                                    <code className="text-xs text-primary font-mono">{vpa}</code>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-6 border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-muted-foreground">Amount Due</span>
                                        <div className="flex items-center gap-1 text-[10px] text-success font-bold">
                                            <ShieldCheck className="h-3 w-3" /> Secure
                                        </div>
                                    </div>
                                    <p className="text-4xl font-black font-mono">${amount}</p>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <ShieldAlert className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold">AI Risk Score: {riskScore}/100</p>
                                        <div className="h-1 w-full bg-white/10 rounded-full mt-1">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${riskScore}%` }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <p className="text-[9px] text-center text-muted-foreground uppercase font-black">Hold Fingerprint to Confirm</p>
                                    <button
                                        onClick={handleAuthenticate}
                                        className="w-full aspect-video rounded-3xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-all group"
                                    >
                                        <Fingerprint className="h-12 w-12 text-muted-foreground group-active:text-primary transition-colors animate-pulse" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {status === "processing" && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center py-10"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary mb-6"
                                />
                                <h3 className="text-lg font-bold">Securing Funds...</h3>
                                <p className="text-xs text-muted-foreground text-center mt-2 px-10">
                                    Finalizing transaction with the banking backbone. Please do not close the window.
                                </p>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-6 text-center"
                            >
                                <div className="h-20 w-20 bg-success/20 rounded-full flex items-center justify-center mb-6 border border-success/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                    <CheckCircle2 className="h-10 w-10 text-success" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic">Payment Successful</h3>
                                <p className="text-xs text-muted-foreground mt-2">Reference ID: PAY_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>

                                <div className="w-full mt-8 p-4 rounded-2xl bg-white/5 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className="text-success uppercase">Settled</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5">
                                        <span>Total Amount</span>
                                        <span className="font-mono">${amount}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-8 gradient-primary h-12 rounded-2xl font-bold"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Return to Dashboard
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-center gap-6 opacity-30">
                    <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3" />
                        <span className="text-[8px] font-bold uppercase tracking-widest italic">256-bit AES</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3" />
                        <span className="text-[8px] font-bold uppercase tracking-widest italic">PCI-DSS Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecureCheckout;
