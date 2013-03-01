//Login
//---------------------------------------------------------------------------------------------------
function checkPreAuth() {
	////console.log("checkPreAuth");
    var form = $("#loginForm");
    if(window.localStorage.getItem("hwr-com-email") != undefined && window.localStorage.getItem("hwr-com-password") != undefined) {
        $("#username", form).val(window.localStorage.getItem("hwr-com-email"));
        $("#password", form).val(window.localStorage.getItem("hwr-com-password"));
        handleLogin();
    }
}


function handleLogin() {
	////console.log("handleLogin");
    var form = $("#loginForm");   
    //disable the button so we can't resubmit while we wait
	$("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    if(u != '' && p!= '') {
		//var pmd5 = MD5(p);
		////console.log("serverabfrage");
		////console.log("username: " + u);
		////console.log("password: " + p);
		////console.log("password: " + pmd5);
		iniLadeanimation();
		var url = "http://garten-kabel-pflasterbau.de/hwr-com/loghandler.php?un="+u+"&pw="+p;
		////console.log(url);  
		$.post(url, function (data) {
			////console.log("request gesendet");
			if (data == '({"logincheck":"true"});') {
				//store
                window.localStorage.setItem("hwr-com-email", u);
                window.localStorage.setItem("hwr-com-password", p);    
				////console.log("gehe zur naechsten Seite");
				//lade Kontaktliste
				DBsynchronizeKontakte();
				endLadeanimation();
				$.mobile.changePage("Kontakte.html");
				//navigator.notification.alert("Your login succesed", function() {}, "Login", "OK");
			} else {
				window.localStorage.removeItem("hwr-com-password");
				////console.log("keine Daten");
				////console.log("false login")
				//alert("Your login failed");
				endLadeanimation();
				navigator.notification.alert("Your login failed", function() {}, "Error", "OK");
			}
		});
    } else { 
        //Thanks Igor!
		////console.log("keine angaben");
		//alert("You must enter a Email and password");
		navigator.notification.alert("You must enter a username and password", function() {}, "Error", "OK");
    }
	$("#submitButton").removeAttr("disabled");
    return false;
}

//Kontaktliste synchronisieren
function DBsynchronizeKontakte () {
	////console.log("DBsynchronizeKontakte");
	saveObjekt('KontaktListe', '');
	var KontaktListe = loadObjekt('KontaktListe');
	var eigenemail = loadObjekt('email');
	var url = "http://garten-kabel-pflasterbau.de/hwr-com/synchronizeKontakte.php?em="+eigenemail;
	//console.log(url);
	var username = '';
	var email ='';
	iniLadeanimation();		
	$.post(url, function (data) {
		//console.log("request gesendet");
		endLadeanimation();			
		var resultArr = eval(data);
		var lsList = '';
		if (resultArr != null) {
			for (var i=0;i<resultArr.length;i++) {
				var createMail = resultArr[i].email;
				var username = resultArr[i].username;
				var inhalt = "<li id=\""+createMail+"\"><a href=\"chat.html\" onclick='setChat_Email(\""+createMail+"\")'><img src=\"Images/kontaktbild.jpg\"><h3>"+username+"</h3><p>"+createMail+"</p></a><a href=\"#\" data-icon=\"k_delete\" class=\"removeKontakt\"></a></li>";
				lsList = lsList + inhalt;
			}
		}
		//console.log("save kontaktliste");
		saveObjekt('KontaktListe', lsList);
	});
}

