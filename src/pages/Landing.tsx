import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, ArrowRight, Lock, Globe, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, title: "AI Fraud Detection", desc: "Real-time ML-powered risk scoring on every transaction" },
  { icon: Zap, title: "Instant Transfers", desc: "Send money globally in under 3 seconds" },
  { icon: BarChart3, title: "Smart Analytics", desc: "Deep insights into spending patterns and risk trends" },
  { icon: Lock, title: "Bank-Grade Security", desc: "End-to-end encryption with multi-factor auth" },
  { icon: Globe, title: "Global Coverage", desc: "Support for 150+ currencies worldwide" },
  { icon: CreditCard, title: "Digital Wallet", desc: "Unified wallet for all your payment needs" },
];

const stats = [
  { value: "$2.4B+", label: "Processed" },
  { value: "99.97%", label: "Uptime" },
  { value: "12M+", label: "Users" },
  { value: "<0.01%", label: "Fraud Rate" },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SmartPay</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-primary border-0 text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Fraud Detection
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-7xl">
              Payments that{" "}
              <span className="text-gradient">protect</span>
              {" "}themselves
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              SmartPay uses machine learning to score every transaction in real-time,
              blocking fraud before it happens while keeping legitimate payments instant.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="gradient-primary border-0 px-8 text-lg text-primary-foreground shadow-glow">
                  Start Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-muted-foreground/20 px-8 text-lg text-black hover:bg-muted/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-primary-foreground">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Built for the future of finance</h2>
            <p className="mt-4 text-muted-foreground">Enterprise-grade infrastructure with consumer-grade simplicity</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Ready to secure your payments?</h2>
          <p className="mt-4 text-muted-foreground">Join 12 million users who trust SmartPay</p>
          <Link to="/register">
            <Button size="lg" className="mt-8 gradient-primary border-0 px-10 text-lg text-primary-foreground shadow-glow">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-white">SmartPay</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 SmartPay. AI Smart Payment & Fraud Detection Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
