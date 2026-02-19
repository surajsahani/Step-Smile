import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Play, CheckCircle, ArrowRight, Lightbulb, ExternalLink } from 'lucide-react';

interface SolutionWalkthroughProps {
  problemId: string;
  language: 'english' | 'hindi';
  onComplete: () => void;
}

const SOLUTIONS: Record<string, {
  title: { english: string; hindi: string };
  steps: { english: string; hindi: string; code?: string }[];
  fullCode: string;
  codechefLink: string;
}> = {
  exam: {
    title: { english: 'How to Solve: Rush to Exam', hindi: 'कैसे हल करें: परीक्षा की जल्दी' },
    codechefLink: 'https://www.codechef.com/problems/RUSHTOEXAM',
    steps: [
      {
        english: '1. Read the problem: We have N hours, need M pages, can collect A pages per hour',
        hindi: '1. समस्या पढ़ें: हमारे पास N घंटे हैं, M पेज चाहिए, A पेज प्रति घंटा इकट्ठा कर सकते हैं'
      },
      {
        english: '2. The formula we learned: Total Pages = Pages per Hour × Hours',
        hindi: '2. हमने जो फॉर्मूला सीखा: कुल पेज = पेज प्रति घंटा × घंटे',
        code: 'total_pages = A × N'
      },
      {
        english: '3. Compare: Is total_pages >= M (pages needed)?',
        hindi: '3. तुलना करें: क्या total_pages >= M (जरूरी पेज)?',
        code: 'if total_pages >= M:\n    print("YES")\nelse:\n    print("NO")'
      },
      {
        english: '4. Example: N=3 hours, M=6 pages needed, A=2 pages/hour',
        hindi: '4. उदाहरण: N=3 घंटे, M=6 पेज चाहिए, A=2 पेज/घंटा'
      },
      {
        english: '5. Calculate: 2 × 3 = 6 pages. 6 >= 6? YES! ✓',
        hindi: '5. गणना: 2 × 3 = 6 पेज। 6 >= 6? हाँ! ✓'
      }
    ],
    fullCode: `# Read input
n, m, a = map(int, input().split())

# Calculate total pages we can collect
total_pages = a * n

# Check if we have enough
if total_pages >= m:
    print("YES")
else:
    print("NO")`
  },
  
  snail: {
    title: { english: 'How to Solve: Snail Escape', hindi: 'कैसे हल करें: घोंघे का पलायन' },
    codechefLink: 'https://www.codechef.com/problems/SUBAADDB',
    steps: [
      {
        english: '1. Read: N meters deep hole, climbs A meters up, slides B meters down',
        hindi: '1. पढ़ें: N मीटर गहरा गड्ढा, A मीटर ऊपर चढ़ता है, B मीटर नीचे फिसलता है'
      },
      {
        english: '2. Key insight: On the LAST day, snail reaches top and doesn\'t slide!',
        hindi: '2. मुख्य बात: आखिरी दिन, घोंघा ऊपर पहुंचता है और नहीं फिसलता!'
      },
      {
        english: '3. Net progress per day = A - B meters',
        hindi: '3. प्रति दिन शुद्ध प्रगति = A - B मीटर',
        code: 'net_progress = A - B'
      },
      {
        english: '4. Days needed = (N - A) ÷ net_progress + 1',
        hindi: '4. दिन चाहिए = (N - A) ÷ शुद्ध_प्रगति + 1',
        code: 'days = ((N - A) // (A - B)) + 1'
      },
      {
        english: '5. Example: N=10m, A=3m, B=2m → Net=1m/day → 8 days',
        hindi: '5. उदाहरण: N=10m, A=3m, B=2m → शुद्ध=1m/दिन → 8 दिन'
      }
    ],
    fullCode: `# Read input
n, a, b = map(int, input().split())

# Special cases
if n <= a:
    print(1)  # Reaches top on first day
elif a <= b:
    print(-1)  # Never escapes
else:
    # Calculate days needed
    days = ((n - a) // (a - b)) + 1
    print(days)`
  },
  
  icecream: {
    title: { english: 'How to Solve: Melting Ice Cream', hindi: 'कैसे हल करें: पिघलती आइसक्रीम' },
    codechefLink: 'https://www.codechef.com/problems/ICECREAMCONES',
    steps: [
      {
        english: '1. Read: X grams start, Y grams melt per minute, N minutes pass',
        hindi: '1. पढ़ें: X ग्राम शुरू, Y ग्राम प्रति मिनट पिघलता है, N मिनट बीतते हैं'
      },
      {
        english: '2. Formula: Total melted = Melt rate × Time',
        hindi: '2. फॉर्मूला: कुल पिघला = पिघलने की दर × समय',
        code: 'melted = Y × N'
      },
      {
        english: '3. Remaining = Start - Melted',
        hindi: '3. बचा हुआ = शुरुआत - पिघला',
        code: 'remaining = X - melted'
      },
      {
        english: '4. Important: Can\'t be negative! Use max(0, remaining)',
        hindi: '4. महत्वपूर्ण: नकारात्मक नहीं हो सकता! max(0, बचा_हुआ) उपयोग करें'
      },
      {
        english: '5. Example: X=5g, Y=1g/min, N=2min → 5 - (1×2) = 3g left',
        hindi: '5. उदाहरण: X=5g, Y=1g/min, N=2min → 5 - (1×2) = 3g बचा'
      }
    ],
    fullCode: `# Read input
x, y, n = map(int, input().split())

# Calculate melted amount
melted = y * n

# Calculate remaining (can't be negative)
remaining = max(0, x - melted)

print(remaining)`
  }
};

