import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Plus, QrCode, CreditCard, Link, Send, History, BarChart3, ShieldCheck, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface MerchantHubProps {
    onContactClick?: () => void;
}

const MerchantHub = ({ onContactClick }: MerchantHubProps) => {
    const { currentUser } = useApp();
    const [activeTab, setActiveTab] = useState<"qr" | "links" | "analytics">("qr");
    const [linkAmount, setLinkAmount] = useState("");
    const [linkPurpose, setLinkPurpose] = useState("");
    const [merchantAmount, setMerchantAmount] = useState("");
    const [showAmountInput, setShowAmountInput] = useState(false);

    if (!currentUser) return null;

    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/secure-pay?vpa=${currentUser.upiId}&pn=${encodeURIComponent(currentUser.name + " Business")}&am=${merchantAmount}`;

    return (
        <div className="space-y-6">
            {/* Merchant Header */}
            <div className="rounded-2xl gradient-dark border p-8 shadow-glow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BarChart3 className="h-24 w-24 text-primary" />
                </div>
                <div className="flex items-center gap-3 text-primary bg-primary/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Merchant Account
                </div>
                <h2 className="text-2xl font-black text-white">{currentUser.name} Business</h2>
                <p className="text-xs text-white/50 mt-1 max-w-[70%]">Accept payments securely using SmartPay's dynamic routing engine.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 rounded-xl bg-muted p-1">
                <button onClick={() => setActiveTab("qr")} className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeTab === "qr" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}>
                    Dynamic QR
                </button>
                <button onClick={() => setActiveTab("links")} className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeTab === "links" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}>
                    Payment Links
                </button>
                <button onClick={() => setActiveTab("analytics")} className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${activeTab === "analytics" ? "bg-card shadow-sm" : "hover:bg-card/50"}`}>
                    Business Stats
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "qr" && (
                    <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                        <div className="p-8 bg-white rounded-3xl border-8 border-primary/20 shadow-glow mb-6">
                            <QRCodeSVG
                                value={checkoutUrl}
                                size={220}
                                level="M"
                                includeMargin={true}
                                marginSize={1}
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-bold">Dynamic UPI QR</h3>
                            <p className="text-xs text-muted-foreground">Customers can scan this to pay instantly</p>
                            {merchantAmount && <p className="text-sm font-black text-primary">Amount: ${merchantAmount}</p>}
                        </div>

                        {showAmountInput && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full max-w-xs mt-4">
                                <Input
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={merchantAmount}
                                    onChange={(e) => setMerchantAmount(e.target.value)}
                                    className="text-center font-bold"
                                />
                            </motion.div>
                        )}

                        <div className="flex gap-3 mt-8 w-full max-w-sm">
                            <Button
                                onClick={() => setShowAmountInput(!showAmountInput)}
                                className="flex-1 gradient-primary gap-2 h-10 text-xs"
                            >
                                <Plus className="h-4 w-4" /> {merchantAmount ? "Change Amount" : "Add Amount"}
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 h-10 text-xs text-primary border-primary/50"
                                onClick={() => { navigator.clipboard.writeText(checkoutUrl); toast.success("Checkout Link Copied!"); }}
                            >
                                <Share2 className="h-4 w-4" /> Share Link
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeTab === "links" && (
                    <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Link className="h-4 w-4 text-primary" /> Create Payment Link
                            </h3>
                            <div className="space-y-3">
                                <Input placeholder="Amount (USD)" value={linkAmount} onChange={e => setLinkAmount(e.target.value)} type="number" />
                                <Input placeholder="Purpose (e.g. Freelance project)" value={linkPurpose} onChange={e => setLinkPurpose(e.target.value)} />
                                <div className="flex gap-2">
                                    <Button className="flex-1 gradient-primary h-10 text-xs" onClick={() => toast.success("Secure Payment Link Created!")}>
                                        Generate Link <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-primary/30 text-primary h-10 text-xs" onClick={onContactClick}>
                                        Share to Contact <Users className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b">Active Payment Links</h4>
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Link className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Order #SC-889{i}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">januin.li/sc-889{i}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">$125.00</p>
                                        <span className="text-[9px] text-warning font-bold uppercase">Pending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "analytics" && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border bg-card p-5 shadow-card">
                                <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Today's Sales</h4>
                                <p className="text-2xl font-black font-mono text-primary">$4,250.00</p>
                                <p className="text-[9px] text-success font-bold mt-1">+12% vs yesterday</p>
                            </div>
                            <div className="rounded-2xl border bg-card p-5 shadow-card">
                                <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Settlements</h4>
                                <p className="text-2xl font-black font-mono text-success">$3,800.00</p>
                                <p className="text-[9px] text-muted-foreground font-bold mt-1">Pending: $450.00</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-card p-6 shadow-card">
                            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-primary" /> Merchant Insights
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { label: "New Customers", value: "65%", color: "bg-primary" },
                                    { label: "Repeat Customers", value: "35%", color: "bg-accent" },
                                    { label: "Dispute Rate", value: "0.2%", color: "bg-success" }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold">
                                            <span>{item.label}</span>
                                            <span>{item.value}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MerchantHub;
