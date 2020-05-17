import React, {useState, useEffect, useRef} from 'react';
import UsersSearch from '../UsersSearch';
import UsersListItem from '../UsersListItem';
import md5 from "react-native-md5";


import './UsersList.css';

export default function UsersList(props) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const usersInput = useRef();
    useEffect(() => {
        getUsers("")
    }, []);

    const getUsers = (query) => {
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
            console.log(selectedUsers);
            setUsers([]);
            let selUsersTemp = [...selectedUsers];
            selUsersTemp.forEach( u => u.selected = true);
            setUsers(selUsersTemp.concat(newUsers.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
            })
    };
    //Хуево работает селект
    function onUserSelect(user) {
        setUsers([]);

        if (selectedUsers.map(u => u.id).includes(user.id)){
            setSelectedUsers([...selectedUsers.filter(u => u.id !== user.id)])
        } else {
            console.log(user);
            setSelectedUsers([...selectedUsers].concat(user));
        }
        let selUsersTemp = [...selectedUsers];
        selUsersTemp.forEach( u => u.selected = true);
        setUsers(selUsersTemp.concat(users.filter(e => !selectedUsers.map(t => t.id).includes( e.id))))
        // getUsers(usersInput.current.value)
    }

        return (
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
        );
}