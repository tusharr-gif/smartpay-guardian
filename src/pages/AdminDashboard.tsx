import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Shield, Users, DollarSign, AlertTriangle, ArrowLeft, LogOut, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const CHART_COLORS = ["hsl(152, 69%, 41%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(217, 91%, 50%)"];

const AdminDashboard = () => {
  const { currentUser, users, transactions, fraudAlerts, logout } = useApp();
  const navigate = useNavigate();

  if (!currentUser?.isAdmin) {
    navigate("/login");
    return null;
  }

  const totalVolume = transactions.reduce((s, t) => s + t.amount, 0);
  const flaggedCount = transactions.filter(t => t.status === "flagged" || t.status === "blocked").length;
  const unresolvedAlerts = fraudAlerts.filter(a => !a.resolved).length;

  const statusData = [
    { name: "Completed", value: transactions.filter(t => t.status === "completed").length },
    { name: "Flagged", value: transactions.filter(t => t.status === "flagged").length },
    { name: "Blocked", value: transactions.filter(t => t.status === "blocked").length },
    { name: "Pending", value: transactions.filter(t => t.status === "pending").length },
  ];

  const riskBuckets = [
    { range: "0-20", count: transactions.filter(t => t.riskScore <= 20).length },
    { range: "21-40", count: transactions.filter(t => t.riskScore > 20 && t.riskScore <= 40).length },
    { range: "41-60", count: transactions.filter(t => t.riskScore > 40 && t.riskScore <= 60).length },
    { range: "61-80", count: transactions.filter(t => t.riskScore > 60 && t.riskScore <= 80).length },
    { range: "81-100", count: transactions.filter(t => t.riskScore > 80).length },
  ];

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Transactions", value: transactions.length, icon: DollarSign, color: "bg-success/10 text-success" },
    { label: "Fraud Alerts", value: unresolvedAlerts, icon: AlertTriangle, color: "bg-warning/10 text-warning" },
    { label: "Volume", value: `$${(totalVolume / 1000).toFixed(1)}K`, icon: TrendingUp, color: "bg-accent/10 text-accent" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-[#0a192f] border border-white/5 shadow-glow">
                  <img src="/logo.png" alt="Januin pay" className="h-full w-full object-contain" />
                </div> Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Platform analytics and fraud monitoring</p>
            </div>
          </div>
          <Button variant="ghost" className="gap-2" onClick={() => { logout(); navigate("/"); }}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold">Risk Score Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(217, 91%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold">Transaction Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suspicious Users */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold">Suspicious Activity Log</h3>
          <div className="space-y-3">
            {fraudAlerts.map(alert => (
              <div key={alert.id} className={`flex items-center justify-between rounded-xl border p-4 ${alert.resolved ? "border-border" : "border-warning/30 bg-warning/5"}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${alert.resolved ? "bg-success/10" : "bg-warning/10"}`}>
                    <AlertTriangle className={`h-4 w-4 ${alert.resolved ? "text-success" : "text-warning"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alert.userName}</p>
                    <p className="text-xs text-muted-foreground">{alert.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-lg font-bold ${alert.riskScore > 90 ? "text-danger" : "text-warning"}`}>{alert.riskScore}</span>
                  <p className="text-[10px] uppercase text-muted-foreground">{alert.resolved ? "Resolved" : "Active"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
