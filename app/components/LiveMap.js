import React from 'react';
import {divIcon} from 'leaflet';
import {Map, Marker, Popup, TileLayer, Circle, FeatureGroup, MultiPolyline, Rectangle, Polyline} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject, getMission, deleteObject} from '../actions/Connect.js';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
        this.handleElementClick = this.handleElementClick.bind(this);
    }

    componentWillMount() {
        this.setState({
            rendered: false,
            coordList:[]
        });
        this.buildCapGrid();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.controls.tool.type !== this.props.controls.tool.type){
         this.setState({
            coordList: []
         });
        }
        if(this.props.draw.loaded) {
            this.setState({
                rendered: true
            });
        }
    }


   //Build capgrid object
   buildCapGrid(){
      var startLatlng=[49.00,-125.00];
      var numCol = 32;
      var numRow = 18;
      var lineArray=[];
      var quadArray=[];
      //do rows.
      for (var i = 0; i <= numRow; i++){
         var pushObject = [[startLatlng[0]-(0.25*i),startLatlng[1]],[startLatlng[0]-(0.25*i),startLatlng[1]+(numCol*0.25)]];
         if(i>0){
            var quadObj = [[startLatlng[0]-(0.25*(i-1))-0.125,startLatlng[1]],[startLatlng[0]-(0.25*(i-1)) -0.125,startLatlng[1]+(numCol*0.25)]];
            quadArray.push(quadObj);
         }
         lineArray.push(pushObject);
         }
      //Do columns
      for(var i = 0; i <= numCol; i++){
         var pushObject = [[startLatlng[0],startLatlng[1]+(0.25*i)],[startLatlng[0]-(0.25*numRow),startLatlng[1]+(0.25*i)]];
         if(i>0){
            var quadObj = [[(startLatlng[0]),(startLatlng[1]+(0.25*(i-1))+0.125)],[(startLatlng[0]-(0.25*numRow)),(startLatlng[1]+(0.25*(i-1))+0.125)]];
            quadArray.push(quadObj);
         }
         lineArray.push(pushObject);
      }
      this.setState({CapGrid: [lineArray, quadArray]});
   }

    //fired whenever there is a click event on the map
    //type, coords, properties passed to server for saving/redrawing
    onMapClick(e) {
        if(this.props.controls.tool.type != "Eraser" && this.props.controls.tool.type != "") {
            if(e.latlng.lat >= -85 && e.latlng.lat <= 85 && e.latlng.lng >= -180 && e.latlng.lng <= 180){
               if(this.props.controls.tool.twoPoint){
                  this.state.coordList.push(e.latlng);
                  if( this.state.coordList.length>= 2){
                     var insertObject = {coords:this.state.coordList};
                     this.props.insertObject({mission_id: this.props.data.mission_info.mission_id, layer_id: this.props.controls.active_layer, type:this.props.controls.tool.type, coordinates: insertObject, properties: this.props.controls.tool.properties});
                     if(this.props.controls.tool.preserveLast === true){
                        this.state.coordList.splice(0,1);
                     } else {
                        this.state.coordList.splice(0,2);
                     }
                  }
               } else {
                  this.props.insertObject({mission_id: this.props.data.mission_info.mission_id, layer_id: this.props.controls.active_layer, type:this.props.controls.tool.type, coordinates: e.latlng, properties: this.props.controls.tool.properties});
               }
            }
        }
    }

    handleElementClick(e) {
        if(this.props.controls.tool.type == "Eraser" && e.target.options.layerID==this.props.controls.active_layer) {
            this.props.deleteObject(e.target.options.id);
        }
    }

    render() {
        const position = [48.73205, -122.48627];
        const bounds = [ [-120,-220], [120,220] ];

        var layerGroups = {CAP:[]};

        //building the list of all objects that are in the reducer
        Object.keys(this.props.draw.objects).map(function(object_id, i) {
            var obj = this.props.draw.objects[object_id];
            if(!layerGroups[obj.layer_id]) layerGroups[obj.layer_id] = [];
            switch(obj.type) {
                case("Circle"):
                    layerGroups[obj.layer_id].push(<Circle key={i} id={obj.object_id} center={obj.coordinates} radius={obj.properties.radius} color={obj.properties.color} fill={obj.properties.fill} fillColor={obj.properties.fillColor} stroke={obj.properties.stroke} weight={obj.properties.strokeWidth} onClick={this.handleElementClick} layerID={obj.layer_id} ></Circle>);
                    break;
                case("Rectangle"):
                    layerGroups[obj.layer_id].push(<Rectangle key={i} id={obj.object_id} bounds={obj.coordinates.coords} color={obj.properties.color} fill={obj.properties.fill} fillColor={obj.properties.fillColor} stroke={obj.properties.stroke} weight={obj.properties.strokeWidth}  onClick={this.handleElementClick} layerID={obj.layer_id} ></Rectangle>);
                    break;
                case("Line"):
                    layerGroups[obj.layer_id].push(<Polyline key={i} id={obj.object_id} positions={obj.coordinates.coords} color={obj.properties.color} weight={obj.properties.strokeWidth} onClick={this.handleElementClick} layerID={obj.layer_id}></Polyline>);
                    break;
                case("Note"):
                    var htmlString = '<span id  class="glyphicon '+obj.properties.icon+' map-divicons"'+' style="color:'+obj.properties.color+';font-size:'+obj.properties.fontsize+'"></span>'
                    var myIcon = divIcon({
                    //iconAnchor: obj.coordinates,
                    //iconSize: [10,10],
                     html: htmlString
                    });

                    layerGroups[obj.layer_id].push(
                    <Marker key={i} id={obj.object_id} position={obj.coordinates}  icon={myIcon} onClick={this.handleElementClick} layerID={obj.layer_id}>
                     <Popup>
                        <span>{obj.properties.text}</span>
                     </Popup>
                    </Marker>
                    );
                    break;

                default:
                    break;
            }
        }.bind(this));
         
        //Insert capgrid
        var capGridArray = this.state.CapGrid;
        layerGroups["CAP"].push(<MultiPolyline polylines={capGridArray[0]} color={"Red"} weight={2} clickable={false} key={1}></MultiPolyline>);
        layerGroups["CAP"].push(<MultiPolyline polylines={capGridArray[1]} color={"Red"} weight={2} opacity={0.2} clickable={false} key={2}></MultiPolyline>);
        var layers = null;

        if(this.props.data.layers && Object.keys(this.props.data.layers).length > 0) {
            layers = Object.keys(this.props.data.layers).map(function(layer_id) {
                return <FeatureGroup ref={"layer-" + layer_id} key={layer_id}>{layerGroups[layer_id]}</FeatureGroup>;
            }.bind(this));
        }

        if(this.state.rendered) {
            Object.keys(this.props.data.layers).map(function(id) {
                var leaf = this.refs.map.getLeafletElement();
                var layer = this.refs["layer-"+id].getLeafletElement();

                if(this.props.controls.visible_layers.indexOf(id) > -1) {
                    if(!leaf.hasLayer(layer)) {
                        leaf.addLayer(layer);
                    }
                } else {
                    if(leaf.hasLayer(layer))  {
                        leaf.removeLayer(layer);
                    }
                }
            }.bind(this));
        }

        return (
            <Map center={position} worldCopyJump={false} zoom={this.props.controls.mapData.maxZoom} minZoom={2} maxBounds={bounds} zoomControl={false} onClick={this.onMapClick.bind(this)} ref='map'>
                <TileLayer
                    maxZoom={this.props.controls.mapData.maxZoom}
                    url={this.props.controls.mapData.url}
                    attribution='&copy; <a href="https://skyvector.com/">SkyVector</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    noWrap={true}
                />
                { layers }
            </Map>
        );
    }
}

//puts the data from the reducers into a dictionary
const mapState = function(state) {
    return {"draw": state.drawObject, "controls": state.controls, "data": state.data};
}

//connects the mapState, functions, and class together
export default connect(
    mapState,
    {insertObject, getMission, deleteObject}
)(LiveMap);
