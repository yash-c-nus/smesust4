document.addEventListener('DOMContentLoaded', () => {
    let currentSection = 0;
    const totalSections = 5;
    const sectionCounts = [5, 7, 2, 10, 9];
    const sectionColors = ['#16a34a', '#f59e0b', '#3b82f6', '#8b5cf6', '#64748b'];
    const sectionNames = [
        'Carbon & Climate Performance',
        'Energy & Resource Use',
        'Environmental Stewardship',
        'Social & Workforce Responsibility',
        'Governance, Targets & Transparency'
    ];

    const track = document.getElementById('sectionsTrack');
    const pills = document.querySelectorAll('.section-pill');

    // Navigate to section
    function goToSection(index) {
        if (index < 0 || index >= totalSections) return;
        currentSection = index;
        track.style.transform = `translateX(-${currentSection * 100}%)`;

        pills.forEach((pill, i) => {
            pill.classList.toggle('active', i === currentSection);
        });

        updateNavPanel();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Pill clicks
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            goToSection(parseInt(pill.dataset.section));
        });
    });

    // Nav buttons (Continue / Back)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            goToSection(parseInt(btn.dataset.target));
        });
    });

    // Action buttons (Complete / Skip)
    document.querySelectorAll('.indicator-row').forEach(row => {
        const completeBtn = row.querySelector('.complete-btn');
        const skipBtn = row.querySelector('.skip-btn');

        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (row.classList.contains('completed')) {
                row.classList.remove('completed');
            } else {
                row.classList.remove('skipped');
                row.classList.add('completed');
            }
            updateProgress();
        });

        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (row.classList.contains('skipped')) {
                row.classList.remove('skipped');
            } else {
                row.classList.remove('completed');
                row.classList.add('skipped');
            }
            updateProgress();
        });
    });

    // Update all progress indicators
    function updateProgress() {
        let totalCompleted = 0;
        let totalSkipped = 0;
        let totalIndicators = 33;

        for (let s = 0; s < totalSections; s++) {
            const slide = document.querySelector(`.section-slide[data-section-index="${s}"]`);
            const rows = slide.querySelectorAll('.indicator-row');
            let sCompleted = 0;
            let sSkipped = 0;

            rows.forEach(row => {
                if (row.classList.contains('completed')) sCompleted++;
                else if (row.classList.contains('skipped')) sSkipped++;
            });

            totalCompleted += sCompleted;
            totalSkipped += sSkipped;

            // Section metric
            const metric = document.getElementById(`sectionMetric${s}`);
            if (metric) {
                metric.innerHTML = `${sCompleted}<span class="metric-of">/${sectionCounts[s]}</span>`;
            }

            // Pill count
            const pillCount = document.getElementById(`pillCount${s}`);
            if (pillCount) {
                pillCount.textContent = `${sCompleted}/${sectionCounts[s]}`;
            }
        }

        const totalNotStarted = totalIndicators - totalCompleted - totalSkipped;
        const pctCompleted = (totalCompleted / totalIndicators) * 100;
        const pctSkipped = (totalSkipped / totalIndicators) * 100;
        const pctNotStarted = (totalNotStarted / totalIndicators) * 100;

        // Global status
        document.getElementById('globalCompleted').textContent = totalCompleted;
        document.getElementById('globalTotal').textContent = totalIndicators;
        document.getElementById('segCompleted').style.width = pctCompleted + '%';
        document.getElementById('segSkipped').style.width = pctSkipped + '%';
        document.getElementById('segNotStarted').style.width = pctNotStarted + '%';
        document.getElementById('legendCompleted').textContent = totalCompleted;
        document.getElementById('legendSkipped').textContent = totalSkipped;
        document.getElementById('legendNotStarted').textContent = totalNotStarted;

        // Progress percentage
        const progressPct = Math.round(((totalCompleted + totalSkipped) / totalIndicators) * 100);
        document.getElementById('progressPercent').textContent = progressPct + '%';
        document.getElementById('progressBarFill').style.width = progressPct + '%';
    }

    // Floating Nav
    const navBtn = document.getElementById('floatingNavBtn');
    const navPanel = document.getElementById('floatingNavPanel');
    const navClose = document.getElementById('navPanelClose');
    const navList = document.getElementById('navPanelList');

    navBtn.addEventListener('click', () => {
        navPanel.classList.toggle('open');
        if (navPanel.classList.contains('open')) updateNavPanel();
    });

    navClose.addEventListener('click', () => {
        navPanel.classList.remove('open');
    });

    function updateNavPanel() {
        navList.innerHTML = '';
        for (let s = 0; s < totalSections; s++) {
            const item = document.createElement('div');
            item.className = 'nav-section-item' + (s === currentSection ? ' active' : '');
            item.innerHTML = `<span class="nav-section-dot" style="background:${sectionColors[s]}"></span>${sectionNames[s]}`;
            item.addEventListener('click', () => {
                goToSection(s);
                navPanel.classList.remove('open');
            });
            navList.appendChild(item);
        }
    }

    // Close nav panel on outside click
    document.addEventListener('click', (e) => {
        if (!navPanel.contains(e.target) && e.target !== navBtn) {
            navPanel.classList.remove('open');
        }
    });

    // Initialize
    updateProgress();
    updateNavPanel();
});
