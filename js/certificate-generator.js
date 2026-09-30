/* ══════════════════════════════════════════════════════════
   q000 — Certificate generator (Canvas)
   Developer: DOJKA
   Exposes: window.Q000Certificate.download(result, t, lang)
   ══════════════════════════════════════════════════════════ */

(function () {
    const W = 1200;
    const H = 820;
    const BRAND = 'q000';

    /* the certificate is a printed document — it keeps its own dark canvas
       and stays strictly black & white in both site themes */
    const C = {
        ink: '#0a0a0a',
        dim: '#a3a3a3',
        soft: '#d7d7d7',
        white: '#ffffff',
        cyan: '#ffffff',
        violet: '#9c9c9c',
        green: '#d7d7d7',
        rose: '#ffffff'
    };

    function font(ctx, size, weight = 400) {
        const family = "'Cairo', 'Inter', 'Tajawal', sans-serif";
        ctx.font = `${weight} ${size}px ${family}`;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function drawMark(ctx, cx, cy, size) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(size / 24, size / 24);
        const g = ctx.createLinearGradient(-12, -12, 12, 12);
        g.addColorStop(0, C.cyan);
        g.addColorStop(1, C.violet);
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(-8, -7.6);
        ctx.lineTo(-8, 1.4);
        ctx.quadraticCurveTo(-8, 8.4, 0, 11);
        ctx.quadraticCurveTo(8, 8.4, 8, 1.4);
        ctx.lineTo(8, -7.6);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-3.4, 0.2);
        ctx.lineTo(-0.6, 3);
        ctx.lineTo(4, -1.8);
        ctx.stroke();
        ctx.restore();
    }

    function pill(ctx, text, x, y, w, h, color) {
        ctx.save();
        roundRect(ctx, x, y, w, h, h / 2);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
        font(ctx, 18, 600);
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + w / 2, y + h / 2 + 1);
        ctx.restore();
    }

    function draw(result, t, lang) {
        const canvas = document.getElementById('certificateCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = W;
        canvas.height = H;
        ctx.clearRect(0, 0, W, H);

        const isRTL = lang === 'ar';
        const ok = result.isClean;
        const isUrl = !!result.isUrl;
        const accent = ok ? C.soft : C.white;

        /* background */
        const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
        bg.addColorStop(0, '#050505');
        bg.addColorStop(0.55, '#0b0b0b');
        bg.addColorStop(1, '#111111');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        /* glows */
        const g1 = ctx.createRadialGradient(190, 70, 10, 190, 70, 460);
        g1.addColorStop(0, 'rgba(255,255,255,0.15)');
        g1.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, W, H);

        const g2 = ctx.createRadialGradient(1010, 760, 10, 1010, 760, 460);
        g2.addColorStop(0, 'rgba(255,255,255,0.10)');
        g2.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);

        /* grid */
        ctx.strokeStyle = 'rgba(255,255,255,0.022)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y <= H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        /* frame */
        const frame = ctx.createLinearGradient(0, 0, W, H);
        frame.addColorStop(0, C.cyan);
        frame.addColorStop(1, C.violet);
        ctx.strokeStyle = frame;
        ctx.lineWidth = 4;
        roundRect(ctx, 18, 18, W - 36, H - 36, 22);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.10)';
        ctx.lineWidth = 1;
        roundRect(ctx, 32, 32, W - 64, H - 64, 14);
        ctx.stroke();

        /* ── header ── */
        drawMark(ctx, W / 2, 96, 52);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        font(ctx, 46, 800);
        const tg = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0);
        tg.addColorStop(0, C.white);
        tg.addColorStop(0.5, C.cyan);
        tg.addColorStop(1, C.violet);
        ctx.fillStyle = tg;
        ctx.fillText(BRAND, W / 2, 180);

        font(ctx, 24, 600);
        ctx.fillStyle = C.soft;
        ctx.fillText(t(isUrl ? 'cert.titleUrl' : 'cert.title'), W / 2, 214);

        pill(ctx, `${t('cert.id')}: ${result.certificateId}`, W / 2 - 165, 232, 330, 34, C.cyan);

        ctx.strokeStyle = 'rgba(255,255,255,0.09)';
        ctx.beginPath();
        ctx.moveTo(110, 292);
        ctx.lineTo(W - 110, 292);
        ctx.stroke();

        /* ── info rows ── */
        const timeStr = new Date(result.scannedAt)
            .toLocaleTimeString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date(result.scannedAt)
            .toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { dateStyle: 'long' });

        const rows = isUrl
            ? [
                [t('cert.link'), result.url],
                [t('cert.host'), result.host],
                [t('cert.protocol'), result.protocolLabel],
                [t('cert.time'), timeStr],
                [t('cert.date'), dateStr]
            ]
            : [
                [t('cert.file'), result.fileName],
                [t('cert.size'), result.fileSizeLabel],
                [t('cert.type'), result.fileType],
                [t('cert.time'), timeStr],
                [t('cert.date'), dateStr]
            ];

        const cardX = 110;
        const cardW = W - 220;
        const cardY = 312;
        const rowH = 46;

        ctx.save();
        roundRect(ctx, cardX, cardY, cardW, rowH * rows.length + 20, 16);
        ctx.fillStyle = 'rgba(255,255,255,0.035)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        rows.forEach(([label, value], i) => {
            const y = cardY + 36 + i * rowH;
            if (i) {
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.beginPath();
                ctx.moveTo(cardX + 24, y - 22);
                ctx.lineTo(cardX + cardW - 24, y - 22);
                ctx.stroke();
            }
            font(ctx, 19, 500);
            ctx.fillStyle = C.dim;
            ctx.textAlign = isRTL ? 'right' : 'left';
            ctx.fillText(label, isRTL ? cardX + cardW - 24 : cardX + 24, y);

            font(ctx, 20, 700);
            ctx.fillStyle = C.white;
            ctx.textAlign = isRTL ? 'left' : 'right';
            const txt = String(value);
            // shrink long names
            let size = 20;
            while (ctx.measureText(txt).width > cardW - 220 && size > 12) {
                size -= 1;
                font(ctx, size, 700);
            }
            ctx.fillText(txt, isRTL ? cardX + 24 : cardX + cardW - 24, y);
        });

        /* ── verdict ── */
        const cy = 640;
        const cx = W / 2;

        /* safe = a calm hollow ring · danger = a solid inverted block,
           the loudest thing a black & white document can say */
        ctx.save();
        ctx.shadowColor = ok ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = ok ? 24 : 52;
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 42, 0, Math.PI * 2);
        if (ok) {
            ctx.fillStyle = 'rgba(255,255,255,0.06)';
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = C.white;
            ctx.stroke();
        } else {
            ctx.fillStyle = C.white;
            ctx.fill();
        }
        ctx.restore();

        ctx.lineCap = 'round';
        if (ok) {
            ctx.strokeStyle = C.white;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(cx - 17, cy - 11);
            ctx.lineTo(cx - 5, cy + 2);
            ctx.lineTo(cx + 18, cy - 17);
            ctx.stroke();
        } else {
            ctx.strokeStyle = C.ink;
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(cx - 16, cy - 26);
            ctx.lineTo(cx + 16, cy + 6);
            ctx.moveTo(cx + 16, cy - 26);
            ctx.lineTo(cx - 16, cy + 6);
            ctx.stroke();
        }

        ctx.textAlign = 'center';
        font(ctx, ok ? 28 : 34, 800);
        ctx.fillStyle = accent;
        ctx.fillText(ok ? (isUrl ? t('url.verdictSafe') : t('cert.safe'))
            : (isUrl ? t('url.verdictDanger') : t('cert.danger')), cx, cy + 62);

        font(ctx, 19, 500);
        ctx.fillStyle = C.dim;
        const lines = ok
            ? [t('cert.clean1'), t('cert.clean2')]
            : [t('cert.found', { n: result.threats })];
        lines.forEach((l, i) => ctx.fillText(l, cx, cy + 92 + i * 26));

        /* ── footer ── */
        const fy = H - 74;
        ctx.strokeStyle = 'rgba(255,255,255,0.09)';
        ctx.beginPath();
        ctx.moveTo(70, fy - 40);
        ctx.lineTo(W - 70, fy - 40);
        ctx.stroke();

        drawMark(ctx, isRTL ? W - 92 : 92, fy - 6, 30);
        ctx.textAlign = isRTL ? 'right' : 'left';
        const brandX = isRTL ? W - 122 : 122;
        font(ctx, 22, 800);
        ctx.fillStyle = C.white;
        ctx.fillText(BRAND, brandX, fy - 1);
        font(ctx, 16, 600);
        ctx.fillStyle = C.soft;
        ctx.fillText(`${t('cert.dev')}: ${window.Q000 ? window.Q000.DEVELOPER : 'DOJKA'}`, brandX, fy + 24);

        ctx.textAlign = isRTL ? 'left' : 'right';
        const statX = isRTL ? 92 : W - 92;
        font(ctx, 17, 600);
        ctx.fillStyle = C.dim;
        ctx.fillText(`${t('cert.engines')}: ${result.engines}/${result.totalEngines}`, statX, fy + 4);
        font(ctx, 15, 500);
        ctx.fillStyle = 'rgba(190,190,190,0.7)';
        ctx.fillText(isUrl
            ? `${result.protocolLabel} · ${result.host}`
            : `${result.fileSizeLabel} · ${result.fileType}`, statX, fy + 28);
    }

    window.Q000Certificate = {
        async download(result, t, lang) {
            try {
                if (document.fonts && document.fonts.ready) await document.fonts.ready;
                const isUrl = !!result.isUrl;
                draw(result, t, lang);

                const canvas = document.getElementById('certificateCanvas');
                const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 0.95));
                if (!blob) return false;

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const base = t(isUrl ? 'cert.fileNameUrl' : 'cert.fileName');
                a.download = `${base}_${(isUrl ? result.host : result.fileName).replace(/[^a-zA-Z0-9]/g, '_')}_${result.certificateId}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1500);
                return true;
            } catch (err) {
                console.error('certificate error:', err);
                return false;
            }
        }
    };
})();
