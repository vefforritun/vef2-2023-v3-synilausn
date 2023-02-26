import pg from 'pg';
import { Course, Department } from '../types';

let savedPool: pg.Pool | undefined;

export function getPool(): pg.Pool {
  if (savedPool) {
    return savedPool;
  }

  const { DATABASE_URL: connectionString } = process.env;
  if (!connectionString) {
    console.error('vantar DATABASE_URL í .env');
    throw new Error('missing DATABASE_URL');
  }

  savedPool = new pg.Pool({ connectionString });

  savedPool.on('error', (err) => {
    console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
    throw new Error('error in db connection');
  });

  return savedPool;
}

export async function query(
  q: string,
  values: Array<unknown> = [],
  silent = false,
) {
  const pool = getPool();

  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    if (!silent) console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (!silent) console.error('unable to query', e);
    if (!silent) console.info(q, values);
    return null;
  } finally {
    client.release();
  }
}

export async function poolEnd() {
  const pool = getPool();
  await pool.end();
}

export async function insertDepartment(
  department: Department,
  silent = false,
): Promise<number | null> {
  const { title, slug, description } = department;
  const result = await query(
    'INSERT INTO department (title, slug, description) VALUES ($1, $2, $3) RETURNING id',
    [title, slug, description],
    silent,
  );

  const id = result?.rows?.[0]?.id;
  if (typeof id !== 'number') {
    return null;
  }

  return id;
}

export async function insertCourse(
  course: Course,
  departmentId: number,
  silent = false,
): Promise<number | null> {
  const { title, slug, units, semester, level, url, courseId } = course;
  const result = await query(
    'INSERT INTO course (title, slug, units, semester, level, url, department_id, course_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [title, slug, units, semester, level, url, departmentId, courseId],
    silent,
  );

  const id = result?.rows?.[0]?.id;
  if (typeof id !== 'number') {
    return null;
  }

  return id;
}
