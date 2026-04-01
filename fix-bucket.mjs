import { createClient } from '@supabase/supabase-js';

async function fixBucket() {
  const url = 'https://ijuiifffwwilninyxobb.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqdWlpZmZmd3dpbG5pbnl4b2JiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxMTA1MCwiZXhwIjoyMDkwMzg3MDUwfQ.hTmDm97LKUUOobwtJwn2MURUHBJK6DpivVOEJ2MsEKU';
  const targetBucket = 'media';

  const supabase = createClient(url, key);

  console.log(`Updating bucket "${targetBucket}" configuration...`);

  // Update bucket to allow more mime types and ensure it is public
  const { data, error } = await supabase.storage.updateBucket(targetBucket, {
    public: true,
    allowedMimeTypes: [
      'image/jpeg', 
      'image/png', 
      'image/webp', 
      'image/x-icon', 
      'image/vnd.microsoft.icon',
      'image/svg+xml',
      'image/gif'
    ],
    fileSizeLimit: 5242880 // 5MB
  });

  if (error) {
    console.error('Error updating bucket:', error);
  } else {
    console.log('✅ Bucket updated successfully!');
    console.log('New configuration:', JSON.stringify(data, null, 2));
  }
}

fixBucket();
