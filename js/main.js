'use strict';

let alertBox = document.querySelector('.alert');
let charts = document.querySelector('.charts');
let userProfile = document.querySelector('.user-profile')
let loginButton = document.querySelector('.user-profile span');
let searchBox = document.querySelector('#user-search');
let messageBox = document.querySelector('#user-message');
let sendButton = document.querySelector('.send-button');
let membersList = document.querySelector('.member-list');
let recentList = document.querySelector('.recent-list');
let notification = document.getElementById('notification');
let noticeDiv = document.createElement('div');
let trafficList = document.querySelector('.traffic-list');
let loggedUser = {};
loggedUser.viewedNotices = false;

// Get a random for the top user profile and extra members to search for...
fetch('https://randomuser.me/api/?results=15')
    .then(response => {
        return response.json()
    })
    .then(data => {
        localStorage.setItem('randomUsers', JSON.stringify(data.results)); // Work with JSON data here
    })
    .catch(err => {
            console.log('Fetch Error :-S', err);
    });

let randomUsers = JSON.parse(localStorage.getItem('randomUsers'));  //turning our saved string to a usable object
const members = [{
        name: {
            first: 'Victoria',
            last: 'Chambers'
        },
        email: 'victoria.chambers80@example.com',
        spec: {
            method: "commented on",
            medium: "YourApp's SEO Tips",
            time: "4 hours ago"
        },
        picture: {
            thumbnail: "images/member-1.jpg"
        },
        joindate: "09/30/2019"
    },
    {
        name: {
            first: 'Dale',
            last: 'Byrd'
        },
        email: 'dale.byrd52@example.com',
        spec: {
            method: "liked the post",
            medium: "Facebook's changes for 2016",
            time: "5 hours ago"
        },
        picture: {
            thumbnail: "images/member-2.jpg"
        },
        joindate: "11/05/2015"
    },
    {
        name: {
            first: 'Dawn',
            last: 'Wood'
        },
        email: 'dawn.wood16@example.com',
        spec: {
            method: "commented on",
            medium: "Facebook's changes for 2016",
            time: "5 hours ago"
        },
        picture: {
            thumbnail: "images/member-3.jpg"
        },
        joindate: "01/26/1901"
    },
    {
        name: {
            first: 'Dan',
            last: 'Oliver'
        },
        email: 'dan.oliver52@example.com',
        spec: {
            method: "posted to",
            medium: "YourApp's SEO Tips",
            time: "1 day ago"
        },
        picture: {
            thumbnail: "images/member-4.jpg"
        },
        joindate: "04/25/1939"
    }
];

let userList = members.concat(randomUsers);
try {
    for (let i = 0; i < userList.length; i++) {
        let user = userList[i];
        user.name.full = user.name.first + " " + user.name.last;
        user.name.bridged = user.name.first + user.name.last;
    }
} catch (e) {
    console.log(e);
    alert("error loading member database, please refresh your browser"); // If we got an error we handle it
} 

//functions to create(login) user and remove user...
let createUser = (node) =>{
    node.innerHTML = `
    <img title="Click to Logout" src="${randomUsers[0].picture.thumbnail}" alt="user image" />
    <h6 title="Click to Logout">${randomUsers[0].name.first} ${randomUsers[0].name.last}</h6>
    `;
    localStorage.currentUser = JSON.stringify(randomUsers.shift());
    loggedUser = JSON.parse(localStorage.currentUser);
    loggedUser.loggedIn = true;
    loggedUser.memSettings = {};
    notification.className = 'active';
    loggedUser.viewedNotices = false;
    catchSettings();
    activateNotifications();
    autocomplete(searchBox, userList);
} 

let resetUser = (node) => {
    loggedUser = JSON.parse(localStorage.currentUser);
    loggedUser.loggedIn = true;
    if (!loggedUser.viewedNotices){
        notification.className = 'active';
    } else {
        notification.className = '';
    }
    node.innerHTML = `
    <img title="Click to Logout" src="${loggedUser.picture.thumbnail}" alt="user image" />
    <h6 title="Click to Logout">${loggedUser.name.first} ${loggedUser.name.last}</h6>
    `;
    restoreSettings();
    catchSettings();
    autocomplete(searchBox, userList);
}

