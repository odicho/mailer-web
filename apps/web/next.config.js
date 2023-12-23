module.exports = {
	reactStrictMode: true,
	transpilePackages: ['@repo/db', '@repo/auth', '@repo/ui'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},
};
