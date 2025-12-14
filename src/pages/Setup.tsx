import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ga4Service } from '@/services/ga4Service';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const Setup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const apiKey = import.meta.env.VITE_GUMLOOP_API_KEY;
  const propertyId = import.meta.env.VITE_GA4_PROPERTY_ID;

  const handleSaveConfig = async () => {
    if (!apiKey || !propertyId) {
      toast.error('Missing configuration. Please check your .env file.');
      return;
    }

    setIsSaving(true);
    try {
      await ga4Service.saveGumloopConfig(apiKey, propertyId);
      setIsConfigured(true);
      toast.success('Configuration saved successfully!');
    } catch (error: any) {
      console.error('Failed to save config:', error);
      toast.error(error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSync = async () => {
    if (!propertyId) {
      toast.error('Missing GA4 Property ID');
      return;
    }

    setIsLoading(true);
    setSyncStatus('syncing');

    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await ga4Service.fetchMetrics(propertyId, startDate, endDate);

      setSyncStatus('success');
      toast.success('Data synced successfully! Check your dashboards.');
    } catch (error: any) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      toast.error(error.message || 'Failed to sync data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Gumloop Setup</h1>
          <p className="text-muted-foreground">
            Configure your Gumloop integration with Google Analytics 4
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Save Configuration</CardTitle>
            <CardDescription>
              Your API key and Property ID are loaded from environment variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Gumloop API Key</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">GA4 Property ID</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {propertyId || 'Not set'}
                </span>
              </div>
            </div>

            <Button
              onClick={handleSaveConfig}
              disabled={isSaving || isConfigured || !apiKey || !propertyId}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isConfigured ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Configuration Saved
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Test Data Sync</CardTitle>
            <CardDescription>
              Sync data from GA4 through Gumloop (last 30 days)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Data synced successfully! You can now view your dashboards.
                </span>
              </div>
            )}

            {syncStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Sync failed. Check the console for details.
                </span>
              </div>
            )}

            <Button
              onClick={handleTestSync}
              disabled={!isConfigured || isLoading}
              className="w-full"
              variant="secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing Data...
                </>
              ) : (
                'Test Sync'
              )}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>This will:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Call your Gumloop workflow</li>
                <li>Fetch GA4 metrics for the last 30 days</li>
                <li>Store data in your Supabase database</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {syncStatus === 'success' && (
          <div className="text-center">
            <Button onClick={() => window.location.href = '/'} size="lg">
              View Dashboards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;