let removeUser = (node) =>{
    node.innerHTML = "<span style='cursor: pointer;'>LOGIN</span>";
    localStorage.removeItem("currentUser");
    localStorage.removeItem("randomUsers");
    loggedUser = {};
    notification.className = "";
}

//ensure local storage works
function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        alert('this page requires localstorage enabled');
        return false;
    }
}

let createAlert = (parentElement, jabba) => {
    let alert = document.createElement('div');
    let alertHeading = document.createElement('h4');
    let alertMessage = document.createElement('p');
    let closeButton = document.createElement('button');
    alert.className = 'alert-message';
    alertHeading.innerHTML = '<strong>Alert</strong>';
    alert.appendChild(alertHeading);
    alertMessage.textContent = jabba;
    alert.appendChild(alertMessage);
    closeButton.innerHTML = '<strong>X</strong>';
    closeButton.className = 'closeButton';
    alert.appendChild(closeButton);
    closeButton.addEventListener('click', function(e){
        parentElement.removeChild(alert);
        });
    parentElement.appendChild(alert);
};

createAlert(alertBox, 'Failed to load database server.  You are currently viewing the most recent data held by your local server');
//default canvas.
let TrafficCanvas = document.getElementById('traffic-chart')
let trafficChart = new Chart(TrafficCanvas, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: [10000, 11400, 10700, 13050, 14500, 11750, 11250, 12850, 12250, 10500, 12500, 13400],
            backgroundColor: 'rgba(102, 102, 153, .5)',
            borderColor: '#669',
            lineTension: 0,
        }],
    },
    options: {
        aspectRatio: 2.5,
        animation: {
            duration: 0
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false
        },
        responsive: true,
    }
})

trafficList.addEventListener('click', function(e){
    let hrBtn = document.querySelector('#hrButton');
    let dyBtn = document.querySelector('#dyButton');
    let wkBtn = document.querySelector('#wkButton');
    let mthBtn = document.querySelector('#mthButton');
    switch (e.target){
        case hrBtn:
            hrBtn.classList.toggle('selected', true);
            dyBtn.classList.toggle('selected', false);
            wkBtn.classList.toggle('selected', false);
            mthBtn.classList.toggle('selected', false);
            trafficChart = new Chart(TrafficCanvas, {
                type: 'line',
                data: {
                    labels: ['2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM'],
                    datasets: [{
                        data: [2, 5, 7, 5, 9, 7, 10, 12, 10, 22, 10, 5],
                        backgroundColor: 'rgba(102, 102, 153, .5)',
                        borderColor: '#669',
                        lineTension: 0,
                    }],
                },
                options: {
                    aspectRatio: 2.5,
                    animation: {
                        duration: 0
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                }
            })
            break;
        case dyBtn:
            hrBtn.classList.toggle('selected', false);
            dyBtn.classList.toggle('selected', true);
            wkBtn.classList.toggle('selected', false);
            mthBtn.classList.toggle('selected', false);
            trafficChart = new Chart(TrafficCanvas, {
                type: 'line',
                data: {
                    labels: ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'],
                    datasets: [{
                        data: [75, 100, 175, 125, 225, 210, 105],
                        backgroundColor: 'rgba(102, 102, 153, .5)',
                        borderColor: '#669',
                        lineTension: 0,
                    }],
                },
                options: {
                    aspectRatio: 2.5,
                    animation: {
                        duration: 0
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                }
            });
            break;
        case wkBtn:
            hrBtn.classList.toggle('selected', false);
            dyBtn.classList.toggle('selected', false);
            wkBtn.classList.toggle('selected', true);
            mthBtn.classList.toggle('selected', false);
            trafficChart = new Chart(TrafficCanvas, {
                type: 'line',
                data: {
                    labels: ['16-22', '23-29', '30-5', '6-12', '13-19', '20-26', '27-3', '4-10', '11-17', '18-24', '25-31'],
                    datasets: [{
                        data: [750, 1250, 1000, 2000, 1500, 1750, 1250, 1850, 2250, 1500, 2500],
                        backgroundColor: 'rgba(102, 102, 153, .5)',
                        borderColor: '#669',
                        lineTension: 0,
                    }],
                },
                options: {
                    aspectRatio: 2.5,
                    animation: {
                        duration: 0
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                }
            })
            break;
        case mthBtn:
            hrBtn.classList.toggle('selected', false);
            dyBtn.classList.toggle('selected', false);
            wkBtn.classList.toggle('selected', false);
            mthBtn.classList.toggle('selected', true);
            trafficChart = new Chart(TrafficCanvas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        data: [10000, 11400, 10700, 13050, 14500, 11750, 11250, 12850, 12250, 10500, 12500, 13400],
                        backgroundColor: 'rgba(102, 102, 153, .5)',
                        borderColor: '#669',
                        lineTension: 0,
                    }],
                },
                options: {
                    aspectRatio: 2.5,
                    animation: {
                        duration: 0
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                }
            })
            break;
        }
});

