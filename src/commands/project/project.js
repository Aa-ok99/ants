const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'ls';
const projectName = process.argv[4];

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
      console.log('NAME'.padEnd(25) + 'STATUS'.padEnd(12) + 'CREATED');
      console.log('─'.repeat(55));
      for (const p of res.data.projects) {
        console.log(p.name.padEnd(25) + p.status.padEnd(12) + (p.createdAt || 'unknown'));
      }
      console.log(`\n📊 Total: ${res.data.projects.length} project(s)`);
    } else {
      console.log('ℹ️  No projects found');
    }
  } catch (err) {
    console.log('ℹ️  No projects found');
    console.log(`   (API: ${err.message})`);
  }
}

async function addProject(token) {
  const name = projectName || 'my-project';
  
  console.log(`📁 Creating project: ${name}\n`);
  
  try {
    const res = await api.post('/api/projects', { name }, { token });
    
    if (res.status === 200 || res.status === 201) {
      console.log(`✅ Project created: ${name}`);
      console.log(`🆔 ID: ${res.data?.id || 'unknown'}`);
      logger.info(`Project created: ${name}`);
    } else {
      console.error(`❌ Failed to create: ${res.status}`);
    }
  } catch (err) {
    console.error(`❌ Failed to create: ${err.message}`);
  }
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
    } else {
      console.error(`❌ Failed to remove: ${res.status}`);
    }
  } catch (err) {
    console.error(`❌ Failed to remove: ${err.message}`);
  }
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
      const p = res.data;
      console.log('📋 Project Details:');
      console.log(`   Name: ${p.name}`);
      console.log(`   ID: ${p.id || 'unknown'}`);
      console.log(`   Status: ${p.status || 'unknown'}`);
      console.log(`   Created: ${p.createdAt || 'unknown'}`);
      console.log(`   Framework: ${p.framework || 'unknown'}`);
    } else {
      console.error(`❌ Project not found: ${name}`);
    }
  } catch (err) {
    console.error(`❌ Failed to inspect: ${err.message}`);
  }
}

run();
