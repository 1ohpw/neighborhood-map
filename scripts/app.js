$(document).ready(function() {
  var map;
  var latLngs = [{lat: 37.783316, lng:-122.40846399999998},
                 {lat: 37.4475589, lng:-122.15954970000001},
                 {lat: 37.7908727, lng:-122.40129660000002},
                 {lat: 37.4467136, lng:-122.16043760000002},
                 {lat: 37.7770722, lng:-122.39364139999998}];

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.5630, lng: -122.3255},
      zoom: 10,
    });
  };

  function renderMapMarkers(latLngArr) {
    var marker;
    latLngArr.forEach(function(latLng) {
      marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
      marker.addListener('click', function() {
        //open info window and animate markers
        //marker.setAnimation(google.maps.Animation.BOUNCE);
      });
      marker.setMap(map);
    });
  };

  initMap();
  renderMapMarkers(latLngs);
});
