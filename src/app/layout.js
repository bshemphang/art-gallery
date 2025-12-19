import { Inter } from 'next/font/google'; 
import './globals.css';

// Configure the font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Art Gallery',
  description: 'A Curated Collection of Modern Art',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light"> 
      <body className={inter.className}>{children}</body> 
    </html>
  );
}