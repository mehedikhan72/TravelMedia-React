import React from "react";
import FetchPosts from "./FetchPosts";

export default function FollowingPosts() {
    const url = `http://localhost:8000/api/get_following_posts/`;
    const followingPosts = true;
    return (
        <div>
            <h3 className="each-post center">Following posts</h3>
            <FetchPosts url={url} followingPosts={followingPosts}/>
        </div>
    )
}