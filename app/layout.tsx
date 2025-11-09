import type { ReactNode } from 'react';
import '../styles/globals.css';
import { headingFont } from './fonts';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${headingFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
