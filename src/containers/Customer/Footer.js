import React, { Component } from "react";
import { connect } from "react-redux";
import "./Footer.scss";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";

class Footer extends Component {
  render() {
    return (
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3><FormattedMessage id="footer.intro" /></h3>
            <ul>
              <li><a href="/about"><FormattedMessage id="footer.intro" /></a></li>
              <li><a href="/contact"><FormattedMessage id="footer.contact" /></a></li>
              <li><a href="/faq"><FormattedMessage id="footer.question" /></a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3><FormattedMessage id="footer.policy" /></h3>
            <ul>
              <li><a href="/privacy-policy"><FormattedMessage id="footer.policy_security" /></a></li>
              <li><a href="/terms"><FormattedMessage id="footer.use" /></a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3><FormattedMessage id="footer.connect" /></h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p><FormattedMessage id="footer.end" /></p>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
  userGoogle: state.user,
  language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(Footer));
