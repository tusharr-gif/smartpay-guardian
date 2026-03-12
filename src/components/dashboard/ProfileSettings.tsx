import { useApp } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  User, Shield, Bell, HelpCircle, LogOut, ChevronRight, 
  Lock, Smartphone, Eye, Fingerprint, CreditCard, 
  Settings, UserCheck, Mail, MapPin, Phone,
  Gift, Sparkles, TrendingUp, HandHelping, Trophy, 
  CheckCircle2, Star, Zap, Share2, Coins, ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";

const ProfileSettings = () => {
  const { currentUser, logout } = useApp();
  const { theme, setTheme } = useTheme();

  if (!currentUser) return null;

  const sections = [
    {
      title: "Security & Privacy",
      items: [
        { id: "mfa", label: "Multi-Factor Auth", sub: "Secure login with DOTP", icon: Lock, status: "Active", color: "text-primary" },
        { id: "bio", label: "Biometrics", sub: "Face ID & Fingerprint", icon: Fingerprint, status: "Enabled", color: "text-success" },
        { id: "guardian", label: "AI Guardian", sub: "Real-time threat detection", icon: ShieldCheck, status: "Active", color: "text-primary" },
      ]
    },
    {
      title: "Payments & Accounts",
      items: [
        { id: "banks", label: "Linked Banks", sub: "HDFC, ICICI, etc.", icon: CreditCard },
        { id: "upi", label: "UPI Settings", sub: "Manage VPA & QR", icon: Smartphone },
      ]
    },
    {
      title: "App Preferences",
      items: [
        { id: "theme", label: "Dark Mode", sub: "Toggle app appearance", icon: Moon, type: "switch" },
      ]
    },
    {
      title: "Support & Legal",
      items: [
        { id: "help", label: "Help Center", sub: "FAQs & Support", icon: HelpCircle },
        { id: "terms", label: "Terms of Service", sub: "Privacy Policy", icon: UserCheck },
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] border border-border bg-card p-6 shadow-card overflow-hidden relative"
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-[32px] gradient-primary text-3xl font-black text-white shadow-glow">
              {currentUser.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-card border-2 border-background shadow-md text-primary">
              <Settings className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight">{currentUser.name}</h2>
          <div className="mt-1 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 border border-primary/20">
            <p className="text-[10px] font-black uppercase text-primary tracking-widest">{currentUser.trustLevel} Tier</p>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3 w-full">
            <div className="rounded-2xl bg-muted/30 p-3 border border-border/50">
               <div className="flex items-center gap-2 text-muted-foreground mb-1">
                 <Mail className="h-3 w-3" />
                 <span className="text-[9px] font-bold uppercase">Email</span>
               </div>
               <p className="text-[10px] font-bold truncate">{currentUser.email}</p>
            </div>
            <div className="rounded-2xl bg-muted/30 p-3 border border-border/50">
               <div className="flex items-center gap-2 text-muted-foreground mb-1">
                 <Phone className="h-3 w-3" />
                 <span className="text-[9px] font-bold uppercase">Phone</span>
               </div>
               <p className="text-[10px] font-bold">{currentUser.phone || "Not Set"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {sections.map((section, idx) => (
        <div key={section.title} className="space-y-3">
           <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
             {section.title}
           </h3>
           <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
             {section.items.map((item, i) => (
               <div 
                 key={item.id}
                 className={cn(
                   "flex w-full items-center justify-between p-4 transition-all hover:bg-muted/10",
                   i !== section.items.length - 1 && "border-b border-border/50"
                 )}
               >
                 <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
                       <item.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                       <p className="text-sm font-bold tracking-tight">{item.label}</p>
                       <p className="text-[10px] text-muted-foreground font-medium">{item.sub}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    {item.status && (
                      <span className={cn("text-[9px] font-black uppercase tracking-tighter", item.color)}>
                        {item.status}
                      </span>
                    )}
                    {item.type === "switch" && item.id === "theme" ? (
                      <Switch 
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 cursor-pointer" />
                    )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="pt-2 space-y-3">
         <Button 
           variant="outline" 
           className="h-14 w-full rounded-2xl border-none bg-red-50 text-red-600 font-black hover:bg-red-100 transition-colors gap-2"
           onClick={() => logout()}
         >
           <LogOut className="h-5 w-5" /> SIGN OUT
         </Button>
         <p className="text-center text-[9px] font-black text-muted-foreground opacity-40 uppercase tracking-[0.3em]">
           Januin Pay v4.2.0-secure
         </p>
      </div>
    </div>
  );
};

export default ProfileSettings;
