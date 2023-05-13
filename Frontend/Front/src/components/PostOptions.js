// Save, edit, delete and report are implemented here.

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import EditPost from "./EditPost";

export default function PostOptions(props) {
    const isSaved = props.isSaved;
    const item = props.post;
    const { user } = useContext(AuthContext);
    const [postSaved, setPostSaved] = useState(false);
    const [postSavedMessage, setPostSavedMessage] = useState('');

    const savePost = (id) => {
        const url = `https://travelmedia-api-production.up.railway.app/api/save_post/${id}/`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPostSaved(true);
                setPostSavedMessage(data.message);
                setTimeout(() => {
                    setPostSaved(false);
                    setPostSavedMessage('');
                }, 4000)
                // props.disablePostOptions();
            })
    }

    const [postIdToBeDeleted, setPostIdToBeDeleted] = useState(null);
    const deletePost = () => {
        const url = `https://travelmedia-api-production.up.railway.app/api/posts/${postIdToBeDeleted}/`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(() => {
                props.disablePostOptions();
                props.setPostDeleted(!props.postDeleted);
                document.body.classList.remove('disabled-scroll');
            })
    }

    const postEdited = () => {
        props.setPostEdited(!props.postEdited);
    }

    const [postIdTobeReported, setPostIdToBeReported] = useState(null);

    const [reportPostOn, setReportPostOn] = useState(false);
    const [reason, setReason] = useState('');
    const [postReported, setPostReported] = useState(false);
    const [postReportedMessage, setPostReportedMessage] = useState('');

    const reportPost = (e) => {
        e.preventDefault();
        const url = `https://travelmedia-api-production.up.railway.app/api/report_post/${postIdTobeReported}/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({ reason })
        })
            .then(response => response.json())
            .then(message => {
                setPostReported(true);
                setPostReportedMessage(message.message);
                console.log(message);
                reportPostOff();
                setTimeout(() => {
                    setPostReported(false);
                    setPostReportedMessage('');
                }, 4000)
            })
    }

    const reportPostClicked = (id) => {
        document.body.classList.add('disabled-scroll');
        setPostIdToBeReported(id);
        setReportPostOn(true);
    }

    const reportPostOff = () => {
        document.body.classList.remove('disabled-scroll');
        setReason('');
        setPostIdToBeReported(null);
        setReportPostOn(false);
    }

    const handleDisableOptions = () => {
        props.disablePostOptions();
    }

    const [editPostClicked, setEditPostClicked] = useState(false);
    const editPost = () => {
        document.body.classList.add('disabled-scroll');
        setEditPostClicked(true);
    }

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const deletePostClicked = (id) => {
        setPostIdToBeDeleted(id);
        setShowDeleteConfirmation(true);
        document.body.classList.add('disabled-scroll');
    }

    const cancelDelete = () => {
        setPostIdToBeDeleted(null);
        setShowDeleteConfirmation(false);
        document.body.classList.remove('disabled-scroll');
    }

    return (
        <div>
            <div className="right-aligned">
                <div className="post-options-drop-down">
                    <div className="display-flex">
                        <h3 className="mt-2">Options</h3>
                        <button onClick={handleDisableOptions} className='my-btns'>X</button>
                    </div>

                    <hr />
                    <button
                        onClick={() => {
                            savePost(item.id)
                        }}
                        className="my-btns w-100"><i className='bx bx-bookmarks'></i>{isSaved === 'Saved' ? "Unsave Post" : "Save Post"}
                    </button>
                    {user.username === item.creator.username && <button onClick={editPost} className="my-btns w-100"><i className='bx bx-edit-alt'></i> Edit Post</button>}
                    {user.username === item.creator.username && <button onClick={() => deletePostClicked(item.id)} className="my-btns w-100"><i className='bx bx-trash'></i> Delete Post</button>}
                    {user.username !== item.creator.username && <button onClick={() => reportPostClicked(item.id)} className="my-btns w-100"><i className='bx bxs-report'></i> Report Post</button>}
                </div>
                {editPostClicked && <EditPost post={item} handleDisableOptions={handleDisableOptions} postEdited={postEdited} />}
            </div>

            {showDeleteConfirmation && <div className="confirmation">
                <div className="confirmation-child">
                    <i className='bx bxs-trash big-icons' style={{ color: '#ff0300' }}  ></i>
                    <br />
                    <br />
                    <h4 className="center">Are you sure you want to delete this post?</h4>
                    <h5>(This is irreversible)</h5>
                    <br />
                    <div className="display-flex">
                        <button onClick={cancelDelete} className="my-btns w-100 padding-10 margin-5">No, Go back.</button>
                        <button onClick={deletePost} className="my-btns w-100 padding-10 margin-5">Yes, Delete it.</button>
                    </div>
                </div>
            </div>}

            {reportPostOn && <div className="confirmation">
                <div className="confirmation-child">
                    {/* <i className='bx bxs-report big-icons' style={{ color: '#ff0300' }}  ></i> */}
                    <div className="display-flex">
                        <h4 className="mt-2">Report Post</h4>
                        <button onClick={reportPostOff} className="my-btns cross-btns">X</button>
                    </div>
                    <hr />

                    <br />
                    <form onSubmit={reportPost}>
                        <textarea className="post-detail-textarea" required placeholder="Reason" name="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                        <button type="submit" className="my-btns w-100 padding-10">Report</button>
                    </form>

                </div>
            </div>}
            {postReported &&
                <div className="animation-message">
                    <h5 className="center padding-10">{postReportedMessage}</h5>
                </div>}
            {postSaved &&
                <div className="animation-message">
                    <h5 className="center padding-10">{postSavedMessage}</h5>
                </div>}
        </div>
    )
}