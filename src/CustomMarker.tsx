import React, { useMemo, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import { Box, Center } from "@chakra-ui/react";
import { PointFeature } from "supercluster";
import { IData } from "./App";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
interface IProps {
  lon: number;
  lat: number;
  count: number;
  item: any;
  leaves: any;
}

const CustomMarker = ({ lon, lat, count, item, leaves }: IProps) => {
  const [showPopup, setShowPopup] = useState<null | PointFeature<IData>>(null);
  const [index, setIndex] = useState<number>(0);

  const increment = () =>{

    if(index <= leaves.length){
      setIndex(index + 1)
    }
    if(index >= leaves.length - 1){
      setIndex(0)
    }
  }


  const decrement = () => {
    if(index <= leaves.length){
      setIndex(index - 1)
    }

    if(index <= 0){
      setIndex(leaves.length -1)
    }
   
  }
  const child = useMemo(() => {
    if (!count) {
      return (
        <button className="btn-cluster-yellow" onClick={() => setShowPopup(item)}>
          <Center height={30}><FaMapMarkerAlt size={30} style={{color: 'yellow'}} /></Center>
        </button>
      );
    }
    
    return (
      <button className="btn-cluster" onClick={() => setShowPopup(item)}>
        <Center height={30}>{count ? `${count} ` : <FaMapMarkerAlt size={30} style={{color: 'yellow'}} />}</Center>
      </button>
    );
  }, [count, lon, lat, setShowPopup, item]);
  
  return (
    <Marker longitude={lon} latitude={lat}>
      {child}
      {showPopup && (
           <Popup
           longitude={item.geometry.coordinates[0]}
           latitude={item.geometry.coordinates[1]}
           anchor="bottom"
           onOpen={() => setShowPopup(item)}
           onClose={() => setShowPopup(null)}
           closeOnClick={false}
           className="custom-popup"
         >
           <>{count ? <><FaArrowLeft size = {16} onClick = {decrement}/> <FaArrowRight size = {16} onClick ={increment} /> </> : <></> }</>
           <div>{count? leaves[index]?.properties?.name : item.properties.name}</div>
           <div>{count ? leaves[index]?.properties?.city : item.properties.city}</div>
           <div>{count ?  `${index+1}/${leaves.length}` : item.properties.street_address}</div>
         </Popup>
        
        )}
    </Marker>
  );
};

export default CustomMarker;
