import { useState } from "react";

// Mock data store
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  walletBalance: number;
  isAdmin: boolean;
  createdAt: string;
  trustLevel: "verified" | "new" | "trusted" | "suspicious";
  upiId: string;
  linkedBanks: LinkedBank[];
  points: number;
}

export interface LinkedBank {
  id: string;
  bankName: string;
  accountNumber: string;
  isPrimary: boolean;
  balance: number;
}

export interface BillProvider {
  id: string;
  name: string;
  category: "electricity" | "water" | "gas" | "recharge" | "broadband";
  icon: string;
}

export interface Reward {
  id: string;
  title: string;
  amount: number;
  type: "cashback" | "voucher";
  isScratched: boolean;
  timestamp: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  amount: number;
  timestamp: string;
  riskScore: number;
  status: "completed" | "pending" | "flagged" | "blocked";
  type: "send" | "receive" | "deposit" | "withdrawal";
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  riskScore: number;
  reason: string;
  timestamp: string;
  resolved: boolean;
}

const mockUsers: User[] = [
  { id: "u1", name: "Alex Johnson", email: "alex@example.com", phone: "9876543210", avatar: "AJ", walletBalance: 12450.75, isAdmin: false, createdAt: "2024-01-15", trustLevel: "trusted", upiId: "alex@smartpay", points: 450, linkedBanks: [{ id: "b1", bankName: "HDFC Bank", accountNumber: "****5521", isPrimary: true, balance: 8400 }] },
  { id: "u2", name: "Sarah Chen", email: "sarah@example.com", phone: "9876543211", avatar: "SC", walletBalance: 8320.50, isAdmin: false, createdAt: "2024-02-20", trustLevel: "verified", upiId: "sarah@smartpay", points: 820, linkedBanks: [{ id: "b2", bankName: "ICICI Bank", accountNumber: "****1120", isPrimary: true, balance: 12500 }] },
];

export const mockBills: BillProvider[] = [
  { id: "bp1", name: "Adani Electricity", category: "electricity", icon: "Zap" },
  { id: "bp2", name: "Airtel Fiber", category: "broadband", icon: "Globe" },
  { id: "bp3", name: "Indane Gas", category: "gas", icon: "Flame" },
  { id: "bp4", name: "Jio Prepaid", category: "recharge", icon: "Smartphone" },
];

const mockTransactions: Transaction[] = [
  { id: "t1", senderId: "u1", senderName: "Alex Johnson", receiverId: "u2", receiverName: "Sarah Chen", amount: 250.00, timestamp: "2025-03-10T14:30:00Z", riskScore: 12, status: "completed", type: "send" },
  { id: "t2", senderId: "u2", senderName: "Sarah Chen", receiverId: "u1", receiverName: "Alex Johnson", amount: 1500.00, timestamp: "2025-03-10T09:15:00Z", riskScore: 35, status: "completed", type: "send" },
  { id: "t3", senderId: "u3", senderName: "Mike Peters", receiverId: "u1", receiverName: "Alex Johnson", amount: 9800.00, timestamp: "2025-03-09T22:45:00Z", riskScore: 82, status: "flagged", type: "send" },
  { id: "t4", senderId: "u1", senderName: "Alex Johnson", receiverId: "u3", receiverName: "Mike Peters", amount: 75.00, timestamp: "2025-03-09T16:00:00Z", riskScore: 5, status: "completed", type: "send" },
  { id: "t5", senderId: "u2", senderName: "Sarah Chen", receiverId: "u3", receiverName: "Mike Peters", amount: 4200.00, timestamp: "2025-03-08T11:30:00Z", riskScore: 71, status: "flagged", type: "send" },
  { id: "t6", senderId: "u1", senderName: "Alex Johnson", receiverId: "u2", receiverName: "Sarah Chen", amount: 320.00, timestamp: "2025-03-08T08:00:00Z", riskScore: 15, status: "completed", type: "send" },
  { id: "t7", senderId: "u3", senderName: "Mike Peters", receiverId: "u2", receiverName: "Sarah Chen", amount: 15000.00, timestamp: "2025-03-07T03:00:00Z", riskScore: 95, status: "blocked", type: "send" },
  { id: "t8", senderId: "u1", senderName: "Alex Johnson", receiverId: "u3", receiverName: "Mike Peters", amount: 180.00, timestamp: "2025-03-07T14:20:00Z", riskScore: 8, status: "completed", type: "send" },
];

