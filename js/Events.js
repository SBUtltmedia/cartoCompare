//Event Handler for Mousedown and Drag
function dragElement(elmnt) {
  console.log(elmnt);
  // elmnt = the element being moved
  // Starting position of the element
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  // When an element is held the mouse can move it downwards
  function dragMouseDown(e) {
    // e is the event to move the window
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // if the mouse is let go of the draging stops
    document.onmouseup = closeDragElement;
    // If the mouse is moved while being held down then the element moves
    document.onmousemove = elementDrag;
  }
  // Follows mouse and moves the element with it
  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }
  // Stops the following of the element with the mouse
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


// When a point is clicked, load the youtube video with the data inside it
// As of now it changes the vid in the main box but we want it to always make a new box and play the youtube vid inside
function pointClicked(data) {
  YT_id = data.youtube_id;
  vidSec = data.video_second;

  // Set the title of the vidBase to that of the video
  if (holdID != YT_id) {
    $.getJSON("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCgM1_j6IwbthlvgEhg_k7oZZ3OjowF7ms&part=snippet&id=" + YT_id, function(data) {
      document.getElementById("vidTitle").innerHTML = data.items[0].snippet.localized.title;
      console.log(data.items[0].snippet.localized.title);
    });
    holdID = YT_id;
  }
  // If the player doesn't exist then it makes one with a start time and id
  if (!player) {
    // Create a new videobase with this video
    tubeFactory.newVid(data);
    player = new YT.Player(('vidVideoHolder'), {
      videoId: YT_id,
      playerVars: {
        autoplay: 0,
        start: vidSec,
        rel: 0,
      },
      events: {
        'onReady': onPlayerReady,
      }
    });

  } else {
    // If a video is already playing, change it
    if (player.loadVideoById) {
      var base = document.getElementById('vidBase');
      base.style.visibility = 'visible';

      var cross = document.getElementById('vidCross');
      cross.style.visibility = 'visible';
      player.loadVideoById(YT_id, vidSec);
    }
  }
  return YT_id;
}


// Changes the window of the map and moves things along side it
// Also used to check zoom levels and change boundies accordingly
function clip() {
  var zoom = map.getZoom();
  if (zoomChange != zoom) {
    //console.log(map.getBounds());
    //console.log(zoom);
    zoomChange = zoom;
    if (zoomChange < 12) {
      map.setMaxBounds(mapBounds[zoomChange]);
    } else {
      map.setMaxBounds(mapBounds[12]);
    }
  }
  if (this == map)
    if ($("#popUp")) {
      $("#popUp").css("visibility", "hidden");
    }

  var northWestCoord = map.containerPointToLayerPoint([0, 0]),
    southEastCoord = map.containerPointToLayerPoint(map.getSize());

  clipX = northWestCoord.x + (southEastCoord.x - northWestCoord.x) * getSliderValue();

  var windowH = $(document).height();
  var windowW = $(document).width();

  leftRect = 'rect(' + [northWestCoord.y, clipX, southEastCoord.y, northWestCoord.x].join('px,') + 'px)'
  rightRect = 'rect(' + [northWestCoord.y, southEastCoord.x, southEastCoord.y, clipX].join('px,') + 'px)';

  $('#leftCover').css('clip', leftRect);
  $('#rightCover').css('clip', rightRect);

  layerSides["leftLayer"].getContainer().style.clip = leftRect;
  // console.log(layerSides["leftLayer"],layerSides["rightLayer"])
  layerSides["rightLayer"].getContainer().style.clip = rightRect;
// console.log(leftRect, rightRect)
  var thumbPos = $(".leaflet-sbs-range")

  $(".leaflet-sbs-divider").css("left", thumbPos);

  map.invalidateSize(true);
}

// Moves the things on screen along with the map
function getSliderValue() {
  var mapWidth = $('#map').css("width");

  var sliderBarWidth = $('#compareSlider').css("width");
  var sliderBarPosX = $('#compareSlider').css("left");

  mapWidth = mapWidth.substr(0, mapWidth.length - 2);

  sliderBarWidth = sliderBarWidth.substr(0, sliderBarWidth.length - 2);
  sliderBarPosX = sliderBarPosX.substr(0, sliderBarPosX.length - 2);

  mapWidth = parseInt(mapWidth);

  sliderBarWidth = parseInt(sliderBarWidth);
  sliderBarPosX = parseInt(sliderBarPosX);

  var barWidthp = sliderBarWidth / mapWidth;
  var sliderBarPosXp = sliderBarPosX / mapWidth;
  return (barWidthp + sliderBarPosXp);
}
