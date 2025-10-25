'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type User = {
  name: string;
  email: string;
  avatar: string;
  fallback: string;
};

const users: Record<string, User> = {
  farmer: {
    name: 'Farmer User',
    email: 'farmer@example.com',
    avatar: 'https://i.pravatar.cc/150?u=farmer',
    fallback: 'FU',
  },
  agent: {
    name: 'Agent/Trader',
    email: 'agent@agrosage.in',
    avatar: 'https://i.pravatar.cc/150?u=agent',
    fallback: 'AT',
  },
  government: {
    name: 'Government Official',
    email: 'gov@agrosage.in',
    avatar: 'https://i.pravatar.cc/150?u=gov',
    fallback: 'GO',
  },
};

export function UserNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<User>(users.farmer);

  React.useEffect(() => {
    if (pathname.includes('/dashboard/agent')) {
      setCurrentUser(users.agent);
    } else if (pathname.includes('/dashboard/government')) {
      setCurrentUser(users.government);
    } else {
      setCurrentUser(users.farmer);
    }
  }, [pathname]);

  const handleLogout = () => {
    // In a real app, you would call your auth provider's logout method.
    // For now, we'll just redirect to the home page.
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.fallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
