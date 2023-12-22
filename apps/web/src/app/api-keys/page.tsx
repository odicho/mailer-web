import crypto, { createHash } from 'crypto';
import { redirect } from 'next/navigation';
import { getUser } from '@repo/auth';
import Link from 'next/link';
import { createId } from '@paralleldrive/cuid2';

const Page = async () => {
	const user = await getUser();
	if (!user) redirect('/login');

	const id = createId();
	const secret = crypto.randomBytes(20).toString('hex');
	const hash = createHash('sha256');
	const hashedSecret = hash.update(secret).digest('hex');

	return (
		<>
			<nav className="py-4 border-b-2 border-black">
				<Link href={'/'}>Home</Link>
			</nav>
			<div className="py-10" />
			<h1>Api Keys</h1>
			<p>id: {id}</p>
			<p>secret: {secret}</p>
			<p>hashed: {hashedSecret}</p>
		</>
	);
};

export default Page;
