import { unstable_cache } from 'next/cache';

// biome-ignore lint:
export async function withUnstableCache<T extends (...args: any[]) => Promise<any>>(opts: {
	fn: T;
	args: Parameters<T>;
	keys: string[];
	tags: string[];
}) {
	const cachedResult = await unstable_cache(async (...args) => opts.fn(...args), [...opts.keys], {
		tags: opts.tags,
	})(...opts.args);

	return cachedResult as Awaited<ReturnType<T>>;
}
