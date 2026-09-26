import { translations } from './config.js';
import { getState, setState } from './state.js';
import { initializeUI, displayResults, displayStats, loadStoredUIPreferences } from './ui.js';
import { downloadFile } from './utils.js';
import { getElements } from './config.js';

let elements = {};

async function searchHistory() {
    if (!elements.resultsDiv || !elements.statsDiv) return;

    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';

    elements.resultsDiv.innerHTML = '';
    elements.statsDiv.innerHTML = '';

    const keyword = elements.keywordInput ? elements.keywordInput.value.trim() : '';
    const startTime = elements.startTimeInput && elements.startTimeInput.value ? new Date(elements.startTimeInput.value).getTime() : 0;
    const endTime = elements.endTimeInput && elements.endTimeInput.value ? new Date(elements.endTimeInput.value).getTime() : Date.now();
    const minVisitsValue = elements.minVisitsInput ? Number.parseInt(elements.minVisitsInput.value, 10) : 0;
    const minVisits = Number.isNaN(minVisitsValue) ? 0 : minVisitsValue;
    const domain = elements.domainInput ? elements.domainInput.value.trim() : '';

    saveFilters();

    try {
        // جستجوی تاریخچه مرورگر
        const results = await browser.history.search({
            text: keyword,
            startTime,
            endTime,
            maxResults: 1000
        });

        // فیلتر بر اساس دامنه و تعداد بازدید
        const filtered = results.filter(item => {
            const domainMatch = domain ? item.url.includes(domain) : true;
            const visitsMatch = item.visitCount >= minVisits;
            return domainMatch && visitsMatch;
        });

        setState({ searchResults: filtered });

        import('./ui.js').then(ui => {
            ui.displayResults();
            ui.displayStats();
        });
    } catch (error) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = `${translations[getState().currentLanguage].searchError}: ${error.message}`;
        elements.resultsDiv.appendChild(errorMessage);
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function deleteSelected() {
    if (!elements.resultsDiv) return;

    const checkboxes = elements.resultsDiv.querySelectorAll('input[type="checkbox"]:checked');
    const urls = Array.from(checkboxes).map(cb => cb.dataset.url);

    for (const url of urls) {
        await browser.history.deleteUrl({ url });
    }

    // Refresh search
    if (elements.searchBtn) elements.searchBtn.click();
}

async function deleteAll() {
    const { searchResults } = getState();
    if (searchResults.length === 0) return;

    const urls = searchResults.map(item => item.url);

    for (const url of urls) {
        await browser.history.deleteUrl({ url });
    }

    // Refresh search
    if (elements.searchBtn) elements.searchBtn.click();
}

function exportCsv() {
    const { searchResults, currentLanguage } = getState();
    if (searchResults.length === 0) return;

    const headers = [
        translations[currentLanguage].keyword,
        translations[currentLanguage].url,
        translations[currentLanguage].totalVisits,
        translations[currentLanguage].endTime
    ];

    const rows = searchResults.map(item => [
        `"${(item.title || '').replace(/"/g, '""')}"`,
        `"${item.url}"`,
        item.visitCount,
        new Date(item.lastVisitTime).toLocaleString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile('history_export.csv', csvContent, 'text/csv;charset=utf-8');
}

function exportJson() {
    const { searchResults } = getState();
    if (searchResults.length === 0) return;

    const jsonContent = JSON.stringify(searchResults, null, 2);
    downloadFile('history_export.json', jsonContent, 'application/json');
}

function saveFilters() {
    const filters = {
        keyword: elements.keywordInput ? elements.keywordInput.value : '',
        matchType: elements.matchTypeSelect ? elements.matchTypeSelect.value : 'contains',
        domain: elements.domainInput ? elements.domainInput.value : '',
        startTime: elements.startTimeInput ? elements.startTimeInput.value : '',
        endTime: elements.endTimeInput ? elements.endTimeInput.value : '',
        minVisits: elements.minVisitsInput ? elements.minVisitsInput.value : ''
    };
    browser.storage.local.set({ filters });
}

async function loadFilters() {
    const data = await browser.storage.local.get('filters');
    if (data.filters) {
        if (elements.keywordInput) elements.keywordInput.value = data.filters.keyword || '';
        if (elements.matchTypeSelect) elements.matchTypeSelect.value = data.filters.matchType || 'contains';
        if (elements.domainInput) elements.domainInput.value = data.filters.domain || '';
        if (elements.startTimeInput) elements.startTimeInput.value = data.filters.startTime || '';
        if (elements.endTimeInput) elements.endTimeInput.value = data.filters.endTime || '';
        if (elements.minVisitsInput) elements.minVisitsInput.value = data.filters.minVisits || '';
    }
}

function init() {
    elements = getElements();

    loadStoredUIPreferences();
    loadFilters();
    initializeUI(searchHistory, deleteSelected, deleteAll, exportCsv, exportJson);
}

document.addEventListener('DOMContentLoaded', init);
