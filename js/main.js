//Obtener JSON COVID
var covidJSON;
fetch("https://api.covid19api.com/summary")
    .then(res => res.json())
    .then((out) => {
        covidJSON = out.Countries;
        covidJSON.sort(function (a, b) {
            return b.TotalConfirmed > a.TotalConfirmed ? 1
                : b.TotalConfirmed < a.TotalConfirmed ? -1
                    : 0;
        });

    })
    .catch(err => { throw err });

var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000',
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3,
        }),
    }),
});

var topCasesCovidStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000',
        }),
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3,
        }),
    }),
});

var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
        var ISO_A2 = feature.get('ISO_A2');
        fill = new ol.style.Fill();
        var i;

        for (i = 0; i < 5; i++) {
            if (covidJSON[i].CountryCode == ISO_A2) {
                fill.setColor(topCasesCovidStyle.getText().setText(feature.get('ADMIN')));
                return style;
            }
            else {
                fill.setColor(style.getText().setText(feature.get('ADMIN')));
            }
        }
        return style;
    },
});

var map = new ol.Map({
    target: 'map',
    layers: [vectorLayer],
    view: new ol.View({
        center: [0, 0],
        zoom: 1,
    })
});

var highlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#0f0',
        width: 1,
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.1)',
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000',
        }),
        stroke: new ol.style.Stroke({
            color: '#0f0',
            width: 3,
        }),
    }),
});

var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: function (feature) {
        highlightStyle.getText().setText(feature.get('ADMIN'));
        return highlightStyle;
    },
});

var highlight;

var displayFeatureInfo = function (pixel) {
    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
    });

    var info = document.getElementById('info');
    if (feature) {
        var tConf, tDeat, tRec;
        //Conseguir los datos por covid
        covidJSON.forEach(function (data, index) {
            if (feature.get('ISO_A2') === data.CountryCode) {
                tConf = data.TotalConfirmed;
                tDeat = data.TotalDeaths;
                tRec = data.TotalRecovered;
            }
        });
        info.innerHTML = feature.get('ISO_A3') + ': ' + feature.get('ADMIN')
            + ', Total Confirmed: ' + tConf + ', Total Deaths: ' + tDeat + ', Total Recovered: ' + tRec;
    } else {
        info.innerHTML = '&nbsp;';
    }

    if (feature !== highlight) {
        if (highlight) {
            featureOverlay.getSource().removeFeature(highlight);
        }
        if (feature) {
            featureOverlay.getSource().addFeature(feature);
        }
        highlight = feature;
    }
};

