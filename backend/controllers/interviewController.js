const generateInterviewQuestions = async (req, res) => {
  try {
    const {
      role,
      company,
      jobDescription,
      difficulty,
      interviewType,
    } = req.body;

    if (!role || !jobDescription) {
      return res.status(400).json({
        message: "Role and job description are required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is missing",
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const interviewTypeRules = {
  HR: `
Generate only HR questions.
Return hrQuestions with data.
Return technicalQuestions, dsaQuestions, and projectQuestions as empty arrays.
For HR questions, explain how to answer using a clear and professional structure like STAR method when useful.
`,

  Technical: `
Generate only technical questions.
Return technicalQuestions with data.
Return hrQuestions, dsaQuestions, and projectQuestions as empty arrays.
For technical questions, explain the concept, how to approach the answer, and what example the candidate can mention.
`,

  DSA: `
Generate only DSA questions.
Return dsaQuestions with data.
Return hrQuestions, technicalQuestions, and projectQuestions as empty arrays.
For each DSA question, explain:
- What pattern/topic it belongs to
- Brute force approach
- Optimized approach
- Time and space complexity
- Important edge cases
`,

  "Project Based": `
Generate only project-based questions.
Return projectQuestions with data.
Return hrQuestions, technicalQuestions, and dsaQuestions as empty arrays.
For project questions, explain how to answer using architecture, features, tech stack, challenges, and improvements.
`,

  Mixed: `
Generate all sections:
- HR questions
- Technical questions
- DSA questions
- Project-based questions
`,
};

const selectedRule =
  interviewTypeRules[interviewType] || interviewTypeRules.Mixed;

    const prompt = `
You are an expert technical interviewer and career coach.

Generate interview preparation questions based on the selected interview type.

Candidate is preparing for:
- Role: ${role}
- Company: ${company || "Not provided"}
- Difficulty: ${difficulty || "Medium"}
- Interview Type: ${interviewType || "Mixed"}
- Job Description: ${jobDescription}

Interview type rule:
${selectedRule}

Return response in this exact JSON format only. Do not add markdown, explanation, or extra text.

{
  "overview": "short preparation summary based on selected interview type",
  "hrQuestions": [
    {
      "question": "question text",
      "approach": "how to approach this question",
      "sampleAnswer": "short sample answer or answer direction",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  ],
  "technicalQuestions": [
    {
      "question": "question text",
      "approach": "how to approach this technical question",
      "sampleAnswer": "short sample answer or explanation direction",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  ],
  "dsaQuestions": [
    {
      "question": "question text",
      "approach": "step-by-step approach including brute force and optimized approach",
      "sampleAnswer": "short explanation of how to solve it",
      "keyPoints": ["pattern/topic", "time complexity", "space complexity", "edge cases"]
    }
  ],
  "projectQuestions": [
    {
      "question": "question text",
      "approach": "how to structure the answer using project architecture, features, challenges, and decisions",
      "sampleAnswer": "short sample answer or answer direction",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  ],
  "finalTips": ["tip 1", "tip 2", "tip 3"]
}

Rules:
- Follow the selected interview type strictly.
- If interviewType is HR, only hrQuestions should contain questions.
- If interviewType is Technical, only technicalQuestions should contain questions.
- If interviewType is DSA, only dsaQuestions should contain questions.
- If interviewType is Project Based, only projectQuestions should contain questions.
- If interviewType is Mixed, generate all sections.
- Empty sections must be returned as empty arrays.
- Keep questions practical for a fresher or junior candidate.
- Match questions with the job description.
- Do not generate very advanced questions unless difficulty is Hard.
- For Easy difficulty, focus on basics.
- For Medium difficulty, include practical and conceptual questions.
- For Hard difficulty, include deeper reasoning and edge cases.
- Generate 5 questions for the selected type.
- If Mixed, generate 3 questions per section.
`;
    const models = [
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
    ];

    let text = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        text = response.text;
        break;
      } catch (error) {
        lastError = error;
        console.log(`${model} failed:`, error.message);
      }
    }

    if (!text) {
      return res.status(503).json({
        message: "AI models are busy right now. Please try again later.",
        error: lastError?.message,
      });
    }

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let interviewData;

    try {
      interviewData = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawResponse: text,
      });
    }

    res.status(200).json({
      message: "Interview questions generated successfully",
      interviewData,
    });
  } catch (error) {
    console.log("Interview generation error:", error);

    res.status(500).json({
      message: "Interview question generation failed",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions };