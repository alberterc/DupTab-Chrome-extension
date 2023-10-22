function getAllTabsList() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const tabListTitle = document.getElementById('tabListContainer');
        const dupTabListTitle = document.getElementById('duplicateTabListContainer');
        let urlTabs = getDuplicateTabsUrls(tabs).map((url) => {
            return { url: url }
        });
        renderTabsList(tabs, tabListTitle);
        renderTabsList(urlTabs, dupTabListTitle);
    });
}

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

function renderTabsList(tabs, element) {
    const ul = document.createElement('ul');
    let tabsLength = tabs.length;
    for (let i = 0; i < tabsLength; i++) {
        const li = document.createElement('li');
        li.innerHTML = tabs[i].url;
        ul.appendChild(li);
    }
    element.appendChild(ul);
}

document.addEventListener('DOMContentLoaded', function() {
    const refreshListBtn = document.getElementById('refreshTabListBtn');
    refreshListBtn.addEventListener('click', getAllTabsList);
})