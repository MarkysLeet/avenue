import { Literata } from 'next/font/google';

export const headingFont = Literata({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-heading',
});
