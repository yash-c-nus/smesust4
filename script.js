// State
let currentSection = 0;
const sectionCounts = [5, 7, 2, 10, 9];
const sectionColors = ['#16a34a', '#ea580c', '#2563eb', '#9333ea', '#475569'];
const sectionNames = [
    'Carbon & Climate Performance',
    'Energy & Resource Use',
    'Environmental Stewardship',
    'Social & Workforce Responsibility',
    'Governance, Targets & Transparency'
];

// Go to section
function goToSection(index) {
    currentSection = index;
    const track = document.getElementById('slidesTrack');
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update tabs
    document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // Update floating nav
    document.querySelectorAll('.float-nav-section').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle action menu
function toggleMenu(btn) {
    // Close all other menus
    document.querySelectorAll('.action-menu.show').forEach(m => {
        if (m !== btn.nextElementSibling) m.classList.remove('show');
    });
    btn.nextElementSibling.classList.toggle('show');
}

// Set indicator status
function setStatus(row, status) {
    row.classList.remove('completed', 'skipped');
    if (status) row.classList.add(status);

    // Close menu
    row.querySelector('.action-menu').classList.remove('show');

    updateProgress();
}

// Update all progress indicators
function updateProgress() {
    let totalCompleted = 0;
    let totalSkipped = 0;
    let totalActive = 33;

    for (let s = 0; s < 5; s++) {
        const slide = document.querySelectorAll('.slide')[s];
        const rows = slide.querySelectorAll('.indicator-row');
        let done = 0;
        let skip = 0;

        rows.forEach(row => {
            if (row.classList.contains('completed')) done++;
            if (row.classList.contains('skipped')) skip++;
        });

        totalCompleted += done;
        totalSkipped += skip;

        // Update section metrics
        const metricDone = document.getElementById(`metricDone${s}`);
        const metricSkip = document.getElementById(`metricSkip${s}`);
        if (metricDone) metricDone.textContent = done;
        if (metricSkip) metricSkip.textContent = skip;

        // Update tab count
        const tabCount = document.getElementById(`tabCount${s}`);
        if (tabCount) tabCount.textContent = `${done}/${sectionCounts[s]}`;
    }

    // Update status card
    document.getElementById('statusCompleted').textContent = totalCompleted;

    const notStarted = totalActive - totalCompleted - totalSkipped;
    const pctCompleted = (totalCompleted / totalActive) * 100;
    const pctSkipped = (totalSkipped / totalActive) * 100;
    const pctNotStarted = (notStarted / totalActive) * 100;

    document.getElementById('barCompleted').style.width = pctCompleted + '%';
    document.getElementById('barInProgress').style.width = '0%';
    document.getElementById('barSkipped').style.width = pctSkipped + '%';
    document.getElementById('barNotStarted').style.width = pctNotStarted + '%';

    // Update floating nav
    updateFloatingNav();
}

// Build floating nav
function buildFloatingNav() {
    const list = document.getElementById('floatNavList');
    list.innerHTML = '';

    for (let s = 0; s < 5; s++) {
        const secDiv = document.createElement('div');
        secDiv.className = `float-nav-section${s === currentSection ? ' active' : ''}`;
        secDiv.innerHTML = `<span class="float-nav-dot" style="background:${sectionColors[s]}"></span>${sectionNames[s]}`;
        secDiv.onclick = () => {
            goToSection(s);
            document.getElementById('floatNavPanel').classList.remove('show');
        };
        list.appendChild(secDiv);

        // Add subsections
        const slide = document.querySelectorAll('.slide')[s];
        const rows = slide.querySelectorAll('.indicator-row');
        rows.forEach(row => {
            const id = row.dataset.id;
            const title = row.querySelector('.row-title').textContent;
            const subDiv = document.createElement('div');
            subDiv.className = 'float-nav-sub';
            subDiv.textContent = `${id} ${title}`;
            subDiv.onclick = (e) => {
                e.stopPropagation();
                goToSection(s);
                setTimeout(() => {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.style.background = '#eef2ff';
                    setTimeout(() => row.style.background = '', 1500);
                }, 300);
                document.getElementById('floatNavPanel').classList.remove('show');
            };
            list.appendChild(subDiv);
        });
    }
}

function updateFloatingNav() {
    const subs = document.querySelectorAll('.float-nav-sub');
    const allRows = document.querySelectorAll('.indicator-row');
    let i = 0;
    allRows.forEach(row => {
        if (subs[i]) {
            subs[i].classList.remove('completed-nav', 'skipped-nav');
            if (row.classList.contains('completed')) subs[i].classList.add('completed-nav');
            if (row.classList.contains('skipped')) subs[i].classList.add('skipped-nav');
        }
        i++;
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Tab clicks
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            goToSection(parseInt(tab.dataset.section));
        });
    });

    // Menu button clicks
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(btn);
        });
    });

    // Action button clicks
    document.querySelectorAll('.action-complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setStatus(btn.closest('.indicator-row'), 'completed');
        });
    });

    document.querySelectorAll('.action-skip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setStatus(btn.closest('.indicator-row'), 'skipped');
        });
    });

    document.querySelectorAll('.action-reset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setStatus(btn.closest('.indicator-row'), null);
        });
    });

    // Close menus on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.action-menu.show').forEach(m => m.classList.remove('show'));
    });

    // Floating nav
    document.getElementById('floatNavBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        const panel = document.getElementById('floatNavPanel');
        panel.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        const panel = document.getElementById('floatNavPanel');
        if (!panel.contains(e.target) && e.target.id !== 'floatNavBtn') {
            panel.classList.remove('show');
        }
    });

    // Build nav and init
    buildFloatingNav();
    updateProgress();
    goToSection(0);
});
