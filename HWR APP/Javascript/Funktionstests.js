var db;
var deviceReady = false;
function init() {
	console.log("init();");
    document.addEventListener("deviceready", onDeviceReady(), false);

    window.setTimeout(function () {
        if (!deviceReady) {
            //alert("Error: Phonegap did not initialize.  Demo will not run correctly.");
            console.log("Error: Phonegap did not initialize.  Demo will not run correctly.");
        } else {
			//alert("Phonegap did initialize. Demo will run correctly.");
            console.log("Phonegap did initialize. Demo not run correctly.");
			delete init;
		}
    }, 1000);
	
	
	
	delete init();
} 

function onDeviceReady() {
    deviceReady = true;
	//DB
	console.log("onDeviceReady");
	db = window.openDatabase("hwr-com-db", "1.0", "hwr-com-db", 100000);
	db.transaction(populateDB, errorCB, successCB);	
	}

	// Populate the database 
    //
    function populateDB(tx) {
		console.log("populateDB");
        tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
		tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "third row")');
		tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "fourth row")')	
		tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "fiveth row")');
    }

    // Transaction error callback
    //
    function errorCB(tx, err) {
		console.log("errorCB");
       navigator.notification.alert("DB Error: " + err, function() {}, "DB Error", "OK");
    }

    // Transaction success callback
    //
    function successCB() {
		console.log("successCB");
        navigator.notification.alert("Succes DB Cennection", function() {}, "DB Connection", "OK");
    }
	
	 //
    function queryDB(tx) {
		console.log("queryDB");
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
    }
	
	function querySuccess(tx, results) {
		console.log("querySuccess");
		console.log("Returned rows = " + results.rows.length);
		// this will be true since it was a select statement and so rowsAffected was 0
		if (!results.rowsAffected) {
			console.log('No rows affected!');
			return false;
	}
	// for an insert statement, this property will return the ID of the last inserted row
	console.log("Last inserted row ID = " + results.insertId);
    }

	
	//---------------------------------------------------//
    function showAlert() {
        navigator.notification.alert(
            'You are the winner!',  // message
            'Game Over',            // title
            'Done'                  // buttonName
        );
    }

    // Beep three times
    //
    function playBeep() {
        navigator.notification.beep(3);
    }

    // Vibrate for 2 seconds
    //
    function vibrate() {
        navigator.notification.vibrate(2000);
    }
	
	
