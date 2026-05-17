const fs = require('fs');
const path = require('path');
const os = require('os');
const output = require('../../utils/output');
const logger = require('../../utils/logger');

const shell = process.argv[3] || 'bash';

const BASH_COMPLETION = `# Ants CLI bash completion
_ants_completions() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  local cmds="init login logout whoami link list remove deploy build dev inspect promote rollback env project config routes redirects flags target run plugin telemetry update help status logs metrics alerts analytics validate completion"
  local env_cmds="ls add rm pull run"
  local project_cmds="ls add rm inspect"
  local config_cmds="show get set"
  local plugin_cmds="list add rm discover"
  local prev="\${COMP_WORDS[COMP_CWORD-1]}"
  
  case "\$prev" in
    env)
      COMPREPLY=( \$(compgen -W "\$env_cmds" -- "\$cur") )
      return
      ;;
    project)
      COMPREPLY=( \$(compgen -W "\$project_cmds" -- "\$cur") )
      return
      ;;
    config)
      COMPREPLY=( \$(compgen -W "\$config_cmds" -- "\$cur") )
      return
      ;;
    plugin)
      COMPREPLY=( \$(compgen -W "\$plugin_cmds" -- "\$cur") )
      return
      ;;
    routes|redirects)
      COMPREPLY=( \$(compgen -W "list add rm" -- "\$cur") )
      return
      ;;
    flags)
      COMPREPLY=( \$(compgen -W "list create set" -- "\$cur") )
      return
      ;;
    target)
      COMPREPLY=( \$(compgen -W "list add rm" -- "\$cur") )
      return
      ;;
    telemetry)
      COMPREPLY=( \$(compgen -W "status enable disable" -- "\$cur") )
      return
      ;;
    analytics)
      COMPREPLY=( \$(compgen -W "summary commands errors" -- "\$cur") )
      return
      ;;
  esac
  
  COMPREPLY=( \$(compgen -W "\$cmds" -- "\$cur") )
}

complete -F _ants_completions ants
`;

const ZSH_COMPLETION = `# Ants CLI zsh completion
#compdef ants

_ants() {
  local -a commands
  commands=(
    'init:Initialize new project'
    'login:Login to your account'
    'logout:Logout from current account'
    'whoami:Display current user'
    'link:Link local directory to a project'
    'list:List recent deployments'
    'remove:Remove deployment or project'
    'deploy:Deploy project'
    'build:Build project locally'
    'dev:Start local dev server'
    'inspect:Inspect deployment details'
    'promote:Promote deployment to production'
    'rollback:Rollback to previous deployment'
    'env:Manage environment variables'
    'project:Manage projects'
    'config:Manage configuration'
    'routes:Manage routing rules'
    'redirects:Manage redirects'
    'flags:Manage feature flags'
    'target:Manage environments'
    'run:Run a script from config'
    'plugin:Manage plugins'
    'telemetry:Manage telemetry settings'
    'update:Check for CLI updates'
    'help:Show help for a command'
    'status:Check API connection status'
    'logs:View deployment logs'
    'metrics:Query observability metrics'
    'alerts:View recent alerts'
    'analytics:View usage analytics'
    'validate:Validate configuration'
    'completion:Generate shell completion'
  )
  
  _arguments -C \\
    '1: :->command' \\
    '*: :->args' && return 0
  
  case \$state in
    command)
      _describe 'commands' commands
      ;;
  esac
}

_ants "\$@"
`;

function run() {
  const shellType = shell.toLowerCase();
  
  let content, filename, installPath;
  
  switch (shellType) {
    case 'bash':
      content = BASH_COMPLETION;
      filename = 'ants.bash';
      installPath = path.join(os.homedir(), '.bash_completion.d', filename);
      break;
    case 'zsh':
      content = ZSH_COMPLETION;
      filename = '_ants';
      installPath = path.join(os.homedir(), '.zsh', 'completions', filename);
      break;
    default:
      console.log(`❌ Unsupported shell: ${shell}`);
      console.log('Supported: bash, zsh');
      process.exit(1);
  }
  
  if (output.isJsonMode()) {
    output.outputJson({ shell: shellType, completion: content });
    return;
  }
  
  console.log(`🐚 ${shellType.toUpperCase()} Auto-Completion\n`);
  console.log(content);
  console.log('─'.repeat(60));
  console.log(`\n📋 To install:`);
  
  if (shellType === 'bash') {
    console.log(`   mkdir -p ~/.bash_completion.d`);
    console.log(`   ants completion bash > ~/.bash_completion.d/ants.bash`);
    console.log(`   echo 'source ~/.bash_completion.d/ants.bash' >> ~/.bashrc`);
    console.log(`   source ~/.bashrc`);
  } else {
    console.log(`   mkdir -p ~/.zsh/completions`);
    console.log(`   ants completion zsh > ~/.zsh/completions/_ants`);
    console.log(`   echo 'fpath=(~/.zsh/completions $fpath)' >> ~/.zshrc`);
    console.log(`   echo 'autoload -Uz compinit && compinit' >> ~/.zshrc`);
    console.log(`   source ~/.zshrc`);
  }
  
  logger.info(`Completion generated for ${shellType}`);
}

run();
