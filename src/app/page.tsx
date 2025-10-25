import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BarChart,
  Leaf,
  DollarSign,
  ShieldCheck,
  Tractor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/layout/header';
import { SiteFooter } from '@/components/layout/footer';
import { placeholderImages } from '@/lib/placeholder-images.json';

const heroImage = placeholderImages.find(p => p.id === 'hero');

const features = [
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: 'AI Crop Diagnosis',
    description: 'Upload crop images to detect diseases and receive instant treatment advice.',
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: 'Price Prediction',
    description: 'Forecast crop prices for the next 7 days to maximize your profits.',
  },
  {
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    title: 'Intelligent Sell Suggestions',
    description: 'Get AI-powered recommendations on the best time and place to sell your crops.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'AgroBot Assistant',
    description: 'Our AI chatbot answers your farming questions 24/7 in multiple languages.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Role-Based Dashboards',
    description: 'Tailored insights for Farmers, Agents, and Government Officials.',
  },
  {
    icon: <Tractor className="w-8 h-8 text-primary" />,
    title: 'Digital Receipts',
    description: 'Automatically generate and store digital receipts for all your transactions.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground">
                Empowering Indian Farmers with Predictive AI 🌾
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                AgroSageAI is your autonomous farm-to-market decision platform for real-time crop health, dynamic price forecasting, and intelligent decision automation.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/dashboard">Get Started <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">A Smarter Way to Farm</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                AgroSageAI brings cutting-edge technology to your fingertips, helping you make data-driven decisions at every step.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 md:py-28 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">From Farm to Market, Optimized by AI</h2>
                <p className="text-muted-foreground">
                  AgroSageAI was born from a vision to bridge the technology gap in Indian agriculture. We provide a pure software solution—no expensive hardware needed—to bring the power of artificial intelligence to every farmer, trader, and policymaker.
                </p>
                <p className="text-muted-foreground">
                  Our platform integrates advanced AI models for disease detection, price forecasting, and more, all presented through an intuitive and accessible dashboard. We're dedicated to building a more efficient, profitable, and sustainable agricultural ecosystem.
                </p>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
                 {placeholderImages[1] && <Image
                  src={placeholderImages[1].imageUrl}
                  alt={placeholderImages[1].description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={placeholderImages[1].imageHint}
                />}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
