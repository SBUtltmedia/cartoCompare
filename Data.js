var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var map;
var layerSides = {
    "rightLayer": {},
    "leftLayer": {}
};
var clipX;
var layerShortHand = {
    "rightLayer": "R",
    "leftLayer": "L"
}
var IDsHover = {
    "L": null,
    "R": null
};
var CartoLayerSource = {
    user_name: "latinos",
    api_key: "3e12024aff2f3326a1db97e6c877e79e02bd8ced",
    type: 'cartodb',
    maps_api_template: "//app2.gss.stonybrook.edu/user/{user}",
    sql_api_template: "//app2.gss.stonybrook.edu/user/{user}",
    sublayers: [
            ]
};

var pieChartData = [{
    "label": "Hispanic",
    "value": 100,
    "color": "#c18ce6"
			}, {
    "label": "Non-Hispanic",
    "value": 100,
    "color": "#dbdbdb"
}];
var tP = 33333;

var pieConfig = {
    "header": {
        "title": {
            "text": "Total Population:",
            "fontSize": 11
        },
        "subtitle": {
            "text": tP,
            "color": "#000",
            "fontSize": 12,
            "font": "open sans"
        },
        "location": "pie-center",
        "titleSubtitlePadding": 1
    },

    "size": {
        "canvasHeight": 225,
        "canvasWidth": 225,
        "pieInnerRadius": "65%",
        "pieOuterRadius": "80%"
    },
    "data": {
        "sortOrder": "label-desc",
        "content": pieChartData
    },
    "labels": {
        "outer": {
            "format": "label-value2",
            "pieDistance": 19
        },
        "mainLabel": {
            "fontSize": 11
        },
        "percentage": {
            "color": "#000",
            "fontSize": 11,
            "decimalPlaces": 0
        },
        "value": {
            "color": "#000",
            "fontSize": 11
        },
        "lines": {
            "enabled": true,
            "color": "#777777"
        },
        "truncation": {
            "enabled": true
        }
    },
    "effects": {
        "load": {
            "speed": 1000
        },
        "pullOutSegmentOnClick": {
            "effect": "none",
            "speed": 400,
            "size": 8
        }
    },
    "misc": {
        "colors": {
            "segmentStroke": "#000000"
        }
    }
};

var decades = ["1960", "1970", "1980", "1990", "2000", "2010"];

var geoInteractivity = ['cartodb_id', 'areaname', 'pct_hispanic', 'total_pop', 'hispanic', 'non_hispanic', 'year'];

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

var geojson;
var player;
var vidPopup;
var vidPlayer;
var keyword;

var layers = {
    "demographics": {
        '1960': {
            sql: "SELECT '1960' as year, latinos.tract_1960.cartodb_id, latinos.tract_1960.gisjoin, latinos.tract_1960.the_geom, latinos.tract_1960.the_geom_webmercator, ca4001 as total_pop, ca7001 as hispanic, ca4001 - ca7001 as non_hispanic, round(ca7001 * 1.0 / ca4001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1960 INNER JOIN latinos.census_1960_tract_li ON latinos.tract_1960.gisjoin = latinos.census_1960_tract_li.gisjoin WHERE ca4001 != 0",
            cartocss: addGeoCSS(),
            interactivity: geoInteractivity
        },
        '1970': {
            sql: "SELECT '1970' as year, latinos.tract_1970.cartodb_id, latinos.tract_1970.gisjoin, latinos.tract_1970.the_geom, latinos.tract_1970.the_geom_webmercator, C1I001 as total_pop, C11001 as hispanic, C1I001 - C11001 as non_hispanic, round(C11001 * 1.0 / C1I001 * 100, 1) as pct_hispanic, areaname FROM latinos.tract_1970 INNER JOIN latinos.census_1970_tract_li ON latinos.tract_1970.gisjoin = latinos.census_1970_tract_li.gisjoin WHERE C1I001 != 0 AND C11001 >= 0",
            cartocss: addGeoCSS(),
            interactivity: geoInteractivity
        },
        '1980': {
            sql: "SELECT '1980' as year,  latinos.tract_1980.cartodb_id, latinos.tract_1980.gisjoin, latinos.tract_1980.the_geom, latinos.tract_1980.the_geom_webmercator, C9E001 +C9F001 as total_pop, C9F001 as hispanic, C9E001 as non_hispanic, round(C9F001 *1.0 / (C9E001+C9F001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1980 INNER JOIN latinos.census_1980_tract_li ON latinos.tract_1980.gisjoin = latinos.census_1980_tract_li.gisjoin WHERE C9F001 != 0 AND C9E001 >=0",
            cartocss: addGeoCSS(),
            interactivity: geoInteractivity
        },
        '1990': {
            sql: "SELECT '1990' as year,  latinos.tract_1990.cartodb_id, latinos.tract_1990.gisjoin, latinos.tract_1990.the_geom, latinos.tract_1990.the_geom_webmercator, EU1001  +EU0001 as total_pop, EU0001 as hispanic, EU1001 as non_hispanic, round(EU0001  *1.0 / (EU0001 +EU1001) *100, 1) as pct_hispanic, areaname FROM latinos.tract_1990 INNER JOIN latinos.census_1990_tract_li_update ON latinos.tract_1990.gisjoin = latinos.census_1990_tract_li_update.gisjoin WHERE (EU0001+EU1001)!=0 AND EU0001*1.0 >=0",
            cartocss: addGeoCSS(),
            interactivity: geoInteractivity
        },
        '2000': {
            sql: "SELECT '2000' as year,  latinos.tract_2000.cartodb_id, latinos.tract_2000.gisjoin, latinos.tract_2000.the_geom, latinos.tract_2000.the_geom_webmercator, FMC001 +FMC002 as total_pop, FMC001 as hispanic, FMC002 as non_hispanic, round(FMC001 *1.0 / (FMC001+FMC002) *100, 1) as pct_hispanic, latinos.tract_2000.cartodb_id as areaname FROM latinos.tract_2000 INNER JOIN latinos.census_2000_tract_li_update ON latinos.tract_2000.gisjoin = latinos.census_2000_tract_li_update.gisjoin WHERE (FMC001+FMC002)!=0 AND FMC001*1.0>=0",
            cartocss: addGeoCSS(),
            interactivity: geoInteractivity
        },
        '2010': {
            sql: "SELECT '2010' as year,  latinos.tract_2010.cartodb_id, latinos.tract_2010.gisjoin, latinos.tract_2010.the_geom, latinos.tract_2010.the_geom_webmercator, IC2001 as total_pop, IC2003 as hispanic, IC2002 as non_hispanic, round(IC2003 *1.0 / IC2001 *100, 1) as pct_hispanic, latinos.tract_2010.cartodb_id as areaname FROM latinos.tract_2010 INNER JOIN latinos.census_2010_tract_li_update ON latinos.tract_2010.gisjoin = latinos.census_2010_tract_li_update.gisjoin WHERE IC2001!=0 AND (IC2002*1.0)>=0",
            cartocss: addGeoCSS(),
            interactivity: geoInteractivity
        }
    },
    "Points": {

    }
}


var SVGstr = `<svg width="20px" height ="20px" version="1.1" id="pin" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
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
