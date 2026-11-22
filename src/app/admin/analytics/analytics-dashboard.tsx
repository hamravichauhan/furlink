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
    forest: '#163829',
    forestDark: '#0D2818',
    emerald: '#2D6A4F',
    mint: '#74C69D',
    rose: '#cc2b3f',
    amber: '#F4A261',
    lavender: '#8A95EB',
    card: '#FFFFFF',
    border: '#E5E9E5',
    faint: '#8E9E8E',
  };

  return (
    <div className="space-y-8 font-body">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#163829]/60">Rescue Resolution</div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-[#163829] mt-1.5">{kpis.rescueResolutionRate}%</div>
          <div className="text-xs text-gray-400 mt-1">{kpis.totalRescues} total dispatches</div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#163829]/60">TNVR Verification</div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-[#163829] mt-1.5">{kpis.sterilizationVerifiedRate}%</div>
          <div className="text-xs text-gray-400 mt-1">{kpis.totalSterilizations} tracked cases</div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#163829]/60">Adoption Rate</div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-[#163829] mt-1.5">{kpis.adoptionRate}%</div>
          <div className="text-xs text-gray-400 mt-1">{kpis.totalPets} animals cataloged</div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#163829]/60">Donations Raised</div>
          <div className="font-heading text-3xl sm:text-4xl font-black text-[#cc2b3f] mt-1.5">₹{kpis.totalDonationsAmount.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-400 mt-1">{kpis.totalDonationsCount} contributions</div>
        </div>
      </div>

      {/* Row 1: Monthly Activity Trends & Rescue Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Welfare Activities Monthly Trend */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#163829] bg-[#D8F3DC] px-3 py-1 rounded-full inline-block">
            Trajectory
          </span>
          <h3 className="font-heading text-xl font-black text-[#163829] mt-3 mb-1">
            Welfare Activity Trends (Last 6 Months)
          </h3>
          <p className="text-xs text-gray-500 mb-6">
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
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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
                  stroke={palette.forest}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: palette.forest }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rescue Status Distribution */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#163829] bg-[#D8F3DC] px-3 py-1 rounded-full inline-block">
            Resolution
          </span>
          <h3 className="font-heading text-xl font-black text-[#163829] mt-3 mb-1">
            Distress Case Disposition
          </h3>
          <p className="text-xs text-gray-500 mb-6">
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
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="count" name="Cases" fill={palette.forest} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Sterilization Pipeline & Donation Inflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sterilization (TNVR) Status Breakdown */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#163829] bg-[#D8F3DC] px-3 py-1 rounded-full inline-block">
            Verification
          </span>
          <h3 className="font-heading text-xl font-black text-[#163829] mt-3 mb-1">
            Sterilization (TNVR) Workflow
          </h3>
          <p className="text-xs text-gray-500 mb-6">
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
                    const colors = [palette.forest, palette.mint, palette.rose, palette.lavender, palette.amber];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donation Collections Over Time */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#cc2b3f] bg-rose-50 px-3 py-1 rounded-full inline-block">
            Financial
          </span>
          <h3 className="font-heading text-xl font-black text-[#163829] mt-3 mb-1">
            Monthly Inflow Receipts (₹)
          </h3>
          <p className="text-xs text-gray-500 mb-6">
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
                    borderRadius: '16px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="donations" name="Receipts (₹)" fill={palette.forest} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Species Distribution */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#163829] bg-[#D8F3DC] px-3 py-1 rounded-full inline-block">
          Census
        </span>
        <h3 className="font-heading text-xl font-black text-[#163829] mt-3 mb-4">
          Adoption Catalog Species Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {petSpeciesBreakdown.map((item) => (
            <div key={item.name} className="border border-gray-200 bg-[#F8FAF8] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium block">Species</span>
                <span className="font-heading text-lg font-black text-[#163829]">{item.name}</span>
              </div>
              <div className="font-heading text-3xl font-black text-[#163829]">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
