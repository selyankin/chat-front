import React, { useState, useRef } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';
import UsersList from '../UsersList';

import Modal from 'react-modal';


const customCreateChatStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
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


export default function Messenger(props) {
    const [createChatModalIsOpen,setCreateChatIsOpen] = React.useState(false);
    const [infoModalIsOpen,setInfoIsOpen] = React.useState(false);

    const [ messages, setMessages ] = useState([]);
    const [conversationTitle, setConversationTitle] = useState('No conversation selected');
    const [chatId, setChatId] = useState('');
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
            <h2>Создать чат</h2>
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
              <button onClick={closeCreateChatModal}>close</button>


          </Modal>
        <div className="scrollable sidebar">
          <ConversationList onclick={onClick} openCreateDialogue={openCreateChatModal}/>
        </div>

        <div className="scrollable content">
          <MessageList openInfoModal={openInfoModal} chatId={chatId} conversationTitle={conversationTitle} messages={messages} />
        </div>
      </div>
    );
}