import { createContext, useContext, ReactNode } from "react";
import { useAppData, User, Transaction, FraudAlert, Reward } from "@/lib/mockData";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  transactions: Transaction[];
  fraudAlerts: FraudAlert[];
  rewards: Reward[];
  login: (email: string, password: string) => User | null;
  register: (name: string, email: string, password: string) => User;
  logout: () => void;
  sendMoney: (receiverEmail: string, amount: number) => Transaction | null;
  receiveMoney: (amount: number, senderName?: string) => Transaction | null;
  setCurrentUser: (user: User | null) => void;
  scratchReward: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const data = useAppData();
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
