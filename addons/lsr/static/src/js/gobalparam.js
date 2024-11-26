var host = "http://localhost:8069";


function getUrlParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name) ? urlParams.get(name) : null;
}