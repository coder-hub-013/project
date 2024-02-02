mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map ({
    container : "map",
    center : listing.geometry.coordinates,
    zoom : 9
});

// map.on("load", () => {
//     map.loadImage("https://docs.mapbox-gl-js/assets/cat.png");
//     (error,image) => {
//         if(error) throw error;

//         map.addImage("cat", image);

//         map.addSource("point", {
//             "type" : "geojson",
//             "data" : {
//                 "type" :"FeatureCollection",
//                 "feature" : [
//                     {
//                         "type" : "Reature",
//                         "geometry" : {
//                             "type" : "Point",
//                             "coordinates" : [-77.4144,25.0759]
//                         }
//                     }
//                 ]
                
//             }
//         });
//     }
// })

const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title} </h4><p>Exact Location provided after booking</p>`))
    .addTo(map);

