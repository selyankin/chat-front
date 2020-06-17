import React, {useEffect, useRef} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import { Element, animateScroll as scroll, scroller } from 'react-scroll'



import './MessageList.css';



export default function MessageList(props) {
  const MY_USER_ID = localStorage.getItem("USER_ID");
  const msgInputRef = useRef();
  useEffect(() => {
    scroller.scrollTo('scroll-container-second-element', {
      duration: 0,
      delay: 0,
      smooth: 'true',
      containerId: 'scroll-container'
    });

  }, [props.messages])
  const renderMessages = () => {
    let messages = [...props.messages];
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('days') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      i += 1;
    }
    return tempMessages;
  };


  function onMessageSubmit(value) {
  //   fetch('http://0.0.0.0:8080/send_message', {
  //           method: 'POST',
  //           headers: {
  //               'Accept': 'application/json',
  //               'Content-Type': 'application/json',
  //               'X-Auth-Token': localStorage.getItem("USER_TOKEN")
  //           },
  //           body: JSON.stringify({chat_id: props.chatId, message: value}),
  //
  //       }).then(r => {return r.json()})
  //           .then(data => {
  //               console.log(data)
  //           });
  //
    props.sendNewWsMessage(props.chatId, value);

    msgInputRef.current.value = null

  }
  function erw() {
    alert('zhopa');
  }
    const Priv = {
        width:'100px'
    }


    return(

      <div className="message-list">
        <Toolbar
            positionOaoa={' fixed-bool'}
            leftItems={
              [<i className={`toolbar-button ion-ios-menu`} onClick={props.openSidebar} />]
            }
          title={props.conversationTitle}
          rightItems={[
            <i className={`toolbar-button ion-ios-information-circle-outline`} onClick={props.openInfoModal}/>
          ]}
        />
        <Element className="message-list-container" id="scroll-container">
          {renderMessages()}
          <Element name="scroll-container-second-element"></Element>


        </Element>

        <Compose inputRef={msgInputRef} textPropers={'zh'} onMessageSubmit={onMessageSubmit}/>
      </div>
    );
}