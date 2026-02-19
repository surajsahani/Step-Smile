import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Character {
  name: string;
  emoji: string;
  position: 'left' | 'right';
  voice: { pitch: number; rate: number };
}

interface DialogueLine {
  character: 'teacher' | 'student';
  text: string;
  emotion?: 'happy' | 'thinking' | 'excited' | 'confused';
}

interface StoryScript {
  title: string;
  characters: { teacher: Character; student: Character };
  dialogue: DialogueLine[];
}

const STORIES: Record<string, StoryScript> = {
  exam: {
    title: "The Donkey's Exam Rush",
    characters: {
      teacher: { name: 'Professor Owl', emoji: '🦉', position: 'left', voice: { pitch: 0.8, rate: 0.9 } },
      student: { name: 'Donkey Dan', emoji: '🫏', position: 'right', voice: { pitch: 1.2, rate: 1.0 } }
    },
    dialogue: [
      { character: 'student', text: "Oh no! My exam is in 3 hours and I need 6 pages of notes!", emotion: 'confused' },
      { character: 'teacher', text: "Don't panic, Dan! Let's think about this step by step.", emotion: 'thinking' },
      { character: 'student', text: "But how do I know if I have enough time?", emotion: 'confused' },
      { character: 'teacher', text: "Well, how many pages can you collect per hour?", emotion: 'thinking' },
      { character: 'student', text: "I can collect 2 pages every hour!", emotion: 'happy' },
      { character: 'teacher', text: "Perfect! This is called 'Repeated Addition'. We're grouping pages by hour.", emotion: 'excited' },
      { character: 'student', text: "So... 2 pages times 3 hours?", emotion: 'thinking' },
      { character: 'teacher', text: "Exactly! 2 × 3 = 6 pages. You'll have exactly what you need!", emotion: 'excited' },
      { character: 'student', text: "Wow! Math saved my exam! Thanks Professor!", emotion: 'excited' },
      { character: 'teacher', text: "Remember: Pages per Hour × Hours = Total Pages. That's the formula!", emotion: 'happy' }
    ]
  },
  snail: {
    title: "The Snail's Great Escape",
    characters: {
      teacher: { name: 'Wise Turtle', emoji: '🐢', position: 'left', voice: { pitch: 0.7, rate: 0.8 } },
      student: { name: 'Snail Sam', emoji: '🐌', position: 'right', voice: { pitch: 1.3, rate: 1.1 } }
    },
    dialogue: [
      { character: 'student', text: "Help! I'm stuck in a 10-meter deep hole!", emotion: 'confused' },
      { character: 'teacher', text: "Stay calm, Sam. Tell me, how far can you climb each day?", emotion: 'thinking' },
      { character: 'student', text: "I can climb up 3 meters during the day!", emotion: 'happy' },
      { character: 'teacher', text: "That's good! But what happens at night?", emotion: 'thinking' },
      { character: 'student', text: "Oh no... I slide back down 2 meters while I sleep.", emotion: 'confused' },
      { character: 'teacher', text: "Interesting! So your 'Net Progress' each day is 3 minus 2, which equals 1 meter.", emotion: 'excited' },
      { character: 'student', text: "So I only make 1 meter of real progress per day?", emotion: 'thinking' },
      { character: 'teacher', text: "Exactly! But here's the trick: on the last day, you reach the top and don't slide back!", emotion: 'excited' },
      { character: 'student', text: "Ohhh! So I need to think about when I'll reach the top during the day!", emotion: 'excited' },
      { character: 'teacher', text: "Right! After 7 days you're at 7 meters. On day 8, you climb 3 more and escape!", emotion: 'happy' }
    ]
  },
  icecream: {
    title: "The Melting Ice Cream Mystery",
    characters: {
      teacher: { name: 'Chef Bear', emoji: '🐻', position: 'left', voice: { pitch: 0.9, rate: 0.9 } },
      student: { name: 'Little Fox', emoji: '🦊', position: 'right', voice: { pitch: 1.4, rate: 1.0 } }
    },
    dialogue: [
      { character: 'student', text: "Chef! My ice cream is melting in the sun!", emotion: 'confused' },
      { character: 'teacher', text: "Oh dear! How much ice cream do you have?", emotion: 'thinking' },
      { character: 'student', text: "I started with 5 grams!", emotion: 'happy' },
      { character: 'teacher', text: "And how fast is it melting?", emotion: 'thinking' },
      { character: 'student', text: "About 1 gram per minute...", emotion: 'confused' },
      { character: 'teacher', text: "This is 'Repeated Subtraction'! Every minute, we take away 1 gram.", emotion: 'excited' },
      { character: 'student', text: "So after 2 minutes, I'll have... 5 minus 2?", emotion: 'thinking' },
      { character: 'teacher', text: "Close! It's 5 minus (1 × 2). That's 5 - 2 = 3 grams left!", emotion: 'excited' },
      { character: 'student', text: "I better eat it fast before it all melts!", emotion: 'excited' },
      { character: 'teacher', text: "Good idea! The formula is: Start - (Melt Rate × Minutes) = Leftover", emotion: 'happy' }
    ]
  }
};

interface StoryModeProps {
  problemId: string;
  soundEnabled: boolean;
}

