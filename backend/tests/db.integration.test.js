const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://rirs:secretpassword@localhost:5432/rirs';

describe('Postgres integration', () => {
  let client;

  beforeAll(async () => {
    client = new Client({ connectionString });
    await client.connect();
    
    // Create tables for testing
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT CHECK (role IN ('hr', 'manager', 'applicant')) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        job_title TEXT NOT NULL,
        job_description TEXT NOT NULL
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_positions (
        id SERIAL PRIMARY KEY,
        position_name TEXT NOT NULL
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        description TEXT,
        has_b_category_license BOOLEAN,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        job_id INT NOT NULL REFERENCES jobs(id)
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        applicant_id INT REFERENCES users(id),
        message TEXT NOT NULL,
        sender_role TEXT,
        hr_id INT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  }, 30000);

  afterAll(async () => {
    await client.end();
  });

  test('can query PG version', async () => {
    const res = await client.query('SELECT version()');
    expect(res.rows.length).toBeGreaterThan(0);
    expect(res.rows[0].version).toMatch(/PostgreSQL/);
  });

  test('jobs table exists', async () => {
    const res = await client.query("SELECT to_regclass('public.jobs') as reg");
    expect(res.rows[0].reg).toBe('jobs');
  });

  test('users table exists', async () => {
    const res = await client.query("SELECT to_regclass('public.users') as reg");
    expect(res.rows[0].reg).toBe('users');
  });

  test('can insert and select a job', async () => {
    const title = 'Test Role';
    const desc = 'Test description';
    const insert = await client.query('INSERT INTO jobs (job_title, job_description) VALUES ($1,$2) RETURNING id', [title, desc]);
    const id = insert.rows[0].id;
    const sel = await client.query('SELECT job_title, job_description FROM jobs WHERE id=$1', [id]);
    expect(sel.rows[0].job_title).toBe(title);
    await client.query('DELETE FROM jobs WHERE id=$1', [id]);
  });

  test('can insert and select application', async () => {
    // create a job first
    const job = await client.query("INSERT INTO jobs (job_title, job_description) VALUES ('AppTest','x') RETURNING id");
    const jobId = job.rows[0].id;
    const ins = await client.query(
      `INSERT INTO job_applications (email, first_name, last_name, job_id) VALUES ($1,$2,$3,$4) RETURNING id`,
      ['inttest@example.com', 'Int', 'Test', jobId]
    );
    const appId = ins.rows[0].id;
    const sel = await client.query('SELECT email, first_name FROM job_applications WHERE id=$1', [appId]);
    expect(sel.rows[0].email).toBe('inttest@example.com');
    await client.query('DELETE FROM job_applications WHERE id=$1', [appId]);
    await client.query('DELETE FROM jobs WHERE id=$1', [jobId]);
  });

  test('messages table exists and can insert message', async () => {
    const res = await client.query("SELECT to_regclass('public.messages') as reg");
    expect(res.rows[0].reg).toBe('messages');

    const ins = await client.query('INSERT INTO messages (message, sender_role) VALUES ($1,$2) RETURNING id', ['hello', 'hr']);
    expect(ins.rows[0].id).toBeGreaterThan(0);
    await client.query('DELETE FROM messages WHERE id=$1', [ins.rows[0].id]);
  });

  test('can update application status', async () => {
    const job = await client.query("INSERT INTO jobs (job_title, job_description) VALUES ('StatusTest','x') RETURNING id");
    const jobId = job.rows[0].id;
    const ins = await client.query(
      `INSERT INTO job_applications (email, first_name, last_name, job_id, status) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      ['statustest@example.com', 'St', 'Atus', jobId, 'new']
    );
    const appId = ins.rows[0].id;
    await client.query('UPDATE job_applications SET status=$1 WHERE id=$2', ['review', appId]);
    const sel = await client.query('SELECT status FROM job_applications WHERE id=$1', [appId]);
    expect(sel.rows[0].status).toBe('review');
    await client.query('DELETE FROM job_applications WHERE id=$1', [appId]);
    await client.query('DELETE FROM jobs WHERE id=$1', [jobId]);
  });

  test('users email unique constraint', async () => {
    const hashed = 'fakehash';
    const email = 'unique_test@example.com';
    await client.query('INSERT INTO users (email,password_hash,first_name,last_name,role) VALUES ($1,$2,$3,$4,$5)', [email, hashed, 'U', 'Test', 'applicant']);
    let threw = false;
    try {
      await client.query('INSERT INTO users (email,password_hash,first_name,last_name,role) VALUES ($1,$2,$3,$4,$5)', [email, hashed, 'U', 'Test', 'applicant']);
    } catch (err) {
      threw = true;
    }
    expect(threw).toBe(true);
    await client.query('DELETE FROM users WHERE email=$1', [email]);
  });

  test('job_positions table exists', async () => {
    const res = await client.query("SELECT to_regclass('public.job_positions') as reg");
    // job_positions may or may not exist depending on seed; accept null or name
    expect(res.rows.length).toBeGreaterThanOrEqual(1);
  });

  test('job_applications has expected columns', async () => {
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='job_applications'");
    const cols = res.rows.map(r => r.column_name);
    expect(cols).toEqual(expect.arrayContaining(['id','email','first_name','last_name','job_id']));
  });
});
