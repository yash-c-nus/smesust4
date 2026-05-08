// ========== STATE ==========
let currentSlide = 0;
const totalSlides = 5;
const sectionTotals = [5, 7, 2, 10, 9];
const indicatorStates = {};
let showingOverview = true;

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    // Init all indicator states
    document.querySelectorAll('.indicator-row').forEach(row => {
        indicatorStates[row.dataset.indicator] = 'not-started';
    });

    // Overview card clicks
    document.querySelectorAll('.overview-card').forEach(card => {
        card.addEventListener('click', () => {
            const sectionIdx = parseInt(card.dataset.section);
            showSlides(sectionIdx);
        });
    });

    // Section tab clicks
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionIdx = parseInt(tab.dataset.section);
            goToSlide(sectionIdx);
        });
    });

    // Back to overview
    document.getElementById('backToOverview').addEventListener('click', showOverview);
    document.getElementById('backToOverviewBtn').addEventListener('click', showOverview);
    document.getElementById('backToOverviewEnd').addEventListener('click', showOverview);

    // Action buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const row = btn.closest('.indicator-row');
            const id = row.dataset.indicator;
            if (indicatorStates[id] === 'completed') {
                setIndicatorState(row, id, 'not-started');
            } else {
                setIndicatorState(row, id, 'completed');
            }
        });
    });

    document.querySelectorAll('.skip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const row = btn.closest('.indicator-row');
            const id = row.dataset.indicator;
            if (indicatorStates[id] === 'skipped') {
                setIndicatorState(row, id, 'not-started');
            } else {
                setIndicatorState(row, id, 'skipped');
            }
        });
    });

    updateProgress();
});

// ========== INDICATOR STATE ==========
function setIndicatorState(row, id, state) {
    indicatorStates[id] = state;

    row.classList.remove('completed', 'skipped');
    row.querySelector('.complete-btn').classList.remove('active');
    row.querySelector('.skip-btn').classList.remove('active');

    if (state === 'completed') {
        row.classList.add('completed');
        row.querySelector('.complete-btn').classList.add('active');
    } else if (state === 'skipped') {
        row.classList.add('skipped');
        row.querySelector('.skip-btn').classList.add('active');
    }

    updateProgress();
}

// ========== PROGRESS ==========
function updateProgress() {
    let totalCompleted = 0;
    let totalSkipped = 0;
    let totalNotStarted = 0;
    let totalAll = 33;

    // Per section counts
    const sectionCompleted = [0, 0, 0, 0, 0];
    const sectionSkipped = [0, 0, 0, 0, 0];

    Object.entries(indicatorStates).forEach(([id, state]) => {
        const sectionIdx = parseInt(id.split('.')[0]) - 1;
        if (state === 'completed') {
            totalCompleted++;
            sectionCompleted[sectionIdx]++;
        } else if (state === 'skipped') {
            totalSkipped++;
            sectionSkipped[sectionIdx]++;
        } else {
            totalNotStarted++;
        }
    });

    const inProgress = totalAll - totalCompleted - totalSkipped - totalNotStarted;

    // Update status card
    document.getElementById('statusCompleted').textContent = totalCompleted;
    document.getElementById('statusTotal').textContent = '/' + totalAll;
    document.getElementById('legendCompleted').textContent = totalCompleted;
    document.getElementById('legendInProgress').textContent = Math.max(0, inProgress);
    document.getElementById('legendSkipped').textContent = totalSkipped;
    document.getElementById('legendNotStarted').textContent = totalNotStarted;

    // Update status bar
    const pctCompleted = (totalCompleted / totalAll) * 100;
    const pctInProgress = (Math.max(0, inProgress) / totalAll) * 100;
    const pctSkipped = (totalSkipped / totalAll) * 100;
    const pctNotStarted = (totalNotStarted / totalAll) * 100;

    document.getElementById('barCompleted').style.width = pctCompleted + '%';
    document.getElementById('barInProgress').style.width = pctInProgress + '%';
    document.getElementById('barSkipped').style.width = pctSkipped + '%';
    document.getElementById('barNotStarted').style.width = pctNotStarted + '%';

    // Update section counts
    for (let i = 0; i < 5; i++) {
        const completed = sectionCompleted[i];
        const total = sectionTotals[i];
        const active = total - sectionSkipped[i];

        // Overview cards
        const overviewCount = document.getElementById('overview-count-' + i);
        if (overviewCount) overviewCount.textContent = completed + '/' + total;

        // Tabs
        const tabCount = document.getElementById('tab-count-' + i);
        if (tabCount) tabCount.textContent = completed + '/' + total;

        // Metric numbers
        const metric = document.getElementById('metric-' + i);
        if (metric) metric.innerHTML = completed + '<span class="metric-total">/' + total + '</span>';
    }
}

// ========== NAVIGATION ==========
function showSlides(sectionIdx) {
    showingOverview = false;
    document.querySelector('.page-title-row').style.display = 'none';
    document.querySelector('.status-card').style.display = 'none';
    document.querySelector('.section-overview-cards').style.display = 'none';
    document.getElementById('slidesViewport').style.display = 'block';
    goToSlide(sectionIdx);
}

function showOverview() {
    showingOverview = true;
    document.querySelector('.page-title-row').style.display = 'block';
    document.querySelector('.status-card').style.display = 'block';
    document.querySelector('.section-overview-cards').style.display = 'flex';
    document.getElementById('slidesViewport').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSlide(index) {
    currentSlide = index;
    const track = document.getElementById('slidesTrack');
    track.style.transform = 'translateX(-' + (index * 100) + '%)';

    // Update active tab
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.dataset.section) === index) {
            tab.classList.add('active');
        }
    });

    // Scroll to top of slides
    document.getElementById('slidesViewport').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Make goToSlide available globally for onclick handlers
window.goToSlide = goToSlide;
