import React, { useState, useRef } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';
import UsersList from '../UsersList';

import Modal from 'react-modal';


const customCreateChatStyles = {
  content : {
    top                   : '50vh',
    left                  : '50vw',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderRadius          : '10px',
    border                : 'none',
      color:'white',
      backgroundColor:'#222f3f',
      padding:'20px'
  }
};

const customInfoStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};


const connection = new WebSocket('ws://0.0.0.0:8080/ws', localStorage.getItem("USER_TOKEN"));

export default function Messenger(props) {
    const [createChatModalIsOpen,setCreateChatIsOpen] = React.useState(false);
    const [infoModalIsOpen,setInfoIsOpen] = React.useState(false);
    const [ messages, setMessages ] = useState([]);
    const [conversationTitle, setConversationTitle] = useState('Select conversation');
    const [chatId, setChatId] = useState('');
    const [wsMessages, setWsMessages] = useState([]);


    connection.onmessage = evt => {
        setWsMessages(wsMessages.concat([evt.data]))
    };
    
    function sendNewWsMessage(chat_id, text) {
        console.log(chat_id, text);
        connection.send(JSON.stringify({dest_chat_id: chat_id, text: text}))

    }



    function onClick(id, name) {
        getMessages(id);
        setChatId(id);
        setConversationTitle(name)
    }

    function openCreateChatModal() {
        setCreateChatIsOpen(true);
    }

    function afterOpenCreateChatModal() {
        // references are now sync'd and can be accessed.
    }

    function closeCreateChatModal(){
        setCreateChatIsOpen(false);
    }

    function openInfoModal() {
        setInfoIsOpen(true);
    }

    function afterOpenInfoModal() {
        // references are now sync'd and can be accessed.
    }

    function closeInfoModal(){
        setInfoIsOpen(false);
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
          isOpen={createChatModalIsOpen}
          onAfterOpen={afterOpenCreateChatModal}
          onRequestClose={closeCreateChatModal}
          style={customCreateChatStyles}
          contentLabel="Example Modal"
        >
            <h2 style={{margin:'0 0 20px 0'}}>Create chat</h2>
              <button onClick={closeCreateChatModal}>close</button>

                <UsersList/>


        </Modal>

          <Modal
              isOpen={infoModalIsOpen}
              onAfterOpen={afterOpenInfoModal}
              onRequestClose={closeInfoModal}
              style={customInfoStyles}
              contentLabel="Example Modal"
          >
              <h2>Создать чат</h2>
              <button onClick={closeCreateChatModal} >close</button>


          </Modal>
        <div className="scrollable sidebar">
          <ConversationList onclick={onClick} openCreateDialogue={openCreateChatModal}/>
        </div>

        <div className="scrollable content">
          <MessageList openInfoModal={openInfoModal} chatId={chatId} conversationTitle={conversationTitle} messages={messages} sendNewWsMessage={sendNewWsMessage}/>
        </div>
      </div>
    );
}