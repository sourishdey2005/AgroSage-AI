import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building } from 'lucide-react';

export default function GovernmentDashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Government Dashboard</h1>
      </div>
       <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center p-8">
          <Building className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            The Government dashboard with policy insights and regional analytics is under construction.
          </p>
        </div>
      </div>
    </>
  );
}
