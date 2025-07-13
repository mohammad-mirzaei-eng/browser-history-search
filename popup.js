// Elements
const keywordInput = document.getElementById('keyword');
const matchTypeSelect = document.getElementById('matchType');
const domainInput = document.getElementById('domain');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const minVisitsInput = document.getElementById('minVisits');
const searchBtn = document.getElementById('searchBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const resultsDiv = document.getElementById('results');
const statsDiv = document.getElementById('stats');
const resultsBar = document.getElementById('resultsBar');
const visitsBar = document.getElementById('visitsBar');
const languageRadios = document.querySelectorAll('input[name="language"]');

// Variables
let searchResults = [];
let lastChecked = null;
let currentLanguage = 'fa';

// Translations
const translations = {
  fa: {
    title: 'جستجوی تاریخچه کروم',
    keyword: 'کلیدواژه',
    matchType: 'نوع جستجو',
    contains: 'شامل',
    exact: 'دقیق',
    domain: 'دامنه',
    startTime: 'از تاریخ',
    endTime: 'تا تاریخ',
    minVisits: 'حداقل تعداد بازدید',
    search: 'جستجو',
    deleteSelected: 'حذف انتخاب شده‌ها',
    deleteAll: 'حذف همه موارد',
    exportCsv: 'خروجی CSV',
    exportJson: 'خروجی JSON',
    darkMode: 'حالت تاریک',
    noResults: 'نتیجه‌ای یافت نشد.',
    totalResults: 'تعداد کل نتایج',
    totalVisits: 'تعداد کل بازدیدها',
    resultsLabel: 'تعداد نتایج',
    visitsLabel: 'تعداد بازدیدها',
    example: 'مثال'
  },
  en: {
    title: 'Chrome History Search',
    keyword: 'Keyword',
    matchType: 'Match Type',
    contains: 'Contains',
    exact: 'Exact',
    domain: 'Domain',
    startTime: 'From Date',
    endTime: 'To Date',
    minVisits: 'Minimum Visits',
    search: 'Search',
    deleteSelected: 'Delete Selected',
    deleteAll: 'Delete All',
    exportCsv: 'Export CSV',
    exportJson: 'Export JSON',
    darkMode: 'Dark Mode',
    noResults: 'No results found.',
    totalResults: 'Total Results',
    totalVisits: 'Total Visits',
    resultsLabel: 'Results Count',
    visitsLabel: 'Visits Count',
    example: 'Example'
  }
};

// Update UI language
function updateLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  
  const t = translations[lang];
  
  // Update title and heading
  document.title = t.title;
  const heading = document.querySelector('h2');
  if (heading) heading.textContent = t.title;
  
  // Update labels
  const labels = {
    keyword: document.querySelector('label[for="keyword"]'),
    matchType: document.querySelector('label[for="matchType"]'),
    domain: document.querySelector('label[for="domain"]'),
    startTime: document.querySelector('label[for="startTime"]'),
    endTime: document.querySelector('label[for="endTime"]'),
    minVisits: document.querySelector('label[for="minVisits"]')
  };
  
  Object.entries(labels).forEach(([key, element]) => {
    if (element) element.textContent = t[key];
  });
  
  // Update select options
  const containsOption = document.querySelector('#matchType option[value="contains"]');
  const exactOption = document.querySelector('#matchType option[value="exact"]');
  if (containsOption) containsOption.textContent = t.contains;
  if (exactOption) exactOption.textContent = t.exact;
  
  // Update buttons
  const buttons = {
    searchBtn: document.querySelector('#searchBtn'),
    deleteSelectedBtn: document.querySelector('#deleteSelectedBtn'),
    deleteAllBtn: document.querySelector('#deleteAllBtn'),
    exportCsvBtn: document.querySelector('#exportCsvBtn'),
    exportJsonBtn: document.querySelector('#exportJsonBtn')
  };
  
  Object.entries(buttons).forEach(([key, element]) => {
    if (element) element.textContent = t[key.replace('Btn', '')];
  });
  
  // Update dark mode label
  const darkModeLabel = document.querySelector('label[for="darkModeToggle"]');
  if (darkModeLabel) darkModeLabel.textContent = t.darkMode;
  
  // Update placeholders
  const domainInput = document.querySelector('#domain');
  const keywordInput = document.querySelector('#keyword');
  if (domainInput) domainInput.placeholder = `${t.example}: google.com`;
  if (keywordInput) keywordInput.placeholder = t.search;
  
  // Update chart labels
  const resultsLabel = document.querySelector('#resultsBar .chart-label');
  const visitsLabel = document.querySelector('#visitsBar .chart-label');
  if (resultsLabel) resultsLabel.textContent = t.resultsLabel;
  if (visitsLabel) visitsLabel.textContent = t.visitsLabel;
  
  // Update results if any
  if (searchResults.length > 0) {
    displayResults();
    displayStats();
  }
}

