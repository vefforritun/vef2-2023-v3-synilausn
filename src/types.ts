export type DepartmentImport = {
  title: string;
  slug: string;
  description?: string;
  csv: string;
};

export type Link = {
  href: string;
};

export type Links = {
  self?: Link;
  next?: Link;
  prev?: Link;
  first?: Link;
  last?: Link;
  courses?: Link;
};

export type Department = {
  /** ID of the department */
  id: number;
  /** Title of the department */
  title: string;
  /** Slug of the department */
  slug: string;
  /** Description of the department */
  description?: string;
  /** List of courses */
  courses?: Array<Course>;
  /** Created date as ISO 8601 string */
  created?: string;
  /** Updated date as ISO 8601 string */
  updated?: string;
  _links?: Links;
};

export const ALLOWED_SEMESTERS = ['Vor', 'Sumar', 'Haust', 'Heilsárs'] as const;
export type Semester = typeof ALLOWED_SEMESTERS[number];

export type Course = {
  /** Course ID. */
  courseId: string;
  /** Title of the course. */
  title: string;
  /** Slug of the course. */
  slug: string;
  /** Units for finishing course. */
  units?: number;
  /** Semester the course is taught. */
  semester?: Semester;
  /** Level of the course. */
  level?: string;
  /** URL to the course. */
  url?: string;
};
