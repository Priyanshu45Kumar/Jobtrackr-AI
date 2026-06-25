const generateColdEmail = async (req, res) => {
  try {
    const {
      recruiterName,
      company,
      role,
      userName,
      portfolio,
      reason,
      skills,
      experience,
      tone,
    } = req.body;

    if (!company || !role || !userName) {
      return res.status(400).json({
        message: "Company, role, and your name are required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is missing in backend .env",
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const toneInstructions = {
  Professional:
    "Use a polished, formal, recruiter-friendly tone. Keep it clear, respectful, and professional.",

  Friendly:
    "Use a warm, approachable, and natural tone. Still keep it professional, but make it sound human and conversational.",

  Confident:
    "Use a confident tone without sounding arrogant. Highlight strengths clearly and show strong interest in the role.",

  "Short and Direct":
    "Use a concise and direct tone. Keep the email short, avoid unnecessary details, and focus only on the most important points.",
};

const selectedTone =
  toneInstructions[tone] || toneInstructions.Professional;

const safePortfolio =
  portfolio && portfolio.trim()
    ? portfolio
    : "[Add your GitHub/Portfolio/LinkedIn link]";

const prompt = `
You are an expert career coach and professional recruiter outreach email writer.

Generate a personalized cold email for a job/internship opportunity.

Candidate Information:
- Candidate name: ${userName}
- Recruiter name: ${recruiterName || "Not provided"}
- Company: ${company}
- Role: ${role}
- Skills: ${skills || "Not provided"}
- Projects/Experience: ${experience || "Not provided"}
- Portfolio/GitHub/LinkedIn: ${safePortfolio}
- Reason for interest in company/role: ${reason || "Not provided"}
- Requested tone: ${tone || "Professional"}

Tone instruction:
${selectedTone}

Email writing rules:
1. Output only the final email. Do not add explanation before or after.
2. Start with a strong subject line.
3. If recruiter name is provided, use "Dear ${recruiterName}," or "Hi ${recruiterName},".
4. If recruiter name is not provided, use "Dear Hiring Team,".
5. Do not write "Dear Mr./Ms." unless a last name is clearly provided.
6. Do not hardcode any specific person, project, company, or skill unless the user provided it.
7. Do not invent fake experience, internships, achievements, metrics, or company knowledge.
8. Do not use generic AI-sounding phrases like:
   - "I have long admired your company"
   - "It has been a career goal of mine"
   - "I am passionate about innovation"
   - "I believe I am the perfect fit"
9. Mention only the skills and projects provided by the user.
10. If projects/experience are provided, connect them naturally to the target role.
11. Keep the email realistic for a student/fresher unless experience is provided.
12. Keep the email between 120–180 words for Professional, Friendly, and Confident tones.
13. Keep the email under 100 words for Short and Direct tone.
14. End with a polite call to action.
15. Include the portfolio/GitHub/LinkedIn link exactly as provided, or use the placeholder if missing.
16. Use clean formatting with paragraphs.

Final email format:

Subject: [clear subject line]

[email body]

Best regards,  
${userName}
`;

    const response = await ai.models.generateContent({
     model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    return res.status(200).json({
      email: response.text,
    });
  } catch (error) {
    console.log("Gemini backend error:", error);

    return res.status(500).json({
      message: "AI email generation failed",
      error: error.message,
    });
  }
};

module.exports = { generateColdEmail };