// Handle language change
languageRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.checked) {
      updateLanguage(e.target.value);
      browser.storage.local.set({ language: e.target.value });
    }
  });
});

// Load previous filters, settings and language
window.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.storage.local.get(['filters', 'darkMode', 'language']);
  
  if (data.language) {
    const radio = document.querySelector(`input[name="language"][value="${data.language}"]`);
    if (radio) {
      radio.checked = true;
      updateLanguage(data.language);
    }
  }
  
  if (data.filters) {
    if (keywordInput) keywordInput.value = data.filters.keyword || '';
    if (matchTypeSelect) matchTypeSelect.value = data.filters.matchType || 'contains';
    if (domainInput) domainInput.value = data.filters.domain || '';
    if (startTimeInput) startTimeInput.value = data.filters.startTime || '';
    if (endTimeInput) endTimeInput.value = data.filters.endTime || '';
    if (minVisitsInput) minVisitsInput.value = data.filters.minVisits || '';
  }
  
  if (data.darkMode && darkModeToggle) {
    document.body.classList.add('dark');
    darkModeToggle.checked = true;
  }
});

// Handle Enter key press
if (keywordInput) {
  keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// Handle Shift+Click for multiple selection
if (resultsDiv) {
  resultsDiv.addEventListener('click', (e) => {
    if (e.target.type === 'checkbox') {
      if (e.shiftKey && lastChecked) {
        const checkboxes = Array.from(resultsDiv.querySelectorAll('input[type="checkbox"]'));
        const start = checkboxes.indexOf(lastChecked);
        const end = checkboxes.indexOf(e.target);
        const startIndex = Math.min(start, end);
        const endIndex = Math.max(start, end);
        
        for (let i = startIndex; i <= endIndex; i++) {
          checkboxes[i].checked = e.target.checked;
        }
      }
      lastChecked = e.target;
    }
  });
}

// Save filters
function saveFilters() {
  const filters = {
    keyword: keywordInput ? keywordInput.value : '',
    matchType: matchTypeSelect ? matchTypeSelect.value : 'contains',
    domain: domainInput ? domainInput.value : '',
    startTime: startTimeInput ? startTimeInput.value : '',
    endTime: endTimeInput ? endTimeInput.value : '',
    minVisits: minVisitsInput ? minVisitsInput.value : ''
  };
  browser.storage.local.set({ filters });
}

// Toggle dark mode
if (darkModeToggle) {
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark');
      browser.storage.local.set({ darkMode: true });
    } else {
      document.body.classList.remove('dark');
      browser.storage.local.set({ darkMode: false });
    }
  });
}

// Update chart bars
function updateChart(total, visits) {
  if (!resultsBar || !visitsBar) return;
  
  const maxValue = Math.max(total, visits);
  const resultsHeight = (total / maxValue) * 100;
  const visitsHeight = (visits / maxValue) * 100;

  resultsBar.style.height = `${resultsHeight}%`;
  visitsBar.style.height = `${visitsHeight}%`;
}

