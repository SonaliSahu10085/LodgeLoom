// console.log(coordinates)
const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
  center: coordinates,
  zoom: 6,
});

const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);
