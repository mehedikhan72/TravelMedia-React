import React, { useState, useEffect } from "react";
import CreateComment from "./CreateComment";
import { Link } from "react-router-dom";

export default function Comments(props) {
    const [comments, setComments] = useState([]);
    const post_id = props.post_id;

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/post/${post_id}/comments/`)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                setComments(json);
            })
    }, [])

    const newCommentAdded = (newComment) => {
        const newComments = [newComment, ...comments]
        setComments(newComments);
    }

    const postDetails = false;

    return (
        <div>
            <CreateComment post_id={post_id} newCommentAdded={newCommentAdded} />
            {comments.map((item) => (
                <div key={item.id}>
                    <Link to={{ pathname: `/profiles/${item.creator.username}` }} className="no-style-links normal-text-header">{item.creator.first_name ? item.creator.first_name + " " + item.creator.last_name : item.creator.username}</Link>
                    <p className="normal-text">{item.comment_text}</p>
                    <hr />
                </div>
            ))
            }
        </div>
    )
}