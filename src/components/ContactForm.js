import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", botcheck: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.botcheck) return; // ignore bots
    setStatus("sending");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "", botcheck: "" });
      console.log(`Message sent at ${new Date().toLocaleString()}`);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contact Me</h2>
      <p>Interested in working together or have questions? Drop a message!</p>

      <label>Name</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label>Message</label>
      <textarea
        name="message"
        rows="5"
        value={form.message}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="botcheck"
        style={{ display: "none" }}
        tabIndex="-1"
        autoComplete="off"
      />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      <p
        className={`contact-status ${status}`}
        aria-live="polite"
      >
        {status === "success" && "✅ Message sent successfully!"}
        {status === "error" && "❌ Something went wrong. Try again later."}
      </p>
    </form>
  );
}
