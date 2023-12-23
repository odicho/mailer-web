'use client';

import { useState } from 'react';
import { createApiKey, deleteApiKey, verifyApiKey } from './actions';
import { useRouter } from 'next/navigation';

export function CreateAPIKeyButton() {
	const router = useRouter();
	const [currentClientId, setCurrentClientId] = useState('');
	const [currentSecret, setCurrentSecret] = useState('');

	const [inputVal, setInputVal] = useState('');

	return (
		<>
			<p>Current clientId: {currentClientId}</p>
			<p>Current secret: {currentSecret}</p>
			<button
				type="button"
				className="border border-black p-1"
				onClick={async () => {
					const { clientId, clientSecret } = await createApiKey();
					router.refresh();
					setCurrentClientId(clientId);
					setCurrentSecret(clientSecret);
				}}
			>
				<b>Create new key</b>
			</button>
			<input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
			<button
				type="button"
				className="border border-black p-1"
				onClick={async () => {
					console.log(await verifyApiKey(currentClientId, inputVal));
				}}
			>
				Verify key
			</button>
		</>
	);
}

export function DeleteAPIKeyButton({ clientId, userId }: { clientId: string; userId: string }) {
	return (
		<>
			<button
				type="button"
				className="border border-black p-1"
				onClick={async () => {
					await deleteApiKey(clientId, userId);
				}}
			>
				Delete
			</button>
		</>
	);
}
