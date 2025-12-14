import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GA4Credentials {
  access_token: string;
  refresh_token?: string;
  property_id: string;
}

interface GA4Request {
  action: 'fetch-metrics' | 'fetch-traffic' | 'fetch-pages' | 'save-credentials';
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  credentials?: GA4Credentials;
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

    const { action, propertyId, startDate, endDate, credentials }: GA4Request = await req.json();

    switch (action) {
      case 'save-credentials': {
        if (!credentials || !credentials.property_id) {
          throw new Error('Missing credentials or property_id');
        }

        const { data, error } = await supabase
          .from('ga4_credentials')
          .upsert({
            property_id: credentials.property_id,
            credentials: credentials,
            refresh_token: credentials.refresh_token,
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
        if (!propertyId) {
          throw new Error('Missing propertyId');
        }

        const { data: credData, error: credError } = await supabase
          .from('ga4_credentials')
          .select('*')
          .eq('property_id', propertyId)
          .maybeSingle();

        if (credError || !credData) {
          throw new Error('GA4 credentials not found. Please configure your Google Analytics connection first.');
        }

        const accessToken = credData.credentials.access_token;

        const response = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dateRanges: [{
                startDate: startDate || '30daysAgo',
                endDate: endDate || 'today',
              }],
              dimensions: [{ name: 'date' }],
              metrics: [
                { name: 'sessions' },
                { name: 'totalUsers' },
                { name: 'newUsers' },
                { name: 'screenPageViews' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' },
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`GA4 API error: ${response.status} - ${errorText}`);
        }

        const gaData = await response.json();

        if (gaData.rows) {
          for (const row of gaData.rows) {
            const dateValue = row.dimensionValues[0].value;
            const formattedDate = `${dateValue.slice(0, 4)}-${dateValue.slice(4, 6)}-${dateValue.slice(6, 8)}`;

            await supabase.from('ga4_metrics').upsert({
              date: formattedDate,
              sessions: parseInt(row.metricValues[0].value) || 0,
              users: parseInt(row.metricValues[1].value) || 0,
              new_users: parseInt(row.metricValues[2].value) || 0,
              pageviews: parseInt(row.metricValues[3].value) || 0,
              bounce_rate: parseFloat(row.metricValues[4].value) || 0,
              avg_session_duration: parseFloat(row.metricValues[5].value) || 0,
              updated_at: new Date().toISOString(),
            });
          }
        }

        return new Response(
          JSON.stringify({ success: true, rowCount: gaData.rows?.length || 0 }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      case 'fetch-traffic': {
        if (!propertyId) {
          throw new Error('Missing propertyId');
        }

        const { data: credData, error: credError } = await supabase
          .from('ga4_credentials')
          .select('*')
          .eq('property_id', propertyId)
          .maybeSingle();

        if (credError || !credData) {
          throw new Error('GA4 credentials not found');
        }

        const accessToken = credData.credentials.access_token;

        const response = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dateRanges: [{
                startDate: startDate || '30daysAgo',
                endDate: endDate || 'today',
              }],
              dimensions: [
                { name: 'date' },
                { name: 'sessionSource' },
                { name: 'sessionMedium' },
              ],
              metrics: [
                { name: 'sessions' },
                { name: 'totalUsers' },
                { name: 'conversions' },
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`GA4 API error: ${response.status} - ${errorText}`);
        }

        const gaData = await response.json();

        if (gaData.rows) {
          for (const row of gaData.rows) {
            const dateValue = row.dimensionValues[0].value;
            const formattedDate = `${dateValue.slice(0, 4)}-${dateValue.slice(4, 6)}-${dateValue.slice(6, 8)}`;
            const source = row.dimensionValues[1].value || 'direct';
            const medium = row.dimensionValues[2].value || 'none';

            await supabase.from('ga4_traffic_sources').upsert({
              date: formattedDate,
              source: source,
              medium: medium,
              sessions: parseInt(row.metricValues[0].value) || 0,
              users: parseInt(row.metricValues[1].value) || 0,
              conversions: parseInt(row.metricValues[2].value) || 0,
            });
          }
        }

        return new Response(
          JSON.stringify({ success: true, rowCount: gaData.rows?.length || 0 }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      case 'fetch-pages': {
        if (!propertyId) {
          throw new Error('Missing propertyId');
        }

        const { data: credData, error: credError } = await supabase
          .from('ga4_credentials')
          .select('*')
          .eq('property_id', propertyId)
          .maybeSingle();

        if (credError || !credData) {
          throw new Error('GA4 credentials not found');
        }

        const accessToken = credData.credentials.access_token;

        const response = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dateRanges: [{
                startDate: startDate || '30daysAgo',
                endDate: endDate || 'today',
              }],
              dimensions: [
                { name: 'date' },
                { name: 'pagePath' },
                { name: 'pageTitle' },
              ],
              metrics: [
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`GA4 API error: ${response.status} - ${errorText}`);
        }

        const gaData = await response.json();

        if (gaData.rows) {
          for (const row of gaData.rows) {
            const dateValue = row.dimensionValues[0].value;
            const formattedDate = `${dateValue.slice(0, 4)}-${dateValue.slice(4, 6)}-${dateValue.slice(6, 8)}`;
            const pagePath = row.dimensionValues[1].value;
            const pageTitle = row.dimensionValues[2].value || '';

            await supabase.from('ga4_page_performance').upsert({
              date: formattedDate,
              page_path: pagePath,
              page_title: pageTitle,
              pageviews: parseInt(row.metricValues[0].value) || 0,
              unique_pageviews: parseInt(row.metricValues[0].value) || 0,
              avg_time_on_page: parseFloat(row.metricValues[1].value) || 0,
              bounce_rate: parseFloat(row.metricValues[2].value) || 0,
            });
          }
        }

        return new Response(
          JSON.stringify({ success: true, rowCount: gaData.rows?.length || 0 }),
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
  } catch (error) {
    console.error('GA4 Sync Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
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