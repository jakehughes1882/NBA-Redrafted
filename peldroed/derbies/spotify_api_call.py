import pprint
import sys
from dateutil.parser import parse

import spotipy
import spotipy.util as util
import simplejson as json

username = #insert username
scope = 'user-top-read'
client_id = #insert client_id
client_secret = #insert client_secret
redirect_uri = #insert link to developer app, ie. 'https://developer.spotify.com/dashboard/applications/bf1b9428a845446e9004d8ede7a243d1'
token = util.prompt_for_user_token(username,scope,client_id=client_id,client_secret=client_secret,redirect_uri=redirect_uri)


if token:
    sp = spotipy.Spotify(auth=token)
    sp.trace = False
    results = sp.current_user_top_tracks(time_range='long_term', limit=50)
    for i, item in enumerate(results['items']):
        print i, item['name'], '//', item['artists'][0]['name'], '//', item['album']['release_date']
    #Results can only be printed         
    results = sp.current_user_top_tracks(time_range='long_term', limit=100, offset=49)
    for i, item in enumerate(results['items']):
        print i+49, item['name'], '//', item['artists'][0]['name'], '//', item['album']['release_date']
else:
    print("Can't get token for", username)