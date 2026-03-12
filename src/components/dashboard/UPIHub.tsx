import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, CreditCard, Plus, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

import { QRCodeSVG } from "qrcode.react";

const UPIHub = () => {
    const { currentUser, receiveMoney } = useApp();
    const [activeView, setActiveView] = useState<"manage" | "pay" | "qr">("manage");
    const [upiInput, setUpiInput] = useState("");
    const [amount, setAmount] = useState("");

    if (!currentUser) return null;

    const upiUri = `upi://pay?pa=${currentUser.upiId}&pn=${encodeURIComponent(currentUser.name)}&cu=USD`;

    const simulateExternalPayment = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Set amount to simulate payment");
            return;
        }

        toast.info("Connecting to secure UPI gateway...", { duration: 1500 });

        setTimeout(() => {
            // Mock receiving money from an external account via QR
            const tx = receiveMoney(parseFloat(amount));
            if (tx) {
                toast.success("Payment Received Successfully!", {
                    description: `$${amount} credited to your account via QR Scan`,
                    icon: <CheckCircle2 className="h-4 w-4 text-success" />,
                });
                setAmount("");
            }
        }, 2000);
    };

    const handlePay = () => {
        if (!upiInput.includes("@")) {
            toast.error("Enter a valid UPI ID (e.g. name@smartpay)");
            return;
        }
        toast.success(`Encrypted transaction initiated for ${upiInput}`);
    };

    return (
        <div className="space-y-6">
            {/* View Switcher */}
            <div className="flex gap-2 rounded-xl bg-muted p-1">
                <button
                    onClick={() => setActiveView("manage")}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeView === "manage" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}
                > Manage Banks </button>
                <button
                    onClick={() => setActiveView("pay")}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeView === "pay" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}
                > Pay UPI ID </button>
                <button
                    onClick={() => setActiveView("qr")}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeView === "qr" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}
                > My QR </button>
            </div>

            <AnimatePresence mode="wait">
                {activeView === "manage" && (
                    <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold">Your UPI ID</h3>
                            <div className="mt-2 flex items-center justify-center gap-2">
                                <code className="rounded bg-background px-2 py-1 text-primary font-mono text-sm">{currentUser.upiId}</code>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(currentUser.upiId); toast.success("Copied!"); }}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Linked Banks</h4>
                            {currentUser.linkedBanks.map(bank => (
                                <div key={bank.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{bank.bankName}</p>
                                            <p className="text-[10px] text-muted-foreground">{bank.accountNumber}</p>
                                        </div>
                                    </div>
                                    {bank.isPrimary && <span className="rounded bg-success/20 px-2 py-0.5 text-[8px] font-black uppercase text-success">Primary</span>}
                                </div>
                            ))}
                            <Button variant="outline" className="w-full border-dashed gap-2 py-6">
                                <Plus className="h-4 w-4" /> Add Another Bank
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeView === "pay" && (
                    <motion.div key="pay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border bg-card p-6 shadow-card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">Secure UPI Transfer</h3>
                                <p className="text-xs text-muted-foreground">Encrypted bank-to-bank transfer</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Payee UPI ID</Label>
                                <div className="relative">
                                    <Input placeholder="name@bank" value={upiInput} onChange={e => setUpiInput(e.target.value)} className="pr-10" />
                                    {upiInput.includes("@") && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2"> <CheckCircle2 className="h-4 w-4 text-success" /> </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Amount (USD)</Label>
                                <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="font-mono text-lg" />
                            </div>

                            <div className="rounded-xl border bg-muted/30 p-4">
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-muted-foreground">Paying From</span>
                                    <span className="font-bold">{currentUser.linkedBanks[0]?.bankName || "Digital Wallet"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span>Risk Score</span>
                                    <span className="text-success">02/100 (Safe)</span>
                                </div>
                            </div>

                            <Button className="w-full gradient-primary" onClick={handlePay}>
                                Proceed to Pay <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeView === "qr" && (
                    <motion.div key="qr" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="relative mb-6 rounded-3xl border-8 border-primary/10 bg-white p-8 shadow-glow">
                            <QRCodeSVG value={upiUri} size={200} level="H" includeMargin={false} />
                        </div>
                        <h3 className="text-lg font-extrabold">{currentUser.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{currentUser.upiId}</p>

                        <div className="mt-8 space-y-4 w-full max-w-xs text-center">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase block">SIMULATE RECEIVING PAYMENT</Label>
                                <Input type="number" placeholder="Enter amount to receive ($)" value={amount} onChange={e => setAmount(e.target.value)} className="text-center font-mono font-bold" />
                            </div>
                            <Button onClick={simulateExternalPayment} className="w-full gradient-primary rounded-full gap-2">
                                <ArrowRight className="h-4 w-4" /> Simulate PhonePe / GPay Redirect
                            </Button>
                        </div>

                        <div className="mt-8 flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-[10px] font-bold text-success">
                            <ShieldCheck className="h-3 w-3" /> BHIM UPI SECURED REDIRECTION
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UPIHub;
