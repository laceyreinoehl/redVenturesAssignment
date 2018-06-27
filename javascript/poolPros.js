var filters = document.getElementById("filterSelects");
filters.addEventListener('click', function (e) {
    if (e.target.className === 'filterCheckbox') {
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
            var showContainer = true;

            if (service) {
                if (!doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Service Pro")) {
                    showContainer = false;
                }
            }
            if (installation) {
                if (!doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Installation Pro")) {
                    showContainer = false;
                }
            }
            if (residential) {
                if (!doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Residential Pro")) {
                    showContainer = false;
                }
            }
            if (commercial) {
                if (!doesDealerHaveCertification(actual_JSON.dealers[i].data.certifications, "Commercial Pro")) {
                    showContainer = false;
                }
            }

            if (showContainer) {
                container = loadContainer(actual_JSON.dealers[i]);
                containers += container;
            }
        }

        document.getElementById("dealersInZipCode").innerHTML = dealers + ' dealers in ' + actual_JSON.zipcode;
        pageContainer = document.getElementById('poolPros');
        pageContainer.innerHTML = containers;
    });
}

/**
 * Checks the JSON data to see if the dealer has a certain certificate
 * @param certifications
 * @param filter
 * @returns {boolean}
 */
function doesDealerHaveCertification(certifications, filter) {
    for (var i = 0, len = certifications.length; i < len; i++) {
        if (certifications[i] === filter) {
            return true;
        }
    }
    return false;
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
                    "<h2>" + dealerData.data.phone1.replace(/-/g, ".") + "</h2>" +
                "</div>" +
                "<div>" +
                    "<p><it>Can't talk now? Click below to send an email.</it></p>" +
                "</div>" +
                "<div class = 'contactThisPro'>" +
                    "<a href = '#' onclick='openDialog(\"" + dealerData.data.name + "\");'>" +
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

/**
 * Opens the dialog that allows the user to send an email to the Pool Pro
 */
function openDialog(dealerName) {
    var content = 
    "<div>" +
        "<div class = 'modalFormHeader'>" +
            "<div>" +
                "<span>EMAIL</span>" +
                "<h1>Premium Pools &amp; Spas of Charlotte</h1>" +
            "</div>" +
        "</div> " +
        "<p>Fill out the form below and <span id = 'dealerNameContainer'></span> will get in touch</p>" +
        "<div class = 'innerEmailForm'>" +
            "<form id = 'sendEmailForm' method = 'POST'>" +
                "<div class = 'formLabelContainer'>" +
                    "<label>First and last name</label>" +
                    "<img src = 'assets/images/circle-form.png' alt = 'circle form' id = 'firstAndLastValidationIndicator'/>" +
                "</div>" +
                "<div class = 'formInputContainer'>" +
                    "<input type = 'text' name = 'firstAndLast' id = 'firstAndLast' required/>" +
                "</div>" +
                "<div class = 'formLabelContainer'>" +
                    "<label>Phone number</label>" +
                    "<img src = 'assets/images/circle-form.png' alt = 'circle form' id = 'phoneNumberValidationIndicator'/>" +
                "</div>" +
                "<div class = 'formInputContainer'>" +
                    "<input type = 'text' name = 'phoneNumber' id = 'phoneNumber' required/> " +
                "</div>" +
                "<div class = 'formLabelContainer'>" +
                    "<label>Email address</label>" +
                    "<img src = 'assets/images/circle-form.png' alt = 'circle form' id = 'emailAddressValidationIndicator'/>"  +
                "</div>" +
                "<div class = 'formInputContainer'>" +
                    "<input type = 'email' name = 'email' id = 'email' required/>" +
                "</div>" +
                "<div class = 'formLabelContainer'>" +
                    "<label>Comments or questions</label>" +
                    "<span class = 'optional'>Optional</span>" +
                "</div>" +
                "<div class = 'formInputContainer'>" +
                    "<textarea name = 'commentsOrQuestions'></textarea>" +
                "</div>" +
                "<div class = 'formLabelContainer'>" +
                    "<span>Do you currently own a pool or spa?</span>" +
                    "<span class = 'optional'>Optional</span>" +
                "</div>" +
                "<div class = 'formInputContainer'>" +
                "<div class='switchField'>" +
                    "<input type='radio' id='switchLeft' name='isPoolOwner' value='yes' checked/>" +
                    "<label for='switchLeft'>Yes</label>" +
                    "<input type='radio' id='switchRight' name='isPoolOwner' value='no' />" +
                    "<label for='switchRight'>No</label>" +
                "</div>" +
                "<hr/>" +
                "<div class = 'formSubmitButtonContainer'>" +
                    "<button type = 'submit'></button>" +
                "</div>" +
            "</form>" +
        "</div>" +
    "</div>";

    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onOpen: function () {
            modal.setContent(content);
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
 * Validates the form fields and then send the email
 */
function sendEmail() {
    if (!validateFirstAndLast()) {
        return false;
        //TODO: display error message if invalid form
    }
    if (!validatePhone()) {
        return false;
        //TODO: display error message if invalid form
    }
    if (!validateEmail()) {
        return false;
        //TODO: display error message if invalid form
    }
    //TODO:Send email and  display success message if email sent

}

/**
 * Adds event listeners to the email form input fields for validation
 */
function addFormEventHandlers() {
    var name = document.getElementById("firstAndLast");
    var phone = document.getElementById("phoneNumber");
    var email = document.getElementById("email");

    name.addEventListener("change", function () {
        if (validateFirstAndLast()) {
            document.getElementById("firstAndLastValidationIndicator").src = "assets/images/checkmark-circle.png";
        } else {
            document.getElementById("firstAndLastValidationIndicator").src = "assets/images/circle-form.png";

        }
    });

    phone.addEventListener("change", function () {
        if (validatePhone()) {
            document.getElementById("phoneNumberValidationIndicator").src = "assets/images/checkmark-circle.png";
        } else {
            document.getElementById("phoneNumberValidationIndicator").src = "assets/images/circle-form.png";

        }
    });

    email.addEventListener("change", function () {
        if (validateEmail()) {
            document.getElementById("emailAddressValidationIndicator").src = "assets/images/checkmark-circle.png";
        } else {
            document.getElementById("emailAddressValidationIndicator").src = "assets/images/circle-form.png";

        }
    });

    var form_el = document.getElementById("sendEmailForm");
    form_el.addEventListener("submit", function (evt) {
        evt.preventDefault();
        sendEmail();
    });
}

/**
 * Show/Hides the filter options when they are in a drop down menu
 */
function toggleFilters() {
    var filter = document.getElementById("filterSelects");
    var display = (window.getComputedStyle ? getComputedStyle(filter, null) : filter.currentStyle).display;
    if(display == 'none'){
        filter.style.display = 'inline';
    } else{
        filter.style.display = 'none';
    }
}

/**
 * Validates the input field for first and last name. Looks for two strings of any length with a space in between
 * @returns {Array|{index: number, input: string}}
 */
function validateFirstAndLast() {
    var nameRE = /^$|^[a-zA-Z]+ [a-zA-Z]+$/
    var name = document.getElementById("firstAndLast").value;
    return name.match(nameRE);

}

/**
 * Validates the input field for the phone number. Looks for a phone number formatted like (xxx) xxx-xxxx
 * @returns {Array|{index: number, input: string}}
 */
function validatePhone() {
    var phoneRE = /^\(\d\d\d\) \d\d\d-\d\d\d\d$/;
    var phone = document.getElementById("phoneNumber").value;
    return phone.match(phoneRE);
}

/**
 * Validates the input field for the email address. Looks for an @ symbol and a .xxx
 * @returns {Array|{index: number, input: string}}
 */
function validateEmail() {
    var emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = document.getElementById("email").value;
    return email.match(emailRE);
}



