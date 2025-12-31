// models/Task.js
export class Task {
  constructor(id, stageId, title, description, isCompleted = false, evidence = null) {
    this.id = id;
    this.stageId = stageId;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.evidence = evidence; // Path to evidence file or null
  }
}