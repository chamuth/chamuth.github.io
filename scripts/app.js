var appPageIds = ["intro", "projects", "contact"];
var tabButtonIds = ["intro-tab-button", "projects-tab-button", "contact-tab-button"]
var appPages = [];
var tabButtons = [];
var scrollIndex = 0;

function getScrollPercent() {
    var h = appPages[scrollIndex];
    return (h.scrollTop) / ((h.scrollHeight) - h.clientHeight) * 100;
}

function setAppPageClass(pages, className)
{
    pages.forEach((page) => 
    {
        page.classList.remove("down");
        page.classList.remove("up");
        page.classList.add(className);
    });
}

function removeBothClasses(page)
{
    page.classList.remove("down")
    page.classList.remove("up");
}

function renderTabButtonActiveness()
{
    tabButtons.forEach((tabButton) => 
    {
        tabButton.classList.remove("active");
    });

    tabButtons[scrollIndex].classList.add("active");
}

function up()
{
    if (scrollIndex > 0)
    {
        console.log("going up");
        setAppPageClass(appPages.slice(0, scrollIndex), "up");
        setAppPageClass([appPages[scrollIndex]], "down");
        setAppPageClass(appPages.slice(scrollIndex), "down");

        scrollIndex -= 1;

        removeBothClasses(appPages[scrollIndex]);   
    }

    renderTabButtonActiveness();
}

function down()
{
    if (scrollIndex < appPages.length - 1)
    {
        console.log("going down");

        setAppPageClass(appPages.slice(0, scrollIndex), "up");
        setAppPageClass([appPages[scrollIndex]], "up");
        setAppPageClass(appPages.slice(scrollIndex + 2), "down");

        scrollIndex += 1;

        removeBothClasses(appPages[scrollIndex]);   
    }

    renderTabButtonActiveness();
}

(function () {

    // initialize the app page references
    appPageIds.forEach((id) => {
        appPages.push(document.getElementById(id));
    });

    // initialize the tab buttons
    tabButtonIds.forEach((id) => 
    {
        tabButtons.push(document.getElementById(id));
    });

    // Add scroll listener
    window.addEventListener('wheel', function (event) {
        var scroller = appPages[scrollIndex];
        let height = scroller.clientHeight;
        let scrollHeight = scroller.scrollHeight - height;
        let scrollTop = scroller.scrollTop;
        let percent = Math.floor(scrollTop / scrollHeight * 100);

        if (Math.floor(scroller.scrollHeight - height) < 5)
        {
            if (event.deltaY > 0)
            {
                // downwards
                down();
            } else if (event.deltaY < 0)
            {
                // upwards
                up();
            }
        } else if (percent == 100 && event.deltaY > 0) {
            down();
        } else if (percent == 0 && event.deltaY < 0) {
            up();
        }  
    });

    $('.tabs').tabs();
})();