//Logoff
//---------------------------------------------------------------------------------------------------
function handleLogoff() {
	//console.log("handleLogoff");  
	window.localStorage.setItem("hwr-com-email",'');
	window.localStorage.setItem("hwr-com-password",'');
	window.localStorage.clear();
	////console.log("get Item email: " + window.localStorage.getItem("hwr-com-email"));
	//console.log("gehe zur Login Seite");
	$.mobile.changePage("index.html");
}
//Register
//--------------------------------------------------------------------------------------------------
function handleRegister() {
	//console.log("handleRegister");
    var form = $("#RegisterForm");    
	$("#RegisterSubmitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
	var p_wdh = $("#password2", form).val();
	var email = $("#email", form).val();
    if(u != '' && p!= '' && p_wdh!='' && email!='') {
		//console.log("serverabfrage");
		//console.log("username: " + u);
		//console.log("password: " + p);
		//console.log("password: " + p_wdh);
		//console.log("email: " + email);
		if (p==p_wdh) {
			//var pmd5=MD5(p);
			iniLadeanimation();
			var url = "http://garten-kabel-pflasterbau.de/hwr-com/register.php?un="+u+"&pw="+p+"&em="+email;
			//console.log(url);  
			$.post(url, function (data) {
				//console.log("request gesendet");
				endLadeanimation();
				if (data == '({"Registed":"new user registed"});') {
					//store
					window.localStorage.setItem("hwr-com-email", u);
					window.localStorage.setItem("hwr-com-password", p);    
					//console.log("gehe zur anmelde Seite");
					$.mobile.changePage("index.html");
				} else if (data == '({"Registed":"double email"});') {
					//console.log("Email schon vorhanden(Bereits angemeldet), failed")
					//alert("Email bereits vorhanden");
					navigator.notification.alert("Email always registed, Your Registration failed", function() {}, "Error", "OK");
				}
			});
		} else {
			//console.log("passwöerter nicht identisch");
			//alert("Passwörter nicht identisch");
			navigator.notification.alert("Passwörter nicht identisch", function() {}, "Error", "OK");
		}
    } else { 
        //Thanks Igor!
		//console.log("keine angaben");
		//alert("You must enter a username and password");
		navigator.notification.alert("You must enter a email and password", function() {}, "Error", "OK");
    }
	$("#RegisterSubmitButton").removeAttr("disabled");
    return false;
}

//Edit User 
function editUser(edittype, name) {
	//console.log("edittype: " + edittype);
	//console.log("name: " + name);
	var input;
	if(name=='pw') {
			input = "<form id='changePW'><input type='password' name='password' id='password' placeholder='neues passwort' class='required'><input type='password' name='password2' id='password2' placeholder='passwort wiederholen' class='required'><a rel='close' data-role='button' href='#' onclick='changeUser(\"pw\")'>Speichern</a><a rel='close' data-role='button' href='#' id='simpleclose'>Abbrechen</a></form>"; 
		} else if(name=='un') {
			input ="<form id='changeUN'><input type='text' name='username' id='username' placeholder='neuer username' class='required'><a rel='close' data-role='button' href='#' onclick='changeUser(\"un\")'>Speichern</a><a rel='close' data-role='button' href='#' id='simpleclose'>Abbrechen</a></form>";
		} else { //name = 'em'
			input = "<form id='changeEM'><input type='email' name='email' id='email' placeholder='neue Email' class='required'><a rel='close' data-role='button' href='#' onclick='changeUser(\"em\")'>Speichern</a><a rel='close' data-role='button' href='#' id='simpleclose'>Abbrechen</a></form>"; 
		}
  $(document).delegate(edittype, 'click', function() {
	$(this).simpledialog({
      'mode' : 'blank',
        'prompt': false,
        'forceInput': false,
        'useModal':true,
        'fullHTML' : 
			input
	})
	});
}

function changeUser(updatetyp) {
	var email = window.localStorage.getItem("hwr-com-email");
	//console.log("account email: " + email);
	if (email != undefined) {
		switch (updatetyp) {
			case "un":
				var un = $("#username", "#changeUN").val();
				//console.log(un);
				if (un != undefined) {
					//console.log("un geändert - start sql");
					var url = "http://garten-kabel-pflasterbau.de/hwr-com/updateUser.php?un="+un+"&em="+email;
					//console.log(url);
					//--- Request
					$.post(url, function (data) {
						//console.log("request gesendet");
						if (data == '(true);') {
							//alert("Username geÃ¤ndert!");
							navigator.notification.alert("Username geändert!", function() {}, "Error", "OK");
						} else {
							//alert("Fehler beim update");
							navigator.notification.alert("Fehler beim update", function() {}, "Error", "OK");
						}	
					});
					//---
				} else {
					//console.log("Usernamen eingeben");
					//alert("Usernamen eingeben");
					navigator.notification.alert("Usernamen eingeben", function() {}, "Error", "OK");
				}
			break;
			case "pw":
				var pw = $("#password", "#changePW").val();
				var pw2 = $("#password2", "#changePW").val();
				//console.log("passwort1: " + pw);
				//console.log("passwort2: " + pw2);
				if (pw == undefined || pw != pw2) {
					//console.log("eingabefehler");
					//alert("Eingabefehler");
					navigator.notification.alert("Eingabefehler", function() {}, "Error", "OK");
				} else {
					//console.log("passwort geÃ¤ndert - start sql");
					var url = "http://garten-kabel-pflasterbau.de/hwr-com/updateUser.php?pw="+pw+"&em="+email;
					//console.log(url);
					//--- Request
					$.post(url, function (data) {
						//console.log("request gesendet");
						if (data == '(true);') {
							window.localStorage.setItem("hwr-com-password", pw);
							//alert("Passwort geÃ¤ndert!");
							navigator.notification.alert("Passwort geändert!", function() {}, "complete", "OK");
						} else {
							//alert("Fehler beim update");
							navigator.notification.alert("Fehler beim update", function() {}, "complete", "OK");
						}	
					});
					//---
				}	
			break;
			case "em":
				var newem = $("#email", "#changeEM").val();
				//console.log(newem);
				if (newem != undefined) {
					//console.log("email geÃ¤ndert - start sql");
					iniLadeanimation();
					var url = "http://garten-kabel-pflasterbau.de/hwr-com/updateUser.php?newem="+newem+"&em="+email;
					//console.log(url);
					//--- Request
					$.post(url, function (data) {
						//console.log("request gesendet");
						endLadeanimation();
						if (data == '(true);') {
							window.localStorage.setItem("hwr-com-email", newem);
							//alert("Email geÃ¤ndert!");
							navigator.notification.alert("Email geändert!", function() {}, "complete", "OK");
						} else {
							//alert("Fehler beim update");
							navigator.notification.alert("Fehler beim update", function() {}, "Error", "OK");
						}	
					});
					//---
				} else {
					//console.log("email leer");
					//alert("Bitte beim Ã¤ndern auch email angeben!");
					navigator.notification.alert("Bitte beim Ändern auch Email angeben!", function() {}, "Error", "OK");	
				}
			break;
		}
	} else {
		//console.log("Änderungen nicht möglich da keine email im speicher");
		//alert("nicht mÃ¶glich da keine email");
		navigator.notification.alert("nicht möglich da keine email", function() {}, "Error", "OK");	
	}
}

//Delete Account 
//--------------------------------------------------------------------------------------

$(document).delegate('#deleteAccount', 'click', function deleteAccount() {
  $(this).simpledialog({
    'mode' : 'bool',
    'prompt' : 'delete Account?',
    'useModal': true,
    'buttons' : {
      'delete': { //Account lÃ¶schen
        click: function () {
			//console.log("Account lÃ¶schen!");
			var email = window.localStorage.getItem("hwr-com-email");
			if (email!=null) { // löschen
				var url = "http://garten-kabel-pflasterbau.de/hwr-com/deleteAccount.php?em="+email;
				//console.log(url);
				iniLadeanimation();
				$.post(url, function (data) {
				//console.log("request gesendet");
				endLadeanimation();
				if (data == '(true);') {
					//delete store
					window.localStorage.removeItem("hwr-com-email");
					window.localStorage.removeItem("hwr-com-password");
					window.localStorage.clear();
					//console.log("gehe zur anmelde Seite");
					$.mobile.changePage("index.html");
				} else {
					//console.log("löschen nicht möglich, sever failed")
					//alert("server process abgebrochen");
					navigator.notification.alert("sorry, delete not possible, server abbort", function() {}, "Error", "OK");
				}
			});
			} else {
				//console.log("löschen nicht möglich, keine email");
				//alert("process abgebrochen, keine email");
				navigator.notification.alert("sorry, delete not possible, no email", function() {}, "Error", "OK");
			}			
        },
		 icon: "delete"
      },
      'Cancel': { //Abbrechen
        click: function () {
          //console.log("Account löschen abgebrochen!");
		icon: "abbort"
      }
	 } 
    }
  })
})

function saveObjekt(name, value) {
	//console.log("saveObjekt value= " + value);
	window.localStorage.setItem("hwr-com-"+name, value);
}


//Animation
function iniLadeanimation() {
	document.getElementById("ladeanimation").style.display='block';
	document.getElementById("seiteninhalt").style.display='none';
}

function endLadeanimation() {
	document.getElementById("ladeanimation").style.display='none';
	document.getElementById("seiteninhalt").style.display='block';
}
