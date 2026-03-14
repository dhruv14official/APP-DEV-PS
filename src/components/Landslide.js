import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:"https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:"https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const uttarakhandBounds = [
  [28.7,77.5],
  [31.5,81.1]
];

function MapClick({ setPoint }) {

  useMapEvents({
    click(e){

      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      axios.get(`http://localhost:5000/slope?lat=${lat}&lon=${lon}`)
      .then(res => {

        const slope = res.data.slope || 0;

        let slopeRating = 1;

        if (slope < 5) slopeRating = 1;
        else if (slope < 15) slopeRating = 2;
        else if (slope < 30) slopeRating = 3;
        else if (slope < 45) slopeRating = 4;
        else slopeRating = 5;

        const risk = (slopeRating/5)*100;

        setPoint({
          lat,
          lon,
          risk:risk.toFixed(2)
        });

      });

    }
  });

  return null;
}

export default function MapTab(){

  const [point,setPoint] = useState(null);
  const markerRef = useRef();

  useEffect(()=>{
    if(markerRef.current) markerRef.current.openPopup();
  },[point]);

  return(

    <MapContainer
      center={[30.1,79]}
      zoom={7}
      maxBounds={uttarakhandBounds}
      style={{height:"500px"}}
    >

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      <MapClick setPoint={setPoint}/>

      {point && (
        <Marker ref={markerRef} position={[point.lat,point.lon]}>
          <Popup>
            Risk Index: {point.risk}
          </Popup>
        </Marker>
      )}

    </MapContainer>

  );
}