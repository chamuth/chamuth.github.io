var progressIds = ["progress-1", "progress-2"];
var progressBars = [];

// Initialize the progressbars
progressIds.forEach((id) => 
{
    progressBars.push(document.getElementById(id).children[0]);    
});

setProgress = (index, progress) => 
{
    if (progressBars[index])
        progressBars[index].style.height = progress.toString() + "%";    
}

var sectionsIds = ["projects", "about"];
var sections = [];

// Initialize the sections
sectionsIds.forEach((id) => {
    sections.push(document.getElementById(id));
});

document.onscroll = (e) => 
{
    var topScroll = (document.documentElement.scrollTop);

    // reset all progress
    for(var i = 0; i < pageIndicators.length; i++)
    {
        setProgress(i, 0);
        pageIndicators[i].classList.remove("complete");
    }

    // set progress based on the scroll
    for (var i = 0; i < progressIds.length; i++)
    {
        const anchorOffset = 150;

        if (sections[i].offsetTop - anchorOffset > topScroll)
        {
            if (i == 0)
            {
                // not yet scrolled there
                setProgress(i, topScroll / (sections[i].offsetTop - anchorOffset) * 100)
            } else {
                setProgress(i, (topScroll - sections[i - 1].offsetTop + anchorOffset) / (sections[i].offsetTop - sections[i - 1].offsetTop + anchorOffset) * 100);
            }
            
            pageIndicators[i].classList.add("complete");
            break;
        } else {
            if (i == progressIds.length - 1)
                pageIndicators[i + 1].classList.add("complete");
            
            setProgress(i, 100);   
        }
    }
}

var pageIndicators = document.getElementsByClassName("page");


// Load the portfolio
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var projects = JSON.parse(httpGet("data/projects.json"));
var projectsContainer = document.getElementById("projects-container");
var projectCardTemplate = document.getElementById("project-card").innerHTML;
var projectCard = Handlebars.compile(projectCardTemplate);

projects.forEach((project) => 
{
    var html = projectCard(project);
    projectsContainer.innerHTML = projectsContainer.innerHTML + html;
});

// added the projects
$(".image-thumbnail").simpleLightbox({});

// JS tag cloud

$( document ).ready( function() {
    var entries = [ 
        { label: 'Back to top', url: 'https://www.jqueryscript.net/tags.php?/Back%20to%20top/', target: '_top' },
        { label: 'Bootstrap', url: 'https://www.jqueryscript.net/tags.php?/Bootstrap/', target: '_top' },
        { label: 'Carousel', url: 'https://www.jqueryscript.net/tags.php?/carousel/', target: '_top' },
        { label: 'Countdown', url: 'https://www.jqueryscript.net/tags.php?/countdown/', target: '_top' },
        { label: 'Dropdown Menu', url: 'https://www.jqueryscript.net/tags.php?/Drop%20Down%20Menu/', target: '_top' },
        { label: 'CodePen', url: 'https://codepen.io/', target: '_top' },
        { label: 'three.js', url: 'https://threejs.org/', target: '_top' },
        { label: 'Form Validation', url: 'https://www.jqueryscript.net/tags.php?/form%20validation/', target: '_top' },
        { label: 'JS Compress', url: 'http://jscompress.com/', target: '_top' },
        { label: 'TinyPNG', url: 'https://tinypng.com/', target: '_top' },
        { label: 'Can I Use', url: 'http://caniuse.com/', target: '_top' },
        { label: 'URL shortener', url: 'https://goo.gl/', target: '_top' },
        { label: 'Grid Layout', url: 'https://www.jqueryscript.net/tags.php?/grid%20layout/', target: '_top' },
        { label: 'Twitter', url: 'https://twitter.com/niklaswebdev', target: '_top' },
        { label: 'deviantART', url: 'http://nkunited.deviantart.com/', target: '_top' },
        { label: 'Gulp', url: 'http://gulpjs.com/', target: '_top' },
        { label: 'Browsersync', url: 'https://www.browsersync.io/', target: '_top' },
        { label: 'GitHub', url: 'https://github.com/', target: '_top' },
        { label: 'Shadertoy', url: 'https://www.shadertoy.com/', target: '_top' },
        { label: 'Tree View', url: 'https://www.jqueryscript.net/tags.php?/tree%20view/', target: '_top' },
        { label: 'jsPerf', url: 'http://jsperf.com/', target: '_top' },
        { label: 'Foundation', url: 'https://foundation.zurb.com/', target: '_top' },
        { label: 'CreateJS', url: 'https://createjs.com/', target: '_top' },
        { label: 'Velocity.js', url: 'http://julian.com/research/velocity/', target: '_top' },
        { label: 'TweenLite', url: 'https://greensock.com/docs/#/HTML5/GSAP/TweenLite/', target: '_top' },
        { label: 'jQuery', url: 'https://jquery.com/', target: '_top' },
        { label: 'Notification', url: 'https://www.jqueryscript.net/tags.php?/Notification/', target: '_top' },
        { label: 'Parallax', url: 'https://www.jqueryscript.net/tags.php?/parallax/', target: '_top' }
    ];
    var settings = {
        entries: entries,
        width: 600,
        height: 500,
        radius: '65%',
        radiusMin: 75,
        bgDraw: false,
        bgColor: '#f5f5f5',
        opacityOver: 1,
        opacityOut: 0.15,
        opacitySpeed: 6,
        fov: 1000,
        speed: 1,
        fontFamily: 'Saira Semi Condensed, Arial, sans-serif',
        fontSize: '15',
        fontColor: '#192965',
        fontWeight: 'bold',//bold
        fontStyle: 'normal',//italic 
        fontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: true
    };
    //var svg3DTagCloud = new SVG3DTagCloud( document.getElementById( 'holder'  ), settings );
    $( '#tag-cloud' ).svg3DTagCloud( settings );
} );
