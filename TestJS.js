// TODO: Rewrite this entire code with better names and uses

addPointSublayers();
var pinnedCharts = {};

// Creates a base for the population piechart and implements each part
var popFactory = {
  popUpCount: 0,
  newPopUp: function(areaname) {
    this.popUpCount++;
    var popUp = $('<div/>');
    var textDiv = $('<div/>');
    var pieChart = $('<div>');
    var crossSVG = $(xCross);
    var pinSVG = $(SVGstr);

    // Appends each part to the base
    popUp.append(crossSVG);
    popUp.append(textDiv)
    popUp.append(pieChart);
    popUp.append(pinSVG);

    // Edits to the attributes and css of the parts

    //---------------------\\
    textDiv.attr('id', 'titleText');
    textDiv.css('text-align', 'center');
    textDiv.text(areaname);

    popUp.attr('id', 'popUp' + this.popUpCount)
    popUp.attr('class', 'popUp');

    pinSVG.attr("id", "pin_" + this.popUpCount);

    pieChart.attr('id', 'pieChart' + this.popUpCount)

    crossSVG.css("margin", "0 300 0");
    crossSVG.css("display", "block");
    //---------------------\\

    // When either svg is clicked then they perform their own functions
    //---------------------\\
    crossSVG.on("click", function(evt) {
      popUp.remove();
      this.popUpCount--;
    })

    pinSVG.on("click", function(evt) {
      if ($(this).hasClass('pinned')) {
        popUp.remove();
        this.popUpCount--;
      }
      $(this).toggleClass("pinned");
    })
    //---------------------\\

    // Append the DIV to the div found in the index file
    // Displays it on the website
    $('#popUpHolder').append(popUp);

    // Makes the div draggable
    dragElement(document.getElementById(popUp.attr('id')));

    return this.popUpCount;
  }
}

// Factory to make a new base for videos when a spot is clicked
var tubeFactory = {
  vidCount: 0,
  newVid: function(data) {
    // All parts of the vidBase and the base itself
    var crossSVG = $(xCross);
    var pinSVG = $(SVGstr);
    var vidBase = $('<div/>');
    var vidTitle = $('<div>');
    var vidVideo = data;

    // The number of videos on screen
    this.vidCount++;

    console.log("New Video" + data);

    //---------------------\\
    vidBase.attr('id', 'vidBaseNum' + this.vidCount);
    vidBase.append(crossSVG, vidTitle, vidVideo, pinSVG);

    pinSVG.attr("id", "pin_" + this.vidCount);
    //---------------------\\

    // The functions of each svg

    //---------------------\\
    crossSVG.on("click", function(evt) {
      vidBase.remove();
      this.vidCount--;
    })

    pinSVG.on("click", function(evt) {
      if ($(this).hasClass('pinned')) {
        vidBase.remove();
        this.vidCount--;
      }
      $(this).toggleClass("pinned");
    })
    //---------------------\\

    // Displays the videobase on the website
    $('#playerHolder').append(vidBase)

  }
}

