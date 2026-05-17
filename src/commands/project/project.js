const fs = require('fs');
const path = require('path');
const api = require('../../api');
const auth = require('../../auth');
const configUtil = require('../../utils/config');
const logger = require('../../utils/logger');

const PROJECTS_FILE = path.join(process.env.HOME, '.config', 'ants', 'projects.json');

const subcommand = process.argv[3] || 'ls';
const projectName = process.argv[4];

function ensureProjectsDir() {
  const dir = path.dirname(PROJECTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([]));
  }
}

function loadLocalProjects() {
  ensureProjectsDir();
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
  } catch (_) {
    return [];
  }
}

function saveLocalProjects(projects) {
  ensureProjectsDir();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function generateId() {
  return 'proj_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

async function run() {
  const token = auth.getToken();
  
  switch (subcommand) {
    case 'ls':
    case 'list':
      await listProjects(token);
      break;
    case 'add':
      await addProject(token);
      break;
    case 'rm':
    case 'remove':
      await removeProject(token);
      break;
    case 'inspect':
      await inspectProject(token);
      break;
    default:
      console.log('📁 Project Management\n');
      console.log('USAGE:');
      console.log('  ants project ls          List all projects');
      console.log('  ants project add [name]  Create new project');
      console.log('  ants project rm [name]   Remove a project');
      console.log('  ants project inspect     Show project details');
      process.exit(0);
  }
}

async function listProjects(token) {
  console.log('📁 Projects\n');
  
  try {
    const res = await api.get('/api/projects', { token });
    
    if (res.status === 200 && res.data?.projects) {
      printProjectsTable(res.data.projects);
      return;
    }
  } catch (_) {}
  
  const local = loadLocalProjects();
  if (local.length === 0) {
    console.log('ℹ️  No projects found');
    console.log('💡 Run `ants project add <name>` to create one');
  } else {
    printProjectsTable(local);
  }
}

function printProjectsTable(projects) {
  console.log('NAME'.padEnd(25) + 'ID'.padEnd(20) + 'CREATED');
  console.log('─'.repeat(60));
  for (const p of projects) {
    console.log(
      (p.name || 'unnamed').padEnd(25) +
      (p.id || '—').padEnd(20) +
      (p.createdAt || new Date().toISOString()).substring(0, 10)
    );
  }
  console.log(`\n📊 Total: ${projects.length} project(s)`);
}

async function addProject(token) {
  const name = projectName || 'my-project';
  
  console.log(`📁 Creating project: ${name}\n`);
  
  let apiSuccess = false;
  
  try {
    const res = await api.post('/api/projects', { name }, { token });
    
    if (res.status === 200 || res.status === 201) {
      console.log(`✅ Project created: ${name}`);
      console.log(`🆔 ID: ${res.data?.id || generateId()}`);
      logger.info(`Project created: ${name}`);
      apiSuccess = true;
    }
  } catch (_) {}
  
  if (apiSuccess) return;
  
  const local = loadLocalProjects();
  
  if (local.find(p => p.name === name)) {
    console.log(`⚠️  Project already exists: ${name}`);
    return;
  }
  
  const newProject = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    status: 'active',
    local: true,
  };
  
  local.push(newProject);
  saveLocalProjects(local);
  
  console.log(`✅ Project created: ${name}`);
  console.log(`🆔 ID: ${newProject.id}`);
  console.log('💡 Stored locally (API not available)');
  logger.info(`Project created locally: ${name}`);
}

async function removeProject(token) {
  if (!projectName) {
    console.log('❌ Project name is required');
    console.log('USAGE: ants project rm <name>');
    process.exit(1);
  }
  
  console.log(`🗑️  Removing project: ${projectName}\n`);
  
  try {
    const res = await api.delete(`/api/projects/${projectName}`, { token });
    
    if (res.status === 200) {
      console.log(`✅ Project removed: ${projectName}`);
      logger.info(`Project removed: ${projectName}`);
      return;
    }
  } catch (_) {}
  
  const local = loadLocalProjects();
  const idx = local.findIndex(p => p.name === projectName);
  
  if (idx === -1) {
    console.log(`❌ Project not found: ${projectName}`);
    process.exit(1);
  }
  
  local.splice(idx, 1);
  saveLocalProjects(local);
  console.log(`✅ Project removed: ${projectName}`);
  logger.info(`Project removed locally: ${projectName}`);
}

async function inspectProject(token) {
  const name = projectName;
  
  if (!name) {
    console.log('❌ Project name is required');
    console.log('USAGE: ants project inspect <name>');
    process.exit(1);
  }
  
  console.log(`🔍 Inspecting project: ${name}\n`);
  
  try {
    const res = await api.get(`/api/projects/${name}`, { token });
    
    if (res.status === 200 && res.data) {
      printProjectDetails(res.data);
      return;
    }
  } catch (_) {}
  
  const local = loadLocalProjects();
  const project = local.find(p => p.name === name);
  
  if (!project) {
    console.log(`❌ Project not found: ${name}`);
    console.log('💡 Run `ants project ls` to see all projects');
    process.exit(1);
  }
  
  printProjectDetails(project);
}

function printProjectDetails(p) {
  console.log('📋 Project Details:');
  console.log(`   Name: ${p.name}`);
  console.log(`   ID: ${p.id || 'unknown'}`);
  console.log(`   Status: ${p.status || 'unknown'}`);
  console.log(`   Created: ${p.createdAt || 'unknown'}`);
  console.log(`   Framework: ${p.framework || 'unknown'}`);
  if (p.local) {
    console.log(`   Storage: local`);
  }
}

run();
