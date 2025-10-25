import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Map, BarChart, Shield, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const regionalData = [
  { district: "Pune", yield: "High", mspCompliance: "95%", sentiment: "Positive" },
  { district: "Nagpur", yield: "Medium", mspCompliance: "88%", sentiment: "Neutral" },
  { district: "Lucknow", yield: "High", mspCompliance: "92%", sentiment: "Positive" },
  { district: "Bangalore", yield: "Low", mspCompliance: "75%", sentiment: "Negative" },
  { district: "Delhi", yield: "Medium", mspCompliance: "90%", sentiment: "Neutral" },
];

export default function GovernmentDashboardPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Government Dashboard</h1>
        <Button><FileText className="mr-2 h-4 w-4" /> Generate Policy Brief</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Districts Monitored</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Across 3 states</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall MSP Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
              <p className="text-xs text-muted-foreground">-2% from last quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmer Sentiment</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Neutral</div>
              <p className="text-xs text-muted-foreground">Based on grievance reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Policy Alerts</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Low yield in Bangalore</p>
            </CardContent>
          </Card>
        </div>
       <Card>
        <CardHeader>
          <CardTitle>Regional Analytics</CardTitle>
          <CardDescription>
            High-level view of agricultural performance across monitored districts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead>Yield Index</TableHead>
                <TableHead>MSP Compliance</TableHead>
                <TableHead>Grievance Sentiment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionalData.map((data) => (
                <TableRow key={data.district}>
                  <TableCell className="font-medium">{data.district}</TableCell>
                  <TableCell>{data.yield}</TableCell>
                  <TableCell>{data.mspCompliance}</TableCell>
                  <TableCell className={data.sentiment === 'Positive' ? 'text-green-500' : data.sentiment === 'Negative' ? 'text-red-500' : ''}>{data.sentiment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>AI Policy Recommendation</AlertTitle>
            <AlertDescription>
              Consider investigating the low yield in the <strong>Bangalore</strong> district. Potential factors include water scarcity or disease outbreak. A targeted support scheme could mitigate farmer distress.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
}
