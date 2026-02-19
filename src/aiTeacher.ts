import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

// Initialize the AI model
const getModel = () => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
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
      new SystemMessage(`You are a friendly, patient teacher helping a 5-10 year old child understand: ${concept}.

The formula is: ${formula}

Your role:
- Ask simple, clear questions to check understanding
- Give encouraging feedback
- If the answer is weak, ask them to explain more
- If the answer is good, praise them and ask a follow-up question
- After 3 good answers, congratulate them warmly
- Keep responses SHORT (1-2 sentences max)
- Use simple words a child can understand
- Be enthusiastic and supportive!

Question types to ask:
1. Explain the formula in your own words
2. When would you use this?
3. What happens if we change the numbers?`)
    );
  }

  async askQuestion(): Promise<string> {
    if (!this.model) {
      // Fallback questions if no API key
      const fallbackQuestions = [
        "Can you explain the formula to me in your own words?",
        "Great! Now, when would we use this formula?",
        "Excellent! What happens if we change the numbers?"
      ];
      return fallbackQuestions[Math.min(this.state.questionsAsked, 2)];
    }

    try {
      const prompt = this.state.questionsAsked === 0
        ? "Ask the student to explain the formula in their own words. Keep it simple and friendly!"
        : "Based on their previous answer, ask a follow-up question to check deeper understanding.";

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
      // Simple fallback evaluation
      const hasKeywords = studentAnswer.toLowerCase().includes('multiply') ||
                         studentAnswer.toLowerCase().includes('×') ||
                         studentAnswer.toLowerCase().includes('add') ||
                         studentAnswer.toLowerCase().includes('subtract');
      const isLongEnough = studentAnswer.length > 15;
      const isGood = hasKeywords && isLongEnough;

      return {
        isGood,
        feedback: isGood 
          ? "Great explanation! I can see you understand!" 
          : "Can you explain it a bit more? Think about the formula.",
        shouldContinue: this.state.studentAnswers.length < 3
      };
    }

    try {
      this.conversationHistory.push(
        new HumanMessage(`Student answered: "${studentAnswer}"
        
Evaluate if this shows good understanding. Then:
- If GOOD: Give brief praise (1 sentence) and say if you want to ask more or if they're ready
- If WEAK: Gently ask them to explain more (1 sentence)

Keep it SHORT and encouraging!`)
      );

      const response = await this.model.invoke(this.conversationHistory);
      const feedback = response.content.toString();

      this.conversationHistory.push(new AIMessage(feedback));

      // Determine if answer is good based on AI response
      const isGood = feedback.toLowerCase().includes('great') ||
                     feedback.toLowerCase().includes('good') ||
                     feedback.toLowerCase().includes('excellent') ||
                     feedback.toLowerCase().includes('perfect') ||
                     feedback.toLowerCase().includes('correct');

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
