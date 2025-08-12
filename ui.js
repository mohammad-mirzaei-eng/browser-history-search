import { translations, elements } from './config.js';
import { getState, setState } from './state.js';

function updateLanguageUI(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    document.title = t.title;
    if (elements.heading) elements.heading.textContent = t.title;

    Object.entries(elements.labels).forEach(([key, element]) => {
        if (element) element.textContent = t[key];
    });

    if (elements.selectOptions.contains) elements.selectOptions.contains.textContent = t.contains;
    if (elements.selectOptions.exact) elements.selectOptions.exact.textContent = t.exact;

    if (elements.searchBtn) elements.searchBtn.textContent = t.search;
    if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.textContent = t.deleteSelected;
    if (elements.deleteAllBtn) elements.deleteAllBtn.textContent = t.deleteAll;
    if (elements.exportCsvBtn) elements.exportCsvBtn.textContent = t.exportCsv;
    if (elements.exportJsonBtn) elements.exportJsonBtn.textContent = t.exportJson;

    if (elements.domainInput) elements.domainInput.placeholder = `${t.example}: google.com`;
    if (elements.keywordInput) elements.keywordInput.placeholder = t.search;

    if (elements.resultsLabel) elements.resultsLabel.textContent = t.resultsLabel;
    if (elements.visitsLabel) elements.visitsLabel.textContent = t.visitsLabel;

    // Update active language button
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
        elements.resultsDiv.innerHTML = `<p>${translations[currentLanguage].noResults}</p>`;
        if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.style.display = 'none';
        if (elements.deleteAllBtn) elements.deleteAllBtn.style.display = 'none';
        if (elements.exportCsvBtn) elements.exportCsvBtn.style.display = 'none';
        if (elements.exportJsonBtn) elements.exportJsonBtn.style.display = 'none';
        return;
    }

    if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.style.display = 'block';
    if (elements.deleteAllBtn) elements.deleteAllBtn.style.display = 'block';
    if (elements.exportCsvBtn) elements.exportCsvBtn.style.display = 'block';
    if (elements.exportJsonBtn) elements.exportJsonBtn.style.display = 'block';

    const fragment = document.createDocumentFragment();
    searchResults.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.url = item.url;

        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.textContent = item.title || item.url;
        link.title = item.url;

        const small = document.createElement('small');
        small.textContent = `${translations[currentLanguage].totalVisits}: ${item.visitCount}`;

        div.appendChild(checkbox);
        div.appendChild(link);
        div.appendChild(small);

        fragment.appendChild(div);
    });

    elements.resultsDiv.innerHTML = '';
    elements.resultsDiv.appendChild(fragment);
}

export function displayStats() {
    const { searchResults, currentLanguage } = getState();
    if (!elements.statsDiv) return;

    const total = searchResults.length;
    const totalVisits = searchResults.reduce((sum, item) => sum + (item.visitCount || 0), 0);

    elements.statsDiv.innerHTML = `
        <p><strong>${translations[currentLanguage].totalResults}:</strong> ${total}</p>
        <p><strong>${translations[currentLanguage].totalVisits}:</strong> ${totalVisits}</p>
    `;
    updateChart(total, totalVisits);
}

function updateChart(total, visits) {
    if (!elements.resultsBar || !elements.visitsBar) return;
    const maxValue = Math.max(total, visits, 1);
    const resultsHeight = (total / maxValue) * 100;
    const visitsHeight = (visits / maxValue) * 100;

    elements.resultsBar.style.height = `${resultsHeight}%`;
    elements.visitsBar.style.height = `${visitsHeight}%`;
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
            const checkboxes = Array.from(elements.resultsDiv.querySelectorAll('input[type="checkbox"]'));
            const start = checkboxes.indexOf(lastChecked);
            const end = checkboxes.indexOf(e.target);
            checkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).forEach(cb => {
                cb.checked = e.target.checked;
            });
        }
        setState({ lastChecked: e.target });
    }
}

function handleTabClick(e) {
    const tabButton = e.target.closest('.tab-link');
    if (!tabButton) return;

    elements.tabLinks.forEach(link => link.classList.remove('active'));
    elements.tabPanes.forEach(pane => pane.classList.remove('active'));

    tabButton.classList.add('active');
    const tabId = tabButton.dataset.tab;
    const correspondingPane = document.getElementById(tabId);
    if (correspondingPane) {
        correspondingPane.classList.add('active');
    }
}

export function initializeUI(searchHandler, deleteHandler, deleteAllHandler, exportCsvHandler, exportJsonHandler) {
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

    const tabNav = document.querySelector('.tab-nav');
    if (tabNav) {
        tabNav.addEventListener('click', handleTabClick);
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
    if(elements.deleteAllBtn) elements.deleteAllBtn.addEventListener('click', deleteAllHandler);
    if(elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', exportCsvHandler);
    if(elements.exportJsonBtn) elements.exportJsonBtn.addEventListener('click', exportJsonHandler);
}
