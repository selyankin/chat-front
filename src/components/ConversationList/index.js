import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';

import './ConversationList.css';

export default function ConversationList(props) {
    let [conversations, setConversations] = useState([]);
    useEffect(() => {
        getConversations("")
    }, []);

    const getConversations = (query) => {
        fetch('http://0.0.0.0:8080/chat_list', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({query: query}),

        }).then(r => {return r.json()})
            .then(data => {
                let newConversations = data.map(result => {
                return {
                    photo: 'https://i.pinimg.com/originals/a7/01/bb/a701bb04275ece742ff1bd420d00cb9a.png',
                    name: `${result.name}`,
                    text: 'Хэй, там давыд слился',
                    id: result.id
                };
            });
            conversations = [];
            setConversations([...newConversations])
            })
    };

        return (
            <div className="conversation-list">
                <Toolbar
                    title="Messenger"
                    leftItems={[
                        <ToolbarButton key="cog" icon="ion-ios-cog"/>
                    ]}
                    rightItems={[
                        <ToolbarButton key="add" icon="ion-ios-add-circle-outline" onClick={props.openCreateDialogue}/>
                    ]}
                />
                <ConversationSearch onchange={getConversations}/>
                {
                    conversations.map(conversation =>
                        <ConversationListItem
                            onclick={props.onclick}
                            key={conversation.name}
                            data={conversation}
                        />
                    )
                }
            </div>
        );
}