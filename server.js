const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

// app.use(express.static(path.join(__dirname, 'tktv2', 'dist', 'tktv2')));
app.use(express.static(path.join(__dirname, 'dist', 'tktv2')));

app.get('/search', (req, res) => {
  // map api
  const mygeo_api = "***";
  const location = req.query.location;
  let distance = req.query.distance;

  if (!distance) {
    distance = 10;
  }

  let lat, lng;

  // 改动-------------------------------------------------
  if (location=="Auto-Detecting") {

      // Make a call to the IPinfo API to get the coordinates
      fetch('https://ipinfo.io/?token=***')
        .then(response => response.json())
        .then(data => {
          const locArray = data.loc.split(',');
          lat = parseFloat(locArray[0]);
          lng = parseFloat(locArray[1]);
          searchEvents(res, lat, lng, distance, req.query);
        })
        .catch(error => {
          console.error('Error fetching IP info:', error);
          res.status(500).send('Error occurred while fetching location');
        });
    
  } else {
    const url_map = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${mygeo_api}`;
    axios.get(url_map)
      .then((response) => {
        const data_map = response.data;
        if (data_map.status === 'OK') {
          lat = data_map.results[0].geometry.location.lat;
          lng = data_map.results[0].geometry.location.lng;
          searchEvents(res, lat, lng, distance, req.query);
        } else {
          res.status(500).send(`Geocoding ERROR. Status: ${data_map.status}`);
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error occurred while fetching location 2');
      });
  }
});
// 改动----------------------------------------------------------

function searchEvents(res, lat, lng, distance, query) {
  // tktmaster api
  const keyword = query.keyword;
  const category = query.category;
  const checkdetect = query["check-detect"];

  const mytkt_api = "***";

  let url_tkt = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&latlong=${lat},${lng}&radius=${distance}&unit=miles&apikey=${mytkt_api}`;

  if (category && category !== "default") {
    if (category === "arts") {
      url_tkt += "&classificationName=arts&theatre";
    } else {
      url_tkt += `&classificationName=${category}`;
    }
  }

  axios.get(url_tkt)
    .then((response) => {
      const data = response.data;
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error occurred: search');
    });
}

app.use(cors());

const spotifyApi = new SpotifyWebApi({
  clientId: '***',
  clientSecret: '***'
});

app.get('/callsptf/:name', (req, res) => {

    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
        
        const artistName = req.params.name;

        spotifyApi.searchArtists(artistName)
          .then((data) => {
            const artists = data.body.artists.items;
            if (artists.length > 0) {
              const artistId = artists[0].id;
      
              spotifyApi.getArtist(artistId)
                .then((data) => {
                  const artist = data.body;
      
                  // Get artist's top tracks
                  spotifyApi.getArtistTopTracks(artistId, 'US')
                    .then((data) => {
                      const topTracks = data.body.tracks;
      
                      // Get artist's albums
                      spotifyApi.getArtistAlbums(artistId)
                        .then((data) => {
                          const albums = data.body.items;
      
                          // Construct artist object with all available data
                          const artistData = {
                            name: artist.name,
                            followers: artist.followers.total,
                            popularity: artist.popularity,
                            spotifyUrl: artist.external_urls.spotify,
                            images: artist.images,
                            topTracks: topTracks,
                            albums: albums,
                            
                          };
      
                          res.send(artistData);
                        })
                        .catch((error) => {
                          console.log(error);
                          res.status(500).send('Error occurred while fetching artist albums');
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      res.status(500).send('Error occurred while fetching artist top tracks');
                    });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).send('Error occurred while fetching artist details');
                });
            } else {
              res.status(404).send('Artist not found');
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send('Error occurred while searching for artist');
          });


      },
      function (err) {
        console.log(
          'Get error when retrieving an access token',
          err.message
        );
      }
    );
});


const port = parseInt(process.env.PORT) || 8080;
// const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
