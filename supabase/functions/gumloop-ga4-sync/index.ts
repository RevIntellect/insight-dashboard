import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GumloopConfig {
  api_key: string;
  workflow_id?: string;
  property_id: string;
}

interface GumloopRequest {
  action: 'save-config' | 'fetch-metrics' | 'fetch-traffic' | 'fetch-pages' | 'sync-all';
  config?: GumloopConfig;
  startDate?: string;
  endDate?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, config, startDate, endDate }: GumloopRequest = await req.json();

    switch (action) {
      case 'save-config': {
        if (!config || !config.api_key || !config.property_id) {
          throw new Error('Missing required config: api_key and property_id');
        }

        const { data, error } = await supabase
          .from('ga4_credentials')
          .upsert({
            property_id: config.property_id,
            credentials: {
              gumloop_api_key: config.api_key,
              workflow_id: config.workflow_id,
              source: 'gumloop',
            },
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, data }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      case 'fetch-metrics': {
        const { data: configData, error: configError } = await supabase
          .from('ga4_credentials')
          .select('*')
          .maybeSingle();

        if (configError || !configData) {
          throw new Error('Gumloop configuration not found. Please configure your Gumloop API key first.');
        }

        const gumloopApiKey = configData.credentials.gumloop_api_key;
        const workflowId = configData.credentials.workflow_id;

        const gumloopResponse = await fetch(
          `https://api.gumloop.com/api/v1/flows/${workflowId}/run`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${gumloopApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start_date: startDate || '30daysAgo',
              end_date: endDate || 'today',
              metrics: ['sessions', 'users', 'newUsers', 'pageviews', 'bounceRate', 'avgSessionDuration'],
            }),
          }
        );

        if (!gumloopResponse.ok) {
          const errorText = await gumloopResponse.text();
          throw new Error(`Gumloop API error: ${gumloopResponse.status} - ${errorText}`);
        }

        const gumloopData = await gumloopResponse.json();

        let processedCount = 0;

        if (gumloopData.data && Array.isArray(gumloopData.data)) {
          for (const row of gumloopData.data) {
            const formattedDate = row.date || row.Date || row.DATE;

            await supabase.from('ga4_metrics').upsert({
              date: formattedDate,
              sessions: parseInt(row.sessions || row.Sessions || 0),
              users: parseInt(row.users || row.Users || row.totalUsers || 0),
              new_users: parseInt(row.newUsers || row.new_users || row.NewUsers || 0),
              pageviews: parseInt(row.pageviews || row.Pageviews || row.screenPageViews || 0),
              bounce_rate: parseFloat(row.bounceRate || row.bounce_rate || row.BounceRate || 0),
              avg_session_duration: parseFloat(row.avgSessionDuration || row.avg_session_duration || row.averageSessionDuration || 0),
              updated_at: new Date().toISOString(),
            });
            processedCount++;
          }
        }

        return new Response(
          JSON.stringify({ success: true, rowCount: processedCount }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      case 'fetch-traffic': {
        const { data: configData, error: configError } = await supabase
          .from('ga4_credentials')
          .select('*')
          .maybeSingle();

        if (configError || !configData) {
          throw new Error('Gumloop configuration not found');
        }

        const gumloopApiKey = configData.credentials.gumloop_api_key;
        const workflowId = configData.credentials.workflow_id;

        const gumloopResponse = await fetch(
          `https://api.gumloop.com/api/v1/flows/${workflowId}/run`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${gumloopApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start_date: startDate || '30daysAgo',
              end_date: endDate || 'today',
              report_type: 'traffic_sources',
              dimensions: ['date', 'source', 'medium'],
              metrics: ['sessions', 'users', 'conversions'],
            }),
          }
        );

        if (!gumloopResponse.ok) {
          const errorText = await gumloopResponse.text();
          throw new Error(`Gumloop API error: ${gumloopResponse.status} - ${errorText}`);
        }

        const gumloopData = await gumloopResponse.json();
        let processedCount = 0;

        if (gumloopData.data && Array.isArray(gumloopData.data)) {
          for (const row of gumloopData.data) {
            const formattedDate = row.date || row.Date;
            const source = row.source || row.Source || 'direct';
            const medium = row.medium || row.Medium || 'none';

            await supabase.from('ga4_traffic_sources').upsert({
              date: formattedDate,
              source: source,
              medium: medium,
              sessions: parseInt(row.sessions || row.Sessions || 0),
              users: parseInt(row.users || row.Users || 0),
              conversions: parseInt(row.conversions || row.Conversions || 0),
            });
            processedCount++;
          }
        }

        return new Response(
          JSON.stringify({ success: true, rowCount: processedCount }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      case 'fetch-pages': {
        const { data: configData, error: configError } = await supabase
          .from('ga4_credentials')
          .select('*')
          .maybeSingle();

        if (configError || !configData) {
          throw new Error('Gumloop configuration not found');
        }

        const gumloopApiKey = configData.credentials.gumloop_api_key;
        const workflowId = configData.credentials.workflow_id;

        const gumloopResponse = await fetch(
          `https://api.gumloop.com/api/v1/flows/${workflowId}/run`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${gumloopApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start_date: startDate || '30daysAgo',
              end_date: endDate || 'today',
              report_type: 'pages',
              dimensions: ['date', 'pagePath', 'pageTitle'],
              metrics: ['pageviews', 'avgTimeOnPage', 'bounceRate'],
            }),
          }
        );

        if (!gumloopResponse.ok) {
          const errorText = await gumloopResponse.text();
          throw new Error(`Gumloop API error: ${gumloopResponse.status} - ${errorText}`);
        }

        const gumloopData = await gumloopResponse.json();
        let processedCount = 0;

        if (gumloopData.data && Array.isArray(gumloopData.data)) {
          for (const row of gumloopData.data) {
            const formattedDate = row.date || row.Date;
            const pagePath = row.pagePath || row.page_path || row.PagePath;
            const pageTitle = row.pageTitle || row.page_title || row.PageTitle || '';

            await supabase.from('ga4_page_performance').upsert({
              date: formattedDate,
              page_path: pagePath,
              page_title: pageTitle,
              pageviews: parseInt(row.pageviews || row.Pageviews || 0),
              unique_pageviews: parseInt(row.uniquePageviews || row.unique_pageviews || row.pageviews || 0),
              avg_time_on_page: parseFloat(row.avgTimeOnPage || row.avg_time_on_page || 0),
              bounce_rate: parseFloat(row.bounceRate || row.bounce_rate || 0),
            });
            processedCount++;
          }
        }

        return new Response(
          JSON.stringify({ success: true, rowCount: processedCount }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      case 'sync-all': {
        const metricsResult = await fetch(req.url, {
          method: 'POST',
          headers: req.headers,
          body: JSON.stringify({ action: 'fetch-metrics', startDate, endDate }),
        });

        return new Response(
          JSON.stringify({ success: true, message: 'Sync initiated' }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error: unknown) {
    console.error('Gumloop GA4 Sync Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});