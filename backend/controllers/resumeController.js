const pdfParsePkg = require("pdf-parse");

const extractTextFromPdf = async (buffer) => {
  // Old pdf-parse version support
  if (typeof pdfParsePkg === "function") {
    const data = await pdfParsePkg(buffer);
    return data.text;
  }

  // Some CommonJS/ESM default export support
  if (typeof pdfParsePkg.default === "function") {
    const data = await pdfParsePkg.default(buffer);
    return data.text;
  }

  // New pdf-parse version support
  if (pdfParsePkg.PDFParse) {
    const parser = new pdfParsePkg.PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    if (parser.destroy) {
      await parser.destroy();
    }

    return result.text;
  }

  throw new Error("Unsupported pdf-parse version");
};
const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is missing",
      });
    }

    const resumeText = await extractTextFromPdf(req.file.buffer);
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        message: "Could not extract enough text from this PDF",
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an expert ATS resume reviewer and technical recruiter.

Analyze the resume against the given job description.

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Return the response in this exact JSON format only. Do not add markdown, explanation, or extra text.

{
  "atsScore": number between 0 and 100,
  "summary": "short overall review",
  "strongPoints": ["point 1", "point 2", "point 3"],
  "missingSkills": ["skill 1", "skill 2"],
  "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "recommendedKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "finalAdvice": "short final advice"
}

Rules:
- Do not invent skills that are not in the resume.
- Compare resume with job description carefully.
- Be practical and helpful for a fresher/student.
- ATS score should be realistic.
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

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawResponse: text,
      });
    }

    res.status(200).json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.log("Resume analysis error:", error);

    res.status(500).json({
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};

module.exports = { analyzeResume };