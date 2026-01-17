// app.js

console.log("SEO Intel Dashboard: app.js loaded and starting execution.");

// --- Constants ---
const APP_NAME = "SEO Intel";
const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>`,
  },
  {
    name: "Keywords",
    href: "/keywords",
    icon: `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v3" />
      </svg>`,
  },
  {
    name: "Backlinks",
    href: "/backlinks",
    icon: `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101m-4.899.758a4 4 0 000 5.656l.707.707" />
      </svg>`,
  },
  {
    name: "Competitors",
    href: "/competitors",
    icon: `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.141-1.282-.403-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.141-1.282.403-1.857m0 0a2.001 2.001 0 001.414 2.19M15 10a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v3zm-7.707 3.293a1 1 0 00-1.414 1.414L10.586 18H7a2 2 0 01-2-2v-3.414l-1.707 1.707a1 1 0 00-1.414-1.414l2.293-2.293a1 1 0 000-1.414l-2.293-2.293a1 1 0 101.414-1.414L7 10.586V7a2 2 0 012-2h.414l-1.707-1.707a1 1 0 101.414-1.414l2.293 2.293a1 1 0 001.414 0l2.293-2.293a1 1 0 101.414 1.414L13.414 7h.414a2 2 0 012 2v3.414l1.707-1.707a1 1 0 101.414 1.414l-2.293 2.293a1 1 0 000 1.414l2.293 2.293a1 1 0 00-1.414 1.414L17 13.414V16a2 2 0 01-2 2h-3.586l1.707 1.707a1 1 0 001.414 0z" />
      </svg>`,
  },
  {
    name: "Site Health",
    href: "/health",
    icon: `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 003 12c0 2.21.592 4.287 1.636 6.062C6.72 21.691 10.567 24 12 24s5.28-2.309 7.364-5.938C20.408 16.287 21 14.21 21 12a12.01 12.01 0 00-3-9.056z" />
      </svg>`,
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>`,
  },
];

// --- Global Application State ---
const appState = {
  currentPath: window.location.hash.replace("#", "") || "/",
  isSidebarOpen: false,
  activeIntervals: [], // To store and clear intervals for component unmount
  selectedKeywordId: null, // For KeywordTracker
  keywordSort: { key: "currentRank", order: "asc" }, // For KeywordTracker sorting
  keywordSearchTerm: "", // For KeywordTracker filtering
  backlinkSort: { key: "domainRating", order: "desc" }, // For BacklinkAnalyzer sorting
  backlinkFilterStatus: "all", // For BacklinkAnalyzer filtering
  unreadAlertCount: 0, // Global count for header notification
  globalAlertPollingIntervalId: null, // Interval for global alert polling
  currentDomain: localStorage.getItem('seoIntelDomain') || 'example.com', // User-selected domain
};

// --- Utility Functions ---
const clearChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const createElement = (tag, classNames = [], attributes = {}, innerHTML = "") => {
  const element = document.createElement(tag);
  if (classNames.length > 0) {
    element.classList.add(...classNames);
  }
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
};

const formatNumber = (num) => (num || 0).toLocaleString();

const runInterval = (func, delay, id) => {
  const interval = setInterval(func, delay);
  appState.activeIntervals.push({ id, interval });
};

const clearComponentIntervals = (componentId) => {
  appState.activeIntervals = appState.activeIntervals.filter((item) => {
    if (item.id === componentId) {
      clearInterval(item.interval);
      return false;
    }
    return true;
  });
};

// --- Global Alert Management ---
const updateGlobalAlertCount = async () => {
  try {
    const alerts = await mockSeoService.getAlerts(appState.currentDomain); // Pass current domain
    const unreadCount = alerts.filter((alert) => !alert.isRead).length;
    if (appState.unreadAlertCount !== unreadCount) {
      appState.unreadAlertCount = unreadCount;
      renderHeader(document.getElementById("header-container")); // Re-render header to update count
    }
  } catch (error) {
    console.error("Failed to update global alert count:", error);
  }
};

const initGlobalAlertPolling = () => {
  if (appState.globalAlertPollingIntervalId) {
    clearInterval(appState.globalAlertPollingIntervalId);
  }
  updateGlobalAlertCount(); // Initial fetch
  appState.globalAlertPollingIntervalId = setInterval(updateGlobalAlertCount, 15000); // Poll every 15 seconds
};

