import { Router } from 'express';

import {
  addLectureToCourseById,
  createCourse,
  deleteCourseById,
  getAllCourses,
  getLecturesByCourseId,
  removeLectureFromCourse,
  updateCourseById
} from '../controllers/course.controller.js';
import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn
} from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

router
  .route('/')
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorizeRoles(['admin']),
    upload.single('thumbnail'),
    createCourse
  )
  .delete(
    isLoggedIn,
    authorizeRoles(['admin', 'mentor']),
    removeLectureFromCourse
  );

router
  .route('/:id')
  .get(isLoggedIn, authorizeSubscribers, getLecturesByCourseId)
  .post(
    isLoggedIn,
    authorizeRoles(['admin']),
    upload.single('lecture'),
    addLectureToCourseById
  )
  .patch(
    isLoggedIn,
    authorizeRoles(['admin']),
    upload.single('thumbnail'),
    updateCourseById
  )
  .delete(isLoggedIn, authorizeRoles(['admin']), deleteCourseById);

export default router;
