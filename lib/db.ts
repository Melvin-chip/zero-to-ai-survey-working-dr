import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

// Initialize database
const db = new sqlite3.Database('survey.db');

// Promisify database methods
const runAsync = promisify(db.run.bind(db));
const getAsync = promisify(db.get.bind(db));
const allAsync = promisify(db.all.bind(db));

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE,
      fullName TEXT,
      email TEXT UNIQUE,
      company TEXT,
      role TEXT,
      scored BOOLEAN DEFAULT false,
      createdDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      score INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

export interface User {
  id?: number;
  uuid: string;
  fullName: string;
  email: string;
  company: string;
  role: string;
  scored?: boolean;
  createdDate?: string;
}

export interface Score {
  id: number;
  userId: number;
  score: number;
}

export const createUser = async (user: Omit<User, 'uuid' | 'scored' | 'createdDate'>): Promise<string> => {
  const uuid = uuidv4();
  try {
    await runAsync(
      'INSERT INTO users (uuid, fullName, email, company, role) VALUES (?, ?, ?, ?, ?)',
      [uuid, user.fullName, user.email, user.company, user.role]
    );
    return uuid;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  try {
    return await getAsync('SELECT * FROM users WHERE email = ?', [email]);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const getUserByUuid = async (uuid: string): Promise<User | undefined> => {
  try {
    return await getAsync('SELECT * FROM users WHERE uuid = ?', [uuid]);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const createScore = async (userId: number, score: number): Promise<void> => {
  try {
    await runAsync('INSERT INTO scores (userId, score) VALUES (?, ?)', [userId, score]);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const getUserScore = async (uuid: string): Promise<Score | undefined> => {
  try {
    return await getAsync(
      'SELECT s.* FROM scores s JOIN users u ON u.id = s.userId WHERE u.uuid = ?',
      [uuid]
    );
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export const updateUserScored = async (uuid: string): Promise<void> => {
  try {
    await runAsync('UPDATE users SET scored = true WHERE uuid = ?', [uuid]);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

export default db;