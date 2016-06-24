var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
//needs track js functions for retrieving spotifyAPI data.
var track = require('./app/track/track.js');
// var video = require('./app/video/video.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('views'));
app.use('/styles', express.static('styles'));
app.use('/vendor', express.static('vendor'));
app.use('/scripts', express.static('scripts'));
app.use('/hbs', express.static('hbs'));

var port = 8888;





app.get('/', function(req, res){
  res.render('index.html');
})

app.post('/genreTracks', function(req, res){
  console.log('inside of /tracks get')
  var genre = req.body.genre;
  var send = function(data){
    res.send(data);
  }
  track.genreFetch(genre, send);
});

app.post('/yearTracks', function(req, res){
  console.log('inside of /tracks get')
  var year = req.body.year;
  var send = function(data){
    res.send(data);
  }
  track.yearFetch(year, send);
});

app.post('/termTracks', function(req, res){
  console.log('inside of /tracks get')
  var term = req.body.term;
  var send = function(data){
    res.send(data);
  }
  track.termFetch(term, send);
});

app.post('/video', function(req, res){
  console.log('inside of /video post')
  var send = function(data){
    res.send(data);
  }
  track.videoFetch(req.body.track , req.body.artist , send);
});




app.listen(port, function(){
  console.log('app listening on port ' + port);
})
