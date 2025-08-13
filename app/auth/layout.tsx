import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="text-sm text-gray-600 hover:text-[#10c03e] transition-colors"
        >
          ← Torna alla homepage
        </Link>
      </div>
    </div>
  )
}
