# Gumloop + Google Analytics 4 Setup Guide

## Overview
This guide will help you connect your Google Analytics 4 data through Gumloop to the reLink Medical Marketing Analytics Dashboard. Since you already have GA4 connected in Gumloop, this integration will be straightforward.

---

## Prerequisites
- Gumloop account with Google Analytics already connected
- Gumloop API key
- Your GA4 Property ID
- (Optional) Gumloop Workflow ID for custom GA4 data workflows

---

## Step 1: Get Your Gumloop API Key

1. Log into your [Gumloop account](https://app.gumloop.com/)
2. Navigate to **Settings** or **API Keys**
3. Generate a new API key or copy your existing key
4. Keep this key secure - you'll need it in Step 3

---

## Step 2: Find Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Admin** (gear icon)
4. Under "Property" column, click **Property Settings**
5. Your Property ID is displayed at the top (format: 123456789)

---

## Step 3: Configure the Integration

Open your browser console (F12) while on your dashboard and run:

```javascript
import { ga4Service } from '@/services/ga4Service';

// Configure Gumloop integration
await ga4Service.saveGumloopConfig(
  'YOUR_GUMLOOP_API_KEY',
  'YOUR_GA4_PROPERTY_ID',
  'YOUR_WORKFLOW_ID' // Optional - only if you have a specific GA4 workflow
);
```

Example:
```javascript
await ga4Service.saveGumloopConfig(
  'gl_1234567890abcdef',
  '123456789',
  'wf_abc123' // Optional
);
```

---

## Step 4: Create Gumloop Workflows (If Not Already Created)

If you don't have pre-existing workflows for GA4 data, create these in Gumloop:

### Workflow 1: GA4 Metrics
**Purpose:** Fetch daily metrics (sessions, users, pageviews, etc.)

**Steps:**
1. Trigger: API or Schedule
2. Google Analytics Node:
   - Report Type: Basic Metrics
   - Dimensions: Date
   - Metrics: sessions, users, newUsers, pageviews, bounceRate, avgSessionDuration
3. Output: Return data as JSON

### Workflow 2: Traffic Sources
**Purpose:** Fetch traffic source data

**Steps:**
1. Trigger: API or Schedule
2. Google Analytics Node:
   - Report Type: Traffic Sources
   - Dimensions: Date, Source, Medium
   - Metrics: sessions, users, conversions
3. Output: Return data as JSON

### Workflow 3: Page Performance
**Purpose:** Fetch page-level metrics

**Steps:**
1. Trigger: API or Schedule
2. Google Analytics Node:
   - Report Type: Pages
   - Dimensions: Date, Page Path, Page Title
   - Metrics: pageviews, avgTimeOnPage, bounceRate
3. Output: Return data as JSON

---

## Step 5: Sync Your Data

1. Navigate to the **Website Traffic Dashboard** in your analytics app
2. Click the **Sync Data** button
3. The system will:
   - Call your Gumloop workflows
   - Fetch GA4 data through Gumloop
   - Store it in your Supabase database
   - Display it in your dashboard

---

## Data Format Requirements

Gumloop should return data in this format:

```json
{
  "data": [
    {
      "date": "2024-01-01",
      "sessions": 1500,
      "users": 1200,
      "newUsers": 800,
      "pageviews": 4500,
      "bounceRate": 45.5,
      "avgSessionDuration": 180
    },
    {
      "date": "2024-01-02",
      "sessions": 1600,
      "users": 1300,
      ...
    }
  ]
}
```

The integration is flexible and supports various naming conventions:
- Case-insensitive field names
- Snake_case or camelCase
- Alternative field names (e.g., `totalUsers` or `users`)

---

## Automated Syncing

### Option 1: Schedule in Gumloop
Set up scheduled workflows in Gumloop to run daily:
1. Edit your GA4 workflows
2. Add a Schedule trigger (e.g., daily at 6 AM)
3. Add a Webhook action to call your dashboard's sync endpoint

### Option 2: Dashboard Auto-Sync
The dashboard automatically refreshes data every 5 minutes from the local database. Use the manual "Sync Data" button to pull fresh data from Gumloop.

---

## Troubleshooting

### "Gumloop configuration not found"
- Make sure you've completed Step 3
- Verify your API key is correct
- Check the browser console for any errors

### "Gumloop API error: 401"
- Your API key may be invalid or expired
- Generate a new API key in Gumloop
- Re-run the configuration in Step 3

### "Gumloop API error: 404"
- Your Workflow ID may be incorrect
- Verify the workflow exists in Gumloop
- Try omitting the workflow_id parameter

### No Data Showing
- Check that your Gumloop workflows are configured correctly
- Verify your GA4 property has data for the selected date range
- Check the Gumloop workflow run history for errors
- Ensure the data format matches the requirements above

### Data Format Issues
The integration supports multiple naming conventions:
- `sessions` / `Sessions` / `SESSIONS`
- `totalUsers` / `users` / `Users`
- `newUsers` / `new_users` / `NewUsers`
- `pageviews` / `Pageviews` / `screenPageViews`
- `bounceRate` / `bounce_rate` / `BounceRate`
- `avgSessionDuration` / `avg_session_duration` / `averageSessionDuration`

---

## Benefits of Gumloop Integration

1. **Simplified OAuth**: No need to manage OAuth tokens yourself
2. **Pre-built Connectors**: Leverage Gumloop's GA4 integration
3. **Workflow Automation**: Combine GA4 data with other data sources
4. **Error Handling**: Gumloop handles API rate limits and errors
5. **Visual Workflow Builder**: Easily modify data transformations

---

## Security Notes

- Your Gumloop API key is stored encrypted in Supabase
- Only authenticated users can access your GA4 data
- The Edge Function uses server-to-server communication
- Never commit API keys to your code repository

---

## Next Steps

Once Gumloop integration is configured:
1. Explore the Website Traffic Dashboard with real data
2. Set up additional data sources (Google Ads, LinkedIn, etc.)
3. Create custom Gumloop workflows for advanced analytics
4. Configure alerts for significant metric changes

---

## Advanced: Custom Workflows

You can create custom Gumloop workflows that:
- Combine GA4 data with CRM data
- Apply custom calculations or transformations
- Filter data before sending to your dashboard
- Enrich GA4 data with external sources

Simply ensure your workflow outputs data in the expected format, and the integration will handle it automatically.

---

## Support

For questions about this integration:
- Gumloop-specific issues: [Gumloop Support](https://gumloop.com/support)
- Dashboard integration: Contact your development team

*Document generated for reLink Medical Marketing Analytics Dashboard - Gumloop Integration*