// --- Mock SEO Service ---
const mockSeoService = {
  _data: {
    'example.com': {
      domainMetrics: {
        domainAuthority: 75,
        referringDomains: 12500,
        organicKeywords: 85000,
        organicTraffic: 320000,
      },
      keywordRanks: [
        { id: "kw1", keyword: "best seo tools", url: "https://example.com/blog/best-seo-tools", currentRank: 3, rankChange: 1, searchVolume: 12000, difficulty: 78, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), rank: 5 }, { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), rank: 4 }, { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), rank: 4 }, { date: new Date(), rank: 3 }], },
        { id: "kw2", keyword: "how to improve domain authority", url: "https://example.com/guides/improve-da", currentRank: 8, rankChange: -2, searchVolume: 8000, difficulty: 65, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), rank: 6 }, { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), rank: 7 }, { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rank: 10 }, { date: new Date(), rank: 8 }], },
        { id: "kw3", keyword: "local seo guide", url: "https://example.com/blog/local-seo", currentRank: 1, rankChange: 0, searchVolume: 15000, difficulty: 70, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), rank: 1 }, { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), rank: 1 }, { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), rank: 1 }, { date: new Date(), rank: 1 }], },
        { id: "kw4", keyword: "keyword research strategy", url: "https://example.com/guides/keyword-research", currentRank: 15, rankChange: 3, searchVolume: 6000, difficulty: 55, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), rank: 20 }, { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), rank: 18 }, { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), rank: 18 }, { date: new Date(), rank: 15 }], },
        { id: "kw5", keyword: "technical seo checklist", url: "https://example.com/blog/technical-seo", currentRank: 10, rankChange: -1, searchVolume: 9000, difficulty: 82, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), rank: 9 }, { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rank: 9 }, { date: new Date(), rank: 10 }], },
      ],
      backlinks: [
        { id: "bl1", sourceUrl: "https://externalblog.com/post-about-seo", targetUrl: "https://example.com/blog/best-seo-tools", anchorText: "best SEO tools", status: "active", domainRating: 85, firstSeen: Date.now() - 30 * 24 * 60 * 60 * 1000, },
        { id: "bl2", sourceUrl: "https://seocommunity.org/resources", targetUrl: "https://example.com/guides/improve-da", anchorText: "improve domain authority", status: "active", domainRating: 70, firstSeen: Date.now() - 60 * 24 * 60 * 60 * 1000, },
        { id: "bl3", sourceUrl: "https://anotherblog.net/seo-news", targetUrl: "https://example.com/", anchorText: "example.com", status: "active", domainRating: 60, firstSeen: Date.now() - 10 * 24 * 60 * 60 * 1000, },
        { id: "bl4", sourceUrl: "https://startupdirectory.co/top-saas", targetUrl: "https://example.com/", anchorText: "SEO Intel Dashboard", status: "new", domainRating: 78, firstSeen: Date.now() - 1 * 24 * 60 * 60 * 1000, },
        { id: "bl5", sourceUrl: "https://oldreviewsite.biz/seo-tools-archive", targetUrl: "https://example.com/blog/old-post", anchorText: "old SEO post", status: "lost", domainRating: 50, firstSeen: Date.now() - 120 * 24 * 60 * 60 * 1000, },
      ],
      alerts: [
        { id: "alert1", type: "rank_drop", message: 'Keyword "how to improve domain authority" dropped from rank 6 to 8.', timestamp: Date.now() - 1 * 60 * 1000, isRead: false, link: "/keywords", },
        { id: "alert2", type: "new_backlink", message: "New backlink from startupdirectory.co to example.com!", timestamp: Date.now() - 3 * 60 * 1000, isRead: false, link: "/backlinks", },
        { id: "alert3", type: "site_health", message: "Critical: 500 pages with broken internal links found.", timestamp: Date.now() - 15 * 60 * 1000, isRead: true, link: "/health", },
        { id: "alert4", type: "rank_drop", message: 'Keyword "technical seo checklist" dropped from rank 9 to 10.', timestamp: Date.now() - 5 * 60 * 1000, isRead: false, link: "/keywords", },
      ],
      competitors: [
        { id: "comp1", domain: "competitor-a.com", domainAuthority: 80, organicKeywords: 95000, organicTraffic: 400000, commonKeywords: 50000, gapKeywords: 10000, },
        { id: "comp2", domain: "competitor-b.com", domainAuthority: 68, organicKeywords: 70000, organicTraffic: 250000, commonKeywords: 45000, gapKeywords: 5000, },
        { id: "comp3", domain: "competitor-c.net", domainAuthority: 72, organicKeywords: 80000, organicTraffic: 300000, commonKeywords: 48000, gapKeywords: 7000, },
      ],
      siteHealthIssues: [
        { type: "error", title: "Broken Internal Links", description: "Some internal links point to non-existent pages (404).", severity: "critical", pagesAffected: 50, },
        { type: "warning", title: "Missing Meta Descriptions", description: "Pages without meta descriptions may suffer in CTR.", severity: "high", pagesAffected: 120, },
        { type: "notice", title: "Low Content Pages", description: "Pages identified with very little unique content.", severity: "medium", pagesAffected: 30, },
        { type: "error", title: "Slow Loading Pages", description: "Identified pages with a Core Web Vitals LCP score over 2.5s.", severity: "critical", pagesAffected: 15, },
      ],
    },
    'mydomain.com': {
      domainMetrics: {
        domainAuthority: 55,
        referringDomains: 3200,
        organicKeywords: 15000,
        organicTraffic: 80000,
      },
      keywordRanks: [
        { id: "mykw1", keyword: "my product review", url: "https://mydomain.com/product/review", currentRank: 1, rankChange: 0, searchVolume: 5000, difficulty: 60, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), rank: 2 }, { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), rank: 1 }, { date: new Date(), rank: 1 }], },
        { id: "mykw2", keyword: "service pricing", url: "https://mydomain.com/pricing", currentRank: 5, rankChange: 2, searchVolume: 2000, difficulty: 45, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), rank: 10 }, { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), rank: 7 }, { date: new Date(), rank: 5 }], },
        { id: "mykw3", keyword: "my niche guide", url: "https://mydomain.com/blog/niche-guide", currentRank: 12, rankChange: -3, searchVolume: 1000, difficulty: 70, lastChecked: Date.now(), historicalRanks: [{ date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rank: 9 }, { date: new Date(), rank: 12 }], },
      ],
      backlinks: [
        { id: "mybl1", sourceUrl: "https://techblog.com/new-software", targetUrl: "https://mydomain.com/product/review", anchorText: "great software", status: "active", domainRating: 70, firstSeen: Date.now() - 15 * 24 * 60 * 60 * 1000, },
        { id: "mybl2", sourceUrl: "https://reviewsite.net/best-tools", targetUrl: "https://mydomain.com/", anchorText: "MyDomain", status: "new", domainRating: 65, firstSeen: Date.now() - 2 * 24 * 60 * 60 * 1000, },
      ],
      alerts: [
        { id: "myalert1", type: "rank_drop", message: 'Keyword "my niche guide" dropped to rank 12.', timestamp: Date.now() - 30 * 60 * 1000, isRead: false, link: "/keywords", },
        { id: "myalert2", type: "new_backlink", message: "New backlink from reviewsite.net to mydomain.com!", timestamp: Date.now() - 5 * 60 * 1000, isRead: false, link: "/backlinks", },
      ],
      competitors: [
        { id: "mycomp1", domain: "small-competitor-x.com", domainAuthority: 40, organicKeywords: 10000, organicTraffic: 50000, commonKeywords: 3000, gapKeywords: 2000, },
        { id: "mycomp2", domain: "big-player-y.com", domainAuthority: 85, organicKeywords: 200000, organicTraffic: 1000000, commonKeywords: 10000, gapKeywords: 50000, },
      ],
      siteHealthIssues: [
        { type: "warning", title: "Duplicate Content", description: "Several pages have identical content, causing SEO issues.", severity: "high", pagesAffected: 10, },
        { type: "notice", title: "Image Alt Text Missing", description: "Missing alt text on some images affects accessibility and SEO.", severity: "medium", pagesAffected: 50, },
      ],
    }
  },

  _getDataForDomain(domain) {
    return this._data[domain] || {
      domainMetrics: null,
      keywordRanks: [],
      backlinks: [],
      alerts: [],
      competitors: [],
      siteHealthIssues: [],
    };
  },

  // Simulate API calls with random variations
  getDomainMetrics: (domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const domainData = mockSeoService._getDataForDomain(domain);
        if (!domainData.domainMetrics) {
          resolve(null);
          return;
        }
        // Simulate small real-time fluctuations only for example.com
        if (domain === 'example.com') {
          domainData.domainMetrics.organicTraffic += Math.floor(
            Math.random() * 500 - 250
          );
          domainData.domainMetrics.organicKeywords += Math.floor(
            Math.random() * 20 - 10
          );
          domainData.domainMetrics.referringDomains += Math.floor(
            Math.random() * 5 - 2
          );
        }
        resolve({ ...domainData.domainMetrics });
      }, 500 + Math.random() * 500); // 0.5s to 1s delay
    }),

  getKeywordRanks: (domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const domainData = mockSeoService._getDataForDomain(domain);
        if (domainData.keywordRanks.length === 0) {
          resolve([]);
          return;
        }
        const updatedRanks = domainData.keywordRanks.map((kw) => {
          // Simulate rank changes
          const newRank = Math.max(
            1,
            kw.currentRank + Math.floor(Math.random() * 3) - 1
          ); // Change by -1, 0, or 1
          const rankChange = kw.currentRank - newRank;

          // Update historical data (only if rank actually changed)
          const newHistoricalRanks = [...kw.historicalRanks];
          const lastHistory = newHistoricalRanks[newHistoricalRanks.length - 1];
          if (lastHistory && lastHistory.rank !== newRank) {
            newHistoricalRanks.push({ date: new Date(), rank: newRank });
          } else if (!lastHistory) {
            newHistoricalRanks.push({ date: new Date(), rank: newRank });
          } else if (lastHistory && (Date.now() - lastHistory.date.getTime()) > (60 * 60 * 1000)) { // Add if last update was more than an hour ago
             newHistoricalRanks.push({ date: new Date(), rank: newRank });
          }


          return {
            ...kw,
            currentRank: newRank,
            rankChange: rankChange,
            lastChecked: Date.now(),
            searchVolume: Math.max(
              100,
              kw.searchVolume + Math.floor(Math.random() * 100 - 50)
            ),
            historicalRanks: newHistoricalRanks,
          };
        });
        domainData.keywordRanks = updatedRanks; // Update the internal mock data
        resolve([...domainData.keywordRanks]);
      }, 700 + Math.random() * 800); // 0.7s to 1.5s delay
    }),

  getBacklinks: (domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const domainData = mockSeoService._getDataForDomain(domain);
        if (domainData.backlinks.length === 0) {
          resolve([]);
          return;
        }
        // Simulate a new backlink occasionally
        if (Math.random() < 0.1 && domain === 'example.com') { // 10% chance for example.com
          const newBl = {
            id: `bl${domainData.backlinks.length + 1}`,
            sourceUrl: `https://newblog-${Math.floor(
              Math.random() * 1000
            )}.com/article`,
            targetUrl: `https://${domain}/new-content`,
            anchorText: "great resource",
            status: "new",
            domainRating: Math.floor(Math.random() * 40) + 40,
            firstSeen: Date.now(),
          };
          domainData.backlinks.unshift(newBl); // Add to beginning
          // Also add an alert
          domainData.alerts.unshift({
            id: `alert${domainData.alerts.length + 1}`,
            type: "new_backlink",
            message: `New backlink from ${newBl.sourceUrl.replace(/^(https?:\/\/(www\.)?)/, "").split("/")[0]}!`,
            timestamp: Date.now(),
            isRead: false,
            link: "/backlinks",
          });
        }
        resolve([...domainData.backlinks]);
      }, 1000 + Math.random() * 1000); // 1s to 2s delay
    }),

  getCompetitors: (domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSeoService._getDataForDomain(domain).competitors]);
      }, 600 + Math.random() * 600);
    }),

  getSiteHealthIssues: (domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSeoService._getDataForDomain(domain).siteHealthIssues]);
      }, 800 + Math.random() * 700);
    }),

  getAlerts: (domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const domainData = mockSeoService._getDataForDomain(domain);
        const currentAlerts = [...domainData.alerts]; // Use a copy
        
        // Simulate a new alert occasionally
        if (Math.random() < 0.15 && domain === 'example.com') { // 15% chance for example.com
            const alertTypes = ['rank_drop', 'new_backlink', 'site_health'];
            const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            let message = '';
            let link = '';
            switch(randomType) {
                case 'rank_drop':
                    message = `Random keyword rank drop detected!`;
                    link = '/keywords';
                    break;
                case 'new_backlink':
                    message = `Random new backlink detected!`;
                    link = '/backlinks';
                    break;
                case 'site_health':
                    message = `Random site health warning detected!`;
                    link = '/health';
                    break;
            }
            currentAlerts.unshift({
                id: `alert${currentAlerts.length + 1}`,
                type: randomType,
                message: message,
                timestamp: Date.now(),
                isRead: false,
                link: link
            });
        }

        // Sort alerts by timestamp, newest first
        const sortedAlerts = currentAlerts.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        domainData.alerts = sortedAlerts; // Update internal alerts
        resolve(sortedAlerts);
      }, 300 + Math.random() * 400); // Quick fetch for alerts
    }),

  markAlertAsRead: (alertId, domain) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const domainData = mockSeoService._getDataForDomain(domain);
        const alertIndex = domainData.alerts.findIndex(
          (a) => a.id === alertId
        );
        if (alertIndex !== -1) {
          domainData.alerts[alertIndex].isRead = true;
        }
        resolve();
      }, 200);
    }),
};

