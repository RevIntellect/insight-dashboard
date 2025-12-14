import { supabase } from '@/integrations/supabase/client';

export interface GA4Metrics {
  date: string;
  sessions: number;
  users: number;
  new_users: number;
  pageviews: number;
  bounce_rate: number;
  avg_session_duration: number;
}

export interface GA4TrafficSource {
  date: string;
  source: string;
  medium: string;
  sessions: number;
  users: number;
  conversions: number;
}

export interface GA4PagePerformance {
  date: string;
  page_path: string;
  page_title: string;
  pageviews: number;
  unique_pageviews: number;
  avg_time_on_page: number;
  bounce_rate: number;
}

export interface GA4Credentials {
  access_token: string;
  refresh_token?: string;
  property_id: string;
}

const GA4_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ga4-sync`;
const GUMLOOP_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gumloop-ga4-sync`;

const USE_GUMLOOP = import.meta.env.VITE_USE_GUMLOOP === 'true';

class GA4Service {
  private async callEdgeFunction(payload: any) {
    const { data: { session } } = await supabase.auth.getSession();
    const functionUrl = USE_GUMLOOP ? GUMLOOP_FUNCTION_URL : GA4_FUNCTION_URL;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sync GA4 data');
    }

    return response.json();
  }

  async saveCredentials(credentials: GA4Credentials) {
    return this.callEdgeFunction({
      action: 'save-credentials',
      credentials,
    });
  }

  async saveGumloopConfig(apiKey: string, propertyId: string, workflowId?: string) {
    return this.callEdgeFunction({
      action: 'save-config',
      config: {
        api_key: apiKey,
        property_id: propertyId,
        workflow_id: workflowId,
      },
    });
  }

  async fetchMetrics(propertyId: string, startDate?: string, endDate?: string) {
    return this.callEdgeFunction({
      action: 'fetch-metrics',
      propertyId,
      startDate,
      endDate,
    });
  }

  async fetchTrafficSources(propertyId: string, startDate?: string, endDate?: string) {
    return this.callEdgeFunction({
      action: 'fetch-traffic',
      propertyId,
      startDate,
      endDate,
    });
  }

  async fetchPagePerformance(propertyId: string, startDate?: string, endDate?: string) {
    return this.callEdgeFunction({
      action: 'fetch-pages',
      propertyId,
      startDate,
      endDate,
    });
  }

  async getMetrics(startDate?: string, endDate?: string): Promise<GA4Metrics[]> {
    let query = supabase
      .from('ga4_metrics')
      .select('*')
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getTrafficSources(startDate?: string, endDate?: string): Promise<GA4TrafficSource[]> {
    let query = supabase
      .from('ga4_traffic_sources')
      .select('*')
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getPagePerformance(startDate?: string, endDate?: string, limit?: number): Promise<GA4PagePerformance[]> {
    let query = supabase
      .from('ga4_page_performance')
      .select('*')
      .order('pageviews', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getCredentials(): Promise<GA4Credentials | null> {
    const { data, error } = await supabase
      .from('ga4_credentials')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data ? data.credentials : null;
  }

  async syncAllData(propertyId: string, startDate?: string, endDate?: string) {
    await Promise.all([
      this.fetchMetrics(propertyId, startDate, endDate),
      this.fetchTrafficSources(propertyId, startDate, endDate),
      this.fetchPagePerformance(propertyId, startDate, endDate),
    ]);
  }
}

export const ga4Service = new GA4Service();