// Main search function
if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    if (!resultsDiv || !statsDiv) return;
    
    resultsDiv.innerHTML = '';
    statsDiv.innerHTML = '';
    
    const keyword = keywordInput ? keywordInput.value : '';
    const matchType = matchTypeSelect ? matchTypeSelect.value : 'contains';
    const domain = domainInput ? domainInput.value : '';
    const startTime = startTimeInput && startTimeInput.value ? new Date(startTimeInput.value).getTime() : 0;
    const endTime = endTimeInput && endTimeInput.value ? new Date(endTimeInput.value).getTime() : Date.now();
    const minVisits = minVisitsInput ? parseInt(minVisitsInput.value) : 0;
    
    saveFilters();
    
    try {
      const historyItems = await browser.history.search({
        text: keyword,
        startTime: startTime,
        endTime: endTime,
        maxResults: 1000
      });
      
      searchResults = historyItems.filter(item => {
        if (domain && !item.url.includes(domain)) return false;
        if (minVisits > 0 && item.visitCount < minVisits) return false;
        if (matchType === 'exact' && item.title !== keyword && item.url !== keyword) return false;
        return true;
      });
      
      displayResults();
      displayStats();
    } catch (error) {
      console.error('Error searching history:', error);
      resultsDiv.innerHTML = `<p class="error">${translations[currentLanguage].error || 'An error occurred'}</p>`;
    }
  });
}

// Display results
function displayResults() {
  if (!resultsDiv) return;
  
  if (searchResults.length === 0) {
    resultsDiv.innerHTML = `<p>${translations[currentLanguage].noResults}</p>`;
    // مخفی کردن دکمه‌های حذف و خروجی
    if (deleteSelectedBtn) deleteSelectedBtn.style.display = 'none';
    if (deleteAllBtn) deleteAllBtn.style.display = 'none';
    if (exportCsvBtn) exportCsvBtn.style.display = 'none';
    if (exportJsonBtn) exportJsonBtn.style.display = 'none';
    return;
  }

  // نمایش دکمه‌های حذف و خروجی
  if (deleteSelectedBtn) deleteSelectedBtn.style.display = 'block';
  if (deleteAllBtn) deleteAllBtn.style.display = 'block';
  if (exportCsvBtn) exportCsvBtn.style.display = 'block';
  if (exportJsonBtn) exportJsonBtn.style.display = 'block';

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

    const small = document.createElement('small');
    small.textContent = `${translations[currentLanguage].totalVisits}: ${item.visitCount}`;

    div.appendChild(checkbox);
    div.appendChild(link);
    div.appendChild(small);

    fragment.appendChild(div);
  });

  resultsDiv.appendChild(fragment);

  // --- این بخش را اضافه کنید ---
  // به همه لینک‌های نتایج تول‌تیپ آدرس بده
  resultsDiv.querySelectorAll('a[href]').forEach(link => {
    link.title = link.href;
  });
}

// Display statistics
function displayStats() {
  if (!statsDiv) return;
  
  const total = searchResults.length;
  const totalVisits = searchResults.reduce((sum, item) => sum + (item.visitCount || 0), 0);

  statsDiv.innerHTML = `
    <p><strong>${translations[currentLanguage].totalResults}:</strong> ${total}</p>
    <p><strong>${translations[currentLanguage].totalVisits}:</strong> ${totalVisits}</p>
  `;
  
  updateChart(total, totalVisits);
}

// Delete selected items
if (deleteSelectedBtn) {
  deleteSelectedBtn.addEventListener('click', async () => {
    if (!resultsDiv) return;
    
    const checkboxes = resultsDiv.querySelectorAll('input[type="checkbox"]:checked');
    const urls = Array.from(checkboxes).map(cb => cb.dataset.url);

    for (const url of urls) {
      await browser.history.deleteUrl({ url });
    }

    // Refresh search
    if (searchBtn) searchBtn.click();
  });
}

// Delete all items
if (deleteAllBtn) {
  deleteAllBtn.addEventListener('click', async () => {
    if (!resultsDiv) return;
    
    const checkboxes = resultsDiv.querySelectorAll('input[type="checkbox"]');
    const urls = Array.from(checkboxes).map(cb => cb.dataset.url);

    for (const url of urls) {
      await browser.history.deleteUrl({ url });
    }

    // Refresh search
    if (searchBtn) searchBtn.click();
  });
}

// Export CSV
if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', () => {
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
  });
}

// Export JSON
if (exportJsonBtn) {
  exportJsonBtn.addEventListener('click', () => {
    if (searchResults.length === 0) return;

    const jsonContent = JSON.stringify(searchResults, null, 2);
    downloadFile('history_export.json', jsonContent, 'application/json');
  });
}

// Utility: Download file
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
