import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Wallet, Send, History, AlertTriangle, Settings, LogOut, BarChart3, Home, Bell, User, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import WalletSection from "@/components/dashboard/WalletSection";
import SendMoney from "@/components/dashboard/SendMoney";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import FraudAlerts from "@/components/dashboard/FraudAlerts";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import SecurityCenter from "@/components/dashboard/SecurityCenter";
import UPIHub from "@/components/dashboard/UPIHub";
import BillsHub from "@/components/dashboard/BillsHub";
import RewardsCenter from "@/components/dashboard/RewardsCenter";
import MerchantHub from "@/components/dashboard/MerchantHub";

const tabs = [
  { id: "wallet", label: "My Wallet", icon: Wallet },
  { id: "upi", label: "UPI Payments", icon: Send },
  { id: "bills", label: "Bills & Recharge", icon: Zap },
  { id: "merchant", label: "Merchant Hub", icon: BarChart3 },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "security", label: "Security", icon: Shield },
  { id: "history", label: "Transactions", icon: History },
  { id: "alerts", label: "AI Alerts", icon: AlertTriangle },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = typeof tabs[number]["id"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>("wallet");
  const { currentUser, logout, fraudAlerts } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const unresolvedAlerts = fraudAlerts.filter(a => !a.resolved).length;

  const renderContent = () => {
    switch (activeTab) {
      case "wallet": return <WalletSection />;
      case "upi": return <UPIHub />;
      case "bills": return <BillsHub />;
      case "merchant": return <MerchantHub />;
      case "rewards": return <RewardsCenter />;
      case "security": return <SecurityCenter />;
      case "history": return <TransactionHistory />;
      case "alerts": return <FraudAlerts />;
      case "settings": return <ProfileSettings />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-64 flex-col gradient-dark border-r border-sidebar-border">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-[#0a192f] border border-white/5 shadow-glow">
            <img src="/logo.png" alt="Januin pay" className="h-full w-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-tight text-sidebar-foreground italic">JANUIN</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
            >
              <tab.icon className="h-4.5 w-4.5" />
              {tab.label}
              {tab.id === "alerts" && unresolvedAlerts > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                  {unresolvedAlerts}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-foreground">
              {currentUser.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/50">{currentUser.email}</p>
            </div>
          </div>
          {currentUser.isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="mb-1 w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <BarChart3 className="h-4 w-4" /> Admin Panel
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={() => { logout(); navigate("/"); }}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === "wallet" && "Comprehensive overview of your assets and AI insights"}
              {activeTab === "upi" && "Instant bank-to-bank transfers via BHIM UPI protocol"}
              {activeTab === "bills" && "Secure utility bill payments and mobile recharges"}
              {activeTab === "merchant" && "Business dashboard, Payment links and Dynamic QR"}
              {activeTab === "rewards" && "Exciting cashback, scratch cards, and referral bonuses"}
              {activeTab === "security" && "AI Guardian protection and behavioral biometrics status"}
              {activeTab === "history" && "Complete ledger with deep AI risk analysis"}
              {activeTab === "alerts" && "Real-time fraudulent activity monitoring"}
              {activeTab === "settings" && "Manage your profiles and advanced security preferences"}
            </p>
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
