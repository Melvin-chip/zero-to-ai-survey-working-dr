const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

const db = new Database('survey.db', { verbose: console.log });

// Initialize database with tables and sample data
function initializeDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE,
      fullName TEXT,
      email TEXT UNIQUE,
      company TEXT,
      role TEXT,
      scored BOOLEAN DEFAULT false,
      createdDate DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      score INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);

  // Insert sample data
  const sampleUsers = [
    {
      uuid: uuidv4(),
      fullName: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      role: 'Developer'
    },
    {
      uuid: uuidv4(),
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      company: 'Design Co',
      role: 'Designer'
    }
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (uuid, fullName, email, company, role)
    VALUES (@uuid, @fullName, @email, @company, @role)
  `);

  const insertScore = db.prepare(`
    INSERT INTO scores (userId, score)
    VALUES ((SELECT id FROM users WHERE email = @email), @score)
  `);

  // Transaction to insert sample data
  const transaction = db.transaction((users) => {
    for (const user of users) {
      insertUser.run(user);
      // Add sample score for each user
      insertScore.run({
        email: user.email,
        score: Math.floor(Math.random() * 100)
      });
    }
  });

  try {
    transaction(sampleUsers);
    console.log('Database initialized successfully with sample data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run initialization
initializeDatabase();

// Close database connection
db.close();