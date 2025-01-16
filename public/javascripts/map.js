// console.log(coordinates)
const map = new maplibregl.Map({
  container: "map",
  style:
    "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
  center: coordinates,
  zoom: 6,
});

const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);

