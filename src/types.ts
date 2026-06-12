export interface VoiceOption {
  value: string;
  label: string;
  description: string;
  gender: "female" | "male" | "unspecified";
}

export interface AudioGeneration {
  id: string;
  text: string;
  voiceName: string;
  mood: string;
  timestamp: string;
  audioUrl: string;
}

export interface Vocabulary {
  word: string;
  partOfSpeech: string;
  ipa: string;
  meaning: string;
  example: string;
}

export interface ImprovementItem {
  category: string;
  details: string;
  exampleWords: string[];
}

export interface ChildFeedback {
  name: string;
  role: string;
  avatar: string;
  pros: string[];
  improvements: ImprovementItem[];
}
