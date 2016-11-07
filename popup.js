function clickHandler(e) {
    chrome.tabs.update({url: "https://google.com"});
    window.close(); 
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('google').addEventListener('click', clickHandler);
});
