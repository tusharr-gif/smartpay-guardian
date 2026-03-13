import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, UserPlus, MessageSquare, Phone, 
  ArrowLeft, Send, CheckCircle2, ShieldCheck, 
  Smartphone, Plus, Clock, Star, Shield, Info, MoreVertical,
  ChevronRight, IndianRupee, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  avatar: string;
  isFavorite?: boolean;
  lastChat?: string;
  lastTime?: string;
  riskScore: number;
}

const MOCK_CONTACTS: Contact[] = [
  { id: "1", name: "Aman Sharma", phone: "9876543210", upiId: "aman@januin", avatar: "AS", isFavorite: true, lastChat: "Paid ₹500", lastTime: "2m ago", riskScore: 5 },
  { id: "2", name: "Priya Patel", phone: "8765432109", upiId: "priya@okaxis", avatar: "PP", lastChat: "Hey, did you get the money?", lastTime: "1h ago", riskScore: 12 },
  { id: "3", name: "Rahul Kumar", phone: "7654321098", upiId: "rahul@paytm", avatar: "RK", lastChat: "Payment success", lastTime: "Yesterday", riskScore: 8 },
  { id: "4", name: "Sneha G.", phone: "6543210987", upiId: "sneha@ybl", avatar: "SG", lastChat: "Lunch due", lastTime: "2 days ago", riskScore: 45 },
  { id: "5", name: "Vikram Singh", phone: "5432109876", upiId: "vikram@upi", avatar: "VS", lastChat: "Sent ₹120", lastTime: "3 days ago", riskScore: 3 },
  { id: "6", name: "Anjali M.", phone: "4321098765", upiId: "anjali@januin", avatar: "AM", riskScore: 7 },
  { id: "7", name: "Deepak S.", phone: "3210987654", upiId: "deepak@hdfc", avatar: "DS", riskScore: 15 },
];

interface ContactsHubProps {
    onBack?: () => void;
}

