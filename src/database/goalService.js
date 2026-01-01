// database/goalService.js
import { getDb } from './db';
import { Goal } from '../models/Goal';
import { Stage } from '../models/Stage';
import { Task } from '../models/Task';
import { NotificationSettings } from '../models/NotificationSettings';

export const getAllGoals = async () => {
  try {
    const db = await getDb();
    const result = await db.getAllAsync('SELECT * FROM goals ORDER BY updated_at DESC');
    console.log('Raw goals from DB:', result);
    
    const goals = [];
    for (const goalData of result) {
      const stages = await getStagesForGoal(goalData.id);
      const goal = new Goal(
        goalData.id, 
        goalData.title, 
        goalData.description, 
        goalData.created_at, 
        goalData.updated_at, 
        stages
      );
      console.log('Created Goal object:', { id: goal.id, title: goal.title, hasGetProgress: typeof goal.getProgress });
      goals.push(goal);
    }
    console.log('Final goals array:', goals.length, 'goals');
    return goals;
  } catch (error) {
    console.error('Error getting all goals:', error);
    throw error;
  }
};

export const saveGoal = async (goal) => {
  try {
    const db = await getDb();
    const now = new Date().toISOString();
    
    if (goal.id) {
      // Update
      console.log('Updating goal:', goal.id);
      await db.runAsync(
        'UPDATE goals SET title = ?, description = ?, updated_at = ? WHERE id = ?',
        [goal.title, goal.description, now, goal.id]
      );
      console.log('Goal updated');
      // Update stages
      await updateStagesForGoal(goal.id, goal.stages);
    } else {
      // Insert
      console.log('Inserting new goal:', goal.title);
      const result = await db.runAsync(
        'INSERT INTO goals (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)',
        [goal.title, goal.description, now, now]
      );
      console.log('Insert result:', result);
      goal.id = result.lastInsertRowId || result.insertId;
      console.log('New goal ID:', goal.id);
      // Insert stages
      if (goal.stages && goal.stages.length > 0) {
        console.log('Inserting', goal.stages.length, 'stages');
        await insertStagesForGoal(goal.id, goal.stages);
      }
    }
    console.log('Goal saved successfully');
    return goal;
  } catch (error) {
    console.error('Error saving goal:', error);
    throw error;
  }
};

const getStagesForGoal = async (goalId) => {
  try {
    const db = await getDb();
    const result = await db.getAllAsync(
      'SELECT * FROM stages WHERE goal_id = ? ORDER BY order_index',
      [goalId]
    );
    
    const stages = [];
    for (const stageData of result) {
      const tasks = await getTasksForStage(stageData.id);
      const stage = new Stage(
        stageData.id,
        stageData.goal_id,
        stageData.title,
        stageData.description,
        stageData.order_index,
        stageData.is_completed === 1,
        tasks
      );
      stages.push(stage);
    }
    return stages;
  } catch (error) {
    console.error('Error getting stages:', error);
    throw error;
  }
};

