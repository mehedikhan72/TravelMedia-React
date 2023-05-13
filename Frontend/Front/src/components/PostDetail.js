import React from "react";
import { useParams } from "react-router-dom";
import FetchPosts from "./FetchPosts";

export default function PostDetail(props) {
    // get id from url
    const { id } = useParams();
    const url = `https://travelmedia-api-production.up.railway.app/api/posts/${id}`
    const eachPostDetail = true;
    return (
        <div>
            <FetchPosts url={url} eachPostDetail={eachPostDetail} />
        </div>
    )
}