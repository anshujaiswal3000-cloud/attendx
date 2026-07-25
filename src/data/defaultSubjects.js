export const DEFAULT_SUBJECTS = [
  {
    id: "coa",
    name: "Computer Organization & Architecture",
    code: "CS-301",
    faculty: "Dr. Rakesh Sharma",
    present: 0,
    total: 0,
    color: "#6366f1", // Indigo
    icon: "Computer",
  },
  {
    id: "coa_lab",
    name: "COA Lab",
    code: "CS-301P",
    faculty: "Dr. Rakesh Sharma",
    present: 0,
    total: 0,
    color: "#4f46e5", // Darker Indigo
    icon: "Code",
  },
  {
    id: "ds",
    name: "Data Structure",
    code: "CS-302",
    faculty: "Prof. Priya Verma",
    present: 0,
    total: 0,
    color: "#3b82f6", // Blue
    icon: "Storage",
  },
  {
    id: "ds_lab",
    name: "Data Structure Lab",
    code: "CS-302P",
    faculty: "Prof. Priya Verma",
    present: 0,
    total: 0,
    color: "#2563eb", // Darker Blue
    icon: "Layers",
  },
  {
    id: "de",
    name: "Digital Electronics",
    code: "CS-303",
    faculty: "Dr. Anil Gupta",
    present: 0,
    total: 0,
    color: "#10b981", // Emerald
    icon: "Memory",
  },
  {
    id: "dstl",
    name: "Discrete Structures & Theory of Logic",
    code: "CS-304",
    faculty: "Prof. N. K. Roy",
    present: 0,
    total: 0,
    color: "#8b5cf6", // Purple
    icon: "BarChart",
  },
  {
    id: "psd",
    name: "Programming Skill Development",
    code: "CS-305",
    faculty: "Prof. Anuj Saxena",
    present: 0,
    total: 0,
    color: "#ec4899", // Pink
    icon: "School",
  },
  {
    id: "python",
    name: "Python Programming",
    code: "CS-306",
    faculty: "Ms. Neha Sinha",
    present: 0,
    total: 0,
    color: "#14b8a6", // Teal
    icon: "DeveloperMode",
  },
  {
    id: "quant",
    name: "Quant",
    code: "QT-101",
    faculty: "Mr. Rajeev Kumar",
    present: 0,
    total: 0,
    color: "#f59e0b", // Amber
    icon: "Calculate",
  },
  {
    id: "reasoning",
    name: "Reasoning",
    code: "RS-102",
    faculty: "Mr. Rajeev Kumar",
    present: 0,
    total: 0,
    color: "#eab308", // Yellow
    icon: "Psychology",
  },
  {
    id: "ai",
    name: "Skill Based AI",
    code: "AI-101",
    faculty: "Dr. S. K. Singh",
    present: 0,
    total: 0,
    color: "#06b6d4", // Cyan
    icon: "SmartToy",
  },
  {
    id: "web_workshop",
    name: "Web Designing Workshop",
    code: "CS-307",
    faculty: "Prof. Vineet Jha",
    present: 0,
    total: 0,
    color: "#f43f5e", // Rose
    icon: "Html",
  },
];

export const DEFAULT_TIMETABLE = {
  Monday: [
    { subjectId: "ds", time: "09:00 AM" },
    { subjectId: "coa", time: "10:00 AM" },
    { subjectId: "de", time: "11:00 AM" },
  ],
  Tuesday: [
    { subjectId: "python", time: "09:00 AM" },
    { subjectId: "psd", time: "10:00 AM" },
    { subjectId: "ds_lab", time: "11:00 AM" },
  ],
  Wednesday: [
    { subjectId: "coa", time: "09:00 AM" },
    { subjectId: "ds", time: "10:00 AM" },
    { subjectId: "web_workshop", time: "11:00 AM" },
  ],
  Thursday: [
    { subjectId: "ai", time: "09:00 AM" },
    { subjectId: "quant", time: "10:00 AM" },
    { subjectId: "reasoning", time: "11:00 AM" },
  ],
  Friday: [
    { subjectId: "de", time: "09:00 AM" },
    { subjectId: "dstl", time: "10:00 AM" },
    { subjectId: "coa_lab", time: "11:00 AM" },
  ],
  Saturday: [
    { subjectId: "python", time: "09:00 AM" },
    { subjectId: "ai", time: "10:00 AM" },
    { subjectId: "web_workshop", time: "11:00 AM" },
  ],
};
