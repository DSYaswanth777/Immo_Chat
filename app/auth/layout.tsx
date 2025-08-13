import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center pt-8">
        <Link href="/" className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Immochat"
            width={120}
            height={40}
            className="rounded-lg"
          />
        </Link>
      </div>

      <div className="mt-8">{children}</div>

      <div className="mt-8 text-center pb-8">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-[#10c03e] transition-colors"
        >
          ← Torna alla homepage
        </Link>
      </div>
    </div>
  );
}
