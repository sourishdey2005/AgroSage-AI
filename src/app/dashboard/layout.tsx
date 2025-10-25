'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Package2,
  Briefcase,
  Building,
  Leaf,
  LineChart,
  Map,
  Percent,
  BrainCircuit,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard/header';
import { cn } from '@/lib/utils';

const agentNavItems = [
  {
    title: 'Market Analytics',
    icon: LineChart,
    href: '/dashboard/agent',
  },
  {
    title: 'Regional Suitability',
    icon: Map,
    href: '/dashboard/agent/regional-suitability',
  },
  {
    title: 'Commission Tracker',
    icon: Percent,
    href: '/dashboard/agent/commission-tracker',
  },
  {
    title: 'AI Recommendations',
    icon: BrainCircuit,
    href: '/dashboard/agent/recommendations',
  },
  {
    title: 'Risk Heatmap',
    icon: ShieldAlert,
    href: '/dashboard/agent/risk-heatmap',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAgentDashboard = pathname.startsWith('/dashboard/agent');

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">AgroSageAI</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === '/dashboard' && 'bg-muted text-primary'
                )}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground/80 mt-4">ROLES</p>
              <Link
                href="/dashboard/farmer"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname.startsWith('/dashboard/farmer') && 'bg-muted text-primary'
                )}
              >
                <Leaf className="h-4 w-4" />
                Farmer
              </Link>
              <Link
                href="/dashboard/agent"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                   isAgentDashboard && 'bg-muted text-primary'
                )}
              >
                <Briefcase className="h-4 w-4" />
                Agent/Trader
              </Link>
              
              {isAgentDashboard && (
                <div className="grid items-start pl-7 text-sm font-medium">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground/80 mt-2">AGENT TOOLS</p>
                  {agentNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === item.href && 'text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
              
              <Link
                href="/dashboard/government"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                   pathname.startsWith('/dashboard/government') && 'bg-muted text-primary'
                )}
              >
                <Building className="h-4 w-4" />
                Government
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Our AgroBot is here to help you 24/7. Ask any question.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Ask AgroBot
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