// --- Component Rendering Functions ---

// MetricCard Component
const renderMetricCard = ({ title, value, change, unit, className = "" }) => {
  const changeColor =
    change === undefined
      ? ""
      : change >= 0
      ? "text-green-500"
      : "text-red-500";
  const changeSign = change === undefined ? "" : change >= 0 ? "+" : "";
  const changeIcon =
    change === undefined
      ? ""
      : change >= 0
      ? `
    <svg class="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>`
      : `
    <svg class="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>`;

  return `
    <div class="bg-white p-6 rounded-lg shadow-sm ${className}">
      <p class="text-sm font-medium text-gray-500">${title}</p>
      <div class="mt-1 flex items-baseline justify-between">
        <p class="text-3xl font-semibold text-gray-900">
          ${value}${unit ? `<span class="text-xl font-normal ml-1">${unit}</span>` : ""}
        </p>
        ${
          change !== undefined
            ? `
          <p class="ml-2 flex items-baseline text-sm font-semibold ${changeColor}">
            ${changeSign}${change}%
            ${changeIcon}
          </p>`
            : ""
        }
      </div>
    </div>
  `;
};

// ChartCard Component (simplified for vanilla JS)
const renderChartCard = (title, contentHtml, className = "") => {
  return `
    <div class="bg-white p-6 rounded-lg shadow-sm ${className}">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">${title}</h3>
      <div class="w-full h-72 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded p-4">
        ${contentHtml}
      </div>
    </div>
  `;
};

// --- Page Specific Renderers ---

