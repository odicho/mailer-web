import { redirect } from 'next/navigation';
import { getUser } from '@repo/auth';
import Link from 'next/link';

const Page = async () => {
	const user = await getUser();
	if (!user) redirect('/login');
	return (
		<>
			<nav className="py-4 border-b-2 border-black">
				<Link href={'/'}>Home</Link>
			</nav>
			<div className="py-10" />
			<h1>Api Keys</h1>
		</>
	);
};

export default Page;
