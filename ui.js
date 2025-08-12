import { translations, elements } from './config.js';
import { getState, setState } from './state.js';

function updateLanguageUI(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    document.title = t.title;
    if (elements.heading) elements.heading.textContent = t.title;
    if (elements.filtersLabel) elements.filtersLabel.textContent = t.filters;

    Object.entries(elements.labels).forEach(([key, element]) => {
        if (element) element.textContent = t[key];
    });

    if (elements.selectOptions.contains) elements.selectOptions.contains.textContent = t.contains;
    if (elements.selectOptions.exact) elements.selectOptions.exact.textContent = t.exact;

    if (elements.searchBtn) elements.searchBtn.textContent = t.search;
    if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.textContent = t.deleteSelected;
    if (elements.exportCsvBtn) elements.exportCsvBtn.textContent = t.exportCsv;
    if (elements.exportJsonBtn) elements.exportJsonBtn.textContent = t.exportJson;
    if (elements.selectAllLabel) elements.selectAllLabel.textContent = t.selectAll;

    if (elements.domainInput) elements.domainInput.placeholder = `${t.example}: google.com`;
    if (elements.keywordInput) elements.keywordInput.placeholder = t.search;

    if (elements.langFaBtn && elements.langEnBtn) {
        elements.langFaBtn.classList.toggle('active', lang === 'fa');
        elements.langEnBtn.classList.toggle('active', lang === 'en');
    }

    if (getState().searchResults.length > 0) {
        displayResults();
        displayStats();
    }
}

export function displayResults() {
    const { searchResults, currentLanguage } = getState();
    if (!elements.resultsDiv) return;

    if (searchResults.length === 0) {
        elements.resultsDiv.innerHTML = `<p class="no-results">${translations[currentLanguage].noResults}</p>`;
        if (elements.resultsToolbar) elements.resultsToolbar.style.display = 'none';
        if (elements.statsSummary) elements.statsSummary.style.display = 'none';
        return;
    }

    if (elements.resultsToolbar) elements.resultsToolbar.style.display = 'flex';
    if (elements.statsSummary) elements.statsSummary.style.display = 'flex';

    const fragment = document.createDocumentFragment();
    searchResults.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.url = item.url;
        checkbox.className = 'result-checkbox';

        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.textContent = item.title || item.url;
        link.title = item.url;

        const visitInfo = document.createElement('div');
        visitInfo.className = 'visit-info';

        const visitCount = document.createElement('span');
        visitCount.className = 'visit-count';
        visitCount.textContent = `${item.visitCount || 0} ${item.visitCount > 1 ? 'visits' : 'visit'}`;

        const lastVisit = document.createElement('span');
        lastVisit.className = 'last-visit';
        lastVisit.textContent = new Date(item.lastVisitTime).toLocaleString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US');

        visitInfo.appendChild(visitCount);
        visitInfo.appendChild(lastVisit);

        div.appendChild(checkbox);
        div.appendChild(link);
        div.appendChild(visitInfo);

        fragment.appendChild(div);
    });

    elements.resultsDiv.innerHTML = '';
    elements.resultsDiv.appendChild(fragment);
    if (elements.selectAllCheckbox) elements.selectAllCheckbox.checked = false;
}

export function displayStats() {
    const { searchResults, currentLanguage } = getState();
    if (!elements.statsSummary) return;

    const total = searchResults.length;
    const totalVisits = searchResults.reduce((sum, item) => sum + (item.visitCount || 0), 0);

    elements.statsSummary.innerHTML = `
        <div class="stat-item">
            <span class="stat-value">${total}</span>
            <span class="stat-label">${translations[currentLanguage].totalResults}</span>
        </div>
        <div class="stat-item">
            <span class="stat-value">${totalVisits}</span>
            <span class="stat-label">${translations[currentLanguage].totalVisits}</span>
        </div>
    `;
}

export function updateLanguage(lang) {
    setState({ currentLanguage: lang });
    updateLanguageUI(lang);
    browser.storage.local.set({ language: lang });
}

function setDarkMode(isDark) {
    document.body.classList.toggle('dark', isDark);
    if (elements.themeIconSun && elements.themeIconMoon) {
        elements.themeIconSun.style.display = isDark ? 'none' : 'block';
        elements.themeIconMoon.style.display = isDark ? 'block' : 'none';
    }
    browser.storage.local.set({ darkMode: isDark });
}

export function loadStoredUIPreferences() {
    browser.storage.local.get(['darkMode', 'language']).then(data => {
        updateLanguage(data.language || 'fa');
        setDarkMode(data.darkMode || false);
    });
}

function handleShiftClick(e) {
    if (e.target.type === 'checkbox') {
        const { lastChecked } = getState();
        if (e.shiftKey && lastChecked) {
            const checkboxes = Array.from(elements.resultsDiv.querySelectorAll('.result-checkbox'));
            const start = checkboxes.indexOf(lastChecked);
            const end = checkboxes.indexOf(e.target);
            checkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).forEach(cb => {
                cb.checked = e.target.checked;
            });
        }
        setState({ lastChecked: e.target });
    }
}

function toggleFilters() {
    if(elements.filterControls) {
        elements.filterControls.classList.toggle('expanded');
        elements.toggleFiltersBtn.classList.toggle('active');
    }
}

function selectAll(isChecked) {
    const checkboxes = elements.resultsDiv.querySelectorAll('.result-checkbox');
    checkboxes.forEach(cb => cb.checked = isChecked);
}

export function initializeUI(searchHandler, deleteHandler, exportCsvHandler, exportJsonHandler) {
    if (elements.langFaBtn) {
        elements.langFaBtn.addEventListener('click', () => updateLanguage('fa'));
    }
    if (elements.langEnBtn) {
        elements.langEnBtn.addEventListener('click', () => updateLanguage('en'));
    }

    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark');
            setDarkMode(isDark);
        });
    }

    if (elements.toggleFiltersBtn) {
        elements.toggleFiltersBtn.addEventListener('click', toggleFilters);
    }

    if (elements.selectAllCheckbox) {
        elements.selectAllCheckbox.addEventListener('change', (e) => selectAll(e.target.checked));
    }

    if (elements.keywordInput) {
        elements.keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                elements.searchBtn.click();
            }
        });
    }

    if (elements.resultsDiv) {
        elements.resultsDiv.addEventListener('click', handleShiftClick);
    }

    if(elements.searchBtn) elements.searchBtn.addEventListener('click', searchHandler);
    if(elements.deleteSelectedBtn) elements.deleteSelectedBtn.addEventListener('click', deleteHandler);
    if(elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', exportCsvHandler);
    if(elements.exportJsonBtn) elements.exportJsonBtn.addEventListener('click', exportJsonHandler);
}