const renderDashboard = async (mainContentEl) => {
  clearChildren(mainContentEl);
  mainContentEl.innerHTML = `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6" id="dashboard-title">Dashboard for ${appState.currentDomain}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="metrics-section">
        <div class="bg-white p-6 rounded-lg shadow-sm h-32 animate-pulse"><div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div class="h-8 bg-gray-300 rounded w-1/2"></div></div>
        <div class="bg-white p-6 rounded-lg shadow-sm h-32 animate-pulse"><div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div class="h-8 bg-gray-300 rounded w-1/2"></div></div>
        <div class="bg-white p-6 rounded-lg shadow-sm h-32 animate-pulse"><div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div class="h-8 bg-gray-300 rounded w-1/2"></div></div>
        <div class="bg-white p-6 rounded-lg shadow-sm h-32 animate-pulse"><div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div class="h-8 bg-gray-300 rounded w-1/2"></div></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" id="charts-section">
        <div id="traffic-chart-card">
          ${renderChartCard(
            "Organic & Paid Traffic Over Time",
            "<div class='h-full w-full bg-gray-100 flex items-center justify-center text-gray-500 animate-pulse'>Loading traffic data...</div>"
          )}
        </div>
        <div id="keyword-distribution-card">
          ${renderChartCard(
            "Keyword Distribution (Top 100)",
            "<div class='h-full w-full bg-gray-100 flex items-center justify-center text-gray-500 animate-pulse'>Loading keyword data...</div>"
          )}
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="recent-activity-section">
        <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Rank Changes</h3><div class="space-y-3"><div class="h-6 bg-gray-200 rounded w-full animate-pulse"></div><div class="h-6 bg-gray-200 rounded w-full animate-pulse"></div></div></div>
        <div class="bg-white p-6 rounded-lg shadow-sm"><h3 class="text-lg font-semibold text-gray-800 mb-4">New & Lost Backlinks</h3><div class="space-y-3"><div class="h-6 bg-gray-200 rounded w-full animate-pulse"></div><div class="h-6 bg-gray-200 rounded w-full animate-pulse"></div></div></div>
      </div>
    </div>
  `;

  const currentDomain = appState.currentDomain; // Use state variable
  // Initial dummy traffic data, will be updated by fetched metrics
  let trafficData = [
    { date: "Jan", organic: 0, paid: 0 },
    { date: "Feb", organic: 0, paid: 0 },
    { date: "Mar", organic: 0, paid: 0 },
    { date: "Apr", organic: 0, paid: 0 },
    { date: "May", organic: 0, paid: 0 },
    { date: "Jun", organic: 0, paid: 0 },
    { date: "Jul", organic: 0, paid: 0 },
    { date: "Aug", organic: 0, paid: 0 },
    { date: "Sep", organic: 0, paid: 0 },
  ];

  const fetchData = async () => {
    try {
      const metrics = await mockSeoService.getDomainMetrics(currentDomain);
      const ranks = await mockSeoService.getKeywordRanks(currentDomain);
      const bls = await mockSeoService.getBacklinks(currentDomain);

      // Handle no data for the domain
      if (!metrics && ranks.length === 0 && bls.length === 0) {
        mainContentEl.innerHTML = `
          <div class="container mx-auto px-4 py-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard for ${currentDomain}</h1>
            <p class="text-gray-600 text-lg">No SEO data available for "${currentDomain}".</p>
            <p class="text-gray-500 mt-2">Try "example.com" or "mydomain.com" for mock data.</p>
          </div>
        `;
        return;
      }

      // Update metrics section
      const metricsHtml = `
        ${renderMetricCard({
          title: "Domain Authority",
          value: metrics?.domainAuthority || 0,
          unit: "",
        })}
        ${renderMetricCard({
          title: "Referring Domains",
          value: formatNumber(metrics?.referringDomains || 0),
        })}
        ${renderMetricCard({
          title: "Organic Keywords",
          value: formatNumber(metrics?.organicKeywords || 0),
        })}
        ${renderMetricCard({
          title: "Organic Traffic",
          value: formatNumber(metrics?.organicTraffic || 0),
        })}
      `;
      document.getElementById("metrics-section").innerHTML = metricsHtml;
      document.getElementById("dashboard-title").textContent = `Dashboard for ${currentDomain}`;

      // Update traffic data with latest organic traffic
      trafficData[trafficData.length - 1].organic =
        metrics?.organicTraffic || trafficData[trafficData.length - 1].organic;
      // For simplicity, paid traffic can be static or dynamically derived
      trafficData[trafficData.length - 1].paid = (metrics?.organicTraffic ? Math.floor(metrics.organicTraffic * 0.1) : 0);

      const maxOrganicTraffic = Math.max(...trafficData.map(d => d.organic));
      const maxPaidTraffic = Math.max(...trafficData.map(d => d.paid));
      const maxOverallTraffic = Math.max(maxOrganicTraffic, maxPaidTraffic);


      const trafficChartHtml = `
        <div class="flex items-end justify-between h-full w-full px-2 pt-4">
          ${trafficData.map(d => `
            <div class="flex flex-col items-center flex-1 mx-0.5">
              <div class="relative w-4 flex flex-col justify-end items-center h-full">
                <div class="w-full bg-indigo-300 rounded-t-sm" style="height: ${(d.organic / maxOverallTraffic) * 90}%;"></div>
                <div class="w-full bg-blue-300 rounded-t-sm mt-0.5" style="height: ${(d.paid / maxOverallTraffic) * 90}%;"></div>
              </div>
              <span class="text-xs text-gray-500 mt-1">${d.date}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex justify-center mt-2 text-xs text-gray-600 space-x-4">
          <span class="flex items-center"><span class="w-3 h-3 bg-indigo-300 mr-1"></span>Organic</span>
          <span class="flex items-center"><span class="w-3 h-3 bg-blue-300 mr-1"></span>Paid</span>
        </div>
        <p class="text-xs text-gray-400 mt-2">Simplified bar chart representation.</p>
      `;

      document.querySelector("#traffic-chart-card div.h-72").innerHTML = trafficChartHtml;

      const keywordDistributionData = [
        { name: "Top 3", value: ranks.filter((k) => k.currentRank <= 3).length },
        {
          name: "Top 10",
          value: ranks.filter((k) => k.currentRank > 3 && k.currentRank <= 10)
            .length,
        },
        {
          name: "Top 100",
          value: ranks.filter((k) => k.currentRank > 10 && k.currentRank <= 100)
            .length,
        },
        {
          name: "Others",
          value: ranks.filter((k) => k.currentRank > 100).length,
        },
      ];
      const totalKeywords = ranks.length;
      const keywordDistributionHtml = `
        <div class="flex flex-col items-center justify-center w-full h-full space-y-3">
          ${keywordDistributionData
            .map(
              (item) => `
            <div class="flex items-center w-full max-w-sm">
              <span class="text-sm font-medium w-24 text-right pr-4">${item.name}:</span>
              <div class="flex-1 bg-gray-200 rounded-full h-5 relative overflow-hidden">
                <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${
                  totalKeywords > 0 ? (item.value / totalKeywords) * 100 : 0
                }%;"></div>
              </div>
              <span class="ml-3 text-sm font-semibold w-12 text-left">${item.value}</span>
              <span class="ml-1 text-xs text-gray-500 w-10 text-left">(${
                totalKeywords > 0 ? ((item.value / totalKeywords) * 100).toFixed(0) : 0
              }%)</span>
            </div>
          `
            )
            .join("")}
        </div>
        <p class="text-xs text-gray-400 mt-2">Simplified bar chart representation.</p>
      `;
      document.querySelector("#keyword-distribution-card div.h-72").innerHTML = keywordDistributionHtml;

      const recentRankChanges = ranks
        .filter((k) => k.rankChange !== 0)
        .sort((a, b) => Math.abs(b.rankChange) - Math.abs(a.rankChange))
        .slice(0, 5);

      const recentRankChangesHtml =
        recentRankChanges.length > 0
          ? `
        <ul class="divide-y divide-gray-200">
          ${recentRankChanges
            .map(
              (kw) => `
            <li class="py-3 flex items-center justify-between">
              <span class="text-gray-700 font-medium">${kw.keyword}</span>
              <span class="text-sm font-semibold ${
                kw.rankChange > 0 ? "text-green-500" : "text-red-500"
              }">
                ${kw.rankChange > 0 ? "▲" : "▼"} ${Math.abs(kw.rankChange)} (Rank: ${
                kw.currentRank
              })
              </span>
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : `<p class="text-gray-500">No recent rank changes.</p>`;
      document.querySelector(
        "#recent-activity-section > div:first-child"
      ).innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Rank Changes</h3>
        ${recentRankChangesHtml}
      `;

      const newAndLostBacklinks = bls.filter(
        (b) => b.status === "new" || b.status === "lost"
      );
      const newAndLostBacklinksHtml =
        newAndLostBacklinks.length > 0
          ? `
        <ul class="divide-y divide-gray-200">
          ${newAndLostBacklinks
            .map(
              (bl) => `
            <li class="py-3 flex items-center justify-between">
              <a href="${bl.sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                ${bl.sourceUrl.replace(/^(https?:\/\/(www\.)?)/, "").split("/")[0]}
              </a>
              <span class="text-sm font-semibold ${
                bl.status === "new" ? "text-green-500" : "text-red-500"
              }">
                ${bl.status === "new" ? "NEW" : "LOST"}
              </span>
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : `<p class="text-gray-500">No new or lost backlinks recently.</p>`;
      document.querySelector(
        "#recent-activity-section > div:last-child"
      ).innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4">New & Lost Backlinks</h3>
        ${newAndLostBacklinksHtml}
      `;
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      mainContentEl.innerHTML = `<div class="text-red-500 p-4">Failed to load dashboard data.</div>`;
    }
  };

  fetchData();
  runInterval(fetchData, 30000, "dashboard"); // Poll every 30 seconds
};

const renderKeywordTracker = async (mainContentEl) => {
  clearChildren(mainContentEl);
  mainContentEl.innerHTML = `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Keyword Rank Tracker for ${appState.currentDomain}</h1>

      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tracked Keywords</h2>
        <div class="mb-4 flex items-center space-x-4">
            <input
                type="text"
                id="keyword-search"
                placeholder="Search keywords or URLs..."
                value="${appState.keywordSearchTerm}"
                class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-ring-indigo"
                aria-label="Search keywords"
            />
            <button
              id="clear-search-btn"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus-ring-indigo"
              aria-label="Clear search"
            >
              Clear
            </button>
        </div>
        <div id="keyword-table-loading" class="space-y-3">
          ${Array.from({ length: 5 })
            .map(
              (_, i) =>
                `<div key=${i} class="h-10 bg-gray-200 rounded w-full animate-pulse"></div>`
            )
            .join("")}
        </div>
        <div id="keyword-table-container" class="overflow-x-auto hidden"></div>
      </div>

      <div id="selected-keyword-details" class="hidden">
        ${renderChartCard(
          "Historical Rank",
          "<p>Select a keyword from the table to view its detailed historical rank.</p><p class='text-sm text-gray-400 mt-2'>Click on any row in the table above.</p>"
        )}
      </div>
    </div>
  `;

  const currentDomain = appState.currentDomain;

  const fetchKeywords = async () => {
    try {
      document.getElementById("keyword-table-loading").classList.remove("hidden");
      document.getElementById("keyword-table-container").classList.add("hidden");

      let ranks = await mockSeoService.getKeywordRanks(currentDomain);

      // Handle no data for the domain
      if (ranks.length === 0) {
        mainContentEl.innerHTML = `
          <div class="container mx-auto px-4 py-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Keyword Rank Tracker for ${currentDomain}</h1>
            <p class="text-gray-600 text-lg">No keyword data available for "${currentDomain}".</p>
            <p class="text-gray-500 mt-2">Try "example.com" or "mydomain.com" for mock data.</p>
          </div>
        `;
        return;
      }

      // Filter
      if (appState.keywordSearchTerm) {
        const searchTermLower = appState.keywordSearchTerm.toLowerCase();
        ranks = ranks.filter(
          (kw) =>
            kw.keyword.toLowerCase().includes(searchTermLower) ||
            kw.url.toLowerCase().includes(searchTermLower)
        );
      }

      // Sort
      ranks.sort((a, b) => {
        let valA, valB;
        switch (appState.keywordSort.key) {
          case "keyword":
            valA = a.keyword.toLowerCase();
            valB = b.keyword.toLowerCase();
            break;
          case "currentRank":
            valA = a.currentRank;
            valB = b.currentRank;
            break;
          case "searchVolume":
            valA = a.searchVolume;
            valB = b.searchVolume;
            break;
          case "difficulty":
            valA = a.difficulty;
            valB = b.difficulty;
            break;
          default:
            valA = a.currentRank;
            valB = b.currentRank;
            break;
        }

        if (valA < valB) return appState.keywordSort.order === "asc" ? -1 : 1;
        if (valA > valB) return appState.keywordSort.order === "asc" ? 1 : -1;
        return 0;
      });

      // Update selectedKeywordId if it's the first load or the selected keyword is no longer present
      if (
        ranks.length > 0 &&
        (!appState.selectedKeywordId ||
          !ranks.some((k) => k.id === appState.selectedKeywordId))
      ) {
        appState.selectedKeywordId = ranks[0].id;
      } else if (ranks.length === 0) {
        appState.selectedKeywordId = null;
      }

      const getSortArrow = (key) => {
        if (appState.keywordSort.key === key) {
          return appState.keywordSort.order === "asc" ? " ▲" : " ▼";
        }
        return "";
      };

      const tableBodyHtml = ranks
        .map((kw) => {
          const isSelected = appState.selectedKeywordId === kw.id;
          return `
          <tr
            data-keyword-id="${kw.id}"
            class="hover:bg-indigo-50 cursor-pointer ${isSelected ? "bg-indigo-100" : ""}"
            aria-selected="${isSelected}"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
              kw.keyword
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <a href="${kw.url}" target="_blank" rel="noopener noreferrer" class="hover:underline">
                ${kw.url.replace(/^(https?:\/\/(www\.)?)/, "").split("/")[0]}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
              kw.currentRank
            }</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="font-semibold ${
                kw.rankChange > 0
                  ? "text-green-500"
                  : kw.rankChange < 0
                  ? "text-red-500"
                  : "text-gray-500"
              }">
                ${
                  kw.rankChange > 0
                    ? `▲${kw.rankChange}`
                    : kw.rankChange < 0
                    ? `▼${Math.abs(kw.rankChange)}`
                    : "-"
                }
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(
              kw.searchVolume
            )}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
              kw.difficulty
            }%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(
              kw.lastChecked
            ).toLocaleTimeString()}</td>
          </tr>
        `;
        })
        .join("");

      document.getElementById("keyword-table-container").innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="keyword" tabindex="0">
                Keyword ${getSortArrow("keyword")}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="currentRank" tabindex="0">
                Current Rank ${getSortArrow("currentRank")}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="searchVolume" tabindex="0">
                Search Vol. ${getSortArrow("searchVolume")}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="difficulty" tabindex="0">
                Difficulty ${getSortArrow("difficulty")}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Checked
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${tableBodyHtml}
          </tbody>
        </table>
      `;

      document.getElementById("keyword-table-loading").classList.add("hidden");
      document
        .getElementById("keyword-table-container")
        .classList.remove("hidden");

      document.querySelectorAll("#keyword-table-container tr").forEach((row) => {
        row.addEventListener("click", (event) => {
          const keywordId = event.currentTarget.dataset.keywordId;
          appState.selectedKeywordId = keywordId;
          // Re-render to update selection and details
          fetchKeywords();
        });
      });

      document.querySelectorAll("#keyword-table-container th[data-sort-key]").forEach(header => {
        header.addEventListener('click', (event) => {
          const sortKey = event.currentTarget.dataset.sortKey;
          if (appState.keywordSort.key === sortKey) {
            appState.keywordSort.order = appState.keywordSort.order === 'asc' ? 'desc' : 'asc';
          } else {
            appState.keywordSort.key = sortKey;
            appState.keywordSort.order = 'asc';
          }
          fetchKeywords();
        });
      });

      document.getElementById("keyword-search").addEventListener("input", (event) => {
        appState.keywordSearchTerm = event.target.value;
        fetchKeywords();
      });

      document.getElementById("clear-search-btn").addEventListener("click", () => {
        document.getElementById("keyword-search").value = "";
        appState.keywordSearchTerm = "";
        fetchKeywords();
      });


      // Render selected keyword details
      const selectedKeyword = ranks.find((k) => k.id === appState.selectedKeywordId);
      const selectedKeywordDetailsEl = document.getElementById(
        "selected-keyword-details"
      );
      if (selectedKeyword) {
        selectedKeywordDetailsEl.classList.remove("hidden");
        const historicalRanksHtml = `
          <div class="flex flex-col items-center justify-center w-full h-full space-y-2">
            ${selectedKeyword.historicalRanks
              .map(
                (h, index) => `
                <div class="flex items-center justify-between w-full max-w-sm">
                  <span class="text-sm font-medium w-24">${new Date(h.date).toLocaleDateString()}:</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-5 relative overflow-hidden">
                    <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${
                      (100 - (h.rank / 100) * 100)
                    }%;"></div>
                     <span class="absolute right-2 text-white text-xs font-bold">${h.rank}</span>
                  </div>
                </div>
                `
              )
              .join("")}
          </div>
          <p class="text-xs text-gray-400 mt-2">Lower rank is better. Visualized as bars (max width 100 for rank 1).</p>
        `;
        selectedKeywordDetailsEl.innerHTML = renderChartCard(
          `Historical Rank for "${selectedKeyword.keyword}"`,
          historicalRanksHtml
        );
      } else {
        selectedKeywordDetailsEl.classList.add("hidden");
        // Reset details card content when no keyword is selected or available
        selectedKeywordDetailsEl.innerHTML = renderChartCard(
          "Historical Rank",
          "<p>Select a keyword from the table to view its detailed historical rank.</p><p class='text-sm text-gray-400 mt-2'>Click on any row in the table above.</p>"
        );
      }
    } catch (err) {
      console.error("Failed to fetch keyword ranks:", err);
      document.getElementById(
        "keyword-table-container"
      ).innerHTML = `<p class="text-red-500 p-4">Failed to load keyword data.</p>`;
      document.getElementById("keyword-table-loading").classList.add("hidden");
      document
        .getElementById("keyword-table-container")
        .classList.remove("hidden");
    }
  };

  fetchKeywords();
  runInterval(fetchKeywords, 15000, "keyword-tracker");
};

