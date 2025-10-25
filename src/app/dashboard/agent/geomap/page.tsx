'use client';

import * as React from 'react';
import Image from 'next/image';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, User, Dot } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

const mapImage = placeholderImages.find(p => p.id === 'geomap');

type FarmerStatus = 'Online' | 'Offline' | 'In-Transaction';

type FarmerLocation = {
    id: string;
    name: string;
    avatar: string;
    fallback: string;
    location: string;
    status: FarmerStatus;
    lastSeen: string;
};

const mockFarmers: FarmerLocation[] = [
    { id: 'f1', name: 'Ramesh Kumar', avatar: 'https://i.pravatar.cc/150?u=ramesh', fallback: 'RK', location: 'Pune, MH', status: 'Online', lastSeen: 'Active now' },
    { id: 'f2', name: 'Sita Devi', avatar: 'https://i.pravatar.cc/150?u=sita', fallback: 'SD', location: 'Lucknow, UP', status: 'In-Transaction', lastSeen: 'Active now' },
    { id: 'f3', name: 'Vijay Singh', avatar: 'https://i.pravatar.cc/150?u=vijay', fallback: 'VS', location: 'Nagpur, MH', status: 'Online', lastSeen: 'Active now' },
    { id: 'f4', name: 'Anjali Mishra', avatar: 'https://i.pravatar.cc/150?u=anjali', fallback: 'AM', location: 'Bangalore, KA', status: 'Offline', lastSeen: '5 hours ago' },
    { id: 'f5', name: 'Suresh Patil', avatar: 'https://i.pravatar.cc/150?u=suresh', fallback: 'SP', location: 'Pune, MH', status: 'Online', lastSeen: 'Active now' },
    { id: 'f6', name: 'Meena Kumari', avatar: 'https://i.pravatar.cc/150?u=meena', fallback: 'MK', location: 'Delhi', status: 'Offline', lastSeen: '2 days ago' },
];

export default function BuyerSellerGeoMapPage() {

    const statusColors: Record<FarmerStatus, string> = {
        Online: 'text-green-500',
        Offline: 'text-gray-500',
        'In-Transaction': 'text-blue-500',
    };

    return (
        <div className="space-y-6">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Buyer-Seller GeoMap
            </h1>

            <Card className="grid lg:grid-cols-3 gap-0 overflow-hidden">
                <div className="lg:col-span-2 relative min-h-[400px] lg:min-h-0">
                   {mapImage && (
                        <Image 
                            src={mapImage.imageUrl}
                            alt={mapImage.description}
                            data-ai-hint={mapImage.imageHint}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                   )}
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <p className="text-white bg-black/50 p-4 rounded-md">Live map view coming soon</p>
                   </div>
                </div>

                <div className="lg:col-span-1 border-l">
                    <CardHeader>
                        <CardTitle className='font-headline flex items-center gap-2'>
                            <User /> Connected Farmers
                        </CardTitle>
                        <CardDescription>
                            Real-time status and location of your network.
                        </CardDescription>
                        <div className="pt-2">
                             <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="In-Transaction">In-Transaction</SelectItem>
                                    <SelectItem value="Offline">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockFarmers.map(farmer => (
                                    <TableRow key={farmer.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={farmer.avatar} />
                                                    <AvatarFallback>{farmer.fallback}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className='font-medium'>{farmer.name}</p>
                                                    <div className='flex items-center'>
                                                        <Dot className={cn('h-6 w-6 -ml-2', statusColors[farmer.status])} />
                                                        <p className={cn('text-xs', statusColors[farmer.status])}>{farmer.status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <p className='text-sm'>{farmer.location}</p>
                                            <p className='text-xs text-muted-foreground'>{farmer.lastSeen}</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}