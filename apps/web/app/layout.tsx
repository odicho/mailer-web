import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { db } from '@repo/db';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Turborepo',
	description: 'Generated by create turbo',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
