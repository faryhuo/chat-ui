import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading,CustomStep } from 'react-simple-chatbot';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const uuid=new Date().getTime();
localStorage["uuid"]=uuid;
class SearchResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: [],
      trigger: false,
      copied:false,
      msg:'Type something to search on ChatGPT'
    };
    this.triggetNext = this.triggetNext.bind(this);
  }

  

  componentWillMount() {
    const self = this;
    const { steps } = this.props;
    const search = steps.search.value;
    let baseUrl="http://faryhuo.online:8080/chat/v2/info";
    if(this.props.type===2){
      baseUrl="http://faryhuo.online:8080/image/v2/info";
    }

    const queryUrl = `${baseUrl}?message=${search}&uuid=${uuid}`;


    axios.get(queryUrl, { 
      message: search 
    }).then((response)=>{
        let list=[];
        if(self.props.type==2){
          const images = response.data.data.data;
          for(let index in images){
            list.push(<img key={index} src={images[index].url}></img>);
          }
          self.setState({ loading: false, result:list ,copied: false});
          self.triggetNext();
          return;
        }

        const choices = response.data.data.choices;
        let repList=[choices.pop()];
        if (choices && repList.length > 0) {
        for(let i=0;i<repList.length;i++){
            let msg=repList[i].message.content;
            let ret=msg.match(/```([^`]+)```/gm);
            console.log(ret);
            if(ret!=null){
                let index=0
                let key=0;
                for(let j=0;j<ret.length;j++){
                    let sindex = msg.indexOf(ret[j]);
                    let text=msg.substring(index,sindex);
                    list.push(<div key={key++}>{text}</div>);
                    msg=msg.replace(text,"");
                    msg=msg.replace(ret[j],"");
                    let con=ret[j].replaceAll("```","");
                    let language="java";
                    if(con.indexOf("html")===0){
                        language="html";
                    }else if(con.indexOf("xml")===0){
                        language="xml";
                    }else if(con.indexOf("javascript")===0){
                        language="javascript";
                    }
                    list.push(<SyntaxHighlighter language={language} key={key++}>{con}</SyntaxHighlighter>);
                }
            }else{
                list.push(<div>{msg}</div>)
            }
            //msg=msg.replaceAll("\n","<br/>")
        }
        console.log(list);
        self.setState({ loading: false, result:list ,copied: false});
        } else {
        self.setState({ loading: false, result: [{text:'Not found.'}],copied: false });
        }
        self.triggetNext();
    },()=>{
        self.setState({ loading: false, result: [{text:'Error.'}],copied: false });
        self.triggetNext();
    })
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;
    return (
      <div className="dbpedia">
        { loading ? <Loading /> : <div>{result.map((item,key)=>{
            return item;
        })}</div>}
      </div>
    );
  }
}

SearchResult.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

SearchResult.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

export default SearchResult;