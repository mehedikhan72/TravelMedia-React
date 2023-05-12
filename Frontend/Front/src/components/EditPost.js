import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

export default function EditPost(props) {
    const post = props.post;
    const isEdit = true;
    const { user } = useContext(AuthContext);

    const [postContent, setPostContent] = useState({
        post: post.post,
        place: post.place,
        trip_date: post.trip_date,
        trip_duration: post.trip_duration,
        people_count: post.people_count,
        cost_per_person: post.cost_per_person,
        transportation_data: post.transportation_data,
        staying_place: post.staying_place,
        staying_place_cost: post.staying_place_cost,
        staying_place_rating: post.staying_place_rating,
        trip_rating: post.trip_rating,
        important_things_to_take: post.important_things_to_take,
        cautions: post.cautions,
    });

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
        const url = `http://127.0.0.1:8000/api/posts/${post.id}/`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(postContent),
        })
            .then((response) => response.json())
            .then(
                (data) => {
                    // Fetch the images
                    fetch(`http://127.0.0.1:8000/api/post_images/`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                        body: formData
                    }).then((response) => response.json())
                        .then((img_data) => {
                            console.log(data);
                            props.handleDisableOptions();
                            resetFormData();
                            props.postEdited();
                            document.body.classList.remove('disabled-scroll');
                        })
                })
            .catch((error) => console.log(error));
    }

    const cancelEditClicked = () => {
        document.body.classList.remove('disabled-scroll');
        props.handleDisableOptions();
    }

    //Edit images
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

    //TODO: i can only add images to the existing images now, need to be able to delete images too.


    return (
        <div>
            <div className='confirmation'>
                <div className="post-creation-form text">
                    <form onSubmit={handleSubmit}>
                        <br />
                        <div className="create-post-header">
                            <h2 className='center mt-2'>Edit Post</h2>
                            <button className='my-btns' onClick={cancelEditClicked}>X</button>
                        </div>

                        <br />
                        <p>Where did you travel to?</p>
                        <input value={postContent.place} autoFocus required className='post-detail-input required' type='text' name='place' placeholder="e.g. Cox's Bazar" onChange={(e) => setPostContent({ ...postContent, place: e.target.value })}></ input> <br />
                        <p>When did you go there?</p>
                        <input value={postContent.trip_date} required className='post-detail-input' type='date' name='trip_date' id='trip_date' onChange={(e) => setPostContent({ ...postContent, trip_date: e.target.value })}></input> <br />
                        <p>How many days were you there?</p>
                        <input value={postContent.trip_duration} required className='post-detail-input' type='number' name='trip_duration' placeholder='eg. 4' onChange={(e) => setPostContent({ ...postContent, trip_duration: parseInt(e.target.value) })}></input> <br />
                        <p>How many of you went there?</p>
                        <input value={postContent.people_count} required className='post-detail-input' type='number' name='people_count' placeholder='e.g. 6' onChange={(e) => setPostContent({ ...postContent, people_count: parseInt(e.target.value) })}></input> <br />
                        <p>How much did the trip cost for each person?(In BDT)</p>
                        <input value={postContent.cost_per_person} required className='post-detail-input' type='number' name='cost_per_person' placeholder='e.g. 5000' onChange={(e) => setPostContent({ ...postContent, cost_per_person: parseInt(e.target.value) })}></input> <br />
                        <p>How did you go there?</p>
                        <input value={postContent.transportation_data} required className='post-detail-input' type='text' name='transportation_data' placeholder='e.g. By train from x to y. Then we walked for a mile.' onChange={(e) => setPostContent({ ...postContent, transportation_data: e.target.value })}></input> <br />
                        <p>Where did you stay?</p>
                        <input value={postContent.staying_place} required className='post-detail-input' type='text' name='staying_place' placeholder='e.g. Hotel X' onChange={(e) => setPostContent({ ...postContent, staying_place: e.target.value })}></input> <br />
                        <p>How much did your staying place cost for 24 hours?(In BDT)</p>
                        <input value={postContent.staying_place_cost} required className='post-detail-input' type='number' name='staying_place_cost' placeholder='e.g. 1500' onChange={(e) => setPostContent({ ...postContent, staying_place_cost: parseInt(e.target.value) })}></input> <br />
                        <p>How much would you rate your staying place?</p>
                        <input value={postContent.staying_place_rating} required className='post-detail-input' type='number' name='staying_place_rating' placeholder='From 1 to 5' onChange={(e) => setPostContent({ ...postContent, staying_place_rating: parseInt(e.target.value) })}></input> <br />
                        <p>How much would you rate the entire trip?</p>
                        <input value={postContent.trip_rating} required className='post-detail-input' type='number' name='trip_rating' placeholder='From 1 to 5' onChange={(e) => setPostContent({ ...postContent, trip_rating: parseInt(e.target.value) })}></input> <br />
                        <p>Please mention some of the important things to take.</p>
                        <input value={postContent.important_things_to_take} className='post-detail-input' type='text' name='important_things_to_take' placeholder='Leave empty if none.' onChange={(e) => setPostContent({ ...postContent, important_things_to_take: e.target.value })}></input> <br />
                        <p>Please mention the cautions, if any.</p>
                        <input value={postContent.cautions} className='post-detail-input' type='text' name='cautions' placeholder='leave empty if none.' onChange={(e) => setPostContent({ ...postContent, cautions: e.target.value })}></input> <br />
                        <p>Other than the above data, please enter your thoughts.</p>
                        <textarea value={postContent.post} required className='post-detail-textarea' type='text' name='post' placeholder='e.g. Your experience.' onChange={(e) => setPostContent({ ...postContent, post: e.target.value })}></textarea> <br />
                        <label htmlFor='images'>Upload Images </label>
                        <input type="file" id="images" name="images" multiple onChange={handleImageChange} />
                        <button className='my-btns create-post-confirm-btn' type='submit'>Post</button>
                    </form>
                </div>
            </div>
        </div>
    )
}