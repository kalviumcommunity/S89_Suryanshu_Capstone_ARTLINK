import './Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section about">
        <div className="footer-logo">
          <span className="logo-text">Art<span className="logo-highlight">Link</span></span>
        </div>
        <p>Connecting artists worldwide through a comprehensive platform for networking, selling, and growing your artistic career.</p>
        <div className="footer-socials">
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>
      <div className="footer-section links">
        <h4>Features</h4>
        <Link to="/artists">Artist Profiles</Link>
        <Link to="/marketplace">Art Marketplace</Link>
        <Link to="/art-circles">Art Circles</Link>
        <Link to="/ai-assistant">AI Assistant</Link>
        <Link to="/messages">Messaging</Link>
      </div>
      <div className="footer-section links">
        <h4>Resources</h4>
        <Link to="/blog">Art Career Blog</Link>
        <Link to="/guides">Artist Guides</Link>
        <Link to="/webinars">Webinars</Link>
        <Link to="/success">Success Stories</Link>
        <Link to="/pricing">Pricing</Link>
      </div>
      <div className="footer-section links">
        <h4>Company</h4>
        <Link to="/about">About Us</Link>
        <Link to="/careers">Careers</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
