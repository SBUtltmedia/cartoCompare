var map
var layerSides = {

 "rightLayer": {},
            "leftLayer": {}
};
var layers = {
    "demographics": {
        '1960': /**[**/ {
            sql: "SELECT latinos.tract_1960.cartodb_id, latinos.tract_1960.gisjoin, latinos.tract_1960.the_geom, latinos.tract_1960.the_geom_webmercator, ca4001 as total_pop, ca7001 as hispanic, ca4001 - ca7001 as non_hispanic, round(ca7001 * 1.0 / ca4001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1960 INNER JOIN latinos.census_1960_tract_li ON latinos.tract_1960.gisjoin = latinos.census_1960_tract_li.gisjoin WHERE ca4001 != 0"
            , cartocss: addGeoCSS()
        }
        , '1970': /**[**/ {
            sql: "SELECT latinos.tract_1970.cartodb_id, latinos.tract_1970.gisjoin, latinos.tract_1970.the_geom, latinos.tract_1970.the_geom_webmercator, C1I001 as total_pop, C11001 as hispanic, C1I001 - C11001 as non_hispanic, round(C11001 * 1.0 / C1I001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1970 INNER JOIN latinos.census_1970_tract_li ON latinos.tract_1970.gisjoin = latinos.census_1970_tract_li.gisjoin WHERE C1I001 != 0 AND C11001 >= 0"
            , cartocss: addGeoCSS()
        }
        /**,{
                      sql:'',
                      cartocss addPointCSS():
                  }]**/
        
        , '1980': /**[**/ {
            sql: "SELECT latinos.tract_1980.cartodb_id, latinos.tract_1980.gisjoin, latinos.tract_1980.the_geom, latinos.tract_1980.the_geom_webmercator, C9E001 +C9F001 as total_pop, C9F001 as hispanic, C9E001 as non_hispanic, round(C9F001 *1.0 / (C9E001+C9F001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1980 INNER JOIN latinos.census_1980_tract_li ON latinos.tract_1980.gisjoin = latinos.census_1980_tract_li.gisjoin WHERE C9F001 != 0 AND C9E001 >=0"
            , cartocss: addGeoCSS()
        }
        /**,{
                      sql:'',
                      cartocss addPointCSS():
                  }]**/
        
        , '1990': /**[**/ {
            sql: "SELECT latinos.tract_1990.cartodb_id, latinos.tract_1990.gisjoin, latinos.tract_1990.the_geom, latinos.tract_1990.the_geom_webmercator, EU1001  +EU0001 as total_pop, EU0001 as hispanic, EU1001 as non_hispanic, round(EU0001  *1.0 / (EU0001 +EU1001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1990 INNER JOIN latinos.census_1990_tract_li_update ON latinos.tract_1990.gisjoin = latinos.census_1990_tract_li_update.gisjoin WHERE (EU0001+EU1001)!=0 AND EU0001*1.0 >=0"
            , cartocss: addGeoCSS()
        }
        /**,{
                      sql:'',
                      cartocss addPointCSS():
                  }]**/
        
        , '2000': /**[**/ {
            sql: "SELECT latinos.tract_2000.cartodb_id, latinos.tract_2000.gisjoin, latinos.tract_2000.the_geom, latinos.tract_2000.the_geom_webmercator, FMC001 +FMC002 as total_pop, FMC001 as hispanic, FMC002 as non_hispanic, round(FMC001 *1.0 / (FMC001+FMC002) *100, 1) as pct_hispanic, latinos.tract_2000.cartodb_id as name FROM latinos.tract_2000 INNER JOIN latinos.census_2000_tract_li_update ON latinos.tract_2000.gisjoin = latinos.census_2000_tract_li_update.gisjoin WHERE (FMC001+FMC002)!=0 AND FMC001*1.0>=0"
            , cartocss: addGeoCSS()
        }
        /**,{
                      sql:'',
                      cartocss addPointCSS():
                  }]**/
        
        , '2010': /**[**/ {
            sql: "SELECT latinos.tract_2010.cartodb_id, latinos.tract_2010.gisjoin, latinos.tract_2010.the_geom, latinos.tract_2010.the_geom_webmercator, IC2001 as total_pop, IC2003 as hispanic, IC2002 as non_hispanic, round(IC2003 *1.0 / IC2001 *100, 1) as pct_hispanic, latinos.tract_2010.cartodb_id as areaname FROM latinos.tract_2010 INNER JOIN latinos.census_2010_tract_li_update ON latinos.tract_2010.gisjoin = latinos.census_2010_tract_li_update.gisjoin WHERE IC2001!=0 AND (IC2002*1.0)>=0"
            , cartocss: addGeoCSS()
        }
    }
    , "interviews": {
        'points1': {
            sql: "SELECT * FROM latinos.comparisonmappoints where decade='1960'"
            , cartocss: addPointCSS()
        }
    }
    /**,{
                  sql:'',
                  cartocss addPointCSS():
              }]**/
}

function addGeoCSS() {
    return '#layer { polygon-fill: #810f7c; polygon-opacity: 1; line-width: 0.5; line-color: #b9b1b1; line-opacity: 0.5; } #layer[ pct_hispanic <= 80] { polygon-fill: #8856a7; } #layer[ pct_hispanic <= 40] { polygon-fill: #8c96c6; } #layer [ pct_hispanic <= 20] { polygon-fill: #9ebcda; } #layer [ pct_hispanic <= 10] { polygon-fill: #bfd3e6; } #layer [ pct_hispanic <= 5] { polygon-fill: #edf8fb; }';
}

