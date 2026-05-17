# AGENTS.md — @aa-ok99/ants

## ภาพรวมโปรเจกต์

- **แพ็กเกจ**: `@aa-ok99/ants` — Full-stack CLI automation platform (เหมือน Vercel CLI)
- **CLI entrypoint**: `bin/cli.js` (registered เป็น binary `ants`)
- **Vercel API**: `src/index.js` → deploy ที่ `https://ants-pied.vercel.app`
- **Node**: >= 16, CommonJS, ไม่มี build step
- **Version**: 2.0.0

## คำสั่ง & workflow

```bash
npm run dev     # node --watch bin/cli.js (auto-reload)
npm start       # node bin/cli.js
npm test        # jest --verbose (17 tests)
npm run version # git add -A (รันหลัง `npm version`)
```

Publish flow: `npm version <semver>` → prepublishOnly (test) → version (git add) → postversion (git push + push --tags)

## CLI Commands (ครบทุกหมวด)

### Auth
| Command | Description |
|---------|-------------|
| `ants login` | Login ด้วย email/password (interactive) |
| `ants logout` | Logout จาก account ปัจจุบัน |
| `ants whoami` | แสดง user ที่ login อยู่ |

### Project
| Command | Description |
|---------|-------------|
| `ants init` | สร้าง ants.config.json (interactive wizard) |
| `ants link` | Link directory กับ project |
| `ants list` | แสดง deployments ล่าสุด |
| `ants project ls` | แสดง projects ทั้งหมด |
| `ants project add` | สร้าง project ใหม่ |
| `ants project rm` | ลบ project |
| `ants remove --unlink` | Unlink project จาก directory |

### Deploy
| Command | Description |
|---------|-------------|
| `ants deploy` | Deploy ไป preview |
| `ants deploy --prod` | Deploy ไป production |
| `ants deploy --target=X` | Deploy ไป custom environment |
| `ants build` | Build project locally |
| `ants dev` | Start local dev server (port 3000) |
| `ants inspect [url]` | ดู deployment details |
| `ants promote [url]` | Promote deployment ไป production |
| `ants rollback [url]` | Rollback ไป deployment ก่อนหน้า |

### Environment
| Command | Description |
|---------|-------------|
| `ants env ls` | แสดง environment variables |
| `ants env add <name> [value]` | เพิ่ม env var |
| `ants env rm <name>` | ลบ env var |
| `ants env pull [file]` | Pull env vars ไป .env file |
| `ants env run -- <cmd>` | รัน command พร้อม env vars |

### Monitoring
| Command | Description |
|---------|-------------|
| `ants status` | เช็ค API status + response time |
| `ants logs [url]` | ดู deployment logs (--follow, --lines=N) |
| `ants metrics [name]` | Query observability metrics |
| `ants alerts` | ดู alerts ล่าสุด |

### Config
| Command | Description |
|---------|-------------|
| `ants config` | แสดง/แก้ไข config (show/get/set) |
| `ants routes list` | แสดง routing rules |
| `ants routes add` | เพิ่ม routing rule |
| `ants redirects list` | แสดง redirects |
| `ants redirects add` | เพิ่ม redirect |
| `ants flags list` | แสดง feature flags |
| `ants target list` | แสดง environments/targets |

### Scripts
| Command | Description |
|---------|-------------|
| `ants run [script]` | รัน script จาก config |
| `ants scripts` | แสดง scripts ที่มี |

### Plugins
| Command | Description |
|---------|-------------|
| `ants plugin list` | แสดง plugins ที่ติดตั้ง |
| `ants plugin add <name>` | ติดตั้ง plugin |
| `ants plugin rm <name>` | ลบ plugin |
| `ants plugin discover` | ค้นหา plugins |

### System
| Command | Description |
|---------|-------------|
| `ants telemetry` | จัดการ telemetry settings |
| `ants update` | เช็ค CLI update |
| `ants help [cmd]` | แสดง help สำหรับ command |
| `ants --verbose` | เปิด verbose logging |
| `ants --debug` | เปิด debug + stack traces |

## โครงสร้างไฟล์

