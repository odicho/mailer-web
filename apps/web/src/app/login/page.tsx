import { getUser } from '@repo/auth';
import { redirect } from 'next/navigation';

const Page = async () => {
	const user = await getUser();
	if (user) redirect('/');
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div
				className="border bg-card text-card-foreground shadow-sm w-full max-w-lg mx-3 md:mx-auto my-20 p-5 rounded-xl"
				data-v0-t="card"
			>
				<div className="p-6 flex flex-col items-center space-y-6">
					<h1 className="text-3xl font-bold text-center">Login</h1>
					<p className="text-center text-gray-500">Choose your preferred method to continue</p>
					<div className="flex w-full justify-around">
						<a
							href="/login/github"
							type="button"
							className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center"
						>
							Login with GitHub
						</a>
						<button
							type="button"
							className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center"
						>
							Login with Google
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
