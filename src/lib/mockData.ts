import { useState, useEffect } from "react";

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

export interface VerificationResult {
  vpa: string;
  registeredName: string;
  bankName: string;
  kycBadge: "Full Video KYC" | "Aadhar Verified" | "Basic";
  heritageScore: string; // e.g. "Active since 2021"
  transactionIntegrity: string; // e.g. "99.9% Success"
  communitySafety: string; // e.g. "Zero Fraud Reports"
  trustLevel: "trusted" | "verified" | "suspicious" | "flagged";
  riskScore: number;
}

const mockUsers: User[] = [
  { id: "u1", name: "Alex Johnson", email: "alex@example.com", phone: "9876543210", avatar: "AJ", walletBalance: 12450.75, isAdmin: false, createdAt: "2024-01-15", trustLevel: "trusted", upiId: "alex@januin", points: 450, linkedBanks: [{ id: "b1", bankName: "HDFC Bank", accountNumber: "****5521", isPrimary: true, balance: 8400 }] },
  { id: "u2", name: "Sarah Chen", email: "sarah@example.com", phone: "9876543211", avatar: "SC", walletBalance: 8320.50, isAdmin: false, createdAt: "2024-02-20", trustLevel: "verified", upiId: "sarah@januin", points: 820, linkedBanks: [{ id: "b2", bankName: "ICICI Bank", accountNumber: "****1120", isPrimary: true, balance: 12500 }] },
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("januin_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [users] = useState<User[]>(mockUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>(mockFraudAlerts);
  const [rewards, setRewards] = useState<Reward[]>([
    { id: "r1", title: "Monthly Cashback", amount: 25.50, type: "cashback", isScratched: false, timestamp: new Date().toISOString() }
  ]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("januin_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("januin_user");
    }
  }, [currentUser]);

  const login = (email: string, _password: string): User | null => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const loginByPhone = (phone: string): User | null => {
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
      setCurrentUser(existingUser);
      return existingUser;
    }

    // Shadow Login: Create a temporary user for any new number
    const newUser: User = {
      id: `u${Date.now()}`,
      name: `User ${phone.slice(-4)}`,
      email: `${phone}@januin.com`,
      phone,
      avatar: "U",
      walletBalance: 2500.00,
      isAdmin: false,
      createdAt: new Date().toISOString().split("T")[0],
      trustLevel: "verified",
      upiId: `${phone}@januin`,
      points: 100,
      linkedBanks: [{ id: `b${Date.now()}`, bankName: "Axis Bank", accountNumber: "****8822", isPrimary: true, balance: 15000 }]
    };

    setCurrentUser(newUser);
    return newUser;
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
      upiId: `${name.toLowerCase().replace(/ /g, "")}@januin`,
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

  const sendExternalMoney = (receiverUpiId: string, amount: number): Transaction | null => {
    if (!currentUser) return null;
    const now = new Date();
    const riskScore = calculateFraudScore(amount, now.getHours(), transactions.filter(t => t.senderId === currentUser.id).length);
    const status = riskScore > 70 ? "flagged" : "completed";

    const tx: Transaction = {
      id: `t${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: receiverUpiId,
      receiverName: receiverUpiId.split('@')[0] || receiverUpiId,
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
          ? "Critical: Extremely high amount to external UPI detected by AI Guardian."
          : "High risk: Abnormal transaction frequency spike flagged by Guardian Engine.",
        timestamp: now.toISOString(),
        resolved: false,
      };
      setFraudAlerts(prev => [alert, ...prev]);
    }

    if (status === "completed") {
      currentUser.walletBalance -= amount;
    }
    return tx;
  };

  const receiveMoney = (amount: number, senderName: string = "External UPI User"): Transaction | null => {
    if (!currentUser) return null;
    const now = new Date();
    const tx: Transaction = {
      id: `t${Date.now()}`,
      senderId: "external",
      senderName,
      receiverId: currentUser.id,
      receiverName: currentUser.name,
      amount,
      timestamp: now.toISOString(),
      riskScore: 2, // QR incoming is generally low risk in this mockup
      status: "completed",
      type: "receive",
    };
    setTransactions(prev => [tx, ...prev]);
    currentUser.walletBalance += amount;
    return tx;
  };

  const verifyVpa = async (vpa: string): Promise<VerificationResult> => {
    // Artificial delay to simulate real API call
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));

    // Specific Simulated Database
    const simulatedRegistry: Record<string, Partial<VerificationResult>> = {
      "tushar@pay": { registeredName: "Tushar Gupta", trustLevel: "trusted", kycBadge: "Full Video KYC", heritageScore: "Active since 2020" },
      "fraud.alert@upi": { registeredName: "MUMBAI SPAM CENTER", trustLevel: "flagged", communitySafety: "24 Fraud Reports", heritageScore: "New (1 day old)", riskScore: 98 },
      "starbucks@axis": { registeredName: "Tata Starbucks PVT LTD", trustLevel: "trusted", kycBadge: "Full Video KYC", heritageScore: "Active since 2012" },
      "suspicious.user@okicici": { registeredName: "Ankit Unknown", trustLevel: "suspicious", communitySafety: "3 Reports", riskScore: 72 }
    };

    if (simulatedRegistry[vpa]) {
      return {
        vpa,
        registeredName: "Verified User",
        bankName: "HDFC Bank",
        kycBadge: "Aadhar Verified",
        heritageScore: "Active since 2022",
        transactionIntegrity: "99.9% Success Rate",
        communitySafety: "Zero Fraud Reports",
        trustLevel: "verified",
        riskScore: 10,
        ...simulatedRegistry[vpa]
      } as VerificationResult;
    }

    // Simple pattern matching for simulation fallback
    const isSuspicious = vpa.includes("spam") || vpa.includes("fraud") || vpa.includes("666");
    const isVerified = vpa.includes("merchant") || vpa.includes("store");

    if (isSuspicious) {
      return {
        vpa,
        registeredName: "Account Under Review",
        bankName: "Unknown Bank",
        kycBadge: "Basic",
        heritageScore: "New Account (2 days)",
        transactionIntegrity: "Unusual activity detected",
        communitySafety: "7 Recent Reports",
        trustLevel: "suspicious",
        riskScore: 85
      };
    }

    if (isVerified) {
      return {
        vpa,
        registeredName: "Cloud Mart Solutions PVT LTD",
        bankName: "HDFC Bank",
        kycBadge: "Full Video KYC",
        heritageScore: "Active since 2019",
        transactionIntegrity: "99.9% Success Rate",
        communitySafety: "Zero Fraud Reports",
        trustLevel: "trusted",
        riskScore: 5
      };
    }

    try {
      // Fetch real-time deterministic data using an open source API based on the UPI ID (seed)
      const response = await fetch(`https://randomuser.me/api/?seed=${encodeURIComponent(vpa)}`);
      const data = await response.json();
      const user = data.results[0];

      // Generate dynamic risk score and stats based on the deterministic API data
      let rawScore = (user.dob.age * 7 + user.registered.age * 13) % 100;
      
      // Scale down normal score to be strictly safe (0 to 35) for presentations!
      rawScore = rawScore % 35;
      
      const lowerVpa = vpa.toLowerCase();
      // Only show risky for explicitly testing keywords
      if (lowerVpa.includes("fraud") || lowerVpa.includes("scam") || lowerVpa.includes("spam") || lowerVpa.includes("risk")) {
         rawScore = 85 + (rawScore % 10);
      } else if (lowerVpa.includes("unknown") || lowerVpa.includes("test")) {
         rawScore = 60 + (rawScore % 15);
      }
      
      let trustLevel: "trusted" | "verified" | "suspicious" | "flagged" = "verified";
      if (rawScore < 20) trustLevel = "trusted";
      else if (rawScore > 80) trustLevel = "flagged";
      else if (rawScore > 50) trustLevel = "suspicious";

      return {
        vpa,
        registeredName: `${user.name.first} ${user.name.last}`.toUpperCase(),
        bankName: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak"][user.dob.age % 5],
        kycBadge: rawScore < 30 ? "Full Video KYC" : "Aadhar Verified",
        heritageScore: `Active since ${new Date(user.registered.date).getFullYear()}`,
        transactionIntegrity: rawScore > 70 ? "Unusual Patterns" : "99.9% Success Rate",
        communitySafety: rawScore > 80 ? `${(rawScore % 10) + 2} Fraud Reports` : "Zero Fraud Reports",
        trustLevel,
        riskScore: rawScore
      } as VerificationResult;
    } catch (e) {
      // Fallback if API fails
      return {
        vpa,
        registeredName: vpa.split('@')[0].replace(/\./g, ' ').toUpperCase(),
        bankName: "Axis Bank",
        kycBadge: "Aadhar Verified",
        heritageScore: "Active since 2022",
        transactionIntegrity: "High Volume (verified)",
        communitySafety: "Zero Fraud Reports",
        trustLevel: "verified",
        riskScore: 12
      } as VerificationResult;
    }
  };

  return { currentUser, users, transactions, fraudAlerts, rewards, login, loginByPhone, register, logout, sendMoney, sendExternalMoney, receiveMoney, setCurrentUser, scratchReward, verifyVpa };

}
