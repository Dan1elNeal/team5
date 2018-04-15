import React from 'react';

import Message from './Message/Message.js';

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages,
            currentUser: props.currentUser,
            onMessageTitleClick: props.onMessageTitleClick,
            saveElementForScroll: props.saveElementForScroll
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: nextProps.messages,
            currentUser: nextProps.currentUser,
            onMessageTitleClick: nextProps.onMessageTitleClick,
            saveElementForScroll: nextProps.saveElementForScroll
        });
    }

    render() {
        return (
            <ol className='messages'>
                {this.state.messages.map((message, idx) => {
                    return (
                        <Message
                            key={idx}
                            currentUser={this.state.currentUser}
                            text={message.text}
                            author={message.author}
                            date={message.date}
                            metadata={message.metadata}
                            onMessageTitleClick={this.state.onMessageTitleClick}
                            saveElementForScroll={this.state.saveElementForScroll}
                        />
                    );
                }
                )}
                <style jsx>{`
                    .messages {
                        margin-top: 50px;
                    }
                `}</style>
            </ol>
        );
    }
}
