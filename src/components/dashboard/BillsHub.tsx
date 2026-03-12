import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Smartphone, Globe, Flame, Droplets, ChevronRight, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockBills } from "@/lib/mockData";
import { toast } from "sonner";

const categoryIcons = {
    electricity: <Zap className="h-5 w-5" />,
    water: <Droplets className="h-5 w-5" />,
    gas: <Flame className="h-5 w-5" />,
    recharge: <Smartphone className="h-5 w-5" />,
    broadband: <Globe className="h-5 w-5" />,
};

const categoryColors = {
    electricity: "bg-warning/10 text-warning",
    water: "bg-blue-500/10 text-blue-500",
    gas: "bg-orange-600/10 text-orange-600",
    recharge: "bg-purple-500/10 text-purple-500",
    broadband: "bg-indigo-500/10 text-indigo-500",
};

const BillsHub = () => {
    const [search, setSearch] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<any>(null);

    const filteredProviders = mockBills.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {!selectedProvider ? (
                <>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search biller or enter consumer ID..."
                            className="pl-10"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Featured Biller Categories */}
                    <div className="grid grid-cols-4 gap-4">
                        {Object.keys(categoryIcons).map((cat) => (
                            <button key={cat} className="group flex flex-col items-center gap-2">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:scale-110 shadow-sm ${categoryColors[cat as keyof typeof categoryColors]}`}>
                                    {categoryIcons[cat as keyof typeof categoryIcons]}
                                </div>
                                <span className="text-[10px] font-bold capitalize text-muted-foreground">{cat}</span>
                            </button>
                        ))}
                    </div>

                    {/* Biller List */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Recent Billers</h3>
                        {filteredProviders.map(provider => (
                            <motion.div
                                key={provider.id}
                                whileHover={{ x: 5 }}
                                onClick={() => setSelectedProvider(provider)}
                                className="flex cursor-pointer items-center justify-between rounded-xl border bg-card p-4 transition-all hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryColors[provider.category]}`}>
                                        {categoryIcons[provider.category]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{provider.name}</p>
                                        <p className="text-[10px] text-muted-foreground capitalize">{provider.category}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <Button variant="ghost" className="h-8 px-2 text-xs" onClick={() => setSelectedProvider(null)}>
                        ← Back to Billers
                    </Button>

                    <div className="rounded-2xl border bg-card p-6 shadow-card">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${categoryColors[selectedProvider.category]}`}>
                                {categoryIcons[selectedProvider.category]}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{selectedProvider.name}</h3>
                                <p className="text-xs text-muted-foreground">Pending for March 2024</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-xl bg-muted p-4">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Bill Amount</span>
                                    <span>Consumer: 12884920</span>
                                </div>
                                <div className="text-2xl font-black font-mono text-primary">$156.40</div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl bg-success/10 p-3 text-xs text-success font-medium">
                                <AlertTriangle className="h-4 w-4 mt-0.5" />
                                <span>AI Guardian: This bill matches your historical spending pattern. No suspicious activity found.</span>
                            </div>

                            <Button className="w-full gradient-primary" onClick={() => { toast.success("Bill paid successfully!"); setSelectedProvider(null); }}>
                                Pay Now
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BillsHub;