const mockFraudAlerts: FraudAlert[] = [
  { id: "f1", transactionId: "t3", userId: "u3", userName: "Mike Peters", riskScore: 82, reason: "Unusual high amount transfer at odd hours", timestamp: "2025-03-09T22:45:00Z", resolved: false },
  { id: "f2", transactionId: "t5", userId: "u2", userName: "Sarah Chen", riskScore: 71, reason: "Transaction frequency spike detected", timestamp: "2025-03-08T11:30:00Z", resolved: false },
  { id: "f3", transactionId: "t7", userId: "u3", userName: "Mike Peters", riskScore: 95, reason: "Extremely high amount + unusual location + midnight transfer", timestamp: "2025-03-07T03:00:00Z", resolved: true },
];

export function calculateFraudScore(amount: number, hour: number, frequency: number): number {
  let score = 0;
  // Amount factor
  if (amount > 10000) score += 40;
  else if (amount > 5000) score += 25;
  else if (amount > 2000) score += 10;
  // Time factor (suspicious if late night)
  if (hour >= 0 && hour < 6) score += 25;
  else if (hour >= 22) score += 15;
  // Frequency factor
  if (frequency > 10) score += 30;
  else if (frequency > 5) score += 15;
  // Random noise
  score += Math.floor(Math.random() * 10);
  return Math.min(score, 100);
}

export function useAppData() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  const [rewards, setRewards] = useState<Reward[]>([
    { id: "r1", title: "Monthly Cashback", amount: 25.50, type: "cashback", isScratched: false, timestamp: new Date().toISOString() }
  ]);

  const login = (email: string, _password: string): User | null => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const register = (name: string, email: string, _password: string): User => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      phone: "",
      avatar: name.split(" ").map(n => n[0]).join("").toUpperCase(),
      walletBalance: 1000.00,
      isAdmin: false,
      createdAt: new Date().toISOString().split("T")[0],
      trustLevel: "new",
      upiId: `${name.toLowerCase().replace(/ /g, "")}@smartpay`,
      points: 0,
      linkedBanks: []
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const scratchReward = (id: string) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, isScratched: true } : r));
  };

  const logout = () => setCurrentUser(null);

  const sendMoney = (receiverEmail: string, amount: number): Transaction | null => {
    if (!currentUser) return null;
    const receiver = users.find(u => u.email === receiverEmail);
    if (!receiver || amount > currentUser.walletBalance) return null;

    const now = new Date();
    const riskScore = calculateFraudScore(amount, now.getHours(), transactions.filter(t => t.senderId === currentUser.id).length);
    const status = riskScore > 70 ? "flagged" : "completed";

    const tx: Transaction = {
      id: `t${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: receiver.id,
      receiverName: receiver.name,
      amount,
      timestamp: now.toISOString(),
      riskScore,
      status,
      type: "send",
    };

    setTransactions(prev => [tx, ...prev]);

    if (riskScore > 70) {
      const alert: FraudAlert = {
        id: `f${Date.now()}`,
        transactionId: tx.id,
        userId: currentUser.id,
        userName: currentUser.name,
        riskScore,
        reason: riskScore > 90
          ? "Critical: Extremely high amount from unusual location detected by AI Guardian."
          : "High risk: Abnormal transaction frequency spike flagged by Guardian Engine.",
        timestamp: now.toISOString(),
        resolved: false,
      };
      setFraudAlerts(prev => [alert, ...prev]);
    }

    currentUser.walletBalance -= amount;
    return tx;
  };

  return { currentUser, users, transactions, fraudAlerts, rewards, login, register, logout, sendMoney, setCurrentUser, scratchReward };
}
