import React, { useState } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';
import UsersList from '../UsersList';

import Modal from 'react-modal';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


export default function Messenger(props) {
    const [modalIsOpen,setIsOpen] = React.useState(false);

    const [ messages, setMessages ] = useState([]);
    const [conversationTitle, setConversationTitle] = useState('No conversation selected');
    const [chatId, setChatId] = useState('');
    function onClick(id, name) {
        getMessages(id);
        setChatId(id);
        setConversationTitle(name)
    }

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        console.log("Modal is opened")
    }

    function closeModal(){
        setIsOpen(false);
    }

    const getMessages = (id) => {
        fetch('http://0.0.0.0:8080/get_messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({chat_id: id}),

        }).then(r => {
            return r.json()
        })
            .then(data => {
                let tempMessages = data.map(e => {
                    return {
                        id: e.id,
                        author: e.owner,
                        message: e.text,
                        timestamp: new Date(e.date)
                    }
                });
                setMessages([...tempMessages]);
            });
    };

    return (
      <div className="messenger">
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
            <h2>Создать чат</h2>
              <button onClick={closeModal}>close</button>
                <UsersList/>


        </Modal>
        <div className="scrollable sidebar">
          <ConversationList onclick={onClick} openCreateDialogue={openModal}/>
        </div>

        <div className="scrollable content">
          <MessageList chatId={chatId} conversationTitle={conversationTitle} messages={messages} />
        </div>
      </div>
    );
}