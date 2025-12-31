// utils/llmFormat.js
// Schema for LLM to generate goals in JSON format
export const goalSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Title of the goal' },
    description: { type: 'string', description: 'Detailed description of the goal' },
    stages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Title of the stage' },
          description: { type: 'string', description: 'Description of the stage' },
          tasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Title of the task' },
                description: { type: 'string', description: 'Description of the task' }
              },
              required: ['title', 'description']
            }
          }
        },
        required: ['title', 'description', 'tasks']
      }
    }
  },
  required: ['title', 'description', 'stages']
};

// Function to parse LLM generated JSON into Goal object
import { Goal } from '../models/Goal';
import { Stage } from '../models/Stage';
import { Task } from '../models/Task';

export function parseGoalFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const stages = data.stages.map((stageData, index) => {
      const tasks = stageData.tasks.map(taskData => new Task(null, null, taskData.title, taskData.description));
      return new Stage(null, null, stageData.title, stageData.description, index + 1, false, tasks);
    });
    return new Goal(null, data.title, data.description, new Date(), new Date(), stages);
  } catch (error) {
    throw new Error('Invalid JSON format for goal');
  }
}