// Show accomodations from a JSON file in a map.
// JSON file with accomodations is an adaption of the XML file
// with accomodations in Madrid from the open data portal of
// Ayuntamiento de Madrid (as of April 2016)
// Simple version. Doesn't work well if some of the fields are not defined.
// (for example, if there are no pictures)
//

var markers = [];
var j = 1;
var k = 1;
var l = 1;
var colections = [];
var apiKey = 'AIzaSyB-5jim643xF_iFUYXphMRaiGyHCmK6rRk';
var current = null;
var hotel = null;
var users = [];
var ghStuff = {};

function ghsave(){
	console.log("entra en prueba");
  var token = $("#gh-token").val();
  var repositorio = $("#gh-repo").val();
  var username = $("#gh-username").val();
  var github = new Github({token:token,auth: "oauth"});
  var ghcolecciones = [];
  
  for(var i=0;i<colections.length;i++){
	  for(var j=0;j<colections[i].length;j++){
		  if( j == 0 ){
			  var namehotel = colections[i][j];
			  var listaaux = [];
		  }else{
			  listaaux.push(colections[i][j]);
		  }
	  }
	   var objeto ={
		nombre: namehotel,
		lista: listaaux,
		}
	ghcolecciones.push(objeto)
  }
 
  var texto = JSON.stringify(ghcolecciones);
  var texto2 = JSON.stringify(users);
  var repositorio_git = github.getRepo(username, repositorio);
  repositorio_git.write("master","prueba.json",texto,"fichero",function(err){});
	repositorio_git.write("master","usuarios.json",texto2,"fichero",function(err){});

}
function ghload(){
	 var token = $("#gh-token").val();
  var repositorio = $("#gh-repo").val();
  var username = $("#gh-username").val();
	var github = new Github({token:token,auth: "oauth"});
	var repositorio_git = github.getRepo(username, repositorio);
	repositorio_git.read('master', "prueba.json", function(err, data) {
		 var pre_collections = $.parseJSON(data);
		console.log("pre_collections:"+pre_collections);
		for(i in pre_collections){
			console.log(pre_collections[i]);
		}
	});
	show_load_colections();
}

function handleClientLoad() {
        gapi.client.setApiKey(apiKey);
	console.log(gapi.client);
      }
function add_new_user(){
	var text = $("#newuser").val();
	if(text != null){
		makeApiCall(text);
	}
}

function makeApiCall(text) {

        gapi.client.load('plus', 'v1', function() {	
          var request = gapi.client.plus.people.get({
            'userId': text
          });

	request.execute(function(resp) {
	var heading = document.createElement('h4');
	var image = document.createElement('img');
	image.src = resp.image.url;	
	heading.appendChild(image);	
	heading.appendChild(document.createTextNode(resp.displayName));
	add_users(heading);
	$("#usuarios").append(heading);


          });
        });
      }
      function showStuff(element)  {
    var tabContents = document.getElementsByClassName('tabContent');
    for (var i = 0; i < tabContents.length; i++) { 
        tabContents[i].style.display = 'none';
    }

   
    var tabContentIdToShow = element.id.replace(/(\d)/g, '-$1');
    document.getElementById(tabContentIdToShow).style.display = 'block';
    if(element.id == "tabs1"){
	current = "Inicio";
	    map = L.map('map').setView([40.4175, -3.708], 11);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
		 $("#get1").click(get_accomodations1);
    }else if(element.id == "tabs2"){
	current = "Colecciones";
	     $("#get2").click(get_accomodations2);
    }else if(element.id == "tabs3"){
	    current = "Usuarios";
	    show_hotel();
	    handleClientLoad();
	    users_hotel();
    }
		    
}

