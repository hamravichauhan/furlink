'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStory } from '@/actions/story';
import Link from 'next/link';

interface Props {
  storyId: string;
}

export default function StoryAdminActions({ storyId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this story?')) return;
    setLoading(true);
    try {
      const res = await deleteStory(storyId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete story');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/stories/${storyId}`}
        className="text-xs text-emerald-600 hover:underline"
      >
        View
      </Link>
      <Link
        href={`/stories/${storyId}/edit`}
        className="text-xs text-gray-600 hover:underline"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-xs text-rose-600 hover:text-rose-800 disabled:opacity-50"
      >
        {loading ? '…' : 'Delete'}
      </button>
    </div>
  );
}
