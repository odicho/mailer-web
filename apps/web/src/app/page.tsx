import { redirect } from 'next/navigation';
import { getUser } from '@repo/auth';
import Form from '../components/form';

const Page = async () => {
	const user = await getUser();
	if (!user) redirect('/login');
	return (
		<>
			<h1>Profile</h1>
			<p>User id: {user.id}</p>
			<p>Username: {user.username}</p>
			<p>Email: {user.email}</p>
			<Form action="/api/logout">
				<input type="submit" value="Sign out" />
			</Form>
		</>
	);
};

export default Page;
