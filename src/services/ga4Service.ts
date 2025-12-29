import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

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
  private async callEdgeFunction(payload: Record<string, unknown>) {
    const { data: { session } } = await supabase.auth.getSession();
    const functionUrl = USE_GUMLOOP ? GUMLOOP_FUNCTION_URL : GA4_FUNCTION_URL;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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

  private parseJsonData<T>(data: Json): T | null {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      return data as unknown as T;
    }
    return null;
  }

  async getMetrics(startDate?: string, endDate?: string): Promise<GA4Metrics[]> {
    let query = supabase
      .from('marketing_data')
      .select('*')
      .eq('source', 'ga4')
      .eq('metric_type', 'metrics')
      .order('synced_at', { ascending: false });

    if (startDate) {
      query = query.gte('date_range_start', startDate);
    }
    if (endDate) {
      query = query.lte('date_range_end', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Parse the JSON data from marketing_data table
    const metrics: GA4Metrics[] = [];
    if (data) {
      for (const row of data) {
        const parsed = this.parseJsonData<GA4Metrics>(row.data);
        if (parsed) {
          metrics.push(parsed);
        }
      }
    }
    return metrics;
  }

  async getTrafficSources(startDate?: string, endDate?: string): Promise<GA4TrafficSource[]> {
    let query = supabase
      .from('marketing_data')
      .select('*')
      .eq('source', 'ga4')
      .eq('metric_type', 'traffic_sources')
      .order('synced_at', { ascending: false });

    if (startDate) {
      query = query.gte('date_range_start', startDate);
    }
    if (endDate) {
      query = query.lte('date_range_end', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    const sources: GA4TrafficSource[] = [];
    if (data) {
      for (const row of data) {
        const parsed = this.parseJsonData<GA4TrafficSource>(row.data);
        if (parsed) {
          sources.push(parsed);
        }
      }
    }
    return sources;
  }

  async getPagePerformance(startDate?: string, endDate?: string, limit?: number): Promise<GA4PagePerformance[]> {
    let query = supabase
      .from('marketing_data')
      .select('*')
      .eq('source', 'ga4')
      .eq('metric_type', 'page_performance')
      .order('synced_at', { ascending: false });

    if (startDate) {
      query = query.gte('date_range_start', startDate);
    }
    if (endDate) {
      query = query.lte('date_range_end', endDate);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    const pages: GA4PagePerformance[] = [];
    if (data) {
      for (const row of data) {
        const parsed = this.parseJsonData<GA4PagePerformance>(row.data);
        if (parsed) {
          pages.push(parsed);
        }
      }
    }
    return pages;
  }

  async getCredentials(): Promise<GA4Credentials | null> {
    const { data, error } = await supabase
      .from('marketing_data')
      .select('*')
      .eq('source', 'ga4')
      .eq('metric_type', 'credentials')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    
    return this.parseJsonData<GA4Credentials>(data.data);
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
