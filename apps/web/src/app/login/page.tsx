import { getUser } from '@repo/auth';
import { redirect } from 'next/navigation';

const Page = async () => {
	const user = await getUser();
	if (user) redirect('/');
	return (
		<div className="flex justify-center items-center min-h-full">
			<div className="flex gap-10">
				<a
					href="/login/github"
					type="button"
					className="rounded-md border-black py-2 px-6 border text-sm font-semibold flex items-center justify-center hover:text-blue-500 hover:border-blue-500"
				>
					Login with GitHub
				</a>
				<a
					href="/login/github"
					type="button"
					className="rounded-md border-black py-2 px-6 border text-sm font-semibold flex items-center justify-center hover:text-blue-500 hover:border-blue-500"
				>
					Login with Google
				</a>
			</div>
		</div>
	);
};

export default Page;
