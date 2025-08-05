'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your application settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                        Enable or disable the dark theme for the application.
                    </p>
                </div>
                <Switch
                    id="dark-mode"
                    aria-label="Toggle dark mode"
                    disabled // Add logic here later
                />
            </div>

            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                       Receive updates and reminders via email.
                    </p>
                </div>
                <Switch
                    id="notifications"
                    aria-label="Toggle email notifications"
                    disabled // Add logic here later
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
