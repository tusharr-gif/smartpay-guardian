import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, Sparkles, TrendingUp, HandHelping, Trophy, 
  CheckCircle2, Star, Zap, Share2, Coins, ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RewardsCenter = () => {
    const { rewards, scratchReward, currentUser } = useApp();
    const [opening, setOpening] = useState<string | null>(null);

    const handleScratch = (id: string, amount: number) => {
        setOpening(id);
        setTimeout(() => {
            scratchReward(id);
            setOpening(null);
            toast.success(`You won $${amount.toFixed(2)} Cashback!`, {
              icon: <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center"><Star className="h-3 w-3 text-white fill-white" /></div>
            });
        }, 1200);
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Premium Points Header */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-[32px] gradient-dark p-8 text-white shadow-elevated"
            >
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Guardian Rewards</span>
                      <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                        <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-black italic">ELITE LEVEL</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <h3 className="text-5xl font-black font-mono tracking-tighter italic">{currentUser?.points || 0}</h3>
                      <div className="pb-1.5 flex flex-col">
                        <span className="text-xs font-black uppercase text-white/70">Points</span>
                        <div className="h-1 w-24 bg-white/10 rounded-full mt-1">
                          <div className="h-full bg-primary w-[70%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex gap-6">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Lifetime Cashback</p>
                        <p className="text-lg font-black font-mono">$124.50</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Active Cards</p>
                        <p className="text-lg font-black font-mono">{rewards.filter(r => !r.isScratched).length}</p>
                      </div>
                    </div>
                </div>
                {/* Decorative backgrounds */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-[60px]" />
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent/20 blur-[60px]" />
            </motion.div>

            {/* Rewards Section */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Scratch & Win</h3>
                <span className="text-[10px] font-bold text-primary">View History</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  {rewards.map((reward, i) => (
                      <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "relative aspect-square cursor-pointer overflow-hidden rounded-[32px] border-4 transition-all shadow-lg",
                            reward.isScratched 
                              ? "bg-muted/30 border-muted/50 grayscale-[0.5]" 
                              : "gradient-primary border-white/20 shadow-glow"
                          )}
                          onClick={() => !reward.isScratched && !opening && handleScratch(reward.id, reward.amount)}
                      >
                          <AnimatePresence mode="wait">
                              {!reward.isScratched ? (
                                  <motion.div
                                      key="unscratched"
                                      className="flex h-full flex-col items-center justify-center p-4 text-white"
                                  >
                                      <div className={cn(
                                        "mb-3 flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/20 shadow-inner backdrop-blur-md",
                                        opening === reward.id && "animate-pulse"
                                      )}>
                                          <Gift className={cn("h-8 w-8 text-white", opening === reward.id ? "animate-bounce" : "")} />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-[11px] font-black tracking-widest mb-0.5">LUCKY CARD</p>
                                        <div className="flex justify-center flex-wrap gap-0.5">
                                          {[1,2,3].map(s => <Star key={s} className="h-2 w-2 fill-white/50 text-white/50" />)}
                                        </div>
                                      </div>
                                  </motion.div>
                              ) : (
                                  <motion.div
                                      key="scratched"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="flex h-full flex-col items-center justify-center p-4 text-center"
                                  >
                                      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                                        <Coins className="h-7 w-7 text-success" />
                                      </div>
                                      <p className="text-2xl font-black font-mono text-primary tracking-tighter">${reward.amount.toFixed(2)}</p>
                                      <p className="text-[9px] font-black uppercase text-muted-foreground mt-1">Cashback Credited</p>
                                      <div className="mt-3 flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[7px] font-black uppercase text-success">
                                        <ShieldCheck className="h-2 w-2" /> Verified
                                      </div>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                          
                          {/* Card shine effect */}
                          {!reward.isScratched && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                          )}
                      </motion.div>
                  ))}
                  
                  {/* Referral Action Card */}
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className="aspect-square rounded-[32px] border-4 border-dashed border-muted-foreground/20 bg-muted/10 flex flex-col items-center justify-center p-6 text-center group active:bg-muted/20 transition-colors"
                  >
                      <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Share2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Referral Bonus</p>
                      <p className="text-[8px] font-bold text-muted-foreground/60 mt-1">Get up to $50 per invite</p>
                  </motion.div>
              </div>
            </div>

            {/* Referral Campaign Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-primary/20 bg-primary/5 p-6 shadow-glow relative overflow-hidden"
            >
                <div className="relative z-10 flex gap-4">
                  <div className="shrink-0 h-16 w-16 rounded-[20px] bg-primary flex items-center justify-center text-white shadow-lg">
                    <HandHelping className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight leading-tight">Spread the Security. <br/> Get Paid.</h3>
                    <p className="text-[10px] text-muted-foreground mt-1.5 font-bold uppercase tracking-widest">Rewards for Referrals</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex -space-x-3 overflow-hidden ml-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-black">U{i}</div>
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-white text-[8px] font-black">+14</div>
                  </div>
                  <Button className="h-11 rounded-2xl font-black gradient-primary border-none text-[12px] px-6">
                    INVITE NOW <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {/* Decorative element */}
                <Sparkles className="absolute -right-2 top-2 h-16 w-16 text-primary/10 -rotate-12" />
            </motion.div>
        </div>
    );
};

export default RewardsCenter;

