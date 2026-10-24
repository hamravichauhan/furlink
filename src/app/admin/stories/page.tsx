import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import StoryAdminActions from './story-admin-actions';

export const dynamic = 'force-dynamic';

export default async function AdminStoriesPage() {
  await requireAdmin();

  const stories = await prisma.furStory.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { images: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">FurStories Moderation</h2>
          <p className="text-sm text-gray-500">
            {stories.length} community stor{stories.length === 1 ? 'y' : 'ies'} published
          </p>
        </div>
        <Link
          href="/stories/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          + Write Story
        </Link>
      </div>

      {/* Stories Table */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        {stories.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No community stories published yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Story</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Photos</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={story.imageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'}
                          alt={story.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                        <div className="min-w-0 max-w-[280px]">
                          <div className="font-semibold text-gray-900 truncate">{story.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {story.content}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="font-medium text-gray-900">{story.user.name || 'Anonymous'}</div>
                      <div className="text-gray-400">{story.user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {story._count.images} photo{story._count.images === 1 ? '' : 's'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StoryAdminActions storyId={story.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
