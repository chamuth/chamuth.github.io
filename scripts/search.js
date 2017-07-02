var last = 0;

function search()
{
	var searchterm = $("#projectsearch").val();

	if (searchterm.replace(" ", "") != "")
	{
		// Clear the results first
		var items = $("#opensource-projects").children();

		for (var i = 0; i < items.length; i++) {
			var current = $(items[i]);		

			var title = current.find(".project-title").html();
			var description = current.find(".project-description").html();

			if (title != null && description != null)
			{
				$(current).hide()	
			}
		}

		var counter = 0;

		for (var i = 0; i < items.length; i++) {
			var current = $(items[i]);		

			var title = current.find(".project-title").html();
			var description = current.find(".project-description").html();

			if (title != null && description != null)
			{
				if (title.toLowerCase().includes(searchterm.toLowerCase()) || description.toLowerCase().includes(searchterm.toLowerCase()))
				{
					$(current).fadeIn();
					counter++;
				}else{
					$(current).fadeOut();
				}
			}
		}

		$("#searchresults").html("Found " + counter.toString() + " projects for \"" + searchterm + "\"");
		$("#searchresults").slideDown();

	}else{
		$("#searchresults").slideUp();

		var items = $("#opensource-projects").children();

		for (var i = 0; i < items.length; i++) {
			var current = $(items[i]);		

			var title = current.find(".project-title").html();
			var description = current.find(".project-description").html();

			if (title != null && description != null)
			{
				$(current).fadeIn();	
			}
		}
	}

}