function addPointCSS() {
    return "#Points { marker-width: 10; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}";
}
$(document).ready(function () {
    function twoRadioForms(S) {
        var demo = Object.keys(layers["demographics"])
        for (i in demo) {
            console.log(demo[i])
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
    }
    twoRadioForms("L");
    twoRadioForms("R");
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
    //Create the leaflet map
    map = L.map('map', {
        zoomControl: true
        , center: [40.789142, -73.134961]
        , zoom: 9
    });
    var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);

    function layerLoaded(layer)
{

console.log("adsf")
}
    
    function retrieveLayer(map, cartoLayerSource, layerSide) {
        return new Promise(function (resolve, reject) {
            cartodb.createLayer(map, cartoLayerSource,layerLoaded).addTo(map).on('done', function (layer) {
                layerSides[layerSide] = layer;
                resolve("loaded")
            })
        })
    }
    CartoLayerSource = {
        user_name: "latinos"
        , api_key: "3e12024aff2f3326a1db97e6c877e79e02bd8ced"
        , type: 'cartodb'
        , maps_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}"
        , sql_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}"
        , sublayers: [
            ]
    };
    map.on('move', clip);
    retrieveLayer(map, CartoLayerSource,"rightLayer").then(function () {
        retrieveLayer(map, CartoLayerSource,"leftLayer").then(function () {
            
            layerSides["rightLayer"].createSubLayer(layers.demographics["1960"]);
            layerSides["leftLayer"].createSubLayer(layers.demographics["1970"]);
                   // clip()  
            $("input[name='L']").change(function () {

                clearandReload();
                
            });
            
            $("input[name='R']").change(function () {

                clearandReload();
                
            });
    
            
        });
    });
    
    function clearandReload(){
        layerSides["leftLayer"].getSubLayers().forEach(function (sublayer) {
                        sublayer.remove()
                    });
                 layerSides["rightLayer"].getSubLayers().forEach(function (sublayer) {
                        sublayer.remove()
                    });
                    // For every check activated, add a sublayer
                $.each($("input[name='L']:checked"), function () {
                
                    layerSides["leftLayer"].createSubLayer(layers.demographics[$(this).attr("id")]);
                });
                        $.each($("input[name='R']:checked"), function () {
                        
                    layerSides["rightLayer"].createSubLayer(layers.demographics[$(this).attr("id")]);
                });
        
        
    }
    //            cartodb.createLayer(map,{
    //           user_name: "latinos"
    //        , api_key: "3e12024aff2f3326a1db97e6c877e79e02bd8ced"
    //        , type: 'cartodb'
    //        , maps_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}"
    //        , sql_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}"
    //        , sublayers: [
    //            ]
    //          })
    //          .addTo(map)
    //          .done(function(layer){
    //            // When the layers inputs change fire this
    //            $("input[name='layer']").change(function(){
    //
    //              // Clear the sublayers
    //              layer.getSubLayers().forEach(function(sublayer){sublayer.remove()});
    //
    //              // For every check activated, add a sublayer
    //              $.each($("input[name='layer']:checked"), function(){
    //                  layer.createSubLayer(layers.demographics[$(this).attr("id")]);
    //              });
    //            });
    //        });
    // Layers definition
    // Empty layer
    // When the layers inputs change fire this
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
    //$('#map').append(legend.render().el);
});

function clip() {
  
        //console.log(layers[0].layers[0].options.sql)
        //console.log(layers[1].layers[0].options.sql)
    var nw = map.containerPointToLayerPoint([0, 0])
        , se = map.containerPointToLayerPoint(map.getSize())
        , clipX = nw.x + (se.x - nw.x) * getSliderValue();
    //console.log(layers[1].getContainer())
    leftRect= 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)'
    rightRect='rect(' +[nw.y,se.x,se.y,clipX].join('px,') + 'px)';
    console.log("left: "+leftRect);
    console.log("right: "+rightRect);
    $('#leftCover').css('clip',leftRect);
    
    $('#rightCover').css('clip',rightRect);
    layerSides["leftLayer"].getContainer().style.clip = leftRect;
    
  layerSides["rightLayer"].getContainer().style.clip =rightRect;
    var thumbPos = $(".leaflet-sbs-range")
        //console.log(thumbPos);
        //$(".leaflet-sbs-divider").css("left",clipX+"px");
    $(".leaflet-sbs-divider").css("left", thumbPos);
    map.invalidateSize(true)
        //
}

function getSliderValue() {
    var mapWidth = $('#map').css("width");
    var sliderBarWidth = $('#compareSlider').css("width");
    var sliderBarPosX = $('#compareSlider').css("left");
    mapWidth = mapWidth.substr(0, mapWidth.length - 2);
    sliderBarWidth = sliderBarWidth.substr(0, sliderBarWidth.length - 2);
    sliderBarPosX = sliderBarPosX.substr(0, sliderBarPosX.length - 2);
    //console.log(mapWidth +"<- mapwidth | "+ sliderBarWidth+"<-  sliderBarWidth |"+ sliderBarPosX +"<- sliderBarPosX");
    mapWidth = parseInt(mapWidth);
    sliderBarWidth = parseInt(sliderBarWidth);
    sliderBarPosX = parseInt(sliderBarPosX);
    var barWidthp = sliderBarWidth / mapWidth;
    var sliderBarPosXp = sliderBarPosX / mapWidth;
    return (barWidthp + sliderBarPosXp);
    // var consoleLogadd = JSON.stringify(barWidthp+sliderBarPosXp);
    //console.log(consoleLogadd);
}