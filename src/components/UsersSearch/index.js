import React, { useState } from 'react';
import './UsersSearch.css';


export default function UsersSearch(props) {
    let [ state, setState ] = useState({});
    const {val} = state;
    console.log(val);

    return (
      <div className="conversation-search">
        <input
            ref={props.usersInput}
            onChange={ (e) => props.onchange(e.target.value) }
          type="search"
          className="conversation-search-input"
          placeholder="Search Messages"
        />
      </div>
    );
}