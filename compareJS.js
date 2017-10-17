  var layer;
        var map;
        var overlay;
        var layers = [];
        var layerState = ["1960", "1970"];
        var sqlSources = {
            "1960": "SELECT latinos.tract_1960.cartodb_id, latinos.tract_1960.gisjoin, latinos.tract_1960.the_geom, latinos.tract_1960.the_geom_webmercator, ca4001 as total_pop, ca7001 as hispanic, ca4001 - ca7001 as non_hispanic, round(ca7001 * 1.0 / ca4001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1960 INNER JOIN latinos.census_1960_tract_li ON latinos.tract_1960.gisjoin = latinos.census_1960_tract_li.gisjoin WHERE ca4001 != 0", //END1960

            "1970": "SELECT latinos.tract_1970.cartodb_id, latinos.tract_1970.gisjoin, latinos.tract_1970.the_geom, latinos.tract_1970.the_geom_webmercator, C1I001 as total_pop, C11001 as hispanic, C1I001 - C11001 as non_hispanic, round(C11001 * 1.0 / C1I001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1970 INNER JOIN latinos.census_1970_tract_li ON latinos.tract_1970.gisjoin = latinos.census_1970_tract_li.gisjoin WHERE C1I001 != 0 AND C11001 >= 0", //END1970

            "1980": "SELECT latinos.tract_1980.cartodb_id, latinos.tract_1980.gisjoin, latinos.tract_1980.the_geom, latinos.tract_1980.the_geom_webmercator, C9E001 +C9F001 as total_pop, C9F001 as hispanic, C9E001 as non_hispanic, round(C9F001 *1.0 / (C9E001+C9F001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1980 INNER JOIN latinos.census_1980_tract_li ON latinos.tract_1980.gisjoin = latinos.census_1980_tract_li.gisjoin WHERE C9F001 != 0 AND C9E001 >=0", //END1980

            "1990": "SELECT latinos.tract_1990.cartodb_id, latinos.tract_1990.gisjoin, latinos.tract_1990.the_geom, latinos.tract_1990.the_geom_webmercator, EU1001  +EU0001 as total_pop, EU0001 as hispanic, EU1001 as non_hispanic, round(EU0001  *1.0 / (EU0001 +EU1001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1990 INNER JOIN latinos.census_1990_tract_li_update ON latinos.tract_1990.gisjoin = latinos.census_1990_tract_li_update.gisjoin WHERE (EU0001+EU1001)!=0 AND EU0001*1.0 >=0", //END1990

            "2000": "SELECT latinos.tract_2000.cartodb_id, latinos.tract_2000.gisjoin, latinos.tract_2000.the_geom, latinos.tract_2000.the_geom_webmercator, FMC001 +FMC002 as total_pop, FMC001 as hispanic, FMC002 as non_hispanic, round(FMC001 *1.0 / (FMC001+FMC002) *100, 1) as pct_hispanic, latinos.tract_2000.cartodb_id as name FROM latinos.tract_2000 INNER JOIN latinos.census_2000_tract_li ON latinos.tract_2000.gisjoin = latinos.census_2000_tract_li.gisjoin WHERE (FMC001+FMC002)!=0 AND FMC001*1.0>=0", //END2000

            "2010": "SELECT latinos.tract_2010.cartodb_id, latinos.tract_2010.gisjoin, latinos.tract_2010.the_geom, latinos.tract_2010.the_geom_webmercator, UO7E001 as total_pop, UO7E003 as hispanic, UO7E002 as non_hispanic, round(UO7E002 *1.0 / UO7E001 *100, 1) as pct_hispanic, latinos.tract_2010.cartodb_id as name FROM latinos.tract_2010 INNER JOIN latinos.census_2010_tract_li ON latinos.tract_2010.gisjoin = latinos.census_2010_tract_li.gisjoin WHERE UO7E001!=0 AND (UO7E002*1.0)>=0" //END2010
        };

        var PntSrc = {
            "1960": "SELECT * FROM latinos.comparisonmappoints where decade='1960'",
            "1970": "SELECT * FROM latinos.comparisonmappoints where decade='1970'",
            "1980": "SELECT * FROM latinos.comparisonmappoints where decade='1980'"
        }


        CartoLayerSource = {
            user_name: "latinos",
            api_key: "3e12024aff2f3326a1db97e6c877e79e02bd8ced",
            type: 'cartodb',
            maps_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}",
            sql_api_template: "http://app2.gss.stonybrook.edu:80/user/{user}",
            sublayers: [{
                    //sql: "SELECT * FROM latinos.tract_1960",
                    sql: "",
                    cartocss: '#layer { polygon-fill: #810f7c; polygon-opacity: 1; line-width: 0.5; line-color: #b9b1b1; line-opacity: 0.5; } #layer[ pct_hispanic <= 80] { polygon-fill: #8856a7; } #layer[ pct_hispanic <= 40] { polygon-fill: #8c96c6; } #layer [ pct_hispanic <= 20] { polygon-fill: #9ebcda; } #layer [ pct_hispanic <= 10] { polygon-fill: #bfd3e6; } #layer [ pct_hispanic <= 5] { polygon-fill: #edf8fb; }',
                    interactivity: "cartodb_id"
                },
                {
                    sql: "",
                    cartocss: "#Points { marker-width: 14; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}",
                    interactivity: "cartodb_id"
                },{
                    type: "http",
                    urlTemplate: "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
                    subdomains: ["a", "b", "c"]
                },
            ]
        };

        function makeCLSource(year) { //
            var cartoClone = JSON.parse(JSON.stringify(CartoLayerSource));
            cartoClone.sublayers[0].sql = sqlSources[year];
            cartoClone.sublayers[1].sql = PntSrc[year];
            return cartoClone;
            //console.log(cartoClone.sublayers[1])
        };

        var legend = new cdb.geo.ui.Legend({
            type: "custom",
            title: "Percent of Latino Population",
            data: [{
                name: "80% or more",
                value: "#810f7c"
            }, {
                name: "40% - 80%",
                value: "#8856a7"
            }, {
                name: "20% - 40%",
                value: "#8c96c6"
            }, {
                name: "10% - 20%",
                value: "#9ebcda"
            }, {
                name: " 5% - 10%",
                value: "#bfd3e6"
            }, {
                name: "5% or less",
                value: "#edf8fb"
            }]
        });
        //        function showMap(indexSource, indexLayer) {
        //            var cartoLayerSource = makeCLSource(indexSource); //1
        //
        //        }
        function changeMap(evt) {
            //console.log(evt.target.id)
            var mapChange = evt.target.id.toString();
            var [year, layer] = mapChange.split("_")
            //console.log(year, layer)
            changeYear(year, layer)
            window.setTimeout(clip, 100);
        }

        function changeYear(year, layer) {
            layerState[layer] = year;
            loadLayers(layerState)
            setButtons()

            window.setTimeout(clip, 100);
              $("input[type=range]").val($("input[type=range]").val()+.01);
        }

        function setButtons() {

            $('.btn_1,.btn_0').prop("disabled", false).removeAttr('style');
            $('#' + layerState[0] + "_1").prop("disabled", true);
            $('#' + layerState[0] + "_0").css("background-color", "green");
            $('#' + layerState[1] + "_0").prop("disabled", true);
            $('#' + layerState[1] + "_1").css("background-color", "green");

        }

        function loadLayers(state) {

            clearLayers();
            retrieveLayer(map, makeCLSource(state[0]), 0).then(function() {
                retrieveLayer(map, makeCLSource(state[1]), 1).then(function() {
                    for (i in layers) {
                        layers[i].addTo(map)

                    }
                })

            })
            $("#compareSlider").val($("#compareSlider").val() + .01);
            // layer.removeLayer(
        }

        function clearLayers() {
            var index = 0;
            map.eachLayer(function(layer) {
                if (index != 0) {
                    map.removeLayer(layer);
                }
                index++;
            });
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

        function main() {
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

            $('.btn_1,.btn_0 ').on("click", changeMap);
            map = L.map('map').setView([40.85, -73.03], 10);
            L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png').addTo(map);
            //  showMap(2, 0);
            // showMap(0, 1);
            //showMap(1, 1);
            //var cartoLayerSource = makeCLSource(1); //1
            // retrieveLayer(map, cartoLayerSource,0);

            //range['oninput'] = clip;
            map.on('move', clip);
            loadLayers(layerState)
            // $("input[type=range]").val(1);
            window.setTimeout(clip, 100);
            setButtons()
            var gproxySrc = '2PACX-1vS5reLPK6XbxdRbrxKEgvM2a-aBRKh8qbVt9ej4HEv_Orw59ICfRThDCIoO7SZdFLTPZA1j1jlE4U7O';
            var urlSrc = "/gproxy/?id="+gproxySrc+"&gid=0";
            console.log(urlSrc)
            $.ajax({
            url:urlSrc
        }).done(function (data) {

            var sched = $.csv.toArrays(data);
            console.log(sched);
        });

        }

        function retrieveLayer(map, cartoLayerSource, layerIndex) {
            return new Promise(function(resolve, reject) {
                cartodb.createLayer(map, cartoLayerSource).on('done', function(layer) {
                    console.log(layer)
                    layers[layerIndex] = layer;
                    resolve("loaded")

                })
            })
            window.setTimeout(clip, 100);
        }

        function clip() {

            //console.log(layers[0].layers[0].options.sql)
            //console.log(layers[1].layers[0].options.sql)
            var nw = map.containerPointToLayerPoint([0, 0]),
                se = map.containerPointToLayerPoint(map.getSize()),
                clipX = nw.x + (se.x - nw.x) * getSliderValue();
            console.log(layers[1].getContainer())
            layers[1].getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
            layers[1].getContainer().style.border = 'rgb(175, 135, 244)';
            var thumbPos = $(".leaflet-sbs-range")
            //console.log(thumbPos);
            //$(".leaflet-sbs-divider").css("left",clipX+"px");
            $(".leaflet-sbs-divider").css("left", thumbPos);



            map.invalidateSize(true)
            //
        }
        //         function clip() {
        //            //console.log(layers[0].layers[0].options.sql)
        //            //console.log(layers[1].layers[0].options.sql)
        //            var mapSize=map.containerPointToLayerPoint(map.getSize())
        //            var rect= "rect("+[range.value*mapSize.x,mapSize.y,mapSize.x,mapSize.y].join('px,') + 'px)';
        //    console.log(rect)
        //            if(layers[1].getContainer()){
        //                console.log(layers[0].getContainer().style);
        //
        //
        //                layers[0].getContainer().style.clip=rect;}
        //             //' +
        //           // layers[1].getContainer().style.clip = '
        //
        //                    }

        /**

        Getting Videos to Work

        **/
        window.onload = main;
