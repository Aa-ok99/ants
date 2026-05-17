const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const LINK_FILE = '.ants';

function loadLink(dir = process.cwd()) {
  const linkPath = path.join(dir, LINK_FILE);
  
  if (!fs.existsSync(linkPath)) {
    const parent = path.dirname(dir);
    if (parent !== dir) {
      return loadLink(parent);
    }
    return null;
  }
  
  try {
    const raw = fs.readFileSync(linkPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    logger.warn('Failed to load project link:', err.message);
    return null;
  }
}

function saveLink(projectId, projectName, dir = process.cwd()) {
  const linkPath = path.join(dir, LINK_FILE);
  
  const data = {
    projectId,
    projectName,
    linkedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(linkPath, JSON.stringify(data, null, 2));
  logger.info(`Linked to project: ${projectName}`);
  return data;
}

function removeLink(dir = process.cwd()) {
  const linkPath = path.join(dir, LINK_FILE);
  
  if (fs.existsSync(linkPath)) {
    fs.unlinkSync(linkPath);
    logger.info('Project link removed');
    return true;
  }
  
  return false;
}

function isLinked(dir = process.cwd()) {
  return loadLink(dir) !== null;
}

module.exports = {
  loadLink,
  saveLink,
  removeLink,
  isLinked,
  LINK_FILE,
};
