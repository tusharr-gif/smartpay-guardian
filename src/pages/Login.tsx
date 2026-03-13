import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Smartphone, Key, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const { loginByPhone } = useApp();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    // Simulate API call and generate dynamic OTP
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setIsLoading(false);
      setStep("otp");
      toast.success(`OTP sent! Your code is: ${newOtp}`, {
        duration: 10000,
        description: "In a real app, this would be an SMS.",
      });
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please check the code sent to your mobile.");
      return;
    }
    setIsLoading(true);
    const user = loginByPhone(phone);
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    } else {
      toast.error("User not found with this number");
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="gradient-hero min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-elevated p-10 relative overflow-hidden">
        {/* Animated Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-[#0a192f] border border-white/5 shadow-glow mb-6">
            <img src="/logo.png" alt="Januin pay" className="h-full w-full object-contain p-2" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Januin Pay</h1>
          <p className="text-sm text-muted-foreground font-medium">Verified by AI Guardian Security</p>
        </div>

        <div className="relative z-10">
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-muted-foreground">
                    <Smartphone className="h-5 w-5" />
                    <span className="font-bold border-r border-border pr-2">+91</span>
                  </div>
                  <Input 
                    type="tel" 
                    placeholder="MOBILE NUMBER" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} 
                    className="h-16 pl-24 rounded-2xl text-lg font-black tracking-wider bg-background/50 focus-visible:ring-primary/20 placeholder:text-muted-foreground/30"
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 rounded-2xl gradient-primary text-primary-foreground font-black text-lg shadow-glow gap-3 active:scale-[0.98] transition-transform"
              >
                {isLoading ? "SENDING..." : "GET OTP"} <ArrowRight className="h-5 w-5" />
              </Button>

              <p className="text-[10px] text-center text-muted-foreground font-bold px-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OTP Verification</Label>
                  <button type="button" onClick={() => setStep("phone")} className="text-[10px] font-black uppercase text-primary hover:underline">Edit Number</button>
                </div>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input 
                    type="password" 
                    placeholder="ENTER 6 DIGIT OTP" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-16 pl-14 rounded-2xl text-center text-2xl font-black tracking-[0.5em] bg-background/50 focus-visible:ring-primary/20"
                    required 
                  />
                </div>
                <p className="text-xs text-center font-medium text-muted-foreground">OTP sent to +91 {phone}</p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 rounded-2xl gradient-primary text-primary-foreground font-black text-lg shadow-glow gap-3 active:scale-[0.98] transition-transform"
              >
                {isLoading ? "VERIFYING..." : "VERIFY & LOGIN"} <CheckCircle2 className="h-5 w-5" />
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4">Didn't receive code? <button type="button" className="text-primary font-bold hover:underline">Resend</button></p>
              </div>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-border/50 text-center">
             <div className="flex items-center justify-center gap-2 text-success mb-2">
                <Shield className="h-4 w-4 fill-current" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure 256-bit encryption</span>
             </div>
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">© {currentYear} Januin Fintech Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
