import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot,{CustomStep} from 'react-simple-chatbot';
import SearchResult from '../component/SearchResult';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 2
    };
  }

  render() {
    let height=window.innerHeight;
    console.log(height)
    let {type} = this.state;
    return (
     <div  width={'100%'} height={height}>
      <ChatBot recognitionEnable={true} width={'100%'}
        headerComponent={(<select> <option {...type===1?{selected:true}:{}} value="1">Chat</option>
         <option value="2" {...type===2?{selected:true}:{}}>Image</option> </select>)      }
          speechSynthesis={{ enable: true, lang: 'en' }}
            steps={[
              {
                id: '1',
                message: 'Type something to search on ChatGPT',
                trigger: 'search',
              },
              {
                id: 'search',
                user: true,
                trigger: '3',
              },
              {
                id: '3',
                component: <SearchResult type={type}/>,
                waitAction: true,
                trigger: 'search',
              },
            ]}
          />
     </div>)
  }
}

export default Chat;