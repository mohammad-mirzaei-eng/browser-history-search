import { elements, translations } from './config.js';
import { getState, setState } from './state.js';
import { initializeUI, displayResults, displayStats, loadStoredUIPreferences } from './ui.js';
import { downloadFile } from './utils.js';

async function searchHistory() {
    if (!elements.resultsDiv || !elements.statsDiv) return;

    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';

    elements.resultsDiv.innerHTML = '';
    elements.statsDiv.innerHTML = '';

    const keyword = elements.keywordInput ? elements.keywordInput.value : '';
    const matchType = elements.matchTypeSelect ? elements.matchTypeSelect.value : 'contains';
    const domain = elements.domainInput ? elements.domainInput.value : '';
    const startTime = elements.startTimeInput && elements.startTimeInput.value ? new Date(elements.startTimeInput.value).getTime() : 0;
    const endTime = elements.endTimeInput && elements.endTimeInput.value ? new Date(elements.endTimeInput.value).getTime() : Date.now();
    const minVisits = elements.minVisitsInput ? parseInt(elements.minVisitsInput.value) : 0;

    saveFilters();

    try {
        const historyItems = await browser.history.search({
            text: keyword,
            startTime: startTime,
            endTime: endTime,
            maxResults: 1000
        });

        const filteredResults = historyItems.filter(item => {
            if (domain && !item.url.includes(domain)) return false;
            if (minVisits > 0 && item.visitCount < minVisits) return false;
            if (matchType === 'exact' && item.title !== keyword && item.url !== keyword) return false;
            return true;
        });

        setState({ searchResults: filteredResults });
        displayResults();
        displayStats();
    } catch (error) {
        console.error('Error searching history:', error);
        const { currentLanguage } = getState();
        elements.resultsDiv.innerHTML = `<p class="error">${translations[currentLanguage].error || 'An error occurred'}</p>`;
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
        'URL',
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
    loadStoredUIPreferences();
    loadFilters();
    initializeUI(searchHistory, deleteSelected, deleteAll, exportCsv, exportJson);
}

document.addEventListener('DOMContentLoaded', init);
