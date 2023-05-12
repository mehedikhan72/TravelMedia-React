import React, { useContext, useEffect, useState } from "react";
import Posts from "./Posts";
import AuthContext from "../context/AuthContext";
import Profile from "./Profile";
import '../App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import SearchResult from "./SearchResult";
import SearchForm from "./SearchForm";
import SavedPosts from "./SavedPosts";
import PostDetail from "./PostDetail";
import Custom404 from "../utils/Custom404";
import FollowingPosts from "./FollowingPosts";

export default function Layout() {

  let { logoutUser } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  // console.log(user);

  const [menuClicked, setMenuClicked] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  document.body.classList.add(theme);

  useEffect(() => {
    document.body.classList = ''
    document.body.classList.add(theme);
  }, [theme]);

  const handleThemeChange = (e) => {
    console.log("theme changed");
    localStorage.setItem('theme', e.target.value);
    setTheme(localStorage.getItem('theme'));
  }

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    document.body.classList.add('disabled-scroll');
    setShowLogoutConfirmation(true);
  }

  const cancelLogout = () => {
    document.body.classList.remove('disabled-scroll');
    setShowLogoutConfirmation(false);

  }

  const handleLogout = () => {
    document.body.classList.remove('disabled-scroll');
    logoutUser();
  }

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unSeenNotifications, setUnSeenNotifications] = useState(null);

  const notificationsSeen = () => {
    const url = `http://127.0.0.1:8000/api/mark_notifications_as_seen/`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // using localStorage.getItem("access_token") to get the token so that we don't use an old one that is already expired.
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUnSeenNotifications(null);
        // console.log(data);
      })
  }

  const handleNotificationClick = () => {
    notificationsSeen();
    setNotificationOpen(!notificationOpen);
  }

  // Notifs

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/notifications/`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setNotifications(data);
        // console.log(data);
      })

    fetch(`http://127.0.0.1:8000/api/get_unseen_notifications_count/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUnSeenNotifications(data.count);
        // console.log(data);
      })

    const currentUser = `notification-${user.id}`

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/${currentUser}/`);

    socket.onmessage = function (e) {
      console.log("Message from server for socket", e.data);
      const newNotif = JSON.parse(e.data);
      // console.log(newNotif)
      setNotifications(notifications => [newNotif, ...notifications]);
      setUnSeenNotifications(unSeenNotifications => unSeenNotifications + 1);
    }

  }, [])



  return (
    <div>
      {/* For the sake of all other components accessing the states declared in this component, Layout.js 
            is used here as App.js and this is the place where I'll be stacking the components. */}
      <header>
        <div className="logo-n-search">
          {/* <Link className="logo"><img width="50" src="https://cdn.discordapp.com/attachments/573818689326022682/1089249474204942446/travelMediaLogo1_thumbnail.png"></img></Link> */}
          <Link className="no-style-no-hover-links" to={{ pathname: '/' }}><p className="logo-text">TM</p></Link>
          {/* <i className='nav-logo bx bx-run'></i> */}
          <SearchForm />
        </div>

        <div className="my-navbar">
          <Link onClick={() => setMenuClicked(!menuClicked)} to="/"><i className='scale-1-10 nav-logo bx bx-home' ></i></Link>
          <Link to={{ pathname: '/posts/following' }}><i className='scale-1-10 nav-logo bx bx-group'></i></Link>
        </div>

        <div className="main-options">
          <i onClick={() => setMenuClicked(!menuClicked)} className={menuClicked === false ? "scale-1-10 nav-logo bx bx-menu" : "scale-1-10 nav-logo bx bx-x"} id="menu-icon" ></i>
          {/* mt-3 needed to be added to the bell for some alignment when user pfp is available. (not sure why) */}
          <Link ><i onClick={handleNotificationClick} className='scale-1-10 nav-logo bx bx-bell'></i>{unSeenNotifications > 0 && <span className="badge">{unSeenNotifications}</span>}</Link>
          {user.pfp && <Link to={{ pathname: `/profiles/${user.username}` }}><img className="margin-10 neg-mt-10 small-round-pfp" src={user.social_pfp_link ? `${user.social_pfp_link}` : `http://127.0.0.1:8000${user.pfp}/`} /></Link>}
          {!user.pfp && <Link to={{ pathname: `/profiles/${user.username}` }}><i className='margin-10-changed scale-1-10 nav-logo bx bx-user-circle'></i></Link>}
        </div>
      </header>
      <div>
        <div className={menuClicked === false ? "sidenav" : "sidenav open"}>
          <div>
            <Link onClick={() => setMenuClicked(!menuClicked)} to="/" className="no-style-no-hover-links scale-1-10 sidenav-links"><i className='extra-icon nav-logo bx bx-home' ></i><span className="extra-icon">HOME</span></Link>
            <Link to={{ pathname: '/posts/following' }} className="no-style-no-hover-links scale-1-10 sidenav-links"><i className='extra-icon nav-logo bx bx-group'></i><span className="extra-icon">PEOPLE</span></Link>
            <Link className="no-style-no-hover-links scale-1-10 sidenav-links" to={{ pathname: `/saved_posts` }}><i className='nav-logo bx bx-bookmarks'></i><span>SAVED POSTS</span></Link>
            <Link target="_blank" rel="noopener noreferrer" to={`https://www.google.com/maps/search/`} className="no-style-no-hover-links scale-1-10 sidenav-links"><i className='nav-logo bx bx-map'></i><span>MAP</span></Link>

            <span className="scale-1-10 sidenav-links theme-selection">
              <i className='nav-logo bx bx-moon'></i>
              <select onChange={handleThemeChange} className="form-select" aria-label="Default select example">
                <option defaultValue={theme !== '' ? theme : ""}>THEME</option>
                <option value="light">LIGHT</option>
                <option value="green">GREEN</option>
                <option value="dark">DARK</option>
                <option value="navy">NAVY</option>

              </select>
            </span>

            <Link onClick={handleLogoutClick} className="no-style-no-hover-links scale-1-10 sidenav-links"><i className='nav-logo bx bx-log-out'></i><span>LOGOUT</span></Link>
          </div>
        </div>
        <div className="main-content">
          <Routes>
            <Route index element={<Posts />} />
            <Route path="/posts/following" element={<FollowingPosts />} />
            <Route path="/profiles/:username" element={<Profile />} />
            <Route path="/search/:query" element={<SearchResult />} />
            <Route path="/saved_posts" element={<SavedPosts />} />
            <Route path="/post/:id" element={<PostDetail />}></Route>
            <Route path="*" element={<Custom404 />} />
          </Routes>
        </div>
      </div>
      {showLogoutConfirmation &&
        <div className="confirmation">
          <div className="confirmation-child">
            <i className='bx bx-log-out big-icons' style={{ color: '#ff0300' }}  ></i>
            <br />
            <br />
            <h4 className="center">Are you sure you want to log out?</h4>
            <h5>(You can login anytime!)</h5>
            <br />
            <div className="display-flex">
              <button onClick={cancelLogout} className="my-btns w-100 padding-10 margin-5">Go back</button>
              <button onClick={handleLogout} className="my-btns w-100 padding-10 margin-5">Log me out</button>
            </div>
          </div>
        </div>}

      {notificationOpen && <div className="notifications">
        {notifications.length !== 0 && <h5 className="margin-5 center">Your Notifications</h5>}
        {notifications.length === 0 && <h5 className="margin-5 center">No new notifications</h5>}
        {notifications.map((item) => (

          <div key={item.id} className="each-notification display-flex">
            <Link onClick={handleNotificationClick} className="no-style-no-hover-links" to={{ pathname: `/profiles/${item.sending_user.username}` }} >
              <div className="small-round-pfp">
                {(item.sender_pfp_url || item.social_pfp_link) && <img src={item.sender_social_pfp_link ? `${item.sender_social_pfp_link}` : `http://127.0.0.1:8000${item.sender_pfp_url}/`} className="small-round-pfp mt-3"></img>}
                {!item.sender_pfp_url && <i className='bx bx-user-circle small-default-pfp mt-3'></i>}
              </div>
            </Link>

            {item.notification_type !== 'follow' && <Link onClick={handleNotificationClick} className="no-style-no-hover-links" to={{ pathname: `/post/${item.related_post}/` }} ><h6 className="padding-10">{item.notification_text}</h6></Link>}
            {item.notification_type === 'follow' && <Link onClick={handleNotificationClick} className="no-style-no-hover-links" to={{ pathname: `/profiles/${item.sending_user.username}` }} ><h6 className="padding-10">{item.notification_text}</h6></Link>}
          </div>
        ))}
      </div>}
    </div>
  )
}