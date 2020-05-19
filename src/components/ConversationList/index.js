import React, {useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import md5 from "react-native-md5";

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
                    photo: `https://www.gravatar.com/avatar/${md5.hex_md5(result.name)}?s=100g&d=identicon&r=PG`,
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
                    title="POZHILOY CHAT"
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