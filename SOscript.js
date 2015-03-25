L.mapbox.accessToken = 'pk.eyJ1IjoiY2FwZXJyYXVsdCIsImEiOiI1ekhRZkRRIn0.p7tBrXttZFH2Xbfbc-whYA';
var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/caperrault.li24hcpp/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var userIDNumber;

var userPoints = {
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": []
};

var userBounds = function (myLayer) {
  map.fitBounds(myLayer.getBounds());
}

var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([0, 0], 2);

var svg = d3.select(map.getPanes().overlayPane).append("svg");

var g = svg.append("g").attr("class", "leaflet-zoom-hide");

function animateUserMap (IDnumber) {
    var feed = new Instafeed({
      get: 'user',
      target: 'feed-test',
      userId: parseInt(IDnumber),
      limit: '60',
      clientId: '37c96dd1404a4fb0a6610dff7342292e',
      accessToken: '1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105',
      success: function(data) {

        userPoints.features = [];

        for (var i = 0; i < data.data.length; i ++) {
          userPoints.features.push(
            {
              "type": "Feature", "properties": { "id": "route1"}, "geometry": { "type": "Point", "coordinates": [data.data[i].location.longitude, data.data[i].location.latitude]},
            });
        }

        var userLayer = L.mapbox.featureLayer().setGeoJSON(userPoints);
        userBounds(userLayer)

      var featuresdata = userPoints.features.filter(function(d) {
          return d.properties.id == "route1"
      })

      var transform = d3.geo.transform({
          point: projectPoint
      });

      var d3path = d3.geo.path().projection(transform);

      var toLine = d3.svg.line()
          .interpolate("linear")
          .x(function(d) {
              return applyLatLngToLayer(d).x
          })
          .y(function(d) {
              return applyLatLngToLayer(d).y
          });

      var ptFeatures = g.selectAll("circle")
          .data(featuresdata)
          .enter()
          .append("circle")
          .attr("r", 3)
          .attr("class", "waypoints");

          linePath.exit()
          .remove()

      var linePath = g.selectAll(".lineConnect")
          .data([featuresdata])
          .enter()
          .append("path")
          .attr("class", "lineConnect");

          ptFeatures.exit()
          .remove()

      var marker = g.append("circle")
          .attr("r", 10)
          .attr("id", "marker")
          .attr("class", "travelMarker");

      var originANDdestination = [featuresdata[0], featuresdata[ptFeatures.length]]

      var begend = g.selectAll(".drinks")
          .data(originANDdestination)
          .enter()
          .append("circle", ".drinks")
          .attr("r", 5)
          .style("fill", "#ff8888")
          .style("opacity", "1");

      map.on("viewreset", reset);

      reset();
      transition();

      function reset() {
          var bounds = d3path.bounds(userPoints),
              topLeft = bounds[0],
              bottomRight = bounds[1];

          begend.attr("transform",
              function(d) {
                  return "translate(" +
                      applyLatLngToLayer(d).x + "," +
                      applyLatLngToLayer(d).y + ")";
              });

          ptFeatures.attr("transform",
              function(d) {
                  return "translate(" +
                      applyLatLngToLayer(d).x + "," +
                      applyLatLngToLayer(d).y + ")";
              });

          marker.attr("transform",
              function() {
                  var y = featuresdata[0].geometry.coordinates[1]
                  var x = featuresdata[0].geometry.coordinates[0]
                  return "translate(" +
                      map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                      map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
              });

          svg.attr("width", bottomRight[0] - topLeft[0] + 120)
              .attr("height", bottomRight[1] - topLeft[1] + 120)
              .style("left", topLeft[0] - 50 + "px")
              .style("top", topLeft[1] - 50 + "px");


          linePath.attr("d", toLine);
          g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

      }

      function transition() {
          linePath.transition()
              .duration(15000)
              .attrTween("stroke-dasharray", tweenDash);
      }

      function tweenDash() {
          return function(t) {
              var l = linePath.node().getTotalLength();

              interpolate = d3.interpolateString("0," + l, l + "," + l);

              var marker = d3.select("#marker");

              var p = linePath.node().getPointAtLength(t * l);

              marker.attr("transform", "translate(" + p.x + "," + p.y + ")");
              var newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
              map.panTo(newCenter, 10);

              return interpolate(t);
          }
      }

       function projectPoint(x, y) {
           var point = map.latLngToLayerPoint(new L.LatLng(y, x));
           this.stream.point(point.x, point.y);
       }

  function applyLatLngToLayer(d) {
      var y = d.geometry.coordinates[1]
      var x = d.geometry.coordinates[0]
      return map.latLngToLayerPoint(new L.LatLng(y, x))
  }

      }
    });

    feed.run();

  }
