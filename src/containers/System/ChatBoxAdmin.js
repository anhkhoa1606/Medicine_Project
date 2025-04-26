import React from "react";
import Talk from "talkjs";
import "./ChatBoxAdmin.scss";
import chatbox from "../../assets/images/5962463.png";
import { connect } from "react-redux";
import image1 from "../../assets/images/pngwing.com.png";
import avatar from "../../assets/images/images.jpg";
import { toast } from "react-toastify";

class ChatBoxAdmin extends React.Component {
  async componentDidMount() {
    await Talk.ready;
    const user = this.props.user.userInfo || this.props.user.user;
    const session = new Talk.Session({
      appId: "t6qVyh1K", // replace with your own TalkJS appId
      me: new Talk.User({
        id: "2",
        name: "Medicine",
        email: "user2@example.com",
        photoUrl: image1,
        welcomeMessage: "Hey there! How can I help you?",
      }),
    });

    const other = new Talk.User({
      id: user.id
        ? user.id.toString()
        : user.userId
        ? user.userId.toString()
        : null,
      name:
        user.email && user.email
          ? `${user.email}`
          : user.email,
      email: user.email,
      photoUrl: avatar,
    });

    const conversation = session.getOrCreateConversation(
      Talk.oneOnOneId(session.me, other)
    );
    conversation.setParticipant(session.me);
    conversation.setParticipant(other);

    const inbox = session.createInbox({ selected: conversation });
    inbox.mount(document.getElementById("talkjs-container"));
    session.on("message", (message) => {
      if (message.sender.id !== session.other.id) {
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
    userIdNormal: state.user.userInfo?.id || state.user.user?.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxAdmin);
