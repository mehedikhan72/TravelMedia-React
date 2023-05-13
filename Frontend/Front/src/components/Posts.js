import React from "react";
import Featured from "./Featured";
import FetchPosts from "./FetchPosts";

export default function Posts() {
  const url = `https://travelmedia-api-production.up.railway.app/api/posts/`;
  const feedView = true;
  return (
    <div>
      <Featured />
      <FetchPosts url={url} feedView={feedView} />
    </div>
  )
}