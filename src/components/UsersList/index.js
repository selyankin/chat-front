import React, {useState, useEffect, useRef} from 'react';
import UsersSearch from '../UsersSearch';
import UsersListItem from '../UsersListItem';
import md5 from "react-native-md5";


import './UsersList.css';



export default function UsersList(props) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const usersInput = useRef();
    const chatName = useRef();
    useEffect(() => {
        getUsers("")
    }, []);


    const fullSizeButton = {
        width : '100%',
        margin: '0 0 15px 0',
        border: 'none',
        borderRadius: '10px',
        padding: '7px 0',
        fontSize: '12pt'
    };

    const updateList = () =>  {
        let usersTemp = [...users];
        usersTemp.forEach(e => e.selected = false)
        setUsers([]);
        let selUsersTemp = [...selectedUsers];
        selUsersTemp.forEach( u => u.selected = true);
        setUsers(selUsersTemp.concat(usersTemp.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
    };

    useEffect(updateList, [selectedUsers]);

    const createChat = () => {
        fetch('http://0.0.0.0:8080/create_chat', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({name: chatName.current.value, user_ids: selectedUsers.map(e => e.id)}),

        }).then(r => {return r.json()})
            .then(data => {
                let newUsers = data.map(result => {
                    return {
                        photo: `https://www.gravatar.com/avatar/${md5.hex_md5(result.login)}?s=100g&d=identicon&r=PG`,
                        name: `${result.name}`,
                        text: `@${result.login}`,
                        id: result.id
                    };
                });
                setUsers([]);
                let selUsersTemp = [...selectedUsers];
                selUsersTemp.forEach( u => u.selected = true);
                setUsers(selUsersTemp.concat(newUsers.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
            })
    };

    const getUsers = (query) => {
        if (selectedUsers.length > 4){
            return
        }
        fetch('http://0.0.0.0:8080/search_users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem("USER_TOKEN")
            },
            body: JSON.stringify({query: query}),

        }).then(r => {return r.json()})
            .then(data => {
                let newUsers = data.map(result => {
                return {
                    photo: `https://www.gravatar.com/avatar/${md5.hex_md5(result.login)}?s=100g&d=identicon&r=PG`,
                    name: `${result.name}`,
                    text: `@${result.login}`,
                    id: result.id
                };
            });
            setUsers([]);
            let selUsersTemp = [...selectedUsers];
            selUsersTemp.forEach( u => u.selected = true);
            setUsers(selUsersTemp.concat(newUsers.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
            })
    };

    function onUserSelect(user) {
        if (selectedUsers.map(u => u.id).includes(user.id)){
            setSelectedUsers([...selectedUsers.filter(u => u.id !== user.id)])
        } else {
            setSelectedUsers([...selectedUsers].concat(user));
        }
    }

        return (
            <div>
                <div>
                    <input
                        ref={chatName}
                        type="search"
                        className="conversation-search-input"
                        placeholder="Chat name"
                    />
                </div>
                <div className="conversation-list">
                    <UsersSearch onchange={getUsers} usersInput={usersInput}/>
                    {
                        users.map(user =>
                            <UsersListItem
                                selected={user.selected}
                                key={user.id}
                                data={user}
                                onclick={onUserSelect}
                            />
                        )
                    }
                </div>
                <div className="send-users-btn">
                    <button onClick={createChat}  style={fullSizeButton}>Create chat</button>
                </div>
            </div>
        );
}