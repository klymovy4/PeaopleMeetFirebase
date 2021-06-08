import React, {useCallback, useEffect, useState, useRef, useContext} from 'react'
import {GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import mapStyles from "../components/maps/MapStyles";
import compass from '../assets/2277999_map-compass-compass-svg-hd-png-download.png'
import {db, database} from "../firebase";
import {getRealtimeUsers} from "../actions";
import {useDispatch, useSelector} from 'react-redux'
import defUser from '../assets/def-user.jpg'
import chatBackground from '../assets/chatBachground.jpg'

import '@reach/combobox/styles.css'
import {Card, CardActionArea, CardActions, CardContent, CardMedia, Drawer, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {ChatPage} from "./chatroom/ChatPage";
import axios from "axios";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";
import Loader from "./loader/Loader";
import {useHistory} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const useStyles = makeStyles({
  root: {
    paddingTop: '0px',
    paddingBottom: '0px'
  },
  drawer: {
    height: '50vh',
    padding: '0.5rem',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      opacity: '0.3',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundImage: `url(${chatBackground})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }
  },
})


const libraries = ["places"];
const containerStyle = {
  width: '100vw',
  height: 'calc(100vh - 60px)'
};
const options = {
  style: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
}

export const Map = () => {
  const dispatch = useDispatch()
  const [markers, setMarkers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const onlineCurrentUser = JSON.parse(localStorage.getItem('user'))
  const [getRealTimeUsers, setRealTimeUsers] = useState([])
  const history = useHistory()
  const {getUid} = useAuth()
  const {realUsers, getOnlineUsersChecked, unreadMessages} = useContext(FirebaseContext)
  const classes = useStyles();
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries
  })
  const [chatStarted, setChatStarted] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [location, setLocation] = useState()
  const [openDrawer, setOpenDrawer] = useState(false)

  const authFromState = useSelector(state => state.auth)

  const getCurrentPosition = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }

  const getRequest = async () => {
    // const url = process.env.REACT_APP_REALTIME_DB
    // try {
    //   const res = await axios.get(`${url}/status.json`)
    //
    //   const key = Object.keys(res.data).map(key => {
    //     return {
    //       ...res.data[key],
    //       id: key
    //     }
    //   })
    //
    //   return key.sort((a, b) => {
    //     return a.date - b.date
    //   })
    // } catch (e) {
    //   console.log(e.message)
    // }
    setSelectedUser({
      email: "klymovy4roman@gmail.com", description: "All I wanna say is that they don't really care about us.",
      age: 24,
      avatar: "https://firebasestorage.googleapis.com/v0/b/peoplemeet-43891.appspot.com/o/users%2F1139AiIL20hPQLmjs7StMKG1l7z2%2FIMG_20210530_140610_868.jpg?alt=media&token=f4a01520-18bb-4c69-b868-3b9e375382f8",
      createdAt: {seconds: 1622459282, nanoseconds: 212000000},
      isOnline: true,
      location: {lng: 26.9888895, lat: 49.4226789},
      name: "Roman Klymovych",
      uid: "1139AiIL20hPQLmjs7StMKG1l7z2"
    })
  }
  useEffect(()=>{
  if(selectedUser){
    console.log(selectedUser)
    openDrawerHandler()
  }
  },[selectedUser])

  useEffect(() => {
    getOnlineUsersChecked();
  }, [])

  useEffect(() => {
    getCurrentPosition()
  }, [])


  const onMapClick = useCallback((event) => {
    setSelectedUser(null)

    // new Date().toISOString()
    // setMarkers(current => [
    //   ...current,
    //   {
    //     lat: event.latLng.lat(),
    //     lng: event.latLng.lng(),
    //     time: new Date()
    //   }])
  }, [])

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  if (loadError) return 'Error loading maps'
  if (!isLoaded) return <div className="loader-wrapper-map-page"><Loader/></div>

  function Locate() {
    return (
        <button className="locate" onClick={getCurrentPosition}>
          <img src={compass} alt={''}/>
        </button>
    )
  }

  const openDrawerHandler = () => {
    console.log(selectedUser.uid)
    history.push(`/map/chat/${selectedUser.uid}`)
    setOpenDrawer(!openDrawer)
    setChatStarted(!chatStarted)
    console.log(unreadMessages)
  }

  return (
      <>
        <h1 className="headerMap"><span
            onClick={getRequest}
            role="img" aria-label="tent">😋</span></h1>
        <Locate/>
        {location ? (<GoogleMap
            mapContainerStyle={containerStyle}
            zoom={18}
            center={{lat: location.lat, lng: location.lng}}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
        >
          {/* это маркер Я*/}
          {/*<Marker position={{lat: location.lat, lng: location.lng}} icon={{url:  defUser, scaledSize: new window.google.maps.Size(30, 30),anchor: new window.google.maps.Point(15, 15), origin: new window.google.maps.Point(0, 0)}}/>*/}


          {realUsers && realUsers.map(user => {

            return <Marker
                key={user.uid}
                position={{lat: user.location.lat, lng: user.location.lng}}
                icon={{
                  url: user.avatar || defUser,
                  scaledSize: new window.google.maps.Size(30, 30),
                  anchor: new window.google.maps.Point(15, 15),
                  origin: new window.google.maps.Point(0, 0)
                }}
                onClick={() => {
                  setSelectedUser(user)
                }}
            >
            </Marker>
          })
          }


          {selectedUser ? (
              <InfoWindow
                  className={classes.root}
                  position={
                    {
                      lat: selectedUser.location.lat,
                      lng: selectedUser.location.lng
                    }
                  }
                  onCloseClick={() => setSelectedUser(null)}
              >
                <Card>
                  <CardActionArea>
                    <CardMedia
                        style={{
                          height: '190px',
                          backgroundSize: 'contain',
                        }}
                        // className={classes.media}
                        image={selectedUser.avatar || defUser}
                        title="Contemplative Reptile"
                    />
                    <CardContent className={classes.root}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {selectedUser?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selectedUser?.age}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selectedUser?.sex}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selectedUser?.description}
                      </Typography>

                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{marginBottom: '10px'}}>
                    <Button
                        onClick={openDrawerHandler}
                        size="small"
                        color="primary"
                        disabled={selectedUser.uid === authFromState.uid}
                    >
                      {selectedUser.uid === authFromState.uid ? 'That\'s like people see your account' : 'Write'}
                    </Button>
                  </CardActions>
                </Card>

              </InfoWindow>) : null}
        </GoogleMap>) : null}
        <Drawer
            anchor='bottom'
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false)
              history.push('/map')
            }}
        >
          <Grid container>
            <Grid item className={classes.drawer} xs={12}>
              <ChatPage
                  selected={selectedUser}
              />
            </Grid>
          </Grid>
        </Drawer>
      </>
  )
}