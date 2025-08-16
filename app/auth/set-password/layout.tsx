import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imposta Password - ImmoChat",
  description: "Imposta una password per il tuo account ImmoChat",
};

export default function SetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {children}
    </div>
  );
}