```
bin/cli.js                      ← CLI router (รองรับ subcommands)
src/index.js                    ← Vercel serverless (4 endpoints)
src/api.js                      ← HTTP API client
src/auth.js                     ← Auth token management (~/.config/ants/auth.json)
src/project-link.js             ← Project linking (.ants file)
src/commands/
  init.js                       ← Interactive wizard (ใช้ prompts)
  status.js                     ← เช็ค API + response time
  config.js                     ← show/get/set config
  run.js                        ← รัน scripts จาก config
  list.js                       ← แสดง commands + plugins
  auth/
    login.js                    ← Login wizard
    logout.js                   ← Logout
    whoami.js                   ← แสดง user ปัจจุบัน
  deploy/
    deploy.js                   ← Deploy (gather files + upload)
    build.js                    ← Build locally
    dev.js                      ← Local dev server
    inspect.js                  ← ดู deployment details
    promote.js                  ← Promote to production
    rollback.js                 ← Rollback deployment
  env/
    env.js                      ← env ls/add/rm/pull/run
  project/
    project.js                  ← project ls/add/rm/inspect
    link.js                     ← Link directory to project
    remove.js                   ← Remove/unlink
  monitor/
    logs.js                     ← ดู logs (--follow)
    metrics.js                  ← Query metrics
    alerts.js                   ← ดู alerts
  config/
    routes.js                   ← จัดการ routes
    redirects.js                ← จัดการ redirects
    flags.js                    ← จัดการ feature flags
    target.js                   ← จัดการ environments
  plugin/
    plugin.js                   ← plugin list/add/rm/discover
  system/
    telemetry.js                ← telemetry settings
    update.js                   ← เช็ค update จาก npm
    help.js                     ← แสดง help
src/utils/
  config.js                     ← load/save/create/find ants.config.json
  logger.js                     ← logging ไป console + ants.log
  plugin-loader.js              ← โหลด plugins จาก ants.plugins/
ants.plugins/                   ← Directory สำหรับ user plugins (.js files)
__tests__/                      ← Jest tests (17 tests)
```

## Vercel API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/` or `/api` | Basic info (name, status, version, time) |
| `/api/status` | Health status + uptime + available endpoints |
| `/api/health` | Detailed health (memory, node version, platform) |
| `/api/version` | Package info (name, version, description) |

## Auth & Token

- Token เก็บที่ `~/.config/ants/auth.json`
- ใช้ env var `ANTS_TOKEN` แทน login ได้ (เหมาะสำหรับ CI/CD)
- `--token` flag มี priority กว่า env var

## Project Linking

- `ants link` สร้างไฟล์ `.ants` ใน directory ปัจจุบัน
- ไฟล์เก็บ `projectId`, `projectName`, `linkedAt`
- CLI ค้นหา `.ants` จาก cwd ขึ้นไป parent directories

## Plugin System

- โหลดไฟล์ `.js` จาก `ants.plugins/` directory อัตโนมัติ
- Plugin export เป็น function ที่รับ `context` argument

```js
module.exports = (context) => {
  console.log('Plugin executed!');
};
```

## ข้อควรระวัง

- **`commander` ถูกลบออกจาก dependencies** — CLI parse `process.argv` เอง
- **Config API base URL** hardcode: `https://ants-pied.vercel.app`
- **npm install** อาจต้องใช้ `--no-bin-links` ใน environment บางที่ (symlink permission issue)
- **Tests** ใช้ Jest — รันด้วย `node node_modules/jest/bin/jest.js` ถ้า bin links ไม่มี

## กฎ & คอนเวนชัน

- CommonJS (`require`/`module.exports`), ไม่มี TypeScript, ไม่มี bundler
- ไฟล์ config: `ants.config.json` (สร้างโดย `ants init`)
- Logging: ใช้ `src/utils/logger.js` — เขียนลง `ants.log` ใน cwd
- Error handling: ใช้ `--debug` flag เพื่อแสดง stack traces
- Subcommands ใช้ `process.argv[2]` (เช่น `ants env ls` → subcommand = `ls`)
