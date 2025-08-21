import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#203129] to-[#2a4233] flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-5xl font-bold mb-4 text-center">
        IMMO<span className="text-[#10c03e]">CHAT</span>
      </h1>
      <p className="text-2xl mb-8 text-center">
        Il nostro nuovo sito è in arrivo!
      </p>
      <div className="max-w-md text-center mb-8">
        <p className="text-lg">
          Stiamo lavorando duramente per offrirti un'esperienza straordinaria.
          Resta sintonizzato per il lancio della nostra piattaforma che
          rivoluzionerà il settore immobiliare.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/home">
            <Button
            size="lg"
            className="bg-[#10c03e] hover:bg-[#0ea835] text-white"
            >
            Vai alla home page attuale
            </Button>
        </Link>
      </div>
    </div>
  );
}
