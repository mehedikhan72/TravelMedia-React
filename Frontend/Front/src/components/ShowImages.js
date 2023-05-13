import React, { useState, useEffect } from "react";
export default function ShowImages(props) {
    const postId = props.id;
    const [images, setImages] = useState([]);
    useEffect(() => {
        fetch(`https://travelmedia-api-production.up.railway.app/api/get_images/${postId}/`)
            .then(response => response.json())
            .then(json => {
                setImages(json);
            })
            .catch((error) => console.log(error));
    }, [postId])

    const totalImages = images.length;

    const [currentCount, setCurrentCount] = useState(0);

    const showNextImage = () => {
        if (currentCount >= totalImages - 1) {
            setCurrentCount(0);
        } else {
            setCurrentCount(currentCount + 1);
        }
    }

    const showPreviousImage = () => {
        if (currentCount <= 0) {
            setCurrentCount(totalImages - 1);
        } else {
            setCurrentCount(currentCount - 1);
        }
    }

    const showPostDetail = () => {
        props.enableDetailView(postId);
    }

    return (
        <div>
            {totalImages > 0 && <div className="image-div" onClick={showPostDetail}>
                <img className="images" width="400px" src={`https://travelmedia-api-production.up.railway.app${images[currentCount].image}`} ></img>
            </div>}
            <br />
            {totalImages > 1 && <div className="image-btns">
                <button className="my-btns" onClick={showPreviousImage}><i className='bx bxs-left-arrow'></i></button>
                <button className="my-btns" onClick={showNextImage}><i className='bx bxs-right-arrow'></i></button>
            </div>
            }
        </div>
    )
}