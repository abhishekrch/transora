import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Button } from "@transora/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@transora/ui/components/card";
import { ProfileForm } from "./ProfileForm";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <ProfileForm />
      <QuickLinks />
    </div>
  );
}

function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Change Password</p>
            <p className="text-xs text-muted-foreground">
              Update your account password.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings/security">Change</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
