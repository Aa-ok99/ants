const fs = require('fs');
const path = require('path');
const api = require('../../api');
const auth = require('../../auth');
const projectLink = require('../../project-link');
const logger = require('../../utils/logger');

const isProd = process.argv.includes('--prod');
const target = process.argv.includes('--target=') 
  ? process.argv.find(a => a.startsWith('--target=')).split('=')[1] 
  : null;

async function run() {
  console.log(`🚀 Deploying${isProd ? ' to production' : ''}${target ? ` to ${target}` : ''}...\n`);
  
  const linked = projectLink.loadLink();
  if (!linked) {
    console.log('⚠️  No project linked');
    console.log('💡 Run `ants link` to link this directory to a project');
    process.exit(1);
  }
  
  console.log(`📦 Project: ${linked.projectName}`);
  console.log(`📁 Directory: ${process.cwd()}`);
  
  const token = auth.getToken();
  if (!token) {
    console.log('⚠️  Not authenticated — deploying without auth');
  }
  
  try {
    console.log('\n📤 Uploading files...');
    
    const files = gatherFiles(process.cwd());
    console.log(`   ${files.length} files found`);
    
    const deployData = {
      projectId: linked.projectId,
      files: files,
      production: isProd,
      target: target || null,
      timestamp: new Date().toISOString(),
    };
    
    const res = await api.post('/api/deploy', deployData, { token });
    
    if (res.status === 200 || res.status === 201) {
      const deployUrl = res.data?.url || `https://${linked.projectId}.ants.vercel.app`;
      console.log(`\n✅ Deployed successfully!`);
      console.log(`🌐 URL: ${deployUrl}`);
      console.log(`📊 Status: ${isProd ? 'production' : 'preview'}`);
      logger.info(`Deployed: ${deployUrl}`);
    } else {
      console.error(`❌ Deploy failed: ${res.status}`);
      if (res.data?.message) {
        console.error(`   ${res.data.message}`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Deploy failed: ${err.message}`);
    logger.error('Deploy failed:', err.message);
    process.exit(1);
  }
}

function gatherFiles(dir, base = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(base, fullPath);
    
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      files.push(...gatherFiles(fullPath, base));
    } else if (entry.isFile()) {
      if (shouldSkipFile(entry.name)) continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      files.push({ path: relative, content });
    }
  }
  
  return files;
}

function shouldSkipDir(name) {
  return ['node_modules', '.git', '.next', '.vercel', 'dist', 'build', '.ants'].includes(name);
}

function shouldSkipFile(name) {
  const skipExtensions = ['.log', '.lock'];
  const skipFiles = ['.env', '.env.local', '.env.production'];
  
  return skipExtensions.some(ext => name.endsWith(ext)) ||
         skipFiles.includes(name);
}

run();
