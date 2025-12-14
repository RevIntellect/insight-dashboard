# Google Analytics 4 Setup Guide

## Overview
This guide will help you connect your Google Analytics 4 property to the reLink Medical Marketing Analytics Dashboard.

## Prerequisites
- A Google Analytics 4 property
- Admin access to Google Cloud Console
- Your GA4 Property ID

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Data API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Analytics Data API"
   - Click "Enable"

---

## Step 2: Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: reLink Medical Analytics
   - Add your email as the developer contact
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: reLink GA4 Integration
   - Authorized redirect URIs: Add your application URL (e.g., `https://yourdomain.com/oauth/callback`)
5. Save the Client ID and Client Secret

---

## Step 3: Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to Admin (gear icon)
4. Under "Property" column, click "Property Settings"
5. Your Property ID is displayed at the top (format: 123456789)

---

## Step 4: Obtain Access Token

You'll need to complete the OAuth flow to get an access token and refresh token. There are two ways to do this:

### Option A: Using OAuth Playground
1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (Settings) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In the left panel, find "Google Analytics Data API v1"
6. Select `https://www.googleapis.com/auth/analytics.readonly`
7. Click "Authorize APIs"
8. Sign in with your Google account
9. Exchange authorization code for tokens
10. Copy the Access Token and Refresh Token

### Option B: Implement OAuth Flow in Your App
Create a dedicated OAuth callback page that exchanges the authorization code for tokens.

---

## Step 5: Save Credentials to Database

Use the browser console or create a setup page to save your credentials:

```javascript
// Run this in your browser console while logged into the app
const credentials = {
  access_token: 'YOUR_ACCESS_TOKEN',
  refresh_token: 'YOUR_REFRESH_TOKEN',
  property_id: 'YOUR_PROPERTY_ID'
};

const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ga4-sync`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'save-credentials',
    credentials: credentials
  })
});

const result = await response.json();
console.log('Credentials saved:', result);
```

---

## Step 6: Sync Your Data

1. Navigate to the Website Traffic Dashboard
2. Click the "Sync Data" button
3. The system will fetch the last 30 days of data from GA4
4. Data will automatically refresh every 5 minutes

---

## Troubleshooting

### "GA4 credentials not found" Error
- Make sure you've completed Step 5 and saved your credentials
- Verify the credentials were saved by checking the `ga4_credentials` table in Supabase

### "GA4 API error: 401"
- Your access token may have expired
- Use the refresh token to get a new access token
- Update the credentials in the database

### "GA4 API error: 403"
- Make sure the Google Analytics Data API is enabled in your Google Cloud project
- Verify you have access to the GA4 property with the account used for OAuth

### No Data Showing
- Check that your GA4 property has data for the selected date range
- Try syncing data for a longer time period
- Check the browser console for any errors

---

## Security Notes

- Access tokens are stored encrypted in Supabase
- Only authenticated users can access GA4 data
- The Edge Function uses server-to-server communication to protect your credentials
- Never commit credentials to your code repository

---

## Data Refresh Schedule

- **Automatic**: Data refreshes every 5 minutes in the dashboard
- **Manual**: Click "Sync Data" button to fetch latest data from GA4
- **Background**: Consider setting up a scheduled job to sync data daily

---

## Next Steps

Once GA4 is connected:
1. Explore the Website Traffic Dashboard
2. Set up additional data sources (Google Ads, LinkedIn, etc.)
3. Configure alerts for significant metric changes
4. Customize dashboards for your team's needs
