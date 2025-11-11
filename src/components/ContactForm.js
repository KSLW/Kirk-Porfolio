import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm(){
  const [form, setForm] = useState({name:"", email:"", message:""});
  const [status, setStatus] = useState("idle");
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try{
      await emailjs.send("service_xxxxxx","template_xxxxxx", form, "public_xxxxxxxxxxxxx");
      setStatus("success");
      setForm({name:"", email:"", message:""});
      console.log(`Message sent at ${new Date().toLocaleString()}`);
    }catch(err){
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contact Me</h2>
      <p>Interested in working together or have questions? Drop a message!</p>
      <label>Name</label>
      <input type="text" name="name" value={form.name} onChange={handleChange} required />
      <label>Email</label>
      <input type="email" name="email" value={form.email} onChange={handleChange} required />
      <label>Message</label>
      <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
      <button type="submit" className="btn btn-primary">{status==="sending"?"Sending...":"Send Message"}</button>
      {status==="success" && <p className="contact-success">✅ Message sent successfully!</p>}
      {status==="error" && <p className="contact-error">❌ Something went wrong. Try again later.</p>}
    </form>
  );
}
