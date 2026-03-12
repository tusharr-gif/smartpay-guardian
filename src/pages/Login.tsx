import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    } else {
      toast.error("Invalid credentials. Try alex@example.com");
    }
  };

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="mb-8 text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your SmartPay account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label>Mail</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Pass</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Sign In</Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