// Daily bar chart
let dailyCanvas = document.getElementById('daily-traffic');
let dailyChart = new Chart(dailyCanvas, {
    type: 'bar',
    data: {
        labels: ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'],
        datasets: [{
            data: [75, 100, 175, 125, 225, 210, 105],
            backgroundColor: '#669',
            borderWidth: 1,
            // barPercentage: 0.5,
            // barThickness: 2,
            // maxBarThickness: 4,
            // categoryPercentage: 1.0,
        }],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false
        },
        responsive: true,
    }
});
// Mobile pie graph
let mobileCanvas = document.getElementById('mobile-users');
let mobileGraph = new Chart(mobileCanvas, {
    type: 'doughnut',
    data: {
        labels: ['Desktop', 'Tablet', 'Phones'],
        datasets: [{
            label: '# of Users',
            data: [2000, 600, 475],
            borderWidth: 0,
            backgroundColor: [
                '#669',
                '#5a5',
                '#5aa',
            ]
        }],
    },
    options: {
        legend: {
            position: 'right',
            labels: {
                boxWidth: 20,
                // fontStyle: 'bold'
            }
        },
        responsive: true,
    }
});




let notices = [
    "You're great",
    "Keep up the good work",
    "Coding can be difficult sometimes",
    "Effort will determine success",
    "Work to live",
    "Dreams are realized by those who strive"
];

function getRandomNotifications() {
    function arrayShuffle(arr) {
        let count = arr.length;
        while (count) {
            arr.push(arr.splice(Math.floor(Math.random() * count), 1)[0]);
            count -= 1;
        }
    }
    arrayShuffle(notices);
    let phrase = notices.splice(0, 2);
    noticeDiv.className = 'notice-div';
    noticeDiv.innerHTML = "<h4>"+phrase[0]+"</h4><h4>"+phrase[1]+"</h4>"
    notification.appendChild(noticeDiv);
    notices = notices.concat(phrase);
}

let activateNotifications = () => {
    $(notification).unbind().on('click', function(){
       if (notification.className == 'active'){
            getRandomNotifications();
            notification.className = "viewed";
            loggedUser.viewedNotices = true;
            localStorage.currentUser = JSON.stringify(loggedUser);
        } else if (notification.className == "viewed") {
            let oldNotices = document.querySelector('.notice-div');
            oldNotices.innerHTML = "";
            notification.removeChild(oldNotices);
            notification.className = "";
            localStorage.currentUser = JSON.stringify(loggedUser);
        }
    });
};



