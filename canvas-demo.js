// ─── Interactive Canvas Demo ─────────────────────────────
// Self-contained mini canvas that proves the GitMaps concept
// in the browser — drag cards, pan, zoom, see connections + minimap

(function () {
    const container = document.getElementById('live-canvas-demo');
    if (!container) return;

    // ─── Config ──────────────────────────────────────────────
    const GRID_SIZE = 40;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 2.5;
    const MINIMAP_W = 120;
    const MINIMAP_H = 80;
    const PAN_SMOOTH = 0.12;

    // ─── State ───────────────────────────────────────────────
    let zoom = 0.75;
    let panX = 0, panY = 0;
    let targetPanX = 0, targetPanY = 0;
    let isDraggingCard = null;
    let dragOffsetX = 0, dragOffsetY = 0;
    let isPanning = false;
    let panStartX = 0, panStartY = 0;
    let panStartPanX = 0, panStartPanY = 0;
    let animId = null;
    let hoverCard = null;

    // ─── File card data ──────────────────────────────────────
    const files = [
        {
            id: 'server', name: 'server.ts', x: 60, y: 40, lang: 'ts',
            lines: [
                { tokens: [{ t: 'import', c: 'kw' }, { t: ' { verify } ', c: '' }, { t: 'from', c: 'kw' }, { t: " './auth'", c: 'str' }] },
                { tokens: [{ t: 'import', c: 'kw' }, { t: ' { db } ', c: '' }, { t: 'from', c: 'kw' }, { t: " './database'", c: 'str' }] },
                { tokens: [] },
                { tokens: [{ t: 'const', c: 'kw' }, { t: ' app = ', c: '' }, { t: 'new', c: 'kw' }, { t: ' Hono', c: 'type' }, { t: '()', c: '' }] },
                { tokens: [{ t: 'app.', c: '' }, { t: 'use', c: 'fn' }, { t: '(', c: '' }, { t: 'cors', c: 'fn' }, { t: '(), ', c: '' }, { t: 'logger', c: 'fn' }, { t: '())', c: '' }] },
                { tokens: [{ t: 'app.', c: '' }, { t: 'get', c: 'fn' }, { t: "(", c: '' }, { t: "'/api/users'", c: 'str' }, { t: ', ', c: '' }, { t: 'verify', c: 'fn' }, { t: ',', c: '' }] },
                { tokens: [{ t: '  ', c: '' }, { t: 'async', c: 'kw' }, { t: ' (c) => ', c: '' }, { t: 'c.json', c: 'fn' }, { t: '(', c: '' }] },
                { tokens: [{ t: '    ', c: '' }, { t: 'await', c: 'kw' }, { t: ' db.users.', c: '' }, { t: 'findAll', c: 'fn' }, { t: '()', c: '' }] },
                { tokens: [{ t: '))', c: '' }] },
            ]
        },
        {
            id: 'auth', name: 'auth.ts', x: 380, y: 10, lang: 'ts',
            lines: [
                { tokens: [{ t: 'import', c: 'kw' }, { t: ' { type User } ', c: '' }, { t: 'from', c: 'kw' }, { t: " './schema'", c: 'str' }] },
                { tokens: [] },
                { tokens: [{ t: 'export', c: 'kw' }, { t: ' async ', c: '' }, { t: 'function', c: 'kw' }, { t: ' verify', c: 'fn' }, { t: '(c, ', c: '' }, { t: 'next', c: '' }, { t: ') {', c: '' }] },
                { tokens: [{ t: '  ', c: '' }, { t: 'const', c: 'kw' }, { t: ' token = c.req.', c: '' }, { t: 'header', c: 'fn' }, { t: "(", c: '' }, { t: "'Authorization'", c: 'str' }, { t: ')', c: '' }] },
                { tokens: [{ t: '  ', c: '' }, { t: 'const', c: 'kw' }, { t: ' user = ', c: '' }, { t: 'jwt.verify', c: 'fn' }, { t: '(token)', c: '' }] },
                { tokens: [{ t: '  c.', c: '' }, { t: 'set', c: 'fn' }, { t: "(", c: '' }, { t: "'user'", c: 'str' }, { t: ', user ', c: '' }, { t: 'as', c: 'kw' }, { t: ' User)', c: 'type' }] },
                { tokens: [{ t: '  ', c: '' }, { t: 'await', c: 'kw' }, { t: ' ', c: '' }, { t: 'next', c: 'fn' }, { t: '()', c: '' }] },
                { tokens: [{ t: '}', c: '' }] },
            ]
        },
        {
            id: 'database', name: 'database.ts', x: 200, y: 280, lang: 'ts',
            lines: [
                { tokens: [{ t: 'import', c: 'kw' }, { t: ' { User, Post } ', c: '' }, { t: 'from', c: 'kw' }, { t: " './schema'", c: 'str' }] },
                { tokens: [{ t: 'import', c: 'kw' }, { t: ' { log } ', c: '' }, { t: 'from', c: 'kw' }, { t: " './logger'", c: 'str' }] },
                { tokens: [] },
                { tokens: [{ t: 'export', c: 'kw' }, { t: ' const', c: 'kw' }, { t: ' db = ', c: '' }, { t: 'new', c: 'kw' }, { t: ' Database', c: 'type' }, { t: '({', c: '' }] },
                { tokens: [{ t: '  users', c: '' }, { t: ': ', c: '' }, { t: 'table', c: 'fn' }, { t: '(User),', c: '' }] },
                { tokens: [{ t: '  posts', c: '' }, { t: ': ', c: '' }, { t: 'table', c: 'fn' }, { t: '(Post),', c: '' }] },
                { tokens: [{ t: '})', c: '' }] },
                { tokens: [{ t: 'log.', c: '' }, { t: 'info', c: 'fn' }, { t: '(', c: '' }, { t: "'DB ready'", c: 'str' }, { t: ', db.stats)', c: '' }] },
            ]
        },
        {
            id: 'schema', name: 'schema.ts', x: 560, y: 200, lang: 'ts',
            lines: [
                { tokens: [{ t: 'export', c: 'kw' }, { t: ' const', c: 'kw' }, { t: ' User = ', c: '' }, { t: 'z.object', c: 'fn' }, { t: '({', c: '' }] },
                { tokens: [{ t: '  id', c: '' }, { t: ': z.', c: '' }, { t: 'string', c: 'fn' }, { t: '().', c: '' }, { t: 'uuid', c: 'fn' }, { t: '(),', c: '' }] },
                { tokens: [{ t: '  email', c: '' }, { t: ': z.', c: '' }, { t: 'string', c: 'fn' }, { t: '().', c: '' }, { t: 'email', c: 'fn' }, { t: '(),', c: '' }] },
                { tokens: [{ t: '  role', c: '' }, { t: ': z.', c: '' }, { t: 'enum', c: 'fn' }, { t: '([', c: '' }, { t: "'admin'", c: 'str' }, { t: ', ', c: '' }, { t: "'user'", c: 'str' }, { t: ']),', c: '' }] },
                { tokens: [{ t: '})', c: '' }] },
                { tokens: [{ t: 'export', c: 'kw' }, { t: ' type', c: 'kw' }, { t: ' User = ', c: '' }, { t: 'z.infer', c: 'fn' }, { t: '<', c: '' }, { t: 'typeof', c: 'kw' }, { t: ' User>', c: '' }] },
            ]
        },
        {
            id: 'logger', name: 'logger.ts', x: 680, y: 50, lang: 'ts',
            lines: [
                { tokens: [{ t: 'export', c: 'kw' }, { t: ' const', c: 'kw' }, { t: ' log = {', c: '' }] },
                { tokens: [{ t: '  ', c: '' }, { t: 'info', c: 'fn' }, { t: '(msg, ...args) {', c: '' }] },
                { tokens: [{ t: '    console.', c: '' }, { t: 'log', c: 'fn' }, { t: '(', c: '' }, { t: '`[${', c: '' }, { t: 'ts', c: 'fn' }, { t: '()}] ${msg}`', c: 'str' }, { t: ')', c: '' }] },
                { tokens: [{ t: '  },', c: '' }] },
                { tokens: [{ t: '  ', c: '' }, { t: 'error', c: 'fn' }, { t: '(msg, err) {', c: '' }] },
                { tokens: [{ t: '    console.', c: '' }, { t: 'error', c: 'fn' }, { t: '(msg, err?.stack)', c: '' }] },
                { tokens: [{ t: '  }', c: '' }] },
                { tokens: [{ t: '}', c: '' }] },
            ]
        },
    ];

    // ─── Connections (import links) ──────────────────────────
    const connections = [
        { from: 'server', fromLine: 0, to: 'auth', toLine: 2, color: '#a78bfa' },
        { from: 'server', fromLine: 1, to: 'database', toLine: 3, color: '#22d3ee' },
        { from: 'auth', fromLine: 0, to: 'schema', toLine: 0, color: '#fbbf24' },
        { from: 'database', fromLine: 0, to: 'schema', toLine: 0, color: '#34d399' },
        { from: 'database', fromLine: 1, to: 'logger', toLine: 0, color: '#fb923c' },
    ];

    // ─── Card sizes (computed after render) ──────────────────
    const CARD_W = 210;
    const LINE_H = 20;
    const HEADER_H = 32;

    function cardH(f) { return HEADER_H + f.lines.length * LINE_H + 12; }

    // ─── Build DOM ───────────────────────────────────────────
    const world = document.createElement('div');
    world.className = 'cd-world';
    world.style.cssText = 'position:absolute;transform-origin:0 0;will-change:transform;';

    // Grid (rendered via CSS background on the world)
    world.style.backgroundImage = `
        linear-gradient(rgba(128,128,200,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(128,128,200,0.04) 1px, transparent 1px)
    `;
    world.style.backgroundSize = `${GRID_SIZE}px ${GRID_SIZE}px`;
    world.style.width = '2000px';
    world.style.height = '1200px';

    // SVG layer for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'cd-connections');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:visible;';
    world.appendChild(svg);

    // Create file cards
    const cardEls = {};
    files.forEach(f => {
        const card = document.createElement('div');
        card.className = 'cd-card';
        card.dataset.id = f.id;
        card.style.cssText = `position:absolute;left:${f.x}px;top:${f.y}px;width:${CARD_W}px;z-index:1;`;

        // Header
        const header = document.createElement('div');
        header.className = 'cd-card-header';
        header.innerHTML = `
            <span class="cd-dot" style="background:#ef4444"></span>
            <span class="cd-dot" style="background:#f59e0b"></span>
            <span class="cd-dot" style="background:#22c55e"></span>
            <span class="cd-card-name">${f.name}</span>
        `;
        card.appendChild(header);

        // Code lines
        const body = document.createElement('div');
        body.className = 'cd-card-body';
        f.lines.forEach((line, i) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'cd-line';
            lineEl.dataset.lineIdx = i;
            const numEl = document.createElement('span');
            numEl.className = 'cd-line-num';
            numEl.textContent = (i + 1).toString();
            lineEl.appendChild(numEl);
            line.tokens.forEach(tok => {
                const span = document.createElement('span');
                if (tok.c) span.className = 'cd-tok-' + tok.c;
                span.textContent = tok.t;
                lineEl.appendChild(span);
            });
            body.appendChild(lineEl);
        });
        card.appendChild(body);

        cardEls[f.id] = card;
        world.appendChild(card);
    });

    container.appendChild(world);

    // ─── Minimap ─────────────────────────────────────────────
    const minimap = document.createElement('div');
    minimap.className = 'cd-minimap';
    const minimapCanvas = document.createElement('canvas');
    minimapCanvas.width = MINIMAP_W * 2; // retina
    minimapCanvas.height = MINIMAP_H * 2;
    minimapCanvas.style.cssText = `width:${MINIMAP_W}px;height:${MINIMAP_H}px;`;
    minimap.appendChild(minimapCanvas);
    container.appendChild(minimap);

    // ─── Instructions overlay ────────────────────────────────
    const hint = document.createElement('div');
    hint.className = 'cd-hint';
    hint.innerHTML = '<span>Drag cards</span><span>·</span><span>Pan background</span><span>·</span><span>Scroll to zoom</span>';
    container.appendChild(hint);

    // Fade hint on first interaction
    let hintVisible = true;
    function hideHint() {
        if (hintVisible) {
            hint.style.opacity = '0';
            hintVisible = false;
            setTimeout(() => hint.style.display = 'none', 400);
        }
    }

    // ─── Connection line endpoints ───────────────────────────
    function getLineAnchor(fileId, lineIdx, side) {
        const f = files.find(f => f.id === fileId);
        const cy = f.y + HEADER_H + lineIdx * LINE_H + LINE_H / 2;
        if (side === 'right') return { x: f.x + CARD_W, y: cy };
        return { x: f.x, y: cy };
    }

    // Get all card IDs directly connected to a given card
    function getConnectedIds(cardId) {
        const ids = new Set();
        connections.forEach(conn => {
            if (conn.from === cardId) ids.add(conn.to);
            if (conn.to === cardId) ids.add(conn.from);
        });
        return ids;
    }

    function drawConnections(highlightId) {
        svg.innerHTML = '';
        // Defs for glow filters
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'connGlow');
        filter.innerHTML = '<feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
        defs.appendChild(filter);
        // Stronger glow for highlighted connections
        const filterBright = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filterBright.setAttribute('id', 'connGlowBright');
        filterBright.innerHTML = '<feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
        defs.appendChild(filterBright);
        svg.appendChild(defs);

        const isHighlighting = !!highlightId;

        connections.forEach(conn => {
            const fromFile = files.find(f => f.id === conn.from);
            const toFile = files.find(f => f.id === conn.to);
            if (!fromFile || !toFile) return;

            const isActive = isHighlighting && (conn.from === highlightId || conn.to === highlightId);
            const isDimmed = isHighlighting && !isActive;

            // Determine which side to anchor
            const fromRight = fromFile.x + CARD_W;
            const toLeft = toFile.x;
            const fromAnchor = getLineAnchor(conn.from, conn.fromLine, fromRight < toLeft + CARD_W / 2 ? 'right' : 'left');
            const toAnchor = getLineAnchor(conn.to, conn.toLine, toLeft > fromFile.x ? 'left' : 'right');

            const dx = toAnchor.x - fromAnchor.x;
            const cpOffset = Math.min(Math.abs(dx) * 0.5, 100);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d',
                `M${fromAnchor.x},${fromAnchor.y} C${fromAnchor.x + cpOffset},${fromAnchor.y} ${toAnchor.x - cpOffset},${toAnchor.y} ${toAnchor.x},${toAnchor.y}`
            );
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', conn.color);
            path.setAttribute('stroke-width', isActive ? '2.5' : '1.5');
            path.setAttribute('opacity', isDimmed ? '0.12' : isActive ? '0.9' : '0.5');
            path.setAttribute('filter', isActive ? 'url(#connGlowBright)' : 'url(#connGlow)');
            path.setAttribute('stroke-dasharray', isActive ? 'none' : '6 4');

            // Animate dash (only on non-highlighted)
            if (!isActive) {
                const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                anim.setAttribute('attributeName', 'stroke-dashoffset');
                anim.setAttribute('values', '0;-20');
                anim.setAttribute('dur', '2s');
                anim.setAttribute('repeatCount', 'indefinite');
                path.appendChild(anim);
            }

            svg.appendChild(path);

            // Dots at connection endpoints
            const dotOpacity = isDimmed ? '0.15' : isActive ? '1' : '0.7';
            const dotR = isActive ? '4' : '3';

            const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot1.setAttribute('cx', fromAnchor.x);
            dot1.setAttribute('cy', fromAnchor.y);
            dot1.setAttribute('r', dotR);
            dot1.setAttribute('fill', conn.color);
            dot1.setAttribute('opacity', dotOpacity);
            if (isActive) dot1.setAttribute('filter', 'url(#connGlow)');
            svg.appendChild(dot1);

            const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot2.setAttribute('cx', toAnchor.x);
            dot2.setAttribute('cy', toAnchor.y);
            dot2.setAttribute('r', dotR);
            dot2.setAttribute('fill', conn.color);
            dot2.setAttribute('opacity', dotOpacity);
            if (isActive) dot2.setAttribute('filter', 'url(#connGlow)');
            svg.appendChild(dot2);
        });
    }

    // ─── Transform ───────────────────────────────────────────
    function applyTransform() {
        world.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }

    function smoothPan() {
        panX += (targetPanX - panX) * PAN_SMOOTH;
        panY += (targetPanY - panY) * PAN_SMOOTH;
        applyTransform();
        drawMinimap();
        if (Math.abs(panX - targetPanX) > 0.5 || Math.abs(panY - targetPanY) > 0.5) {
            animId = requestAnimationFrame(smoothPan);
        } else {
            panX = targetPanX;
            panY = targetPanY;
            applyTransform();
            drawMinimap();
            animId = null;
        }
    }

    function startSmooth() {
        if (!animId) animId = requestAnimationFrame(smoothPan);
    }

    // ─── Minimap rendering ───────────────────────────────────
    function drawMinimap() {
        const ctx = minimapCanvas.getContext('2d');
        const scale = 2; // retina
        ctx.clearRect(0, 0, MINIMAP_W * scale, MINIMAP_H * scale);

        // World bounds
        const worldW = 2000, worldH = 1200;
        const mmScaleX = (MINIMAP_W * scale) / worldW;
        const mmScaleY = (MINIMAP_H * scale) / worldH;
        const mmScale = Math.min(mmScaleX, mmScaleY);

        // Draw connection lines
        connections.forEach(conn => {
            const fromFile = files.find(f => f.id === conn.from);
            const toFile = files.find(f => f.id === conn.to);
            if (!fromFile || !toFile) return;
            ctx.strokeStyle = conn.color;
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(fromFile.x * mmScale + (CARD_W * mmScale / 2), fromFile.y * mmScale + (cardH(fromFile) * mmScale / 2));
            ctx.lineTo(toFile.x * mmScale + (CARD_W * mmScale / 2), toFile.y * mmScale + (cardH(toFile) * mmScale / 2));
            ctx.stroke();
        });

        // Draw file cards as dots
        ctx.globalAlpha = 1;
        files.forEach(f => {
            const rx = f.x * mmScale;
            const ry = f.y * mmScale;
            const rw = CARD_W * mmScale;
            const rh = cardH(f) * mmScale;
            ctx.fillStyle = f.id === (hoverCard || '') ? 'rgba(167,139,250,0.7)' : 'rgba(167,139,250,0.4)';
            ctx.fillRect(rx, ry, rw, rh);
        });

        // Draw viewport rect
        const containerRect = container.getBoundingClientRect();
        const vpX = (-panX / zoom) * mmScale;
        const vpY = (-panY / zoom) * mmScale;
        const vpW = (containerRect.width / zoom) * mmScale;
        const vpH = (containerRect.height / zoom) * mmScale;

        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;
        ctx.strokeRect(vpX, vpY, vpW, vpH);

        // Pulsing viewport fill
        ctx.fillStyle = 'rgba(34,211,238,0.06)';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(vpX, vpY, vpW, vpH);
        ctx.globalAlpha = 1;
    }

    // ─── Card dragging ───────────────────────────────────────
    world.addEventListener('pointerdown', e => {
        const card = e.target.closest('.cd-card');
        if (card) {
            hideHint();
            // Clear any highlighting before starting drag
            applyHighlight(null);
            isDraggingCard = card.dataset.id;
            const f = files.find(f => f.id === isDraggingCard);
            const worldRect = world.getBoundingClientRect();
            dragOffsetX = (e.clientX - worldRect.left) / zoom - f.x;
            dragOffsetY = (e.clientY - worldRect.top) / zoom - f.y;
            card.style.zIndex = '10';
            card.classList.add('cd-card--dragging');
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // ─── Pan ─────────────────────────────────────────────────
    container.addEventListener('pointerdown', e => {
        if (isDraggingCard) return;
        if (e.target.closest('.cd-card') || e.target.closest('.cd-minimap')) return;
        hideHint();
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        panStartPanX = targetPanX;
        panStartPanY = targetPanY;
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('pointermove', e => {
        if (isDraggingCard) {
            const f = files.find(f => f.id === isDraggingCard);
            const worldRect = world.getBoundingClientRect();
            f.x = (e.clientX - worldRect.left) / zoom - dragOffsetX;
            f.y = (e.clientY - worldRect.top) / zoom - dragOffsetY;
            const card = cardEls[isDraggingCard];
            card.style.left = f.x + 'px';
            card.style.top = f.y + 'px';
            drawConnections();
            drawMinimap();
            return;
        }
        if (isPanning) {
            const dx = e.clientX - panStartX;
            const dy = e.clientY - panStartY;
            targetPanX = panStartPanX + dx;
            targetPanY = panStartPanY + dy;
            startSmooth();
        }
    });

    window.addEventListener('pointerup', () => {
        if (isDraggingCard) {
            const card = cardEls[isDraggingCard];
            card.style.zIndex = '1';
            card.classList.remove('cd-card--dragging');
            isDraggingCard = null;
        }
        if (isPanning) {
            isPanning = false;
            container.style.cursor = '';
        }
    });

    // ─── Zoom ────────────────────────────────────────────────
    container.addEventListener('wheel', e => {
        e.preventDefault();
        hideHint();
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const worldX = (mx - panX) / zoom;
        const worldY = (my - panY) / zoom;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * delta));

        targetPanX = mx - worldX * newZoom;
        targetPanY = my - worldY * newZoom;
        zoom = newZoom;
        startSmooth();
    }, { passive: false });

    // ─── Hover effect with connection highlighting ────────────
    function applyHighlight(cardId) {
        hoverCard = cardId;
        if (cardId) {
            const connectedIds = getConnectedIds(cardId);
            // Dim unrelated cards, highlight connected ones
            files.forEach(f => {
                const el = cardEls[f.id];
                if (f.id === cardId) {
                    el.classList.remove('cd-card--dimmed');
                    el.classList.add('cd-card--highlighted');
                } else if (connectedIds.has(f.id)) {
                    el.classList.remove('cd-card--dimmed');
                    el.classList.add('cd-card--connected');
                } else {
                    el.classList.remove('cd-card--highlighted', 'cd-card--connected');
                    el.classList.add('cd-card--dimmed');
                }
            });
            drawConnections(cardId);
        } else {
            // Clear all highlight states
            files.forEach(f => {
                cardEls[f.id].classList.remove('cd-card--dimmed', 'cd-card--highlighted', 'cd-card--connected');
            });
            drawConnections();
        }
        drawMinimap();
    }

    world.addEventListener('pointerover', e => {
        if (isDraggingCard) return;
        const card = e.target.closest('.cd-card');
        if (card && hoverCard !== card.dataset.id) {
            applyHighlight(card.dataset.id);
        }
    });
    world.addEventListener('pointerout', e => {
        if (isDraggingCard) return;
        const card = e.target.closest('.cd-card');
        if (card && hoverCard === card.dataset.id) {
            // Check if we're moving to another card (pointerover will fire)
            // Use a microtask to avoid flicker
            setTimeout(() => {
                if (hoverCard === card.dataset.id) {
                    applyHighlight(null);
                }
            }, 30);
        }
    });

    // ─── Touch support (pinch zoom) ──────────────────────────
    let lastTouchDist = 0;
    container.addEventListener('touchstart', e => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDist = Math.sqrt(dx * dx + dy * dy);
        }
    }, { passive: true });

    container.addEventListener('touchmove', e => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const scale = dist / lastTouchDist;
            zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * scale));
            lastTouchDist = dist;
            applyTransform();
            drawMinimap();
        }
    }, { passive: false });

    // ─── Minimap click-to-navigate ───────────────────────────
    minimap.addEventListener('click', e => {
        const rect = minimap.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const worldW = 2000, worldH = 1200;
        const mmScaleX = MINIMAP_W / worldW;
        const mmScaleY = MINIMAP_H / worldH;
        const mmScale = Math.min(mmScaleX, mmScaleY);

        const containerRect = container.getBoundingClientRect();
        const worldClickX = mx / mmScale;
        const worldClickY = my / mmScale;

        targetPanX = -(worldClickX * zoom) + containerRect.width / 2;
        targetPanY = -(worldClickY * zoom) + containerRect.height / 2;
        startSmooth();
    });

    // ─── Initial setup ───────────────────────────────────────
    // Center the view on the cards
    function centerView() {
        const containerRect = container.getBoundingClientRect();
        // Find bounding box of all cards
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        files.forEach(f => {
            minX = Math.min(minX, f.x);
            minY = Math.min(minY, f.y);
            maxX = Math.max(maxX, f.x + CARD_W);
            maxY = Math.max(maxY, f.y + cardH(f));
        });
        const contentW = maxX - minX;
        const contentH = maxY - minY;
        const centerX = minX + contentW / 2;
        const centerY = minY + contentH / 2;

        // Fit zoom
        const padX = 80, padY = 60;
        const fitZoomX = (containerRect.width - padX * 2) / contentW;
        const fitZoomY = (containerRect.height - padY * 2) / contentH;
        zoom = Math.min(fitZoomX, fitZoomY, 1);
        zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

        panX = targetPanX = (containerRect.width / 2) - centerX * zoom;
        panY = targetPanY = (containerRect.height / 2) - centerY * zoom;
    }

    // Need to wait a frame so container has dimensions
    requestAnimationFrame(() => {
        centerView();
        applyTransform();
        drawConnections();
        drawMinimap();
    });

    // ─── Resize handler ──────────────────────────────────────
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            centerView();
            applyTransform();
            drawMinimap();
        }, 150);
    });

    // ─── Entrance animation ──────────────────────────────────
    container.classList.add('cd-ready');

})();
