import { NextFunction, Request, Response } from 'express';
import slugify from 'slugify';
import {
  conditionalUpdate,
  deleteDepartmentBySlug,
  getDepartmentBySlug,
  getDepartments,
  insertDepartment,
} from '../lib/db.js';
import { departmentMapper } from '../lib/mappers.js';
import {
  atLeastOneBodyValueValidator,
  departmentDoesNotExistValidator,
  descriptionValidator,
  genericSanitizer,
  titleValidator,
  validationCheck,
  xssSanitizer,
} from '../lib/validation.js';
import { Department } from '../types.js';

export async function listDepartments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const departments = await getDepartments();

  if (!departments) {
    return next(new Error('unable to get departments'));
  }

  return res.json(departments);
}

export async function getDepartment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { slug } = req.params;

  const department = await getDepartmentBySlug(slug);

  if (!department) {
    return next();
  }

  return res.json(department);
}

export async function createDepartmentHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title, description } = req.body;

  const departmentToCreated: Omit<Department, 'id'> = {
    title,
    slug: slugify(title),
    description,
    courses: [],
  };

  const createdDeprtment = await insertDepartment(departmentToCreated, false);

  if (!createdDeprtment) {
    return next(new Error('unable to create department'));
  }

  return res.json(departmentMapper(createdDeprtment));
}

export const createDepartment = [
  titleValidator,
  descriptionValidator,
  departmentDoesNotExistValidator,
  xssSanitizer('title'),
  xssSanitizer('description'),
  validationCheck,
  genericSanitizer('title'),
  genericSanitizer('description'),
  createDepartmentHandler,
];

export const updateDepartment = [
  titleValidator.optional(),
  descriptionValidator.optional(),
  atLeastOneBodyValueValidator(['title', 'description']),
  xssSanitizer('title'),
  xssSanitizer('description'),
  validationCheck,
  updateDepartmentHandler,
];

export async function updateDepartmentHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { slug } = req.params;
  const department = await getDepartmentBySlug(slug);

  if (!department) {
    return next();
  }

  const { title, description } = req.body;

  const fields = [
    typeof title === 'string' && title ? 'title' : null,
    typeof title === 'string' && title ? 'slug' : null,
    typeof description === 'string' && description ? 'description' : null,
  ];

  const values = [
    typeof title === 'string' && title ? title : null,
    typeof title === 'string' && title ? slugify(title) : null,
    typeof description === 'string' && description ? description : null,
  ];

  const updated = await conditionalUpdate(
    'department',
    department.id,
    fields,
    values,
  );

  if (!updated) {
    return next(new Error('unable to update department'));
  }

  const updatedDepartment = departmentMapper(updated.rows[0]);
  return res.json(updatedDepartment);
}

export async function deleteDepartment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { slug } = req.params;
  const department = await getDepartmentBySlug(slug);

  if (!department) {
    return next();
  }

  const result = await deleteDepartmentBySlug(slug);

  if (!result) {
    return next(new Error('unable to delete department'));
  }

  return res.status(204).json({});
}
