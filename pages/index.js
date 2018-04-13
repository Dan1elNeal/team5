/* eslint-disable */
import React, { Component, Fragment } from 'react';

import ContactList from '../components/contacts';
import Chat from '../components/chat';
import Menu from '../components/menu';
import axios from 'axios';

export default class IndexPage extends Component {
    static async getInitialProps({ req }) {
        const res = await axios.get('http://localhost:3000/api/conversations', req);
        return {
            messagesInfo: {
                'currentUser': req.user.username
            },
            conversations: res.data,
            menu: {
                'name': req.user.username,
                'avatar': `/api/avatar/${req.user.username}`
            }
        };
    }

    constructor(props) {
        super(props);
        this.state = props;
    }

    async _onConversationClick(conversationId) {
        // убираем окно диалога, чтобы при нажатии
        // старое не оставалось как-будто ничего не произошло
        // пока выполняется запрос
        this.setState({messagesInfo: {
            'currentUser': this.state.messagesInfo.currentUser
        }})

        this.loadConversations(conversationId)
    }

    async loadConversations(conversationId) {
        const currentUser = this.state.messagesInfo.currentUser;
        let res = await axios.get(`api/messages/${conversationId}`,
        { withCredentials: true});

        this.setState({
            messagesInfo: {
                'conversationId': conversationId,
                'messages': res.data,
                'currentUser': currentUser
            }
        })
    }

    

    render() {
        var conversations = this.state.conversations;
        var messagesInfo = this.state.messagesInfo;
        var menu = this.state.menu
        
        if (messagesInfo.messages) {
            return (
            <Fragment>
                <ContactList conversations={conversations} 
                onConversationClick={this._onConversationClick.bind(this)}
                />
                <Chat messagesInfo={messagesInfo} />
                <Menu menu={menu} />
            </Fragment>
            )
        }

        return (
            <Fragment>
                <ContactList conversations={conversations} 
                onConversationClick={this._onConversationClick.bind(this)}
                />
                <Menu menu={menu} />
            </Fragment>
        );
    }
}
