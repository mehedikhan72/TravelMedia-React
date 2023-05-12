import React from "react";
import Featured from "./Featured";
import FetchPosts from "./FetchPosts";

export default function Posts() {
  const url = `http://127.0.0.1:8000/api/posts/`;
  const feedView = true;
  return (
    <div>
      <Featured />
      <FetchPosts url={url} feedView={feedView} />
    </div>
  )
}