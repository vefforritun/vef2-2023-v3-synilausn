import {
  ALLOWED_SEMESTERS,
  Course,
  CourseDb,
  Department,
  Links,
  Semester,
} from '../types.js';

/**
 * Map a potential semester value to a semester. We use the `unknown` type to
 * represent a value that we don't know the type of.
 * @param value Potential semester value.
 * @returns Semester or undefined if the value is not a semester.
 */
export function valueToSementer(value: unknown): Semester | undefined {
  const found = ALLOWED_SEMESTERS.find((s) => s === value);

  return found;
}

/**
 * Map a potential course to a course.
 * @param potentialCourse Data that might be a course.
 * @returns Mapped course or null if the data is not a course.
 */
export function courseMapper(potentialCourse: unknown): Course | null {
  // Type cast the potential course to a Partial `CourseDb` or null.
  // This allows us to use the optional chaining operator to safely access
  // properties on the potential course and mapping to a course if our
  // conditions are met.
  const course = potentialCourse as Partial<CourseDb> | null;

  if (!course || !course.id || !course.course_id || !course.title) {
    return null;
  }

  // Create exactly the course object we want to return, i.e. the mapped course.
  // This is not perfect since we are not checking if the values are of the
  // correct type, but we are assuming that the database returns the correct
  // types. We should probably add some validation...
  const mapped: Course = {
    id: course.id,
    courseId: course.course_id,
    title: course.title,
    units: course.units ?? undefined,
    semester: valueToSementer(course.semester) ?? undefined,
    level: course.level ?? undefined,
    url: course.url ?? undefined,
  };

  return mapped;
}

/**
 * Map a potential list of courses to an array of courses.
 * @param potentialCourses Data that might be a list of courses.
 * @returns Array of mapped courses, empty if no courses are mapped.
 */
export function coursesMapper(potentialCourses: unknown): Array<Course> {
  const courses = potentialCourses as Array<unknown> | null;

  if (!courses || !Array.isArray(courses)) {
    return [];
  }

  const mapped = courses.map(courseMapper);

  // Filter out any null values from the mapped array using the `filter` method
  // and a type guard function.
  return mapped.filter((i): i is Course => Boolean(i));
}

/**
 * Map a potential department to a department.
 * @param potentialDepartment Data that might be a department.
 * @param potentialCourses Data that might be a list of courses.
 * @returns Mapped department or null if the data is not a department.
 */
export function departmentMapper(
  potentialDepartment: unknown,
  potentialCourses?: unknown,
): Department | null {
  const department = potentialDepartment as Partial<Department> | null;

  if (!department || !department.id || !department.title || !department.slug) {
    return null;
  }

  const courses = coursesMapper(potentialCourses);

  const links: Links = {
    self: {
      href: `/departments/${department.slug}`,
    },
    courses: {
      href: `/departments/${department.slug}/courses`,
    },
  };

  const mapped: Department = {
    id: department.id,
    title: department.title,
    slug: department.slug,
    description: department.description ?? undefined,
    created: department.created,
    updated: department.updated,
    courses: courses.length ? courses : undefined,
    _links: links,
  };

  return mapped;
}

/**
 * Map a potential array of departments to an array of departments.
 * @param potentialDepartments Data that might be a list of departments.
 * @returns Array of mapped departments, empty if no departments are mapped.
 */
export function departmentsMapper(
  potentialDepartments: unknown,
): Array<Department> {
  const departments = potentialDepartments as Array<unknown> | null;

  if (!departments) {
    return [];
  }

  const mapped = departments.map((dept) => departmentMapper(dept));

  return mapped.filter((i): i is Department => Boolean(i));
}