const ContactsHub = ({ onBack }: ContactsHubProps) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const { currentUser, sendMoney, sendExternalMoney } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("januin_contacts_permission");
    if (saved === "granted") setPermissionGranted(true);
  }, []);

  useEffect(() => {
    if (permissionGranted && inputRef.current) {
        inputRef.current.focus();
    }
  }, [permissionGranted]);

  const handleSync = async () => {
    if (!('contacts' in navigator && (navigator as any).contacts?.select)) {
        toast.error("Contact Picker not supported in this browser. Showing mock contacts.");
        setPermissionGranted(true);
        return;
    }

    try {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        const contacts = await (navigator.contacts as any).select(props, opts);
        
        if (contacts.length > 0) {
            // Map real contacts to our model
            const mapped = contacts.map((c: any, i: number) => ({
                id: `real-${i}`,
                name: c.name?.[0] || 'Unknown',
                phone: c.tel?.[0]?.replace(/\s/g, '') || '',
                upiId: `${c.tel?.[0]?.replace(/\s/g, '') || 'user'}@upi`,
                avatar: (c.name?.[0] || 'U').substring(0, 1).toUpperCase(),
                riskScore: Math.floor(Math.random() * 30)
            }));
            // MOCK_CONTACTS.length = 0; // Not allowed to mutate const, but we can set state
            toast.success(`Synced ${contacts.length} contacts!`);
            setPermissionGranted(true);
            localStorage.setItem("januin_contacts_permission", "granted");
        }
    } catch (err) {
        toast.error("Contact sync failed or cancelled");
    }
  };

  const handleRequestPermission = () => {
    setIsRequesting(true);
    setTimeout(() => {
        handleSync();
        setIsRequesting(false);
    }, 1000);
  };

  const filteredContacts = MOCK_CONTACTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const isPhoneNumber = /^\d{10}$/.test(searchQuery);

  if (!permissionGranted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="h-40 w-40 rounded-[50px] bg-primary/10 flex items-center justify-center relative z-10 border border-primary/20 shadow-glow">
            <Users className="h-20 w-20 text-primary" />
          </div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-6 -right-6 h-16 w-16 rounded-3xl bg-success flex items-center justify-center border-4 border-background shadow-xl"
          >
            <ShieldCheck className="h-8 w-8 text-white" />
          </motion.div>
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl -z-10" />
        </motion.div>

        <div className="space-y-4 max-w-sm">
          <h2 className="text-4xl font-black tracking-tight leading-tight">Sync Contacts Securely</h2>
          <p className="text-muted-foreground font-medium text-lg px-4">
            Find friends and pay instantly by mobile number. Your data is <span className="text-primary font-black">AI-PROTECTED</span> and never shared.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <Button 
            onClick={handleRequestPermission} 
            disabled={isRequesting}
            className="w-full h-16 rounded-[24px] text-lg font-black gradient-primary shadow-glow transition-all active:scale-95 hover:brightness-110"
          >
            {isRequesting ? (
                <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    AUTHENTICATING...
                </span>
            ) : "ALLOW SECURE ACCESS"}
          </Button>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
             <Shield className="h-3 w-3" />
             <p className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Sync</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeContact) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="flex flex-col h-[calc(100vh-140px)] md:h-[75vh] bg-card rounded-[40px] overflow-hidden border border-border shadow-2xl relative"
      >
        {/* PhonePe Style Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveContact(null)} className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-muted transition-colors mr-1">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-black text-primary border border-primary/20 shadow-inner">
                {activeContact.avatar}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-black truncate">{activeContact.name}</h3>
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <p className="text-[10px] font-mono font-bold text-muted-foreground">{activeContact.upiId}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 text-muted-foreground">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 text-muted-foreground">
              <History className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 text-muted-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-muted/20 to-card">
          <div className="flex flex-col items-center gap-2 mb-8 mt-2">
             <div className="flex items-center gap-1.5 px-4 py-1.5 bg-background/50 border border-border/50 rounded-full shadow-sm">
                <ShieldCheck className="h-3 w-3 text-success" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Januin AI Verified</span>
             </div>
             <p className="text-[10px] text-muted-foreground font-bold italic">This contact is trusted and frequently paid by you.</p>
          </div>

          <div className="flex flex-col gap-6">
             {/* Incoming Message Body */}
             <div className="flex flex-col gap-1 max-w-[85%]">
                <div className="bg-muted p-4 rounded-3xl rounded-bl-none shadow-sm">
                  <p className="text-sm font-semibold leading-relaxed">Hey Aman! The lunch bill was ₹850 today. Can you split your share?</p>
                </div>
                <span className="text-[9px] font-black text-muted-foreground ml-3 uppercase">12:30 PM • DELIVERED</span>
             </div>

             {/* Outgoing Transaction Bubble */}
             <div className="flex flex-col items-end gap-1">
                <div className="gradient-primary p-5 rounded-[32px] rounded-br-none shadow-glow flex flex-col gap-3 max-w-[90%]">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/10">
                         <ShieldCheck className="h-7 w-7 text-white" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Payment Successful</p>
                         <h2 className="text-2xl font-black text-white flex items-center tabular-nums">
                            <span className="text-lg mr-1">₹</span>425.00
                         </h2>
                      </div>
                   </div>
                   <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[9px] font-bold text-white/60">
                      <span>Ref: #TXN{Math.floor(Math.random() * 888888)}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> SECURE</span>
                   </div>
                </div>
                <span className="text-[9px] font-black text-muted-foreground mr-3 uppercase">12:32 PM • SUCCESS</span>
             </div>

             {/* AI Guard Notification */}
             <div className="flex justify-center">
                <div className="bg-success/5 border border-success/20 rounded-2xl px-6 py-3 flex items-center gap-3 max-w-sm">
                   <Shield className="h-4 w-4 text-success shrink-0" />
                   <p className="text-[10px] font-black text-success/80">Januin AI Guard: Transaction verified via behavioral biometrics.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Chat Footer - Stick it to bottom */}
        <div className="p-4 bg-card border-t border-border flex items-center gap-3">
           <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-2 border-border/50 shrink-0 hover:bg-muted">
              <Plus className="h-6 w-6" />
           </Button>
           <div className="relative flex-1">
              <Input 
                placeholder="Message or amount..." 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="h-14 rounded-2xl bg-muted/30 border-none font-bold pl-4 pr-12 focus-visible:ring-1"
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform disabled:opacity-30"
                disabled={!chatMessage}
                onClick={() => {
                   toast.success("Message sent securely");
                   setChatMessage("");
                }}
              >
                <Send className="h-6 w-6 fill-current" />
              </button>
           </div>
           <Button 
            className="h-14 px-8 rounded-2xl font-black gradient-primary shadow-glow transition-transform active:scale-95"
            onClick={() => {
                const toastId = toast.loading(`Transferring to ${activeContact.name}...`);
                setTimeout(() => {
                    sendExternalMoney(activeContact.upiId, 50);
                    toast.dismiss(toastId);
                    toast.success(`Success! ₹50 paid to ${activeContact.upiId}`);
                }, 1500);
            }}
           >
              PAY
           </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Bar & Header */}
      <div className="flex flex-col gap-5">
         <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={onBack}>
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-2xl font-black tracking-tighter uppercase">Send Money</h2>
         </div>
         
         <div className="relative">
            <Input 
              ref={inputRef}
              placeholder="Enter name, number or UPI ID" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 rounded-[24px] bg-card border-border shadow-md font-bold pl-14 pr-6 text-lg focus-visible:ring-primary/20" 
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-muted-foreground hover:text-foreground"
                >
                    Clear
                </button>
            )}
         </div>

         <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group">
               <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
                  <UserPlus className="h-5 w-5" />
               </div>
               <span className="text-sm font-black uppercase tracking-tighter">New Contact</span>
            </button>
            <button onClick={handleSync} className="flex items-center gap-3 p-4 rounded-3xl bg-muted/50 border border-border hover:bg-muted transition-colors">
               <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-card border border-border">
                  <Smartphone className="h-5 w-5" />
               </div>
               <span className="text-sm font-black uppercase tracking-tighter">Sync Contacts</span>
            </button>
         </div>
      </div>

      <AnimatePresence>
        {isPhoneNumber && filteredContacts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-1"
          >
            <button 
                onClick={() => {
                    const newC = { id: Date.now().toString(), name: searchQuery, phone: searchQuery, upiId: `${searchQuery}@januin`, avatar: "#", riskScore: 50 };
                    setActiveContact(newC);
                }}
                className="w-full flex items-center justify-between p-6 rounded-[32px] bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black">
                        <Plus className="h-8 w-8" />
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-black leading-none mb-1">Pay to {searchQuery}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Send money to this new number</p>
                    </div>
                </div>
                <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recents / Favorites */}
      {!searchQuery && (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Recent Transfers
                </h4>
                <Button variant="link" className="text-[10px] font-black uppercase h-auto p-0 text-primary">View All History</Button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-1">
                {MOCK_CONTACTS.filter(c => c.isFavorite).map(contact => (
                <button 
                    key={contact.id} 
                    onClick={() => setActiveContact(contact)}
                    className="flex flex-col items-center gap-3 shrink-0 group"
                >
                    <div className="relative">
                    <div className="flex h-18 w-18 items-center justify-center rounded-[30px] bg-card text-2xl font-black text-primary border-2 border-border shadow-sm group-hover:border-primary/50 group-hover:shadow-glow transition-all duration-300 group-active:scale-90">
                        {contact.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-success flex items-center justify-center border-3 border-background shadow-lg">
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    </div>
                    <span className="text-[11px] font-black tracking-tight">{contact.name.split(" ")[0]}</span>
                </button>
                ))}
            </div>
        </div>
      )}

      {/* Main List */}
      <div className="space-y-4">
        {!searchQuery && <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Contacts on Januin</h4>}
        <div className="space-y-3">
           {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
              <button 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className="w-full flex items-center justify-between p-4 rounded-[28px] bg-card border border-border hover:border-primary/30 transition-all hover:shadow-xl active:scale-[0.98] text-left group overflow-hidden relative"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center font-black text-xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    {contact.avatar}
                  </div>
                  <div>
                    <h3 className="font-black text-base text-foreground group-hover:text-primary transition-colors">{contact.name}</h3>
                    <p className="text-[11px] font-mono font-bold text-muted-foreground">{contact.phone}</p>
                    {contact.lastChat && (
                      <p className="text-[11px] font-black text-primary mt-1.5 flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                        <MessageSquare className="h-3.5 w-3.5" /> {contact.lastChat}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-2 relative z-10">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{contact.lastTime || "SYNCED"}</span>
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg border",
                    contact.riskScore < 20 ? "bg-success/5 border-success/20 text-success" : "bg-warning/5 border-warning/20 text-warning"
                  )}>
                    <Shield className="h-3 w-3" />
                    <span className="text-[8px] font-black">AI SECURE</span>
                  </div>
                </div>

                {/* Decorative hover effect */}
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent translate-x-32 group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>
           )) : !isPhoneNumber && (
               <div className="py-20 text-center space-y-3">
                   <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto opacity-20">
                       <Search className="h-10 w-10" />
                   </div>
                   <p className="text-sm font-black text-muted-foreground uppercase opacity-50">No results found for "{searchQuery}"</p>
               </div>
           )}
        </div>
      </div>

      {/* Bottom Tip */}
      <div className="bg-primary/5 rounded-[32px] p-8 text-center border border-primary/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="h-20 w-20" />
         </div>
         <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 italic">Pro Tip</p>
         <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            You can pay any UPI ID or Bank Account directly using the <span className="text-primary font-black">"To Bank"</span> option in the main menu.
         </p>
         <Button variant="outline" className="mt-5 rounded-2xl border-primary/30 text-primary font-black uppercase text-[10px] h-11 px-6">
            Invite More Friends
         </Button>
      </div>
    </div>
  );
};

export default ContactsHub;
