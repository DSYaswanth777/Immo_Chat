"use client";

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
  Globe,
  Shield,
  Zap,
  Award,
  Clock,
  Target,
  ChevronRight,
  Play,
  Download,
  HeartHandshake,
  Building,
  Users2,
  Briefcase,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { HomepageHeader } from "@/components/homepage-header";

export default function ImmochatLanding() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-400/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-400/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/3 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-150"></div>
      </div>

      <FloatingWhatsApp />

      {/* Enhanced Header */}
      <HomepageHeader />

      {/* Hero Section - Enhanced */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-slate-50 to-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-gray-900 animate-slide-up">
              <div className="flex items-center space-x-2 mb-6">
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Per Professionisti Immobiliari
                </Badge>
              </div>

              <h1 className="text-5xl font-bold mb-8 leading-tight">
                🚀 Gestisci il tuo
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Affari immobiliari
                </span>{" "}
                Più intelligente
              </h1>

              <p className="text-xl mb-10 text-gray-600 leading-relaxed">
                Una piattaforma moderna dove le agenzie immobiliari si
                registrano, mostrano i loro immobili e gestiscono tutto da
                un'unica dashboard intuitiva.
              </p>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-xl mr-3">🏠</span>
                    Crea il Tuo Account
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dashboard/properties">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-xl mr-3">📅</span>
                    Accedi alla Dashboard
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span>Sicuro & Affidabile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="relative z-10">
                {/* Floating elements positioned on top of the image */}
                <div className="absolute -top-6 -left-6 z-20 w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <Building2 className="w-12 h-12 text-emerald-600" />
                </div>
                <div className="absolute -bottom-6 right-12 z-20 w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce delay-300">
                  <BarChart3 className="w-12 h-12 text-blue-600" />
                </div>


                <Image
                  src="/images/hero-real-estate-agent.jpg"
                  alt="Professionista Immobiliare"
                  width={600}
                  height={500}
                  className="relative z-0 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      {/* <section id="servizi" className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-600 font-semibold uppercase tracking-wider text-sm">
                SERVIZI
              </span>
              <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Soluzioni Immobiliari{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Complete
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Tutto quello che ti serve per gestire la tua attività immobiliare
              in modo efficiente attraverso la piattaforma più avanzata del
              mercato
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-emerald-50/30 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16"></div>

              <CardHeader className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg text-4xl">
                  🏠
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">
                  Gestione Immobili
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Sistema completo di gestione immobili con valutazioni
                  istantanee e report professionali consegnati direttamente
                  nella tua dashboard
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/property-valuation.jpg"
                    alt="Valutazione Immobili"
                    width={350}
                    height={220}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">
                      Analisi di mercato con IA avanzata
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">
                      Consegna istantanea su WhatsApp
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">
                      Report PDF professionali personalizzati
                    </span>
                  </li>
                </ul>

                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 group">
                  Scopri di più
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-blue-50/30 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16"></div>

              <CardHeader className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">💬</span>
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">
                  Comunicazione Clienti
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Comunicazione clienti semplificata e risposte automatiche con
                  capacità intelligenti di condivisione immobili
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/whatsapp-chat.jpg"
                    alt="Comunicazione Clienti"
                    width={350}
                    height={220}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">
                      Risposte automatiche intelligenti
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">
                      Condivisione immobili multimediale
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700">
                      Prenotazione appuntamenti integrata
                    </span>
                  </li>
                </ul>

                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 group">
                  Scopri di più
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-purple-50/30 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>

              <CardHeader className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">📊</span>
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">
                  Analisi di Mercato
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Approfondimenti completi del mercato e analisi delle tendenze
                  con dati in tempo reale e previsioni accurate
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/market-analysis.jpg"
                    alt="Analisi di Mercato"
                    width={350}
                    height={220}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">
                      Tendenze mercato locale in tempo reale
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">
                      Analisi comparative avanzate
                    </span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">
                      Insights investimenti personalizzati
                    </span>
                  </li>
                </ul>

                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 group">
                  Scopri di più
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Benefits Grid - Bento Style */}

      {/* How It Works - Bento Grid */}
      <section id="come-funziona" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Come{" "}
              <span className="bg-gradient-to-r from-[#10c03e] to-emerald-500 bg-clip-text text-transparent">
                Funziona
              </span>
            </h2>
            <p className="text-xl text-gray-700">
              Semplice, veloce ed efficace in soli 3 passaggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#10c03e] to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-[#203129] mb-4">
                  Registra la Tua Agenzia
                </h3>
                <p className="text-gray-700 mb-6">
                  Iscriviti in pochi secondi e crea il tuo profilo professionale
                </p>
                <Image
                  src="/images/whatsapp-registration.jpg"
                  alt="Registrazione WhatsApp"
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-[#203129] mb-4">
                  Aggiungi Immobili
                </h3>
                <p className="text-gray-700 mb-6">
                  Carica i tuoi annunci con, dettagli e valutazioni
                </p>
                <Image
                  src="/images/client-requests.jpg"
                  alt="Richieste Clienti"
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-[#203129] mb-4">
                  Gestisci Tutto in Un Posto
                </h3>
                <p className="text-gray-700 mb-6">
                  Visualizza gli immobili su mappa interattiva, traccia le
                  conversazioni e condividi report istantaneamente
                </p>
                <Image
                  src="/images/report-delivery.jpg"
                  alt="Consegna Report"
                  width={300}
                  height={200}
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#10c03e] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-xl"
              >
                <span className="mr-2">📍</span>
                Inizia Subito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Us Section - Redesigned */}
      <section className="py-32 bg-gradient-to-br from-emerald-50 via-white to-slate-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-emerald-400 rounded-full"></div>
              <div className="mx-4 px-6 py-3 bg-emerald-100 backdrop-blur-md rounded-full border border-emerald-300">
                <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm">
                  ✨ PERCHÉ SCEGLIERCI ✨
                </span>
              </div>
              <div className="w-16 h-1 bg-gradient-to-l from-transparent to-emerald-400 rounded-full"></div>
            </div>
            <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Perché le Agenzie{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                Ci Scelgono
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Registra la tua agenzia e inizia subito a gestire i tuoi immobili
            </p>
          </div>

          {/* Features Grid - Bento Style */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16">
            {/* Feature 1 - Large Card */}
            <div className="lg:row-span-2 group relative">
              <div className="h-full bg-gradient-to-br from-white to-emerald-50 backdrop-blur-xl rounded-3xl p-10 border border-emerald-200 hover:border-emerald-300 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <span className="text-4xl">🏢</span>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Registrazione Agenzia
                  </h3>

                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    Registra la tua agenzia immobiliare in pochi minuti.
                    Processo semplice e veloce per iniziare subito.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center text-emerald-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                      <span>Registrazione in 5 minuti</span>
                    </div>
                    <div className="flex items-center text-emerald-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                      <span>Profilo agenzia professionale</span>
                    </div>
                    <div className="flex items-center text-emerald-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                      <span>Accesso immediato alla piattaforma</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="h-full bg-gradient-to-br from-white to-blue-50 backdrop-blur-xl rounded-3xl p-8 border border-blue-200 hover:border-blue-300 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <span className="text-3xl">🏠</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Inserimento Immobili
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    Carica e gestisci i tuoi immobili con foto, descrizioni e
                    dettagli in modo semplice e veloce.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="h-full bg-gradient-to-br from-white to-purple-50 backdrop-blur-xl rounded-3xl p-8 border border-purple-200 hover:border-purple-300 transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-100/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <span className="text-3xl">👁️</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Visualizza Immobili
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    Esplora tutti gli immobili disponibili con ricerca avanzata
                    e visualizzazione su mappa interattiva.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-800 text-white font-bold px-12 py-6 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 text-lg border-2 border-emerald-400"
                >
                  <span className="mr-4 text-xl">🎯</span>
                  Inizia Gratuitamente Ora
                  <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Dashboard Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Main Dashboard Image */}
              <div className="relative z-10">
                <Image
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Dashboard Proprietà"
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl"
                />

                {/* Floating UI Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl block">🗺️</span>
                    <span className="text-xs font-medium text-gray-700">
                      Maps
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 w-32 h-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-lg block">🏠</span>
                    <span className="text-xs font-medium text-gray-700">
                      Proprietà Gestite
                    </span>
                  </div>
                </div>

                <div className="absolute top-1/3 -left-6 w-20 h-20 bg-emerald-500/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
            </div>

            <div className="text-gray-900">
              <h2 className="text-4xl font-bold mb-6">
                📊 La Tua Dashboard{" "}
                <span className="text-emerald-600">Completa</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Visualizza tutte le tue proprietà, conversazioni e valutazioni
                in un’unica interfaccia chiara e moderna. Gestisci la tua
                agenzia con la massima efficienza.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  Gestione completa delle proprietà
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  Statistiche in tempo reale
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  Interfaccia semplice e veloce
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#10c03e] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-xl mt-5"
                >
                  📅 Accedi alla Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Map Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 text-gray-900">
              <h2 className="text-4xl font-bold mb-6">
                Mappa Interattiva{" "}
                <span className="text-emerald-600">Vista in Tempo Reale</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Naviga attraverso gli immobili direttamente su una mappa
                aggiornata in tempo reale. Filtra per zona, prezzo e tipologia
                per trovare esattamente quello che stai cercando.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  Ricerca avanzata geolocalizzata
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  Aggiornamenti istantanei
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  Visualizzazione intuitiva
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
              <Image
                src="/images/maps.png"
                alt="Mappa Interattiva"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Easy Signup Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">

          <div className="absolute inset-0 bg-gradient-to-r from-white/85 to-emerald-50/90"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-emerald-100 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-5xl">🚀</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Sei pronto a far crescere la{" "}
                <span className="text-emerald-700">
                  tua Agenzia Immobiliare?
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                Registra la tua agenzia su Immochat e gestisci subito annunci,
                valutazioni e analisi di mercato dalla tua dashboard.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-gray-900 border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-bold mb-2">Dashboard Centralizzata</h3>
                <p className="text-sm text-gray-700">
                  Gestisci tutti i tuoi annunci da un’unica interfaccia
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-gray-900 border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-bold mb-2">Analisi di Mercato</h3>
                <p className="text-sm text-gray-700">
                  Ottieni report e trend aggiornati in pochi secondi
                </p>
              </div>
            </div>

            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800 px-12 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-semibold"
              >
                <span className="mr-3">✅</span>
                Registra la tua Agenzia Ora
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Domande <span className="text-emerald-600">Frequenti</span>
            </h2>
            <p className="text-xl text-gray-600">
              Risposte rapide ai dubbi più comuni
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: "Serve WhatsApp Business?",
                a: "Consigliato per le funzionalità avanzate e integrazioni complete.",
              },
              {
                q: "È compatibile con GDPR?",
                a: "Sì, adottiamo best practice di sicurezza e privacy conformi.",
              },
              {
                q: "Posso importare i contatti?",
                a: "Sì, tramite CSV o integrazioni con CRM.",
              },
              {
                q: "Quanto costa?",
                a: "Piani flessibili; contattaci per una proposta su misura.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-emerald-50/50 border border-emerald-100 rounded-xl p-4"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{item.q}</span>
                  <span className="ml-4 text-emerald-700 group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials - Bento Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Cosa Dicono le{" "}
              <span className="bg-gradient-to-r from-[#10c03e] to-emerald-500 bg-clip-text text-transparent">
                Agenzie
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#10c03e] text-[#10c03e]"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Finalmente una dashboard unica per gestire tutti i nostri
                  annunci e conversazioni con i clienti. Ci fa risparmiare ore
                  ogni settimana."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10c03e] to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-sm">MR</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#203129]">Marco Rossi</div>
                    <div className="text-sm text-gray-600">
                      Agenzia Immobiliare, Roma
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#10c03e] text-[#10c03e]"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "La vista mappa è rivoluzionaria — ai clienti piace vedere
                  tutti gli immobili in tempo reale."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-sm">GB</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#203129]">
                      Giulia Bianchi
                    </div>
                    <div className="text-sm text-gray-600">
                      Agenzia Immobiliare, Milano
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#10c03e] text-[#10c03e]"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "Miglior investimento per la mia agenzia. Le analisi di
                  mercato mi aiutano a prezzare accuratamente gli immobili e la
                  gestione clienti è eccellente."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-sm">AF</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#203129]">
                      Alessandro Ferrari
                    </div>
                    <div className="text-sm text-gray-600">
                      Immobiliare Napoli
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modernistic Bento Style */}
      <footer className="py-16 bg-white">
        <div className="container px-4 text-center text-gray-600">
          © 2025 Immochat. Tutti i diritti riservati.
        </div>
      </footer>
    </div>
  );
}
