import { Router } from 'express';

import {
  contactUs,
  userStats
} from '../controllers/miscellaneous.controller.js';
import { authorizeRoles, isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizeRoles('admin'), userStats);

export default router;
