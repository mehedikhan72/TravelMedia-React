import React, { useContext } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import AuthContext from "../context/AuthContext";

export default function SocialLoginComponents(props) {
    let { socialLogin } = useContext(AuthContext);

    return (
        <div>
            <LoginSocialGoogle
                client_id="230642661736-5n4noc4lm8o3814ch184e1bgjrq08cqu.apps.googleusercontent.com"
                onResolve={(response) => {
                    console.log(response);
                    props.toggleLoading();
                    socialLogin(response.data.access_token, 'google-oauth2', response.data.picture);
                }}
                onReject={(error) => {
                    console.log(error);
                }}
                className="mb-3"
            >
                <GoogleLoginButton />
            </LoginSocialGoogle>
            <LoginSocialFacebook
                appId="1309165586345366"
                onResolve={(response) => {
                    console.log(response);
                    props.toggleLoading();
                    socialLogin(response.data.accessToken, 'facebook', '');
                }}
                onReject={(error) => {
                    console.log(error);
                }}
                className="mt-3"
            >
                <FacebookLoginButton />
            </LoginSocialFacebook>
        </div>
    )
}