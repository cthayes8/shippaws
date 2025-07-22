-- Clean RLS policies for transport_requests table
-- Run this after dropping all existing policies

-- Enable RLS on transport_requests table
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- Policy for pet owners to insert their own requests
CREATE POLICY "Pet owners can create requests" 
ON public.transport_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = customer_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'pet_owner'
  )
);

-- Policy for pet owners to view and update their own requests
CREATE POLICY "Pet owners can manage their requests" 
ON public.transport_requests 
FOR ALL 
TO authenticated 
USING (
  auth.uid() = customer_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'pet_owner'
  )
);

-- Policy for transporters to view active requests
CREATE POLICY "Transporters can view active requests" 
ON public.transport_requests 
FOR SELECT 
TO authenticated 
USING (
  status = 'active' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'transporter'
  )
);

-- Verify policies are created correctly
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'transport_requests' 
ORDER BY policyname;