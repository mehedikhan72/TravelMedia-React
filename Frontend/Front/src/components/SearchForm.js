import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchForm() {

    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchTerm}`);
    }

    return (
        <div>
            <form onSubmit={handleSearch} className="search-form">
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} required className="search-box"></input>
                <button className="search-btn" type="submit"><i className='bx bx-search-alt-2'></i></button>
            </form>
        </div>
    )
}