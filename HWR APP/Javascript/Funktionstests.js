var deviceReady = false;
function init() {
	console.log("init();");
    document.addEventListener("deviceready", function () {
    deviceReady = true;
	console.log("deviceReady -> in init()");
	$("#loginPage").on("pageinit",function() {
	console.log("pageinit run");
	$("#loginForm").on("submit",handleLogin);
	checkPreAuth();
	});
	$.mobile.changePage("#loginPage");
    }, false);

    window.setTimeout(function () {
        if (!deviceReady) {
            alert("Error: Phonegap did not initialize.  Demo will not run correctly.");
            console.log("Error: Phonegap did not initialize.  Demo will not run correctly.");
        } else {
			alert("Phonegap did initialize. Demo will run correctly.");
            console.log("Phonegap did initialize. Demo not run correctly.");
		}
    }, 1000);
} 

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
	
	
