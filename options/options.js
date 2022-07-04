function save_options() {
    let mapsTargetRadioChecked = document.querySelector('input[name="maps_target"]:checked');
    let target = '';
    if (mapsTargetRadioChecked) {
        target = mapsTargetRadioChecked.value;
    }

    chrome.storage.sync.set({mapTarget: target});
}

function restore_options() {
    chrome.storage.sync.get({mapTarget: ''}, function (options) {
        document.querySelector('input[name="maps_target"][value="' + options.mapTarget + '"]').checked = true;
    });
}

document.querySelector('html').setAttribute('lang', chrome.i18n.getMessage('@@ui_locale'));
document.querySelector('title').innerText = chrome.i18n.getMessage('optionsTitle');
document.getElementById('maps_target_tile').innerHTML = chrome.i18n.getMessage('optionsMapTarget');
document.getElementById('the_same_label').innerHTML = chrome.i18n.getMessage('optionsMapTargetSameTab');
document.getElementById('new_one_label').innerHTML = chrome.i18n.getMessage('optionsMapTargetNewTab');

document.getElementById('save').innerHTML = chrome.i18n.getMessage('saveButton');

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);