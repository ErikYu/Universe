'use strict';

$(document).ready(function () {

  var planetArray = [
    { name: 'Sun', pos: 0, anchor: "#Sun" },
    { name: 'Mercury', pos: 3000, anchor: '#MercuryAnchor', anchorPos: 2850 },
    { name: 'Venus', pos: 7000, anchor: '#VenusAnchor', anchorPos: 6850 },
    { name: 'Earth', pos: 12000, anchor: '#EarthAnchor', anchorPos: 11850 },
    { name: 'Mars', pos: 15000, anchor: '#MarsAnchor', anchorPos: 14850 },
    { name: 'Jupiter', pos: 21000, anchor: '#JupiterAnchor', anchorPos: 20850 },
    { name: 'Saturn', pos: 26000, anchor: '#SaturnAnchor', anchorPos: 25850 },
    { name: 'Uranus', pos: 32000, anchor: '#UranusAnchor', anchorPos: 31850 },
    { name: 'Neptune', pos: 39000, anchor: '#NeptuneAnchor', anchorPos: 38850 },
    { name: 'footer', pos: 45000, anchor: "#footer"}
  ];

  // 'Scroll spy'
  $(window).scroll(function(){ // on scrolling effect, keep track on current planet on planet list
    let scrollPos = $(window).scrollTop(); // position from the top

    for(var i = 1; i <= 8; i++ ){
      let currentPlanet = $("#planetList a[href='"+planetArray[i].anchor+"']"); //anchor for current planet
      if(scrollPos >= 0 && scrollPos <= 1500){
        $("a[href='#Sun']").addClass("active");
      }
      else {
        $("a[href='#Sun']").removeClass("active");
      }
      if(scrollPos >= 43000){
        $("a[href='#footer']").addClass("active");
      }
      else {
        $("a[href='#footer']").removeClass("active");
      }
      if(scrollPos >= planetArray[i].anchorPos-600 && scrollPos <  planetArray[i].anchorPos + 1000){
        currentPlanet.find("li").addClass("active");
      }
      else {
        currentPlanet.find("li").removeClass("active");
      }
    }
  });

  //Binding for resized the planet's image
  $(".planet").find("img").on("click", function(){
    if ($(this).attr("for") == "animation") return false;;
    $(this).attr("for", "animation");
    resizePlanet($(this), 350).then((value) => {$(this).removeAttr("for")}); // just change resize value to make it bigger
  });

  //Clicking arrows to change planets
  $(".arrow").on("click", function(){
    let arrow = $(this).attr("id"); //arrow that has been clicked
    let direction = arrow.slice(5).toLowerCase(); // get direction (up or down), lowercassed
    let currentPlanet; // for keeping an eye on what planet we are currently
    let up; //helps with going into right direction (see if statement below)
    let down;//helps with going into right direction (see if statement below)
    // check on what planet you current are
    //it all depends on scroll position. So, on very top - sun, bottom - footer
    for (var i = 0; i < planetArray.length; i++) {
      if($(window).scrollTop() <  1000) {
        currentPlanet = 0;
        break;
      }
      else if($(window).scrollTop() > 40000) {
        currentPlanet = 9;
        break;
      }
      else if(planetArray[i].anchorPos == $(window).scrollTop()){
          currentPlanet = i;
      }
    }
    //Going up or down
    if(direction == 'up'){
      if(currentPlanet == 1) { // if we are at first planet, and up has been pressed, go to sun!
        $("#Sun").velocity("scroll", 4000, "easeInOutCirc");
      }
      else if(currentPlanet) { //else, go one up in planet list
        up = planetArray[currentPlanet - 1].anchor;
        $("#planetList a[href='"+up+"']").click();
      }
      else { //if it's during animation, disaple button
      //do nothing
      }
    }
    //same code ere
    else if(direction == 'down') {
      if(currentPlanet == 0 || currentPlanet) {
        try { //small cheating in here, as trying going down after 9th station will cause some errors. I don't want to show them ;p
          down = planetArray[currentPlanet + 1].anchor;
          $("#planetList a[href='"+down+"']").click();
        } catch (e) {
          //small cheating :P
        }
      }
      else {
        //do nothing
      }

    }



  });

  //Left-side list of planets toggle
  $("#planetListButton").on("click", function(){
    let parent = $(this).parent();
    if(parseInt(parent.css("left")) < 0) parent.velocity({"left": 0}, 700);
    else { parent.velocity({"left": -100}, 700) }
  });

  //Scrolling to given planet using left side menu and blocking multi clicking
  $("#planetList a").on("click", function(e){
    let dest = $(this).attr("href"); //destination on click -- returns AnchorName
    for (var value of planetArray) { //loop to check if current planet is not destinied array (to prevent from going to the planet that you are currently at)
      if(value.anchor == dest && value.anchorPos == $(window).scrollTop()) return false;
      if(value.anchor == dest && value.pos == $(window).scrollTop()) return false;
    }
    e.preventDefault(); //disable <a> tag from working as it should
    if($(this).attr("disabled")) return false; //disabled buttons cannot be multiclicked (avoiding click spam)
    $("#planetList a").attr("disabled", true); // set every link to disabled
    $(dest).velocity("scroll", 4000, "easeInOutCirc", function() {
      $("#planetList a").removeAttr("disabled") //after animation is finished, remove disabled attr
    });
  });

  //binding event for buttons to reveal Facts or Info about given planet
  $(".planet").find("button").on('click', function(e){
    $(this).parent().find("div.planetInfoTable").slideToggle(600, swapArrow.bind($(this)));
    $(this).parent().find("div.planetFactsParagraph").slideToggle(600, swapArrow.bind($(this)));
  });

  // ****************** FUNCTIONS *********************************** //


  //function that swaps that small arrows next to Facts/Info. Works on every planet
    function swapArrow() {
    const arrStatus = $(this).find("span");
    switch(arrStatus.html()){
      case '↓': //if arrow is down
        arrStatus.html('↑');
        break;
      case '↑':
        arrStatus.html("↓");
        break;
    }
  }
  //function used in resizing planets. No more closure thought, as
  function resizePlanet (planet, resizeValue) { // returning a promise, we need that to avoid 'resize bug'
    return new Promise(function(resolve, reject){
      let factParagraph = planet.parent().find(".planetFacts");
        if(parseInt(planet.css("width")) > 200) { resizeValue *= -1 }
        planet.velocity({
          "max-width": "+="+resizeValue,
          "max-height": "+="+resizeValue
        },{duration: 600, complete: resolve});
        factParagraph.velocity({
          "margin-left": "-="+resizeValue
        },{duration: 600, complete: resolve});

    })
  }
});
