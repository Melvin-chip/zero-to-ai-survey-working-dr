import Database from 'better-sqlite3';

export const db = new Database('survey.db', { 
  verbose: console.log,
  fileMustExist: false
});