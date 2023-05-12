import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FetchPosts from "./FetchPosts";

export default function Profile(props) {

  const { username } = useParams(); // The one who's profile we are visiting.
  const [fetchPostUrl, setFetchPostUrl] = useState(`http://127.0.0.1:8000/api/users/${username}/posts/`);

  useEffect(() => {
    setFetchPostUrl(`http://127.0.0.1:8000/api/users/${username}/posts/`);
  }, [username])

  const [fData, setFData] = useState({}); // fData denoting followers n following data
  const [dataChanged, setDataChanged] = useState(false);

  const [userHasImage, setUserHasImage] = useState(false);

  let { user } = useContext(AuthContext); // The logged in user.
  // Follow/ Unfollow data

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/users/${username}/f_data/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      },
    })
      .then(response => response.json())
      .then(json => {
        setFData(json);
      })
  }, [dataChanged, username]);

  const handleFollow = () => {
    fetch(`http://127.0.0.1:8000/api/users/${username}/follow/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      },
    })
      .then(response => response.json())
      .then(json => {
        setDataChanged(!dataChanged);
      })
  }

  const handleUnfollow = () => {
    fetch(`http://127.0.0.1:8000/api/users/${username}/unfollow/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      },
    })
      .then(response => response.json())
      .then(json => {
        setDataChanged(!dataChanged);
      })
  }

  let ownProfileViewed = false;
  if (username === user.username) {
    ownProfileViewed = true;
  }

  const [userData, setUserData] = useState({});
  const [profileEdited2, setProfileEdited2] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profiledEditedCLicked, setProfileEditedClicked] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/get_user_data/${username}/`)
      .then(response => response.json())
      .then(json => {
        if (json.pfp !== null) {
          setUserHasImage(true);
        }
        else if (json.pfp === null) {
          setUserHasImage(false);
        }
        // console.log(json);
        setUserData(json);

      })
      .then(() => {
        // Fix this bug.
        setProfileData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          gender: userData.gender,
          location: userData.location,
          phone_number: userData.phone_number,
          bio: userData.bio,
        })
      })
  }, [profileEdited2, username]);

  const [editProfileOn, setEditProfileOn] = useState(false);

  const editProfileClicked = () => {
    setProfileData({
      first_name: userData.first_name,
      last_name: userData.last_name,
      gender: userData.gender,
      location: userData.location,
      phone_number: userData.phone_number,
      bio: userData.bio,
    })
    document.body.classList.add('disabled-scroll');
    setEditProfileOn(true);
  }

  const [profileImage, setProfileImage] = useState(null);

  const resetFormData = () => {
    setProfileData({
      first_name: userData.first_name,
      last_name: userData.last_name,
      gender: userData.gender,
      location: userData.location,
      phone_number: userData.phone_number,
      bio: userData.bio,
    })
  }

  const disableEditProfile = () => {
    document.body.classList.remove('disabled-scroll');
    setEditProfileOn(false);
    setProfileImage(null);
    // resetFormData();
  }

  const profileEdited = (e) => {
    e.preventDefault();
    // Upload text data.
    fetch(`http://127.0.0.1:8000/api/edit_profile/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify(profileData),
    })
      .then(response => response.json())
      .then(json => {
        const formData = new FormData();
        formData.append('pfp', profileImage);
        fetch(`http://127.0.0.1:8000/api/edit_profile/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          },
          body: formData,
        })
          .then(response => response.json())
          .then(json => {
            disableEditProfile();
            resetFormData();
            setProfileEdited2(!profileEdited2);
            setProfileEditedClicked(true);
            setTimeout(() => {
              setProfileEditedClicked(false);
            }, 4000);
          })
      })
  }

  // Report logic
  const [reason, setReason] = useState('');
  const [reportProfileOn, setReportProfileOn] = useState(false);
  const [ProfileReported, setProfileReported] = useState(false);
  const [profileReportedMessage, setProfileReportedMessage] = useState('');

  const reportProfileClicked = () => {
    document.body.classList.add('disabled-scroll');
    setReportProfileOn(true);
  }

  const reportProfileOff = () => {
    document.body.classList.remove('disabled-scroll');
    setReason('');
    setReportProfileOn(false);
  }
  const reportProfile = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/report_user/${username}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify({ reason }),
    })
      .then(response => response.json())
      .then(json => {
        setProfileReported(true);
        setProfileReportedMessage(json.message);
        reportProfileOff();
        setTimeout(() => {
          setProfileReported(false);
          setProfileReportedMessage('');
        }, 4000);
      })
  }

  const [optionsOn, setOptionsOn] = useState(false);
  const showOptions = () => {
    setOptionsOn(true);
  }

  const disableOptions = () => {
    setOptionsOn(false);
  }


  return (
    <div>
      <div className="user-info">
        <div className="pfp">
          {userHasImage && <><img className="pfp" src={userData.social_pfp_link ? `${userData.social_pfp_link}` : `http://127.0.0.1:8000${userData.pfp}/`} alt="pfp" /><h6 className="bio center">{userData.bio}</h6></>}
          {!userHasImage && <><i className='default-pfp bx bx-user-circle vh-center'></i><h6 className="bio center">{userData.bio}</h6></>}
        </div >

        <div className="user-text-info">

          {/* Post options */}
          {optionsOn &&
            <div className="right-aligned mr-40">
              <div className="post-options-drop-down">
                <div className="display-flex">
                  <h3 className="mt-2">Options</h3>
                  <button onClick={disableOptions} className='my-btns'>X</button>
                </div>

                <hr />
                {user.username === username && <button onClick={editProfileClicked} className="display-inline-block my-btns w-100"><i className='bx bx-edit-alt'></i> Edit Profile</button>}
                {user.username !== username && <button onClick={reportProfileClicked} className="my-btns w-100"><i className='bx bx-calendar-exclamation' ></i> Report User</button>}
              </div>
            </div>}
          {/* Post options end*/}

          {userData.first_name && <p className="display-inline-block big-info-text">{userData.first_name} {userData.last_name}</p>}
          {!userData.first_name && <p className="display-inline-block big-info-text">{username}</p>}

          <div className="margin-5">
            {userData.location && <p className="medium-info-text">Lives at {userData.location}</p>}
            {userData.phone_number && <p className="medium-info-text">Contact: {userData.phone_number}  </p>}
          </div>

          <div>
            <p className="medium-info-text display-inline-block">{fData.followers_count} followers</p>
            <p className="medium-info-text display-inline-block">{fData.following_count} followings</p>
          </div>
          <br />
          {user.username === username &&
            <div className="right-aligned">
              <button onClick={showOptions} className="display-inline-block my-btns "><i className='bx bx-cog'></i></button>
            </div>}
          {fData.is_following === false && user.username !== username && <button className="display-inline-block my-btns" onClick={handleFollow}>Follow</button>}
          {fData.is_following === true && user.username !== username && <button className="display-inline-block my-btns" onClick={handleUnfollow}>Unfollow</button>}
          {user.username !== username && <button onClick={showOptions} className="display-inline-block my-btns "><i className='bx bx-cog'></i></button>}
        </div>
      </div >

      {editProfileOn && <div className="confirmation">
        <div className="confirmation-child2">
          <div className="display-flex">
            <h3>Edit Profile</h3>
            <button onClick={disableEditProfile} className="my-btns cross-btns">X</button>
          </div>
          <hr />
          <div className="left">
            <form onSubmit={profileEdited}>
              <p>First Name: </p><input value={profileData.first_name} className="post-detail-input" type="text" placeholder="First Name" onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}></input>
              <p>Last Name: </p><input value={profileData.last_name} className="post-detail-input" type="text" placeholder="Last Name" onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}></input>
              <p>Gender: </p><input value={profileData.gender} className="post-detail-input" type="text" placeholder="Gender" onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}></input>
              <p>Location: </p><input value={profileData.location} className="post-detail-input" type="text" placeholder="Location" onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}></input>
              <p>Phone Number: </p><input value={profileData.phone_number} className="post-detail-input" type="text" placeholder="Phone Number" onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}></input>
              <p>Bio: </p><input value={profileData.bio} className="post-detail-input" type="text" placeholder="Bio" onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}></input>
              <p>Upload New Profile Picture</p>
              <input type="file" id="image" name="images" onChange={(e) => setProfileImage(e.target.files[0])} />
              <input type="submit" className="my-btns w-100" placeholder="Update"></input>
            </form>
          </div>
        </div>

      </div>
      }



      {
        profiledEditedCLicked &&
        <div className="animation-message">
          <h5 className="center padding-10">Profile Updated Successfully!</h5>
        </div>
      }

      {
        reportProfileOn && <div className="confirmation">
          <div className="confirmation-child">
            {/* <i className='bx bxs-report big-icons' style={{ color: '#ff0300' }}  ></i> */}
            <div className="display-flex">
              <h4 className="mt-2">Report {userData.first_name}</h4>
              <button onClick={reportProfileOff} className="my-btns cross-btns">X</button>
            </div>
            <hr />

            <br />
            <form onSubmit={reportProfile}>
              <textarea className="post-detail-textarea" required placeholder="Reason" name="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
              <button type="submit" className="my-btns w-100 padding-10">Report</button>
            </form>

          </div>
        </div>
      }
      {
        ProfileReported &&
        <div className="animation-message">
          <h5 className="center padding-10">{profileReportedMessage}</h5>
        </div>
      }

      <FetchPosts url={fetchPostUrl} ownProfileViewed={ownProfileViewed} />
    </div >
  )
}