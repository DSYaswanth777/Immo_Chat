import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#203129] to-[#2a4233] flex flex-col items-center justify-center text-white p-4">
      <Image
        src="/images/logo.png"
        alt="Professionista Immobiliare"
        width={200}
        height={20}
        className="rounded-lg bg-white p-4 mb-3"
      />
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
    </div>
  );
}
