import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import Loading from "../utils/Loading";

export default function FetchPeople(props) {
    const { user } = useContext(AuthContext);
    const fetchUrl = `${props.url}?query=${props.query}`
    const [data, setData] = useState([]);
    console.log(data);

    useEffect(() => {
        fetchPeople();
    }, [props.query])

    const [fetchCompleted, setFetchCompleted] = useState(false);

    const fetchPeople = () => {
        setFetchCompleted(false);
        fetch(fetchUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(response => response.json())
            .then(json => {
                setData(json);
                setFetchCompleted(true);
            })
    }

    return (
        <div>
            {!fetchCompleted && <Loading />}
            {data.map((person) => (
                <div key={person.id} className="each-person">
                    <div className="display-flex">
                        <div className="display-flex">
                            {(person.social_pfp_link || person.pfp) && <img className="small-round-pfp" src={person.social_pfp_link ? `${person.social_pfp_link}` : `http://127.0.0.1:8000${person.pfp}/`} />}
                            {(!person.social_pfp_link && !person.pfp) && <img className="small-round-pfp default-pfp-border" src="https://i.pinimg.com/550x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />}
                            <h3 className="m-2"> {person.first_name ? person.first_name + " " + person.last_name : person.username}</h3>
                        </div>
                        <Link className="my-btns links-in-btns no-style-no-hover-links" to={{ pathname: `/profiles/${person.username}` }}>Visit Profile</Link>
                    </div>
                </div>
            ))}

            <div className="center-stuff">
                <hr className="hr" />
                {data.length === 0 && fetchCompleted && <h3>No results found.</h3>}
                {data.length !== 0 && fetchCompleted && <h3>Nothing else found. Please try again later.</h3>}
            </div>
        </div>
    )
}