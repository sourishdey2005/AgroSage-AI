'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Bell,
  Megaphone,
  ArrowUp,
  ArrowDown,
  Warehouse,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type AlertType = 'price' | 'supply' | 'announcement';

type AlertItem = {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
};

const initialAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'price',
    title: 'Price Spike: Tomato in Pune',
    description: 'Tomato prices have increased by 15% in Pune mandi in the last 2 hours.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
  },
  {
    id: 'alert-2',
    type: 'supply',
    title: 'New Lot Available: Wheat in Lucknow',
    description: 'A new lot of 500 quintals of high-grade wheat is now available in Lucknow.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
  },
  {
    id: 'alert-3',
    type: 'announcement',
    title: 'Market Holiday Next Week',
    description: 'All mandis will be closed next Friday for a regional festival.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
  },
];

const alertIcons: Record<AlertType, React.ReactNode> = {
  price: <ArrowUp className="h-4 w-4" />,
  supply: <Warehouse className="h-4 w-4" />,
  announcement: <Megaphone className="h-4 w-4" />,
};

const alertColors: Record<AlertType, string> = {
    price: 'border-yellow-500/50 bg-yellow-500/10',
    supply: 'border-blue-500/50 bg-blue-500/10',
    announcement: 'border-indigo-500/50 bg-indigo-500/10'
};


export default function AlertConsolePage() {
  const [alerts, setAlerts] = React.useState<AlertItem[]>(initialAlerts);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? {...a, isRead: true} : a));
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({...a, isRead: true})));
  };

  // Simulate new alerts
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: AlertItem = {
        id: `alert-${Date.now()}`,
        type: 'price',
        title: 'Price Drop: Onion in Nagpur',
        description: 'Onion prices have fallen by 8% due to increased supply.',
        timestamp: new Date(),
        isRead: false,
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 15000); // New alert every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Live Alert Console
        </h1>
        <Button onClick={markAllAsRead}>Mark All as Read</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Bell /> Real-time Market Notifications
          </CardTitle>
          <CardDescription>
            A live feed of important events, price changes, and supply updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map(alert => (
              <Alert key={alert.id} className={cn(alertColors[alert.type], !alert.isRead && 'border-primary')}>
                {alertIcons[alert.type]}
                <AlertTitle className='flex justify-between items-center'>
                    <span>{alert.title}</span>
                    {!alert.isRead && <Badge>New</Badge>}
                </AlertTitle>
                <AlertDescription>
                  {alert.description}
                </AlertDescription>
                <div className='flex justify-between items-center mt-2'>
                    <p className='text-xs text-muted-foreground'>
                        {alert.timestamp.toLocaleTimeString()} - {alert.timestamp.toLocaleDateString()}
                    </p>
                    {!alert.isRead && <Button variant="link" size="sm" onClick={() => markAsRead(alert.id)}>Mark as read</Button>}
                </div>
              </Alert>
            ))}
            {alerts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12" />
                    <p className='mt-4'>No alerts right now. Everything is quiet.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
