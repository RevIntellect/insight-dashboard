/*
  # Google Analytics 4 Integration Schema

  1. New Tables
    - `ga4_credentials`
      - `id` (uuid, primary key)
      - `property_id` (text) - GA4 Property ID
      - `credentials` (jsonb) - Encrypted OAuth credentials
      - `refresh_token` (text) - OAuth refresh token
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ga4_metrics`
      - `id` (uuid, primary key)
      - `date` (date) - Date of metrics
      - `sessions` (integer)
      - `users` (integer)
      - `new_users` (integer)
      - `pageviews` (integer)
      - `bounce_rate` (decimal)
      - `avg_session_duration` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ga4_traffic_sources`
      - `id` (uuid, primary key)
      - `date` (date)
      - `source` (text) - Traffic source name
      - `medium` (text) - Traffic medium
      - `sessions` (integer)
      - `users` (integer)
      - `conversions` (integer)
      - `created_at` (timestamptz)
    
    - `ga4_page_performance`
      - `id` (uuid, primary key)
      - `date` (date)
      - `page_path` (text)
      - `page_title` (text)
      - `pageviews` (integer)
      - `unique_pageviews` (integer)
      - `avg_time_on_page` (decimal)
      - `bounce_rate` (decimal)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Restrict credential updates to service role only
*/

-- GA4 Credentials Table
CREATE TABLE IF NOT EXISTS ga4_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id text UNIQUE NOT NULL,
  credentials jsonb NOT NULL,
  refresh_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ga4_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read GA4 credentials"
  ON ga4_credentials FOR SELECT
  TO authenticated
  USING (true);

-- GA4 Metrics Table
CREATE TABLE IF NOT EXISTS ga4_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  sessions integer DEFAULT 0,
  users integer DEFAULT 0,
  new_users integer DEFAULT 0,
  pageviews integer DEFAULT 0,
  bounce_rate decimal(5,2) DEFAULT 0,
  avg_session_duration decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date)
);

ALTER TABLE ga4_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read GA4 metrics"
  ON ga4_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert GA4 metrics"
  ON ga4_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update GA4 metrics"
  ON ga4_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- GA4 Traffic Sources Table
CREATE TABLE IF NOT EXISTS ga4_traffic_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  source text NOT NULL,
  medium text NOT NULL,
  sessions integer DEFAULT 0,
  users integer DEFAULT 0,
  conversions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, source, medium)
);

ALTER TABLE ga4_traffic_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read GA4 traffic sources"
  ON ga4_traffic_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert GA4 traffic sources"
  ON ga4_traffic_sources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update GA4 traffic sources"
  ON ga4_traffic_sources FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- GA4 Page Performance Table
CREATE TABLE IF NOT EXISTS ga4_page_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  page_path text NOT NULL,
  page_title text DEFAULT '',
  pageviews integer DEFAULT 0,
  unique_pageviews integer DEFAULT 0,
  avg_time_on_page decimal(10,2) DEFAULT 0,
  bounce_rate decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, page_path)
);

ALTER TABLE ga4_page_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read GA4 page performance"
  ON ga4_page_performance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert GA4 page performance"
  ON ga4_page_performance FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update GA4 page performance"
  ON ga4_page_performance FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ga4_metrics_date ON ga4_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_ga4_traffic_sources_date ON ga4_traffic_sources(date DESC);
CREATE INDEX IF NOT EXISTS idx_ga4_page_performance_date ON ga4_page_performance(date DESC);
CREATE INDEX IF NOT EXISTS idx_ga4_page_performance_pageviews ON ga4_page_performance(pageviews DESC);