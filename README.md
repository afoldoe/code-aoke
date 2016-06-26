# spotify_api

Clone repo and ```npm install```

To setup, follow the instructions from the spotify api https://developer.spotify.com/web-api/tutorial/ to create your own app, then save your own Client ID, Client Secret, and redirect URI. 

The express app used for this repo is listening on port 8888, so using Redirect URI: http://localhost:8888/callback will work well, you can set app to listen on any port preferred though. 

Create: ```./config/spotify_api.js``` and export keys with code below.  

```
module.exports = {
client_id : {Your client id}
client_secret: {Your secret}
redirect_uri: {Your redirect uri}
};  
```


note that .gitignore will not allow you to commit or push


run ```node server.js``` and navigate to localhost:8888. Check console when submitting form so see popular songs returned. 
