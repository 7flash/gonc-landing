---
description: How to deploy gitmaps.xyz landing page and app to the production server (202.155.132.139)
---

# Deploy GitMaps to Production

The gitmaps.xyz site runs on server `202.155.132.139`. NOT GitHub Pages.

## Landing Page (gonc-web → /srv/landing)

// turbo
1. Push changes to master: `git push origin master` (from c:\Code\gonc-web)

// turbo
2. SSH and pull on server:
```
ssh root@202.155.132.139 "cd /srv/landing && git pull"
```

The landing is static HTML/CSS/JS served by Caddy. No restart needed after git pull.

## GitMaps App (galaxy-canvas → /opt/gitmaps)

// turbo
1. Push changes to master: `git push origin master` (from c:\Code\galaxy-canvas)

// turbo
2. SSH, pull, and restart service:
```
ssh root@202.155.132.139 "cd /opt/gitmaps && git pull && bun install && systemctl restart gitmaps"
```

3. Verify:
```
ssh root@202.155.132.139 "systemctl status gitmaps --no-pager"
```

## Important Notes

- **DO NOT** use GitHub Pages — the repo has a broken Pages workflow that is irrelevant
- Landing is at `/srv/landing` on the server
- App is at `/opt/gitmaps` managed by `gitmaps.service` (systemd, auto-restarts)
- Caddy reverse proxy handles HTTPS + routing (landing routes → file_server, everything else → localhost:3335)
- The domain gitmaps.xyz DNS must point to 202.155.132.139
- Logs: `journalctl -u gitmaps -f`
