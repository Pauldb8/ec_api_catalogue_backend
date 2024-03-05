import { Request, Response, Router } from 'express';
import ApiModel from '../models/apiModel';

const router = Router();

// GET all APIs
router.route('/').get(async (req: Request, res: Response) => {
  try {
    const apis = await ApiModel.find(); // Retrieve all APIs from the database
    res.json(apis);
  } catch (error) {
    console.error('Error retrieving APIs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET a single API by ID
router.route('/:apiId').get(async (req: Request, res: Response) => {
  const { apiId } = req.params;
  try {
    const api = await ApiModel.findOne({ id: apiId });
    if (api) {
      res.json(api);
    } else {
      res.status(404).send('API not found');
    }
  } catch (error) {
    console.error('Error finding API:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
