import React from 'react';
import { Picker } from 'emoji-mart';

import { updateRecentEmoji, saveMessage } from '../../../lib/apiRequests';

import './styles.css';
import 'emoji-mart/css/emoji-mart.css';

export default class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: '',
            showPicker: false
        };

        this.numberOfRecentEmoji = props.numberOfRecentEmoji || 15;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEmojiSelect = this.onEmojiSelect.bind(this);
        this.onShowPickerButtonClick = this.onShowPickerButtonClick.bind(this);
        this.onInputPressKey = this.onInputPressKey.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
    }

    componentDidMount() {
        this.chatInput.focus();
        // eslint-disable-next-line
        document.addEventListener('keydown', this.handleEscape, false);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.recentEmoji || !prevState.recentEmoji.length) {
            return {
                shownRecentEmoji: nextProps.recentEmoji || [],
                recentEmoji: nextProps.recentEmoji || []
            };
        }
    }

    componentWillUnmount() {
        // eslint-disable-next-line
        document.removeEventListener('keydown', this.handleEscape, false);
    }

    handleEscape(event) {
        if (event.keyCode === 27) {
            this.setState({ showPicker: false });
        }
    }

    handleChange(event) {
        this.setState({ messageText: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const messageText = this.state.messageText.replace(/\n/g, '\n\n');

        const message = {
            type: 'text',
            conversationId: this.props.conversationId,
            text: messageText,
            author: this.props.currentUser
        };

        this.props.socket.emit('message', message);

        saveMessage(message, this.props.conversationId);
        updateRecentEmoji(this.state.recentEmoji);

        this.setState({
            messageText: '',
            shownRecentEmoji: this.state.recentEmoji
        });
    }

    onEmojiSelect(emoji) {
        const updatedRecentEmoji = this.state.recentEmoji.filter(el => el !== emoji.id);
        updatedRecentEmoji.unshift(emoji.id);
        updatedRecentEmoji.splice(this.numberOfRecentEmoji);

        this.setState({
            messageText: this.state.messageText + emoji.native,
            recentEmoji: updatedRecentEmoji
        });

        this.chatInput.focus();
    }

    onShowPickerButtonClick() {
        this.setState({
            showPicker: !this.state.showPicker
        });
        this.chatInput.focus();
    }

    onInputPressKey(e) {
        if (e.shiftKey && e.charCode === 13) { // shift+enter
            return true;
        }
        if (e.charCode === 13) { // enter
            this.handleSubmit(e);

            return false;
        }
    }

    render() {
        return (
            <div className='chat-input'>
                <textarea
                    type='text'
                    className='chat-input__textarea'
                    placeholder="Введите новое сообщение"
                    value={this.state.messageText}
                    onChange={this.handleChange}
                    ref={input => {
                        this.chatInput = input;
                    }}
                    onKeyPress={this.onInputPressKey}
                />

                {this.state.showPicker
                    ? <Picker
                        recent={this.state.shownRecentEmoji.length
                            ? this.state.shownRecentEmoji
                            : ['smiley']
                        }
                        onClick={this.onEmojiSelect}
                        showPreview={false}
                        color='lightsalmon'
                        set='emojione'
                        style={{
                            position: 'absolute',
                            bottom: '75%',
                            right: '4%',
                            zIndex: 100
                        }}
                        i18n={{ categories: { recent: 'Last used' } }}
                    />
                    : null
                }

                <div className="chat-input__show-picker-button"
                    onClick={this.onShowPickerButtonClick}
                >&#9786;</div>
            </div>
        );
    }
}
