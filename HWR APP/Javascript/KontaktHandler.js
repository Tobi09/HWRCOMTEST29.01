function saveObjekt(name, value) {
	console.log("saveObjekt value= " + value);
	window.localStorage.setItem("hwr-com-"+name, value);
}

function loadObjekt(name) {
	var value = window.localStorage.getItem("hwr-com-"+name);
	return value;
}

function deleteObjekt(name) {
	console.log("delete hwr-com-"+name);
	window.localStorage.removeItem("hwr-com-"+name);
}

function saveKontaktList() {
	console.log("saveKontaktliste");
    var Liste =  document.getElementById('KontaktListe');
    saveObjekt('KontaktListe', Liste.innerHTML);
	navigator.notification.alert("Kontaktliste gespeichert", function() {}, "Error", "OK");
}

function loadKontaktList() {
	console.log("loadKontaktliste");
    var List = loadObjekt('KontaktListe');
	console.log("List: "+ List);
    if (List != '' && List != undefined && List != null) {
		console.log("set Liste: "+List);
        document.getElementById('KontaktListe').innerHTML = List;
		//$('#KontaktListe').listview('refresh');
		navigator.notification.alert("Kontaktliste geladen", function() {}, "Error", "OK");
    } else {
		console.log("List is undefined");
	}
	
}


$(document).delegate('#addKontaktdialog', 'click', function() {
  $(this).simpledialog({
    'mode' : 'string',
    'prompt' : 'Email vom neuen Kontakt?',
    'buttons' : {
      'OK': {
        click: function () {
		var email = $(this).attr('data-string');
        console.log("neuer Kontakt hinzufügen " + email);
		//DB abfrage
		var username = 'XXXXXXX';  // abfrage
		//DB insert returns true/false
		DBcreateKontakt(email);
		//in htlm eintragen und speichern
		var form = $("#newKontaktForm"); 
		var neuerKontakt = document.createElement("li");
		var inhalt = "<li id=\"Kontakt"+email+"\"><a href=\"\"><img src=\"Images/kontaktbild.jpg\"><h3>"+username+"</h3><p>"+email+"</p></a><a href=\"#\" data-icon=\"k_delete\" class=\"removeKontakt\" onClick=\"DBdeleteKontakt('"+email+"')\">></a></li>";
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
		navigator.notification.alert("Kontaktliste - neuer Eintrag hinzugefügt", function() {}, "Error", "OK");
        }
      },
      'Cancel': {
        click: function () { },
        icon: "delete",
        theme: "c"
      }
    }
  })
})

$('.removeKontakt').live("click", function() {
            $(this).closest('li').remove();
			$('#KontaktListe').listview('refresh');
			saveKontaktList();			
        });
		
function DBdeleteKontakt(kontaktmail) {
	console.log("DBdeleteKontakt");
	var ergebnis;
	var eigeneMail = loadObjekt('email');
	var löschMail = kontaktmail;
	if (löschMail != '' && eigeneMail != '' &&eigeneMail != null) {
	//DB update
	var url = "http://garten-kabel-pflasterbau.de/hwr-com/deleteKontakt.php?eemail="+eigeneMail+"&lemail="+löschMail;
			console.log(url);  
			$.post(url, function (data) {
				console.log("request gesendet");
				if (data == '') {
					navigator.notification.alert("DB - Kontakt gelöscht", function() {}, "Error", "OK");
					ergebnis = true;
				} else if (data == '') {
					navigator.notification.alert("DB - Kontakt nicht gelöscht", function() {}, "Error", "OK");
					ergebnis = false;
				}
			});
	}
	return ergebnis;
}
function DBcreateKontakt(kontaktmail) {
	console.log("DBcreateKontakt");
	var ergebnis;
	var eigeneMail = loadObjekt('email');
	var createMail = kontaktmail;
	//DB update
	if (createMail != '' && eigeneMail != '' &&eigeneMail != null) {
		var url = "http://garten-kabel-pflasterbau.de/hwr-com/createKontakt.php?eemail="+eigeneMail+"&kemail="+createMail;
				console.log(url);  
				$.post(url, function (data) {
					console.log("request gesendet");
					if (data == '') {
						navigator.notification.alert("DB - neuer Kontakt", function() {}, "Error", "OK");
						ergebnis = true;
					} else if (data == '') {
						navigator.notification.alert("DB - kein neuer Kontakt", function() {}, "Error", "OK");
						ergebnis = false;
					}
				});			
	}
	return ergebnis;
}
		
function DBsynchronizeKontakte () {
	console.log("DBsynchronizeKontakte");
	saveObjekt('KontaktListe', '');
	var KontaktListe = loadObjekt('KontaktListe');
	//Kontakte aus DB laden
	navigator.notification.alert("Kontaktliste synchronisiert", function() {}, "Error", "OK");
	//in local Storage packen
	//local Storage überschreiben

	return 'ergebnis';
}


