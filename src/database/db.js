// database/db.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('goals.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create goals table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => {},
        (_, error) => reject(error)
      );

      // Create stages table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS stages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          order_index INTEGER,
          is_completed BOOLEAN DEFAULT 0,
          FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
        );`,
        [],
        () => {},
        (_, error) => reject(error)
      );

      // Create tasks table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          stage_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          is_completed BOOLEAN DEFAULT 0,
          evidence TEXT,
          FOREIGN KEY (stage_id) REFERENCES stages (id) ON DELETE CASCADE
        );`,
        [],
        () => {},
        (_, error) => reject(error)
      );

      // Create notification_settings table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notification_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          goal_id INTEGER UNIQUE,
          enabled BOOLEAN DEFAULT 1,
          reminder_time TEXT DEFAULT '09:00',
          frequency TEXT DEFAULT 'daily',
          FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export default db;