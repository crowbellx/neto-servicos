import { createClient } from '@supabase/supabase-js';

async function checkBuckets() {
  const url = 'https://ijuiifffwwilninyxobb.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqdWlpZmZmd3dpbG5pbnl4b2JiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgxMTA1MCwiZXhwIjoyMDkwMzg3MDUwfQ.hTmDm97LKUUOobwtJwn2MURUHBJK6DpivVOEJ2MsEKU';
  const targetBucket = 'media';

  const supabase = createClient(url, key);

  console.log(`Checking Supabase at: ${url}`);
  console.log(`Target Bucket: ${targetBucket}`);

  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('Error listing buckets:', error);
    if (error.stats === 401 || error.message?.includes('Invalid key')) {
        console.error('❌ Authentication failed. Check your Service Role Key.');
    }
    return;
  }

  console.log('Available buckets:', data.map(b => b.name));

  const exists = data.find(b => b.name === targetBucket);
  if (exists) {
    console.log(`✅ Bucket "${targetBucket}" exists!`);
    console.log(`Detailed bucket info:`, JSON.stringify(exists, null, 2));
  } else {
    console.log(`❌ Bucket "${targetBucket}" does NOT exist.`);
  }
}

checkBuckets();
