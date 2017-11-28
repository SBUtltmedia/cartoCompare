//TAGFilterButttonvv
/** //TAG FILTER BUTTON
    //EVENT LISTENER FOR CHECKBOX(seehttps://stackoverflow.com/questions/8423217/jquery-checkbox-checked-state-changed-event)
    // WHEN CHECKED, CHANGES QUERY STRING (see https://stackoverflow.com/questions/35395485/change-url-without-refresh-the-page_)
    //, WHICH THE QUERY STRING IS CALLED AS A PARAMETER (see https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
    //TO GET THE KEYWORD FOR THE INTERACTIVITY OF THE POINT TO RELOAD IT. 
**/

//INFOWINDOW
    //https://gis.stackexchange.com/questions/135919/can-i-trigger-a-cartodb-infowindow-programmatically

// enable interactivity for demographics decade sublayers then for infowindow -> https://gis.stackexchange.com/questions/135919/can-i-trigger-a-cartodb-infowindow-programmatically



//Find XPos of mouse location where clickef





var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var map;
var layerSides = {
    "rightLayer": {}
    , "leftLayer": {}
};
var clipX;
var layerShortHand={"rightLayer":"R", "leftLayer":"L"}
var IDsHover = {"L":null,"R":null};
var CartoLayerSource = {
    user_name: "latinos"
    , api_key: "3e12024aff2f3326a1db97e6c877e79e02bd8ced"
    , type: 'cartodb'
    , maps_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}"
    , sql_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}"
    , sublayers: [
            ]
};

var decades = ["1960","1970","1980","1990","2000","2010"];

var geoInteractivity = ['cartodb_id', 'areaname', 'pct_hispanic','total_pop','hispanic','non_hispanic','year'];

var layers = {
    "demographics": {
        '1960': {
            sql: "SELECT '1960' as year, latinos.tract_1960.cartodb_id, latinos.tract_1960.gisjoin, latinos.tract_1960.the_geom, latinos.tract_1960.the_geom_webmercator, ca4001 as total_pop, ca7001 as hispanic, ca4001 - ca7001 as non_hispanic, round(ca7001 * 1.0 / ca4001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1960 INNER JOIN latinos.census_1960_tract_li ON latinos.tract_1960.gisjoin = latinos.census_1960_tract_li.gisjoin WHERE ca4001 != 0"
            , cartocss: addGeoCSS(),
            interactivity:geoInteractivity
        }
        , '1970': {
            sql: "SELECT '1970' as year, latinos.tract_1970.cartodb_id, latinos.tract_1970.gisjoin, latinos.tract_1970.the_geom, latinos.tract_1970.the_geom_webmercator, C1I001 as total_pop, C11001 as hispanic, C1I001 - C11001 as non_hispanic, round(C11001 * 1.0 / C1I001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1970 INNER JOIN latinos.census_1970_tract_li ON latinos.tract_1970.gisjoin = latinos.census_1970_tract_li.gisjoin WHERE C1I001 != 0 AND C11001 >= 0"
            , cartocss: addGeoCSS(),
            interactivity:geoInteractivity
        }
        , '1980': {
            sql: "SELECT '1980' as year,  latinos.tract_1980.cartodb_id, latinos.tract_1980.gisjoin, latinos.tract_1980.the_geom, latinos.tract_1980.the_geom_webmercator, C9E001 +C9F001 as total_pop, C9F001 as hispanic, C9E001 as non_hispanic, round(C9F001 *1.0 / (C9E001+C9F001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1980 INNER JOIN latinos.census_1980_tract_li ON latinos.tract_1980.gisjoin = latinos.census_1980_tract_li.gisjoin WHERE C9F001 != 0 AND C9E001 >=0" 
            , cartocss: addGeoCSS(),
            interactivity:geoInteractivity
        }
        , '1990': {
            sql: "SELECT '1990' as year,  latinos.tract_1990.cartodb_id, latinos.tract_1990.gisjoin, latinos.tract_1990.the_geom, latinos.tract_1990.the_geom_webmercator, EU1001  +EU0001 as total_pop, EU0001 as hispanic, EU1001 as non_hispanic, round(EU0001  *1.0 / (EU0001 +EU1001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1990 INNER JOIN latinos.census_1990_tract_li_update ON latinos.tract_1990.gisjoin = latinos.census_1990_tract_li_update.gisjoin WHERE (EU0001+EU1001)!=0 AND EU0001*1.0 >=0"
            , cartocss: addGeoCSS(),
            interactivity:geoInteractivity
        }
        , '2000': {
            sql: "SELECT '2000' as year,  latinos.tract_2000.cartodb_id, latinos.tract_2000.gisjoin, latinos.tract_2000.the_geom, latinos.tract_2000.the_geom_webmercator, FMC001 +FMC002 as total_pop, FMC001 as hispanic, FMC002 as non_hispanic, round(FMC001 *1.0 / (FMC001+FMC002) *100, 1) as pct_hispanic, latinos.tract_2000.cartodb_id as areaname FROM latinos.tract_2000 INNER JOIN latinos.census_2000_tract_li_update ON latinos.tract_2000.gisjoin = latinos.census_2000_tract_li_update.gisjoin WHERE (FMC001+FMC002)!=0 AND FMC001*1.0>=0"
            , cartocss: addGeoCSS(),
           interactivity:geoInteractivity
        }
        , '2010': {
            sql: "SELECT '2010' as year,  latinos.tract_2010.cartodb_id, latinos.tract_2010.gisjoin, latinos.tract_2010.the_geom, latinos.tract_2010.the_geom_webmercator, IC2001 as total_pop, IC2003 as hispanic, IC2002 as non_hispanic, round(IC2003 *1.0 / IC2001 *100, 1) as pct_hispanic, latinos.tract_2010.cartodb_id as areaname FROM latinos.tract_2010 INNER JOIN latinos.census_2010_tract_li_update ON latinos.tract_2010.gisjoin = latinos.census_2010_tract_li_update.gisjoin WHERE IC2001!=0 AND (IC2002*1.0)>=0"
            , cartocss: addGeoCSS(),
            interactivity:geoInteractivity
        }
    }
    , "Points": {
        
    }
}

