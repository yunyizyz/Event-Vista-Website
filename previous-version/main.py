from flask import Flask, redirect, url_for, request, send_from_directory,jsonify
import requests
import json
import os

app = Flask(__name__)

#第一个app.route的数据和action保持一致-发送数据
#第二个route和XMLHttpRequest保持一致-存储数据

@app.route('/')
def root():
    return app.send_static_file('tktmaster-project-zy.html')
    # Show page on root

@app.route('/search',methods = ['GET'])
def search():
     #map api
     mygeo_api="AIzaSyAUootxU_8BMAiaPUPcPKvrWZpGWWyL4B4"
     location = request.args.get('location')
     distance= request.args.get('distance')

     if distance=="":
          distance=10

     if location=="":        
          ipinfo_api = "45ba43872621fc"
          responseip = requests.get(f"https://ipinfo.io/json?token={ipinfo_api}")
          ip_data = responseip.json()
          lat, lng = ip_data['loc'].split(",")

     else:     
          url_map = f'https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={mygeo_api}'
          response1 = requests.get(url_map)
          data_map = response1.json()
          if data_map['status'] == 'OK':
               lat = data_map['results'][0]['geometry']['location']['lat']
               lng = data_map['results'][0]['geometry']['location']['lng']
          else:
               return "Geocoding ERROR. Status:", data_map['status']


     #tktmaster api
     keyword = request.args.get('keyword') 
     category = request.args.get('category') 
     checkdetect = request.args.get('check-detect')

     mytkt_api="YTieJwbkIX90aLCrqmBHc7juN1fsGhGM"

     url_tkt = f"https://app.ticketmaster.com/discovery/v2/events.json?keyword={keyword}&latlong={lat},{lng}&radius={distance}&unit=miles&apikey={mytkt_api}"

     if category!="default":
          if category=="arts":
               url_tkt += f"&classificationName=arts&theatre"
          else:
               url_tkt += f"&classificationName={category}"

     response2 = requests.get(url_tkt)
     data = response2.json()

     return jsonify(data)

if __name__ == '__main__':
     app.run(debug=True)