const renderBacklinkAnalyzer = async (mainContentEl) => {
  clearChildren(mainContentEl);
  mainContentEl.innerHTML = `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Backlink Analyzer for ${appState.currentDomain}</h1>

      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Backlinks for ${appState.currentDomain}</h2>
        <div class="mb-4 flex items-center space-x-4">
            <label for="backlink-filter-status" class="sr-only">Filter by status</label>
            <select
                id="backlink-filter-status"
                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-ring-indigo"
                aria-label="Filter backlinks by status"
            >
                <option value="all" ${appState.backlinkFilterStatus === "all" ? "selected" : ""}>All Statuses</option>
                <option value="active" ${appState.backlinkFilterStatus === "active" ? "selected" : ""}>Active</option>
                <option value="new" ${appState.backlinkFilterStatus === "new" ? "selected" : ""}>New</option>
                <option value="lost" ${appState.backlinkFilterStatus === "lost" ? "selected" : ""}>Lost</option>
            </select>
        </div>
        <div id="backlink-table-loading" class="space-y-3">
          ${Array.from({ length: 5 })
            .map(
              (_, i) =>
                `<div key=${i} class="h-10 bg-gray-200 rounded w-full animate-pulse"></div>`
            )
            .join("")}
        </div>
        <div id="backlink-table-container" class="overflow-x-auto hidden"></div>
      </div>
    </div>
  `;

  const currentDomain = appState.currentDomain;

  const fetchBacklinks = async () => {
    try {
      document.getElementById("backlink-table-loading").classList.remove("hidden");
      document.getElementById("backlink-table-container").classList.add("hidden");

      let bls = await mockSeoService.getBacklinks(currentDomain);

      // Handle no data for the domain
      if (bls.length === 0) {
        mainContentEl.innerHTML = `
          <div class="container mx-auto px-4 py-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Backlink Analyzer for ${currentDomain}</h1>
            <p class="text-gray-600 text-lg">No backlink data available for "${currentDomain}".</p>
            <p class="text-gray-500 mt-2">Try "example.com" or "mydomain.com" for mock data.</p>
          </div>
        `;
        return;
      }

      // Filter
      if (appState.backlinkFilterStatus !== "all") {
        bls = bls.filter((bl) => bl.status === appState.backlinkFilterStatus);
      }

      // Sort
      bls.sort((a, b) => {
        let valA, valB;
        switch (appState.backlinkSort.key) {
          case "sourceUrl":
            valA = a.sourceUrl.toLowerCase();
            valB = b.sourceUrl.toLowerCase();
            break;
          case "domainRating":
            valA = a.domainRating;
            valB = b.domainRating;
            break;
          case "firstSeen":
            valA = a.firstSeen;
            valB = b.firstSeen;
            break;
          default:
            valA = a.domainRating;
            valB = b.domainRating;
            break;
        }

        if (valA < valB) return appState.backlinkSort.order === "asc" ? -1 : 1;
        if (valA > valB) return appState.backlinkSort.order === "asc" ? 1 : -1;
        return 0;
      });

      const getSortArrow = (key) => {
        if (appState.backlinkSort.key === key) {
          return appState.backlinkSort.order === "asc" ? " ▲" : " ▼";
        }
        return "";
      };

      const tableBodyHtml = bls
        .map(
          (bl) => `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
            <a href="${bl.sourceUrl}" target="_blank" rel="noopener noreferrer" class="hover:underline">
              ${bl.sourceUrl.replace(/^(https?:\/\/(www\.)?)/, "").split("/")[0]}
            </a>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            <a href="${bl.targetUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
              ${bl.targetUrl.replace(/^(https?:\/\/(www\.)?)/, "").split("/")[0]}...
            </a>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
            bl.anchorText
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              bl.status === "active"
                ? "bg-green-100 text-green-800"
                : bl.status === "new"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }">
              ${bl.status.toUpperCase()}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
            bl.domainRating
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(
            bl.firstSeen
          ).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join("");

      document.getElementById("backlink-table-container").innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="sourceUrl" tabindex="0">
                Source URL ${getSortArrow("sourceUrl")}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anchor Text
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="domainRating" tabindex="0">
                DR ${getSortArrow("domainRating")}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus:outline-none focus-ring-indigo" data-sort-key="firstSeen" tabindex="0">
                First Seen ${getSortArrow("firstSeen")}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${tableBodyHtml}
          </tbody>
        </table>
      `;

      document.getElementById("backlink-table-loading").classList.add("hidden");
      document
        .getElementById("backlink-table-container")
        .classList.remove("hidden");

      document.querySelectorAll("#backlink-table-container th[data-sort-key]").forEach(header => {
        header.addEventListener('click', (event) => {
          const sortKey = event.currentTarget.dataset.sortKey;
          if (appState.backlinkSort.key === sortKey) {
            appState.backlinkSort.order = appState.backlinkSort.order === 'asc' ? 'desc' : 'asc';
          } else {
            appState.backlinkSort.key = sortKey;
            appState.backlinkSort.order = 'desc'; // Default to desc for DR/FirstSeen
          }
          fetchBacklinks();
        });
      });

      document.getElementById("backlink-filter-status").addEventListener("change", (event) => {
        appState.backlinkFilterStatus = event.target.value;
        fetchBacklinks();
      });

    } catch (err) {
      console.error("Failed to fetch backlinks:", err);
      document.getElementById(
        "backlink-table-container"
      ).innerHTML = `<p class="text-red-500 p-4">Failed to load backlink data.</p>`;
      document.getElementById("backlink-table-loading").classList.add("hidden");
      document
        .getElementById("backlink-table-container")
        .classList.remove("hidden");
    }
  };

  fetchBacklinks();
  runInterval(fetchBacklinks, 60000, "backlink-analyzer");
};


const renderCompetitorAnalyzer = async (mainContentEl) => {
  clearChildren(mainContentEl);
  mainContentEl.innerHTML = `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Competitor Analysis for ${appState.currentDomain}</h1>

      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Competitors (${appState.currentDomain})</h2>
        <div id="competitor-table-loading" class="space-y-3">
          ${Array.from({ length: 3 })
            .map(
              (_, i) =>
                `<div key=${i} class="h-10 bg-gray-200 rounded w-full animate-pulse"></div>`
            )
            .join("")}
        </div>
        <div id="competitor-table-container" class="overflow-x-auto hidden"></div>
      </div>

      <div id="competitor-chart-section">
        ${renderChartCard(
          "Key Metric Comparison",
          "<div class='h-full w-full bg-gray-100 flex items-center justify-center text-gray-500 animate-pulse'>Loading comparison data...</div>"
        )}
      </div>

      <div class="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Content Gap Opportunities</h2>
        <p class="text-gray-700">
          Identify keywords your competitors rank for, but you don't.
        </p>
        <ul id="content-gap-list" class="list-disc list-inside text-gray-700 mt-4 space-y-2">
            <li class="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></li>
            <li class="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></li>
            <li class="h-6 bg-gray-200 rounded w-4/5 animate-pulse"></li>
        </ul>
        <button class="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus-ring-indigo">
          Generate Detailed Gap Report
        </button>
      </div>
    </div>
  `;

  const currentDomain = appState.currentDomain;
  const metrics = await mockSeoService.getDomainMetrics(currentDomain);
  const yourDomainDA = metrics?.domainAuthority || 0;
  const yourDomainOrganicKeywords = metrics?.organicKeywords || 0;
  const yourDomainOrganicTraffic = metrics?.organicTraffic || 0;

  const fetchCompetitors = async () => {
    try {
      document.getElementById("competitor-table-loading").classList.remove("hidden");
      document.getElementById("competitor-table-container").classList.add("hidden");

      const comps = await mockSeoService.getCompetitors(currentDomain);

      // Handle no data for the domain
      if (comps.length === 0 && !metrics) { // if no competitors and no metrics for your domain
        mainContentEl.innerHTML = `
          <div class="container mx-auto px-4 py-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Competitor Analysis for ${currentDomain}</h1>
            <p class="text-gray-600 text-lg">No competitor data available for "${currentDomain}".</p>
            <p class="text-gray-500 mt-2">Try "example.com" or "mydomain.com" for mock data.</p>
          </div>
        `;
        return;
      }

      const tableBodyHtml = comps
        .map(
          (comp) => `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${
            comp.domain
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
            comp.domainAuthority
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatNumber(
            comp.organicKeywords
          )}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatNumber(
            comp.organicTraffic
          )}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatNumber(
            comp.commonKeywords
          )}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatNumber(
            comp.gapKeywords
          )}</td>
        </tr>
      `
        )
        .join("");

      document.getElementById("competitor-table-container").innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competitor Domain
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DA
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organic Keywords
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organic Traffic
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Common Keywords
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content Gap Keywords
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${tableBodyHtml}
          </tbody>
        </table>
      `;
      document.getElementById("competitor-table-loading").classList.add("hidden");
      document
        .getElementById("competitor-table-container")
        .classList.remove("hidden");

      const allDA = [yourDomainDA, ...comps.map(c => c.domainAuthority)];
      const maxDA = Math.max(...allDA);

      const allOrganicKeywords = [yourDomainOrganicKeywords, ...comps.map(c => c.organicKeywords)];
      const maxOrganicKeywords = Math.max(...allOrganicKeywords);

      const allOrganicTraffic = [yourDomainOrganicTraffic, ...comps.map(c => c.organicTraffic)];
      const maxOrganicTraffic = Math.max(...allOrganicTraffic);


      const comparisonChartHtml = `
        <table class="min-w-full text-sm text-gray-700">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-2 px-2 text-left">Metric</th>
              <th class="py-2 px-2 text-left">Your Domain</th>
              ${comps.map((c) => `<th class="py-2 px-2 text-left">${c.domain}</th>`).join("")}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="py-1 px-2 font-medium">Domain Authority</td>
              <td class="py-1 px-2">
                <div class="flex items-center">
                  <div class="bg-indigo-300 h-4 rounded-sm mr-2" style="width: ${(yourDomainDA / maxDA) * 80}%;"></div>
                  <span>${yourDomainDA}</span>
                </div>
              </td>
              ${comps.map(c => `
                <td class="py-1 px-2">
                  <div class="flex items-center">
                    <div class="bg-blue-300 h-4 rounded-sm mr-2" style="width: ${(c.domainAuthority / maxDA) * 80}%;"></div>
                    <span>${c.domainAuthority}</span>
                  </div>
                </td>
              `).join('')}
            </tr>
            <tr>
              <td class="py-1 px-2 font-medium">Organic Keywords</td>
              <td class="py-1 px-2">
                <div class="flex items-center">
                  <div class="bg-indigo-300 h-4 rounded-sm mr-2" style="width: ${(yourDomainOrganicKeywords / maxOrganicKeywords) * 80}%;"></div>
                  <span>${formatNumber(yourDomainOrganicKeywords)}</span>
                </div>
              </td>
              ${comps.map(c => `
                <td class="py-1 px-2">
                  <div class="flex items-center">
                    <div class="bg-blue-300 h-4 rounded-sm mr-2" style="width: ${(c.organicKeywords / maxOrganicKeywords) * 80}%;"></div>
                    <span>${formatNumber(c.organicKeywords)}</span>
                  </div>
                </td>
              `).join('')}
            </tr>
            <tr>
              <td class="py-1 px-2 font-medium">Organic Traffic</td>
              <td class="py-1 px-2">
                <div class="flex items-center">
                  <div class="bg-indigo-300 h-4 rounded-sm mr-2" style="width: ${(yourDomainOrganicTraffic / maxOrganicTraffic) * 80}%;"></div>
                  <span>${formatNumber(yourDomainOrganicTraffic)}</span>
                </div>
              </td>
              ${comps.map(c => `
                <td class="py-1 px-2">
                  <div class="flex items-center">
                    <div class="bg-blue-300 h-4 rounded-sm mr-2" style="width: ${(c.organicTraffic / maxOrganicTraffic) * 80}%;"></div>
                    <span>${formatNumber(c.organicTraffic)}</span>
                  </div>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
        <p class="text-xs text-gray-400 mt-2">Simplified bar chart comparison.</p>
      `;
      document.querySelector("#competitor-chart-section > div.h-72").innerHTML =
        comparisonChartHtml;

      const contentGapListHtml = `
        <ul class="list-disc list-inside text-gray-700 mt-4 space-y-2">
          <li><strong>"Advanced SEO techniques"</strong> (CompetitorA, Search Vol: 5.5K, Diff: 72%)</li>
          <li><strong>"E-commerce SEO checklist"</strong> (CompetitorB, Search Vol: 8.2K, Diff: 68%)</li>
          <li><strong>"International SEO strategy"</strong> (CompetitorC, Search Vol: 4.1K, Diff: 75%)</li>
          <li><strong>"Voice search optimization"</strong> (CompetitorA, CompetitorB, Search Vol: 6.8K, Diff: 60%)</li>
          <li><strong>"Link building tactics 2024"</strong> (CompetitorC, Search Vol: 3.5K, Diff: 80%)</li>
        </ul>
      `;
      document.getElementById('content-gap-list').innerHTML = contentGapListHtml;

    } catch (err) {
      console.error("Failed to fetch competitors data:", err);
      document.getElementById(
        "competitor-table-container"
      ).innerHTML = `<p class="text-red-500 p-4">Failed to load competitor data.</p>`;
      document.getElementById("competitor-table-loading").classList.add("hidden");
      document
        .getElementById("competitor-table-container")
        .classList.remove("hidden");
    }
  };

  fetchCompetitors();
  runInterval(fetchCompetitors, 120000, "competitor-analyzer"); // Poll every 2 minutes
};

const renderSiteHealthAudit = async (mainContentEl) => {
  clearChildren(mainContentEl);
  mainContentEl.innerHTML = `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Site Health Audit for ${appState.currentDomain}</h1>

      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Overview for ${appState.currentDomain}</h2>
        <div id="health-table-loading" class="space-y-3">
          ${Array.from({ length: 3 })
            .map(
              (_, i) =>
                `<div key=${i} class="h-10 bg-gray-200 rounded w-full animate-pulse"></div>`
            )
            .join("")}
        </div>
        <div id="health-table-container" class="overflow-x-auto hidden"></div>
        <div class="mt-6 flex justify-end">
          <button id="run-audit-button" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus-ring-indigo" aria-label="Run full site audit now">
            Run Full Audit Now
          </button>
        </div>
        <p id="audit-status-message" class="text-sm text-gray-600 mt-3 text-right hidden"></p>
      </div>
    </div>
  `;

  const currentDomain = appState.currentDomain;

  const fetchHealthIssues = async () => {
    try {
      document.getElementById("health-table-loading").classList.remove("hidden");
      document.getElementById("health-table-container").classList.add("hidden");

      const issues = await mockSeoService.getSiteHealthIssues(currentDomain);

      // Handle no data for the domain
      if (issues.length === 0) {
        mainContentEl.innerHTML = `
          <div class="container mx-auto px-4 py-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Site Health Audit for ${currentDomain}</h1>
            <p class="text-gray-600 text-lg">No site health data available for "${currentDomain}".</p>
            <p class="text-gray-500 mt-2">Try "example.com" or "mydomain.com" for mock data.</p>
          </div>
        `;
        return;
      }

      const getSeverityColor = (severity) => {
        switch (severity) {
          case "critical":
            return "text-red-600 bg-red-100";
          case "high":
            return "text-orange-600 bg-orange-100";
          case "medium":
            return "text-yellow-600 bg-yellow-100";
          case "low":
            return "text-blue-600 bg-blue-100";
          default:
            return "text-gray-600 bg-gray-100";
        }
      };

      const getTypeColor = (type) => {
        switch (type) {
          case "error":
            return "text-red-500";
          case "warning":
            return "text-yellow-500";
          case "notice":
            return "text-blue-500";
          default:
            return "text-gray-500";
        }
      };

      const tableBodyHtml = issues
        .map(
          (issue) => `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <span class="${getTypeColor(issue.type)}">
              ${issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${
            issue.title
          }</td>
          <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">${
            issue.description
          }</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
              issue.severity
            )}">
              ${issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${
            issue.pagesAffected
          }</td>
        </tr>
      `
        )
        .join("");

      document.getElementById("health-table-container").innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pages Affected
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${tableBodyHtml}
          </tbody>
        </table>
      `;

      document.getElementById("health-table-loading").classList.add("hidden");
      document
        .getElementById("health-table-container")
        .classList.remove("hidden");
    } catch (err) {
      console.error("Failed to fetch site health issues:", err);
      document.getElementById(
        "health-table-container"
      ).innerHTML = `<p class="text-red-500 p-4">Failed to load site health data.</p>`;
      document.getElementById("health-table-loading").classList.add("hidden");
      document
        .getElementById("health-table-container")
        .classList.remove("hidden");
    }
  };

  fetchHealthIssues();

  document.getElementById("run-audit-button").addEventListener("click", () => {
    const auditButton = document.getElementById("run-audit-button");
    const statusMessage = document.getElementById("audit-status-message");

    auditButton.disabled = true;
    auditButton.textContent = "Auditing...";
    statusMessage.textContent = "Running full site audit...";
    statusMessage.classList.remove("hidden");

    setTimeout(() => {
      auditButton.disabled = false;
      auditButton.textContent = "Run Full Audit Now";
      statusMessage.textContent = "Audit Complete! (Data not changed in mock)";
      setTimeout(() => {
        statusMessage.classList.add("hidden");
        statusMessage.textContent = "";
      }, 3000); // Hide message after 3 seconds
    }, 2500); // Simulate audit taking 2.5 seconds
  });
};

const renderAlerts = async (mainContentEl) => {
  clearChildren(mainContentEl);
  mainContentEl.innerHTML = `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6" id="alerts-header">Real-time Alerts for ${appState.currentDomain}</h1>

      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div id="alerts-loading" class="space-y-4">
          ${Array.from({ length: 5 })
            .map(
              (_, i) =>
                `<div key=${i} class="h-16 bg-gray-200 rounded w-full animate-pulse"></div>`
            )
            .join("")}
        </div>
        <ul id="alerts-list" class="divide-y divide-gray-200 hidden"></ul>
      </div>
    </div>
  `;

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "rank_drop":
        return "text-red-500 bg-red-100";
      case "new_backlink":
        return "text-green-500 bg-green-100";
      case "lost_backlink":
        return "text-orange-500 bg-orange-100";
      case "site_health":
        return "text-blue-500 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "rank_drop":
        return `
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>`;
      case "new_backlink":
        return `
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101m-4.899.758a4 4 0 000 5.656l.707.707" />
        </svg>`;
      case "lost_backlink":
        return `
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`;
      case "site_health":
        return `
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 003 12c0 2.21.592 4.287 1.636 6.062C6.72 21.691 10.567 24 12 24s5.28-2.309 7.364-5.938C20.408 16.287 21 14.21 21 12a12.01 12.01 0 00-3-9.056z" />
        </svg>`;
      default:
        return "";
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await mockSeoService.markAlertAsRead(alertId, currentDomain); // Pass current domain
      // Re-fetch to update UI and global count
      fetchAlerts();
      updateGlobalAlertCount();
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  const handleAlertClick = (alert) => {
    if (!alert.isRead) {
      handleMarkAsRead(alert.id);
    }
    if (alert.link) {
      navigateTo(alert.link);
    }
  };

  const fetchAlerts = async () => {
    try {
      document.getElementById("alerts-loading").classList.remove("hidden");
      document.getElementById("alerts-list").classList.add("hidden");

      const alerts = await mockSeoService.getAlerts(currentDomain); // Pass current domain

      // Handle no data for the domain
      if (alerts.length === 0) {
        mainContentEl.innerHTML = `
          <div class="container mx-auto px-4 py-6 text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Real-time Alerts for ${currentDomain}</h1>
            <p class="text-gray-600 text-lg">No alerts available for "${currentDomain}".</p>
            <p class="text-gray-500 mt-2">Try "example.com" or "mydomain.com" for mock data.</p>
          </div>
        `;
        return;
      }

      const unreadAlertCount = alerts.filter((alert) => !alert.isRead).length;
      document.getElementById("alerts-header").innerHTML = `
        Real-time Alerts ${
          unreadAlertCount > 0
            ? `<span class="ml-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded-full" aria-live="polite">${unreadAlertCount} New</span>`
            : ""
        }
      `;

      if (alerts.length === 0) {
        document.getElementById(
          "alerts-list"
        ).innerHTML = `<p class="text-gray-500 py-4">No alerts at the moment.</p>`;
      } else {
        const alertsListHtml = alerts
          .map(
            (alert) => `
          <li
            id="alert-item-${alert.id}"
            data-alert-id="${alert.id}"
            class="py-4 px-3 flex items-start space-x-4 transition-colors duration-200 ${
              alert.isRead ? "opacity-70" : "bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
            } rounded-md"
            role="listitem"
            aria-label="Alert: ${alert.message} ${alert.isRead ? 'read' : 'unread'}"
            tabindex="${alert.isRead ? '-1' : '0'}"
          >
            <div class="flex-shrink-0 p-2 rounded-full ${getAlertTypeColor(
              alert.type
            )}">
              ${getAlertIcon(alert.type)}
            </div>
            <div class="flex-1">
              <p class="text-base ${
                alert.isRead ? "text-gray-500" : "text-gray-800 font-medium"
              }">
                ${alert.message}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                ${new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
            ${
              !alert.isRead
                ? `
              <button
                data-action="mark-read"
                data-alert-id="${alert.id}"
                class="flex-shrink-0 px-3 py-1 text-sm text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus-ring-indigo"
                aria-label="Mark alert as read"
              >
                Mark as Read
              </button>`
                : ""
            }
          </li>
        `
          )
          .join("");
        document.getElementById("alerts-list").innerHTML = alertsListHtml;

        document.querySelectorAll("#alerts-list li").forEach((listItem) => {
          if (!listItem.classList.contains("opacity-70")) { // Only add click for unread items
            listItem.addEventListener("click", (event) => {
              const alertId = listItem.dataset.alertId;
              const alert = alerts.find((a) => a.id === alertId);
              if (alert) {
                handleAlertClick(alert);
              }
            });
          }
          // Add click listener for "Mark as Read" button specifically
          const markReadButton = listItem.querySelector('[data-action="mark-read"]');
          if (markReadButton) {
            markReadButton.addEventListener("click", (event) => {
              event.stopPropagation(); // Prevent the parent <li> click from firing
              const alertId = markReadButton.dataset.alertId;
              handleMarkAsRead(alertId);
            });
          }
        });
      }

      document.getElementById("alerts-loading").classList.add("hidden");
      document.getElementById("alerts-list").classList.remove("hidden");
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      document.getElementById(
        "alerts-list"
      ).innerHTML = `<p class="text-red-500 p-4">Failed to load alerts.</p>`;
      document.getElementById("alerts-loading").classList.add("hidden");
      document.getElementById("alerts-list").classList.remove("hidden");
    }
  };

  fetchAlerts();
  runInterval(fetchAlerts, 10000, "alerts"); // Poll every 10 seconds for new alerts
};


// --- Layout Rendering ---

const renderSidebar = (parentEl) => {
  const sidebarHtml = `
    <div
      id="sidebar-backdrop"
      class="fixed inset-0 z-20 bg-black opacity-50 md:hidden ${
        appState.isSidebarOpen ? "" : "hidden"
      }"
      aria-hidden="${!appState.isSidebarOpen}"
    ></div>

    <div
      id="sidebar-content"
      class="fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white p-4 space-y-6 transform md:translate-x-0 ${
        appState.isSidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
      } transition-transform duration-300 md:relative md:flex md:flex-col md:mr-4"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div class="flex items-center justify-between px-2 py-4">
        <h1 class="text-2xl font-bold text-indigo-400">${APP_NAME}</h1>
        <button
          id="sidebar-toggle-close"
          class="md:hidden text-gray-400 hover:text-white focus:outline-none focus-ring-indigo"
          aria-label="Close sidebar"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav>
        ${NAVIGATION_ITEMS.map(
          (item) => `
          <a
            href="#${item.href}"
            class="flex items-center px-4 py-2 mt-2 rounded-md transition-colors duration-200 focus:outline-none focus-ring-indigo ${
              appState.currentPath === item.href ||
              (appState.currentPath === "/" && item.href === "/")
                ? "bg-indigo-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }"
            data-path="${item.href}"
            aria-current="${
              appState.currentPath === item.href ||
              (appState.currentPath === "/" && item.href === "/")
                ? "page"
                : "false"
            }"
          >
            ${item.icon}
            <span class="ml-3">${item.name}</span>
          </a>
        `
        ).join("")}
      </nav>
    </div>
  `;
  parentEl.innerHTML = sidebarHtml;

  document.getElementById("sidebar-backdrop").addEventListener("click", toggleSidebar);
  document.getElementById("sidebar-toggle-close").addEventListener("click", toggleSidebar);
  document.querySelectorAll("#sidebar-content a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default hash navigation
      const path = event.currentTarget.dataset.path;
      navigateTo(path);
      if (appState.isSidebarOpen) {
        toggleSidebar(); // Close sidebar on link click for mobile
      }
    });
  });
};

const renderHeader = (parentEl) => {
  const currentPage = NAVIGATION_ITEMS.find(
    (item) => item.href === appState.currentPath
  );
  const pageTitle = currentPage ? currentPage.name : "Dashboard";

  const headerHtml = `
    <header class="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10" role="banner">
      <div class="flex items-center">
        <button
          id="sidebar-toggle-open"
          class="text-gray-500 focus:outline-none focus:text-gray-900 md:hidden mr-4 focus-ring-indigo"
          aria-label="Open sidebar"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800">${pageTitle}</h2>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
            <input
                type="text"
                id="domain-input"
                placeholder="Enter domain (e.g., example.com)"
                value="${appState.currentDomain}"
                class="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-ring-indigo w-48 sm:w-64"
                aria-label="Current domain for analysis"
            />
            <button
                id="check-domain-button"
                class="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus-ring-indigo"
                aria-label="Check domain"
            >
                Check
            </button>
        </div>
        <button class="relative text-gray-500 hover:text-gray-700 focus:outline-none focus-ring-indigo" aria-label="${
          appState.unreadAlertCount > 0
            ? `${appState.unreadAlertCount} unread notifications`
            : 'Notifications'
        }">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          ${appState.unreadAlertCount > 0 ? `<span class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">${appState.unreadAlertCount}</span>` : ''}
        </button>
        <img
          class="h-8 w-8 rounded-full object-cover"
          src="https://picsum.photos/64/64"
          alt="User Avatar"
        />
      </div>
    </header>
  `;
  parentEl.innerHTML = headerHtml;
  document.getElementById("sidebar-toggle-open").addEventListener("click", toggleSidebar);

  const domainInput = document.getElementById('domain-input');
  const checkDomainButton = document.getElementById('check-domain-button');

  const updateDomain = () => {
    const newDomain = domainInput.value.trim().toLowerCase();
    if (newDomain && newDomain !== appState.currentDomain) {
      appState.currentDomain = newDomain;
      localStorage.setItem('seoIntelDomain', newDomain);
      router(); // Re-render the current page with the new domain
      updateGlobalAlertCount(); // Also update alerts for the new domain
    } else if (!newDomain) {
        // Optionally show an error or revert to default
        domainInput.value = appState.currentDomain; // Revert if empty
    }
  };

  domainInput.addEventListener('change', updateDomain); // On blur or enter key
  checkDomainButton.addEventListener('click', updateDomain);
};

