const express = require('express');
const { Client } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const app = express();
app.use(express.json());
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const SECRET = process.env.JWT_SECRET || 'default_secret';


app.use(cors()); // For production, you can later restrict this to your frontend URL

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware for protected routes
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).send('Access denied.');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token.');
    req.user = user;
    next();
  });
};

async function waitForDb(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      await client.query('SELECT 1');
      console.log('Connected to CockroachDB');
      
      // Check and create tables if they don't exist
      await checkAndCreateTables();

      return;
    } catch (err) {
      console.log(`DB not ready yet, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  console.error('Could not connect to DB, exiting.');
  process.exit(1);
}

async function checkAndCreateTables() {
  // Create tables for job positions, jobs, applications
  await createTables();

  await insertDefaultHRUser()
  await insertDefaultJobs();
  await insertDefaultApplications();
}

async function createTables() {

  const createUsersTable = `
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
  `;

  const createJobsTable = `
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      job_title TEXT NOT NULL,
      job_description TEXT NOT NULL
    );
  `;

  const createJobApplicationsTable = `
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
  `;

  try {
    await client.query(createUsersTable);
    await client.query(createJobsTable);
    await client.query(createJobApplicationsTable);

    console.log('✅ All tables created.');

    await insertDefaultHRUser();
    await insertDefaultJobs();
    await insertDefaultApplications();
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  }
}

/* -------------------- INSERT DEFAULT DATA -------------------- */

async function insertDefaultHRUser() {
  const hrEmail = 'hr@mycompany.com';
  const hrPassword = 'password123';
  const hashed = await bcrypt.hash(hrPassword, 10);

  try {
    const { rows } = await client.query('SELECT COUNT(*) FROM users WHERE email = $1', [hrEmail]);
    if (parseInt(rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [hrEmail, hashed, 'Default', 'HR', 'hr']
      );
      console.log(`✅ Default HR user created: ${hrEmail} / ${hrPassword}`);
    } else {
      return;
    }
  } catch (err) {
    console.error('❌ Error inserting HR user:', err);
  }
}

async function insertDefaultJobs() {
  const count = await client.query('SELECT COUNT(*) FROM jobs');
  if (parseInt(count.rows[0].count, 10) > 0) return;

  console.log('➡️ Inserting default jobs...');

  await client.query(`
    INSERT INTO jobs (job_title, job_description)
    VALUES
      ('Junior Software Engineer', 'Assist in building web applications.'),
      ('Senior HR Manager', 'Lead recruitment and manage HR ops.'),
      ('Associate Product Manager', 'Support product strategy and roadmaps.'),
      ('Sales Executive', 'Drive sales and maintain client relationships.'),
      ('Data Analyst', 'Analyze datasets to support business insights.');
  `);
  console.log('✅ jobs seeded.');
}

async function insertDefaultApplications() {
  const count = await client.query('SELECT COUNT(*) FROM job_applications');
  if (parseInt(count.rows[0].count, 10) > 0) return;

  console.log('➡️ Inserting default applications...');

  const positions = await client.query('SELECT id, job_title FROM jobs');
  const map = Object.fromEntries(positions.rows.map(p => [p.job_title, p.id]));

  console.log("BABA#", map['Associate Product Manager'], map['Senior HR Manager'], map['Junior Software Engineer'])


  await client.query(`
    INSERT INTO job_applications
      (email, first_name, last_name, address, phone, job_id, description, has_b_category_license)
    VALUES
      ('alice@example.com', 'Alice', 'Johnson', '123 Main St', '555-1234', ${map['Junior Software Engineer']}, 'Excited to join your engineering team.', true),
      ('bob@example.com', 'Bob', 'Smith', '456 Oak Ave', '555-5678', ${map['Senior HR Manager']}, 'Experienced HR professional with 5 years in recruitment.', false),
      ('carol@example.com', 'Carol', 'White', '789 Pine Rd', '555-9999', ${map['Associate Product Manager']}, 'Strong analytical background and product mindset.', true);
  `);

  console.log('✅ job_applications seeded.');
}


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

//database
waitForDb();


/** --- Routes --- */

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    console.log('User fetched from DB:', user); 

    if (!user.password_hash) {
      return res.status(500).json({ error: 'Password hash not found in database' });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/applications', authenticateToken, async (req, res) => {
  const { email, first_name, last_name, address, phone, description, job_id } = req.body;

  if (!email || !first_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO job_applications
        (email, first_name, last_name, address, phone, description, job_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [email, first_name, last_name, address, phone || null, description || null, job_id]
    );
    res.status(201).json({ message: "Created", id: result.rows[0].id });
  } catch (err) {
    console.error("Error inserting application:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/applications/new', authenticateToken, async (req, res) => {
  if (req.user.role !== 'HR') return res.status(403).json({ error: 'Unauthorized' });

  const {
    email, first_name, last_name, address, phone,
    job_position, description, has_b_category_license
  } = req.body;

  if (!email || !first_name || !last_name || !address || !job_position || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO job_applications
        (email, first_name, last_name, address, phone, job_position, description, has_b_category_license)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const values = [
      email, first_name, last_name, address, phone || null, job_position, description, !!has_b_category_license
    ];
    const result = await client.query(query, values);
    res.status(201).json({ message: 'Application created', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/jobs/new', authenticateToken, async (req, res) => {
  if (req.user.role !== 'HR') return res.status(403).json({ error: 'Unauthorized' });

  const { job_title, job_position_id, job_description } = req.body;

  if (!job_title || !job_position_id || !job_description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO jobs (job_title, job_position_id, job_description)
      VALUES ($1, $2, $3) RETURNING id
    `;
    const values = [job_title, job_position_id, job_description];
    const result = await client.query(query, values);
    res.status(201).json({ message: 'Job position created', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/applications/job/:jobId', authenticateToken, async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const query = `
      SELECT * FROM job_applications WHERE job_position = (SELECT position_name FROM job_positions WHERE id = $1)
    `;
    const result = await client.query(query, [jobId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/applications/list', authenticateToken, async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const query = `
      SELECT *, ja.id FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id 
    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/job/list', authenticateToken, async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const query = `
      SELECT * FROM jobs as j
    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/job-positions/list', authenticateToken, async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const query = `
      SELECT * FROM job_positions
    `;
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/applications/:applicationId', authenticateToken, async (req, res) => {
  const applicationId = req.params.applicationId;

  

  try {
    const query = `
      SELECT *, ja.id FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id 
      WHERE ja.id = $1
    `;
    const result = await client.query(query, [applicationId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Application not found' });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/messages/send', authenticateToken, async (req, res) => {
  if (req.user.role !== 'HR') return res.status(403).json({ error: 'Unauthorized' });

  const { applicantId, message } = req.body;

  if (!applicantId || !message) return res.status(400).json({ error: 'Missing applicantId or message' });

  try {
    const query = 'INSERT INTO messages (applicant_id, message, sender_role) VALUES ($1, $2, $3)';
    const values = [applicantId, message, 'HR'];
    await client.query(query, values);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/messages', authenticateToken, async (req, res) => {
  const applicantId = req.user.userId;

  try {
    const query = 'SELECT * FROM messages WHERE applicant_id = $1';
    const result = await client.query(query, [applicantId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/messages/reply', authenticateToken, async (req, res) => {
  const { message, hrId } = req.body;

  if (!message || !hrId) return res.status(400).json({ error: 'Missing message or HR ID' });

  try {
    const query = 'INSERT INTO messages (applicant_id, message, sender_role, hr_id) VALUES ($1, $2, $3, $4)';
    const values = [req.user.userId, message, 'Applicant', hrId];
    await client.query(query, values);
    res.status(201).json({ message: 'Reply sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/applications/:applicationId/status', authenticateToken, async (req, res) => {
  if (req.user.role !== 'HR') return res.status(403).json({ error: 'Unauthorized' });

  const { status } = req.body;
  const applicationId = req.params.applicationId;

  if (!status) return res.status(400).json({ error: 'Missing status' });

  try {
    const query = 'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *';
    const result = await client.query(query, [status, applicationId]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/applications/new', authenticateToken, upload.single('resume'), async (req, res) => {
  const resumeFilePath = req.file.path;
  res.status(201).json({ message: 'Application created with resume' });
});
