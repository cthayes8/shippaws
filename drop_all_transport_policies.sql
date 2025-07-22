-- Drop ALL existing transport_requests policies based on your current output
-- Run this first, then we can recreate clean policies

DROP POLICY IF EXISTS "Pet owners can manage their requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Transporters can view active requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Users can insert their own transport requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Users can manage their own requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Users can update their own transport requests" ON public.transport_requests;
DROP POLICY IF EXISTS "Users can view all active transport requests" ON public.transport_requests;

-- Verify all policies are gone
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'transport_requests' 
ORDER BY policyname;