var config = {
    apiKey: "AIzaSyCheoJK2Ye0z9XYgEZAJnBotDhD2J-lbRY",
    authDomain: "ucla-projects.firebaseapp.com",
    databaseURL: "https://ucla-projects.firebaseio.com",
    projectId: "ucla-projects",
    storageBucket: "ucla-projects.appspot.com",
    messagingSenderId: "576466349884"
};
firebase.initializeApp(config);
//create variable to look at database
var database = firebase.database();
//Initial Value
var trainName = "";
var destination = "";
var frequency = "";
var nextArrival = "";
var minutesAway = "";
var firstTrainTime = "";

// Capture Button Click
$("#add-train").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault()
    console.log("works");
    // YOUR TASK!!!
    // Code in the logic for storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    trainName = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstTrainTime = $("#time-input").val().trim();


    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrainTime: firstTrainTime
    });

});

//listens to the database
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val())
    var trainName = snapshot.val().trainName
    var destination = snapshot.val().destination
    var frequency = snapshot.val().frequency
    var firstTrainTime = snapshot.val().firstTrainTime
    var nextArrival = "TBD"
    var minutesAway = "TBD"

    var timeArray = firstTrainTime.split(":")

    //Took timeArray and create a real moment out of it. 
    var trainTime = moment().hours(timeArray[0]).minutes(timeArray[1]).seconds("00")
    //maxMoment will now be either current time or first train arrival of day. It will be current time if train has arrived for the day.
    var maxMoment = moment.max(moment(), trainTime)
    if (maxMoment === trainTime) {
        nextArrival = trainTime.format("hh:mm a")
        minutesAway = trainTime.diff(moment(), "minutes")
    } else {
        var differenceTime = moment().diff(trainTime, "minutes")
        var timeRemainder = differenceTime % frequency
        nextArrival = moment().add(timeRemainder, "m").format("hh:mm a")
        minutesAway = frequency - timeRemainder
      

    }
    console.log(maxMoment)
    var newTableRow = "<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + firstTrainTime + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>"
    $("tbody").append(newTableRow)



})

