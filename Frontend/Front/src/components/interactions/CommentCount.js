import React, { useState, useEffect } from "react";

export default function Commentdata(props) {
    const [data, setData] = useState(0);
    useEffect(() => {
        fetch(`https://travelmedia-api-production.up.railway.app/api/post/${props.postId}/comments/`)
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
    }, [])

    return (
        <div>
            <i className="bx bx-comment"></i> {data.length}
        </div>
    )
}