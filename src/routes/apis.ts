import { Request, Response, Router } from 'express';
import { readFile } from 'fs/promises'; // Note the use of fs/promises for async readFile

const router = Router();

// Asynchronously load and parse the APIs JSON
const loadApis = async () => {
	try {
		const data = await readFile('all-apis.json', 'utf8');

		return JSON.parse(data);
	} catch (error) {
		console.error('Error loading APIs:', error);
		return []; // Return an empty array in case of error
	}
};

let apisCache: any[]; // Cache the APIs to avoid reading the file on each request

router.route('/').get(async (req: Request, res: Response) => {
	if (!apisCache) {
		apisCache = await loadApis(); // Load and cache the APIs if not already done
	}
	res.json(apisCache);
});

router.route('/:apiId').get(async (req: Request, res: Response) => {
	if (!apisCache) {
		apisCache = await loadApis(); // Ensure APIs are loaded and cached
	}
	const { apiId } = req.params;
	const api = apisCache.find(api => api.id.toString() === apiId);
	if (api) {
		res.json(api);
	} else {
		res.status(404).send('API not found');
	}
});

export default router;
