import { Home, Send, Gift, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  unresolvedAlerts?: number;
}

const BottomNav = ({ activeTab, setActiveTab, unresolvedAlerts = 0 }: BottomNavProps) => {
  const tabs = [
    { id: "wallet", label: "Home", icon: Home },
    { id: "upi", label: "Payments", icon: Send },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "history", label: "Activity", icon: History },
    { id: "settings", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-card px-2 pb-safe md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
              isActive && "bg-primary/10"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
            
            {tab.id === "history" && unresolvedAlerts > 0 && (
              <span className="absolute right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-danger-foreground border-2 border-card">
                {unresolvedAlerts}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
