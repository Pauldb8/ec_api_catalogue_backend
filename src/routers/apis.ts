import { Router } from 'express';
import fs from 'fs/promises';
import { apisJSONPath } from '@lib/config/environment.js';

const apis = await fs.readFile(apisJSONPath, 'utf8').then(s =>
	s
		.split('\n')
		.filter(l => l)
		.map(l => JSON.parse(l))
);
const router = Router();

router.route('/').get<unknown, unknown[]>((req, res, next) => res.json(apis));

export default router;
