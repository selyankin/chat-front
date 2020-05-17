import React from 'react';
import './Compose.css';

export default function Compose(props) {
    return (
      <div className="compose">
        <input
            ref={props.inputRef}
          type="text"
          className="compose-input"
          placeholder="Сообщение"
          onKeyPress={event => {
              if (event.key === "Enter"){
                  props.onMessageSubmit(event.target.value)
              }
          }}
        />

        {
          props.rightItems
        }
      </div>
    );
}