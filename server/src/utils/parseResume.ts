export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  education?: string[];
  experience?: string[];
  skills?: string[];
  rawText: string;
}

/**
 * Parse raw resume text into structured sections
 */
export const parseResumeText = (text: string): ParsedResume => {
  // Extract contact info
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\d{10}/);

  // Split into lines
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const education: string[] = [];
  const experience: string[] = [];
  const skills: string[] = [];

  let currentSection: "education" | "experience" | "skills" | null = null;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("education")) {
      currentSection = "education";
      continue;
    } else if (lowerLine.includes("experience") || lowerLine.includes("work history")) {
      currentSection = "experience";
      continue;
    } else if (lowerLine.includes("skills")) {
      currentSection = "skills";
      continue;
    }

    if (currentSection === "education") education.push(line);
    else if (currentSection === "experience") experience.push(line);
    else if (currentSection === "skills") {
      skills.push(...line.split(/[,•]/).map(s => s.trim()).filter(Boolean));
    }
  }

  return {
    name: lines[0] || undefined, // often first line is name
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    education,
    experience,
    skills,
    rawText: text,
  };
};
