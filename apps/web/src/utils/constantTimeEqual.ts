import { timingSafeEqual } from 'crypto';

export function constantTimeEqual(str1: string, str2: string) {
	const buf1 = Buffer.from(str1, 'utf-8');
	const buf2 = Buffer.from(str2, 'utf-8');

	try {
		return timingSafeEqual(buf1, buf2);
	} catch (err) {
		return false;
	}
}
