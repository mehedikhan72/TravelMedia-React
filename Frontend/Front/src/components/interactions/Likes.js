import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";

export default function Likes(props) {
  // Trying out socket connection

  const post_id = props.post_id;
  const { user } = useContext(AuthContext);

  const [likeStatus, setLikeStatus] = useState("not-interacted");
  const [likeCount, setLikeCount] = useState(0);

  // get status
  const getStatus = () => {
    fetch(`https://travelmedia-api-production.up.railway.app/api/post/${post_id}/like_status/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
      },
    })
      .then(response => response.json())
      .then(json => {
        setLikeStatus(json.status);
        setLikeCount(json.likes_count);
      })
  }

  getStatus();

  const increaseLikes = () => {
    if (localStorage.getItem("access_token")) {
      fetch(`http://127.0.0.1:8000/api/post/${post_id}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(post_id)
      })
        .then(response => response.json())
        .then(data => {
          getStatus();
        })
        .catch(error => console.log(error));
    }
  }

  const decreaseLikes = () => {
    if (localStorage.getItem("access_token")) {
      fetch(`http://127.0.0.1:8000/api/post/${post_id}/unlike/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(post_id)
      })
        .then(response => response.json())
        .then(data => {
          getStatus();
        })
        .catch(error => console.log(error));
    }
  }

  // BUG: not a bug but..the like buttons move back n forth when like count changes. it looks bad. needa fix it.

  return (
    <div className="like-info">
      <button className="upvote" onClick={increaseLikes}><i className={likeStatus === 'liked' ? 'bx bxs-upvote' : 'bx bx-upvote'}></i></button>
      <p className="like-count">{likeCount}</p>
      <button className="downvote" onClick={decreaseLikes}><i className={likeStatus === 'disliked' ? 'bx bxs-downvote' : 'bx bx-downvote'} ></i></button>
    </div>
  )
}