const toggleSidebar = () => {
  appState.isSidebarOpen = !appState.isSidebarOpen;
  const sidebarContent = document.getElementById("sidebar-content");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  // const mainContentArea = document.getElementById("main-content-area"); // Not needed for toggle logic

  if (sidebarContent && sidebarBackdrop) {
    if (appState.isSidebarOpen) {
      sidebarContent.classList.remove("-translate-x-full", "ease-in");
      sidebarContent.classList.add("translate-x-0", "ease-out");
      sidebarBackdrop.classList.remove("hidden");
    } else {
      sidebarContent.classList.add("-translate-x-full", "ease-in");
      sidebarContent.classList.remove("translate-x-0", "ease-out");
      sidebarBackdrop.classList.add("hidden");
    }
    // Re-render header to update toggle button state if necessary (though not explicitly animated here)
    renderHeader(document.getElementById("header-container"));
  }
};

const renderLayout = () => {
  const appEl = document.getElementById("app");
  clearChildren(appEl); // Clear existing app content

  appEl.classList.add("flex", "h-screen", "bg-gray-100", "font-sans");

  // Sidebar container
  const sidebarContainer = createElement("div", [], { id: "sidebar-container" });
  appEl.appendChild(sidebarContainer);
  renderSidebar(sidebarContainer);

  // Main content area
  const mainContentArea = createElement(
    "div",
    ["flex-1", "flex", "flex-col", "overflow-hidden", "transition-all", "duration-300"],
    { id: "main-content-area" }
  );
  appEl.appendChild(mainContentArea);

  // Header container
  const headerContainer = createElement("div", [], { id: "header-container" });
  mainContentArea.appendChild(headerContainer);
  renderHeader(headerContainer); // Render header with potentially updated alert count

  // Main page content
  const mainPageContent = createElement(
    "main",
    ["flex-1", "overflow-x-hidden", "overflow-y-auto", "bg-gray-100", "p-4", "sm:p-6"],
    { id: "page-content" }
  );
  mainContentArea.appendChild(mainPageContent);

  return mainPageContent; // Return the element where page content will be rendered
};

