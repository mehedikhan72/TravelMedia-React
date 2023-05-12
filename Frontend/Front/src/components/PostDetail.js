import React from "react";
import { useParams } from "react-router-dom";
import FetchPosts from "./FetchPosts";

export default function PostDetail(props) {
    // get id from url
    const { id } = useParams();
    const url = `http://127.0.0.1:8000/api/posts/${id}`
    const eachPostDetail = true;
    return (
        <div>
            <FetchPosts url={url} eachPostDetail={eachPostDetail} />
        </div>
    )
}