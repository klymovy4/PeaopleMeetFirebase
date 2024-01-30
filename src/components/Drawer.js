import defaultAvatar from "../assets/avatars/avatar.jpg";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RoomIcon from "@material-ui/icons/Room";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import FeedbackIcon from '@material-ui/icons/Feedback';
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {db} from "../firebase";
import {useAuth} from "../context/AuthContext";
import {logout} from "../actions";
import InputIcon from "@material-ui/icons/Input";
import {useDispatch, useSelector} from "react-redux";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    height: '200px!important',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '10px 0',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  userName: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%)',
    color: theme.palette.common.white
  },
  feedback : {
    marginTop: 'auto'
  }
}))

const Drawer = () => {
  const localStorageDarkMode = JSON.parse(localStorage.getItem('darkMode'))
  const [darkMode, setDarkMode] = React.useState(localStorageDarkMode || false)

  const dispatch = useDispatch()
  const {name, avatar, uid} = useSelector(state => state.auth)

  const classes = useStyles()
  const history = useHistory()
 
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    dispatch({
      type: 'SWITCH_DARK_MODE',
      payload: darkMode
    })
  }, [darkMode])

  return (
      <>
        <div className={classes.drawerHeader}
             style={{
               position: 'relative',
               backgroundImage: `url(${avatar ? avatar : defaultAvatar})`,
               backgroundRepeat: 'no-repeat',
               backgroundPosition: 'center center',
               backgroundSize: 'cover',
               minHeight: '220px'
             }}

        >
          <Typography variant="h4" align='center' className={classes.userName}>
            {name}
          </Typography>


        </div>
        <Divider/>
        <List>
          <ListItem button onClick={() => history.push('/map-leaflet')}>
            <ListItemIcon><RoomIcon/></ListItemIcon>
            <ListItemText primary={'Map'}/>
          </ListItem>

          <ListItem button
                    onClick={() => setDarkMode(!darkMode)}
          >
            <ListItemIcon>{!darkMode ? <Brightness4Icon/> : <Brightness7Icon/>}</ListItemIcon>
            <ListItemText primary={!darkMode ? 'Dark Theme' : 'White Theme'}/>
          </ListItem>
          <ListItem button onClick={() => history.push('/users')}>
            <ListItemIcon><SupervisorAccountRoundedIcon/></ListItemIcon>
            <ListItemText primary={'Users'}/>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button onClick={() => history.push('/')}>
            <ListItemIcon><AccountCircleRoundedIcon/></ListItemIcon>
            <ListItemText primary={'My account'}/>
          </ListItem>

        </List>


        <List className={classes.feedback}>
          <ListItem button  onClick={() => dispatch(logout(uid))}>
            <ListItemIcon
                className={classes.icons}

            >
              <InputIcon/>
            </ListItemIcon>
            <ListItemText primary={'Logout'}/>
          </ListItem>

          <ListItem button >
            <ListItemIcon><FeedbackIcon/></ListItemIcon>

            <ListItemText primary={'v: 4.202.10.30'}/>

          </ListItem>
        </List>

      </>
  )
}

export default Drawer