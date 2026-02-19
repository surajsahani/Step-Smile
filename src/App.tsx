/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { 
  Cloud, 
  Sun, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Star, 
  Sparkles, 
  ArrowUp, 
  ArrowDown,
  Gamepad2,
  Settings2,
  Heart,
  AlertCircle,
  Volume2,
  VolumeX,
  ExternalLink,
  GraduationCap,
  FastForward,
  BookOpen,
  IceCream,
  Timer,
  CheckCircle2,
  XCircle,
  Moon,
  Waves,
  Lock,
  Unlock,
  Layers,
  Activity,
  Share2,
  Search,
  Zap,
  MessageCircle
} from 'lucide-react';
import StoryMode from './StoryMode';

type ProblemType = 'exam' | 'icecream' | 'snail' | 'mindist' | 'maxmin' | 'goodsub' | 'graph' | 'atleast';

interface ProblemDef {
  id: ProblemType;
  level: number;
  title: string;
  emoji: string;
  description: string;
  link: string;
  concept: string;
  given: string[];
  find: string;
  rule: string;
  formula: string;
  theme: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
  inputs: { key: string; label: string; default: string; color: string; unit: string }[];
}

const PROBLEMS: ProblemDef[] = [
  {
    id: 'exam',
    level: 1,
    title: 'Rush to Exam',
    emoji: '🎒',
    description: 'Can the Student collect enough pages for the exam?',
    link: 'https://www.codechef.com/problems/RUSHTOEXAM',
    concept: 'Repeated Addition (Grouping)',
    given: ['Time we have (Hours)', 'Pages per Hour'],
    find: 'Total pages collected vs Goal',
    rule: 'Every hour, we add the same number of pages.',
    formula: 'Pages per Hour × Hours = Total Pages',
    theme: { bg: 'bg-[#F3E5F5]', text: 'text-purple-900', border: 'border-purple-100', accent: 'bg-purple-600' },
    inputs: [
      { key: 'n', label: 'How many hours?', default: '3', color: 'blue', unit: 'h' },
      { key: 'm', label: 'Goal (Pages needed)?', default: '6', color: 'purple', unit: 'p' },
      { key: 'a', label: 'Pages per hour?', default: '2', color: 'green', unit: 'p/h' },
    ]
  },
  {
    id: 'icecream',
    level: 2,
    title: 'IceCream Cones',
    emoji: '🍦',
    description: 'How much ice cream is left after melting?',
    link: 'https://www.codechef.com/problems/ICECREAMCONES',
    concept: 'Repeated Subtraction',
    given: ['Starting amount', 'Melt rate per minute'],
    find: 'How much is left after some time',
    rule: 'Every minute, we take away some ice cream.',
    formula: 'Start - (Melt Rate × Minutes) = Leftover',
    theme: { bg: 'bg-[#FFF3E0]', text: 'text-orange-900', border: 'border-orange-100', accent: 'bg-orange-600' },
    inputs: [
      { key: 'x', label: 'Starting grams?', default: '5', color: 'blue', unit: 'g' },
      { key: 'y', label: 'Melt rate?', default: '1', color: 'red', unit: 'g/m' },
      { key: 'n', label: 'Minutes passed?', default: '2', color: 'orange', unit: 'm' },
    ]
  },
  {
    id: 'snail',
    level: 3,
    title: 'Sub A Add B',
    emoji: '🐌',
    description: 'Help the snail climb out of the deep hole!',
    link: 'https://www.codechef.com/problems/SUBAADDB',
    concept: 'Net Progress (Step-by-Step)',
    given: ['Depth of hole', 'Climb up distance', 'Slide down distance'],
    find: 'Number of days to reach the top',
    rule: 'Each day: Go up, then slide down. Check if we reached the top!',
    formula: 'Total = (Up - Down) per day (until the last day)',
    theme: { bg: 'bg-[#E0F7FA]', text: 'text-blue-900', border: 'border-blue-100', accent: 'bg-blue-600' },
    inputs: [
      { key: 'n', label: 'Hole depth?', default: '10', color: 'blue', unit: 'm' },
      { key: 'a', label: 'Climb up?', default: '3', color: 'green', unit: 'm' },
      { key: 'b', label: 'Slide down?', default: '2', color: 'red', unit: 'm' },
    ]
  },
  {
    id: 'mindist',
    level: 4,
    title: 'Minimum Distinct',
    emoji: '💎',
    description: 'Make all items in the tray unique!',
    link: 'https://www.codechef.com/problems/MINDIST',
    concept: 'Frequency & Swapping',
    given: ['List of items'],
    find: 'Minimum unique items after swaps',
    rule: 'If we have duplicates, try to swap them with something else.',
    formula: 'Unique Count = Total - Duplicates',
    theme: { bg: 'bg-[#E8F5E9]', text: 'text-green-900', border: 'border-green-100', accent: 'bg-green-600' },
    inputs: [
      { key: 'arr', label: 'Items (comma separated)', default: '1,2,2,3,1', color: 'green', unit: 'items' },
    ]
  },
  {
    id: 'maxmin',
    level: 5,
    title: 'Max Minus Min',
    emoji: '⛰️',
    description: 'Find the biggest height difference!',
    link: 'https://www.codechef.com/problems/MAXMIN',
    concept: 'Range (Max - Min)',
    given: ['List of heights'],
    find: 'The gap between the tallest and shortest',
    rule: 'Find the biggest number and the smallest number, then subtract.',
    formula: 'Max - Min = Range',
    theme: { bg: 'bg-[#FFEBEE]', text: 'text-red-900', border: 'border-red-100', accent: 'bg-red-600' },
    inputs: [
      { key: 'arr', label: 'Heights (comma separated)', default: '10,2,5,15,8', color: 'red', unit: 'm' },
    ]
  },
  {
    id: 'goodsub',
    level: 6,
    title: 'Good Subarrays',
    emoji: '🚂',
    description: 'Count subarrays where sum equals length!',
    link: 'https://www.codechef.com/problems/GOODSUB',
    concept: 'Prefix Sums & Counting',
    given: ['Array of digits'],
    find: 'Subarrays where Sum == Length',
    rule: 'Check every possible slice of the array.',
    formula: 'Count(Subarray) where Sum(Subarray) == Length(Subarray)',
    theme: { bg: 'bg-[#E1F5FE]', text: 'text-sky-900', border: 'border-sky-100', accent: 'bg-sky-600' },
    inputs: [
      { key: 'arr', label: 'Train weights (comma separated)', default: '1,0,2', color: 'sky', unit: 'cars' },
    ]
  },
  {
    id: 'graph',
    level: 7,
    title: 'Array Graph',
    emoji: '🕸️',
    description: 'Connect the dots with shared factors!',
    link: 'https://www.codechef.com/problems/ARRAYGRAPH',
    concept: 'Connectivity & GCD',
    given: ['Array of node values'],
    find: 'Are all nodes connected?',
    rule: 'Nodes are connected if they share a common factor.',
    formula: 'Connectivity = Path exists between all pairs',
    theme: { bg: 'bg-[#F5F5F5]', text: 'text-zinc-900', border: 'border-zinc-200', accent: 'bg-zinc-800' },
    inputs: [
      { key: 'arr', label: 'Node values (comma separated)', default: '2,3,4,6', color: 'zinc', unit: 'nodes' },
    ]
  },
  {
    id: 'atleast',
    level: 8,
    title: 'At least One',
    emoji: '🎯',
    description: 'Find the hidden target in the array!',
    link: 'https://www.codechef.com/problems/ATLEASTONE',
    concept: 'Linear Search',
    given: ['Array of values', 'Target value'],
    find: 'Is the target in the array?',
    rule: 'Look at every item until you find the target.',
    formula: 'Result = Target in Array',
    theme: { bg: 'bg-[#FFFDE7]', text: 'text-yellow-900', border: 'border-yellow-100', accent: 'bg-yellow-600' },
    inputs: [
      { key: 'arr', label: 'Search area (comma separated)', default: '5,10,15,20', color: 'yellow', unit: 'targets' },
      { key: 'k', label: 'Target value?', default: '15', color: 'orange', unit: 'val' },
    ]
  },
];

