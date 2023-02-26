export type Department = {
  /** Title of the department */
  title: string;
  /** Slug of the department */
  slug: string;
  /** Description of the department */
  description: string;
  /** Filename of the CSV file */
  csv: string;
  /** List of courses */
  courses?: Array<Course>;
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
  semester: Semester;
  /** Level of the course. */
  level?: string;
  /** URL to the course. */
  url?: string;
};

export function valueToSementer(value: unknown): Semester | undefined {
  const found = ALLOWED_SEMESTERS.find((s) => s === value);

  return found;
}
