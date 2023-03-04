import {
  ALLOWED_SEMESTERS,
  Course,
  Department,
  Links,
  Semester,
} from '../types.js';

export function valueToSementer(value: unknown): Semester | undefined {
  const found = ALLOWED_SEMESTERS.find((s) => s === value);

  return found;
}

export function courseMapper(potentialCourse: unknown): Course | null {
  const course = potentialCourse as Partial<Course> | null;

  if (!course || !course.courseId || !course.title || !course.slug) {
    return null;
  }

  const mapped: Course = {
    courseId: course.courseId,
    title: course.title,
    slug: course.slug,
    units: course.units ?? undefined,
    semester: valueToSementer(course.semester) ?? undefined,
    level: course.level ?? undefined,
    url: course.url ?? undefined,
  };

  return mapped;
}

export function coursesMapper(potentialCourses: unknown): Array<Course> {
  const courses = potentialCourses as Array<unknown> | null;

  if (!courses || !Array.isArray(courses)) {
    return [];
  }

  console.log('courses :>> ', courses);

  const mapped = courses.map(courseMapper);

  return mapped.filter((i): i is Course => Boolean(i));
}

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
