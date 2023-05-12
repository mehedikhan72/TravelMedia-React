import React from "react";
import FetchPosts from "./FetchPosts";

export default function SavedPosts() {
    const url = `http://127.0.0.1:8000/api/get_saved_posts/`;
    const savedPosts = true;
    return (
        <div>
            <h1 className="featured-posts center">Saved Posts!</h1>
            <FetchPosts url={url} savedPosts={savedPosts}/>
        </div>
    )
}