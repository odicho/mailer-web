module.exports = {
	reactStrictMode: true,
	transpilePackages: ['@repo/db', '@repo/auth'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
	},
};
