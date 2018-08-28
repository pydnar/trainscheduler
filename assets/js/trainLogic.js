//Firebase Config Initialization
var config = {
    apiKey: "AIzaSyAxsiyh5C1HWdERBKmdZnXv5viRFGuJlTY",
    authDomain: "train-schedule-9cc86.firebaseapp.com",
    databaseURL: "https://train-schedule-9cc86.firebaseio.com",
    projectId: "train-schedule-9cc86",
    storageBucket: "train-schedule-9cc86.appspot.com",
    messagingSenderId: "263297549652"
};
firebase.initializeApp(config);

var database = firebase.database();
// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var routeName = $("#route-name-input").val().trim();
    var destinationName = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").subtract(10, "years").format("X");;

    // Creates local "temporary" object for holding employee data
    var newRoute = {
        name: routeName,
        destination: destinationName,
        frequency: frequency,
        start: trainStart,
    };

    // Uploads employee data to the database
    database.ref().push(newRoute);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#start-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var routeName = childSnapshot.val().name;
    var destinationName = childSnapshot.val().destination;
    var frequencyOf = childSnapshot.val().frequency;
    var trainStart = childSnapshot.val().start;

    // Employee Info
    console.log(routeName);
    console.log(destinationName);
    console.log(frequencyOf);
    console.log(trainStart);

    var diffTime = moment().diff(moment.unix(trainStart), "minutes");
    var timeRemainder = moment().diff(moment.unix(trainStart), "minutes") % frequencyOf ;
    var minutes = frequencyOf - timeRemainder;
   
    var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A");

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + routeName + "</td><td>" + destinationName + "</td><td>" +
        frequencyOf + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");
});