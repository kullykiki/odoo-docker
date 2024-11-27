var host = "http://localhost:10017";


function getUrlParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name) ? urlParams.get(name) : null;
}