import React from "react";
import Talk from "talkjs";
import "./ChatBox.scss";
import chatbox from "../../assets/images/5962463.png";
import { connect } from "react-redux";
import image1 from "../../assets/images/pngwing.com.png";
import avatar from "../../assets/images/pngwing.com.png";
import { toast } from "react-toastify";

class ChatBox extends React.Component {
  async componentDidMount() {
    await Talk.ready;
    const user = this.props.user.userInfo || this.props.user.user;

    console.log("userIdChatBox", user);
    const session = new Talk.Session({
      appId: "t6qVyh1K",
      me: new Talk.User({
        id:
          user && user.id
            ? user.id.toString()
            : user && user.userId
            ? user.userId.toString()
            : null, // TalkJS requires the id to be a string
        name:
          user && user.email && user.email
            ? `${user.email}`
            : user && user.email, // Assuming the user's name is split into firstName and lastName
        email: user && user.email,
        photoUrl: avatar,
      }),
    });

    const other = new Talk.User({
      id: "2",
      name: "Medicine",
      email: "duclinh@example.com",
      photoUrl: image1,
      welcomeMessage: "Hey there! How can I help you?",
      role: "default",
    });

    const conversation = session.getOrCreateConversation(
      Talk.oneOnOneId(session.me, other)
    );
    conversation.setParticipant(session.me);
    conversation.setParticipant(other);

    const chatbox = session.createChatbox(conversation);
    chatbox.mount(document.getElementById("talkjs-container"));
    session.on("message", (message) => {
      if (message.sender.id !== session.me.id) {
        toast.success("You have a new message!");
      }
    });
  }
  toggleChat = () => {
    const chatContainer = document.getElementById("talkjs-container");
    chatContainer.style.display =
      chatContainer.style.display === "none" ? "block" : "none";
    };
  render() {
    return (
      <div className="chatbox">
        <img
          className="chatbox-logo"
          src={chatbox}
          alt="bg"
          onClick={this.toggleChat}
        ></img>
        <div id="talkjs-container">
          <div id="talkjs-chat"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    user: state.user,
    userIdNormal: state.user.userInfo || state.user.user?.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
