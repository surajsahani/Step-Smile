import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

// Initialize the AI model
const getModel = () => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 'AIzaSyB_iOynqhuYf6SP7041cO_SfGBywBQbN50'; // Fallback key
  
  if (!apiKey) {
    console.warn('No Gemini API key found, using fallback mode');
    return null;
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: apiKey,
    temperature: 0.7,
    maxOutputTokens: 150,
  });
};

interface ConversationState {
  concept: string;
  formula: string;
  studentAnswers: string[];
  questionsAsked: number;
}

export class AITeacher {
  private model: ChatGoogleGenerativeAI | null;
  private conversationHistory: (SystemMessage | HumanMessage | AIMessage)[];
  private state: ConversationState;

  constructor(concept: string, formula: string) {
    this.model = getModel();
    this.conversationHistory = [];
    this.state = {
      concept,
      formula,
      studentAnswers: [],
      questionsAsked: 0,
    };

    // System prompt to set the teacher's personality
    this.conversationHistory.push(
      new SystemMessage(`You are a friendly, patient teacher helping an 8-12 year old child DEEPLY understand: ${concept}.

The formula is: ${formula}

Your role:
- Check if they understand WHY the formula works, not just WHAT it is
- Ask questions that reveal their thinking process
- If they just repeat the formula, ask them to explain it differently
- If they give a shallow answer, dig deeper with "Why?" or "How?"
- After 3 answers that show TRUE understanding, congratulate them
- Keep responses SHORT (1-2 sentences max)
- Use simple but precise language
- Be enthusiastic and supportive!

Question progression (ask in this order):
1. "Can you explain the formula in your own words?" (tests basic recall)
2. "WHY does this formula work? What's the logic behind it?" (tests understanding)
3. "If I change [a number], what happens and WHY?" (tests application)

Red flags (means they DON'T understand yet):
- Just repeating the formula word-for-word
- Saying "I don't know" or very short answers
- Can't explain WHY, only WHAT
- Can't apply it to a different example

Green flags (means they DO understand):
- Explains in their own words
- Can say WHY it works
- Can predict what happens if numbers change
- Uses examples to explain`)
    );
  }

  async askQuestion(): Promise<string> {
    if (!this.model) {
      // Fallback questions if no API key
      const fallbackQuestions = [
        "Can you explain the formula to me in your own words?",
        "Great! Now tell me WHY this formula works. What's the logic?",
        "Perfect! If I change one of the numbers, what happens and why?"
      ];
      return fallbackQuestions[Math.min(this.state.questionsAsked, 2)];
    }

    try {
      let prompt = '';
      if (this.state.questionsAsked === 0) {
        prompt = "Ask the student to explain the formula in their own words. Keep it simple and friendly!";
      } else if (this.state.questionsAsked === 1) {
        prompt = "Now ask them WHY the formula works. What's the logic behind it? Push them to think deeper!";
      } else {
        prompt = "Ask them to apply it: What happens if we change a number? Make them predict and explain!";
      }

      this.conversationHistory.push(new HumanMessage(prompt));

      const response = await this.model.invoke(this.conversationHistory);
      const question = response.content.toString();

      this.conversationHistory.push(new AIMessage(question));
      this.state.questionsAsked++;

      return question;
    } catch (error) {
      console.error('AI Teacher error:', error);
      return "Can you tell me more about what you learned?";
    }
  }

  async evaluateAnswer(studentAnswer: string): Promise<{
    isGood: boolean;
    feedback: string;
    shouldContinue: boolean;
  }> {
    this.state.studentAnswers.push(studentAnswer);

    if (!this.model) {
      // Simple fallback evaluation - check for depth
      const hasExplanation = studentAnswer.length > 30;
      const hasKeywords = studentAnswer.toLowerCase().includes('multiply') ||
                         studentAnswer.toLowerCase().includes('×') ||
                         studentAnswer.toLowerCase().includes('add') ||
                         studentAnswer.toLowerCase().includes('subtract') ||
                         studentAnswer.toLowerCase().includes('because') ||
                         studentAnswer.toLowerCase().includes('why');
      const isGood = hasKeywords && hasExplanation;

      return {
        isGood,
        feedback: isGood 
          ? "Great explanation! I can see you really understand!" 
          : "Can you explain it a bit more? Tell me WHY it works, not just WHAT it is.",
        shouldContinue: this.state.studentAnswers.length < 3
      };
    }

    try {
      this.conversationHistory.push(
        new HumanMessage(`Student answered: "${studentAnswer}"
        
Evaluate if this shows DEEP understanding (not just memorization). Then:
- If they show TRUE understanding (explains WHY, uses own words, gives examples): Give brief praise (1 sentence)
- If they just repeated the formula or gave shallow answer: Ask them to explain WHY or HOW (1 sentence)
- If they say "I don't know": Give a hint and ask again (1 sentence)

Keep it SHORT and encouraging!`)
      );

      const response = await this.model.invoke(this.conversationHistory);
      const feedback = response.content.toString();

      this.conversationHistory.push(new AIMessage(feedback));

      // Determine if answer shows deep understanding
      const isGood = (feedback.toLowerCase().includes('great') ||
                     feedback.toLowerCase().includes('good') ||
                     feedback.toLowerCase().includes('excellent') ||
                     feedback.toLowerCase().includes('perfect') ||
                     feedback.toLowerCase().includes('correct') ||
                     feedback.toLowerCase().includes('understand')) &&
                     !feedback.toLowerCase().includes('but') &&
                     !feedback.toLowerCase().includes('however');

      const shouldContinue = this.state.studentAnswers.length < 3 && isGood;

      return {
        isGood,
        feedback,
        shouldContinue
      };
    } catch (error) {
      console.error('AI evaluation error:', error);
      return {
        isGood: true,
        feedback: "Good effort! Let's continue.",
        shouldContinue: this.state.studentAnswers.length < 3
      };
    }
  }

  getProgress(): { current: number; total: number } {
    return {
      current: this.state.studentAnswers.filter((_, i) => i < this.state.questionsAsked).length,
      total: 3
    };
  }

  isComplete(): boolean {
    return this.state.studentAnswers.length >= 3;
  }
}
