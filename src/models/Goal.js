// models/Goal.js
export class Goal {
  constructor(id, title, description, createdAt, updatedAt, stages = []) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.stages = stages; // Array of Stage objects
  }

  // Calculate total progress
  getProgress() {
    if (this.stages.length === 0) return 0;
    const completedStages = this.stages.filter(stage => stage.isCompleted).length;
    return (completedStages / this.stages.length) * 100;
  }
}