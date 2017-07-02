function visit(url)
{
	openInNewTab("http://www.github.com/" + url);
}

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}