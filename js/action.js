chrome.runtime.onInstalled.addListener(() => {
    let popup_page = chrome.i18n.getMessage("popupPage");
    chrome.action.setPopup({popup: popup_page});
});