addPointSublayers();

function extractYear(sql){
    return sql.split("_")[1];
}


function addPointSublayers(){
    console.log(layers["Points"])
     decades.forEach(function(decade){
       // console.log(decade+" 5")
        layers["Points"][decade]={
            interactivity:'name, properties, cartodb_id, options',
                cartocss:"#Points { marker-width: 15; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}",
              sql:"SELECT * FROM latinos.comparisonmappoints where decade='"+decade+"'",
            };
 
    })
}

function limitPoints(QueryStringArr){//
    var newSQL = CartoLayerSource[sublayers][1][sql];
    QueryStringArr.forEach(function(kewordStr){
            newSQL+="and options like '%"+keywordStr+"%'";
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

// query string: ?foo=lorem&bar=&baz
//var foo = getParameterByName('foo'); // "lorem"
//
//have the query string to have like: ?control=TagOption1&control

///////////////////////////////////////////
///////////////////////////////////////////
function openInfowindow(layer, latlng, cartodb_id) {
    console.log(122)
    layer.trigger('featureClick', null, latlng, null, { cartodb_id: cartodb_id }, 0);
}
///////////////////////////////////////////
/////////////for working on infoWindow/////
///////////////////////////////////////////

function addGeoCSS() {
    return '#layer { polygon-fill: #810f7c; polygon-opacity: 1; line-width: 0.5; line-color: #b9b1b1; line-opacity: 0.5; } #layer[ pct_hispanic <= 80] { polygon-fill: #8856a7; } #layer[ pct_hispanic <= 40] { polygon-fill: #8c96c6; } #layer [ pct_hispanic <= 20] { polygon-fill: #9ebcda; } #layer [ pct_hispanic <= 10] { polygon-fill: #bfd3e6; } #layer [ pct_hispanic <= 5] { polygon-fill: #edf8fb; }';
}

function addPointCSS(){
    return "#Points { marker-width: 15; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}";
}



var legend = new cdb.geo.ui.Legend({
    type: "custom"
    , title: "Percent of Latino Population"
    , data: [{
        name: "80% or more"
        , value: "#810f7c"
            }, {
        name: "40% - 80%"
        , value: "#8856a7"
            }, {
        name: "20% - 40%"
        , value: "#8c96c6"
            }, {
        name: "10% - 20%"
        , value: "#9ebcda"
            }, {
        name: " 5% - 10%"
        , value: "#bfd3e6"
            }, {
        name: "5% or less"
        , value: "#edf8fb"
            }]
});
function resetHighlight(e) {} //callback
function zoomToFeature(e) {} //callback
var geojson;
var player;
var vidPopup;
var vidPlayer;
var keyword;
function pointClicked(data) {
    console.log(data);
    YT_id = data.youtube_id;
    vidSec = data.video_second;
    if (!player) {
        player = new YT.Player('playerDiv', {
            height: '236.25'
            , width: '420'
            , videoId: YT_id
            , playerVars: {
                autoplay: 0
                , start: vidSec
                , rel: 0
            , }
            , events: {
                'onReady': onPlayerReady
            , }
        });
    }
    else {
        console.log(player, YT_id, vidSec, data)
      if(player.loadVideoById)  player.loadVideoById({
            videoId: YT_id
            , startSeconds: vidSec
        });
    }
    return YT_id;
}



function onPlayerReady(event) {
    event.target.playVideo();
}
////////////
/**  L.control.tagFilterButton({
        data: ['origin', 'childhood', 'adulthood','none'],
        icon: '<img src="filter.png">',
        filterOnEveryClick: true
    }).addTo( map );**/
$(document).ready(function () {
  
    console.log(layers["Points"])
    keyword =getParameterByName("keyword")
    
    loadBaseLayers()
    $("#compareSlider").draggable({
        axis: 'x'
        , containment: "parent"
        , start: function () {
            clip()
        }
        , drag: function () {
            clip()
        }
        , stop: function () {
            clip()
        }
    });

    function layerLoaded(layer) {}

    function twoRadioForms(S) {
        var demo = Object.keys(layers["demographics"])
        for (i in demo) {
            //console.log(demo[i])
            var li = $('<li/>')
                , input = $('<input/>')
                , label = $('<label/>');
            li.attr("class", "layer");
            input.attr({
                "type": "radio"
                , "id": demo[i]
                , "name": S
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
        return new Promise(function (resolve, reject) {
            cartodb.createLayer(map, cartoLayerSource).addTo(map).on('done', function (layer) {
                console.log(layer);
                layerSides[layerSide] = layer;
                resolve("loaded")
            }).on('error', function(error) {
                console.log(error);
            });
        })
    }

    function loadBaseLayers() {
        map = L.map('map', {
            zoomControl: true
            , center: [40.789142, -73.134961]
            , zoom: 9
        });
        var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
        $('#map').append(legend.render().el);
        retrieveLayer(map, CartoLayerSource, "rightLayer").then(function () {
            retrieveLayer(map, CartoLayerSource, "leftLayer").then(function () {
                initializeMaps();
            });
        });
    }

    function loadLabelLayers() {
        Object.keys(layerSides).forEach(function(currentLayer){
        layerSides[currentLayer].createSubLayer({
            type: "http"
            , urlTemplate: "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
            , subdomains: ["a", "b", "c"]
        });
        })
    addInteractivity();
    }

    function initializeMaps() {
        var LR= ["L","R"];
        LR.forEach(function(currentLR){
            twoRadioForms(currentLR)
            $("input[name='"+currentLR+"']").change(function () {
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
        Object.keys(layerSides).forEach(function(currentLayer){
            layerSides[currentLayer].getSubLayers().forEach(function (sublayer) {
                sublayer.remove();
            });
        });
    }

    function addInteractivity() {
        var dataToPlayer;
        var leftSub1 = layerSides["leftLayer"].getSubLayer(1);
        var RightSub1 = layerSides["rightLayer"].getSubLayer(1);
        var subArray = [leftSub1, RightSub1]
        subArray.forEach(function (currentLayer) {
            currentLayer.setInteraction(true)
            currentLayer.on('featureClick', function (event, latlng, pos, data, layerIndex) {
                pointClicked(JSON.parse(data.properties));
                console.log(data.properties);
                //openInfowindow(subArray[currentLayer],data.properties.ge);
            });
        }) 
    }

    function loadSubLayers() { 
        var callOutToInfoWindow=[];
        var cnt=0;
        Object.keys(layerSides).forEach(function (thisLayer){
            $.each($("input[name='"+layerShortHand[thisLayer]+"']:checked"), function () {
            var demo=layerSides[thisLayer].createSubLayer(layers.demographics[$(this).attr("id")]);
                console.log(demo)
            layerSides[thisLayer].createSubLayer(layers.Points[$(this).attr("id")]);     
                 demo.setInteraction(true);
                callOutToInfoWindow.push(demo);
                //https://carto.com/docs/carto-engine/carto-js/events/#sublayerfeatureclickevent-latlng-pos-data-layerindex
                ////////////////////////////////////////////////
                ///////FIX SO INSTEAD OF console.log("L/R"),////
                ////////////////////console.log(data) instead///
                ////////////////////////////////////////////////
                
                /// create function that extracts the which year is selected from radio forms,
                // extract sql of year from layer
                //var layerDecade = layerSides[thisLayer].layers[0].options.sql.substring(8,12);
                demo.on('featureClick', function (event, latlng, pos, data, layerIndex) {
                    var layerDecade;
                    var OverclipX=(event.clientX>clipX) ? true:false;
                    if (OverclipX===true){
                        layerDecade = layerSides["leftLayer"].layers[0].options.sql.substring(8,12);
                    }
                    else{
                       // console.log(IDsHover["L"]);
                        //console.log(callOutToInfoWindow[1].data)
                        layerDecade = layerSides["rightLayer"].layers[0].options.sql.substring(8,12);
                    }
                    if (data.year==parseInt(layerDecade)){
                        console.log("CartoDB_ID:"+data.cartodb_id)
                    }
                    
//                   

                
                });
            });
        });
        loadLabelLayers();
        window.setTimeout(clip, 500);
    }

});

function extractLayerDecades(){
     $.each($("input[name='L']:checked"), function (year) {
        IDsHover["L"] = year
    });
    $.each($("input[name='R']:checked"), function (year) {
        IDsHover["R"] = year
    });
    
                   
}

function clip() {
    var nw = map.containerPointToLayerPoint([0, 0])
        , se = map.containerPointToLayerPoint(map.getSize());
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