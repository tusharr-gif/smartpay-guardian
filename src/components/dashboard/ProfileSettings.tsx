import { useApp } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProfileSettings = () => {
  const { currentUser } = useApp();
  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground">
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="text-lg font-bold">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={currentUser.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={currentUser.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue={currentUser.phone} placeholder="+1 (555) 000-0000" />
          </div>
          <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.success("Profile updated!")}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <h3 className="text-lg font-bold">Account Info</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Account ID</span><span className="font-mono">{currentUser.id}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Member Since</span><span>{currentUser.createdAt}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Account Type</span><span>{currentUser.isAdmin ? "Administrator" : "Standard"}</span></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
