var pincode = 411027;
var center_id = 694964
var date = "07-05-2021";


const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const play = require('audio-play');
const load = require('audio-loader');

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.setRequestHeader("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36")
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

checkNumber = 1;
var checker = false;

async function getAppointments(){
    console.log("Op: ", checkNumber++);
    url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pincode+"&date="+date;
    await sleepNow(1100);
    a = httpGet(url);
    try {
        a = JSON.parse(a)
    } catch(e) {
        console.log("Parsing err")
    }
    for (c in a.centers) {
        if(a.centers[c].center_id==center_id){
            checker = true;
            for (s in a.centers[c].sessions) {
                if (a.centers[c].sessions[s].min_age_limit < 45 && a.centers[c].sessions[s].available_capacity > 0) {
                    console.log("Trying Booking for", a.centers[c].pincode, a.centers[c].name, a.centers[c].sessions[s].available_capacity);
                    load('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3').then(play);
                }else{
                    printNoAppointments()
                }
            }
        }
        
    }

    if(!checker){
        printNoAppointments()
    }

    checker=false;
    await sleepNow(10000);
    getAppointments();
}


function printNoAppointments(){
    var newDate = new Date();
    var datetime = "LastSync: " + newDate.today() + " @ " + newDate.timeNow();
    console.log(datetime, "No Appointments Yet")
}

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

console.log('Script Initialising');
getAppointments();