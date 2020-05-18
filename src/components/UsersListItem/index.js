import React, {useEffect} from 'react';
import shave from 'shave';

import './UsersListItem.css';

export default function UsersListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  });

    const { photo, name, text, id } = props.data;

    if (props.selected)
    {
        return (
          <div className="conversation-list-item-selected" onClick={() => props.onclick(props.data)}>
            <img className="conversation-photo" src={photo} alt="conversation" />
            <div className="conversation-info">
              <h1 className="conversation-title">{ name }</h1>
              <p className="conversation-snippet">{ text }</p>
            </div>
          </div>
        );
    }
    return (
      <div className="conversation-list-item" onClick={() => props.onclick(props.data)}>
        <img className="conversation-photo" src={photo} alt="conversation" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          <p className="conversation-snippet">{ text }</p>
        </div>
      </div>
    );
}