import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const donation = id
    ? await prisma.donation.findUnique({ where: { id } })
    : null;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🐾</div>
      <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
      {donation ? (
        <p className="text-gray-600 mb-6">
          Your donation of{" "}
          <span className="font-semibold">
            ₹{donation.amount.toLocaleString("en-IN")}
          </span>{" "}
          has been received.
        </p>
      ) : (
        <p className="text-gray-600 mb-6">Your donation has been processed.</p>
      )}
      <Link
        href="/donate"
        className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md text-sm"
      >
        Back to donate
      </Link>
    </div>
  );
}
