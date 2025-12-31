// models/Stage.js
export class Stage {
  constructor(id, goalId, title, description, order, isCompleted = false, tasks = []) {
    this.id = id;
    this.goalId = goalId;
    this.title = title;
    this.description = description;
    this.order = order;
    this.isCompleted = isCompleted;
    this.tasks = tasks; // Array of Task objects
  }

  // Calculate progress for this stage
  getProgress() {
    if (this.tasks.length === 0) return 0;
    const completedTasks = this.tasks.filter(task => task.isCompleted).length;
    return (completedTasks / this.tasks.length) * 100;
  }
}