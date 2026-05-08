let currentSection = 0;
const totalSections = 5;
const sectionCounts = [5, 7, 2, 10, 9];
const sectionColors = ['#16a34a', '#ea580c', '#0284c7', '#7c3aed', '#475569'];
const sectionNames = [
    'Carbon & Climate',
    'Energy & Resource',
    'Environmental Stewardship',
    'Social & Workforce',
    'Governance & Transparency'
];

function goToSection(index) {
    if (index < 0 || index >= totalSections) return;
    currentSection = index;
    const track = document.getElementById('sectionsTrack');
    track.style.transform = `translateX(-${index * 100}%)`;

    document.querySelectorAll('.pill').forEach((pill, i) => {
        pill.classList.toggle('active', i === index);
    });

    updateFloatNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const rows = document.querySelectorAll('.indicator-row');
    let completed = 0;
    let skipped = 0;
    let total = rows.length;

    rows.forEach(row => {
        if (row.classList.contains('completed')) completed++;
        else if (row.classList.contains('skipped')) skipped++;
    });

    const notStarted = total - completed - skipped;

    document.getElementById('statusCompleted').textContent = completed;
    document.getElementById('statusTotal').textContent = total;
    document.getElementById('legendCompleted').textContent = completed;
    document.getElementById('legendSkipped').textContent = skipped;
    document.getElementById('legendNotStarted').textContent = notStarted;

    const compPct = (completed / total) * 100;
    const skipPct = (skipped / total) * 100;
    const notPct = (notStarted / total) * 100;

    document.getElementById('barCompleted').style.width = compPct + '%';
    document.getElementById('barSkipped').style.width = skipPct + '%';
    document.getElementById('barNotStarted').style.width = notPct + '%';

    // Update per-section metrics and pills
    for (let s = 0; s < totalSections; s++) {
        const sectionRows = document.querySelectorAll(`.indicator-row[data-section="${s}"]`);
        let sComp = 0;
        let sTotal = sectionRows.length;
        sectionRows.forEach(row => {
            if (row.classList.contains('completed')) sComp++;
        });

        const metricEl = document.getElementById(`metricNum${s}`);
        if (metricEl) metricEl.textContent = sComp;

        const pillCount = document.getElementById(`pillCount${s}`);
        if (pillCount) pillCount.textContent = `${sComp}/${sTotal}`;
    }
}

function setupActions() {
    document.querySelectorAll('.indicator-row').forEach(row => {
        const completeBtn = row.querySelector('.complete-btn');
        const skipBtn = row.querySelector('.skip-btn');

        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (row.classList.contains('completed')) {
                row.classList.remove('completed');
                completeBtn.classList.remove('active');
            } else {
                row.classList.remove('skipped');
                skipBtn.classList.remove('active');
                row.classList.add('completed');
                completeBtn.classList.add('active');
            }
            updateProgress();
        });

        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (row.classList.contains('skipped')) {
                row.classList.remove('skipped');
                skipBtn.classList.remove('active');
            } else {
                row.classList.remove('completed');
                completeBtn.classList.remove('active');
                row.classList.add('skipped');
                skipBtn.classList.add('active');
            }
            updateProgress();
        });
    });
}

function setupPills() {
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const idx = parseInt(pill.dataset.section);
            goToSection(idx);
        });
    });
}

function setupFloatNav() {
    const btn = document.getElementById('floatNavBtn');
    const panel = document.getElementById('floatNavPanel');
    const close = document.getElementById('floatNavClose');
    const sectionsContainer = document.getElementById('floatNavSections');

    // Build nav items
    let html = '';
    for (let s = 0; s < totalSections; s++) {
        html += `<div class="float-nav-section${s === 0 ? ' active' : ''}" data-section="${s}">
            <div class="float-nav-dot" style="background: ${sectionColors[s]}"></div>
            <span>${sectionNames[s]}</span>
        </div>`;
    }
    sectionsContainer.innerHTML = html;

    btn.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    close.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    sectionsContainer.querySelectorAll('.float-nav-section').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.section);
            goToSection(idx);
            panel.classList.remove('open');
        });
    });
}

function updateFloatNav() {
    document.querySelectorAll('.float-nav-section').forEach((item, i) => {
        item.classList.toggle('active', i === currentSection);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupActions();
    setupPills();
    setupFloatNav();
    updateProgress();
    goToSection(0);
});
