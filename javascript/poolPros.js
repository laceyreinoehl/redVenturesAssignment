$(function () {
    var emailFormTemplate = document.getElementById('emailFormTemplate');
    var filters = document.getElementById("filterSelects");
    filters.addEventListener('click', function(e) {
        if(e.target.className == 'filterCheckbox') {
            pageInit();
        }
    }, false);


    pageInit();

    /**
     * Collects the data from the JSON File and passes it to a function to render the boxes for the page
     */
    function pageInit() {
        loadJSON(function (response) {
            // Parse JSON string into object
            var container = "";
            var containers = "";
            var actual_JSON = JSON.parse(response);
            var dealers = actual_JSON.dealers.length

            var service = document.getElementById("service").checked;
            var installation = document.getElementById("installation").checked;
            var residential = document.getElementById("residential").checked;
            var commercial = document.getElementById("commercial").checked;

            for (var i = 0; i < dealers; i++) {
                if(service){
                    if(doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Service Pro")){
                        container = loadContainer(actual_JSON.dealers[i]);
                        containers += container;
                    }
                }
                if(installation){
                    if(doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Installation Pro")){
                        container = loadContainer(actual_JSON.dealers[i]);
                        containers += container;
                    }
                }
                if(residential){
                    if(doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Residential Pro")){
                        container = loadContainer(actual_JSON.dealers[i]);
                        containers += container;
                    }
                }
                if(commercial){
                    if(doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Commercial Pro")){
                        container = loadContainer(actual_JSON.dealers[i]);
                        containers += container;
                    }
                }
            }

            document.getElementById("dealersInZipCode").innerHTML = dealers + ' dealers in ' + actual_JSON.zipcode;
            pageContainer = document.getElementById('poolPros');
            pageContainer.innerHTML = containers;
        });
    }

    /**
     *
     * @param certifications
     * @param filter
     * @returns {boolean}
     */
    function doesDealerHaveCertification(certifications, filter){
        for (var i = 0, len = certifications.length; i < len; i++) {
            if(certifications[i] === filter){
                return true;
            }
        }
    }


    /**
     * Loads the JSON file to render the page
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
     * Takes in the JSON data about the dealer and "fills out" the boxes and returns them
     * @param dealerData
     * @returns {string}
     */
    function loadContainer(dealerData) {
        return container =
            "<div class = 'dealerDataContainer'>" +
                "<div class = 'dealerDataInnerContainer'>" +
                    "<div class = 'dealerNameContainer'>" +
                        "<h3>" + dealerData.data.name + "</h3>" +
                    "</div>" +
                    "<hr/>" +
                    "<div class='contactPhone'>" +
                        "<img src = 'assets/images/phone-icon-desktop.png'/>" +
                        "<h3 style = 'display: none;'>Tap to call</h3>" +
                        "<h2>" + dealerData.data.phone1.replace(/-/g, ".")   + "</h2>" +
                    "</div>" +
                    "<div>" +
                        "<p><it>Can't talk now? Click below to send an email.</it></p>" +
                    "</div>" +
                        "<div class = 'contactThisPro'>" +
                            "<a href = '#' onclick='openDialog(emailFormTemplate,\"" + dealerData.data.name + "\");'>" +
                                "<img src = 'assets/images/email-icon.png'/> Contact This Pro" +
                            "</a>" +
                        "</div>" +
                    "<div>" +
                        "<p><strong>Business Hours</strong></p>" +
                        "<p>Weekdays " + dealerData.data.weekHours.mon + "</p>" +  //TODO:Check to make sure week hours are actually the same M-F
                        "<p>Saturdays " + ((dealerData.data.weekHours.sat) !== '' ? (dealerData.data.weekHours.sat) : " - CLOSED") + "</p>" +
                        "<p>Sundays " + dealerData.data.weekHours.sun + "</p>" +
                    "</div>" +
                "</div>" +
                "<div class = 'dealerCertifications'>" +
                    loadCertifications(dealerData.data.certifications) +
                "</div>" +
            "</div>";
    }

    /**
     *
     * @param dealerDataCertifications
     * @returns {string}
     */
    function loadCertifications(dealerDataCertifications) {
        var certifications = {
            "Installation Pro": "star-installation-pro.png",
            "Commercial Pro": "users-commercial-pro.png",
            "Residential Pro": "home-residential-pro.png",
            "Service Pro": "gear-service-pro.png"
        };
        var certificationsContainer = "";
        for (var i = 0, len = dealerDataCertifications.length; i < len; i++) {
            certificationsContainer +=
                "<div class='dealerCertificationContainer'>" +
                    "<span>" +
                        "<img src='assets/images/" + certifications[dealerDataCertifications[i]] + "' alt='" + dealerDataCertifications[i] + "'/>" +
                        "&nbsp;" + dealerDataCertifications[i] +
                    "</span>" +
                "</div>";
        }
        return certificationsContainer;
    }
});

