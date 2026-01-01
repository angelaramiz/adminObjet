// database/db.js
import * as SQLite from 'expo-sqlite';

let db = null;

export const getDb = async () => {
  if (!db) {
    try {
      db = await SQLite.openDatabaseAsync('goals.db');
      console.log('Database opened successfully');
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  }
  return db;
};

const executeSqlAsync = async (db, sql) => {
  try {
    // Use execAsync with the correct format
    await db.execAsync(sql);
    console.log('SQL executed:', sql.substring(0, 50) + '...');
    return true;
  } catch (error) {
    console.error('SQL error:', sql, error);
    throw error;
  }
};

export const initDatabase = async () => {
  try {
    const database = await getDb();
    
    console.log('Starting database initialization...');

    // Create goals table
    await executeSqlAsync(database, `CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);

    // Create stages table
    await executeSqlAsync(database, `CREATE TABLE IF NOT EXISTS stages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      order_index INTEGER,
      is_completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
    );`);

    // Create tasks table
    await executeSqlAsync(database, `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      is_completed BOOLEAN DEFAULT 0,
      evidence TEXT,
      FOREIGN KEY (stage_id) REFERENCES stages (id) ON DELETE CASCADE
    );`);

    // Create notification_settings table
    await executeSqlAsync(database, `CREATE TABLE IF NOT EXISTS notification_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER UNIQUE,
      enabled BOOLEAN DEFAULT 1,
      reminder_time TEXT DEFAULT '09:00',
      frequency TEXT DEFAULT 'daily',
      FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
    );`);

    console.log('All tables created successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};