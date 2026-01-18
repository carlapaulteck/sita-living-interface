import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Palette,
  Mail,
  Database,
  Save,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const sections: SettingsSection[] = [
  { id: 'general', title: 'General', description: 'Basic platform settings', icon: <Globe className="w-5 h-5" /> },
  { id: 'notifications', title: 'Notifications', description: 'Email and push settings', icon: <Bell className="w-5 h-5" /> },
  { id: 'security', title: 'Security', description: 'Authentication and access', icon: <Shield className="w-5 h-5" /> },
  { id: 'appearance', title: 'Appearance', description: 'Theme and branding', icon: <Palette className="w-5 h-5" /> },
];

const AdminSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General
    platformName: 'Alpha Vision',
    supportEmail: 'support@alphavision.ai',
    maintenanceMode: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    digestFrequency: 'daily',
    
    // Security
    requireEmailVerification: true,
    sessionTimeout: '7',
    maxLoginAttempts: '5',
    twoFactorAuth: false,
    
    // Appearance
    defaultTheme: 'dark',
    allowUserThemes: true,
    primaryColor: 'cyan'
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Platform Name</Label>
        <Input
          value={settings.platformName}
          onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
          className="bg-white/5 border-white/10"
        />
      </div>
      <div className="space-y-2">
        <Label>Support Email</Label>
        <Input
          type="email"
          value={settings.supportEmail}
          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
          className="bg-white/5 border-white/10"
        />
      </div>
      <Separator className="bg-white/5" />
      <div className="flex items-center justify-between">
        <div>
          <Label>Maintenance Mode</Label>
          <p className="text-sm text-muted-foreground">Disable access for non-admin users</p>
        </div>
        <Switch
          checked={settings.maintenanceMode}
          onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Email Notifications</Label>
          <p className="text-sm text-muted-foreground">Send email alerts to users</p>
        </div>
        <Switch
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label>Push Notifications</Label>
          <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
        </div>
        <Switch
          checked={settings.pushNotifications}
          onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
        />
      </div>
      <Separator className="bg-white/5" />
      <div className="space-y-2">
        <Label>Digest Frequency</Label>
        <Select
          value={settings.digestFrequency}
          onValueChange={(value) => setSettings({ ...settings, digestFrequency: value })}
        >
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Real-time</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label>Require Email Verification</Label>
          <p className="text-sm text-muted-foreground">Users must verify email before access</p>
        </div>
        <Switch
          checked={settings.requireEmailVerification}
          onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label>Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
        </div>
        <Switch
          checked={settings.twoFactorAuth}
          onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
        />
      </div>
      <Separator className="bg-white/5" />
      <div className="space-y-2">
        <Label>Session Timeout (days)</Label>
        <Input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
          className="bg-white/5 border-white/10"
        />
      </div>
      <div className="space-y-2">
        <Label>Max Login Attempts</Label>
        <Input
          type="number"
          value={settings.maxLoginAttempts}
          onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
          className="bg-white/5 border-white/10"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Default Theme</Label>
        <Select
          value={settings.defaultTheme}
          onValueChange={(value) => setSettings({ ...settings, defaultTheme: value })}
        >
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label>Allow User Theme Preference</Label>
          <p className="text-sm text-muted-foreground">Let users choose their own theme</p>
        </div>
        <Switch
          checked={settings.allowUserThemes}
          onCheckedChange={(checked) => setSettings({ ...settings, allowUserThemes: checked })}
        />
      </div>
      <Separator className="bg-white/5" />
      <div className="space-y-2">
        <Label>Primary Accent Color</Label>
        <Select
          value={settings.primaryColor}
          onValueChange={(value) => setSettings({ ...settings, primaryColor: value })}
        >
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cyan">Cyan</SelectItem>
            <SelectItem value="purple">Purple</SelectItem>
            <SelectItem value="amber">Amber</SelectItem>
            <SelectItem value="emerald">Emerald</SelectItem>
            <SelectItem value="rose">Rose</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="bg-[#151515] border-white/5 lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {section.icon}
                  <div>
                    <p className="font-medium">{section.title}</p>
                    <p className="text-xs opacity-70">{section.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <Card className="bg-[#151515] border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {sections.find(s => s.id === activeSection)?.icon}
                {sections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <CardDescription>
                {sections.find(s => s.id === activeSection)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderActiveSection()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
