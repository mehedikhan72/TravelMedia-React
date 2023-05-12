import React, { useEffect, useState } from "react";
import HeroSlider, { Slide } from "hero-slider"
import { Link } from "react-router-dom";

export default function Featured() {
    const url = `http://127.0.0.1:8000/api/get_featured_posts/`
    const [data, setData] = useState([])

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => response.json())
            .then((json) => {
                console.log(json);
                setData(json);
            })
    }, [])

    return (
        <div className="featured-posts">
            <h2 className="center mb-3">Featured Posts</h2>

            {/* {data.length === 0 && <Loading />} */}
            {data.length > 0 && <div className="featured-image-div">
                <HeroSlider
                    height="300px"
                    zIndex={0}
                    objectFit="cover"
                    slidingAnimation="left_to_right"
                    orientation="horizontal"
                    initialSlide={1}
                    onBeforeChange={(previousSlide, nextSlide) => console.log('onBeforeChange', previousSlide, nextSlide)}
                    onChange={(nextSlide) => console.log('onChange', nextSlide)}
                    onAfterChange={(nextSlide) => console.log('onAfterChange', nextSlide)}
                    style={{
                        backgroundColor: "rgba (0, 0, 0, 0.33)",
                    }}
                    settings={{
                        slidingDuration: 250,
                        slidingDelay: 100,
                        shouldAutoplay: true,
                        shouldDisplayButtons: true,
                        autoplayDuration: 5000,
                    }}
                >
                    {data.map((post) => (
                        <div key={post.id}>
                            <Link to={{ pathname: `/post/${post.id}` }}>
                                <Slide
                                    className="images"
                                    background={{
                                        backgroundImageSrc: `http://127.0.0.1:8000${post.featured_image}/`,
                                    }}
                                />
                            </Link>
                        </div>
                    ))}
                </HeroSlider>

                <br />
            </div>}
        </div>
    )
}