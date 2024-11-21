import { db } from './connection';
import { User, Score } from './types';

export const queries = {
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getUserByUuid: db.prepare('SELECT * FROM users WHERE uuid = ?'),
  createUser: db.prepare(`
    INSERT INTO users (uuid, fullName, email, company, role)
    VALUES (?, ?, ?, ?, ?)
  `),
  createScore: db.prepare(`
    INSERT INTO scores (userId, score)
    VALUES (?, ?)
  `),
  getUserScore: db.prepare(`
    SELECT s.* FROM scores s
    JOIN users u ON u.id = s.userId
    WHERE u.uuid = ?
  `),
  updateUserScored: db.prepare(`
    UPDATE users SET scored = true
    WHERE uuid = ?
  `)
};