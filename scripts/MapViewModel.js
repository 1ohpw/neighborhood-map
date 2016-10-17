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
    name: "House Martell of Dorne",
    country: 'Spain'
  }
];

function MapViewModel() {
  var mvm = this;

  var map;
  var markers = [];

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
      zoom: 2
    });
  };

  function createMarker(geocoder, house) {
      var lat, lng, latLng, marker, infoWindow;
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
            content: house.name
          });

          marker.addListener('click', function() {
            if(marker.getAnimation() == null) {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
              marker.setAnimation(null);
            }
            infoWindow.open(map, marker);
          });

          markers.push(marker);

        } else {
          console.log('Geocode unsuccessful');
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
});
