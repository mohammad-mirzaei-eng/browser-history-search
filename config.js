export const translations = {
    fa: {
        title: 'جستجوی تاریخچه',
        keyword: 'کلیدواژه',
        matchType: 'نوع تطابق',
        contains: 'شامل',
        exact: 'دقیق',
        domain: 'دامنه',
        startTime: 'از تاریخ',
        endTime: 'تا تاریخ',
        minVisits: 'حداقل بازدید',
        search: 'جستجو',
        deleteSelected: 'حذف موارد انتخابی',
        exportCsv: 'خروجی CSV',
        exportJson: 'خروجی JSON',
        darkMode: 'حالت تاریک',
        noResults: 'نتیجه‌ای یافت نشد.',
        totalResults: 'تعداد نتایج',
        totalVisits: 'تعداد کل بازدیدها',
        filters: 'فیلترها',
        example: 'مثال',
        selectAll: 'انتخاب همه'
    },
    en: {
        title: 'History Search',
        keyword: 'Keyword',
        matchType: 'Match Type',
        contains: 'Contains',
        exact: 'Exact',
        domain: 'Domain',
        startTime: 'From Date',
        endTime: 'To Date',
        minVisits: 'Min. Visits',
        search: 'Search',
        deleteSelected: 'Delete Selected',
        exportCsv: 'Export CSV',
        exportJson: 'Export JSON',
        darkMode: 'Dark Mode',
        noResults: 'No results found.',
        totalResults: 'Total Results',
        totalVisits: 'Total Visits',
        filters: 'Filters',
        example: 'Example',
        selectAll: 'Select All'
    }
};

export const elements = {
    // General
    appContainer: document.querySelector('.app-container'),
    loadingOverlay: document.getElementById('loading-overlay'),
    heading: document.querySelector('.app-header h2'),

    // Settings
    langFaBtn: document.getElementById('lang-fa-btn'),
    langEnBtn: document.getElementById('lang-en-btn'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon'),

    // Filters
    toggleFiltersBtn: document.getElementById('toggleFiltersBtn'),
    filtersLabel: document.getElementById('filters-label'),
    filterControls: document.getElementById('filter-controls'),
    keywordInput: document.getElementById('keyword'),
    matchTypeSelect: document.getElementById('matchType'),
    domainInput: document.getElementById('domain'),
    startTimeInput: document.getElementById('startTime'),
    endTimeInput: document.getElementById('endTime'),
    minVisitsInput: document.getElementById('minVisits'),
    searchBtn: document.getElementById('searchBtn'),

    // Results
    statsSummary: document.getElementById('stats-summary'),
    resultsToolbar: document.getElementById('results-toolbar'),
    selectAllCheckbox: document.getElementById('selectAllCheckbox'),
    selectAllLabel: document.getElementById('select-all-label'),
    actionButtons: document.querySelector('.action-buttons'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    deleteSelectedBtn: document.getElementById('deleteSelectedBtn'),
    resultsDiv: document.getElementById('results'),

    // Labels for translation
    labels: {
        keyword: document.querySelector('label[for="keyword"]'),
        matchType: document.querySelector('label[for="matchType"]'),
        domain: document.querySelector('label[for="domain"]'),
        startTime: document.querySelector('label[for="startTime"]'),
        endTime: document.querySelector('label[for="endTime"]'),
        minVisits: document.querySelector('label[for="minVisits"]'),
    },

    // Select options for translation
    selectOptions: {
        contains: document.querySelector('#matchType option[value="contains"]'),
        exact: document.querySelector('#matchType option[value="exact"]')
    }
};
