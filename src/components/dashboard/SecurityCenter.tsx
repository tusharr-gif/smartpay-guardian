import { motion } from "framer-motion";
import { Shield, Zap, Lock, Globe, Fingerprint, Eye, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const SecurityCenter = () => {
    const securityFeatures = [
        { title: "AI Guardian Engine", status: "Active", desc: "Predictive risk scoring enabled", icon: Zap, color: "text-primary" },
        { title: "Behavioral Biometrics", status: "Monitoring", desc: "Analyzing typing and swipe patterns", icon: Fingerprint, color: "text-success" },
        { title: "Device    Fingerprinting", status: "Secure", desc: "Known device fingerprint: iPhone 15 Pro", icon: Lock, color: "text-success" },
        { title: "Anti-Phishing Shield", status: "Active", desc: "Scanning for screen-sharing/recording", icon: Eye, color: "text-warning" },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Security Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl gradient-dark p-8 border border-white/5 shadow-elevated"
            >
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
                            <CheckCircle2 className="h-4 w-4" />
                            Your account is fully protected
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">Trust Score: 98/100</h2>
                        <p className="max-w-md text-white/60">
                            Based on your transaction history, verified identity, and behavioral consistency, you are rated as "High Trust".
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button className="gradient-primary border-0 shadow-glow">Audit Transactions</Button>
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Update KYC</Button>
                        </div>
                    </div>
                    <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/5 border border-white/10 relative">
                        <Shield className="h-20 w-20 text-primary animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-transparent animate-spin" />
                    </div>
                </div>
            </motion.div>

            {/* Security Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {securityFeatures.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-all"
                    >
                        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${f.color}`}>
                            <f.icon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold">{f.title}</h3>
                            <span className="text-[10px] font-bold uppercase text-success px-1.5 py-0.5 rounded bg-success/10">{f.status}</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{f.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Active Surety Protocols */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black italic tracking-tighter uppercase text-white/90">Guardian Surety Protocols</h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] font-black text-success uppercase tracking-widest">Real-time active</span>
                    </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { title: "NPCI Name Match", status: "Verified", desc: "Cross-referencing VPA with Bank Registry", detail: "Primary Factor", icon: CheckCircle2, color: "text-success" },
                        { title: "KYC Compliance", status: "Gold", desc: "Video KYC & Aadhar Verification status", detail: "Hard Proof", icon: ShieldCheck, color: "text-primary" },
                        { title: "Heritage Score", status: "High", desc: "Account age and historical stability", detail: "Active since 2021", icon: Globe, color: "text-info" },
                        { title: "Integrity Rate", status: "99.9%", desc: "Dispute-free transaction volume", detail: "High Volume", icon: Zap, color: "text-warning" },
                        { title: "Community Safety", status: "Zero", desc: "Reports in Central Fraud Registry", detail: "Zero Fraud Reports", icon: Shield, color: "text-success" }
                    ].map((protocol, i) => (
                        <motion.div
                            key={protocol.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2.5 rounded-xl bg-white/5 ${protocol.color}`}>
                                    <protocol.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-white/5 ${protocol.color} border border-current/10 uppercase`}>
                                    {protocol.status}
                                </span>
                            </div>
                            <h4 className="font-black text-sm tracking-tight mb-1">{protocol.title}</h4>
                            <p className="text-[10px] text-white/50 leading-relaxed mb-3">{protocol.desc}</p>
                            <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                                <Zap className="h-3 w-3" />
                                {protocol.detail}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Recent Security Insights
                    </h3>
                </div>
                <div className="divide-y divide-border">
                    {[
                        { msg: "New login from familiar device verified via Behavioral Biometrics", time: "2 hours ago", type: "success" },
                        { msg: "Attempted screen-recording detected during transaction and blocked", time: "Yesterday", type: "warning" },
                        { msg: "Automatic session extension granted based on low-risk environment", time: "2 days ago", type: "info" }
                    ].map((alert, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                            <span className="text-sm">{alert.msg}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">{alert.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SecurityCenter;
