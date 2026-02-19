# Story Mode Guide 🎭

## What is Story Mode?

Story Mode transforms the learning experience into an **interactive conversation** between two characters. Instead of just watching simulations, students now hear and see a natural dialogue that explains the concepts!

## Features

### 🗣️ Conversational Learning
- Two characters (teacher and student) discuss each problem
- Natural back-and-forth dialogue
- Questions and answers that mirror real learning

### 💬 Speech Bubbles
- Animated speech bubbles appear above the speaking character
- Text is displayed clearly for reading along
- Bubbles have different colors for each character

### 🔊 Audio Narration
- Text-to-speech reads each line automatically
- Different voice pitch and rate for each character
- Can be toggled on/off with the volume button

### 😊 Emotion Indicators
- Characters show emotions: happy, thinking, excited, confused
- Animated emoji indicators on speech bubbles
- Characters bounce and rotate when speaking

### 📊 Progress Tracking
- Dots show progress through the story
- Current line is highlighted
- Line counter shows position in dialogue

## Characters

### The Donkey's Exam Rush
- **Professor Owl** 🦉 (Teacher) - Wise and patient
- **Donkey Dan** 🫏 (Student) - Eager to learn

### The Snail's Great Escape
- **Wise Turtle** 🐢 (Teacher) - Slow and thoughtful
- **Snail Sam** 🐌 (Student) - Determined climber

### The Melting Ice Cream Mystery
- **Chef Bear** 🐻 (Teacher) - Culinary expert
- **Little Fox** 🦊 (Student) - Curious and quick

## How It Works

1. **Select a Problem** - Choose from the level buttons
2. **Toggle Story Mode** - Click the 💬 button (top right)
3. **Press Play** - Start the conversation
4. **Watch & Listen** - Characters discuss the problem
5. **Learn the Concept** - Understand through dialogue
6. **Replay** - Watch again to reinforce learning

## Educational Benefits

### Multiple Learning Styles
- **Visual**: Speech bubbles and character animations
- **Auditory**: Text-to-speech narration
- **Reading**: Text displayed in bubbles

### Scaffolded Learning
- Student asks questions (like real learners)
- Teacher provides explanations step-by-step
- Concepts build progressively

### Engagement
- Story format is more engaging than dry explanations
- Characters make learning relatable
- Emotions help students connect

### Retention
- Narrative format aids memory
- Dialogue is easier to remember than formulas
- Can replay to reinforce concepts

## Technical Details

### Speech Synthesis
- Uses Web Speech API
- Different pitch/rate for each character
- Gracefully degrades if not supported

### Animations
- Framer Motion for smooth transitions
- Character bouncing when speaking
- Speech bubble entrance/exit effects

### Accessibility
- Text is always visible (not audio-only)
- Can pause/replay at any time
- Clear visual indicators of progress

## Adding New Stories

To add a new story, edit `src/StoryMode.tsx` and add to the `STORIES` object:

```typescript
newproblem: {
  title: "Story Title",
  characters: {
    teacher: { 
      name: 'Teacher Name', 
      emoji: '🦉', 
      position: 'left', 
      voice: { pitch: 0.8, rate: 0.9 } 
    },
    student: { 
      name: 'Student Name', 
      emoji: '🐌', 
      position: 'right', 
      voice: { pitch: 1.2, rate: 1.0 } 
    }
  },
  dialogue: [
    { 
      character: 'student', 
      text: "Question or statement", 
      emotion: 'confused' 
    },
    { 
      character: 'teacher', 
      text: "Explanation", 
      emotion: 'thinking' 
    },
    // ... more dialogue
  ]
}
```

## Tips for Educators

1. **Use Both Modes**: Start with Story Mode for concept introduction, then use Game Mode for practice
2. **Pause and Discuss**: Pause the story to ask students questions
3. **Replay Key Moments**: Replay specific parts that students find challenging
4. **Encourage Reading Along**: Have students read the bubbles out loud
5. **Discuss Emotions**: Talk about why characters feel certain ways

---

Story Mode makes learning feel like watching a conversation between friends! 🎉
