/* TODO: Dots have been placed on the map and can be moved to necessary location
It will be the professors work to do that and edit the year it can be seen in
The code will take these new values and place them accordingly*/

//https://carto.com/developers/carto-js/guides/upgrade-considerations/
////This is where you implement the SQL
//const Pop1960 = new carto.source.SQL(layers["demographics"]["1960"]["sql"]);
//client in data

// Grabs the year from
function extractYear(sql) {
  return sql.split("_")[1];
}

// query string: ?foo=lorem&bar=&baz  //var foo = getParameterByName('foo'); -> "lorem" //have the query string to have like: ?control=TagOption1&control
function resetHighlight(e) {} //callback

function zoomToFeature(e) {} //callback

// Place items within the html
$(document).ready(function() {

  //console.log(layers["Points"])
 //  keyword = getParameterByName("keyword")
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

  // Creates the two indexes for the radio-button divs
  /*HTML */
  function twoRadioForms(S) {
    var demo = Object.keys(layers["demographics"])
    for (i in demo) {
      //console.log(demo[i])
      var listItem = $('<li/>'),
        input = $('<input/>'),
        label = $('<label/>');
      listItem.attr("class", "layer");
      input.attr({
        "type": "radio",
        "id": demo[i],
        "name": S
      });
      label.attr("for", demo[i]);
      label.html(demo[i])
      listItem.append(input)
      listItem.append(label)
      var Aside = '.layers' + S + ' ul ';
      $(Aside).append(listItem)
    }
    $(".layersR .layer #2010").prop("checked", true);
    $(".layersL .layer #1960").prop("checked", true);
  }
  /*HTML */


  // Gets the layer for the cartograph to add to the Leaflet map
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

  // The base layer is the staring position and chartings of the map
  // This is where the boundry properties of the map is set
  function loadBaseLayers() {
    map = L.map('map', {
      zoomControl: true,
      center: [40.789142, -73.064961],
      zoom: 10,
      minZoom: 10,
      maxZoom: 15
    });
    // Change the cursor depending on the element we are on
    // Fitting to tell the user the action they should take in each position
    $('.leaflet-container').css('cursor', 'crosshair');
    $('.compBar').css('cursor', 'ew-resize');
    var mapBounds = L.latLngBounds([41.394543, -70.684156], [40.370698, -75.346929]);

    // Changing levels of boundry based on the zoom level
    // Keeps the user centered around long island
    // After zoomLevel == 11 the entire map is bounded within Long Island
    map.setMaxBounds(mapBounds);
    //console.log(map.getZoom());
    var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
    $('#map').append(legend.render().el);
    retrieveLayer(map, CartoLayerSource, "rightLayer").then(function() {
      retrieveLayer(map, CartoLayerSource, "leftLayer").then(function() {
        //console.log(CartoLayerSource);
        initializeMaps();
      });
    });
  }

  // The labels (names of towns) are added with this function
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

  // Adds the left and right map section for disparity
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

  // Clearns the layer and reloads the map parts
  // done one map movements/changes
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

  // By interactivity this means that the sublayers
  // and the sections can be clicked
  function addInteractivity() {
    var dataToPlayer;
    var leftSub1 = layerSides["leftLayer"].getSubLayer(1);
    var rightSub1 = layerSides["rightLayer"].getSubLayer(1);
    var subArray = [leftSub1, rightSub1]
    subArray.forEach(function(currentLayer) {
      currentLayer.setInteraction(true)
      currentLayer.on('featureClick', function(event, latlng, pos, data, layerIndex) {
        //console.log(event, latlng, pos, data, layerIndex);
        pointClicked(JSON.parse(data.properties));

        $("#vidBase").css({
          "left": event.clientX,
          "top": event.clientY,
          "visibility": "visible"
        });
        //openInfowindow(subArray[currentLayer],data.properties.ge);
      });
    })
  }

  // TODO: Everything after this part in the code needs to be RetConned
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
          console.log(data);
          if (data.year == parseInt(layerDecade)) {
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
            var popCount = popFactory.newPopUp(data.areaname);
            //console.log(data.areaname);
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
          }
        });
      });
    });
    loadLabelLayers();
    window.setTimeout(clip, 500);
  }
});
