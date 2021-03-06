var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var map;
var layerSides = {"rightLayer" : {}, "leftLayer" : {}};
var clipX;
var layerShortHand = {"rightLayer" : "R", "leftLayer" : "L"};
var IDsHover = {"L" : null, "R" : null};

var CartoLayerSource = {
  user_name : "latinos",
  api_key : "default_public",
  type : 'cartodb',
  maps_api_template : "//data.gss.stonybrook.edu/user/{user}",
  sql_api_template : "//data.gss.stonybrook.edu/user/{user}",
  sublayers : []
};

// // define client
// const client = new carto.Client({
//     apiKey: '3e12024aff2f3326a1db97e6c877e79e02bd8ced',
//     username: 'latinos',
//     serverUrl:'//app2.gss.stonybrook.edu/user/latinos'
// });

var pieChartData = [
  {"label" : "Hispanic", "value" : 100, "color" : "#c18ce6"},
  {"label" : "Non-Hispanic", "value" : 100, "color" : "#dbdbdb"}
];
var tP = 33333;

var pieConfig = {
  "header" : {
    "title" : {"text" : "Total Population", "fontSize" : 8},
    "subtitle" :
        {"text" : tP, "color" : "#000", "fontSize" : 12, "font" : "open sans"},
    "location" : "pie-center",
    "titleSubtitlePadding" : 2.5
  },

  "size" : {
    "canvasHeight" : 225,
    "canvasWidth" : 345,
    "pieInnerRadius" : "65%",
    "pieOuterRadius" : "80%"
  },
  "data" : {"sortOrder" : "label-desc", "content" : pieChartData},
  "labels" : {
    "outer" : {"format" : "label-value2", "pieDistance" : 20},
    "mainLabel" : {"fontSize" : 10},
    "percentage" : {"color" : "#000", "fontSize" : 11, "decimalPlaces" : 0},
    "value" : {"color" : "#000", "fontSize" : 11},
    "lines" : {"enabled" : true, "color" : "#777777"},
    "truncation" : {"enabled" : true}
  },
  "effects" : {
    "load" : {"speed" : 750},
    "pullOutSegmentOnClick" : {"effect" : "none", "speed" : 200, "size" : 8}
  },
  "misc" : {"colors" : {"segmentStroke" : "#000000"}}
};

var decades = [ "1960", "1970", "1980", "1990", "2000", "2010" ];

var geoInteractivity = [
  'cartodb_id', 'areaname', 'pct_hispanic', 'total_pop', 'hispanic',
  'non_hispanic', 'year'
];

var legend = new cdb.geo.ui.Legend({
  type : "custom",
  title : "Percent of Latino Population",
  data : [
    {name : "80% or more", value : "#810f7c"},
    {name : "40% - 80%", value : "#8856a7"},
    {name : "20% - 40%", value : "#8c96c6"},
    {name : "10% - 20%", value : "#9ebcda"},
    {name : " 5% - 10%", value : "#bfd3e6"},
    {name : "5% or less", value : "#edf8fb"}
  ]
});

var geojson;
var player;
var vidPopup;
var vidPlayer;
var keyword;

function addGeoCSS() {
  return '#layer { polygon-fill: #810f7c; polygon-opacity: 1; line-width: 0.5; line-color: #b9b1b1; line-opacity: 0.5; } #layer[ pct_hispanic <= 80] { polygon-fill: #8856a7; } #layer[ pct_hispanic <= 40] { polygon-fill: #8c96c6; } #layer [ pct_hispanic <= 20] { polygon-fill: #9ebcda; } #layer [ pct_hispanic <= 10] { polygon-fill: #bfd3e6; } #layer [ pct_hispanic <= 5] { polygon-fill: #edf8fb; }';
}

function addPointCSS() {
  return "#Points { marker-width: 15; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}";
}

var legend = new cdb.geo.ui.Legend({
  type : "custom",
  title : "Percent of Latino Population",
  data : [
    {name : "80% or more", value : "#810f7c"},
    {name : "40% - 80%", value : "#8856a7"},
    {name : "20% - 40%", value : "#8c96c6"},
    {name : "10% - 20%", value : "#9ebcda"},
    {name : " 5% - 10%", value : "#bfd3e6"},
    {name : "5% or less", value : "#edf8fb"}
  ]
});

