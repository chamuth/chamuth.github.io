$(".fa.fa-facebook").hover(function() 
{
	$(".facebook.contenter").fadeIn('fast');

	$(".social-network-info.facebook-color").animate({
		"width" : "205vw",
		"height" : "205vw",
		"opacity" : 1
	}, 250);
},
function()
{
	$(".facebook.contenter").fadeOut('fast');

	$(".social-network-info.facebook-color").animate({
		"width" : "0",
		"height" : "0",
		"opacity" : 0
	},250);
});

$(".fa.fa-twitter").hover(function() 
{
	$(".twitter.contenter").fadeIn('fast');

	$(".social-network-info.twitter-color").animate({
		"width" : "205vw",
		"height" : "205vw",
		"opacity" : 1
	}, 250);
},
function()
{
	$(".twitter.contenter").fadeOut('fast');

	$(".social-network-info.twitter-color").animate({
		"width" : "0",
		"height" : "0",
		"opacity" : 0
	},250);
});


$(".fa.fa-google-plus").hover(function() 
{
	$(".google-plus.contenter").fadeIn('fast');

	$(".social-network-info.google-plus-color").animate({
		"width" : "205vw",
		"height" : "205vw",
		"opacity" : 1
	}, 250);
},
function()
{
	$(".google-plus.contenter").fadeOut('fast');

	$(".social-network-info.google-plus-color").animate({
		"width" : "0",
		"height" : "0",
		"opacity" : 0
	},250);
});

$(".fa.fa-linkedin").hover(function() 
{
	$(".linkedin.contenter").fadeIn('fast');

	$(".social-network-info.linkedin-color").animate({
		"width" : "205vw",
		"height" : "205vw",
		"opacity" : 1
	}, 250);
},
function()
{
	$(".linkedin.contenter").fadeOut('fast');

	$(".social-network-info.linkedin-color").animate({
		"width" : "0",
		"height" : "0",
		"opacity" : 0
	},250);
});
