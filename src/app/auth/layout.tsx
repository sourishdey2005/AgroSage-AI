import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline sm:inline-block">
                AgroWise AI
              </span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center py-12">
        {children}
      </main>
    </div>
  );
}
