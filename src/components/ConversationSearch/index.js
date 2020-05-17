import React, { useState } from 'react';
import './ConversationSearch.css';


export default function ConversationSearch(props) {
    let [ state, setState ] = useState({});
    const {val} = state;
    console.log(val);

    return (
      <div className="conversation-search">
        <input
            onChange={ (e) => props.onchange(e.target.value) }
          type="search"
          className="conversation-search-input"
          placeholder="Search Messages"
        />
      </div>
    );
}