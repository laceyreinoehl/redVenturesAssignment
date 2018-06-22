init();


/**
 *
 * @param callback
 */
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'dealers.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/**
 *
 */
function init() {
    loadJSON(function(response) {
        // Parse JSON string into object
        var container = "";
        var containers = "";
        var actual_JSON = JSON.parse(response);
        for(var i = 0, len = actual_JSON.dealers.length; i < len; i++){
            container = loadContainer(actual_JSON.dealers[i]);
            containers += container;
        }
        pageContainer = document.getElementById('poolPros');
        pageContainer.innerHTML = containers;

    });
}

/**
 *
 * @param dealerData
 * @returns {string}
 */
function loadContainer(dealerData){
    var container =
    "<div class = 'dealerDataContainer'>"+
        "<div class = 'dealerDataInnerContainer'>" +
        "<div>" +
            "<h3>" + dealerData.data.name + "</h3>" +
            "<hr/>" +
        "</div>" +
        "<div>" +
            "<img src = 'RV-Pool-Pro-Assets/RV-Pool-Pro-Assets/phone-icon-desktop.png'/>" +
            "<span>" + dealerData.data.phone1  +"</span>" +
        "</div>" +
        "<div>" +
            "<p><it>Can't talk now? Click below to send an email.</it></p>" +
        "</div>" +
        "<div>" +
            "<span class = 'contactThisPro'><a href = 'mailto:" + dealerData.data.email + "'>Contact This Pro</a></span>" +
        "</div>" +
        "<div>" +
            "<p><strong>Business Hours</strong></p>" +
            "<p>Weekdays " + dealerData.data.weekHours.mon +"</p>" +  //TODO:Check to make sure week hours are actually the same M-F
            "<p>Saturdays " + ((dealerData.data.weekHours.sat) !== '' ? (dealerData.data.weekHours.sat) : " - CLOSED") +"</p>" +
            "<p>Sundays " + dealerData.data.weekHours.sun +"</p>" +
        "</div>" +
        "<div class = 'dealerCertifications'>" +
            loadCertifications(dealerData.data.certifications) +
        "</div>" +
        "</div>" +
    "</div>";
    return container;
}

/**
 *
 * @param dealerDataCertifications
 * @returns {string}
 */
function loadCertifications(dealerDataCertifications){
    var certificationsContainer = "";
    for(var i = 0, len = dealerDataCertifications.length; i < len; i++){
        certificationsContainer +=
            "<span>" +
                dealerDataCertifications[i];
            "<span>";
    }
    return certificationsContainer;
}