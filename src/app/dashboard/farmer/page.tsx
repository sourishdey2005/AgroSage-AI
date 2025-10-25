import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Leaf, DollarSign, Bot, Receipt, Settings } from 'lucide-react';
import { CropDiagnosisCard } from '@/components/dashboard/farmer/crop-diagnosis-card';
import { PriceForecastCard } from '@/components/dashboard/farmer/price-forecast-card';
import { AgrobotCard } from '@/components/dashboard/farmer/agrobot-card';

export default function FarmerDashboardPage() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Farmer Dashboard</h1>
            </div>

            <Tabs defaultValue="crop-health" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="crop-health"><Leaf className="mr-2 h-4 w-4"/>Crop Health</TabsTrigger>
                    <TabsTrigger value="market-insights"><DollarSign className="mr-2 h-4 w-4"/>Market Insights</TabsTrigger>
                    <TabsTrigger value="agrobot"><Bot className="mr-2 h-4 w-4"/>AgroBot</TabsTrigger>
                    <TabsTrigger value="receipts" disabled><Receipt className="mr-2 h-4 w-4"/>Receipts</TabsTrigger>
                    <TabsTrigger value="settings" disabled><Settings className="mr-2 h-4 w-4"/>Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="crop-health">
                    <CropDiagnosisCard />
                </TabsContent>
                <TabsContent value="market-insights">
                    <PriceForecastCard />
                </TabsContent>
                <TabsContent value="agrobot">
                    <AgrobotCard />
                </TabsContent>
            </Tabs>
        </>
    );
}
