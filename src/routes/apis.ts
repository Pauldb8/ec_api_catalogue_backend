import { Request, Response, Router } from 'express';
import ApiModel from '../models/apiModel';
import IApi from '../models/apiModel';
import { Document, Error } from 'mongoose';

const router = Router();

// searchableFields defines the fields to be searched. The order of the fields determines their priority in the search results.
const searchableFields = [
  'name',
  'context',
  'provider',
  'version',
  'description',
];

// GET APIs with optional search, tenant, and featured filters
router.route('/').get(async (req: Request, res: Response) => {
  try {
    const { search, tenant, featured } = req.query as {
      search?: string;
      tenant?: string;
      featured?: string;
    };

    const query: { [key: string]: unknown } = {};

    // Add search term condition if provided
    if (search) {
      query.$or = searchableFields.map(field => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    // Filter by tenant if specified
    if (tenant) {
      query.tenant = tenant;
    }

    // Filter by featured if specified
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const apis = await ApiModel.find(query); // Execute the query with filters

    // Sort the results based on the field importance if search term is provided
    if (search) {
      apis.sort((a, b) => {
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
    }

    res.json(apis);
  } catch (error) {
    console.error('Error retrieving/searching APIs:', error);
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

// POST a new API
router.route('/').post(async (req: Request, res: Response) => {
  try {
    // Validate and create a new API from the request body
    const newApi = new ApiModel(req.body);

    // Before saving, Mongoose automatically validates the newApi against the ApiSchema
    // If validation fails, Mongoose will throw a ValidationError
    await newApi.save();

    // If the document is successfully saved, return the created API object
    res.status(201).json(newApi);
  } catch (error) {
    console.error('Error creating a new API:', error);
    if ((error as Error).name === 'ValidationError') {
      res.status(400).send((error as Error).message);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// PATCH an API by ID
router.patch('/:apiId', async (req: Request, res: Response) => {
  const { apiId } = req.params;

  try {
    const updatedApi = await ApiModel.findOneAndUpdate(
      { id: apiId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedApi) {
      return res.status(404).send('API not found');
    }

    res.json(updatedApi);
  } catch (err) {
    const error = err as Error;
    console.error('Error partially updating API:', error);

    if (error instanceof Error.ValidationError) {
      return res.status(400).send(error.message);
    } else if (error.name === 'CastError') {
      return res.status(400).send(error.message);
    }
    res.status(500).send('Internal Server Error');
  }
});

export default router;
