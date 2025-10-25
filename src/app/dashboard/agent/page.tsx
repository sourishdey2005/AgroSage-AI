import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, BarChart, Users, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const marketData = [
  { crop: "Tomato", mandi: "Pune", price: "₹25/kg", trend: "up" },
  { crop: "Onion", mandi: "Nagpur", price: "₹30/kg", trend: "down" },
  { crop: "Wheat", mandi: "Lucknow", price: "₹22/kg", trend: "stable" },
  { crop: "Potato", mandi: "Bangalore", price: "₹20/kg", trend: "up" },
  { crop: "Rice", mandi: "Delhi", price: "₹40/kg", trend: "stable" },
]

export default function AgentDashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Agent/Trader Dashboard</h1>
        <Button><FileText className="mr-2 h-4 w-4" /> Generate Report</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mandis</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Across 3 states</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmer Network</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+12 since last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performing Crop</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Onion</div>
              <p className="text-xs text-muted-foreground">Highest volume this month</p>
            </CardContent>
          </Card>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Live Market Board</CardTitle>
          <CardDescription>Real-time prices from connected mandis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Mandi</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>7-Day Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((data) => (
                <TableRow key={data.crop}>
                  <TableCell className="font-medium">{data.crop}</TableCell>
                  <TableCell>{data.mandi}</TableCell>
                  <TableCell>{data.price}</TableCell>
                  <TableCell className={data.trend === 'up' ? 'text-green-500' : data.trend === 'down' ? 'text-red-500' : ''}>
                    {data.trend}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
