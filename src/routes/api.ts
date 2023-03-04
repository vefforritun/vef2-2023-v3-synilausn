import express, { Request, Response } from 'express';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  updateDepartment,
} from './departments.js';

export const router = express.Router();

export async function index(req: Request, res: Response) {
  return res.json([
    {
      href: '/departments',
      methods: ['GET', 'POST'],
    },
    {
      href: '/departments/:slug',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
    {
      href: '/departments/:slug/courses',
      methods: ['GET', 'POST'],
    },
    {
      href: '/departments/:slug/courses/:nr',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
  ]);
}

// Departments
router.get('/', index);
router.get('/departments', listDepartments);
router.get('/departments/:slug', getDepartment);
router.post('/departments', createDepartment);
router.patch('/departments/:slug', updateDepartment);
router.delete('/departments/:slug', deleteDepartment);
