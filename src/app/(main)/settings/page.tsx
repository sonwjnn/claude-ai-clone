'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth/auth-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Settings,
  Key,
  Sparkles,
  Save,
  Upload,
  Trash2,
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [customInstructions, setCustomInstructions] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-4xl p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-600 text-white text-2xl">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={session?.user?.name || ''}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={session?.user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <Badge variant="secondary">Free Plan</Badge>
                  </div>
                </div>

                <Separator />

                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">AI Preferences</h3>

                {/* Custom Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="custom-instructions">
                    Custom Instructions
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Beta
                    </Badge>
                  </Label>
                  <Textarea
                    id="custom-instructions"
                    placeholder="Tell Claude how you'd like it to respond. For example: 'Always explain technical concepts simply' or 'Be concise and direct in your answers.'"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    These instructions will be included in every conversation
                  </p>
                </div>

                <Separator />

                {/* Default Model */}
                <div className="space-y-2">
                  <Label htmlFor="default-model">Default Model</Label>
                  <select
                    id="default-model"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>Claude 3.5 Sonnet</option>
                    <option>Claude 3 Opus</option>
                    <option>Claude 3 Sonnet</option>
                    <option>Claude 3 Haiku</option>
                  </select>
                </div>

                {/* Response Length */}
                <div className="space-y-2">
                  <Label htmlFor="response-length">Response Length</Label>
                  <select
                    id="response-length"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option>Automatic</option>
                    <option>Concise</option>
                    <option>Detailed</option>
                  </select>
                </div>

                <Separator />

                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">API Keys</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your API keys for external integrations
                    </p>
                  </div>
                  <Button className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate New Key
                  </Button>
                </div>

                <Separator />

                {/* API Key Input */}
                <div className="space-y-2">
                  <Label htmlFor="api-key">Your API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey || 'sk-...'}
                      placeholder="No API key generated"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep your API key secure and never share it publicly
                  </p>
                </div>

                {/* Usage Stats */}
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-semibold">API Usage This Month</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Requests</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tokens</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost</div>
                      <div className="text-2xl font-bold">$0.00</div>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-lg border border-destructive/50 p-4 space-y-2">
                  <h4 className="font-semibold text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    Revoking your API key will immediately disable all applications using it
                  </p>
                  <Button variant="destructive" size="sm">
                    Revoke API Key
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