var geojson;
var player;
var vidPopup;
var vidPlayer;
var keyword;

var layers = {
  "demographics" : {
    '1960' : {
      sql :
          "SELECT '1960' as year, g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, ca4001 as total_pop, ca7001 as hispanic, ca4001 - ca7001 as non_hispanic, round(ca7001 * 1.0 / ca4001 * 100, 1) as pct_hispanic, areaname FROM tract_1960 g INNER JOIN census_1960_tract_li t ON g.gisjoin = t.gisjoin WHERE ca4001 != 0",
      cartocss : addGeoCSS(),
      interactivity : geoInteractivity
    },
    '1970' : {
      sql :
          "SELECT '1970' as year, g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, C1I001 as total_pop, C11001 as hispanic, C1I001 - C11001 as non_hispanic, round(C11001 * 1.0 / C1I001 * 100, 1) as pct_hispanic, areaname FROM tract_1970 g INNER JOIN census_1970_tract_li t ON g.gisjoin = t.gisjoin WHERE C1I001 != 0 AND C11001 >= 0",
      cartocss : addGeoCSS(),
      interactivity : geoInteractivity
    },
    '1980' : {
      sql :
          "SELECT '1980' as year,  g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, C9E001 +C9F001 as total_pop, C9F001 as hispanic, C9E001 as non_hispanic, round(C9F001 *1.0 / (C9E001+C9F001) *100, 1) as pct_hispanic, areaname FROM tract_1980 g INNER JOIN census_1980_tract_li t ON g.gisjoin = t.gisjoin WHERE C9F001 != 0 AND C9E001 >=0",
      cartocss : addGeoCSS(),
      interactivity : geoInteractivity
    },
    '1990' : {
      sql :
          "SELECT '1990' as year,  g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, EU1001  +EU0001 as total_pop, EU0001 as hispanic, EU1001 as non_hispanic, round(EU0001  *1.0 / (EU0001 +EU1001) *100, 1) as pct_hispanic, state || ', ' || county || ', ' || anpsadpi as areaname FROM tract_1990 g INNER JOIN census_1990_tract_li t ON g.gisjoin = t.gisjoin WHERE (EU0001+EU1001)!=0 AND EU0001*1.0 >=0",
      cartocss : addGeoCSS(),
      interactivity : geoInteractivity
    },
    '2000' : {
      sql :
          "SELECT '2000' as year,  g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, FMC001 +FMC002 as total_pop, FMC001 as hispanic, FMC002 as non_hispanic, round(FMC001 *1.0 / (FMC001+FMC002) *100, 1) as pct_hispanic, state || ', ' || county || ', ' || name as areaname FROM tract_2000 g INNER JOIN census_2000_tract_li t ON g.gisjoin = t.gisjoin WHERE (FMC001+FMC002)!=0 AND FMC001*1.0>=0",
      cartocss : addGeoCSS(),
      interactivity : geoInteractivity
    },
    '2010' : {
      sql :
          "SELECT '2010' as year,  g.cartodb_id, g.gisjoin, g.the_geom, g.the_geom_webmercator, IC2001 as total_pop, IC2003 as hispanic, IC2002 as non_hispanic, round(IC2003 *1.0 / IC2001 *100, 1) as pct_hispanic, state || ', ' || county || ', ' || name as areaname FROM tract_2010 g INNER JOIN census_2010_tract_li t ON g.gisjoin = t.gisjoin WHERE IC2001!=0 AND (IC2002*1.0)>=0",
      cartocss : addGeoCSS(),
      interactivity : geoInteractivity
    }
  },
  "Points" : {

  }
}

