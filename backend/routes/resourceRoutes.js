import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import { createResource, deleteResource, getResources } from '../controllers/resourceController.js';
import { resourceSchema, validate } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getResources);
router.post('/', validate(resourceSchema), createResource);
router.delete('/:id', deleteResource);

export default router;
