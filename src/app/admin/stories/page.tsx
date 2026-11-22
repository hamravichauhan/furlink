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
          <h2 className="font-heading text-2xl font-black text-[#163829]">FurStories Community Moderation</h2>
          <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
            {stories.length} community stor{stories.length === 1 ? 'y' : 'ies'} published by rescuers &amp; adoptive families
          </p>
        </div>
        <Link
          href="/stories/new"
          className="btn-paw-primary px-5 py-2.5 text-xs font-semibold shadow-xs"
        >
          + Write New Story
        </Link>
      </div>

      {/* Stories Table */}
      <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
        {stories.length === 0 ? (
          <div className="p-10 text-center text-sm font-body text-gray-500">
            No community stories published yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left">Story</th>
                  <th className="px-5 py-3.5 text-left">Author</th>
                  <th className="px-5 py-3.5 text-left">Photos</th>
                  <th className="px-5 py-3.5 text-left">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={story.imageUrl || '/pets/pancho.jpg'}
                          alt={story.title}
                          className="w-12 h-12 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div className="min-w-0 max-w-[280px]">
                          <div className="font-semibold text-gray-900 truncate">{story.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {story.content}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-700">
                      <div className="font-semibold text-gray-900">{story.user.name || 'Anonymous'}</div>
                      <div className="text-gray-400">{story.user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">
                      {story._count.images} photo{story._count.images === 1 ? '' : 's'}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(story.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
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