function createMembersList(parent){
    if(loggedUser.loggedIn){    
        for (let i = 0; i < members.length; i++) {
            let newMember = document.createElement('li');
            let member = members[i];
            let text =
                `<img src="${member.picture.thumbnail}" alt="member image"/>
                <div>    
                    <p><strong>${member.name.first} ${member.name.last}</strong></p>
                    <p><a style="text-decoration:none" href="mailto:${member.email}">${member.email}</a></p>
                </div>
                <p>
                    ${member.joindate}
                </p>`;
            newMember.innerHTML = text;
            parent.appendChild(newMember);
        } 
    }
}


// Recent Activity List

function createRecentActivityList(parent) {
    for (let i = 0; i < members.length; i++) {
        let activityList = document.createElement('li');
        let member = members[i];
        let text =
            `<img src="${member.picture.thumbnail}" alt="member image"/>
            <div>    
                <p class="first-line">${member.name.first} ${member.name.last} ${member.spec.method} <strong>${member.spec.medium}</strong></p>
                <p>${member.spec.time}</p>
            </div>
            <p id="arrow">
                &#62;
            </p>`;
        activityList.innerHTML = text;
        parent.appendChild(activityList);
    }
}

function clearLists(parent1, parent2) { 
    parent1.innerHTML = "";
    parent2.innerHTML = "";
}

