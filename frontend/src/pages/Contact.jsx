import "../styles/Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      {/* NAVBAR */}
      <div className="user-nav">
        <h2>Contact Us</h2>
      </div>

      {/* MAIN */}
      <div className="user-container">
        <div className="contact-card">
          <h3>Clinic Details</h3>

          <p><b>🏥 Clinic Name:</b> My Health Clinic</p>
          <p><b>📍 Address:</b> Indore, Madhya Pradesh, India</p>
          <p><b>📞 Mobile:</b> +91 6260324594</p>
          <p><b>📧 Email:</b> support@clinic.com</p>
          <p><b>🕒 Timing:</b> Mon - Sat (9 AM - 6 PM)</p>
        </div>
      </div>

    </div>
  );
}

export default Contact;