const getTasksForStage = async (stageId) => {
  try {
    const db = await getDb();
    const result = await db.getAllAsync(
      'SELECT * FROM tasks WHERE stage_id = ?',
      [stageId]
    );
    
    const tasks = [];
    for (const taskData of result) {
      const task = new Task(
        taskData.id,
        taskData.stage_id,
        taskData.title,
        taskData.description,
        taskData.is_completed === 1,
        taskData.evidence
      );
      tasks.push(task);
    }
    return tasks;
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

const insertStagesForGoal = async (goalId, stages) => {
  const promises = stages.map((stage, index) => insertStage(goalId, stage, index + 1));
  return Promise.all(promises);
};

const insertStage = async (goalId, stage, order) => {
  try {
    const db = await getDb();
    console.log('Inserting stage:', stage.title);
    const result = await db.runAsync(
      'INSERT INTO stages (goal_id, title, description, order_index, is_completed) VALUES (?, ?, ?, ?, ?)',
      [goalId, stage.title, stage.description, order, stage.isCompleted ? 1 : 0]
    );
    stage.id = result.lastInsertRowId || result.insertId;
    console.log('Stage inserted with ID:', stage.id);
    if (stage.tasks && stage.tasks.length > 0) {
      await insertTasksForStage(stage.id, stage.tasks);
    }
  } catch (error) {
    console.error('Error inserting stage:', error);
    throw error;
  }
};

const insertTasksForStage = async (stageId, tasks) => {
  const promises = tasks.map(task => insertTask(stageId, task));
  return Promise.all(promises);
};

const insertTask = async (stageId, task) => {
  try {
    const db = await getDb();
    console.log('Inserting task:', task.title);
    const result = await db.runAsync(
      'INSERT INTO tasks (stage_id, title, description, is_completed, evidence) VALUES (?, ?, ?, ?, ?)',
      [stageId, task.title, task.description, task.isCompleted ? 1 : 0, task.evidence]
    );
    task.id = result.lastInsertRowId || result.insertId;
    console.log('Task inserted with ID:', task.id);
  } catch (error) {
    console.error('Error inserting task:', error);
    throw error;
  }
};

const updateStagesForGoal = async (goalId, stages) => {
  await deleteStagesForGoal(goalId);
  return insertStagesForGoal(goalId, stages);
};

const deleteStagesForGoal = async (goalId) => {
  try {
    const db = await getDb();
    await db.runAsync('DELETE FROM stages WHERE goal_id = ?', [goalId]);
  } catch (error) {
    console.error('Error deleting stages:', error);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    console.log('Deleting goal:', goalId);
    const db = await getDb();
    
    // Delete stages and tasks first (cascade)
    await deleteStagesForGoal(goalId);
    
    // Delete the goal
    await db.runAsync('DELETE FROM goals WHERE id = ?', [goalId]);
    console.log('Goal deleted successfully');
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

export const updateGoal = async (goal) => {
  try {
    console.log('Updating goal:', goal.id);
    const db = await getDb();
    const now = new Date().toISOString();
    
    await db.runAsync(
      'UPDATE goals SET title = ?, description = ?, updated_at = ? WHERE id = ?',
      [goal.title, goal.description, now, goal.id]
    );
    
    // Update stages if provided
    if (goal.stages && goal.stages.length > 0) {
      for (const stage of goal.stages) {
        if (stage.id) {
          // Update existing stage
          await db.runAsync(
            'UPDATE stages SET title = ?, description = ?, order_index = ? WHERE id = ?',
            [stage.title, stage.description, stage.orderIndex, stage.id]
          );
          // Update tasks for this stage
          if (stage.tasks && stage.tasks.length > 0) {
            for (const task of stage.tasks) {
              if (task.id) {
                await db.runAsync(
                  'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?',
                  [task.title, task.description, task.isCompleted ? 1 : 0, task.id]
                );
              }
            }
          }
        }
      }
    }
    
    console.log('Goal updated successfully');
    return goal;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const duplicateGoal = async (goal) => {
  try {
    console.log('Duplicating goal:', goal.id);
    
    // Create new goal with same data but no ID
    const newGoal = new Goal(
      null,
      `${goal.title} (copia)`,
      goal.description,
      new Date().toISOString(),
      new Date().toISOString(),
      []
    );
    
    // Duplicate stages
    if (goal.stages && goal.stages.length > 0) {
      for (const stage of goal.stages) {
        const newStage = new Stage(
          null,
          newGoal.id,
          stage.title,
          stage.description,
          stage.orderIndex,
          false,
          []
        );
        
        // Duplicate tasks
        if (stage.tasks && stage.tasks.length > 0) {
          for (const task of stage.tasks) {
            const newTask = new Task(
              null,
              newStage.id,
              task.title,
              task.description,
              false
            );
            newStage.tasks.push(newTask);
          }
        }
        
        newGoal.stages.push(newStage);
      }
    }
    
    // Save the duplicated goal
    const savedGoal = await saveGoal(newGoal);
    console.log('Goal duplicated successfully with ID:', savedGoal.id);
    return savedGoal;
  } catch (error) {
    console.error('Error duplicating goal:', error);
    throw error;
  }
};


// Similar functions for notifications, but for brevity, assume basic implementation.