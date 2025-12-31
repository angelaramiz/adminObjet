// database/goalService.js
import db from './db';
import { Goal } from '../models/Goal';
import { Stage } from '../models/Stage';
import { Task } from '../models/Task';
import { NotificationSettings } from '../models/NotificationSettings';

export const getAllGoals = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM goals ORDER BY updated_at DESC',
        [],
        (_, { rows }) => {
          const goals = [];
          for (let i = 0; i < rows.length; i++) {
            const goalData = rows.item(i);
            // Load stages for each goal
            getStagesForGoal(goalData.id).then(stages => {
              const goal = new Goal(goalData.id, goalData.title, goalData.description, goalData.created_at, goalData.updated_at, stages);
              goals.push(goal);
              if (goals.length === rows.length) {
                resolve(goals);
              }
            }).catch(reject);
          }
          if (rows.length === 0) resolve([]);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const saveGoal = (goal) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const now = new Date().toISOString();
      if (goal.id) {
        // Update
        tx.executeSql(
          'UPDATE goals SET title = ?, description = ?, updated_at = ? WHERE id = ?',
          [goal.title, goal.description, now, goal.id],
          (_, result) => {
            // Update stages
            updateStagesForGoal(goal.id, goal.stages).then(() => resolve(goal)).catch(reject);
          },
          (_, error) => reject(error)
        );
      } else {
        // Insert
        tx.executeSql(
          'INSERT INTO goals (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)',
          [goal.title, goal.description, now, now],
          (_, { insertId }) => {
            goal.id = insertId;
            // Insert stages
            insertStagesForGoal(goal.id, goal.stages).then(() => resolve(goal)).catch(reject);
          },
          (_, error) => reject(error)
        );
      }
    });
  });
};

const getStagesForGoal = (goalId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM stages WHERE goal_id = ? ORDER BY order_index',
        [goalId],
        (_, { rows }) => {
          const stages = [];
          for (let i = 0; i < rows.length; i++) {
            const stageData = rows.item(i);
            // Load tasks for each stage
            getTasksForStage(stageData.id).then(tasks => {
              const stage = new Stage(stageData.id, stageData.goal_id, stageData.title, stageData.description, stageData.order_index, stageData.is_completed === 1, tasks);
              stages.push(stage);
              if (stages.length === rows.length) {
                resolve(stages);
              }
            }).catch(reject);
          }
          if (rows.length === 0) resolve([]);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const getTasksForStage = (stageId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE stage_id = ?',
        [stageId],
        (_, { rows }) => {
          const tasks = [];
          for (let i = 0; i < rows.length; i++) {
            const taskData = rows.item(i);
            const task = new Task(taskData.id, taskData.stage_id, taskData.title, taskData.description, taskData.is_completed === 1, taskData.evidence);
            tasks.push(task);
          }
          resolve(tasks);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const insertStagesForGoal = (goalId, stages) => {
  return Promise.all(stages.map((stage, index) => insertStage(goalId, stage, index + 1)));
};

const insertStage = (goalId, stage, order) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO stages (goal_id, title, description, order_index, is_completed) VALUES (?, ?, ?, ?, ?)',
        [goalId, stage.title, stage.description, order, stage.isCompleted ? 1 : 0],
        (_, { insertId }) => {
          stage.id = insertId;
          insertTasksForStage(stage.id, stage.tasks).then(resolve).catch(reject);
        },
        (_, error) => reject(error)
      );
    });
  });
};

const insertTasksForStage = (stageId, tasks) => {
  return Promise.all(tasks.map(task => insertTask(stageId, task)));
};

const insertTask = (stageId, task) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (stage_id, title, description, is_completed, evidence) VALUES (?, ?, ?, ?, ?)',
        [stageId, task.title, task.description, task.isCompleted ? 1 : 0, task.evidence],
        (_, { insertId }) => {
          task.id = insertId;
          resolve();
        },
        (_, error) => reject(error)
      );
    });
  });
};

const updateStagesForGoal = (goalId, stages) => {
  // For simplicity, delete and reinsert. In production, update existing.
  return deleteStagesForGoal(goalId).then(() => insertStagesForGoal(goalId, stages));
};

const deleteStagesForGoal = (goalId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM stages WHERE goal_id = ?',
        [goalId],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// Similar functions for notifications, but for brevity, assume basic implementation.