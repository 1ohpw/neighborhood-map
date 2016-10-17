var houses = [
  {
    name: 'House Stark of Winterfell',
    country: 'Russia'
  },
  {
    name: 'House Lannister of Casterly Rock',
    country: 'United States of America'
  },
  {
    name: "House Baratheon of King's Landing",
    country: 'United Kingdom'
  },
  {
    name: 'House Greyjoy of Pyke',
    country: 'Japan'
  },
  {
    name: "House Targaryen of King's Landing",
    country: 'China'
  },
  {
    name: "House Nymeros Martell of Sunspear",
    country: 'Spain'
  }
];

var map;
var markers = [];
var infoWindows = [];

function MapViewModel() {
  var mvm = this;

  mvm.housesObservable = ko.observableArray();
  houses.forEach(function(house) {
    mvm.housesObservable.push(house);
  });

  mvm.filterBox = ko.observable('');

  function filterSearch(q) {
    if(q == '') {
      mvm.housesObservable.removeAll();
      houses.forEach(function(house) {
        mvm.housesObservable.push(house);
      });
      markers.forEach(function(marker) {
        marker.setVisible(true);
      });
    } else {
      mvm.housesObservable.removeAll();
      houses.forEach(function(house) {
        var houseName = house.name.toLowerCase();
        var filterQuery = q.toLowerCase();
        if (houseName.indexOf(filterQuery) >= 0) {
          mvm.housesObservable.push(house);
        }
       });
       markers.forEach(function(marker) {
         var markerTitle = marker.title.toLowerCase();
         if (markerTitle.indexOf(q.toLowerCase()) >= 0) {
           marker.setVisible(true);
         } else {
           marker.setVisible(false);
         }
       });
    }
  }

  mvm.filterBox.subscribe(filterSearch);



  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 28.0339, lng: 1.6596},
      zoom: 2,
      mapTypeId: 'satellite'
    });
  };

  function createMarker(geocoder, house) {
    var lat, lng, latLng, marker, infoWindow, content;
    $.ajax({
      url: "http://www.anapioficeandfire.com/api/houses/?name=" + house.name,
      method: 'GET',
      success: function(res) {
        var houseData = res[0];
        console.log(houseData);
        content =
            '<p>Name: ' + houseData.name + '</p>'
            +'<p>Region: ' + houseData.region + '</p>'
            + '<p>Founded: ' + houseData.founded + '</p>'
            + '<p>Words: ' + houseData.words + '</p>'
            +'<p>Coat of Arms: ' + houseData.coatOfArms + '</p>';


            geocoder.geocode({
              'address': house.country
            }, function(result, status) {
              if (status == 'OK') {
                lat = result[0].geometry.location.lat();
                lng = result[0].geometry.location.lng();
                latLng = {'lat': lat, 'lng': lng};

                marker = new google.maps.Marker({
                  position: latLng,
                  map: map,
                  title: house.name,
                  visible: true
                });

                infoWindow = new google.maps.InfoWindow({
                  content: content,
                  house: house.name
                });

                infoWindows.push(infoWindow);

                marker.addListener('click', function() {
                  if (marker.getAnimation() == null) {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function(){ marker.setAnimation(null); }, 800);
                    infoWindow.open(map, marker);
                  }
                });

                markers.push(marker);

              } else {
                console.log('Geocode unsuccessful');
              }
            });
          }
    });
  };

  function setMarkers() {
    markers.forEach(function(marker) {
      marker.setMap(map);
    });
  }

  initMap();
  var geocoder = new google.maps.Geocoder();
  houses.forEach(function(house, i) {
    createMarker(geocoder, house);
  });

  setMarkers();

}

$(document).ready(function() {
  ko.applyBindings(new MapViewModel());

  $(".listview-item").click(function() {
    var clickedHouse = $(this).text();
    markers.forEach(function(marker) {
      if (clickedHouse == marker.title) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 800);
        infoWindows.forEach(function(infoWindow) {
          if (infoWindow.house == marker.title) {
            infoWindow.open(map, marker);
          }
        });
      }
    });
  });
});
