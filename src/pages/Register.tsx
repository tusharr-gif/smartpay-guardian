import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { currentUser, register } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.isAdmin ? "/admin" : "/dashboard");
    }
  }, [currentUser, navigate]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || password.length < 6) {
      toast.error("Name must be 2+ chars, password 6+ chars");
      return;
    }
    register(name, email, password);
    toast.success("Account created! Welcome to Januin pay.");
    navigate("/dashboard");
  };

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] overflow-hidden bg-[#0a192f] border border-white/5 shadow-glow">
              <img src="/logo.png" alt="Januin pay" className="h-full w-full object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Name, Mail & Pass</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          </div>
          <div className="space-y-2">
            <Label>Mail</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Mail" required />
          </div>
          <div className="space-y-2">
            <Label>Pass</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Pass" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Create Account</Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