var xCross = `<svg width="15px" height ="15px">
    <line x1="0" y1="0" x2="15px" y2="15px" style="stroke:#ff0000; stroke-width:1.5"></line>
    <line x1="0" y1="15px" x2="15px" y2="0" style="stroke:#ff0000; stroke-width:1.5"></line>
</svg>`;
var SVGstr =
    `<svg width="20px" height ="20px" version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 8 8" style="enable-background:new 0 0 0 0;" xml:space="preserve">
    <g transform="scale(.03)" class="green">
<path d="M160.7,204.1c-37.6-37.7-75-75-112.5-112.6c9.7-10,21.9-16.4,35.6-20.1c12-3.2,24.1-3.1,36.2-0.7c4.2,0.8,6.4-0.2,8.7-3.4
	c12.9-18,25.8-36,38.8-53.9c2.4-3.4,5-6.7,7.8-9.7c4.4-4.7,8.3-4.7,12.8-0.1c20.2,20.3,40.2,40.9,60.5,61.1c4.7,4.6,3.2,11.8-1.5,15
	c-5.5,3.8-10.9,7.7-16.4,11.4c-15.7,10.7-31.3,21.5-47.1,32.1c-2.6,1.7-3.4,3.3-2.7,6.5c5.5,24.6,1.1,47.3-14,67.7
	c-1.3,1.7-2.7,3.4-4.2,5C162.2,202.9,161.4,203.5,160.7,204.1z M157.2,87.5c14-12.8,28.1-25.5,42-38.4c0.7-0.7,1.1-3.1,0.5-3.7
	c-5-5.3-10.2-10.3-15.7-15.7c-10.5,13.4-20.5,26.1-30.5,38.8c-7.7,9.9-7.7,9.9,1.9,18.2C155.8,86.9,156.1,87,157.2,87.5z
	 M136.9,99.6c-2.2-2.2-4.3-4.5-6.8-6.5c-1.6-1.3-3.7-2.8-5.5-2.7c-12,0.7-22.2,5.9-32.1,13.1c6.3,5.8,12.2,11.4,18.2,17
	C118.8,114.1,127.6,107,136.9,99.6z"/>
<path d="M0,251.5c26.8-35,53.7-70,80.3-104.6c8.4,8.3,16.6,16.4,25.3,24.9c-34.8,26.7-69.9,53.6-104.9,80.4
	C0.5,252,0.2,251.7,0,251.5z"/>
    </g>
</svg>`;

var pinnedCharts = {};
var map;
var holdID = "";
// Varried levels to restrict the Lon/Lat to to keep things contained to LI
// 9: L.latLngBounds([42.294006, -69.403752], [39.391607, -76.445206]),
var mapBounds = {
  10 : L.latLngBounds([ 41.394543, -70.644156 ], [ 40.370698, -75.306929 ]),
  11 : L.latLngBounds([ 41.3, -71.1 ], [ 40.5, -74.65 ]),
  12 : L.latLngBounds([ 41.3, -71.5 ], [ 40.5, -74.25 ])
};
var zoomChange = 0;
var eventHold;

// Creates a base for the population piechart and implements each part
var popFactory =
    {

      popUpCount : 0,
      newPopUp : function(areaname) {
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
        popUp.css('cursor', 'cell')

        pinSVG.attr("id", "pin_" + this.popUpCount);

        pieChart.attr('id', 'pieChart' + this.popUpCount)
        pieChart.css("margin", "0 300 0");
        pieChart.css("display", "block");

        crossSVG.css("margin", "0 330 0");
        crossSVG.css("display", "block");

        pinSVG.css("margin", "-5 0 0");
        pinSVG.css("display", "block");
        //---------------------\\

        // When either svg is clicked then they perform their own functions
        //---------------------\\
        crossSVG.on("click", function(evt) {
          popUp.remove();
          this.popUpCount--;
        })

        pinSVG.on("click", function(evt) {
          if ($(this).hasClass('pinned')) {
            // popUp.remove();
            // this.popUpCount--;
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

    decades.forEach(function(decade) {
      // //console.log(decade+" 5")
      layers["Points"][decade] = {
        cartocss :
            "#Points { marker-width: 15; marker-fill: #FFB927; marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse;}",
        sql : "SELECT * FROM comparisonmappoints where decade='" + decade + "'",
        interactivity : 'youtube_id,name, cartodb_id, options, captions,yt_start'
      };
    });
