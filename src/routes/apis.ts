import { Request, Response, Router } from 'express';
import ApiModel from '../models/apiModel';
import IApi from '../models/apiModel'; // Import the IApi type
import { Document } from 'mongoose';

const router = Router();

// searchableFields defines the fields to be searched. The order of the fields determines their priority in the search results.
const searchableFields = [
  'name',
  'context',
  'provider',
  'version',
  'description',
];

// GET APIs based on a search term across multiple fields
router.route('/').get(async (req: Request, res: Response) => {
  try {
    const { search } = req.query as { search?: string };

    // If no search term is provided, return all APIs
    if (!search) {
      const apis = await ApiModel.find();
      return res.json(apis);
    }

    // Build the query for searching across multiple fields
    const query = {
      $or: searchableFields.map(field => ({
        [field]: { $regex: search, $options: 'i' },
      })),
    };

    let apis = await ApiModel.find(query); // Execute the search query

    // Sort the results based on the field importance
    apis = apis.sort((a, b) => {
      let aIndex = searchableFields.length;
      let bIndex = searchableFields.length;
      searchableFields.forEach((field, index) => {
        if (
          (
            a[
              field as keyof typeof IApi &
                keyof Document<unknown, object, typeof IApi>
            ] as string
          )
            .toLowerCase()
            .includes((search as string).toLowerCase())
        )
          aIndex = Math.min(aIndex, index);
        if (
          (
            b[
              field as keyof typeof IApi &
                keyof Document<unknown, object, typeof IApi>
            ] as string
          )
            .toLowerCase()
            .includes((search as string).toLowerCase())
        )
          bIndex = Math.min(bIndex, index);
      });
      return aIndex - bIndex;
    });

    res.json(apis);
  } catch (error) {
    console.error('Error searching APIs:', error);
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