/**
 *
 */
function displayTooltip(){
    debugger;
}

/**
 *
 */
function openDialog(emailFormTemplate, dealerName) {
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onOpen: function () {
            modal.setContent(emailFormTemplate.innerHTML);
            modal.setFooterContent('<p>*Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus iaculis fermentum ex, ' +
                'eget bibendum tellus luctus a. Integer orci lectus, ultricies ac lectus at, tempor mattis felis.</p>');

            /*Setting form data to display and to know who to email*/
            document.getElementById('dealerNameContainer').innerHTML = dealerName;

            /*Adding event listeners to form inputs that require validation and form submission event handlers */
            addFormEventHandlers();
        },
        onClose: function () {
            console.log('modal closed');
        },
        beforeClose: function () {
            return true; // close the modal
        }
    });

    modal.open();


}

/**
 *
 */
function sendEmail(){
    if(!validateFirstAndLast()){
        return false;
        //TODO: display error message if invalid form
    }
    if(!validatePhone()){
        return false;
        //TODO: display error message if invalid form
    }
    if(!validateEmail()){
        return false;
        //TODO: display error message if invalid form
    }
    //TODO: Display success message if email sent

}

/**
 *
 */
function addFormEventHandlers(){
    var name = document.getElementById("firstAndLast");
    var phone = document.getElementById("phoneNumber");
    var email = document.getElementById("email");

    name.addEventListener("change", function(){
        if(validateFirstAndLast()){
            document.getElementById("firstAndLastValidationIndicator").src="assets/images/checkmark-circle.png";
        } else{
            document.getElementById("firstAndLastValidationIndicator").src="assets/images/circle-form.png";

        }
    });

    phone.addEventListener("change", function(){
        if(validatePhone()){
            document.getElementById("phoneNumberValidationIndicator").src="assets/images/checkmark-circle.png";
        } else{
            document.getElementById("phoneNumberValidationIndicator").src="assets/images/circle-form.png";

        }
    });

    email.addEventListener("change", function(){
        if(validateEmail()){
            document.getElementById("emailAddressValidationIndicator").src="assets/images/checkmark-circle.png";
        } else{
            document.getElementById("emailAddressValidationIndicator").src="assets/images/circle-form.png";

        }
    });

    var form_el = document.getElementById("sendEmailForm");
    form_el.addEventListener("submit", function(evt) {
        evt.preventDefault();
        sendEmail();
    });
}

/**
 *
 * @returns {Array|{index: number, input: string}}
 */
function validateFirstAndLast(){
    var nameRE = /^$|^[a-zA-Z]+ [a-zA-Z]+$/
    var name = document.getElementById("firstAndLast").value;
    return name.match(nameRE);

}

/**
 *
 * @returns {Array|{index: number, input: string}}
 */
function validatePhone(){
    var phoneRE = /^\(\d\d\d\) \d\d\d-\d\d\d\d$/;
    var phone = document.getElementById("phoneNumber").value;
    return phone.match(phoneRE);
}

/**
 *
 * @returns {Array|{index: number, input: string}}
 */
function validateEmail(){
    var emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = document.getElementById("email").value;
    return email.match(emailRE);
}

