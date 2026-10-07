import { translations, getElements } from './config.js';
import { getState, setState } from './state.js';
import { downloadFile } from './utils.js';

let elements = getElements();

function updateLanguageUI(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

    document.title = t.title;
    elements.translatableElements.forEach(element => {
        element.textContent = t[element.dataset.i18n];
    });
    elements.translatableAttributes.forEach(element => {
        if (element.dataset.i18nPlaceholder) {
            element.placeholder = t[element.dataset.i18nPlaceholder];
        }
        if (element.dataset.i18nAriaLabel) {
            element.setAttribute('aria-label', t[element.dataset.i18nAriaLabel]);
        }
    });

    if (getState().searchResults.length > 0) {
        displayResults();
        displayStats();
    } else {
        const emptyMessage = elements.resultsDiv?.querySelector('.empty-message');
        if (emptyMessage) emptyMessage.textContent = t.noResults;
    }
}

export function displayResults() {
    const { searchResults, currentPage, resultsPerPage } = getState();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!searchResults || searchResults.length === 0) {
        elements.pagination.hidden = true;
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = translations[getState().currentLanguage].noResults;
        resultsDiv.appendChild(emptyMessage);
        return;
    }

    const startIndex = (currentPage - 1) * resultsPerPage;
    const pageResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

    pageResults.forEach(item => {
        const { currentLanguage } = getState();
        const div = document.createElement('div');
        div.className = 'result-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.url = item.url;
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = item.title || item.url;
        const visitCount = document.createElement('small');
        visitCount.textContent = `${item.visitCount} ${translations[currentLanguage].visits}`;
        div.append(checkbox, link, visitCount);
        resultsDiv.appendChild(div);
    });

    displayPagination();
}

function displayPagination() {
    const { searchResults, currentPage, resultsPerPage, currentLanguage } = getState();
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);
    const t = translations[currentLanguage];

    elements.pagination.hidden = false;
    elements.pageIndicator.textContent = t.pageIndicator
        .replace('{current}', currentPage)
        .replace('{total}', totalPages);
    elements.previousPageBtn.disabled = currentPage === 1;
    elements.nextPageBtn.disabled = currentPage === totalPages;
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

    elements.previousPageBtn.addEventListener('click', () => {
        const { currentPage } = getState();
        if (currentPage > 1) {
            setState({ currentPage: currentPage - 1 });
            displayResults();
        }
    });

    elements.nextPageBtn.addEventListener('click', () => {
        const { currentPage, searchResults, resultsPerPage } = getState();
        if (currentPage < Math.ceil(searchResults.length / resultsPerPage)) {
            setState({ currentPage: currentPage + 1 });
            displayResults();
        }
    });

    elements.resultsPerPageSelect.addEventListener('change', event => {
        setState({ resultsPerPage: Number.parseInt(event.target.value, 10), currentPage: 1 });
        displayResults();
    });

    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('change', toggleDarkMode);
    }

    if(elements.searchBtn) elements.searchBtn.addEventListener('click', searchHandler);
    if(elements.deleteSelectedBtn) elements.deleteSelectedBtn.addEventListener('click', deleteHandler);
    if(elements.deleteAllBtn) elements.deleteAllBtn.addEventListener('click', deleteAllHandler);
    if(elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', exportCsvHandler);
    if(elements.exportJsonBtn) elements.exportJsonBtn.addEventListener('click', exportJsonHandler);
}
