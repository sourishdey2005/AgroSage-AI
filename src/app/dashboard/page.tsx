import Link from 'next/link';
import { ArrowRight, Leaf, Briefcase, Building } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const roles = [
  {
    name: 'Farmer',
    description: 'Personalized crop health and market insights for your farm.',
    href: '/dashboard/farmer',
    icon: <Leaf className="w-10 h-10 mb-4 text-primary" />,
  },
  {
    name: 'Agent/Trader',
    description: 'Real-time market analytics and trade optimization tools.',
    href: '/dashboard/agent',
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
  },
  {
    name: 'Government',
    description: 'Policy-level data intelligence and monitoring for your region.',
    href: '/dashboard/government',
    icon: <Building className="w-10 h-10 mb-4 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Welcome to AgroSageAI</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
        <div className="flex flex-col items-center gap-2 text-center p-8">
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Select Your Dashboard
          </h2>
          <p className="text-muted-foreground">
            Choose your role to access tailored tools and insights.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
            {roles.map((role) => (
              <Card key={role.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  {role.icon}
                  <CardTitle className="font-headline">{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={role.href}>
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
