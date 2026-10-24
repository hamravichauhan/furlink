import { getPlatformAnalytics } from '@/actions/analytics-data';
import { requireAdmin } from '@/lib/auth-helpers';
import AnalyticsDashboard from './analytics-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const data = await getPlatformAnalytics();

  if (!data) {
    return (
      <div className="border rounded-lg bg-white p-6">
        <p className="text-sm text-gray-600">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Platform Analytics & Visualizations</h2>
        <p className="text-sm text-gray-500">
          Data insights on animal rescue, pet adoptions, sterilizations, and community donations.
        </p>
      </div>

      <AnalyticsDashboard data={data} />
    </div>
  );
}
