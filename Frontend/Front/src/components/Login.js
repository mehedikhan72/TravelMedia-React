import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SocialLoginComponents from "./SocialLoginComponents";
import Loading from "../utils/Loading";

export default function Login() {

    let { loginUser } = useContext(AuthContext);
    let { user } = useContext(AuthContext);
    console.log(user)
    // console.log("this is login page");

    let { message } = useContext(AuthContext);

    const [showLoading, setShowLoading] = useState(false);

    const toggleLoading = () => {
        setShowLoading(!showLoading);
    }

    return (
        <div>
            {showLoading && <Loading />}
            <div className="reg-login-page">
                {user && <Navigate to="/" />}
                <div className="reg-intro">
                    <div className="img-row">
                        <img className="reg-login-img hide-700" src="https://ychef.files.bbci.co.uk/976x549/p01rpz8r.jpg" />
                        <img className="reg-login-img" src="https://www.tmb.ie/wp/wp-content/uploads/2015/03/philipp-kammerer-6Mxb_mZ_Q8E-unsplash-2.jpg" />
                    </div>
                    <h3 className="intro-text center">Tell us about your latest trip and share the joy with us!</h3>
                    <div className="img-row">
                        <img className="reg-login-img hide-700" src="https://cms-b-assets.familysearch.org/dims4/default/92f0f61/2147483647/strip/true/crop/750x500+0+0/resize/1240x827!/quality/90/?url=https%3A%2F%2Ffamilysearch-brightspot.s3.amazonaws.com%2Fcb%2F2b%2Fab7608ce1f477c824c31846ed2f3%2Feiffel-tower-sunrise.jpg" />
                        <img className="reg-login-img" src="https://media.gadventures.com/media-server/cache/01/bd/01bdab822b44417b8beed47c8e43d18b.jpg" />
                    </div>
                </div>

                <div className="login-reg-form">
                    <h3 className="center">Login!</h3>
                    {message && <h5 className="center red-error-message">{message}</h5>}
                    <br />
                    <form onSubmit={loginUser}>
                        <input required className="post-detail-input" name="username" type="text" placeholder="Username" />
                        <input required className="post-detail-input" name="password" type="password" placeholder="Password" />
                        <button type="submit" className="my-btns w-100">Login</button>
                        {/* <Link className="right-aligned no-underline-links">Forgot password?</Link> */}
                        <hr className="hr" />
                        <h6 className="center">Don't have an account? <Link className="no-underline-links" to={{ pathname: `/register/` }}>Register here.</Link></h6>
                    </form>
                    <hr className="hr" />
                    <SocialLoginComponents toggleLoading={toggleLoading} />
                </div>
                <br />
            </div>
        </div>
    )
}