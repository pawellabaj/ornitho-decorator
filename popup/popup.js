document.querySelector('html').setAttribute('lang', chrome.i18n.getMessage('@@ui_locale'));
document.querySelector('title').innerText = chrome.i18n.getMessage('extensionTitle');
document.getElementById('title').innerText = chrome.i18n.getMessage('extensionTitle');
document.getElementById('description_1').innerHTML = chrome.i18n.getMessage('popupParagraph1');
document.getElementById('description_2').innerHTML = chrome.i18n.getMessage('popupParagraph2', ['20°01\'37.37\'\' E / 50°03\'15.18\'\' N', '50.05421666666666 , 20.027047222222222']);
document.getElementById('description_3').innerHTML = chrome.i18n.getMessage('popupParagraph3');

document.getElementById('options').innerHTML = chrome.i18n.getMessage('optionsButton');

document.getElementById('options').addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options/options.html'));
    }
});