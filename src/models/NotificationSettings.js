// models/NotificationSettings.js
export class NotificationSettings {
  constructor(goalId, enabled = true, reminderTime = '09:00', frequency = 'daily') {
    this.goalId = goalId;
    this.enabled = enabled;
    this.reminderTime = reminderTime; // HH:MM format
    this.frequency = frequency; // 'daily', 'weekly', etc.
  }
}