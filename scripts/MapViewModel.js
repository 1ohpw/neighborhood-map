var locations = [
  {
    name: 'HanaHaus',
    address: '456 University Ave, Palo Alto, CA 94301'
  },
  {
    name: 'AWS Pop-up Loft',
    address: '925 Market St, San Francisco, CA 94103'
  },
  {
    name: 'B2 Coffee',
    address: '87 N San Pedro St, San Jose, CA 95110'
  },
  {
    name: 'Avalon',
    address: '255 King St, San Francisco, CA 94107'
  },
  {
    name: 'Android Statue Garden',
    address: '1981 Landings Dr, Mountain View, CA 94043'
  }
];

function MapViewModel() {
  var mvm = this;

  var map;
  var markers = [];

  mvm.locationsObservable = ko.observableArray();
  locations.forEach(function(location) {
    mvm.locationsObservable.push(location);
  });

  mvm.filterBox = ko.observable('');

  function filterSearch(q) {
    if(q == '') {
      mvm.locationsObservable.removeAll();
      locations.forEach(function(location) {
        mvm.locationsObservable.push(location);
      });
      markers.forEach(function(marker) {
        marker.setVisible(true);
      });
    } else {
      mvm.locationsObservable.removeAll();
      locations.forEach(function(location) {
        var locationName = location.name.toLowerCase();
        var filterQuery = q.toLowerCase();
        if (locationName.indexOf(filterQuery) >= 0) {
          mvm.locationsObservable.push(location);
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
      center: {lat: 37.5483, lng: -121.9886},
      zoom: 10
    });
  };

  function createMarker(geocoder, location) {
      var lat, lng, latLng, marker, infoWindow;
      geocoder.geocode({
        'address': location.address
      }, function(result, status) {
        if (status == 'OK') {
          lat = result[0].geometry.location.lat();
          lng = result[0].geometry.location.lng();
          latLng = {'lat': lat, 'lng': lng};

          marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: location.name,
            visible: true
          });

          infoWindow = new google.maps.InfoWindow({
            content: location.name
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
  locations.forEach(function(location, i) {
    createMarker(geocoder, location);
  });

  setMarkers();

}

$(document).ready(function() {
  ko.applyBindings(new MapViewModel());
});
