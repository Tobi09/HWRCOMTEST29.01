$(document).delegate('#KontaktePage', 'pageshow', loadKontaktList);

function saveObjekt(name, value) {
	//console.log("saveObjekt value= " + value);
	window.localStorage.setItem("hwr-com-"+name, value);
}

function loadObjekt(name) {
	var value = window.localStorage.getItem("hwr-com-"+name);
	return value;
}

function deleteObjekt(name) {
	//console.log("delete hwr-com-"+name);
	window.localStorage.removeItem("hwr-com-"+name);
}

function saveKontaktList() {
	//console.log("saveKontaktliste");
    var Liste =  document.getElementById('KontaktListe');
    saveObjekt('KontaktListe', Liste.innerHTML);
	//navigator.notification.alert("Kontaktliste gespeichert", function() {}, "Error", "OK");
}

function loadKontaktList() {
	//console.log("loadKontaktliste");
    var List = loadObjekt('KontaktListe');
	//console.log("List: "+ List);
    if (List != '' && List != undefined && List != null) {
		//console.log("set Liste: "+List);
        document.getElementById('KontaktListe').innerHTML = List;
		//$('#KontaktListe').listview('refresh');
		//navigator.notification.alert("Kontaktliste geladen", function() {}, "Error", "OK");
    } else {
		//console.log("List is undefined");
	}
	$('#KontaktListe').listview('refresh')
}


$(document).delegate('#addKontaktdialog', 'click', function addtoKontakte() {
  $(this).simpledialog({
    'mode' : 'string',
    'prompt' : 'Email vom neuen Kontakt?',
    'buttons' : {
      'OK': {
        click: function () {
		var createMail = $(this).attr('data-string');
		var eigeneMail = loadObjekt('email');
		var username = '';
		var type ='';
		//DB abfrage
		var ergebnis;
		//console.log("test1");
		if (createMail != '' && eigeneMail != '' &&eigeneMail != null) {
			var url = "http://garten-kabel-pflasterbau.de/hwr-com/createKontakt.php?em="+eigeneMail+"&cm="+createMail;
			//console.log(url);
			iniLadeanimation();		
					$.post(url, function (data) {
						//console.log("request gesendet");
						endLadeanimation();						
						 $.each(data, function(key, val) {
							type = val['type'];
							username = val['username'];
						});
						if (type== 'Freundschaft erstellt') {
							//console.log("Freundschaft erstellt");
							ergebnis = true;
							//navigator.notification.alert("DB - neuer Kontakt", function() {}, "Error", "OK");
							var form = $("#newKontaktForm"); 
							var neuerKontakt = document.createElement("li");
							var inhalt = "<li id=\""+createMail+"\"><a href=\"chat.html\" onclick='setChat_Email(\""+createMail+"\")'><img src=\"Images/kontaktbild.jpg\"><h3>"+username+"</h3><p>"+createMail+"</p></a><a href=\"#\" data-icon=\"k_delete\" class=\"removeKontakt\"></a></li>";
							var lsList = loadObjekt('KontaktListe');
							if (lsList != '' && lsList != undefined && lsList != null) {
								lsList = lsList + inhalt;
							} else {
								lsList = '' + inhalt;
							}
								//Local Storage
								saveObjekt('KontaktListe', lsList);
								loadKontaktList();
								$('#KontaktListe').listview('refresh');
						} else if (type == 'wrong email'){
							////console.log("wrong email");
							ergebnis = false;
							navigator.notification.alert("Email nicht gefunden!", function() {}, "Error", "OK");
						} else if (type == 'Freundschaft schon vorhanden'){
						////console.log("Freundschaft schon vorhanden");
							ergebnis = false;
							navigator.notification.alert("Freundschaft schon vorhanden!", function() {}, "Error", "OK");
						}
					}, "json");			
		}
		}
      },
      'Cancel': {
        click: function () { },
        icon: "delete",
        theme: "c"
      }
    }
	}
  )
})


$('.removeKontakt').live("click", function removeKontakt() {
	var ergebnis = true;
	var eigeneMail = loadObjekt('email');
	var löschMail = $(this).closest('li').attr("id");
	if (löschMail != '' && eigeneMail != '' &&eigeneMail != null) {
	//DB update
	var url = "http://garten-kabel-pflasterbau.de/hwr-com/deleteKontakt.php?em="+eigeneMail+"&lm="+löschMail;
	//console.log(url);  
	iniLadeanimation();
			$.post(url, function (data) {
				//console.log("request gesendet");
				endLadeanimation();
				if (data == '(true);') {
					//console.log("Kontakt gelöscht");
					//navigator.notification.alert("DB - Kontakt gelöscht", function() {}, "Error", "OK");
					ergebnis = true;
				} else if (data == '(false);') {
					//console.log("Kontakt nicht gelöscht");
					//navigator.notification.alert("DB - Kontakt nicht gelöscht", function() {}, "Error", "OK");
					ergebnis = false;
				}
			});
	}
	if (ergebnis) {
        $(this).closest('li').remove();
		$('#KontaktListe').listview('refresh');
		saveKontaktList();			
	}
});