export default function SolutionWalkthrough({ problemId, language, onComplete }: SolutionWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCode, setShowCode] = useState(false);
  
  const solution = SOLUTIONS[problemId] || SOLUTIONS.exam;
  const isLastStep = currentStep >= solution.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setShowCode(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(solution.fullCode);
    alert(language === 'hindi' ? 'कोड कॉपी हो गया!' : 'Code copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-2xl border-8 border-green-400 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-10 h-10" />
            <h2 className="text-3xl font-black">
              {language === 'hindi' ? '💡 समाधान सीखें!' : '💡 Learn Solution!'}
            </h2>
          </div>
          <p className="text-sm opacity-90">
            {language === 'hindi' ? solution.title.hindi : solution.title.english}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          {!showCode ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Progress */}
                <div className="flex gap-2 mb-6">
                  {solution.steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        idx <= currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Step content */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-green-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-black text-xl shrink-0">
                      {currentStep + 1}
                    </div>
                    <p className="text-xl font-bold text-gray-800 leading-relaxed">
                      {language === 'hindi' 
                        ? solution.steps[currentStep].hindi 
                        : solution.steps[currentStep].english}
                    </p>
                  </div>

                  {/* Code snippet if available */}
                  {solution.steps[currentStep].code && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-gray-900 rounded-2xl p-6 overflow-x-auto"
                    >
                      <pre className="text-green-400 font-mono text-sm">
                        {solution.steps[currentStep].code}
                      </pre>
                    </motion.div>
                  )}
                </div>

                {/* Visual indicator */}
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block text-6xl"
                  >
                    {currentStep === 0 && '📖'}
                    {currentStep === 1 && '💡'}
                    {currentStep === 2 && '🧮'}
                    {currentStep === 3 && '✅'}
                    {currentStep === 4 && '🎉'}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Code className="w-6 h-6" />
                    {language === 'hindi' ? 'पूरा कोड' : 'Complete Code'}
                  </h3>
                  <button
                    onClick={copyCode}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {language === 'hindi' ? 'कॉपी करें' : 'Copy'}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-sm leading-relaxed">
                    {solution.fullCode}
                  </pre>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-3xl p-6 border-4 border-yellow-200">
                <p className="text-lg font-bold text-yellow-900 mb-4">
                  {language === 'hindi' 
                    ? '🎯 अब CodeChef पर जाकर सबमिट करें!'
                    : '🎯 Now submit on CodeChef!'}
                </p>
                <a
                  href={solution.codechefLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  {language === 'hindi' ? 'CodeChef पर खोलें' : 'Open on CodeChef'}
                </a>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t-4 border-green-200 p-4 flex justify-between gap-4">
          <div className="text-sm font-bold text-gray-600">
            {!showCode && (
              <>
                {language === 'hindi' ? 'कदम' : 'Step'} {currentStep + 1} / {solution.steps.length}
              </>
            )}
          </div>
          <div className="flex gap-3">
            {showCode ? (
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-black shadow-lg hover:from-green-600 hover:to-green-700 transition-all border-b-4 border-green-700 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {language === 'hindi' ? 'समझ गया!' : 'Got it!'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all border-b-4 border-blue-700 flex items-center gap-2"
              >
                {isLastStep ? (
                  <>
                    <Code className="w-5 h-5" />
                    {language === 'hindi' ? 'कोड दिखाएं' : 'Show Code'}
                  </>
                ) : (
                  <>
                    {language === 'hindi' ? 'अगला' : 'Next'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
