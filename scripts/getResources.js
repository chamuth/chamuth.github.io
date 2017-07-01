$.getJSON( "data/opensource.json?5", function(data) {
	
	var source   = $("#entry-template").html();
	var template = Handlebars.compile(source);

  	for (var i = 0; i < data.length; i++) {
  		var current = data[i];

  		var html = template(current);

  		document.getElementById("opensource-projects").innerHTML += html;
  	}
});