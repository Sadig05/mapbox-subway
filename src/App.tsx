import { useState, useEffect, useRef, useMemo } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Supercluster, { PointFeature } from "supercluster";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import Map, { Source, Layer, Marker, MapRef, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Box, Center } from "@chakra-ui/react";
import data from "./db.json";
import CustomMarker from "./CustomMarker";
const token =import.meta.env.VITE_APP_MAPBOX_TOKEN;

export interface IData {
  [x: string]: any;
  name: string;
  url: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: number;
  country: string;
  phone_number_1: string;
  phone_number_2: string;
  fax_1: string;
  fax_2: string;
  email_1: string;
  email_2: string;
  website: string;
  open_hours: string;
  latitude: number;
  longitude: number;
  facebook: string;
  twitter: string;
  instagram: string;
  pinterest: string;
  youtube: string;
  cluster_id?: number;
}

const temp: any = data;

const geoData: PointFeature<IData>[] = temp.map((row: IData) => {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [row.longitude, row.latitude],
    },
    properties: row,
  };
});

const index = new Supercluster({
  radius: 40,
  maxZoom: 16,
});

index.load(geoData);

function App() {
  const mapRef = useRef<MapRef>(null);
  const [bounds, setBounds] = useState<LngLatBounds>();
  const [zoom, setZoom] = useState<number>(3);
  const Cluster = useMemo(() => {
    if (!bounds) return;
    const clusters = index.getClusters(
      [
        bounds?.getWest(),
        bounds?.getSouth(),
        bounds?.getEast(),
        bounds?.getNorth(),
      ],
      zoom
    );
    return clusters.map((item: any) => {
      {
        let leaves: any = [];
        let pointCount = item.properties.point_count;
        if ("cluster" in item.properties) {
          leaves = index.getLeaves(item.id, Infinity);
        }
        return (
          <CustomMarker
            lon={item.geometry.coordinates[0]}
            lat={item.geometry.coordinates[1]}
            count={pointCount}
            item={item}
            leaves={leaves}
          />
        );
      }
    });
  }, [bounds, zoom]);

  return (
    <div className="app-container">
      <div className="info-container">
        <h1 className="info-title">Discover Subway Restaurants Across America</h1>
        <p className="info-text">
          Explore the vast network of Subway restaurants across America with our interactive map. Whether you're craving a classic sub or want to try their latest creations, Subway has something for everyone.
        </p>
      </div>
      <div className="map-container">
        <Map
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3,
          }}
          onZoomEnd={(e) => {
            setZoom(e.target.getZoom());
            setBounds(e.target.getBounds());
          }}
          onDragEnd={(e) => {
            setZoom(e.target.getZoom());
            setBounds(e.target.getBounds());
          }}
          onLoad={(e) => {
            setZoom(e.target.getZoom());
            setBounds(e.target.getBounds());
          }}
          // onZoom={handleChange}
          style={{ width: "100%", height: "80vh" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={token}
        >
          {Cluster}
        </Map>
      </div>
      <div className="footer">© 2024 Nippon. All rights reserved.</div>
    </div>
  );
}

export default App;
