'use client';

import { incrementPostViews } from '@/app/actions/blog';
import { useEffect, useRef } from 'react';

export default function PostViewTracker({ postId }: { postId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void incrementPostViews(postId);
  }, [postId]);

  return null;
}
