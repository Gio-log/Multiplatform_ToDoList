const fs = require('node:fs/promises');

async function getStoredTasks() {
  const rawFileContent = await fs.readFile('./storage/tasks.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedTasks = data.tasks ?? [];
  const storedIndex = data.index ?? 0;
  return {storedIndex, storedTasks};
}

function storeTasks(newIndex, allTasks) {
  return fs.writeFile('./storage/tasks.json', JSON.stringify({index: newIndex || 0, tasks: allTasks || [] }));
}

exports.getStoredTasks = getStoredTasks;
exports.storeTasks = storeTasks;