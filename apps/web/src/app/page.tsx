import { redirect } from 'next/navigation';
import { validateSession } from '@repo/auth';
import Form from '../components/form';
import Image from 'next/image';
import Link from 'next/link';

export default async function Page() {
	const { user } = await validateSession();
	if (!user) redirect('/login');
	return (
		<>
			<nav className="py-4 border-b-2 border-black">
				<Link href={'/api-keys'}>Api keys</Link>
			</nav>
			<div className="py-10" />
			<h1>Profile</h1>
			<Image src={user.image} alt="avatar" width={128} height={128} />
			<p>User id: {user.id}</p>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<Form action="/api/logout">
				<input type="submit" value="Sign out" />
			</Form>
		</>
	);
}
