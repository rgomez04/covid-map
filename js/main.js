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

var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
        style.getText().setText(feature.get('ADMIN'));
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
        color: '#f00',
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
            color: '#f00',
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
//Obtener JSON COVID

//Señalar países con el mayor número de casos confirmados totales

var displayFeatureInfo = function (pixel) {
    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
    });

    var info = document.getElementById('info');
    //Juntar datos JSON

    if (feature) {
        info.innerHTML = feature.get('ISO_A3') + ': ' + feature.get('ADMIN');
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

