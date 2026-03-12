import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Wallet, Send, History, AlertTriangle, Settings, LogOut, BarChart3, Home, Bell, User, Zap, Gift, Search, QrCode, CreditCard, Landmark, ScanLine, ShieldAlert } from "lucide-react";
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
import BottomNav from "@/components/dashboard/BottomNav";
import QRScanner from "@/components/dashboard/QRScanner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const desktopTabs = [
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

type TabId = typeof desktopTabs[number]["id"];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>("wallet");
  const [showScanner, setShowScanner] = useState(false);
  const [scannedUpi, setScannedUpi] = useState("");
  const { currentUser, logout, fraudAlerts } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleQRScan = (data: string) => {
    let upiId = data;
    try {
      if (data.startsWith("upi://pay")) {
        const url = new URL(data.replace("upi://pay", "https://upi.com/pay"));
        upiId = url.searchParams.get("pa") || data;
      }
    } catch (e) {
      console.error("Error parsing QR data", e);
    }
    
    setScannedUpi(upiId);
    setShowScanner(false);
    setActiveTab("upi");
    toast.success(`Scanned: ${upiId}`);
  };

  const unresolvedAlertsCount = fraudAlerts.filter(a => !a.resolved).length;

  const renderContent = () => {
    switch (activeTab) {
      case "wallet": return <WalletSection onScanClick={() => setShowScanner(true)} />;
      case "upi": return <UPIHub initialUpiId={scannedUpi} />;
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
    <div className="flex min-h-screen bg-background pb-16 md:pb-0">
      {/* Sidebar - Desktop Only */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-64 flex-col gradient-dark border-r border-sidebar-border md:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-[#0a192f] border border-white/5 shadow-glow">
            <img src="/logo.png" alt="Januin pay" className="h-full w-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-tight text-sidebar-foreground italic uppercase">JANUIN</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {desktopTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <tab.icon className="h-4.5 w-4.5" />
              {tab.label}
              {tab.id === "alerts" && unresolvedAlertsCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                  {unresolvedAlertsCount}
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground" 
            onClick={() => { logout(); navigate("/"); }}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              {currentUser.avatar}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Welcome back,</p>
              <p className="text-sm font-bold">{currentUser.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unresolvedAlertsCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-danger">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-[10px] font-bold">{unresolvedAlertsCount}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
              <Bell className="h-5 w-5" />
              {unresolvedAlertsCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Desktop Header */}
        <div className="hidden border-b bg-card/50 p-8 md:block">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {desktopTabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
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
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-success">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-bold">AI Active Protection</span>
              </div>
              <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unresolvedAlerts={unresolvedAlertsCount} 
      />

      {showScanner && (
        <QRScanner 
          onScan={handleQRScan} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
