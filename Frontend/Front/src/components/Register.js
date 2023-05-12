import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import SocialLoginComponents from "./SocialLoginComponents";
import Loading from "../utils/Loading";

export default function Register() {
    let { user } = useContext(AuthContext);
    let { loginUser } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");

    const [showLoading, setShowLoading] = useState(false);
    const [message, setMessage] = useState("");

    const toggleLoading = () => {
        setShowLoading(!showLoading);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirm_password) {
            const data = { username, email, password, confirm_password };
            fetch('http://localhost:8000/api/user/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if(data.error) {
                        setMessage(data.error);
                    }
                    else {
                        loginUser(e);
                    }
                })
                .catch(error => console.log(error));
        }
        else {
            setMessage("Passwords don't match");
        }
    }

    return (
        <div>
            {showLoading && <Loading />}
            <div className="reg-login-page">
                {user && <Navigate to="/" />}
                <div className="reg-intro">
                    <div className="img-row">
                        <img className="reg-login-img hide-700" src="https://www.standout.co.uk/blog/wp-content/uploads/2018/06/Travel-Style.jpeg" />
                        <img className="reg-login-img" src="https://content.api.news/v3/images/bin/4491bf978b849ce0b2f54b196c81cbd9" />
                    </div>
                    <h3 className="intro-text center">Join a world of adventurous people and make your trips easier!</h3>
                    <div className="img-row">
                        <img className="reg-login-img hide-700" src="https://www.expedia.ca/travelblog/wp-content/uploads/AdobeStock_279126842-1140x641.jpeg" />
                        <img className="reg-login-img" src="https://images.theconversation.com/files/271799/original/file-20190430-136810-1mceagq.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=900.0&fit=crop" />
                    </div>
                </div>
                <div className="login-reg-form">
                    <h3 className="center">Register!</h3>
                    {message && <h5 className="center red-error-message">{message}</h5>}
                    <br />
                    <form onSubmit={handleSubmit}>
                        <input required className="post-detail-input" name="username" value={username} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /> <br />
                        <input required className="post-detail-input" name="email" value={email} type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /> <br />
                        <input required className="post-detail-input" name="password" value={password} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /> <br />
                        <input required className="post-detail-input" name="confirm_password" value={confirm_password} type="password" placeholder="Confirm Password" onChange={(e) => setConfirm_password(e.target.value)} /> <br />
                        <button type="submit" className="my-btns w-100">Register</button>
                        <hr className="hr" />
                        <h6 className="center">Already own an account? <Link className="no-underline-links" to={{ pathname: `/login/` }}>Login here.</Link></h6>
                    </form>
                    <hr className="hr" />
                    <SocialLoginComponents toggleLoading={toggleLoading} />
                </div>
                <br />
            </div>
        </div>
    )
}