import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manual Resume Builder
  const buildManualResume = () => {
    const manualResume = `
${name}
Email: ${email} | Phone: ${phone}

Skills:
${skills}

Experience:
${experience}

Education:
${education}
    `;
    setResumeText(manualResume);
  };

  // AI Resume Generator
  const generateAIResume = async () => {
    setLoading(true);
    setResumeText("");

    const prompt = `
Write a professional resume using the following details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Skills: ${skills}
Experience: ${experience}
Education: ${education}
    `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a professional resume writer." },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResumeText(response.data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      setResumeText("❌ Error generating resume. Check the console.");
    }

    setLoading(false);
  };

  // Export to PDF with profile image
  const downloadPDF = () => {
    const doc = new jsPDF();

    if (profileImage) {
      doc.addImage(profileImage, "JPEG", 150, 10, 40, 40); // top-right corner
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(name, 10, 20);

    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`Email: ${email}`, 10, 30);
    doc.text(`Phone: ${phone}`, 10, 37);

    doc.setFont("Helvetica", "bold");
    doc.text("Resume", 10, 50);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(resumeText, 10, 60, { maxWidth: 180 });

    doc.save(`${name || "resume"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-4">🚀 Resume Builder</h1>
        <p className="text-lg text-gray-300">
          Build your dream resume — add your profile picture, fill details, and generate manually or with AI.
        </p>
      </header>

      {/* Input Form */}
      <section className="max-w-3xl w-full bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-3"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-600 border-2 border-dashed border-gray-400 mb-3">
              📷
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-gray-300"
          />
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 text-black rounded-lg"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 text-black rounded-lg"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 text-black rounded-lg"
        />
        <textarea
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 text-black rounded-lg h-20 resize-none"
        />
        <textarea
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full p-3 text-black rounded-lg h-24 resize-none"
        />
        <textarea
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="w-full p-3 text-black rounded-lg h-20 resize-none"
        />

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={buildManualResume}
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
          >
            🛠 Build Manually
          </button>
          <button
            onClick={generateAIResume}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:opacity-90 rounded-lg font-semibold shadow-lg transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Generating..." : "🤖 AI Generate"}
          </button>
          {resumeText && (
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
            >
              📄 Download PDF
            </button>
          )}
        </div>
      </section>

      {/* Resume Output */}
      {resumeText && (
        <div className="mt-6 max-w-3xl w-full bg-gray-700 p-6 rounded-lg whitespace-pre-line">
          {resumeText}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 text-gray-400 text-sm">
        Made with ❤️ using React, OpenAI & jsPDF
      </footer>
    </div>
  );
}

export default App;
