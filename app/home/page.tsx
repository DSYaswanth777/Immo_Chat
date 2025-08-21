import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  BarChart3,
  Home,
  MessageCircle,
  ArrowRight,
  Smartphone,
  FileText,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { HomepageHeader } from "@/components/homepage-header";

export default function ImmochatLanding() {
  return (
    <div className="min-h-screen bg-white">
      <FloatingWhatsApp />

      {/* Dynamic Header */}
      <HomepageHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#203129] to-[#2a4233]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-[#10c03e] text-white mb-4">
                Per Professionisti Immobiliari
              </Badge>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Fai Crescere la Tua Agenzia Immobiliare con{" "}
                <span className="text-[#10c03e]">WhatsApp</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Connettiti istantaneamente con i clienti, gestisci le
                valutazioni immobiliari e chiudi più contratti attraverso la
                piattaforma di messaggistica più popolare d'Italia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-[#10c03e] hover:bg-[#0ea835] text-white w-full sm:w-auto"
                  >
                    Inizia Prova Gratuita
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#203129] bg-transparent"
                >
                  Guarda Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/hero-real-estate-agent.jpg"
                alt="Professionista Immobiliare"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#203129] mb-2">50K+</div>
              <div className="text-gray-600">Agenti Attivi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#203129] mb-2">1M+</div>
              <div className="text-gray-600">Immobili Valutati</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#203129] mb-2">95%</div>
              <div className="text-gray-600">Soddisfazione Clienti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#203129] mb-2">24/7</div>
              <div className="text-gray-600">Supporto Disponibile</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servizi" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Soluzioni Immobiliari Complete
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tutto quello che ti serve per gestire la tua attività immobiliare
              in modo efficiente attraverso l'integrazione WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#10c03e] transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-[#10c03e] rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#203129]">
                  Valutazione Immobili
                </CardTitle>
                <CardDescription>
                  Valutazioni immobiliari istantanee inviate direttamente ai
                  clienti via WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/images/property-valuation.jpg"
                  alt="Valutazione Immobili"
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Analisi di mercato con IA
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Consegna istantanea su WhatsApp
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Report PDF professionali
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#10c03e] transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-[#10c03e] rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#203129]">
                  Comunicazione Clienti
                </CardTitle>
                <CardDescription>
                  Comunicazione semplificata con i clienti attraverso WhatsApp
                  Business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/images/whatsapp-chat.jpg"
                  alt="Comunicazione Clienti"
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Risposte automatiche
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Condivisione immobili
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Prenotazione appuntamenti
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#10c03e] transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-[#10c03e] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-[#203129]">
                  Analisi di Mercato
                </CardTitle>
                <CardDescription>
                  Approfondimenti completi del mercato e analisi delle tendenze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/images/market-analysis.jpg"
                  alt="Analisi di Mercato"
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Tendenze mercato locale
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Analisi comparative
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Insights investimenti
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caratteristiche" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Perché Scegliere Immochat?
            </h2>
            <p className="text-xl text-gray-600">
              Costruito specificamente per i professionisti immobiliari italiani
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/professional-agent.jpg"
                alt="Professionista Immobiliare"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#10c03e] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#203129] mb-2">
                    Esperienza Mercato Locale
                  </h3>
                  <p className="text-gray-600">
                    Conoscenza approfondita dei mercati immobiliari italiani con
                    dati localizzati e insights per ogni regione.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#10c03e] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#203129] mb-2">
                    Gestione Relazioni Clienti
                  </h3>
                  <p className="text-gray-600">
                    Gestisci tutte le interazioni con i clienti, le richieste
                    immobiliari e i follow-up senza problemi attraverso
                    WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#10c03e] rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#203129] mb-2">
                    Strumenti Crescita Business
                  </h3>
                  <p className="text-gray-600">
                    Analytics avanzate e strumenti di generazione lead per
                    aiutarti a far crescere la tua attività immobiliare più
                    velocemente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Cosa Dicono i Nostri Agenti
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#10c03e] text-[#10c03e]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Immochat ha rivoluzionato il modo in cui comunico con i
                  clienti. Le valutazioni immobiliari sono ora istantanee e il
                  mio tasso di chiusura è aumentato del 40%."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/images/marco-rossi.jpg"
                    alt="Marco Rossi"
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-[#203129]">
                      Marco Rossi
                    </div>
                    <div className="text-sm text-gray-500">
                      Immobiliare Roma
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#10c03e] text-[#10c03e]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "L'integrazione WhatsApp è perfetta. I miei clienti adorano
                  ricevere report immobiliari istantanei, e questo mi distingue
                  dalla concorrenza."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/images/giulia-bianchi.jpg"
                    alt="Giulia Bianchi"
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-[#203129]">
                      Giulia Bianchi
                    </div>
                    <div className="text-sm text-gray-500">Immobili Milano</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#10c03e] text-[#10c03e]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Miglior investimento per la mia agenzia. Le analisi di
                  mercato mi aiutano a prezzare accuratamente gli immobili e la
                  gestione clienti è eccellente."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/images/alessandro-ferrari.jpg"
                    alt="Alessandro Ferrari"
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-[#203129]">
                      Alessandro Ferrari
                    </div>
                    <div className="text-sm text-gray-500">
                      Immobiliare Napoli
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section - Replacing Pricing */}
      <section id="come-funziona" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Come Funziona Immochat
            </h2>
            <p className="text-xl text-gray-600">
              Semplice, veloce ed efficace in soli 3 passaggi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-2 hover:border-[#10c03e] transition-colors">
              <CardHeader>
                <div className="w-20 h-20 bg-[#10c03e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#203129] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle className="text-[#203129]">
                  Registrati e Configura
                </CardTitle>
                <CardDescription>
                  Crea il tuo account e collega WhatsApp Business alla
                  piattaforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/images/whatsapp-registration.jpg"
                  alt="Registrazione"
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <ul className="space-y-2 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Setup guidato in 5 minuti
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Integrazione WhatsApp automatica
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Personalizzazione profilo agenzia
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#10c03e] transition-colors">
              <CardHeader>
                <div className="w-20 h-20 bg-[#10c03e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#203129] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle className="text-[#203129]">
                  Ricevi Richieste
                </CardTitle>
                <CardDescription>
                  I clienti ti contattano via WhatsApp per valutazioni
                  immobiliari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/images/client-requests.jpg"
                  alt="Richieste Clienti"
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <ul className="space-y-2 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Notifiche istantanee
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Raccolta dati automatica
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Gestione lead centralizzata
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#10c03e] transition-colors">
              <CardHeader>
                <div className="w-20 h-20 bg-[#10c03e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <div className="w-8 h-8 bg-[#203129] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle className="text-[#203129]">
                  Invia Valutazioni
                </CardTitle>
                <CardDescription>
                  Genera e invia report professionali istantaneamente via
                  WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/images/report-delivery.jpg"
                  alt="Invio Report"
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
                <ul className="space-y-2 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Report PDF professionali
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Analisi di mercato inclusa
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#10c03e] mr-2" />
                    Follow-up automatico
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#10c03e] rounded-full"></div>
                <ArrowRight className="w-5 h-5 text-[#203129]" />
                <div className="w-3 h-3 bg-[#10c03e] rounded-full"></div>
                <ArrowRight className="w-5 h-5 text-[#203129]" />
                <div className="w-3 h-3 bg-[#10c03e] rounded-full"></div>
              </div>
            </div>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#10c03e] hover:bg-[#0ea835] text-white"
              >
                Inizia Subito - È Gratuito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#203129]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto a Trasformare la Tua Attività Immobiliare?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Unisciti a migliaia di agenti immobiliari di successo in tutta
            Italia che stanno già utilizzando Immochat per far crescere la loro
            attività.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#10c03e] hover:bg-[#0ea835] text-white w-full sm:w-auto"
              >
                Inizia la Tua Prova Gratuita
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#203129] bg-transparent"
            >
              Prenota una Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contatti" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                IMMO<span className="text-[#10c03e]">CHAT</span>
              </div>
              <p className="text-gray-400 mb-4">
                Potenziamo i professionisti immobiliari italiani con soluzioni
                innovative su WhatsApp.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-[#10c03e] rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-[#10c03e] rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Servizi</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Valutazione Immobili</li>
                <li>Comunicazione Clienti</li>
                <li>Analisi di Mercato</li>
                <li>Generazione Lead</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Azienda</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Chi Siamo</li>
                <li>Carriere</li>
                <li>Stampa</li>
                <li>Partner</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Supporto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centro Assistenza</li>
                <li>Documentazione</li>
                <li>Contatta Supporto</li>
                <li>Stato Sistema</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Immochat. Tutti i diritti riservati. | Privacy Policy
              | Termini di Servizio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
