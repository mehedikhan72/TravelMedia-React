import React, { useState, useContext, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';

export default function CreatePost(props) {

    const [createPostActive, setCreatePostActive] = useState(false);

    const [postContent, setPostContent] = useState({
        creator: null,
        post: '',
        place: '',
        trip_date: new Date().toISOString().substring(0, 10),
        trip_duration: 0,
        people_count: 0,
        cost_per_person: 0,
        transportation_data: '',
        staying_place: '',
        staying_place_cost: 0,
        staying_place_rating: 0,
        trip_rating: 0,
        important_things_to_take: '',
        cautions: '',
    });

    const { user } = useContext(AuthContext);
    const name = (user.first_name ? user.first_name : user.username).trim();
    const placeholderText = `Tell us about your latest trip, ${name}!`;

    const createPostClicked = () => {
        document.body.classList.add('disabled-scroll');
        setCreatePostActive(true);
    };

    const cancelPostClicked = () => {
        document.body.classList.remove('disabled-scroll');
        setCreatePostActive(false);
    }

    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState(new FormData());

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        setImages(selectedImages);
    }

    useEffect(() => {
        const newFormData = new FormData();
        for (let i = 0; i < images.length; i++) {
            newFormData.append('images', images[i]);
        }
        setFormData(newFormData);
    }, [images]);

    const resetFormData = () => {
        setPostContent({
            creator: null,
            post: '',
            place: '',
            trip_date: new Date().toISOString().substring(0, 10),
            trip_duration: 0,
            people_count: 0,
            cost_per_person: 0,
            transportation_data: '',
            staying_place: '',
            staying_place_cost: 0,
            staying_place_rating: 0,
            trip_rating: 0,
            important_things_to_take: '',
            cautions: '',
        });
        setImages([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(postContent);

        console.log(images);
        console.log(formData);

        if (localStorage.getItem("access_token")) {
            fetch('http://127.0.0.1:8000/api/posts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(postContent),
            })
                .then((response) => response.json())
                .then((data) => {
                    // Post the images
                    fetch(`http://127.0.0.1:8000/api/post_images/`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: formData
                    }).then((response) => response.json())
                        .then((img_data) => {
                            console.log(img_data);
                            props.newPostAdded(data);
                            createPostClicked();
                            resetFormData();
                            cancelPostClicked();
                        })
                })
                .catch((error) => console.log(error));

        } else {
            console.log('Error Occured!');
        }
        document.body.classList.remove('disabled-scroll');
    };

    return (
        <div>
            <div className={createPostActive ? "disabled" : ""}>
                <button onClick={createPostClicked} className="post-creation-input-box" type="text" ><i className='bx bx-edit'></i> {placeholderText}</button>
            </div>
            {createPostActive && (
                <div className='confirmation'>
                    <div className="post-creation-form text">
                        <form onSubmit={handleSubmit}>
                            <br />
                            <div className="create-post-header">
                                <h2 className='center mt-2'>Tell us about you latest trip, {user.first_name ? user.first_name : user.username}!</h2>
                                <button className='my-btns' onClick={cancelPostClicked}>X</button>
                            </div>

                            <br />
                            <p>Where did you travel to?</p>
                            <input autoFocus required className='post-detail-input required' type='text' name='place' placeholder="e.g. Cox's Bazar" onChange={(e) => setPostContent({ ...postContent, place: e.target.value })}></ input> <br />
                            <p>When did you go there?</p>
                            <input required className='post-detail-input' type='date' name='trip_date' id='trip_date' onChange={(e) => setPostContent({ ...postContent, trip_date: e.target.value })}></input> <br />
                            <p>How many days were you there?</p>
                            <input required className='post-detail-input' type='number' min="0" name='trip_duration' placeholder='eg. 4' onChange={(e) => setPostContent({ ...postContent, trip_duration: parseInt(e.target.value) })}></input> <br />
                            <p>How many of you went there?</p>
                            <input required className='post-detail-input' type='number' min="0" name='people_count' placeholder='e.g. 6' onChange={(e) => setPostContent({ ...postContent, people_count: parseInt(e.target.value) })}></input> <br />
                            <p>How much did the trip cost for each person?(In BDT)</p>
                            <input required className='post-detail-input' type='number' min="0" name='cost_per_person' placeholder='e.g. 5000' onChange={(e) => setPostContent({ ...postContent, cost_per_person: parseInt(e.target.value) })}></input> <br />
                            <p>How did you go there?</p>
                            <input required className='post-detail-input' type='text' name='transportation_data' placeholder='e.g. By bus' onChange={(e) => setPostContent({ ...postContent, transportation_data: e.target.value })}></input> <br />
                            <p>Where did you stay?</p>
                            <input required className='post-detail-input' type='text' name='staying_place' placeholder='e.g. Hotel X' onChange={(e) => setPostContent({ ...postContent, staying_place: e.target.value })}></input> <br />
                            <p>How much did your staying place cost for 24 hours?(In BDT)</p>
                            <input required className='post-detail-input' type='number' min="0" name='staying_place_cost' placeholder='e.g. 1500' onChange={(e) => setPostContent({ ...postContent, staying_place_cost: parseInt(e.target.value) })}></input> <br />
                            <p>How much would you rate your staying place?</p>
                            <input required className='post-detail-input' type='number' min="0" name='staying_place_rating' placeholder='From 1 to 5' onChange={(e) => setPostContent({ ...postContent, staying_place_rating: parseInt(e.target.value) })}></input> <br />
                            <p>How much would you rate the entire trip?</p>
                            <input required className='post-detail-input' type='number' min="0" name='trip_rating' placeholder='From 1 to 5' onChange={(e) => setPostContent({ ...postContent, trip_rating: parseInt(e.target.value) })}></input> <br />
                            <p>Please mention some of the important things to take.</p>
                            <input className='post-detail-input' type='text' name='important_things_to_take' placeholder='Leave empty if none.' onChange={(e) => setPostContent({ ...postContent, important_things_to_take: e.target.value })}></input> <br />
                            <p>Please mention the cautions, if any.</p>
                            <input className='post-detail-input' type='text' name='cautions' placeholder='leave empty if none.' onChange={(e) => setPostContent({ ...postContent, cautions: e.target.value })}></input> <br />
                            <p>Other than the above data, please enter your thoughts.</p>
                            <textarea required className='post-detail-textarea' type='text' name='post' placeholder='e.g. Your experience.' onChange={(e) => setPostContent({ ...postContent, post: e.target.value })}></textarea> <br />
                            <p>Upload Images to your post </p>
                            <input type="file" id="images" name="images" multiple onChange={handleImageChange} />
                            <button className='my-btns create-post-confirm-btn' type='submit'>Post</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}