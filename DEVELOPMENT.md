# 🚀 AI Initialization Guide — @aa-ok99/ants

> สำหรับ AI/Agent ที่เข้ามาทำงานต่อ — อ่านไฟล์นี้แล้วเริ่มพัฒนาได้เลย

---

## 📋 Project Overview

| ข้อมูล | ค่า |
|--------|-----|
| **Package** | `@aa-ok99/ants` |
| **Type** | Full-Stack CLI Automation Platform (เหมือน Vercel CLI) |
| **Language** | Node.js, CommonJS, ไม่มี TypeScript/bundler |
| **Node Version** | >= 16 |
| **Current Version** | 2.0.2 |
| **npm** | https://www.npmjs.com/package/@aa-ok99/ants |
| **GitHub** | https://github.com/Aa-ok99/ants |
| **Vercel API** | https://ants-pied.vercel.app |

---

## 🏗️ Architecture

```
ants/
├── bin/cli.js                    ← CLI entrypoint (parse argv manually)
├── src/
│   ├── index.js                  ← Vercel serverless API (4 endpoints)
│   ├── api.js                    ← HTTP API client (get/post/delete)
│   ├── auth.js                   ← Auth token (~/.config/ants/auth.json)
│   ├── project-link.js           ← Project linking (.ants file)
│   ├── commands/
│   │   ├── init.js               ← Interactive wizard (prompts)
│   │   ├── status.js             ← API status check
│   │   ├── config.js             ← config show/get/set
│   │   ├── run.js                ← Run scripts from config
│   │   ├── list.js               ← List commands + plugins
│   │   ├── auth/
│   │   │   ├── login.js          ← Login wizard
│   │   │   ├── logout.js         ← Logout
│   │   │   └── whoami.js         ← Show current user
│   │   ├── deploy/
│   │   │   ├── deploy.js         ← Deploy (gather files + upload)
│   │   │   ├── build.js          ← Build locally
│   │   │   ├── dev.js            ← Local dev server
│   │   │   ├── inspect.js        ← Inspect deployment
│   │   │   ├── promote.js        ← Promote to production
│   │   │   └── rollback.js       ← Rollback deployment
│   │   ├── env/
│   │   │   └── env.js            ← env ls/add/rm/pull/run
│   │   ├── project/
│   │   │   ├── project.js        ← project ls/add/rm/inspect
│   │   │   ├── link.js           ← Link directory to project
│   │   │   └── remove.js         ← Remove/unlink
│   │   ├── monitor/
│   │   │   ├── logs.js           ← View logs
│   │   │   ├── metrics.js        ← Query metrics
│   │   │   ├── alerts.js         ← View alerts
│   │   │   └── analytics.js      ← Usage analytics
│   │   ├── config/
│   │   │   ├── routes.js         ← Manage routes
│   │   │   ├── redirects.js      ← Manage redirects
│   │   │   ├── flags.js          ← Manage feature flags
│   │   │   ├── target.js         ← Manage environments
│   │   │   └── validate.js       ← Validate config
│   │   ├── plugin/
│   │   │   └── plugin.js         ← plugin list/add/rm/discover
│   │   └── system/
│   │       ├── telemetry.js      ← Telemetry settings
│   │       ├── update.js         ← Check npm updates
│   │       ├── help.js           ← Show help
│   │       └── completion.js     ← Shell completion (bash/zsh)
│   └── utils/
│       ├── config.js             ← Load/save/create/find ants.config.json
│       ├── logger.js             ← Logging to console + ants.log
│       ├── plugin-loader.js      ← Load plugins from ants.plugins/
│       └── output.js             ← JSON/table output utilities
├── ants.plugins/                 ← User plugins directory
├── __tests__/                    ← Jest tests (81 tests)
├── .github/workflows/
│   └── publish.yml               ← Auto-publish on tag push
├── ants.config.json              ← Project config
├── package.json                  ← Dependencies: prompts, jest
└── vercel.json                   ← Vercel deployment config
```

---

## 🛠️ Development Commands

```bash
npm run dev          # node --watch bin/cli.js (auto-reload)
npm start            # node bin/cli.js
npm test             # jest --verbose (81 tests)
npm install -g .     # Install globally for testing
npm publish          # Publish to npm (requires OTP)
npm version patch    # Bump version
```

**Note:** ใน environment บางที่ต้องใช้ `npm install --no-bin-links` (symlink permission issue)

