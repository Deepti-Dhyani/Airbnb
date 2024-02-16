 mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
  });

  console.log(coordinates);

  const marker = new mapboxgl.Marker({color: "red"})
  .setLngLat(coordinates) //listing.geometry.coordinates
//   .setPopup(
//     new mapboxgl.popup({offset: 25})
  
//   .setHTML(`<h3>${listing.title}</h3><p>you'll be living here! </p>`)
//   )
  .addTo(map);
  