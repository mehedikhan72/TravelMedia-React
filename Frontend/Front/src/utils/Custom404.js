import React from "react";
import { Link } from "react-router-dom";

export default function Custom404() {
    return(
        <div className="center">
            <h1 className="m-5">404 - Page Not Found!</h1>
            <h3 className="m-5">You sure you're in the right place?</h3>
            <Link to={{ pathname: `/`}}><button className="my-btns">Home page</button></Link>
        </div>
    )
}