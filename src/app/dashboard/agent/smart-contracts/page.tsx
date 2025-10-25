'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TransactionStatus = 'Confirmed' | 'Pending' | 'Failed';

type SmartContractLog = {
  txId: string;
  timestamp: string;
  farmer: string;
  agent: string;
  crop: string;
  volume: number; // in quintals
  price: number; // per quintal
  totalValue: number;
  status: TransactionStatus;
};

const generateMockLogs = (): SmartContractLog[] => {
  const farmers = ['Ramesh K.', 'Sita D.', 'Vijay S.', 'Anjali M.'];
  const crops = ['Tomato', 'Onion', 'Wheat', 'Potato'];
  const logs: SmartContractLog[] = [];
  for (let i = 0; i < 50; i++) {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const volume = Math.floor(Math.random() * 200) + 10;
    const price = Math.floor(Math.random() * 1000) + 1500;
    const date = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30);
    const statusOptions: TransactionStatus[] = ['Confirmed', 'Confirmed', 'Confirmed', 'Pending', 'Failed'];
    
    logs.push({
      txId: `0x${[...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
      timestamp: date.toISOString(),
      farmer: farmers[Math.floor(Math.random() * farmers.length)],
      agent: 'Self',
      crop,
      volume,
      price,
      totalValue: volume * price,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default function SmartContractLogsPage() {
  const [logs] = React.useState<SmartContractLog[]>(generateMockLogs);
  const { toast } = useToast();

  const copyTxId = (txId: string) => {
    navigator.clipboard.writeText(txId);
    toast({
      title: 'Copied!',
      description: 'Transaction ID copied to clipboard.',
    });
  };
  
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/20 text-green-700';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-700';
      case 'Failed': return 'bg-red-500/20 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Smart Contract Logs
        </h1>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileText /> Deal Transaction History
          </CardTitle>
          <CardDescription>
            An immutable, blockchain-style log of all completed and pending farmer deals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead className="text-right">Volume (qtl)</TableHead>
                <TableHead className="text-right">Total Value (₹)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.txId}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{log.txId}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyTxId(log.txId)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.farmer}</TableCell>
                  <TableCell className="font-medium">{log.crop}</TableCell>
                  <TableCell className="text-right">{log.volume}</TableCell>
                  <TableCell className="text-right font-mono">{log.totalValue.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusBadge(log.status)}>{log.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