function dragElement(elmnt) {
  // elmnt = the element being moved
  // Startubg position of the element
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

// Grabs the year from
function extractYear(sql) {
  console.log(sql)
  return sql.split("_")[1];
}

function addPointSublayers() {
  console.log(layers)
  decades.forEach(function(decade) {
    // //console.log(decade+" 5")
    layers["Points"][decade] = {
      cartocss: "#Points { marker-width: 15; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}",
      sql: "SELECT * FROM latinos.comparisonmappoints where decade='" + decade + "'",
      interactivity: 'name, properties, cartodb_id, options, captions'
    };
  })
}

function limitPoints(QueryStringArr) { //
  var newSQL = CartoLayerSource[sublayers][1][sql];
  QueryStringArr.forEach(function(kewordStr) {
    newSQL += "and options like '%" + keywordStr + "%'";
  });
  CartoLayerSource[sublayers][1][sql] = newSQL;
} // CONCATENATE EACH KEYWORD IN QUERYSTRING INTO SQL

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// query string: ?foo=lorem&bar=&baz  //var foo = getParameterByName('foo'); -> "lorem" //have the query string to have like: ?control=TagOption1&control
function resetHighlight(e) {} //callback

function zoomToFeature(e) {} //callback

function pointClicked(data) {
  //console.log(data);
  YT_id = data.youtube_id;
  //console.log(YT_id);
  vidSec = data.video_second;
  if (!player) {
    player = new YT.Player('playerDiv', {
      height: '236.25px',
      width: '420px',
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
    //console.log(player, YT_id, vidSec, data)
    if (player.loadVideoById) player.loadVideoById({
      videoId: YT_id,
      startSeconds: vidSec
    });
  }
  tubeFactory.newVid(data);
  return YT_id;
}

function onPlayerReady(event) {
  event.target.playVideo();
}

$(document).ready(function() {
  //console.log(layers["Points"])
  keyword = getParameterByName("keyword")
  loadBaseLayers()
  $("#compareSlider").draggable({
    axis: 'x',
    containment: "parent",
    start: function() {
      clip()
    },
    drag: function() {
      clip()
    },
    stop: function() {
      clip()
    }
  });

  function layerLoaded(layer) {}

  function twoRadioForms(S) {
    var demo = Object.keys(layers["demographics"])
    for (i in demo) {
      //console.log(demo[i])
      var li = $('<li/>'),
        input = $('<input/>'),
        label = $('<label/>');
      li.attr("class", "layer");
      input.attr({
        "type": "radio",
        "id": demo[i],
        "name": S
      });
      label.attr("for", demo[i]);
      label.html(demo[i])
      li.append(input)
      li.append(label)
      var Aside = '.layers' + S + ' ul ';
      $(Aside).append(li)
    }
    $(".layersR .layer #2010").prop("checked", true);
    $(".layersL .layer #1960").prop("checked", true);
  }

  function retrieveLayer(map, cartoLayerSource, layerSide) {
    return new Promise(function(resolve, reject) {
      cartodb.createLayer(map, cartoLayerSource).addTo(map).on('done', function(layer) {
        //console.log(layer);
        layerSides[layerSide] = layer;
        resolve("loaded")
      }).on('error', function(error) {
        //console.log(error);
      });
    })
  }

  function loadBaseLayers() {
    map = L.map('map', {
      zoomControl: true,
      center: [40.789142, -73.134961],
      zoom: 9,
      minZoom: 9,
      maxZoom: 15
    });
    console.log(map);
    //setMaxBounds(L.latLng(40.7894, 73.5359),L.latLng(41.0802, 72.4732));
    var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
    $('#map').append(legend.render().el);
    retrieveLayer(map, CartoLayerSource, "rightLayer").then(function() {
      retrieveLayer(map, CartoLayerSource, "leftLayer").then(function() {
        //console.log(CartoLayerSource);
        initializeMaps();
      });
    });
  }

  function loadLabelLayers() {
    Object.keys(layerSides).forEach(function(currentLayer) {
      layerSides[currentLayer].createSubLayer({
        type: "http",
        urlTemplate: "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c"]
      });
    })
    addInteractivity();
  }

  function initializeMaps() {
    var LR = ["L", "R"];
    LR.forEach(function(currentLR) {
      twoRadioForms(currentLR)
      $("input[name='" + currentLR + "']").change(function() {
        clearandReload();
      });
    });
    loadSubLayers()
    // window.setTimeout(addInteractivity(), 500);
  }
  map.on('move', clip);

  function clearandReload() {
    clearSubLayers()
    loadSubLayers()
  }

  function clearSubLayers() {
    Object.keys(layerSides).forEach(function(currentLayer) {
      layerSides[currentLayer].getSubLayers().forEach(function(sublayer) {
        sublayer.remove();
      });
    });
  }

  function addInteractivity() {
    var dataToPlayer;
    var leftSub1 = layerSides["leftLayer"].getSubLayer(1);
    var rightSub1 = layerSides["rightLayer"].getSubLayer(1);
    var subArray = [leftSub1, rightSub1]
    subArray.forEach(function(currentLayer) {
      currentLayer.setInteraction(true)
      currentLayer.on('featureClick', function(event, latlng, pos, data, layerIndex) {
        pointClicked(JSON.parse(data.properties));
        //,"visibility": "visible"
        $("#playerDiv").css({
          "left": event.clientX + 5,
          "top": event.clientY + 5
        });

        $("#playerDiv").css({
          "visibility": "visible"
        });

        $("#playerHolder").css({
          "visibility": "visible"
        });

        $("#caption").css({
          "top": event.clientY - 7.5,
          "left": event.clientX + 5
        });

        //  $("#caption").text(data.captions);
        $("#caption").text(data.captions);

        $("#caption").css({
          'text-align': 'center',
          "visibility": "hidden"
        });

        //openInfowindow(subArray[currentLayer],data.properties.ge);
      });
    })
  }

  function loadSubLayers() {
    var callOutToInfoWindow = [];
    var cnt = 0;
    Object.keys(layerSides).forEach(function(thisLayer) {
      $.each($("input[name='" + layerShortHand[thisLayer] + "']:checked"), function() {
        var demo = layerSides[thisLayer].createSubLayer(layers.demographics[$(this).attr("id")]);
        //console.log(demo)
        layerSides[thisLayer].createSubLayer(layers.Points[$(this).attr("id")]);
        demo.setInteraction(true);
        callOutToInfoWindow.push(demo);
        demo.on('featureClick', function(event, latlng, pos, data, layerIndex) {
          var layerDecade;
          var cursorCoordinates = map.mouseEventToLayerPoint(event);
          var layerPoint = cursorCoordinates.x;
          var OverclipX = (layerPoint > clipX) ? true : false;
          if (OverclipX === true) {
            layerDecade = layerSides["rightLayer"].layers[0].options.sql.substring(8, 12);
          } else {
            layerDecade = layerSides["leftLayer"].layers[0].options.sql.substring(8, 12);
          }
          if (data.year == parseInt(layerDecade)) {
            //console.log(charts)
            //                      for (child in $('#popUpHolder').children()) {
            //                            var ID = child.attr('id');
            //                          //console.log(ID);
            //                            if (charts[id] ==false){
            //                                $(ID).remove();
            //                                delete charts[id];
            //                            }
            //                      }
            //
            if ($('#popUpHolder').children().length > 0) {

              var popUpChildren = $('#popUpHolder').children()

              //console.log(popUpChildren.length)
              var count = popUpChildren.length;
              while (i = count--) {

                var pin = $(popUpChildren[i - 1]).find("svg")
                //console.log(i)
                //console.log($(popUpChildren[i - 1]).find("svg"))
                if (!$(pin).hasClass('pinned')) {
                  $(popUpChildren[i - 1]).remove();

                }
              }
              //$('#popUpHolder').empty(); //commenting this out creates multiple pie charts
            }
            //
            //                        //console.log("------")
            //                        //console.log("CartoDB_ID:" + data.cartodb_id)
            //                        //console.log("Hispanic%:" + (data.pct_hispanic) + "%")
            //                        //console.log("Decade:" + layerDecade)
            var popCount = popFactory.newPopUp(data.areaname);
            console.log(data.areaname);
            //string param is data.censuspolygon
            $("#popUp" + popCount).css({
              "left": event.clientX + 5,
              "top": event.clientY + 5,
              "visibility": "visible"
            });
            pieChartData["0"].value = data.hispanic;
            pieChartData["1"].value = data.non_hispanic;
            pieConfig.header.subtitle.text = data.total_pop;
            var pie = new d3pie("pieChart" + popCount, pieConfig);
            //$("#popUp").html(pie); // doesnt work
            //http://d3pie.org/#quickStart
          }
        });
      });
    });
    loadLabelLayers();
    window.setTimeout(clip, 500);
  }
});

function extractLayerDecades() {
  $.each($("input[name='L']:checked"), function(year) {
    IDsHover["L"] = year
  });
  $.each($("input[name='R']:checked"), function(year) {
    IDsHover["R"] = year
  });
}

function clip() {
  if (this == map)
    if ($("#popUp")) {
      $("#popUp").css("visibility", "hidden");
    }
  if ($("#playerHolder")) {
    $("#playerHolder").css("visibility", "hidden");
    $("#playerDiv").css("visibility", "hidden");
    $("#caption").css("visibility", "hidden");
  }
  var nw = map.containerPointToLayerPoint([0, 0]),
    se = map.containerPointToLayerPoint(map.getSize());
  clipX = nw.x + (se.x - nw.x) * getSliderValue();
  var windowH = $(document).height();
  var windowW = $(document).width();
  leftRect = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)'
  rightRect = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';
  $('#leftCover').css('clip', leftRect);
  $('#rightCover').css('clip', rightRect);
  layerSides["leftLayer"].getContainer().style.clip = leftRect;
  layerSides["rightLayer"].getContainer().style.clip = rightRect;
  var thumbPos = $(".leaflet-sbs-range")
  $(".leaflet-sbs-divider").css("left", thumbPos);
  map.invalidateSize(true);
}

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
