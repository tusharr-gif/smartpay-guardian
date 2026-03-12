import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, TrendingUp, HandHelping, Trophy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const RewardsCenter = () => {
    const { rewards, scratchReward, currentUser } = useApp();
    const [opening, setOpening] = useState<string | null>(null);

    const handleScratch = (id: string, amount: number) => {
        setOpening(id);
        setTimeout(() => {
            scratchReward(id);
            setOpening(null);
            toast.success(`You won $${amount.toFixed(2)} Cashback!`);
        }, 1500);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Points & Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-black font-mono">{currentUser?.points || 0}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Guardian Points</p>
                </div>
                <div className="rounded-2xl border bg-card p-6 shadow-card">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success mb-3">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <h3 className="text-2xl font-black font-mono">$124.50</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Earned</p>
                </div>
            </div>

            {/* Rewards Grid */}
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-8">Recent Rewards</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {rewards.map(reward => (
                    <motion.div
                        key={reward.id}
                        whileHover={{ y: -5 }}
                        className={`relative aspect-square cursor-pointer overflow-hidden rounded-2xl border transition-all ${reward.isScratched ? "bg-card shadow-inner" : "gradient-primary shadow-glow"}`}
                        onClick={() => !reward.isScratched && !opening && handleScratch(reward.id, reward.amount)}
                    >
                        <AnimatePresence mode="wait">
                            {!reward.isScratched ? (
                                <motion.div
                                    key="unscratched"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex h-full flex-col items-center justify-center gap-3 p-4 text-primary-foreground"
                                >
                                    <Gift className={`h-10 w-10 ${opening === reward.id ? "animate-bounce" : ""}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">SCRATCH ME</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="scratched"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex h-full flex-col items-center justify-center p-4 text-center"
                                >
                                    <Sparkles className="h-8 w-8 text-primary mb-2" />
                                    <p className="text-lg font-black font-mono text-primary">${reward.amount.toFixed(2)}</p>
                                    <p className="text-[9px] text-muted-foreground font-bold">Cashback Added</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
                {/* Placeholder for Referral */}
                <div className="aspect-square rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 flex flex-col items-center justify-center p-4">
                    <HandHelping className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-[9px] text-muted-foreground text-center font-bold">Refer a friend for more rewards!</p>
                </div>
            </div>

            {/* Referral Banner */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-glow overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-bold">Invite friends, get paid!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[70%]">Earn $10 for every person who completes their first UPI transfer.</p>
                <Button variant="outline" className="mt-4 gap-2 text-xs border-primary/50 text-primary h-8 px-4 rounded-full">
                    Share Link <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default RewardsCenter;
