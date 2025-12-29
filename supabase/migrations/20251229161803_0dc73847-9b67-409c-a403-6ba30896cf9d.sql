-- Drop the existing public read policy on marketing_data
DROP POLICY IF EXISTS "Allow public read access" ON public.marketing_data;

-- Create new policy that only allows authenticated users to read marketing data
CREATE POLICY "Allow authenticated read access" 
ON public.marketing_data 
FOR SELECT 
TO authenticated
USING (true);

-- Also fix sync_log while we're at it (same issue)
DROP POLICY IF EXISTS "Allow public read access" ON public.sync_log;

-- Create new policy that only allows authenticated users to read sync logs
CREATE POLICY "Allow authenticated read access" 
ON public.sync_log 
FOR SELECT 
TO authenticated
USING (true);