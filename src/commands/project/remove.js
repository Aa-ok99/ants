const projectLink = require('../../project-link');
const logger = require('../../utils/logger');

const target = process.argv[3];

function run() {
  if (!target) {
    console.log('🗑️  Remove a deployment or unlink project\n');
    console.log('USAGE:');
    console.log('  ants remove [deployment-url]  Remove a deployment');
    console.log('  ants remove --unlink          Unlink current project');
    process.exit(0);
  }
  
  if (target === '--unlink') {
    const removed = projectLink.removeLink();
    
    if (removed) {
      console.log('✅ Project unlinked');
      console.log('📁 .ants file removed');
      logger.info('Project unlinked');
    } else {
      console.log('ℹ️  No project linked');
    }
    return;
  }
  
  console.log(`🗑️  Removing deployment: ${target}\n`);
  console.log('⚠️  This feature requires authentication');
  console.log('💡 Run `ants login` first');
}

run();
