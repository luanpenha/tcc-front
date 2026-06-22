import Log from '../models/Log.js';

export const recordLog = async ({ action, userId, metadata = {} }) => {
  try {
    await Log.create({ action, user: userId, metadata });
  } catch (error) {
    console.warn('Could not write log entry:', error.message);
  }
};
