'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AnalyticsData } from '@/actions/analytics-data';

interface Props {
  data: AnalyticsData;
}

export default function AnalyticsDashboard({ data }: Props) {
  const { kpis, sterilizationByStatus, rescuesByStatus, petSpeciesBreakdown, monthlyTrends } = data;

  const palette = {
    slate: '#0F172A',
    emerald: '#059669',
    rose: '#E11D48',
    teal: '#0D9488',
    amber: '#D97706',
    faint: '#94A3B8',
    card: '#FFFFFF',
    border: '#E2E8F0',
  };

  return (
    <div className="space-y-8 font-sans">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft border-l-4 border-l-rose-500">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rescue Resolution</div>
          <div className="font-heading text-3xl font-bold text-slate-900 mt-1">{kpis.rescueResolutionRate}%</div>
          <div className="text-xs text-slate-400 mt-0.5">{kpis.totalRescues} total dispatches</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft border-l-4 border-l-emerald-500">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">TNVR Verification</div>
          <div className="font-heading text-3xl font-bold text-slate-900 mt-1">{kpis.sterilizationVerifiedRate}%</div>
          <div className="text-xs text-slate-400 mt-0.5">{kpis.totalSterilizations} tracked cases</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft border-l-4 border-l-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Adoption Rate</div>
          <div className="font-heading text-3xl font-bold text-slate-900 mt-1">{kpis.adoptionRate}%</div>
          <div className="text-xs text-slate-400 mt-0.5">{kpis.totalPets} animals cataloged</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-soft border-l-4 border-l-rose-500">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Donations Raised</div>
          <div className="font-heading text-3xl font-bold text-rose-600 mt-1">₹{kpis.totalDonationsAmount.toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-0.5">{kpis.totalDonationsCount} contributions</div>
        </div>
      </div>

      {/* Row 1: Monthly Activity Trends & Rescue Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Welfare Activities Monthly Trend */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Trajectory
          </span>
          <h3 className="font-heading text-xl font-bold text-slate-900 mt-2 mb-1">
            Welfare Activity Trends (Last 6 Months)
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Comparative trajectory between acute rescue calls and sterilization cases
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.border} />
                <XAxis dataKey="month" stroke={palette.faint} fontSize={11} />
                <YAxis stroke={palette.faint} fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="rescues"
                  name="Rescue Cases"
                  stroke={palette.rose}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: palette.rose }}
                />
                <Line
                  type="monotone"
                  dataKey="sterilizations"
                  name="Sterilizations"
                  stroke={palette.emerald}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: palette.emerald }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rescue Status Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
            Resolution
          </span>
          <h3 className="font-heading text-xl font-bold text-slate-900 mt-2 mb-1">
            Distress Case Disposition
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Current status of all reported animal distress dispatches
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rescuesByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.border} />
                <XAxis dataKey="name" stroke={palette.faint} fontSize={11} />
                <YAxis stroke={palette.faint} fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Cases" fill={palette.slate} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Sterilization Pipeline & Donation Inflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sterilization (TNVR) Status Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Verification
          </span>
          <h3 className="font-heading text-xl font-bold text-slate-900 mt-2 mb-1">
            Sterilization (TNVR) Workflow
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Breakdown across field intake, veterinary proof, and audit sign-off
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sterilizationByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {sterilizationByStatus.map((_, index) => {
                    const colors = [palette.rose, palette.emerald, palette.slate, palette.teal, palette.amber];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donation Collections Over Time */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full inline-block">
            Financial
          </span>
          <h3 className="font-heading text-xl font-bold text-slate-900 mt-2 mb-1">
            Monthly Inflow Receipts (₹)
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Direct care gifts received for surgery packs, antibiotics, and food
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.border} />
                <XAxis dataKey="month" stroke={palette.faint} fontSize={11} />
                <YAxis stroke={palette.faint} fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Donations']}
                  contentStyle={{
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="donations" name="Receipts (₹)" fill={palette.rose} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Species Distribution */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-soft">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block">
          Census
        </span>
        <h3 className="font-heading text-xl font-bold text-slate-900 mt-2 mb-4">
          Adoption Catalog Species Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {petSpeciesBreakdown.map((item) => (
            <div key={item.name} className="border border-slate-200/80 bg-slate-50/70 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Species:</span>
                <span className="font-heading text-base font-bold text-slate-900">{item.name}</span>
              </div>
              <div className="font-heading text-2xl font-bold text-emerald-700">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
