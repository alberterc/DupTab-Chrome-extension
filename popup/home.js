var browser = browser || chrome;

document.addEventListener('DOMContentLoaded', function() {
    let currTab = [];
    let allTab = [];
    getCurrentTab().then(function(tab) {
        currTab = tab;
    });
    getAllTab().then(function(tabs) {
        allTab = tabs;
    });

    const $highlightAllDupTabBtn = document.getElementById('highlightAllDupTabBtn');
    const $groupAllDupTabBtn = document.getElementById('groupAllDupTabBtn');
    
    $highlightAllDupTabBtn.addEventListener('click', function() {
        let duplicateTabIdsWithCurr = getDuplicateTabIdsWithCurr(currTab, allTab);
        highlightAllDupTab(duplicateTabIdsWithCurr);
    });
    $groupAllDupTabBtn.addEventListener('click', function() {
        let duplicateTabIdsWithCurr = getDuplicateTabIdsWithCurr(currTab, allTab);
        groupAllDupTabBtn(duplicateTabIdsWithCurr);
    });
})

function onError(error) {
    console.log(`Error: ${error}`);
}

function highlightAllDupTab(duplicateTabIdsWithCurr) {
    let duplicateTabIdsWithCurrLength = duplicateTabIdsWithCurr.length;
    for (let i = 0; i < duplicateTabIdsWithCurrLength; i++) {
        browser.tabs.update(
            duplicateTabIdsWithCurr[i],
            {
                active: false,
                highlighted: true
            }
        )
    }
}

function groupAllDupTabBtn(duplicateTabIdsWithCurr) {
    if (duplicateTabIdsWithCurr.length > 0) {
        browser.tabs.group(
            {
                tabIds: duplicateTabIdsWithCurr
            }
        )
    }
}

function getDuplicateTabIdsWithCurr(currTab, allTab) {
    let duplicateUrls = getDuplicateTabsUrls(allTab);
    let duplicateTabIds = getDuplicateTabIds(allTab, duplicateUrls);
    let duplicateTabIdsLength = duplicateTabIds.length;
    let duplicateTabIdsWithCurr = [];
    for (let i = 0; i < duplicateTabIdsLength; i++) {
        if (duplicateUrls.indexOf(currTab[0].url) > -1) {
            duplicateTabIdsWithCurr.push(duplicateTabIds[i]);
        }
    }
    return duplicateTabIdsWithCurr;
}

function getDuplicateTabsUrls(tabs) {
    let tabsUrlCount = tabs.map((tab) => {
        return { count: 1, tab: tab };
    }).reduce((result, b) => {
        result[b.tab.url] = (result[b.tab.url] || 0) + b.count;
        return result;
    }, {}); 
    let duplicateUrls = Object.keys(tabsUrlCount).filter((a) => tabsUrlCount[a] > 1);
    return duplicateUrls;
}

function getDuplicateTabIds(tabs, duplicateUrls) {
    let tabsLength = tabs.length;
    let duplicateUrlsLength = duplicateUrls.length;
    let duplicateTabIds = [];
    for (let i = 0; i < tabsLength; i++) {
        for (let j = 0; j < duplicateUrlsLength; j++) {
            if (tabs[i].url === duplicateUrls[j]) {
                duplicateTabIds.push(tabs[i].id);
            }
        }
    }
    return duplicateTabIds;
}

function getCurrentTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

function getAllTab() {
    return browser.tabs.query({currentWindow: true});
}