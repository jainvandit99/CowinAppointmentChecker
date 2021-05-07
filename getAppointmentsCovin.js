var pincode = 411027;
var center_id = 694964
var center_ids = [694964, 686241, 694994]
var date = "07-05-2021";


const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const sound = require("sound-play");

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
    printTime()
    url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pincode+"&date="+date;
    await sleepNow(1100);
    a = httpGet(url);
    try {
        a = JSON.parse(a)
    } catch(e) {
        console.log("Parsing err")
    }
    for (c in a.centers) {
        if(center_ids.includes(a.centers[c].center_id)){
            checker = true;
            for (s in a.centers[c].sessions) {
                if (a.centers[c].sessions[s].min_age_limit < 45 && a.centers[c].sessions[s].available_capacity > 0) {
                    console.log('\x1b[32m%s\x1b[0m',"Appointments abailable at ".padding(40), a.centers[c].name.padding(40), "SLOTS: ", a.centers[c].sessions[s].available_capacity)
                    sound.play('./beep.mp3');
                }else{
                    console.log('\x1b[31m%s\x1b[0m',"No Appointments at ".padding(40), a.centers[c].name.padding(40), "SLOTS: ", a.centers[c].sessions[s].available_capacity)
                }
            }
        }
    }

    if(!checker){
        printNoAppointments()
    }

    checker=false;
    await sleepNow(5000);
    getAppointments();
}

function printTime(){
    var newDate = new Date();
    var datetime = "LastSync: " + newDate.today() + " @ " + newDate.timeNow();
    console.log(datetime)
}

function printNoAppointments(){
    console.log("No Appointments Yet")
}

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

String.prototype.padding = function(n, c)
{
        var val = this.valueOf();
        if ( Math.abs(n) <= val.length ) {
                return val;
        }
        var m = Math.max((Math.abs(n) - this.length) || 0, 0);
        var pad = Array(m + 1).join(String(c || ' ').charAt(0));
//      var pad = String(c || ' ').charAt(0).repeat(Math.abs(n) - this.length);
        return (n < 0) ? pad + val : val + pad;
//      return (n < 0) ? val + pad : pad + val;
};

console.log('Script Initialising');
getAppointments();