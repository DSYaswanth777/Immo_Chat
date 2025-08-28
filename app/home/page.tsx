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
                Fai Crescere la Tua{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Agenzia Immobiliare
                </span>{" "}
                con WhatsApp
              </h1>

              <p className="text-xl mb-10 text-gray-600 leading-relaxed">
                Connettiti istantaneamente con i clienti, gestisci le
                valutazioni immobiliari e chiudi più contratti attraverso la
                piattaforma di messaggistica più popolare d'Italia.
              </p>

              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Inizia Prova Gratuita
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Globe className="w-5 h-5 mr-3" />
                  Guarda Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span>Sicuro e Affidabile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Certificato GDPR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Supporto 24/7</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="relative z-10">
                {/* Floating elements positioned on top of the image */}
                <div className="absolute -top-6 -left-6 z-20 w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <MessageCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <div className="absolute -bottom-6 -right-6 z-20 w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg animate-bounce delay-300">
                  <BarChart3 className="w-12 h-12 text-blue-600" />
                </div>
                <div className="absolute top-1/2 -right-12 z-20 w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Star className="w-10 h-10 text-purple-600" />
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

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-slate-50 to-white   relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              La Piattaforma di Fiducia per Migliaia di Agenti
            </h2>
            <p className="text-xl text-dark">
              Risultati concreti che parlano da soli
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Users2 className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                60K+
              </div>
              <div className="text-dark font-medium">Agenti Attivi</div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Building className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-dark font-medium">
                Immobili Valutati
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-dark font-medium">
                Soddisfazione Clienti
              </div>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-dark font-medium">
                Supporto Disponibile
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="servizi" className="py-24 bg-white relative">
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
              in modo efficiente attraverso l'integrazione WhatsApp più avanzata
              del mercato
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-emerald-50/30 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16"></div>

              <CardHeader className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">
                  Valutazione Immobili
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Valutazioni immobiliari istantanee e precise inviate
                  direttamente ai clienti via WhatsApp con reportistica
                  professionale
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
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-4">
                  Comunicazione Clienti
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Comunicazione semplificata e automatizzata con i clienti
                  attraverso WhatsApp Business con risposte intelligenti
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
                  <BarChart3 className="w-10 h-10 text-white" />
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
      </section>

      {/* Modernistic Features Section - Enhanced Bento Grid */}
      <section id="caratteristiche" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#203129] mb-6">
              Perché Scegliere{" "}
              <span className="bg-gradient-to-r from-[#10c03e] to-emerald-500 bg-clip-text text-transparent">
                Immochat
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Costruito specificamente per i professionisti immobiliari italiani
              con tecnologie all'avanguardia
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Professional Agent Image - Large Bento */}
            <div className="col-span-12 lg:col-span-7 relative bg-white/70 backdrop-blur-md rounded-3xl p-0 shadow-2xl border border-white/50 overflow-hidden">
              <div className="relative h-full min-h-[400px]">
                <Image
                  src="/images/professional-agent.jpg"
                  alt="Professionista Immobiliare"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover rounded-3xl"
                />
                {/* Overlay with Certification Info */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10c03e] to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#203129]">
                        Certificazione Professionale
                      </h4>
                      <p className="text-sm text-gray-600">
                        Oltre 10,000 agenti certificati
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Cards */}
            <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
              <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-white/30 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10c03e] to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#203129] mb-3">
                    Esperienza Mercato Locale
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Conoscenza approfondita dei mercati immobiliari italiani
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-emerald-100/80 text-[#10c03e] text-xs">
                      20+ Regioni
                    </Badge>
                    <Badge className="bg-blue-100/80 text-blue-700 text-xs">
                      110+ Province
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/30 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#203129] mb-3">
                    Gestione Relazioni Clienti
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    CRM integrato con WhatsApp Business
                  </p>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-100/80 text-purple-700 text-xs">
                      CRM Integrato
                    </Badge>
                    <Badge className="bg-green-100/80 text-green-700 text-xs">
                      Auto-Response
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Benefits Grid - Bento Style */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden group text-center hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#203129] mb-3">
                  Sicurezza Garantita
                </h4>
                <p className="text-gray-700">
                  Protezione dati GDPR compliant con crittografia end-to-end
                </p>
              </div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden group text-center hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#203129] mb-3">
                  Setup Veloce
                </h4>
                <p className="text-gray-700">
                  Configurazione in meno di 5 minuti con integrazione automatica
                </p>
              </div>
            </div>

            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden group text-center hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white/30 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#203129] mb-3">
                  Supporto 24/7
                </h4>
                <p className="text-gray-700">
                  Team di esperti sempre disponibile per assistenza
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bento Style */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/50 overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-blue-50/30 rounded-3xl"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-[#203129] mb-4">
                Pronto a Trasformare la Tua Attività Immobiliare?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Unisciti a migliaia di agenti immobiliari di successo in tutta
                Italia che stanno già utilizzando Immochat
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#10c03e] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-xl"
                  >
                    Inizia la Tua Prova Gratuita
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-200 text-[#203129] hover:bg-emerald-50 px-8 py-4 rounded-2xl"
                >
                  Prenota una Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Bento Grid */}
      <section id="come-funziona" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Come{" "}
              <span className="bg-gradient-to-r from-[#10c03e] to-emerald-500 bg-clip-text text-transparent">
                Funziona
              </span>{" "}
              Immochat
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
                  Registrati e Configura
                </h3>
                <p className="text-gray-700 mb-6">
                  Crea il tuo account e collega WhatsApp Business alla
                  piattaforma
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
                  Ricevi Richieste
                </h3>
                <p className="text-gray-700 mb-6">
                  I clienti ti contattano via WhatsApp per valutazioni
                  immobiliari
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
                  Invia Valutazioni
                </h3>
                <p className="text-gray-700 mb-6">
                  Genera e invia report professionali istantaneamente via
                  WhatsApp
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
                Inizia Subito - È Gratuito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
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
      </section>

      {/* Testimonials - Bento Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#203129] mb-4">
              Cosa Dicono i Nostri{" "}
              <span className="bg-gradient-to-r from-[#10c03e] to-emerald-500 bg-clip-text text-transparent">
                Agenti
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
                  "Immochat ha rivoluzionato il modo in cui comunico con i
                  clienti. Le valutazioni immobiliari sono ora istantanee e il
                  mio tasso di chiusura è aumentato del 40%."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10c03e] to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-sm">MR</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#203129]">Marco Rossi</div>
                    <div className="text-sm text-gray-600">
                      Immobiliare Roma
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
                  "L'integrazione WhatsApp è perfetta. I miei clienti adorano
                  ricevere report immobiliari istantanei, e questo mi distingue
                  dalla concorrenza."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-sm">GB</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#203129]">
                      Giulia Bianchi
                    </div>
                    <div className="text-sm text-gray-600">Immobili Milano</div>
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
      <footer id="contatti" className="py-16 relative">
        <div className="container  px-4">
          <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-12 border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/30 to-blue-50/30 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="mb-6">
                    <Link href="/">
                      <Image
                        src="/images/logo.png"
                        alt="Immochat Logo"
                        width={120}
                        height={30}
                        className="rounded-lg"
                      />
                    </Link>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Potenziamo i professionisti immobiliari italiani con
                    soluzioni innovative su WhatsApp.
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10c03e] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-[#203129]">
                    Servizi
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Valutazione Immobili
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Comunicazione Clienti
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Analisi di Mercato
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Generazione Lead
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-[#203129]">
                    Azienda
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Chi Siamo
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Carriere
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Stampa
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Partner
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-[#203129]">
                    Supporto
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Centro Assistenza
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Documentazione
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Contatta Supporto
                    </li>
                    <li className="hover:text-[#10c03e] cursor-pointer transition-colors">
                      Stato Sistema
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200/50 pt-8 text-center text-gray-600">
                <p>
                  &copy; 2025 Immochat. Tutti i diritti riservati. | Privacy
                  Policy | Termini di Servizio
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