// Simple Sound Engine using Web Audio API
const playSound = (type: 'climb' | 'slide' | 'win' | 'click') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'climb') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'slide') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'win') {
    // Fanfare
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'square';
      o.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0.1, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.3);
    });
  } else if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
};

export default function App() {
  const [activeProblem, setActiveProblem] = useState<ProblemType>('exam');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('unlockedLevel');
    return saved ? parseInt(saved) : 1;
  });

  const [inputs, setInputs] = useState<Record<string, string>>({
    n: '10', a: '3', b: '2', m: '6', x: '5', y: '1', arr: '1,2,2,3,1', k: '15'
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [simStep, setSimStep] = useState(0);
  const [simPhase, setSimPhase] = useState<'idle' | 'active' | 'finished'>('idle');
  const [explanation, setExplanation] = useState<string>('');
  const [thinking, setThinking] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [storyMode, setStoryMode] = useState(false);
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [waitingForAction, setWaitingForAction] = useState(false);
  const [actionPrompt, setActionPrompt] = useState<string>('');
  
  const mainControls = useAnimation();

  // Celebration effect when switching to story mode
  const handleStoryModeToggle = () => {
    setStoryMode(!storyMode);
    if (!storyMode) {
      setShowModeSwitch(true);
      setTimeout(() => setShowModeSwitch(false), 2000);
    }
  };
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const currentProblemDef = useMemo(() => 
    PROBLEMS.find(p => p.id === activeProblem) || PROBLEMS[0]
  , [activeProblem]);

  const result = useMemo(() => {
    if (activeProblem === 'snail') {
      const n = Number(inputs.n), a = Number(inputs.a), b = Number(inputs.b);
      if (isNaN(n) || isNaN(a) || isNaN(b)) return null;
      if (a <= 0) return { error: "The snail needs to climb at least a little bit!" };
      if (n <= 0) return { operations: 0 };
      if (n < a) return { operations: 1 };
      if (a <= b) return { error: "Oh no! The snail is sliding back too much. It will never get out!" };
      const operations = Math.floor((n - a) / (a - b)) + 1;
      return { operations };
    } else if (activeProblem === 'exam') {
      const n = Number(inputs.n), m = Number(inputs.m), a = Number(inputs.a);
      if (isNaN(n) || isNaN(m) || isNaN(a)) return null;
      return { success: (a * n) >= m };
    } else if (activeProblem === 'icecream') {
      const x = Number(inputs.x), y = Number(inputs.y), n = Number(inputs.n);
      if (isNaN(x) || isNaN(y) || isNaN(n)) return null;
      const left = Math.max(0, x - (y * n));
      return { left };
    } else if (activeProblem === 'mindist') {
      const arr = inputs.arr.split(',').map(Number).filter(n => !isNaN(n));
      const distinct = new Set(arr).size;
      return { ops: arr.length - distinct };
    } else if (activeProblem === 'maxmin') {
      const arr = inputs.arr.split(',').map(Number).filter(n => !isNaN(n));
      if (arr.length === 0) return { diff: 0 };
      return { diff: Math.max(...arr) - Math.min(...arr) };
    } else if (activeProblem === 'goodsub') {
      const arr = inputs.arr.split(',').map(Number).filter(n => !isNaN(n));
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        for (let j = i; j < arr.length; j++) {
          sum += arr[j];
          if (sum === (j - i + 1)) count++;
        }
      }
      return { count };
    } else if (activeProblem === 'graph') {
      const arr = inputs.arr.split(',').map(Number).filter(n => !isNaN(n));
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      let edges = 0;
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (gcd(arr[i], arr[j]) > 1) edges++;
        }
      }
      return { edges };
    } else if (activeProblem === 'atleast') {
      const arr = inputs.arr.split(',').map(Number).filter(n => !isNaN(n));
      const k = Number(inputs.k);
      return { found: arr.includes(k) };
    }
    return null;
  }, [activeProblem, inputs]);

  const stopSimulation = () => {
    setIsSimulating(false);
    if (simulationRef.current) clearTimeout(simulationRef.current);
  };

  const resetSimulation = () => {
    if (soundEnabled) playSound('click');
    stopSimulation();
    setSimStep(0);
    setSimPhase('idle');
    setGameStarted(false);
    setWaitingForAction(false);
    setActionPrompt('');
    setExplanation('Ready to learn? Press Start!');
    setThinking('We will solve this step-by-step to understand the logic.');
    if (activeProblem === 'snail') {
      setCurrentVal(Number(inputs.n));
      mainControls.set({ y: '100%', rotate: 0, scale: 1 });
    } else if (activeProblem === 'exam') {
      setCurrentVal(0);
      mainControls.set({ scale: 1, y: 0 });
    } else if (activeProblem === 'icecream') {
      setCurrentVal(Number(inputs.x));
      mainControls.set({ scale: 1, opacity: 1 });
    } else {
      setCurrentVal(0);
      mainControls.set({ scale: 1, opacity: 1, x: 0, y: 0 });
    }
  };

  const handlePlayerAction = async (action: 'next' | 'climb' | 'collect') => {
    if (!waitingForAction) return;
    
    setWaitingForAction(false);
    if (soundEnabled) playSound('click');
    
    // Continue the game based on the action
    if (activeProblem === 'snail') {
      continueSnailGame();
    } else if (activeProblem === 'exam') {
      continueExamGame();
    } else if (activeProblem === 'icecream') {
      continueIceCreamGame();
    }
  };

  let snailPos = 0;
  let snailStep = 0;
  let examTotal = 0;
  let examHour = 0;
  let iceCreamLeft = 0;
  let iceCreamMinute = 0;

  const continueSnailGame = async () => {
    const n = Number(inputs.n), a = Number(inputs.a), b = Number(inputs.b);
    snailStep++;
    setSimStep(snailStep);
    
    if (soundEnabled) playSound('climb');
    setExplanation(`Day ${snailStep}: You helped the snail climb ${a}m!`);
    setThinking(`Great job! The snail climbed ${a}m up.`);
    snailPos = Math.max(0, snailPos - a);
    setCurrentVal(snailPos);
    await mainControls.start({ y: `${(snailPos / n) * 100}%`, rotate: -15, scale: 1.2 });
    
    if (snailPos <= 0) {
      setExplanation(`🎉 YOU WON! Snail escaped in ${snailStep} days!`);
      setThinking(`Amazing! You helped the snail reach the top!`);
      setSimPhase('finished');
      setIsSimulating(false);
      setGameStarted(false);
      if (soundEnabled) playSound('win');
      unlockNextLevel();
      await mainControls.start({ scale: [1.2, 2, 1.5], rotate: [0, 20, -20, 0] });
      return;
    }
    
    await new Promise(r => setTimeout(r, 1000));
    if (soundEnabled) playSound('slide');
    setExplanation(`Oh no! Snail slides back ${b}m at night...`);
    setThinking(`The snail needs to rest. It slides back ${b}m.`);
    snailPos = snailPos + b;
    setCurrentVal(snailPos);
    await mainControls.start({ y: `${(snailPos / n) * 100}%`, rotate: 15, scale: 0.9 });
    
    await new Promise(r => setTimeout(r, 1000));
    setExplanation(`Day ${snailStep} complete! Net progress: ${a - b}m`);
    setThinking(`Click "Help Climb!" to continue the next day!`);
    setActionPrompt('Click to help the snail climb again!');
    setWaitingForAction(true);
  };

  const continueExamGame = async () => {
    const n = Number(inputs.n), m = Number(inputs.m), a = Number(inputs.a);
    examHour++;
    setSimStep(examHour);
    
    setExplanation(`Hour ${examHour}: You collected ${a} pages!`);
    setThinking(`Great! You're working hard to collect pages.`);
    examTotal += a;
    setCurrentVal(examTotal);
    if (soundEnabled) playSound('climb');
    await mainControls.start({ x: (examHour - 1) * 20, scale: [1, 1.2, 1], transition: { duration: 0.5 } });
    
    setExplanation(`Total in bag: ${examTotal} pages`);
    setThinking(`You have ${examTotal} pages. Need ${m} pages total.`);
    
    if (examTotal >= m) {
      setExplanation(`🎉 YOU WIN! You have enough pages for the exam!`);
      setThinking(`Success! ${examTotal} pages is enough!`);
      setSimPhase('finished');
      setIsSimulating(false);
      setGameStarted(false);
      if (soundEnabled) playSound('win');
      unlockNextLevel();
      return;
    }
    
    if (examHour >= n) {
      setExplanation(`⏰ Time's up! Only ${examTotal} pages. Need ${m}.`);
      setThinking(`Not enough time. Try adjusting the numbers!`);
      setSimPhase('finished');
      setIsSimulating(false);
      setGameStarted(false);
      return;
    }
    
    await new Promise(r => setTimeout(r, 1000));
    setActionPrompt('Click to collect more pages!');
    setWaitingForAction(true);
  };

  const continueIceCreamGame = async () => {
    const x = Number(inputs.x), y = Number(inputs.y), n = Number(inputs.n);
    iceCreamMinute++;
    setSimStep(iceCreamMinute);
    
    setExplanation(`Minute ${iceCreamMinute}: ${y}g melted...`);
    setThinking(`The sun is hot! Ice cream is melting.`);
    iceCreamLeft = Math.max(0, iceCreamLeft - y);
    setCurrentVal(iceCreamLeft);
    if (soundEnabled) playSound('slide');
    await mainControls.start({ scale: iceCreamLeft / x, opacity: 0.5 + (iceCreamLeft / x) * 0.5 });
    
    setExplanation(`Remaining: ${iceCreamLeft.toFixed(0)}g`);
    setThinking(`You have ${iceCreamLeft}g left.`);
    
    if (iceCreamLeft <= 0) {
      setExplanation(`😢 All melted! 0g left.`);
      setThinking(`The ice cream is gone! Try eating it faster next time!`);
      setSimPhase('finished');
      setIsSimulating(false);
      setGameStarted(false);
      if (soundEnabled) playSound('win');
      unlockNextLevel();
      return;
    }
    
    if (iceCreamMinute >= n) {
      setExplanation(`🎉 You saved ${iceCreamLeft}g of ice cream!`);
      setThinking(`Good job! You still have some ice cream left!`);
      setSimPhase('finished');
      setIsSimulating(false);
      setGameStarted(false);
      if (soundEnabled) playSound('win');
      unlockNextLevel();
      return;
    }
    
    await new Promise(r => setTimeout(r, 1000));
    setActionPrompt('Click to see the next minute!');
    setWaitingForAction(true);
  };

  const unlockNextLevel = () => {
    const nextLevel = currentProblemDef.level + 1;
    if (nextLevel > unlockedLevel && nextLevel <= PROBLEMS.length) {
      setUnlockedLevel(nextLevel);
      localStorage.setItem('unlockedLevel', nextLevel.toString());
    }
  };

  const startSimulation = async () => {
    if (soundEnabled) playSound('click');
    
    if (gameStarted) {
      // Reset if already playing
      resetSimulation();
      return;
    }

    setGameStarted(true);
    setIsSimulating(true);
    setSimPhase('active');
    
    // Initialize game variables
    if (activeProblem === 'snail') {
      const n = Number(inputs.n), a = Number(inputs.a), b = Number(inputs.b);
      if (isNaN(n) || isNaN(a) || isNaN(b) || a <= b) return;
      snailPos = n;
      snailStep = 0;
      setExplanation(`Help the snail escape from a ${n}m deep hole!`);
      setThinking(`The snail can climb ${a}m up but slides ${b}m down each night.`);
      setActionPrompt('Click "Help Climb!" to start!');
      setWaitingForAction(true);
    } else if (activeProblem === 'exam') {
      const n = Number(inputs.n), m = Number(inputs.m), a = Number(inputs.a);
      if (isNaN(n) || isNaN(m) || isNaN(a)) return;
      examTotal = 0;
      examHour = 0;
      setExplanation(`Collect ${m} pages in ${n} hours for the exam!`);
      setThinking(`You can collect ${a} pages per hour. Let's start!`);
      setActionPrompt('Click "Collect Pages!" to begin!');
      setWaitingForAction(true);
    } else if (activeProblem === 'icecream') {
      const x = Number(inputs.x), y = Number(inputs.y), n = Number(inputs.n);
      if (isNaN(x) || isNaN(y) || isNaN(n)) return;
      iceCreamLeft = x;
      iceCreamMinute = 0;
      setExplanation(`You have ${x}g of ice cream! It melts ${y}g per minute.`);
      setThinking(`Watch your ice cream for ${n} minutes. Will it survive?`);
      setActionPrompt('Click "Next Minute!" to start!');
      setWaitingForAction(true);
    }
  };
    } else {
      // Generic simulation for new problems
      setIsSimulating(true);
      setSimPhase('active');
      for (let i = 1; i <= 5; i++) {
        setSimStep(i);
        if (soundEnabled) playSound('click');
        await mainControls.start({ rotate: i * 72, scale: 1.1 });
        await new Promise(r => setTimeout(r, 300));
      }
      setSimPhase('finished');
      setIsSimulating(false);
      if (soundEnabled) playSound('win');
      unlockNextLevel();
    }
  };

  useEffect(() => {
    resetSimulation();
  }, [activeProblem, inputs]);

  const handleInputChange = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className={`min-h-screen ${currentProblemDef.theme.bg} ${currentProblemDef.theme.text} font-sans selection:bg-yellow-200 overflow-hidden relative transition-colors duration-700`}>
      
      {/* Mode Switch Celebration */}
      <AnimatePresence>
        {showModeSwitch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-white"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                📖
              </motion.div>
              <span className="font-black text-lg">Story Mode Activated!</span>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorations */}
      <AnimatePresence mode="wait">
        {activeProblem === 'snail' && (
          <motion.div
            key="snail-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-10 left-10 text-white/40 animate-bounce duration-[3000ms]">
              <Cloud className="w-20 h-20" />
            </div>
            <div className="absolute top-20 right-20 text-yellow-400 animate-pulse">
              <Sun className="w-24 h-24" />
            </div>
            <div className="absolute bottom-10 right-10 text-white/40 animate-bounce duration-[4000ms]">
              <Cloud className="w-16 h-16" />
            </div>
          </motion.div>
        )}
        {activeProblem === 'exam' && (
          <motion.div
            key="exam-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-10 left-10 text-purple-300/40 animate-pulse duration-[2000ms]">
              <Star className="w-12 h-12 fill-current" />
            </div>
            <div className="absolute top-20 right-20 text-yellow-200 animate-pulse">
              <Moon className="w-24 h-24 fill-current" />
            </div>
            <div className="absolute bottom-20 left-1/4 text-purple-300/20 animate-bounce duration-[5000ms]">
              <Star className="w-8 h-8 fill-current" />
            </div>
          </motion.div>
        )}
        {activeProblem === 'icecream' && (
          <motion.div
            key="icecream-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-10 left-10 text-orange-300/40 animate-bounce duration-[3000ms]">
              <Sun className="w-20 h-20" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-blue-400/20">
              <Waves className="w-full h-32" />
            </div>
            <div className="absolute top-40 right-10 text-orange-200/40 animate-pulse">
              <Sparkles className="w-16 h-16" />
            </div>
          </motion.div>
        )}
        {activeProblem === 'mindist' && (
          <motion.div key="mindist-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute top-10 left-10 text-green-300/20 animate-pulse"><Layers className="w-32 h-32" /></div>
            <div className="absolute bottom-20 right-10 text-green-300/20 animate-bounce"><Star className="w-16 h-16" /></div>
          </motion.div>
        )}
        {activeProblem === 'maxmin' && (
          <motion.div key="maxmin-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute top-20 right-20 text-red-300/20 animate-pulse"><Activity className="w-32 h-32" /></div>
            <div className="absolute bottom-10 left-10 text-red-300/20 animate-bounce"><ArrowUp className="w-16 h-16" /></div>
          </motion.div>
        )}
        {activeProblem === 'goodsub' && (
          <motion.div key="goodsub-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute top-10 right-10 text-sky-300/20 animate-pulse"><Zap className="w-32 h-32" /></div>
            <div className="absolute bottom-20 left-20 text-sky-300/20 animate-bounce"><Cloud className="w-24 h-24" /></div>
          </motion.div>
        )}
        {activeProblem === 'graph' && (
          <motion.div key="graph-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 flex items-center justify-center text-zinc-300/10"><Share2 className="w-[40rem] h-[40rem]" /></div>
          </motion.div>
        )}
        {activeProblem === 'atleast' && (
          <motion.div key="atleast-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute top-20 left-1/4 text-yellow-300/20 animate-pulse"><Search className="w-32 h-32" /></div>
            <div className="absolute bottom-20 right-1/4 text-yellow-300/20 animate-bounce"><Star className="w-24 h-24" /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        
        {/* Floating Story Mode Button - Always Visible! */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
          className="fixed bottom-8 right-8 z-[60]"
        >
          <motion.button 
            onClick={handleStoryModeToggle}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              y: [0, -10, 0],
              boxShadow: storyMode 
                ? ['0 20px 40px rgba(168, 85, 247, 0.5)', '0 25px 50px rgba(236, 72, 153, 0.6)', '0 20px 40px rgba(168, 85, 247, 0.5)']
                : ['0 15px 30px rgba(147, 51, 234, 0.3)', '0 20px 40px rgba(147, 51, 234, 0.4)', '0 15px 30px rgba(147, 51, 234, 0.3)']
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
            className={`relative px-6 py-5 rounded-full border-4 shadow-2xl transition-all duration-300 flex items-center gap-3 ${
              storyMode 
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 border-purple-300' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400'
            }`}
          >
            {/* Icon with animation */}
            <motion.div
              animate={{ 
                rotate: [0, -15, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <MessageCircle className="w-10 h-10 text-white drop-shadow-lg" strokeWidth={2.5} />
            </motion.div>
            
            {/* Text - Hidden on small screens */}
            <div className="hidden md:block text-left">
              <div className="text-lg font-black text-white drop-shadow-md">
                {storyMode ? 'Story ON' : 'Story Mode'}
              </div>
              <div className="text-xs font-bold text-white/90">
                {storyMode ? 'Tap to exit' : 'Tap to start!'}
              </div>
            </div>
            
            {/* Sparkle effect */}
            {!storyMode && (
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 text-3xl drop-shadow-lg"
              >
                ✨
              </motion.div>
            )}
            
            {/* Active indicator */}
            {storyMode && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
              >
                <span className="text-lg font-black text-white">✓</span>
              </motion.div>
            )}

            {/* Pulsing ring effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 rounded-full border-4 ${storyMode ? 'border-purple-300' : 'border-pink-400'}`}
            />
          </motion.button>
        </motion.div>

        {/* Header */}
        <header className="mb-10 text-center relative">
          
          {/* Sound button - top right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-0 right-0"
          >
            <motion.button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-2xl bg-white border-4 border-purple-100 shadow-lg hover:border-purple-300 hover:shadow-xl transition-all duration-300"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6 text-purple-600" /> : <VolumeX className="w-6 h-6 text-zinc-400" />}
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-lg mb-6"
          >
            <Gamepad2 className="w-6 h-6 text-yellow-900" />
            <span className="text-sm font-black uppercase tracking-widest text-yellow-900">CodeChef Learning Games!</span>
          </motion.div>
          <h1 className={`text-5xl md:text-7xl font-black tracking-tight ${currentProblemDef.theme.text} mb-4 drop-shadow-sm`}>
            {currentProblemDef.title} {currentProblemDef.emoji}
          </h1>
          <p className={`text-xl ${currentProblemDef.theme.text} opacity-70 font-bold max-w-2xl mx-auto`}>
            {currentProblemDef.description}
          </p>
        </header>

        {/* Problem Switcher */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {PROBLEMS.map((p) => {
            const isLocked = p.level > unlockedLevel;
            return (
              <motion.button
                key={p.id}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (!isLocked) {
                    setActiveProblem(p.id);
                    resetSimulation();
                  }
                }}
                className={`px-6 py-4 rounded-[2rem] border-4 font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 ${
                  isLocked 
                  ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed grayscale'
                  : activeProblem === p.id 
                    ? `${p.theme.accent} text-white border-white/20` 
                    : 'bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300'
                }`}
              >
                <span className="text-2xl">{isLocked ? <Lock className="w-6 h-6" /> : p.emoji}</span>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] opacity-50">Level {p.level}</span>
                  <span>{p.title}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: The Game World */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {storyMode ? (
                <motion.section 
                  key="story-mode"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  className={`bg-white rounded-[3rem] p-8 shadow-2xl border-8 ${currentProblemDef.theme.border} relative overflow-hidden flex-1 min-h-[650px]`}
                >
                  <StoryMode problemId={activeProblem} soundEnabled={soundEnabled} />
                </motion.section>
              ) : (
                <motion.section 
                  key="game-mode"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  className={`bg-white rounded-[3rem] p-8 shadow-2xl border-8 ${currentProblemDef.theme.border} relative overflow-hidden flex-1 flex flex-col gap-10 min-h-[650px]`}
                >
              
              {/* Pedagogy Header: Given & Find */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> What is GIVEN?
                  </h4>
                  <ul className="space-y-1">
                    {currentProblemDef.given.map((g, i) => (
                      <li key={i} className="text-sm font-bold text-blue-900 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
                  <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" /> What to FIND?
                  </h4>
                  <p className="text-sm font-bold text-purple-900">
                    {currentProblemDef.find}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-10 flex-1">
                {/* Visualization Section */}
                <div className={`relative w-full md:w-64 h-64 md:h-full bg-stone-100 rounded-[2rem] border-x-[16px] border-stone-200 overflow-hidden shrink-0 shadow-inner flex flex-col items-center transition-colors duration-500`}>
                  {activeProblem === 'snail' && (
                  <>
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#5D4037 2px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-green-500 to-transparent z-20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white/50 animate-pulse" />
                    </div>
                    <motion.div 
                      animate={mainControls}
                      initial={{ y: '100%' }}
                      className="absolute left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center z-30"
                      style={{ bottom: 0 }}
                    >
                      <div className="relative">
                        <AnimatePresence mode="wait">
                          {simPhase === 'active' && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: -60, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-2xl shadow-xl border-2 border-blue-100 whitespace-nowrap z-50"
                            >
                              <span className="text-xs font-black text-blue-600">
                                Day {simStep}: Up {inputs.a}m, Down {inputs.b}m!
                              </span>
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-blue-100 rotate-45" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.span 
                          className="text-7xl drop-shadow-2xl block"
                          animate={simPhase === 'idle' ? { y: [0, -8, 0], rotate: [0, 3, -3, 0] } : {}}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          🐌
                        </motion.span>
                      </div>
                    </motion.div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-stone-300 z-20 flex items-center justify-center">
                      <p className="text-[10px] font-black text-stone-600 uppercase tracking-tight px-2 text-center">
                        {explanation}
                      </p>
                    </div>
                  </>
                )}

                {activeProblem === 'exam' && (
                  <>
                    <div className="absolute inset-0 opacity-5 pointer-events-none" 
                         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="h-full w-full flex flex-col items-center justify-between py-6 px-4 relative z-10">
                      
                      {/* Hour Path */}
                      <div className="w-full flex justify-center gap-1">
                        {[...Array(Number(inputs.n))].map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${i < simStep ? 'bg-purple-500 border-purple-600 text-white' : 'bg-white border-zinc-200 text-zinc-300'}`}>
                              {i + 1}
                            </div>
                            <div className="w-0.5 h-2 bg-zinc-200" />
                          </div>
                        ))}
                      </div>

                      {/* The Bag Analogy */}
                      <div className="relative flex flex-col items-center">
                        <motion.div 
                          animate={mainControls}
                          className="text-7xl drop-shadow-xl relative"
                        >
                          🎒
                          {/* The Bag */}
                          <motion.div 
                            animate={{ scale: 1 + (currentVal * 0.05) }}
                            className="absolute -right-4 bottom-0 w-12 h-12 bg-amber-700 rounded-b-2xl rounded-t-lg border-2 border-amber-900 flex flex-wrap gap-0.5 p-1 items-end justify-center overflow-hidden shadow-lg"
                          >
                            {[...Array(Math.min(15, currentVal))].map((_, i) => (
                              <div key={i} className="w-2 h-3 bg-white border border-zinc-300 rounded-sm" />
                            ))}
                            {currentVal > 15 && <span className="text-[8px] text-white font-black">+{currentVal-15}</span>}
                          </motion.div>
                        </motion.div>
                        <span className="mt-4 text-[10px] font-black text-purple-900/40 uppercase tracking-widest">Collecting Pages...</span>
                      </div>

                      {/* The Scale (Goal) */}
                      <div className="w-full space-y-4">
                        <div className="bg-white/90 p-4 rounded-[2rem] border-4 border-purple-100 shadow-xl relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-purple-400 uppercase">In the Bag: {currentVal}</span>
                            <span className="text-[10px] font-black text-purple-400 uppercase">Need: {inputs.m}</span>
                          </div>
                          <div className="h-6 w-full bg-zinc-100 rounded-full overflow-hidden border-2 border-zinc-200 relative">
                            <motion.div 
                              animate={{ width: `${Math.min(100, (currentVal / Number(inputs.m)) * 100)}%` }}
                              className={`h-full transition-colors duration-500 ${currentVal >= Number(inputs.m) ? 'bg-green-500' : 'bg-purple-500'}`}
                            />
                            {/* Goal Line */}
                            <div className="absolute top-0 bottom-0 w-1 bg-red-500 left-[100%] -translate-x-full shadow-sm" />
                          </div>
                          
                          <div className="mt-4 text-center">
                            <p className="text-xs font-black text-purple-600 uppercase leading-tight">
                              {explanation}
                            </p>
                          </div>
                        </div>

                        {/* Pedagogy Hint */}
                        <div className="flex justify-center gap-2">
                          {[...Array(Number(inputs.n))].map((_, i) => (
                            <div key={i} className={`px-2 py-1 rounded-md text-[10px] font-black ${i < simStep ? 'bg-purple-100 text-purple-600' : 'bg-zinc-50 text-zinc-300'}`}>
                              {i < simStep ? `+${inputs.a}` : '?'}
                            </div>
                          ))}
                          <span className="text-[10px] font-black text-zinc-400">= {currentVal}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeProblem === 'icecream' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-orange-100 opacity-50" />
                    <div className="h-full w-full flex flex-col items-center justify-between py-6 px-4 relative z-10">
                      {/* Ice Cream Pile */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-orange-900/40 uppercase tracking-widest">Ice Cream Pot</span>
                        <div className="flex gap-1 flex-wrap justify-center max-w-[140px] bg-white/40 p-2 rounded-xl border-2 border-orange-100">
                          {[...Array(Math.max(0, Math.floor(currentVal)))].map((_, i) => (
                            <motion.div 
                              layout
                              key={i} 
                              className="w-4 h-4 bg-orange-200 rounded-full border border-orange-300 shadow-sm" 
                            />
                          ))}
                          {currentVal <= 0 && <span className="text-[10px] font-black text-red-400">EMPTY!</span>}
                        </div>
                      </div>

                      <motion.div 
                        animate={mainControls}
                        className="relative"
                      >
                        <span className="text-9xl drop-shadow-xl">🍦</span>
                        <AnimatePresence>
                          {simPhase === 'active' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1, y: [0, 50] }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-blue-400 text-4xl"
                            >
                              💧
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <div className="w-full space-y-4">
                        <div className="h-8 w-full bg-zinc-100 rounded-xl overflow-hidden border-2 border-zinc-200 relative">
                          <motion.div 
                            animate={{ width: `${(currentVal / Number(inputs.x)) * 100}%` }}
                            className="h-full bg-orange-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black text-white mix-blend-difference uppercase tracking-widest">
                              Left: {currentVal.toFixed(0)}g / {inputs.x}g
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/80 p-3 rounded-2xl border-2 border-orange-100 text-center shadow-sm">
                          <p className="text-xs font-black text-orange-600 uppercase tracking-tight">
                            {explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeProblem === 'mindist' && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-4 gap-4">
                    <motion.div animate={mainControls} className="text-8xl">💎</motion.div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {inputs.arr.split(',').map((item, i) => (
                        <motion.div 
                          key={i}
                          animate={simPhase === 'active' ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                          className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center font-black text-green-800 border-2 border-green-400"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeProblem === 'maxmin' && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-4 gap-4">
                    <motion.div animate={mainControls} className="text-8xl">⛰️</motion.div>
                    <div className="w-full h-32 flex items-end justify-center gap-1">
                      {inputs.arr.split(',').map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(Number(h) / Math.max(...inputs.arr.split(',').map(Number), 1)) * 100}%` }}
                          className="flex-1 bg-red-400 rounded-t-lg border-x-2 border-red-600"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeProblem === 'goodsub' && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-4 gap-4">
                    <motion.div animate={mainControls} className="text-8xl">🚂</motion.div>
                    <div className="flex gap-2">
                      {inputs.arr.split(',').map((w, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-10 h-8 bg-sky-400 rounded-lg border-2 border-sky-600 flex items-center justify-center font-black text-white text-xs">
                            {w}
                          </div>
                          <div className="w-1 h-2 bg-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeProblem === 'graph' && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-4">
                    <motion.div animate={mainControls} className="relative w-full h-full flex items-center justify-center">
                      <Share2 className="w-32 h-32 text-zinc-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-8">
                          {inputs.arr.split(',').map((v, i) => (
                            <div key={i} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white font-black text-xs">
                              {v}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {activeProblem === 'atleast' && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-4 gap-8">
                    <motion.div animate={mainControls} className="text-8xl relative">
                      🎯
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-4 border-yellow-400 rounded-full"
                      />
                    </motion.div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {inputs.arr.split(',').map((v, i) => (
                        <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center font-black border-2 ${v === inputs.k ? 'bg-yellow-400 border-yellow-600 text-yellow-900' : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}>
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Game Controls */}
              <div className="flex-1 flex flex-col justify-between py-4">
                <div className="space-y-6">
                  {/* Thinking Box */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-amber-50 p-6 rounded-[2rem] border-4 border-amber-100 shadow-sm relative"
                  >
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-50 border-l-4 border-b-4 border-amber-100 rotate-45 hidden md:block" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Thinking Box
                    </h4>
                    <p className="text-sm font-bold text-amber-900 leading-relaxed italic">
                      "{thinking || 'Ready to start the thinking process?'}"
                    </p>
                    <div className="mt-4 pt-4 border-t border-amber-100">
                      <span className="text-[10px] font-black uppercase text-amber-400">Concept: {currentProblemDef.concept}</span>
                    </div>
                  </motion.div>

                  {simPhase === 'finished' && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -20, y: -20 }} 
                      animate={{ scale: 1, rotate: 0, y: 0 }} 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-6 rounded-3xl font-black text-xl shadow-2xl border-4 border-yellow-500 text-center mb-6"
                    >
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8" />
                        <span>Concept Mastered!</span>
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-bold opacity-90">
                        {activeProblem === 'exam' ? (result?.success ? '🎓 Ready for the exam!' : '💪 Keep practicing!') : '✨ You got it!'}
                      </div>
                    </motion.div>
                  )}

                  {/* Progress Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <Timer className="w-8 h-8 text-white/80" />
                          {isSimulating && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-3 h-3 bg-green-400 rounded-full"
                            />
                          )}
                        </div>
                        <div className="text-5xl font-black text-white mb-1">{simStep}</div>
                        <div className="text-xs font-bold text-white/70 uppercase tracking-wider">
                          {activeProblem === 'snail' ? 'Days' : 
                           activeProblem === 'exam' ? 'Hours' : 
                           activeProblem === 'icecream' ? 'Minutes' : 'Steps'}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          {activeProblem === 'snail' ? <ArrowUp className="w-8 h-8 text-white/80" /> : 
                           activeProblem === 'exam' ? <BookOpen className="w-8 h-8 text-white/80" /> : 
                           activeProblem === 'icecream' ? <IceCream className="w-8 h-8 text-white/80" /> :
                           <Zap className="w-8 h-8 text-white/80" />}
                          {simPhase === 'finished' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: 360 }}
                              className="text-2xl"
                            >
                              ✅
                            </motion.div>
                          )}
                        </div>
                        <div className="text-5xl font-black text-white mb-1">
                          {activeProblem === 'snail' ? Math.max(0, Number(inputs.n) - currentVal).toFixed(0) : 
                           activeProblem === 'mindist' || activeProblem === 'maxmin' || activeProblem === 'goodsub' || activeProblem === 'graph' || activeProblem === 'atleast' ? '?' :
                           currentVal.toFixed(0)}
                        </div>
                        <div className="text-xs font-bold text-white/70 uppercase tracking-wider">
                          {activeProblem === 'snail' ? 'Height' : 
                           activeProblem === 'exam' ? 'Pages' : 
                           activeProblem === 'icecream' ? 'Grams' : 'Value'}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className={`p-6 rounded-[2rem] border-4 transition-all duration-500 ${
                    simPhase === 'active' ? 'bg-green-100 border-green-200' : 
                    simPhase === 'finished' ? 'bg-yellow-100 border-yellow-200' : 'bg-zinc-50 border-zinc-100'
                  }`}>
                    <p className={`text-lg font-black ${currentProblemDef.theme.text} text-center`}>
                      {simPhase === 'idle' ? "🎮 Ready to Play?" : 
                       simPhase === 'active' ? "🚀 Watch it happen!" : 
                       "🎉 Level Complete!"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-8">
                  {/* Action Button - appears when waiting for player */}
                  <AnimatePresence>
                    {waitingForAction && (
                      <motion.button
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayerAction('next')}
                        className="w-full flex items-center justify-center gap-3 py-8 rounded-[2rem] text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-2xl border-b-8 border-orange-600 hover:from-yellow-500 hover:to-orange-500 animate-pulse"
                      >
                        <Zap className="w-8 h-8" />
                        {activeProblem === 'snail' ? '🐌 Help Climb!' :
                         activeProblem === 'exam' ? '📚 Collect Pages!' :
                         activeProblem === 'icecream' ? '⏱️ Next Minute!' : 'Continue!'}
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Start/Reset Buttons */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startSimulation}
                      disabled={!!result && 'error' in result}
                      className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] text-xl font-black uppercase tracking-widest transition-all shadow-xl border-b-8 ${
                        gameStarted 
                        ? 'bg-red-500 text-white border-red-700 hover:bg-red-400' 
                        : 'bg-green-500 text-white border-green-700 hover:bg-green-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {gameStarted ? <RotateCcw className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      {gameStarted ? '🔄 Restart' : '🎮 Start Game!'}
                    </motion.button>
                    {gameStarted && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetSimulation}
                        className="p-6 rounded-[2rem] bg-white border-4 border-zinc-100 text-zinc-300 hover:text-zinc-500 hover:border-zinc-300 transition-all shadow-lg"
                      >
                        <XCircle className="w-8 h-8" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Settings & Big Result */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Result Card - Gamified */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={JSON.stringify(result) + activeProblem}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-[3rem] p-10 border-8 border-yellow-500 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center text-center"
                >
                  {/* Animated background elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10"
                  >
                    <Sparkles className="absolute top-10 right-10 w-24 h-24" />
                    <Star className="absolute bottom-10 left-10 w-32 h-32" />
                    <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40" />
                  </motion.div>

                  {'error' in result ? (
                    <div className="text-yellow-900 relative z-10">
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <AlertCircle className="w-20 h-20 mx-auto mb-6" />
                      </motion.div>
                      <h3 className="text-3xl font-black mb-4">Oops!</h3>
                      <p className="font-bold leading-relaxed text-lg">{result.error}</p>
                    </div>
                  ) : (
                    <div className="relative z-10 space-y-6">
                      {/* Main Result */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <div className="text-7xl mb-4">
                          {activeProblem === 'exam' && result.success ? '🎓' :
                           activeProblem === 'exam' && !result.success ? '💪' :
                           activeProblem === 'snail' ? '🐌' :
                           activeProblem === 'icecream' ? '🍦' : '⭐'}
                        </div>
                        <div className="text-6xl font-black leading-none text-white drop-shadow-2xl mb-2">
                          {activeProblem === 'snail' ? result.operations : 
                           activeProblem === 'exam' ? (result.success ? 'READY!' : 'TRY AGAIN') : 
                           activeProblem === 'icecream' ? `${result.left}g` :
                           activeProblem === 'mindist' ? result.ops :
                           activeProblem === 'maxmin' ? result.diff :
                           activeProblem === 'goodsub' ? result.count :
                           activeProblem === 'graph' ? result.edges :
                           (result.found ? 'FOUND!' : 'KEEP LOOKING')}
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-white/80">
                          {activeProblem === 'snail' ? 'Days to Escape' : 
                           activeProblem === 'exam' ? 'Exam Status' : 
                           activeProblem === 'icecream' ? 'Remaining' :
                           activeProblem === 'mindist' ? 'Swaps Needed' :
                           activeProblem === 'maxmin' ? 'Range' :
                           activeProblem === 'goodsub' ? 'Good Subarrays' :
                           activeProblem === 'graph' ? 'Connections' :
                           'Search Result'}
                        </span>
                      </motion.div>
                      
                      {/* Star Rating */}
                      {simPhase === 'finished' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex justify-center gap-2"
                        >
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                            >
                              <Star className="w-10 h-10 text-white fill-white drop-shadow-lg" />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Quick Explanation */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/30"
                      >
                        <div className="text-base font-bold text-white leading-relaxed">
                          {activeProblem === 'snail' ? (
                            `Climbs ${inputs.a}m, slides ${inputs.b}m = ${Number(inputs.a) - Number(inputs.b)}m progress per day!`
                          ) : 
                           activeProblem === 'exam' ? (
                             result.success ? 
                             `${inputs.a} × ${inputs.n} = ${Number(inputs.a) * Number(inputs.n)} pages. You're ready! 🎉` :
                             `${inputs.a} × ${inputs.n} = ${Number(inputs.a) * Number(inputs.n)} pages. Need ${inputs.m}!`
                           ) : 
                           activeProblem === 'icecream' ? (
                             `Started with ${inputs.x}g, melted ${inputs.y}g × ${inputs.n} minutes!`
                           ) :
                           'Great job! 🎉'}
                        </div>
                      </motion.div>

                      {/* Next Level Unlock */}
                      {simPhase === 'finished' && currentProblemDef.level < PROBLEMS.length && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 }}
                          className="bg-green-500 text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl border-4 border-green-600"
                        >
                          <Unlock className="w-6 h-6 inline-block mr-2" />
                          Next Level Unlocked!
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Learn More Section */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-[2rem] p-6 border-4 ${currentProblemDef.theme.border} shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className={`w-6 h-6 ${currentProblemDef.theme.text.replace('text-', 'text-')}`} />
                <h3 className={`font-black ${currentProblemDef.theme.text} uppercase tracking-widest`}>Learn This Problem</h3>
              </div>
              <p className={`text-xs ${currentProblemDef.theme.text} opacity-60 font-bold mb-4`}>
                This game is based on a real CodeChef challenge. Want to see the problem statement?
              </p>
              <a 
                href={currentProblemDef.link}
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-3 ${currentProblemDef.theme.accent} text-white rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all shadow-md border-b-4 border-black/20`}
              >
                CodeChef Challenge <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>

            {/* Settings Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowSettings(!showSettings)}
              className={`bg-white rounded-[2rem] p-6 border-4 ${currentProblemDef.theme.border} shadow-lg flex items-center justify-between group`}
            >
              <div className="flex items-center gap-3">
                <Settings2 className={`w-6 h-6 ${currentProblemDef.theme.text.replace('text-', 'text-')} opacity-40 group-hover:rotate-90 transition-transform duration-500`} />
                <span className={`font-black ${currentProblemDef.theme.text} uppercase tracking-widest`}>Change the Game</span>
              </div>
              <div className={`w-4 h-4 rounded-full ${showSettings ? 'bg-green-400' : 'bg-zinc-100'}`} />
            </motion.button>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.section
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`bg-white rounded-[3rem] p-8 border-4 ${currentProblemDef.theme.border} shadow-xl space-y-6 overflow-hidden`}
                >
                  <div className="space-y-4">
                    {currentProblemDef.inputs.map((input) => (
                      <div key={input.key} className="space-y-2">
                        <label className={`text-xs font-black uppercase tracking-widest text-${input.color}-400 ml-2`}>
                          {input.label}
                        </label>
                        <div className="relative">
                          <input
                            type={input.key === 'arr' ? 'text' : 'number'}
                            value={inputs[input.key] || input.default}
                            onChange={(e) => handleInputChange(input.key, e.target.value)}
                            className={`w-full px-6 py-4 bg-${input.color}-50 border-4 border-${input.color}-100 rounded-2xl focus:outline-none focus:border-${input.color}-400 transition-all font-black text-2xl text-${input.color}-900`}
                          />
                          <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-black text-${input.color}-300`}>
                            {input.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

        </div>

        <footer className={`mt-16 pt-12 border-t ${currentProblemDef.theme.border} flex flex-col items-center gap-10`}>
          <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-between">
            <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/50 border-4 border-white shadow-sm">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <span className={`text-sm font-black ${currentProblemDef.theme.text} opacity-50 uppercase tracking-widest`}>Made for Fun!</span>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex flex-col items-center md:items-end gap-1">
                <span className={`text-[10px] font-black ${currentProblemDef.theme.text} opacity-40 uppercase tracking-[0.2em]`}>A Project by</span>
                <span className={`text-xs font-black ${currentProblemDef.theme.text} opacity-70 uppercase tracking-widest`}>AI Learning Labs @ Navgurukul</span>
              </div>
              <div className="flex flex-col items-center md:items-end gap-1">
                <span className={`text-[10px] font-black ${currentProblemDef.theme.text} opacity-40 uppercase tracking-[0.2em]`}>In Partnership with</span>
                <span className={`text-xs font-black ${currentProblemDef.theme.text} opacity-70 uppercase tracking-widest`}>Anish Jadav Memorial Foundation</span>
              </div>
            </div>
          </div>

          <p className={`text-[10px] font-black ${currentProblemDef.theme.text} opacity-20 uppercase tracking-[0.4em] pb-10`}>
            &copy; 2026 Navgurukul
          </p>
        </footer>
      </div>
    </div>
  );
}
