# 🐜 @aa-ok99/ants

Full-stack CLI automation platform — เหมือน Vercel CLI แต่ lightweight กว่า

## Installation

```bash
npm install -g @aa-ok99/ants
```

## Quick Start

```bash
# Initialize project
ants init

# Deploy
ants deploy
ants deploy --prod

# Manage environment
ants env add API_KEY secret123
ants env pull .env

# Monitor
ants status
ants logs --follow

# Plugins
ants plugin discover
ants plugin add hello
```

## Commands

| Category | Commands |
|----------|----------|
| **Auth** | `login`, `logout`, `whoami` |
| **Project** | `init`, `link`, `list`, `project`, `remove` |
| **Deploy** | `deploy`, `build`, `dev`, `inspect`, `promote`, `rollback` |
| **Environment** | `env ls/add/rm/pull/run` |
| **Monitoring** | `status`, `logs`, `metrics`, `alerts` |
| **Config** | `config`, `routes`, `redirects`, `flags`, `target` |
| **Scripts** | `run`, `scripts` |
| **Plugins** | `plugin list/add/rm/discover` |
| **System** | `telemetry`, `update`, `help` |

Run `ants help` เพื่อดูรายละเอียดทุก command

## Development

```bash
npm run dev     # node --watch (auto-reload)
npm test        # jest (17 tests)
```

## API

Deployed at: https://ants-pied.vercel.app

| Endpoint | Description |
|----------|-------------|
| `/api` | Basic info |
| `/api/status` | Health status |
| `/api/health` | Detailed health |
| `/api/version` | Package info |

## License

MIT
