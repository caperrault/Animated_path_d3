L.mapbox.accessToken = 'pk.eyJ1IjoiY2FwZXJyYXVsdCIsImEiOiI1ekhRZkRRIn0.p7tBrXttZFH2Xbfbc-whYA';
var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/caperrault.li24hcpp/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>', minZoom: 3
});

var userName1,
    userIDNumber1,
    userName2,
    userIDNumber2;

var user1Points = {
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": []
};

var user2Points = {
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": []
};

var userPointsBounds = {
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": []
};

var userBounds = function (myLayer) {
  map.fitBounds(myLayer.getBounds());
}

var groupBounds = function (myLayer1, myLayer2) {
  var group = L.featureGroup(myLayer1, myLayer2);
  console.log("group", group)
  map.fitBounds(group.getBounds());
}

var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([20, 0], 3);

    // we will be appending the SVG to the Leaflet map pane
    // g (group) element will be inside the svg
var svg1 = d3.select(map.getPanes().overlayPane).append("svg");

var svg2 = d3.select(map.getPanes().overlayPane).append("svg");

    // if you don't include the leaflet-zoom-hide when a
    // user zooms in or out you will still see the phantom
    // original SVG
var g1 = svg1.append("g").attr("class", "leaflet-zoom-hide");

var g2 = svg2.append("g").attr("class", "leaflet-zoom-hide");

  $('#someoneElseButton').on('click', function(event) {
    window.location.reload();
  });

  $('#mapButton').on('click', function(event) {

    event.preventDefault();

      userName1 = document.getElementById('userHandle1').value;
      userName2 = document.getElementById('userHandle2').value;
      getIDNumberMap1();
      getIDNumberMap2();

      // $(document).ajaxStop(function () {
      //
      //   console.log('userPointsBounds.features', userPointsBounds.features);
      //
      //   var userBoundsLayer = L.mapbox.featureLayer().setGeoJSON(userPointsBounds
      //     , {
      //     style: function(feature) { return feature.properties; }
      //   });
      //
      //   userBounds(userPointsBounds)

  // });



      // // console.log('userPointsBounds.features', userPointsBounds.features);
      // setTimeout(userBounds(userPointsBounds), 10000);
      //
      //               $.when(ajax1(), ajax2(), ajax3(), ajax4()).done(function(a1, a2, a3, a4){
      //             // the code here will be executed when all four ajax requests resolve.
      //             // a1, a2, a3 and a4 are lists of length 3 containing the response text,
      //             // status, and jqXHR object for each of the four ajax calls respectively.
      //         });
      //
      //         function ajax1() {
      //             // NOTE:  This function must return the value
      //             //        from calling the $.ajax() method.
      //             return $.ajax({
      //                 url: "someUrl",
      //                 dataType: "json",
      //                 data:  yourJsonData,
      //                 ...
      //             });
      //         }

      // userBounds(userLayer);
  })

  function getIDNumberMap1() {
      $.ajax({
        dataType: "jsonp",
        url:"https://api.instagram.com/v1/users/search?q=" + userName1 + "&access_token=1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105&callback=?",
        success: function(results) {

          userIDNumber1 = results.data[0].id;
          createUserMap(userIDNumber1, user1Points);
          createUserBounds(userIDNumber1, userPointsBounds);

        }
      });
  }

  function getIDNumberMap2() {
      $.ajax({
        dataType: "jsonp",
        url:"https://api.instagram.com/v1/users/search?q=" + userName2 + "&access_token=1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105&callback=?",
        success: function(results) {

          userIDNumber2 = results.data[0].id;
          createUserMap(userIDNumber2, user2Points);
          createUserBounds(userIDNumber2, userPointsBounds);

        }
      });
  }

  $('#animateButton1').on('click', function(event) {

    event.preventDefault();

    console.log('features inside the user1Points', user1Points.features.length);

      userName1 = document.getElementById('userHandle1').value;
      getIDNumberAnimate1();
  })

  $('#animateButton2').on('click', function(event) {

    event.preventDefault();

    console.log('features inside the user2Points', user1Points.features.length);

      userName2 = document.getElementById('userHandle2').value;
      getIDNumberAnimate2();
  })


  function getIDNumberAnimate1() {
      $.ajax({
        dataType: "jsonp",
        url:"https://api.instagram.com/v1/users/search?q=" + userName1 + "&access_token=1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105&callback=?",
        success: function(results) {

          userIDNumber1 = results.data[0].id;
          animateUser1Map(userIDNumber1);
        }
      });
  }

  function getIDNumberAnimate2() {
      $.ajax({
        dataType: "jsonp",
        url:"https://api.instagram.com/v1/users/search?q=" + userName2 + "&access_token=1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105&callback=?",
        success: function(results) {

          userIDNumber2 = results.data[0].id;
          animateUser2Map(userIDNumber2);
        }
      });
  }

  function createUserBounds (IDnumber, userPoints) {
    var feed = new Instafeed({
      get: 'user',
      target: 'feed-test',
      userId: parseInt(IDnumber),
      limit: '60',
      clientId: '37c96dd1404a4fb0a6610dff7342292e',
      accessToken: '1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105',
      success: function(data) {
      //  console.log('user1Points.features', user1Points.features);

      //userPointsBounds.features = [];

        for (var i = 0; i < data.data.length; i ++) {

          userPoints.features.push(
            {
              "type": "Feature", "properties": { "id": "route1", 'marker-size': 'small', "marker-color": "#ff8888"}, "geometry": { "type": "Point", "coordinates": [data.data[i].location.longitude, data.data[i].location.latitude]},
            });
          }

        var userLayer = L.mapbox.featureLayer().setGeoJSON(userPoints, {
          style: function(feature) { return feature.properties; }
        });

        userBounds(userLayer);
        //console.log('features inside the userPointsBounds', userPoints.features.length);

      }
    });

    feed.run();

  }

  function createUserMap (IDnumber, userPoints) {
    var feed = new Instafeed({
      get: 'user',
      target: 'feed-test',
      userId: parseInt(IDnumber),
      limit: '60',
      clientId: '37c96dd1404a4fb0a6610dff7342292e',
      accessToken: '1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105',
      success: function(data) {
      //  console.log('user1Points.features', user1Points.features);

        user1Points.features = [];
        user2Points.features = [];

        for (var i = 0; i < data.data.length; i ++) {

          if (userPoints === user1Points) {

          userPoints.features.push(
            {
              "type": "Feature", "properties": { "id": "route1", 'marker-size': 'small', "marker-color": "#ff8888"}, "geometry": { "type": "Point", "coordinates": [data.data[i].location.longitude, data.data[i].location.latitude]},
            });
          }

          else {
            userPoints.features.push(
              {
                "type": "Feature", "properties": { "id": "route1", 'marker-size': 'small', "marker-color": "#B7C8FF"}, "geometry": { "type": "Point", "coordinates": [data.data[i].location.longitude, data.data[i].location.latitude]},
              });
          }
          }

        var userLayer = L.mapbox.featureLayer().setGeoJSON(userPoints, {
          style: function(feature) { return feature.properties; }
          })
          .addTo(map);

      }
    });

    feed.run();

  }

  function animateUser1Map (IDnumber) {
    var feed = new Instafeed({
      get: 'user',
      target: 'feed-test',
    //  userId: 180449955,
      userId: parseInt(IDnumber),
      limit: '60',
      clientId: '37c96dd1404a4fb0a6610dff7342292e',
      accessToken: '1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105',
      success: function(data) {

        user1Points.features = [];

        for (var i = 0; i < data.data.length; i ++) {
          user1Points.features.push(
            {
              "type": "Feature", "properties": { "id": "route1"}, "geometry": { "type": "Point", "coordinates": [data.data[i].location.longitude, data.data[i].location.latitude]},
            });
        }

        console.log('user1Points', user1Points);
        var user1Layer = L.mapbox.featureLayer().setGeoJSON(user1Points);
        //.addTo(map);
        userBounds(user1Layer)

      // this is not needed right now, but for future we may need
      // to implement some filtering. This uses the d3 filter function
      // featuresdata is an array of point objects

      var featuresdata = user1Points.features.filter(function(d) {
          return d.properties.id == "route1"
      })

      //stream transform. transforms geometry before passing it to
      // listener. Can be used in conjunction with d3.geo.path
      // to implement the transform.

      var transform = d3.geo.transform({
          point: projectPoint
      });

      //d3.geo.path translates GeoJSON to SVG path codes.
      //essentially a path generator. In this case it's
      // a path generator referencing our custom "projection"
      // which is the Leaflet method latLngToLayerPoint inside
      // our function called projectPoint
      var d3path = d3.geo.path().projection(transform);

      // Here we're creating a FUNCTION to generate a line
      // from input points. Since input points will be in
      // Lat/Long they need to be converted to map units
      // with applyLatLngToLayer
      var toLine = d3.svg.line()
          .interpolate("linear")
          .x(function(d) {
              return applyLatLngToLayer(d).x
          })
          .y(function(d) {
              return applyLatLngToLayer(d).y
          });


      // From now on we are essentially appending our features to the
      // group element. We're adding a class with the line name
      // and we're making them invisible

      // these are the points that make up the path
      // they are unnecessary so I've make them
      // transparent for now
      var ptFeatures = g1.selectAll("circle")
          .data(featuresdata)
          .enter()
          .append("circle")
          .attr("r", 3)
          .attr("class", "waypoints1");

    //       ptFeatures.exit()
    //  .remove()

      // Here we will make the points into a single
      // line/path. Note that we surround the featuresdata
      // with [] to tell d3 to treat all the points as a
      // single line. For now these are basically points
      // but below we set the "d" attribute using the
      // line creator function from above.
      var linePath = g1.selectAll(".lineConnect1")
          .data([featuresdata])
          .enter()
          .append("path")
          .attr("class", "lineConnect1");
          //.style("display", null)

    //       linePath.exit()
    //  .remove()

      // This will be our traveling circle it will
      // travel along our path
      var marker = g1.append("circle")
          .attr("r", 10)
          .attr("id", "marker1")
          .attr("class", "travelMarker1");

      // For simplicity I hard-coded this! I'm taking
      // the first and the last object (the origin)
      // and destination and adding them separately to
      // better style them. There is probably a better
      // way to do this!
      var origin = [featuresdata[0]]

      var begend = g1.selectAll(".extremities1")
          .data(origin)
          .enter()
          .append("circle", ".extremities1")
          .attr("r", 5)
          .style("fill", "#ff8888")
          .style("opacity", "1");

      // I want names for my coffee and beer
      // var text = g.selectAll("text")
      //     .data(originANDdestination)
      //     .enter()
      //     .append("text")
      //     .text(function(d) {
      //         return d.properties.name
      //     })
      //     .attr("class", "locnames")
      //     .attr("y", function(d) {
      //         return -10
      //     })


      // when the user zooms in or out you need to reset
      // the view
      map.on("viewreset", reset);

      // this puts stuff on the map!
      reset();
      transition();

      // Reposition the SVG to cover the features.
      function reset() {
          var bounds = d3path.bounds(user1Points),
              topLeft = bounds[0],
              bottomRight = bounds[1];


          // here you're setting some styles, width, heigh etc
          // to the SVG. Note that we're adding a little height and
          // width because otherwise the bounding box would perfectly
          // cover our features BUT... since you might be using a big
          // circle to represent a 1 dimensional point, the circle
          // might get cut off.

          // text.attr("transform",
          //     function(d) {
          //         return "translate(" +
          //             applyLatLngToLayer(d).x + "," +
          //             applyLatLngToLayer(d).y + ")";
          //     });


          // for the points we need to convert from latlong
          // to map units
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

          // again, not best practice, but I'm harding coding
          // the starting point

          marker.attr("transform",
              function() {
                  var y = featuresdata[0].geometry.coordinates[1]
                  var x = featuresdata[0].geometry.coordinates[0]
                  return "translate(" +
                      map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                      map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
              });


          // Setting the size and location of the overall SVG container
          svg1.attr("width", bottomRight[0] - topLeft[0] + 120)
              .attr("height", bottomRight[1] - topLeft[1] + 120)
              .style("left", topLeft[0] - 50 + "px")
              .style("top", topLeft[1] - 50 + "px");


          // linePath.attr("d", d3path);
          linePath.attr("d", toLine)
          // ptPath.attr("d", d3path);
          g1.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

      } // end reset

      // the transition function could have been done above using
      // chaining but it's cleaner to have a separate function.
      // the transition. Dash array expects "500, 30" where
      // 500 is the length of the "dash" 30 is the length of the
      // gap. So if you had a line that is 500 long and you used
      // "500, 0" you would have a solid line. If you had "500,500"
      // you would have a 500px line followed by a 500px gap. This
      // can be manipulated by starting with a complete gap "0,500"
      // then a small line "1,500" then bigger line "2,500" and so
      // on. The values themselves ("0,500", "1,500" etc) are being
      // fed to the attrTween operator
      function transition() {
          linePath.transition()
              .duration(15000)
              .attrTween("stroke-dasharray", tweenDash)
              // .each("end", function() {
              //     d3.select(this).call(transition);// infinite loop
              // })
              ;
      } //end transition

      // this function feeds the attrTween operator above with the
      // stroke and dash lengths
      function tweenDash() {
          return function(t) {
              //total length of path (single value)
              var l = linePath.node().getTotalLength();

              // this is creating a function called interpolate which takes
              // as input a single value 0-1. The function will interpolate
              // between the numbers embedded in a string. An example might
              // be interpolatString("0,500", "500,500") in which case
              // the first number would interpolate through 0-500 and the
              // second number through 500-500 (always 500). So, then
              // if you used interpolate(0.5) you would get "250, 500"
              // when input into the attrTween above this means give me
              // a line of length 250 followed by a gap of 500. Since the
              // total line length, though is only 500 to begin with this
              // essentially says give me a line of 250px followed by a gap
              // of 250px.
              interpolate = d3.interpolateString("0," + l, l + "," + l);
              //t is fraction of time 0-1 since transition began
              var marker = d3.select("#marker1");

              // p is the point on the line (coordinates) at a given length
              // along the line. In this case if l=50 and we're midway through
              // the time then this would 25.
              var p = linePath.node().getPointAtLength(t * l);

              //Move the marker to that point
              marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
              var newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
              map.panTo(newCenter, 10);
          //    console.log(interpolate(t))
              return interpolate(t);
          }
      } //end tweenDash

      // Use Leaflet to implement a D3 geometric transformation.
      // the latLngToLayerPoint is a Leaflet conversion method:
      //Returns the map layer point that corresponds to the given geographical
      // coordinates (useful for placing overlays on the map).
       function projectPoint(x, y) {
           var point = map.latLngToLayerPoint(new L.LatLng(y, x));
           this.stream.point(point.x, point.y);
       } //end projectPoint

  // similar to projectPoint this function converts lat/long to
  // svg coordinates except that it accepts a point from our
  // GeoJSON

  function applyLatLngToLayer(d) {
      var y = d.geometry.coordinates[1]
      var x = d.geometry.coordinates[0]
      return map.latLngToLayerPoint(new L.LatLng(y, x))
  }

      }
    });

    feed.run();

  }

  function animateUser2Map (IDnumber) {
    var feed = new Instafeed({
      get: 'user',
      target: 'feed-test',
    //  userId: 180449955,
      userId: parseInt(IDnumber),
      limit: '60',
      clientId: '37c96dd1404a4fb0a6610dff7342292e',
      accessToken: '1475152662.37c96dd.360df1e0dfd94aa3abfe431278798105',
      success: function(data) {

        for (var i = 0; i < data.data.length; i ++) {
          user2Points.features.push(
            {
              "type": "Feature", "properties": { "id": "route1"}, "geometry": { "type": "Point", "coordinates": [data.data[i].location.longitude, data.data[i].location.latitude]},
            });
        }
        var user2Layer = L.mapbox.featureLayer().setGeoJSON(user2Points);
        userBounds(user2Layer)

      // this is not needed right now, but for future we may need
      // to implement some filtering. This uses the d3 filter function
      // featuresdata is an array of point objects

      var featuresdata = user2Points.features.filter(function(d) {
          return d.properties.id == "route1"
      })

      //stream transform. transforms geometry before passing it to
      // listener. Can be used in conjunction with d3.geo.path
      // to implement the transform.

      var transform = d3.geo.transform({
          point: projectPoint
      });

      //d3.geo.path translates GeoJSON to SVG path codes.
      //essentially a path generator. In this case it's
      // a path generator referencing our custom "projection"
      // which is the Leaflet method latLngToLayerPoint inside
      // our function called projectPoint
      var d3path = d3.geo.path().projection(transform);

      // Here we're creating a FUNCTION to generate a line
      // from input points. Since input points will be in
      // Lat/Long they need to be converted to map units
      // with applyLatLngToLayer
      var toLine = d3.svg.line()
          .interpolate("linear")
          .x(function(d) {
              return applyLatLngToLayer(d).x
          })
          .y(function(d) {
              return applyLatLngToLayer(d).y
          });


      // From now on we are essentially appending our features to the
      // group element. We're adding a class with the line name
      // and we're making them invisible

      // these are the points that make up the path
      // they are unnecessary so I've make them
      // transparent for now
      var ptFeatures = g2.selectAll("circle")
          .data(featuresdata)
          .enter()
          .append("circle")
          .attr("r", 3)
          .attr("class", "waypoints2");

    //       ptFeatures.exit()
    //  .remove()

      // Here we will make the points into a single
      // line/path. Note that we surround the featuresdata
      // with [] to tell d3 to treat all the points as a
      // single line. For now these are basically points
      // but below we set the "d" attribute using the
      // line creator function from above.
      var linePath = g2.selectAll(".lineConnect2")
          .data([featuresdata])
          .enter()
          .append("path")
          .attr("class", "lineConnect2");
          //.style("display", null)

    //       linePath.exit()
    //  .remove()

      // This will be our traveling circle it will
      // travel along our path
      var marker = g2.append("circle")
          .attr("r", 10)
          .attr("id", "marker2")
          .attr("class", "travelMarker2");

      // For simplicity I hard-coded this! I'm taking
      // the first and the last object (the origin)
      // and destination and adding them separately to
      // better style them. There is probably a better
      // way to do this!
      var origin = [featuresdata[0]]

      var begend = g2.selectAll(".extremities2")
          .data(origin)
          .enter()
          .append("circle", ".extremities2")
          .attr("r", 5)
          .style("fill", "#B7C8FF")
          .style("opacity", "1");

      // I want names for my coffee and beer
      // var text = g.selectAll("text")
      //     .data(originANDdestination)
      //     .enter()
      //     .append("text")
      //     .text(function(d) {
      //         return d.properties.name
      //     })
      //     .attr("class", "locnames")
      //     .attr("y", function(d) {
      //         return -10
      //     })


      // when the user zooms in or out you need to reset
      // the view
      map.on("viewreset", reset);

      // this puts stuff on the map!
      reset();
      transition();

      // Reposition the SVG to cover the features.
      function reset() {
          var bounds = d3path.bounds(user2Points),
              topLeft = bounds[0],
              bottomRight = bounds[1];


          // here you're setting some styles, width, heigh etc
          // to the SVG. Note that we're adding a little height and
          // width because otherwise the bounding box would perfectly
          // cover our features BUT... since you might be using a big
          // circle to represent a 1 dimensional point, the circle
          // might get cut off.

          // text.attr("transform",
          //     function(d) {
          //         return "translate(" +
          //             applyLatLngToLayer(d).x + "," +
          //             applyLatLngToLayer(d).y + ")";
          //     });


          // for the points we need to convert from latlong
          // to map units
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

          // again, not best practice, but I'm harding coding
          // the starting point

          marker.attr("transform",
              function() {
                  var y = featuresdata[0].geometry.coordinates[1]
                  var x = featuresdata[0].geometry.coordinates[0]
                  return "translate(" +
                      map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                      map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
              });


          // Setting the size and location of the overall SVG container
          svg2.attr("width", bottomRight[0] - topLeft[0] + 120)
              .attr("height", bottomRight[1] - topLeft[1] + 120)
              .style("left", topLeft[0] - 50 + "px")
              .style("top", topLeft[1] - 50 + "px");


          // linePath.attr("d", d3path);
          linePath.attr("d", toLine)
          // ptPath.attr("d", d3path);
          g2.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

      } // end reset

      // the transition function could have been done above using
      // chaining but it's cleaner to have a separate function.
      // the transition. Dash array expects "500, 30" where
      // 500 is the length of the "dash" 30 is the length of the
      // gap. So if you had a line that is 500 long and you used
      // "500, 0" you would have a solid line. If you had "500,500"
      // you would have a 500px line followed by a 500px gap. This
      // can be manipulated by starting with a complete gap "0,500"
      // then a small line "1,500" then bigger line "2,500" and so
      // on. The values themselves ("0,500", "1,500" etc) are being
      // fed to the attrTween operator
      function transition() {
          linePath.transition()
              .duration(15000)
              .attrTween("stroke-dasharray", tweenDash)
              // .each("end", function() {
              //     d3.select(this).call(transition);// infinite loop
              // })
              ;
      } //end transition

      // this function feeds the attrTween operator above with the
      // stroke and dash lengths
      function tweenDash() {
          return function(t) {
              //total length of path (single value)
              var l = linePath.node().getTotalLength();

              // this is creating a function called interpolate which takes
              // as input a single value 0-1. The function will interpolate
              // between the numbers embedded in a string. An example might
              // be interpolatString("0,500", "500,500") in which case
              // the first number would interpolate through 0-500 and the
              // second number through 500-500 (always 500). So, then
              // if you used interpolate(0.5) you would get "250, 500"
              // when input into the attrTween above this means give me
              // a line of length 250 followed by a gap of 500. Since the
              // total line length, though is only 500 to begin with this
              // essentially says give me a line of 250px followed by a gap
              // of 250px.
              interpolate = d3.interpolateString("0," + l, l + "," + l);
              //t is fraction of time 0-1 since transition began
              var marker = d3.select("#marker2");

              // p is the point on the line (coordinates) at a given length
              // along the line. In this case if l=50 and we're midway through
              // the time then this would 25.
              var p = linePath.node().getPointAtLength(t * l);

              //Move the marker to that point
              marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
              var newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
              map.panTo(newCenter, 10);
          //    console.log(interpolate(t))
              return interpolate(t);
          }
      } //end tweenDash

      // Use Leaflet to implement a D3 geometric transformation.
      // the latLngToLayerPoint is a Leaflet conversion method:
      //Returns the map layer point that corresponds to the given geographical
      // coordinates (useful for placing overlays on the map).
       function projectPoint(x, y) {
           var point = map.latLngToLayerPoint(new L.LatLng(y, x));
           this.stream.point(point.x, point.y);
       } //end projectPoint

  // similar to projectPoint this function converts lat/long to
  // svg coordinates except that it accepts a point from our
  // GeoJSON

  function applyLatLngToLayer(d) {
      var y = d.geometry.coordinates[1]
      var x = d.geometry.coordinates[0]
      return map.latLngToLayerPoint(new L.LatLng(y, x))
  }

      }
    });

    feed.run();

  }
