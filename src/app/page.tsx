import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getCounts() {
  const [
    rescuesTotal,
    rescuesResolved,
    sterilizationVerified,
    petsAvailable,
    adoptionsDone,
    donorsCount,
  ] = await Promise.all([
    prisma.rescueReport.count(),
    prisma.rescueReport.count({
      where: { status: { in: ["RESCUED", "CLOSED"] } },
    }),
    prisma.sterilizationRequest.count({
      where: { status: { in: ["VERIFIED", "COMPLETED"] } },
    }),
    prisma.pet.count({ where: { status: "AVAILABLE" } }),
    prisma.pet.count({ where: { status: "ADOPTED" } }),
    prisma.donation.count({ where: { status: "SUCCESS" } }),
  ]);

  return {
    rescuesTotal,
    rescuesResolved,
    sterilizationVerified,
    petsAvailable,
    adoptionsDone,
    donorsCount,
  };
}

export default async function HomePage() {
  const counts = await getCounts();

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-emerald-50/40 to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 shadow-sm">
            🐾 Community-powered animal welfare
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Every animal deserves
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              someone who cares.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            FurLink connects rescuers, adopters, and donors with the animals who
            need them most. Report a stray, adopt a friend, or fund a
            sterilization drive — every action counts.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/rescues/new"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-emerald-600/20 transition"
            >
              🆘 Report a rescue
            </Link>
            <Link
              href="/adoptions"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-6 py-3 rounded-full font-medium shadow-sm transition"
            >
              🐾 Adopt a pet
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-amber-500/20 transition"
            >
              ❤️ Donate
            </Link>
          </div>

          {/* Live stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Stat
              value={counts.rescuesResolved}
              label="Animals rescued"
              tone="emerald"
            />
            <Stat
              value={counts.sterilizationVerified}
              label="Sterilizations"
              tone="teal"
            />
            <Stat value={counts.adoptionsDone} label="Adoptions" tone="amber" />
            <Stat value={counts.donorsCount} label="Supporters" tone="rose" />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700">
            How it works
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Three ways to make a difference
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Pick the path that fits you. Every action feeds into a shared system
            of community care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            href="/rescues"
            emoji="🆘"
            title="Report & rescue"
            description="Spot a stray in distress? File a geotagged report. Rescuers nearby get notified and coordinate pickup."
            accent="from-rose-100 to-rose-50 border-rose-200"
            cta="Report a rescue"
          />
          <FeatureCard
            href="/adoptions"
            emoji="🐾"
            title="Adopt a friend"
            description="Browse verified pets from shelters and foster homes. Submit an application directly from the profile."
            accent="from-emerald-100 to-emerald-50 border-emerald-200"
            cta="Browse pets"
          />
          <FeatureCard
            href="/sterilization"
            emoji="💉"
            title="Sterilize & vaccinate"
            description="Request humane TNVR for community animals. Certificates are verified by trusted volunteers."
            accent="from-blue-100 to-blue-50 border-blue-200"
            cta="Request assistance"
          />
        </div>
      </section>

      {/* ── Featured stories ─────────────────────────────────────── */}
      <FeaturedStories />

      {/* ── Donation band ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
            Transparency first
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Every rupee is tracked. Every certificate is verified.
          </h2>
          <p className="mt-4 text-emerald-50 max-w-2xl mx-auto">
            FurLink&apos;s verification system ensures your support reaches real
            animals. Certificates from vets and ABC centers are reviewed by
            trusted community verifiers before a case is marked complete.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/donate"
              className="bg-white text-emerald-700 px-6 py-3 rounded-full font-medium shadow-lg hover:bg-emerald-50 transition"
            >
              Support a cause →
            </Link>
            <Link
              href="/stories"
              className="border border-white/40 px-6 py-3 rounded-full font-medium hover:bg-white/10 transition"
            >
              Read stories
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Ready to help?
        </h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Sign in to report, adopt, volunteer as a rescuer, or become a
          verifier.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/sign-up"
            className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Create an account
          </Link>
          <Link
            href="/stories"
            className="border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition"
          >
            Explore FurStories
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

function Stat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "emerald" | "teal" | "amber" | "rose";
}) {
  const tones = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    teal: "bg-teal-50 border-teal-200 text-teal-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    rose: "bg-rose-50 border-rose-200 text-rose-800",
  };
  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="text-2xl sm:text-3xl font-bold">
        {value.toLocaleString("en-IN")}
      </div>
      <div className="text-[11px] sm:text-xs font-medium opacity-80 mt-0.5">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  href,
  emoji,
  title,
  description,
  accent,
  cta,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
  accent: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border bg-gradient-to-br p-6 transition hover:-translate-y-1 hover:shadow-xl ${accent}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur flex items-center justify-center text-2xl mb-4 shadow-sm">
        {emoji}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        {description}
      </p>
      <div className="mt-4 text-sm font-medium text-gray-900 group-hover:underline">
        {cta} →
      </div>
    </Link>
  );
}

async function FeaturedStories() {
  const stories = await prisma.furStory.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { user: { select: { name: true } }, images: true },
  });

  if (stories.length === 0) return null;

  return (
    <section className="bg-gray-50 border-y">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700">
              From the community
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Real stories, real recoveries
            </h2>
          </div>
          <Link
            href="/stories"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            View all stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => {
            const cover =
              story.images?.[0]?.url ??
              (story.imageUrl && /^https?:\/\//i.test(story.imageUrl)
                ? story.imageUrl
                : null);

            return (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group block bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                      🐾
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {story.content.slice(0, 140)}
                    {story.content.length > 140 ? "…" : ""}
                  </p>
                  <div className="mt-4 text-xs text-gray-500 flex justify-between">
                    <span>{story.user.name ?? "Anonymous"}</span>
                    <span>
                      {new Date(story.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