//added autocomplete for input box from w3 schools modified to search the "userList".
function autocomplete(inp, arr) {
    let selectionIndex;
    inp.addEventListener("input", function (e) {
        let searchValue = this.value;
        let autoBox;
        let autoItem;
        closeAllLists();                                            //for every input, close the previous list and start again.
        if (!searchValue) {
            return false;
            }
        selectionIndex = -1;                                        //start at this point so that the first addition starts at zero.
        autoBox = document.createElement('div');
        autoBox.setAttribute("id", this.id + "-autocomplete-list");    //create a unique id from parent id + "..."
        autoBox.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(autoBox);
        for (let i = 0; i < arr.length; i++) {
            let match = arr[i].name.full;                                                           //the object within the array to test...
            if (match.substr(0, searchValue.length).toUpperCase() == searchValue.toUpperCase()) {  //cycle the array, if the array item's .substr matches the search...
                autoItem = document.createElement("DIV");
                autoItem.innerHTML = "<strong>" + match.substr(0, searchValue.length) + "</strong>";
                autoItem.innerHTML += match.substr(searchValue.length);
                autoItem.innerHTML += "<input type='hidden' value='" + match + "'>";
                autoItem.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;                        //returns the added input "value" to the searchBox value
                    closeAllLists();
                });
                autoBox.appendChild(autoItem);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        let autoList = document.getElementById(this.id + "-autocomplete-list");
        if (autoList) {
            autoList = autoList.getElementsByTagName("div");
        }
        if (e.keyCode == 40) { //arrow down
            selectionIndex++;
            addActive(autoList);
        } else if (e.keyCode == 38) { //arrow up
            selectionIndex--;
            addActive(autoList);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (selectionIndex > -1) {                                                              //make sure the an item is Active
                if (autoList) {
                    autoList[selectionIndex].click();
                }
            }
        }
    });
    function addActive(autoList) {
        if (!autoList) return false;
        removeActive(autoList);                                                                // first remove the active class as per below function
        if (selectionIndex >= autoList.length) selectionIndex = 0;                             // if cycling down beyond length of list, restart selectionIndex
        if (selectionIndex < 0) selectionIndex = (autoList.length - 1);                        // if cycling up beyond length of list, move to the end 
        autoList[selectionIndex].classList.add("autocomplete-active");
    }
    function removeActive(autoList) {          //remove all "autocomplete-items" classes
        for (let i = 0; i < autoList.length; i++) {
            autoList[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(outsideTarget) {
        let autoItems = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < autoItems.length; i++) {
            if (outsideTarget != autoItems[i] && outsideTarget != inp) {
                autoItems[i].parentNode.removeChild(autoItems[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
} 

sendButton.addEventListener('click', function(e){
    e.preventDefault();
    closeAllLists();
    var popUp = document.createElement('div');
    popUp.setAttribute('class', 'pop-up');
    let isMember = false;
    let hasMessage = false;
    let receiver;
    for (let i = 0; i<userList.length; i++){
        let searchValue = searchBox.value.replace(' ', '');
        let currentMembers = userList[i].name.bridged;
        if (currentMembers == searchValue){
            isMember = true;
            receiver = userList[i];
        } 
        if (messageBox.value !== "") {  //just playing with different conditional styles...
            hasMessage = true;
        } 
    }
    
    if (isMember && hasMessage) {
        popUp.innerHTML = `<h4>Great work, your message has been sent to ${receiver.name.full}</h4>`;
        this.parentNode.appendChild(popUp);
        searchBox.value = "";
        messageBox.value = "";
    } else if (!isMember && hasMessage) {
        popUp.innerHTML = "<h4>You haven't selected a current member</h4>";
        this.parentNode.appendChild(popUp);
        searchBox.value = "";
    } else if (isMember && !hasMessage) {
        popUp.innerHTML = "<h4>There is no message</h4>";
        this.parentNode.appendChild(popUp);
    } else if (!isMember && !hasMessage) {
        popUp.innerHTML = "<h4>You haven't selected a current member or typed a message</h4>";
        this.parentNode.appendChild(popUp);
        searchBox.value = "";
    }   
    function closeAllLists() {
        let popItems = document.getElementsByClassName("pop-up");
        for (let i = 0; i < popItems.length; i++) {
           popItems[i].parentNode.removeChild(popItems[i]);
        }
    }

});

// Settings Widget

let emailCheck = document.querySelector('#email-notify');
let publicCheck = document.querySelector('#go-public');
let timeZone = document.querySelector('#timeZoneList');
let saveButton = document.querySelector('#save-button');
let resetButton = document.querySelector('#reset-button');

let catchSettings = () =>{

    saveButton.addEventListener('click', ()=>{
        if (emailCheck.checked) {
            loggedUser.memSettings.wantsEmail = true;
        } else {
            loggedUser.memSettings.wantsEmail = false;
        }
        if (publicCheck.checked) {
            loggedUser.memSettings.isPublic = true;
        } else {
            loggedUser.memSettings.isPublic = false;
        }
        loggedUser.memSettings.timeZone = timeZone.value;
        localStorage.currentUser = JSON.stringify(loggedUser);
    });
    resetButton.addEventListener('click', ()=>{
        resetSettings();
        loggedUser.memSettings.wantsEmail = false;
        loggedUser.memSettings.isPublic = false;
        loggedUser.memSettings.timeZone = "";
    })
}

let resetSettings = () => {
    emailCheck.checked = false;
    publicCheck.checked = false;
    timeZone.value = '';
    if (typeof localStorage.currentUser === "undefined") {
        notification.className = "";
    }
}

let restoreSettings = () => {
    if (typeof loggedUser.memSettings !== 'undefined') {
        emailCheck.checked = loggedUser.memSettings.wantsEmail;
        publicCheck.checked = loggedUser.memSettings.isPublic;
        timeZone.value = loggedUser.memSettings.timeZone;
    }
    else loggedUser.memSettings = {};
}






window.onload = function () {
    searchBox.value = '';
    resetSettings();
    if (supportsLocalStorage()) {
        if (localStorage.currentUser){
            resetUser(userProfile);
            createMembersList(membersList);
            createRecentActivityList(recentList)
            userProfile.classList.toggle('logged-in');
        } else {
            resetSettings();
        }
        userProfile.addEventListener('click', () => {
            if (!localStorage.currentUser)   {
                createUser(userProfile);
                userProfile.classList.toggle('logged-in');
                loggedUser.loggedIn = true;
                createMembersList(membersList);
                createRecentActivityList(recentList);
            } else {
                removeUser(userProfile);
                userProfile.classList.toggle('logged-in');
                loggedUser.loggedIn = false;
                clearLists(membersList, recentList);
                resetSettings();
            }
        });
    }
}
