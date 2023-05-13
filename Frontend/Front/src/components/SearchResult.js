import React, { useState } from "react";
import { useParams } from "react-router-dom";
import FetchPosts from "./FetchPosts";
import FetchPeople from "./FetchPeople";

export default function SearchResult(props) {
    const { query } = useParams();
    const [url, setUrl] = useState(`https://travelmedia-api-production.up.railway.app/posts/`);
    // console.log(query);
    // console.log(url)
    const [searchView, setSearchView] = useState('places');

    const noPlacesFound = () => {
        setSearchView('people');
    }

    const people_url = `https://travelmedia-api-production.up.railway.app/search/users/`
    return (
        <div>
            <div className="center-stuff">
                <h1>Search Results</h1>
                <button onClick={() => setSearchView('places')} className="my-btns">Places</button> <button onClick={() => setSearchView('people')} className="my-btns">People</button>
            </div>
            {searchView === 'places' && <FetchPosts url={url} searchView={searchView} query={query} noPlacesFound={noPlacesFound} />}
            {searchView === 'people' && <FetchPeople url={people_url} query={query} />}
            <div className="center-stuff">
            </div>
            <br />
        </div>
    )
}