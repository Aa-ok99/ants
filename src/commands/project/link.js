const prompts = require('prompts');
const projectLink = require('../../project-link');
const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

async function run() {
  console.log('🔗 Link local directory to a project\n');
  
  if (projectLink.isLinked()) {
    const current = projectLink.loadLink();
    console.log(`⚠️  Already linked to: ${current.projectName}`);
    console.log(`   Project ID: ${current.projectId}`);
    console.log(`   Linked at: ${current.linkedAt}`);
    console.log('\n💡 Run `rm .ants` to unlink first');
    return;
  }
  
  const token = auth.getToken();
  
  try {
    const res = await api.get('/api/projects', { token });
    
    let choices = [];
    if (res.status === 200 && res.data?.projects) {
      choices = res.data.projects.map(p => ({
        title: p.name,
        value: { id: p.id, name: p.name },
      }));
    }
    
    if (choices.length === 0) {
      console.log('ℹ️  No projects found — entering manual mode\n');
    }
    
    let result;
    
    if (choices.length > 0) {
      result = await prompts({
        type: 'select',
        name: 'project',
        message: 'Select a project',
        choices,
      });
    }
    
    let projectId, projectName;
    
    if (result?.project) {
      projectId = result.project.id;
      projectName = result.project.name;
    } else {
      const manual = await prompts([
        { type: 'text', name: 'id', message: 'Project ID' },
        { type: 'text', name: 'name', message: 'Project name' },
      ]);
      
      projectId = manual.id;
      projectName = manual.name;
    }
    
    if (!projectId || !projectName) {
      console.log('❌ Link cancelled');
      process.exit(1);
    }
    
    projectLink.saveLink(projectId, projectName);
    console.log(`\n✅ Linked to: ${projectName}`);
    console.log(`📁 .ants file created`);
    logger.info(`Linked to project: ${projectName}`);
    
  } catch (err) {
    console.log('⚠️  API unavailable — entering manual mode\n');
    
    const manual = await prompts([
      { type: 'text', name: 'id', message: 'Project ID' },
      { type: 'text', name: 'name', message: 'Project name' },
    ]);
    
    if (!manual.id || !manual.name) {
      console.log('❌ Link cancelled');
      process.exit(1);
    }
    
    projectLink.saveLink(manual.id, manual.name);
    console.log(`\n✅ Linked to: ${manual.name}`);
    logger.info(`Linked to project: ${manual.name}`);
  }
}

run();
