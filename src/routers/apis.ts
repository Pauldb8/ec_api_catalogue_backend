import { Router, type Request, type Response } from 'express';
import fs from 'fs/promises';
const apis = await fs.readFile('all-apis.json', 'utf8').then(s =>
	s
		.split('\n')
		.filter(l => l)
		.map(l => JSON.parse(l))
);
const router = Router();
router.route('/').get((req: Request, res: Response) => res.json(apis));
router.route('/:apiId').get((req: Request, res: Response) => {
	const { apiId } = req.params;
	// Find the API with the matching id
	const api = apis.find(api => api.id.toString() === apiId);
	if (api) {
		res.json(api); // If found, return the API
	} else {
		res.status(404).send('API not found'); // If not found, return a 404 error
	}
});
export default router;