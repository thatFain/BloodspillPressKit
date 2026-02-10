async function loadPresskit() {
    const res = await fetch('presskit.json');
    const data = await res.json();
    
    const g = data.game;
    const s = data.studio;
    const vis = data.media;

    const gameTitle = g.title || 'Game Title';

    document.getElementById('title').textContent = gameTitle;
    document.getElementById('tagline').textContent = g.tagline || '';
    document.getElementById('short').textContent = g.short_description || '';

    // Update all instances of game name
    const gameNames = document.getElementsByClassName("gamename");
    Array.from(gameNames).forEach((el) => {
        el.innerHTML = gameTitle;
    });

    // Link Game URL (Steam)
    const gameUrl = g.game_url;
    const gameUrlElements = document.getElementsByClassName("gameurl");
    Array.from(gameUrlElements).forEach((el) => {
        el.setAttribute("href", gameUrl || '');
    });

    // Cover Image
    document.getElementById('cover').src = vis.cover || '';

    // Set Presskit Download Links
    const pkUrl = g.presskiturl;
    const bottomBtn = document.getElementById('presskiturl');
    const topBtn = document.getElementById('presskit-btn-top');

    if(bottomBtn) bottomBtn.setAttribute("href", pkUrl);
    if(topBtn) topBtn.setAttribute("href", pkUrl);

    // Steam Widget
    document.getElementById('widgetreftourl').innerHTML = g.widgetreftourl || '';

    const trailerContainer = document.getElementById('trailer-container');
    const trailerIframe = document.getElementById('trailer-iframe');
    
    // Check if trailer URL exists in JSON
    if (g.trailer && trailerContainer) {
        trailerContainer.style.display = 'block';
        trailerIframe.src = g.trailer;
    } else if (trailerContainer) {
        trailerContainer.style.display = 'none';
    }

    // Facts Grid
    const facts = [
        ['Genres', (g.genres || []).join(', ')],
        ['Platforms', (g.platforms || []).join(', ')],
        ['Release', g.release_date || 'TBA'],
        ['Modes', (g.modes || []).join(', ')],
        ['Team Size', g.team_size],
        ['Game Engine', g.game_engine],
        ['Status', g.development_status],
    ];

    document.getElementById('facts').innerHTML = facts.map(([k, v]) => 
        `<div class='fact'><b>${k}</b><div>${v}</div></div>`
    ).join('');

    // Define Icons (Simple 24x24 viewBox paths)
    const icons = {
        "Discord": '<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.42-2.157 2.42z"/></svg>',
        "YouTube": '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
        "Twitch": '<svg viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h2.998L24 9.857V0zM22.286 8.571l-3.857 3.857h-3.857l-3.857 3.858v-3.858H6.857V1.714h15.429z"/></svg>',
        "Bluesky": '<svg viewBox="0 0 24 24"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.58 7.458.188 7.823-1.28.309-1.23 1.08-3.589 1.08-3.589s.771 2.359 1.08 3.589c.365 1.468 2.81 6.86 7.823 1.28 4.557-5.073 1.082-6.498-2.83-7.078-.139-.016-.277-.034-.415-.056.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.686 12 10.8z"/></svg>',
        "Instagram": '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
    };

    const contacts = s.contact || {};
    document.getElementById('contacts').innerHTML = Object.entries(contacts)
        .filter(([k, v]) => v)
        .map(([k, v]) => {
            const icon = icons[k] || ''; 
            return `<li><a class='btn-secondary' target='_blank' href='${v}'>${icon}<span>${k}</span></a></li>`;
        })
        .join('');
}

loadPresskit();