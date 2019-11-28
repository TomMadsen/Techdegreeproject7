const timeZones = [
    { "label": "(GMT-10:00) Hawaii", "value": "Pacific/Honolulu" },
    { "label": "(GMT-09:00) Alaska", "value": "US/Alaska" },
    { "label": "(GMT-08:00) Pacific US & Canada", "value": "America/Los_Angeles" },
    { "label": "(GMT-06:00) Central US & Canada", "value": "US/Central" },
    { "label": "(GMT-05:00) Eastern US & Canada", "value": "US/Eastern" },
    { "label": "(GMT-03:00) Buenos Aires", "value": "America/Argentina/Buenos_Aires" },
    { "label": "(GMT+00:00) GMT : London", "value": "Etc/Greenwich" },
    { "label": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "value": "Europe/Amsterdam" },
    { "label": "(GMT+02:00) Athens, Bucharest, Istanbul", "value": "Europe/Athens" },
    { "label": "(GMT+03:00) Moscow, St. Petersburg, Volgograd", "value": "Europe/Moscow" },
    { "label": "(GMT+05:45) Kathmandu, Nepal", "value": "Asia/Katmandu" },
    { "label": "(GMT+07:00) Bangkok, Hanoi, Jakarta", "value": "Asia/Bangkok" },
    { "label": "(GMT+08:00) Kuala Lumpur, Singapore", "value": "Asia/Kuala_Lumpur" },   
    { "label": "(GMT+10:00) Brisbane, Sydney, Melbourne", "value": "Australia/Brisbane" },
    { "label": "(GMT+12:00) Auckland, Wellington", "value": "Pacific/Auckland" },
];
let select = document.querySelector("#timeZoneList")
function createOptions(array, selectElement, placeHolder) {
    let title = `<option value="" selected disabled hidden>${placeHolder}</option>`;
    selectElement.innerHTML = title;
    // selectElement.required;
    for (let i = 0; i < array.length; i++) {
        let arr = array[i];
        let option = document.createElement("option");
        option.value = arr.value;
        option.innerText = arr.label;
        selectElement.appendChild(option);
    }
}

createOptions(timeZones, select, "Select Timezone");