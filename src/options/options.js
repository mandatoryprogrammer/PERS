var storageArea = chrome.storage.sync || chrome.storage.local;
var checkDanglingCheckbox = document.getElementById('checkdangling');
checkDanglingCheckbox.onchange = function() {
    storageArea.set({
        checkDanglingPolicy: checkDanglingCheckbox.checked ? true : false,
    });
};
storageArea.get({
    checkDanglingPolicy: false,
}, function(items) {
    checkDanglingCheckbox.checked = items.checkDanglingPolicy === true;
});