---

## 📦 All Commands (27 commands)

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
| `ants list` | แสดง commands + plugins |
| `ants project ls` | แสดง projects ทั้งหมด |
| `ants project add` | สร้าง project ใหม่ (local fallback) |
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
| `ants analytics` | ดู usage analytics |
| `ants analytics commands` | แสดง command usage stats |
| `ants analytics errors` | แสดง error stats |

### Config
| Command | Description |
|---------|-------------|
| `ants config` | แสดง/แก้ไข config (show/get/set) |
| `ants validate` | Validate ants.config.json |
| `ants validate --json` | Validate output เป็น JSON |
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
| `ants completion [shell]` | Generate shell completion (bash/zsh) |
| `ants --verbose` | เปิด verbose logging |
| `ants --debug` | เปิด debug + stack traces |
| `ants --json` | Output เป็น JSON (ทุก command) |

---

## 🔑 Key Conventions

1. **CLI parse argv เอง** — ไม่ได้ใช้ commander
2. **Subcommand อยู่ที่ `process.argv[3]`** (เช่น `ants env ls` → `argv[3]` = `ls`)
3. **CommonJS** — ใช้ `require`/`module.exports`
4. **API base URL** hardcode: `https://ants-pied.vercel.app`
5. **Auth token** เก็บที่ `~/.config/ants/auth.json`
6. **Project link** เก็บที่ `.ants` ใน directory
7. **Local projects** เก็บที่ `~/.config/ants/projects.json`
8. **Logging** เขียนลง `ants.log` ใน cwd
9. **Plugin system** โหลด `.js` จาก `ants.plugins/`
10. **Tests** ใช้ Jest — 81 tests ครอบคลุมทุก command

---

## 🚨 Known Gotchas

- `npm install` อาจต้องใช้ `--no-bin-links` (symlink permission)
- `npm publish` ต้องใส่ OTP จาก authenticator
- Vercel API endpoints ยังเป็น mock (ส่ง JSON ธรรมดา) — ยังไม่มี backend จริง
- `project add` ใช้ local fallback เมื่อ API ไม่พร้อม
- Test plugins สะสมใน `ants.plugins/` — ต้อง clean เป็นระยะ

---

## 📝 Version History

| Version | Changes |
|---------|---------|
| **2.0.0** | Full-stack CLI platform (25 commands, 81 tests, plugins, auth, deploy) |
| **2.0.1** | Bug fixes (project add 404, inspect/promote/rollback args, error handling) |
| **2.0.2** | `validate`, `analytics`, `completion`, `--json` flag |

---

## 🚀 Next Steps (Ideas)

- [ ] เพิ่ม `ants secret` — จัดการ secrets (แยกจาก env)
- [ ] เพิ่ม `ants domain` — จัดการ domains
- [ ] เพิ่ม `ants webhook` — จัดการ webhooks
- [ ] เพิ่ม `ants cache` — จัดการ cache
- [ ] เพิ่ม `ants team` — จัดการ team members
- [ ] เพิ่ม `ants template` — สร้าง project จาก template
- [ ] เพิ่ม `ants diff` — เปรียบเทียบ 2 deployments
- [ ] เพิ่ม **Interactive Shell** — `ants shell` (REPL mode)
- [ ] เพิ่ม **Dry-run mode** — `ants deploy --dry-run`
- [ ] เพิ่ม **Multi-project** — สลับ project ได้โดยไม่ต้อง unlink
- [ ] สร้าง **GitHub Action** — `@aa-ok99/ants-action`
- [ ] สร้าง **Docker image** — `docker pull aaok99/ants`
- [ ] เพิ่ม **Health checks** — `ants health`
- [ ] เพิ่ม **Pre-commit hook** — `ants hook install`
- [ ] สร้าง **Web Dashboard** — UI สำหรับจัดการ projects

---

## 💡 Quick Start สำหรับ AI

1. อ่านไฟล์นี้ — เข้าใจ architecture และ commands ทั้งหมด
2. รัน `npm install --no-bin-links` — ติดตั้ง dependencies
3. รัน `npm test` — เช็ค tests ผ่าน 81/81
4. รัน `npm install -g .` — ติดตั้ง globally สำหรับทดสอบ
5. เริ่มพัฒนา feature ใหม่ หรือแก้ bug ตามที่ต้องการ