function elements_colection(colection){
	var exist = 0;
	var  col;
		console.log("length:"+colections.length);
		for ( var i = 0; i < colections.length; i++) {
			
			if(colections[i][0] == colection){
				console.log("colections[i].length"+colections[i].length);
				for (var j = 1; j < colections[i].length;j++){
					col = col + '<li no=' + j+ '>' + colections[i][j]+ '</li>';
					exist = 1;
			
				}
			}
		}
		if(exist){
			col = col + '</ul>';
			$("#coleccion").append(col);
		}
	
}
function users_hotel(){
	var exist = 0;
	var  col;
		$("#usuarios").empty();
	$("#usuarios").append('<tr><th>Usuarios</tr></th>');

		console.log("length:"+colections.length);
		for ( var i = 0; i < users.length; i++) {
			
			if(users[i][0] == hotel){
				for (var j = 1; j < users[i].length;j++){
					console.log("hotel:"+hotel+"usuario:"+users[i][j]);
					$("#usuarios").append(users[i][j]);
					exist = 1;
			
				}
			}
		}
}
function add_users(user){
	var exist = 0;
	for ( var i = 0; i < users.length; i++) {
		if(users[i][0] == hotel){
				exist = 1;
				users[i].push(user);
			}
	}
	if(!exist){
		var arr = [];
		arr.push(hotel);
		arr.push(user);
		console.log(arr[0]);
		console.log(arr[1]);
		users[users.length] = arr;
	}
	
}
function add_elements(colection,element){
	console.log("entro en add elements");
	var exist = 0;
	for ( var i = 0; i < colections.length; i++) {
		console.log("colections[i][0]:"+colections[i][0]);
		console.log("colection:"+colection);
		if(colections[i][0] == colection){
			console.log("entra1");
				exist = 1;
				colections[i].push(element);
			}
	}
	if(!exist){
		var arr = [];
		arr.push(colection);
		arr.push(element);
		console.log(arr[0]);
		console.log(arr[1]);
		colections[colections.length] = arr;
	}
	
	
}
function show_load_colections(){
	console.log("entro en show_load_colections");
	console.log("length:"+ colections.length);
	for(var i = 0; i < colections.length; i++){
		for(var j = 0; j< colections[i].length; j++){
			if(j == 0){
				console.log("va por aquiiiiiiiiiiii");
				var text = '<li id="ccc"no=' + j + '>' + colections[i][j] + '</li>'
				text = text + '</ul>';
				j++;
				$("#colecciones").append(text);
				
			}
		}
	}
	$('li').click(show_load_items);
	
}
function show_load_items(){
	var text = $(this).text();
	document.getElementById("coleccion").innerHTML = text;
	for(var i = 0; i < colections.length; i++){
		for(var j = 0; j< colections[i].length; j++){
			if(colections[i][0] == text){
				if(j!=0){
				col = '<li no=' + k+ '>' + colections[i][j] + '</li>';
				col = col + '</ul>';
				k++;
				$("#coleccion").append(col);
				}
			}
				
		}
	}
	
}
function show_colection(){
	var name = $(this).text();
	document.getElementById("coleccion").innerHTML = name;
	elements_colection(name);
	$( "#coleccion" ).droppable({
		drop: function(ev, ui) {
			var col = (ui.draggable.text());
			if(col != null){
				add_elements(name,col);
				col = '<li no=' + k+ '>' + col + '</li>';
				col = col + '</ul>';
				k++;
				$("#coleccion").append(col);
	}
		}
	});
}

function crearcoleccion(){
	console.log("entra");
	var text = $("#nuevacol").val();
	if(text != null){
		text = '<li no=' + j + '>' + text + '</li>'
		text = text + '</ul>';
		j++;
		$("#colecciones").append(text);
	}
	$('li').click(show_colection);
}


function show_accomodation1(){
	console.log("entra en show_accomodation1");
	hotel = $(this).attr('no');
	console.log(hotel);
  var accomodation = accomodations[hotel];
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var img = accomodation.multimedia.media[0].url;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var subcat = accomodation.extradata.categorias.categoria
   .subcategorias.subcategoria.item[1]['#text'];
  var marker = L.marker([lat, lon]);
	marker.addTo(map)
	 .bindPopup('<a href="' + url + '">' + name + '</a><br/>')
	 .openPopup();
	marker.on("popupclose", function(){
		map.removeLayer(marker);
	})
  map.setView([lat, lon], 15);
  markers.push(marker);
};
function show_accomodation2(){
	console.log("entra en show_accomodation2");
	hotel = $(this).attr('no');
	console.log(hotel);
  var accomodation = accomodations[hotel];
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var img = accomodation.multimedia.media[0].url;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var subcat = accomodation.extradata.categorias.categoria
   .subcategorias.subcategoria.item[1]['#text'];
  var marker = L.marker([lat, lon]);
	marker.addTo(map)
	 .bindPopup('<a href="' + url + '">' + name + '</a><br/>')
	 .openPopup();
  map.setView([lat, lon], 15);
  markers.push(marker);

  $('#desc2').html('<h2>' + name + '</h2>'
   + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
   + desc + '<img src="' + img + '"">');
};


function show_hotel(){
	console.log(hotel);
  var accomodation = accomodations[hotel];
  var url = accomodation.basicData.web;
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var img = accomodation.multimedia.media[0].url;
  var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
  var subcat = accomodation.extradata.categorias.categoria
   .subcategorias.subcategoria.item[1]['#text'];

  $('#desc3').html('<h2>' + name + '</h2>'
   + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
   + desc + '<img src="' + img + '"">');
};


function get_accomodations1(){
  $.getJSON("alojamientos.json", function(data) {
    $('#get1').html('');
    accomodations = data.serviceList.service
    $('#list1').after('<h1>' + accomodations.length + '</h1>');
    var list = '<p>Accomodations found: ' + accomodations.length
     + ' (click on any of them for details and location in the map)</p>'
    list = list + '<ul>'
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<li id="lista1" no=' + i + '>' + accomodations[i].basicData.title + '</li>';
    }
    list = list + '</ul>';
     if(list != ""){
                        $("#table1").append(list);
                    }
		
			$('li#lista1').click(show_accomodation1);
		    
  });
};
function get_accomodations2(){
	$.getJSON("alojamientos.json", function(data) {
    $('#ge2t').html('');
    accomodations = data.serviceList.service
    $('#list2').after('<h1>' + accomodations.length + '</h1>');
    var list = '<p>Accomodations found: ' + accomodations.length
     + ' (click on any of them for details and location in the map)</p>'
    list = list + '<ul>'
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<li id="lista2" no=' + i + '>' + accomodations[i].basicData.title + '</li>';
    }
    list = list + '</ul>';
     if(list != ""){
                        $("#table2").append(list);
                    }
	$('li').draggable({
		inertia: true,
		helper: "clone",
		revert: "invalid"
	})
  });
};
