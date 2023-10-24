var browser = browser || chrome;
var openedTabs = [];

browser.tabs.onHighlighted.addListener(handleHighlighted);
function handleHighlighted(highlightInfo) {
    console.log(highlightInfo);
}

browser.tabs.query({ currentWindow: true }, (tabs) => {
    openedTabs = tabs;
    let duplicateTabsIds = getDuplicateTabsIds(tabs);
    let duplicateTabsIdsLength = duplicateTabsIds.length;
    // for (let i = 0; i < duplicateTabsIdsLength; i++) {
    //     browser.tabs.update(
    //         duplicateTabsIds[i],
    //         {
    //             active: false,
    //             highlighted: true
    //         }
    //     )
    // }
});

function getDuplicateTabsUrls(tabs) {
    const tabsUrlCount = tabs.map((tab) => {
        return { count: 1, tab: tab };
    }).reduce((result, b) => {
        result[b.tab.url] = (result[b.tab.url] || 0) + b.count;
        return result;
    }, {});
    const duplicateUrls = Object.keys(tabsUrlCount).filter((a) => tabsUrlCount[a] > 1);

    return duplicateUrls;
}

function getDuplicateTabsIds(tabs) {
    const duplicateUrls = getDuplicateTabsUrls(tabs);
    let tabsLength = tabs.length;
    let duplicateUrlsLength = duplicateUrls.length;
    let duplicateTabsId = [];
    for (let i = 0; i < tabsLength; i++) {
        for (let j = 0; j < duplicateUrlsLength; j++) {
            if (tabs[i].url === duplicateUrls[j]) {
                duplicateTabsId.push(tabs[i].id);
            }
        }
    }
    return duplicateTabsId;
}