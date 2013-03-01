var chat_email;
var isOn = false;

$(document).delegate('#ChatPage', 'pageshow', loadChat);
$(document).delegate('#KontaktePage', 'pageshow', check_auto_recieve);


//autoreciever routine soll nur einmal ausgeführt werden
function check_auto_recieve() {
	//console.log("check_auto_recieve(): " + isOn)
	if (isOn == false) {
		//console.log("auto_recieve startet")
		isOn = true;
		checkMessages();
	}
}

function setChat_Email(temp_email) {
	chat_email = temp_email;
	//console.log("setChat_Email: "+ temp_email);
	//console.log("chat_email: " + chat_email);
}

function getChat_Email() {
	return chat_email;
}

//auto reciever
function checkMessages() {
	recieveMessages();
	setTimeout("checkMessages()", 5000); 
}
//Nachrichten synchronisieren
function recieveMessages () {//Empfängt alle Nachrichten und speichert sie im local Storage
	//console.log("getNachrichten");
	var eigenemail = loadObjekt('email');
	var url = "http://garten-kabel-pflasterbau.de/hwr-com/recieveMessages.php?em="+eigenemail;
	//console.log(url);
	iniLadeanimation();		
	$.post(url, function (data) {
		//console.log("request gesendet");
		endLadeanimation();			
		var resultArr = eval(data);
		var chat_text = '';	
		if (resultArr != null) {
			for (var i=0;i<resultArr.length;i++) {
				//console.log("nachricht:");
				var nachricht = resultArr[i].nachricht;
				if (nachricht == 'keine Nachricht' || nachricht == 'FehlerXYZ123') {
					//console.log("recieve beendet");
					break;
				}				
				var chat_email = resultArr[i].chat_email;
				var chat_text = loadObjekt("-chat-"+chat_email);
				var username = resultArr[i].username;	
				//console.log("chat_email: " + chat_email);
				//console.log("alter chat_text: " + chat_text);
				//console.log("username: " + username);
				//console.log("neue nachricht: " + nachricht);
				if (chat_text == null) {chat_text = ''}
				var saveChat = chat_text + "<div class='message'><span class='username'>" + username + ":</span> " + nachricht + "</div>";;
				//console.log(saveChat);
				saveObjekt("-chat-"+chat_email, saveChat);
				loadChat();
				$("#incomingMessages").scrollTop($("#incomingMessages")[0].scrollHeight);
				
				//Nutzer Benachrichtigunen
				navigator.notification.vibrate(250);
				navigator.notification.beep(1);
				navigator.notification.vibrate(500);
				navigator.notification.vibrate(251);
				
				
			}
		}
	});
}

//$("#incomingMessages").append("<div class='message'><span class='username'>" + name + ":</span> " + message + "</div>";
      
	  
function sendMessage () {//sendet Nachricht
	//console.log("sendNachrichten");
	var eigenemail = loadObjekt('email');
	var username = 'Ich';
	var nachricht = $("#messageText", "#sendmessageform").val(); //aus textfenster laden
	//console.log("eigenemail:"+ eigenemail);
	//console.log("chat_mail:"+ chat_email);
	//console.log("nachricht:"+ nachricht);
	//var chat_email = getChat_Email;
	var chat_text = loadObjekt("-chat-"+chat_email);
	if (chat_email != null && nachricht != null && eigenemail != null && chat_email != '' && eigenemail != '') {
		var url = "http://garten-kabel-pflasterbau.de/hwr-com/sendMessage.php?sm="+eigenemail+"&em="+chat_email+"&text="+nachricht;
		//console.log(url);
		iniLadeanimation();		
		$.post(url, function (data) {
			//console.log("request gesendet");
			endLadeanimation();			
					if (data == 'true') { //nachricht wurde erfolgreich gesendet
						if (chat_text == null) {chat_text = ''}
						var saveChat = chat_text + "<div class='message'><span class='username'>" + username + ":</span> " + nachricht + "</div>";
						//console.log(saveChat);
						saveObjekt("-chat-"+chat_email, saveChat);
						document.getElementById('messageText').value = '';
						//Refresh Chat
						loadChat(chat_email);
					}	else {
						//console.log("Nachricht nicht gesendet");	
					}
		});
	} else {
		//console.log("keine eingaben");
	}
	$("#incomingMessages").scrollTop($("#incomingMessages")[0].scrollHeight);
}

function loadChat() {
	var m = chat_email;
	//console.log("loadChat");
	var chat = loadObjekt('-chat-'+m);
	if (chat != null) {
		 document.getElementById('incomingMessages').innerHTML = chat;
	}
	//console.log("name = " + m);
	$("#header_chatname").text(m);
	$("#incomingMessages").scrollTop($("#incomingMessages")[0].scrollHeight);
}

function setChatName() { //lädt chatemail für den Header
	//console.log("setChatName");
	if (chat_email != null) {
		//console.log("setze chatname");
		document.getElementById('#header_chatname').html(chatname);
	}
}

function saveObjekt(name, value) {
	//console.log("saveObjekt value= " + value);
	window.localStorage.setItem("hwr-com-"+name, value);
}

function loadObjekt(name) {
	var value = window.localStorage.getItem("hwr-com-"+name);
	return value;
}