// --- Router and App Initialization ---

const routes = {
  "/": renderDashboard,
  "/keywords": renderKeywordTracker,
  "/backlinks": renderBacklinkAnalyzer,
  "/competitors": renderCompetitorAnalyzer,
  "/health": renderSiteHealthAudit,
  "/alerts": renderAlerts,
};

const router = () => {
  const path = window.location.hash.replace("#", "") || "/";
  if (appState.currentPath !== path) {
    // Clear intervals associated with previous page when navigating
    clearComponentIntervals("dashboard");
    clearComponentIntervals("keyword-tracker");
    clearComponentIntervals("backlink-analyzer");
    clearComponentIntervals("competitor-analyzer");
    clearComponentIntervals("site-health-audit");
    clearComponentIntervals("alerts");
  }

  appState.currentPath = path;

  const mainContentEl = renderLayout(); // Re-render layout to update sidebar active state and header title

  const render = routes[path];
  if (render) {
    render(mainContentEl);
  } else {
    mainContentEl.innerHTML = '<div class="p-4 text-red-500">404: Page not found</div>';
  }
};

const navigateTo = (path) => {
  window.location.hash = path;
};

// Listen for hash changes
window.addEventListener("hashchange", router);

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  initGlobalAlertPolling(); // Start global alert polling
  router(); // Initial route rendering
});