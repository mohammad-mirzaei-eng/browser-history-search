import { translations, getElements } from './config.js';
import { getState, setState } from './state.js';
import { downloadFile } from './utils.js';

let elements = getElements();

function updateLanguageUI(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    document.title = t.title;
    if (elements.heading) elements.heading.textContent = t.title;

    if (elements.labels) {
        Object.entries(elements.labels).forEach(([key, element]) => {
            if (element) element.textContent = t[key];
        });
    }

    if (elements.selectOptions && elements.selectOptions.contains)
        elements.selectOptions.contains.textContent = t.contains;
    if (elements.selectOptions && elements.selectOptions.exact)
        elements.selectOptions.exact.textContent = t.exact;

    if (elements.searchBtn) elements.searchBtn.textContent = t.search;
    if (elements.deleteSelectedBtn) elements.deleteSelectedBtn.textContent = t.deleteSelected;
    if (elements.deleteAllBtn) elements.deleteAllBtn.textContent = t.deleteAll;
    if (elements.exportCsvBtn) elements.exportCsvBtn.textContent = t.exportCsv;
    if (elements.exportJsonBtn) elements.exportJsonBtn.textContent = t.exportJson;

    if (elements.darkModeLabel) elements.darkModeLabel.textContent = t.darkMode;

    if (elements.domainInput) elements.domainInput.placeholder = `${t.example}: google.com`;
    if (elements.keywordInput) elements.keywordInput.placeholder = t.search;

    if (elements.resultsLabel) elements.resultsLabel.textContent = t.resultsLabel;
    if (elements.visitsLabel) elements.visitsLabel.textContent = t.visitsLabel;

    if (getState().searchResults.length > 0) {
        displayResults();
        displayStats();
    }
}

export function displayResults() {
    const { searchResults } = getState();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!searchResults || searchResults.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align:center;">نتیجه‌ای یافت نشد.</p>';
        return;
    }

    searchResults.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <input type="checkbox" data-url="${item.url}">
            <a href="${item.url}" target="_blank">${item.title || item.url}</a>
            <small>${item.visitCount} visits</small>
        `;
        resultsDiv.appendChild(div);
    });
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
    const maxValue = Math.max(total, visits, 1); // Avoid division by zero
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

export function loadStoredUIPreferences() {
    browser.storage.local.get(['darkMode', 'language']).then(data => {
        if (data.language) {
            const radio = document.querySelector(`input[name="language"][value="${data.language}"]`);
            if (radio) {
                radio.checked = true;
                updateLanguage(data.language);
            }
        } else {
            // Default to 'fa' if no language is stored
            updateLanguage('fa');
        }

        if (data.darkMode && elements.darkModeToggle) {
            document.body.classList.add('dark');
            elements.darkModeToggle.checked = true;
        }
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

function toggleDarkMode() {
    if (elements.darkModeToggle.checked) {
        document.body.classList.add('dark');
        browser.storage.local.set({ darkMode: true });
    } else {
        document.body.classList.remove('dark');
        browser.storage.local.set({ darkMode: false });
    }
}

export function initializeUI(searchHandler, deleteHandler, deleteAllHandler, exportCsvHandler, exportJsonHandler) {
    elements.languageRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                updateLanguage(e.target.value);
            }
        });
    });

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

    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('change', toggleDarkMode);
    }

    if(elements.searchBtn) elements.searchBtn.addEventListener('click', searchHandler);
    if(elements.deleteSelectedBtn) elements.deleteSelectedBtn.addEventListener('click', deleteHandler);
    if(elements.deleteAllBtn) elements.deleteAllBtn.addEventListener('click', deleteAllHandler);
    if(elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', exportCsvHandler);
    if(elements.exportJsonBtn) elements.exportJsonBtn.addEventListener('click', exportJsonHandler);
}
