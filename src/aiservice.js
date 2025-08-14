import axios from "axios";

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

export async function generateResumeContent(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating resume content:", error);
    return "Sorry, I couldn't generate the content.";
  }
}
