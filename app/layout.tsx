import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Providers from './providers';
import '../styles/globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'Orbit PM',
  description: 'Senior-level SaaS project management platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