export default function StoryMode({ problemId, soundEnabled }: StoryModeProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const story = STORIES[problemId] || STORIES.exam;

  const speak = (text: string, character: 'teacher' | 'student') => {
    if (!soundEnabled || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const charData = story.characters[character];
    utterance.pitch = charData.voice.pitch;
    utterance.rate = charData.voice.rate;
    utterance.volume = 0.8;

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
    });
  };

  const playNextLine = async () => {
    if (currentLine >= story.dialogue.length) {
      setIsPlaying(false);
      return;
    }

    const line = story.dialogue[currentLine];
    setShowText(true);

    if (soundEnabled) {
      await speak(line.text, line.character);
    }

    // Wait a bit before next line
    timeoutRef.current = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, soundEnabled ? 500 : 2500);
  };

  useEffect(() => {
    if (isPlaying) {
      playNextLine();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, currentLine]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      if (currentLine >= story.dialogue.length) {
        setCurrentLine(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentLine(0);
    setShowText(false);
    window.speechSynthesis?.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const currentDialogue = story.dialogue[currentLine];
  const currentCharacter = currentDialogue ? story.characters[currentDialogue.character] : null;

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🌟</div>
        <div className="absolute top-20 right-20 text-6xl">✨</div>
        <div className="absolute bottom-10 left-20 text-6xl">💫</div>
        <div className="absolute bottom-20 right-10 text-6xl">⭐</div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <h2 className="text-3xl font-black text-purple-900 mb-2">{story.title}</h2>
        <p className="text-sm text-purple-600 font-bold">A Learning Story</p>
      </motion.div>

      {/* Story Stage */}
      <div className="flex-1 flex items-center justify-center relative mb-8">
        
        {/* Characters */}
        <div className="w-full max-w-4xl flex items-end justify-between px-8 relative">
          
          {/* Teacher */}
          <motion.div
            animate={{
              scale: currentDialogue?.character === 'teacher' ? 1.1 : 1,
              y: currentDialogue?.character === 'teacher' ? -10 : 0
            }}
            className="flex flex-col items-center relative"
          >
            <AnimatePresence>
              {currentDialogue?.character === 'teacher' && showText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-full mb-4 bg-white rounded-3xl px-6 py-4 shadow-2xl border-4 border-blue-200 max-w-xs"
                >
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    {currentDialogue.text}
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-200 rotate-45" />
                  
                  {/* Emotion indicator */}
                  {currentDialogue.emotion && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2 text-2xl"
                    >
                      {currentDialogue.emotion === 'happy' && '😊'}
                      {currentDialogue.emotion === 'thinking' && '🤔'}
                      {currentDialogue.emotion === 'excited' && '🤩'}
                      {currentDialogue.emotion === 'confused' && '😕'}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              animate={{
                rotate: currentDialogue?.character === 'teacher' ? [-2, 2, -2] : 0
              }}
              transition={{ duration: 0.5, repeat: currentDialogue?.character === 'teacher' ? Infinity : 0 }}
              className="text-9xl drop-shadow-xl"
            >
              {story.characters.teacher.emoji}
            </motion.div>
            <div className="mt-4 bg-blue-100 px-4 py-2 rounded-full border-2 border-blue-200">
              <p className="text-xs font-black text-blue-900">{story.characters.teacher.name}</p>
            </div>
          </motion.div>

          {/* Student */}
          <motion.div
            animate={{
              scale: currentDialogue?.character === 'student' ? 1.1 : 1,
              y: currentDialogue?.character === 'student' ? -10 : 0
            }}
            className="flex flex-col items-center relative"
          >
            <AnimatePresence>
              {currentDialogue?.character === 'student' && showText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-full mb-4 bg-white rounded-3xl px-6 py-4 shadow-2xl border-4 border-purple-200 max-w-xs"
                >
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    {currentDialogue.text}
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-purple-200 rotate-45" />
                  
                  {/* Emotion indicator */}
                  {currentDialogue.emotion && (
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2 text-2xl"
                    >
                      {currentDialogue.emotion === 'happy' && '😊'}
                      {currentDialogue.emotion === 'thinking' && '🤔'}
                      {currentDialogue.emotion === 'excited' && '🤩'}
                      {currentDialogue.emotion === 'confused' && '😕'}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              animate={{
                rotate: currentDialogue?.character === 'student' ? [2, -2, 2] : 0
              }}
              transition={{ duration: 0.5, repeat: currentDialogue?.character === 'student' ? Infinity : 0 }}
              className="text-9xl drop-shadow-xl"
            >
              {story.characters.student.emoji}
            </motion.div>
            <div className="mt-4 bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-200">
              <p className="text-xs font-black text-purple-900">{story.characters.student.name}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-center gap-2">
          {story.dialogue.map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                scale: idx === currentLine ? 1.2 : 1,
                backgroundColor: idx < currentLine ? '#10b981' : idx === currentLine ? '#8b5cf6' : '#e5e7eb'
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>
        <p className="text-center mt-2 text-xs font-bold text-gray-600">
          Line {Math.min(currentLine + 1, story.dialogue.length)} of {story.dialogue.length}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-white shadow-xl border-b-4 ${
            isPlaying 
              ? 'bg-red-500 border-red-700' 
              : 'bg-green-500 border-green-700'
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Pause' : currentLine >= story.dialogue.length ? 'Replay' : 'Play'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="p-4 rounded-full bg-white border-4 border-gray-200 text-gray-600 shadow-lg"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {currentLine >= story.dialogue.length && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl border-8 border-yellow-400 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Story Complete!</h3>
              <p className="text-gray-600 font-bold mb-6">You've learned the concept!</p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-purple-600 text-white rounded-full font-black hover:bg-purple-700 transition-colors"
              >
                Watch Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
