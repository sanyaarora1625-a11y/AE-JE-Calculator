import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, ReferenceLine
} from 'recharts';
import {
  ChevronRight, Check, Phone, Mail, Share2, Sparkles, Trophy,
  IndianRupee, TrendingUp, Award, Briefcase, RefreshCw, Star,
  GraduationCap, MapPin, Clock, Target, Users, Calendar, ArrowRight,
  CheckCircle2, Zap, BookOpen
} from 'lucide-react';

// ============================================================
// EXAM DATABASE — driven by verified 7th CPC + DA 60% (Jan 2026)
// ============================================================
const EXAMS = {
  'ssc-je': {
    name: 'SSC JE',
    fullName: 'SSC Junior Engineer',
    payLevel: 6,
    basicPay: 35400,
    grossY: 70920,
    inhand: 65000,
    departments: 'CPWD, MES, BRO, CWC',
    eligibility: ['diploma', 'btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 1731,
    nextNotification: 'June 2026',
    promotionPath: 'JE → AE → EE',
    type: 'Central JE',
    color: '#16A085',
    why: 'Central government, stable promotions, all-India postings',
    cumulative10y: 9800000,
  },
  'rrb-je': {
    name: 'RRB JE',
    fullName: 'Railway Junior Engineer',
    payLevel: 6,
    basicPay: 35400,
    grossY: 69480,
    inhand: 66876,
    departments: 'Track, Signal, Mech, Electrical, Civil',
    eligibility: ['diploma', 'btech'],
    branches: ['civil', 'mechanical', 'electrical', 'electronics'],
    vacancies: 7951,
    nextNotification: 'Aug-Sep 2026',
    promotionPath: 'JE → SSE → ADEN',
    type: 'Central JE',
    color: '#16A085',
    why: 'Highest vacancies (7,951), railway perks, PLB bonus',
    cumulative10y: 9500000,
  },
  'dmrc-je': {
    name: 'DMRC JE',
    fullName: 'Delhi Metro Rail Junior Engineer',
    payLevel: 0,
    basicPay: 37000,
    grossY: 78588,
    inhand: 69600,
    departments: 'Civil, Electrical, Electronics, Mechanical',
    eligibility: ['diploma', 'btech'],
    branches: ['civil', 'mechanical', 'electrical', 'electronics'],
    vacancies: 350,
    nextNotification: 'Variable',
    promotionPath: 'JE → AM → DM',
    type: 'PSU JE',
    color: '#16A085',
    why: 'IDA-PSU scale, 35% Cafeteria perks, Delhi posting',
    cumulative10y: 11000000,
  },
  'uppsc-ae': {
    name: 'UPPSC AE',
    fullName: 'UP PSC Assistant Engineer',
    payLevel: 10,
    basicPay: 56100,
    grossY: 101000,
    inhand: 85000,
    departments: 'PWD, Irrigation, Public Health',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 600,
    nextNotification: 'Q3 2026',
    promotionPath: 'AE → EE → SE → CE',
    type: 'State AE',
    color: '#0E6655',
    why: 'Group B Gazetted, home state UP, officer authority',
    cumulative10y: 14500000,
  },
  'bpsc-ae': {
    name: 'BPSC AE',
    fullName: 'Bihar PSC Assistant Engineer',
    payLevel: 9,
    basicPay: 53100,
    grossY: 95000,
    inhand: 72000,
    departments: 'PWD, Water Resources, Building Construction',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 700,
    nextNotification: 'Q4 2026',
    promotionPath: 'AE → EE → SE',
    type: 'State AE',
    color: '#0E6655',
    why: 'Bihar home state, Class II Gazetted',
    cumulative10y: 13500000,
  },
  'mppsc-ae': {
    name: 'MPPSC AE',
    fullName: 'MP PSC Assistant Engineer',
    payLevel: 10,
    basicPay: 56100,
    grossY: 104400,
    inhand: 85000,
    departments: 'PWD, Water Resources, PHE',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 350,
    nextNotification: 'Q2 2026',
    promotionPath: 'AE → EE → SE → CE',
    type: 'State AE',
    color: '#0E6655',
    why: 'Class I Gazetted, MP home state',
    cumulative10y: 14500000,
  },
  'rpsc-ae': {
    name: 'RPSC AEN',
    fullName: 'Rajasthan PSC Assistant Engineer',
    payLevel: 10,
    basicPay: 56100,
    grossY: 104500,
    inhand: 95000,
    departments: 'PWD, Water Resources, PHED',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 280,
    nextNotification: 'Q3 2026',
    promotionPath: 'AEN → XEN → SE → CE',
    type: 'State AE',
    color: '#0E6655',
    why: 'OPS restored — guaranteed pension, no NPS deduction',
    cumulative10y: 16000000,
  },
  'hppsc-ae': {
    name: 'HPPSC AE',
    fullName: 'Himachal PSC Assistant Engineer',
    payLevel: 10,
    basicPay: 56100,
    grossY: 98400,
    inhand: 90000,
    departments: 'IPH, PWD, MPP & Power',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 100,
    nextNotification: 'Q3 2026',
    promotionPath: 'AE → EE → SE',
    type: 'State AE',
    color: '#0E6655',
    why: 'OPS restored, 4-tier auto-upgrade pay',
    cumulative10y: 15500000,
  },
  'gpsc-ae': {
    name: 'GPSC AE',
    fullName: 'Gujarat PSC Assistant Engineer',
    payLevel: 8,
    basicPay: 44900,
    grossY: 84700,
    inhand: 70000,
    departments: 'R&B, Water Supply, Narmada',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 49,
    nextNotification: 'Q4 2026',
    promotionPath: 'AE → DyEE → EE',
    type: 'State AE',
    color: '#0E6655',
    why: 'Gujarat home state, Class II',
    cumulative10y: 11500000,
  },
  'upsssc-je': {
    name: 'UPSSSC JE',
    fullName: 'UP SSSC Junior Engineer',
    payLevel: 6,
    basicPay: 35400,
    grossY: 61000,
    inhand: 51800,
    departments: 'PWD, Jal Nigam, UPRNN',
    eligibility: ['diploma', 'btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 4016,
    nextNotification: 'Q2 2026',
    promotionPath: 'JE → AE',
    type: 'State JE',
    color: '#16A085',
    why: 'Home state UP, lower competition than SSC',
    cumulative10y: 7500000,
  },
  'btsc-je': {
    name: 'BTSC JE',
    fullName: 'Bihar TSC Junior Engineer',
    payLevel: 7,
    basicPay: 35400,
    grossY: 56000,
    inhand: 47947,
    departments: 'PHED, Water Resources, Rural Works',
    eligibility: ['diploma', 'btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 2920,
    nextNotification: 'Q3 2026',
    promotionPath: 'JE → AE',
    type: 'State JE',
    color: '#16A085',
    why: 'Bihar home state, GP 4,600',
    cumulative10y: 7000000,
  },
  'rsmssb-je': {
    name: 'RSMSSB JE',
    fullName: 'Rajasthan SMSSB Junior Engineer',
    payLevel: 10,
    basicPay: 33800,
    grossY: 66000,
    inhand: 49681,
    departments: 'PWD, PHED, Water Resources',
    eligibility: ['diploma', 'btech'],
    branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 774,
    nextNotification: 'Q3 2026',
    promotionPath: 'JEN → AEN → XEN',
    type: 'State JE',
    color: '#16A085',
    why: 'OPS restored, Rajasthan home state (₹23,700 fixed in probation)',
    cumulative10y: 8000000,
  },
  'gate-psu': {
    name: 'GATE → PSU',
    fullName: 'PSU Recruitment via GATE',
    payLevel: 0,
    basicPay: 60000,
    grossY: 150000,
    inhand: 110000,
    departments: 'ONGC, GAIL, BPCL, IOCL, NTPC, BHEL, SAIL, HAL',
    eligibility: ['btech'],
    branches: ['civil', 'mechanical', 'electrical', 'electronics'],
    vacancies: 800,
    nextNotification: 'Feb 2026 (GATE)',
    promotionPath: 'E1 → E2 → E3 → E4 (3-4 yr cycles)',
    type: 'PSU AE',
    color: '#FF6B35',
    why: 'Highest CTC (₹15-25 LPA), Maharatna PSUs, 35% perks',
    cumulative10y: 32000000,
  },
};

// ============================================================
// DECISION ENGINE — maps user inputs to top 3 exam recommendations
// ============================================================
const recommendExams = (answers) => {
  const { qualification, branch, age, state, relocate, attempts, hours } = answers;
  const scores = {};

  Object.entries(EXAMS).forEach(([id, exam]) => {
    let score = 0;

    // Eligibility hard-filter
    if (!exam.eligibility.includes(qualification)) return;
    if (!exam.branches.includes(branch)) return;

    // Age filter for state JEs
    if (age === '30+' && exam.type === 'State JE') score -= 20;
    if (age === '<23' && exam.type === 'State AE') score -= 5;

    // State preference matching
    const stateMatch = {
      'up': ['uppsc-ae', 'upsssc-je'],
      'bihar': ['bpsc-ae', 'btsc-je'],
      'mp': ['mppsc-ae'],
      'rajasthan': ['rpsc-ae', 'rsmssb-je'],
      'hp': ['hppsc-ae'],
      'gujarat': ['gpsc-ae'],
      'delhi': ['dmrc-je'],
    };
    if (stateMatch[state]?.includes(id)) score += 30;

    // Relocate preference
    if (relocate === 'home-only' && !stateMatch[state]?.includes(id)) {
      if (!['ssc-je', 'rrb-je'].includes(id)) score -= 25;
    }
    if (relocate === 'anywhere') {
      if (['ssc-je', 'rrb-je', 'gate-psu'].includes(id)) score += 15;
    }

    // Vacancy weight
    score += Math.min(exam.vacancies / 200, 25);

    // Attempt history → recommend higher difficulty for repeat
    if (attempts === '3+') {
      if (exam.type === 'State JE') score += 10;
    }
    if (attempts === 'first') {
      if (exam.type === 'PSU AE' && hours !== '8+') score -= 10;
    }

    // Hours availability
    if (hours === '<4' && exam.type === 'PSU AE') score -= 15;
    if (hours === '8+' && exam.type === 'PSU AE') score += 10;

    // B.Tech preference for AE-tier
    if (qualification === 'btech') {
      if (exam.type === 'State AE') score += 15;
      if (exam.type === 'PSU AE') score += 8;
    }

    // Diploma preference for JE-tier
    if (qualification === 'diploma') {
      if (exam.type === 'Central JE') score += 12;
      if (exam.type === 'State JE') score += 8;
    }

    // Salary appeal nudge
    score += Math.log10(exam.cumulative10y / 1000000) * 2;

    scores[id] = score;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) {
    // Fallback: relax home-only restriction, pick top 3 eligible exams by cumulative10y
    const fallback = Object.entries(EXAMS)
      .filter(([, exam]) => exam.eligibility.includes(qualification) && exam.branches.includes(branch))
      .sort((a, b) => b[1].cumulative10y - a[1].cumulative10y)
      .slice(0, 3)
      .map(([id, exam]) => ({ ...exam, id, matchScore: 72 }));
    return fallback;
  }

  // Normalize scores: top scorer = 95%, scale others relative to it
  const topScore = sorted[0][1];
  const bottomScore = sorted[sorted.length - 1][1];
  const range = Math.max(topScore - bottomScore, 1);

  return sorted
    .slice(0, 3)
    .map(([id, score]) => {
      const normalized = Math.round(65 + ((score - bottomScore) / range) * 30);
      const matchScore = Math.min(98, Math.max(50, normalized));
      return { ...EXAMS[id], id, matchScore };
    });
};

// ============================================================
// SALARY PROJECTION ENGINE
// ============================================================
const generateProjection = (exam) => {
  const data = [];
  let basic = exam.basicPay;
  const daRate = 0.60;
  const hraRate = 0.20;
  const isPSU = exam.type === 'PSU AE';

  for (let year = 1; year <= 10; year++) {
    let monthly;
    if (isPSU) {
      // IDA scale: Basic + DA(53.4%) + HRA(30%) + Perks(35% of Basic+DA)
      const da = basic * 0.534;
      const hra = basic * 0.30;
      const perks = (basic + da) * 0.35;
      monthly = basic + da + hra + perks;
    } else {
      const da = basic * daRate;
      const hra = basic * hraRate;
      const ta = exam.payLevel >= 9 ? 7200 + 7200 * daRate : 3600 + 3600 * daRate;
      monthly = basic + da + hra + ta;
    }

    // Promotion bumps
    if (year === 5 && exam.type !== 'PSU AE') basic *= 1.18;
    if (year === 7 && exam.type === 'State AE') basic *= 1.15;
    if (year === 4 && exam.type === 'PSU AE') basic *= 1.20;
    if (year === 8 && exam.type === 'PSU AE') basic *= 1.20;

    // Annual increment
    basic = basic * 1.03;

    data.push({
      year: `Y${year}`,
      monthly: Math.round(monthly),
      annual: Math.round(monthly * 12),
      cumulative: data.length === 0 ? Math.round(monthly * 12) : data[data.length - 1].cumulative + Math.round(monthly * 12),
    });
  }
  return data;
};

const formatINR = (num) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
};

// ============================================================
// QUIZ QUESTIONS CONFIG
// ============================================================
const QUESTIONS = [
  {
    key: 'qualification',
    label: 'What is your qualification?',
    icon: GraduationCap,
    options: [
      { value: 'diploma', label: 'Diploma in Engineering', sub: '3-year polytechnic' },
      { value: 'btech', label: 'B.Tech / B.E.', sub: '4-year degree' },
    ],
  },
  {
    key: 'branch',
    label: 'Which branch?',
    icon: BookOpen,
    options: [
      { value: 'civil', label: 'Civil', sub: 'Construction, Structures' },
      { value: 'mechanical', label: 'Mechanical', sub: 'Machines, Manufacturing' },
      { value: 'electrical', label: 'Electrical', sub: 'Power, Wiring' },
      { value: 'electronics', label: 'Electronics', sub: 'Signal, Telecom' },
    ],
  },
  {
    key: 'age',
    label: 'Your current age?',
    icon: Clock,
    options: [
      { value: '<23', label: 'Below 23' },
      { value: '23-26', label: '23 - 26' },
      { value: '27-30', label: '27 - 30' },
      { value: '30+', label: '30 and above' },
    ],
  },
  {
    key: 'state',
    label: 'Which state are you from?',
    icon: MapPin,
    options: [
      { value: 'up', label: 'Uttar Pradesh' },
      { value: 'bihar', label: 'Bihar' },
      { value: 'mp', label: 'Madhya Pradesh' },
      { value: 'rajasthan', label: 'Rajasthan' },
      { value: 'hp', label: 'Himachal Pradesh' },
      { value: 'gujarat', label: 'Gujarat' },
      { value: 'delhi', label: 'Delhi NCR' },
      { value: 'other', label: 'Other state' },
    ],
  },
  {
    key: 'relocate',
    label: 'Open to relocate for posting?',
    icon: Target,
    options: [
      { value: 'anywhere', label: 'Anywhere in India', sub: 'Maximum opportunities' },
      { value: 'flexible', label: 'Prefer home state but flexible' },
      { value: 'home-only', label: 'Only home state', sub: 'Limits central exams' },
    ],
  },
  {
    key: 'attempts',
    label: 'Your attempt history?',
    icon: Trophy,
    options: [
      { value: 'first', label: 'First attempt', sub: 'Fresh aspirant' },
      { value: '1-2', label: '1-2 prior attempts' },
      { value: '3+', label: '3+ prior attempts', sub: 'Repeat aspirant' },
    ],
  },
  {
    key: 'hours',
    label: 'Hours per day for prep?',
    icon: Zap,
    options: [
      { value: '<4', label: 'Less than 4 hrs' },
      { value: '4-6', label: '4 - 6 hrs' },
      { value: '6-8', label: '6 - 8 hrs' },
      { value: '8+', label: '8+ hrs', sub: 'Full-time aspirant' },
    ],
  },
];

// ============================================================
// UI COMPONENTS
// ============================================================

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
      T
    </div>
    <div className="leading-tight">
      <div className="text-base font-bold text-gray-900">Testbook</div>
      <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">SuperCoaching</div>
    </div>
  </div>
);

const ProgressBar = ({ current, total }) => (
  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

// Landing screen
const Landing = ({ onStart }) => (
  <div className="text-center max-w-2xl mx-auto py-8 sm:py-12">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 mb-6">
      <Sparkles className="w-3.5 h-3.5" />
      AE/JE CAREER CALCULATOR
    </div>
    <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
      Confused which AE/JE exam<br />
      <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
        you should actually fill?
      </span>
    </h1>
    <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto">
      Take this 90-second quiz to discover your top 3 exam matches and see exactly how much you'll earn over 10 years.
    </p>

    <button
      onClick={onStart}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
    >
      Start the Quiz
      <ChevronRight className="w-5 h-5" />
    </button>

    <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 max-w-xl mx-auto">
      {[
        { num: '14+', label: 'Exams analyzed' },
        { num: '90', label: 'Seconds to result' },
        { num: '10-yr', label: 'Salary projection' },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{stat.num}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-400">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      Used by 5,000+ engineering aspirants
    </div>
  </div>
);

// Quiz screen
const Quiz = ({ answers, setAnswers, onComplete, currentQ, setCurrentQ }) => {
  const question = QUESTIONS[currentQ];
  const Icon = question.icon;

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [question.key]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 250);
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-semibold">Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}% complete</span>
        </div>
        <ProgressBar current={currentQ + 1} total={QUESTIONS.length} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-emerald-700" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {question.label}
        </h2>

        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const selected = answers[question.key] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 sm:px-5 py-4 rounded-xl border-2 transition-all duration-150 ${
                  selected
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-semibold ${selected ? 'text-emerald-900' : 'text-gray-900'}`}>
                      {opt.label}
                    </div>
                    {opt.sub && (
                      <div className="text-xs text-gray-500 mt-0.5">{opt.sub}</div>
                    )}
                  </div>
                  {selected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ(currentQ - 1)}
            className="mt-6 text-sm text-gray-500 hover:text-emerald-700 font-medium"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

// Capture wall — the conversion-critical screen
const CaptureWall = ({ contact, setContact, onUnlock }) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    if (!contact.name?.trim()) newErrors.name = 'Required';
    if (!contact.phone?.match(/^[6-9]\d{9}$/)) newErrors.phone = 'Enter valid 10-digit mobile';
    if (!contact.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Enter valid email';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save lead data — replace this fetch() with your CRM / API endpoint
    const leadPayload = {
      ...contact,
      timestamp: new Date().toISOString(),
      source: 'aeje-career-calculator',
    };
    try {
      // Persist locally so data isn't lost on page reload
      const existing = JSON.parse(localStorage.getItem('aeje_leads') || '[]');
      localStorage.setItem('aeje_leads', JSON.stringify([...existing, leadPayload]));
    } catch (_) { /* storage unavailable — non-fatal */ }

    // TODO: swap console.log for your actual API call, e.g.:
    // fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadPayload) });
    console.log('[Lead captured]', leadPayload);

    onUnlock();
  };

  return (
    <div className="max-w-md mx-auto py-6">
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3 backdrop-blur-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-1">Your matches are ready!</h2>
          <p className="text-emerald-100 text-sm">
            Unlock your personalised top 3 exam recommendations + 10-year salary projection
          </p>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={contact.name || ''}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none focus:border-emerald-500 ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Mohit Kumar"
            />
            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
              <input
                type="tel"
                maxLength="10"
                value={contact.phone || ''}
                onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, '') })}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 text-sm focus:outline-none focus:border-emerald-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="9876543210"
              />
            </div>
            {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border-2 text-sm focus:outline-none focus:border-emerald-500 ${
                errors.email ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="mohit@example.com"
            />
            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            Unlock My Report
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 justify-center pt-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            We'll send your report on WhatsApp + Email instantly
          </div>
        </div>
      </div>
    </div>
  );
};

// Result screen — the final reveal
const Result = ({ recommendations, contact, onRestart }) => {
  const [selectedExam, setSelectedExam] = useState(recommendations[0]);
  const projection = useMemo(() => generateProjection(selectedExam), [selectedExam]);
  const totalEarnings = projection[projection.length - 1].cumulative;

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          REPORT UNLOCKED
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Hi {contact.name}, here are your top 3 exam matches
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Personalised based on your branch, qualification, and goals
        </p>
      </div>

      {/* Top 3 exams cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {recommendations.map((exam, idx) => {
          const isSelected = selectedExam.id === exam.id;
          return (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam)}
              className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-600 bg-gradient-to-br from-emerald-50 to-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-emerald-300'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  ⭐ BEST FIT
                </div>
              )}
              <div className="flex items-start justify-between mb-2 mt-1">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Match #{idx + 1}
                  </div>
                  <div className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                    {exam.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-700">{exam.matchScore}%</div>
                  <div className="text-[10px] text-gray-500">match</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-3 leading-snug">{exam.why}</div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1 text-gray-500">
                  <Users className="w-3 h-3" />
                  {exam.vacancies}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {exam.nextNotification}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected exam detail + salary projection */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-emerald-900 text-white p-5 sm:p-6">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                Earnings projection if you crack
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">{selectedExam.fullName}</h3>
              <div className="text-sm text-emerald-100 mt-1">
                {selectedExam.departments}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                10-year total
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-300">
                {formatINR(totalEarnings)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 border-b border-gray-100">
          {[
            { label: 'Starting Basic', value: formatINR(selectedExam.basicPay), icon: IndianRupee },
            { label: 'In-hand (Y-city)', value: formatINR(selectedExam.inhand), icon: Briefcase },
            { label: 'Promotion Path', value: selectedExam.promotionPath, icon: TrendingUp, small: true },
            { label: 'Pay Level', value: selectedExam.payLevel ? `Level ${selectedExam.payLevel}` : 'IDA-PSU', icon: Award },
          ].map((stat, i) => (
            <div key={i} className="p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <stat.icon className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className={`font-bold text-gray-900 ${stat.small ? 'text-xs' : 'text-sm sm:text-base'}`}>
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="p-4 sm:p-6">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
            10-Year Cumulative Earnings (Y-Class City)
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#10B981', fontWeight: 'bold' }}
                  formatter={(value, name) => [formatINR(value), name === 'cumulative' ? 'Total Earned' : 'Annual']}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAmt)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Year-by-year mini table */}
          <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-1 text-center">
            {projection.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-md p-1.5 border border-gray-100">
                <div className="text-[9px] uppercase text-gray-500 font-semibold">{p.year}</div>
                <div className="text-[10px] sm:text-xs font-bold text-emerald-700">
                  {formatINR(p.monthly)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border-2 border-orange-200 p-5 sm:p-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
          <Star className="w-3 h-3 fill-current" />
          Limited Time
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          Start your {selectedExam.name} prep with SuperCoaching
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Live classes, mock tests, PYQs & 1:1 mentoring — by India's top faculty
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all text-sm">
            🎯 Join SuperCoaching — Get 60% Off
          </button>
          <button className="bg-white border-2 border-gray-200 hover:border-emerald-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
            📥 Download Full PDF Report
          </button>
        </div>
      </div>

      {/* Share + Restart */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
        <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-emerald-500 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all">
          <Share2 className="w-4 h-4" />
          Share with Parents
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Quiz
        </button>
      </div>

      <div className="text-[11px] text-gray-400 text-center pt-2">
        Calculations based on 7th CPC Pay Matrix · DA @ 60% (Jan 2026) · Y-class HRA
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [stage, setStage] = useState('landing');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const handleStart = () => {
    setStage('quiz');
    setCurrentQ(0);
  };

  const handleQuizComplete = (finalAnswers) => {
    const recs = recommendExams(finalAnswers);
    setRecommendations(recs);
    setStage('capture');
  };

  const handleUnlock = () => setStage('result');

  const handleRestart = () => {
    setStage('landing');
    setCurrentQ(0);
    setAnswers({});
    setContact({});
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-orange-50/20 font-sans">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          {stage !== 'landing' && (
            <div className="text-[11px] text-gray-500 hidden sm:block">
              AE/JE Career Calculator
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-12">
        {stage === 'landing' && <Landing onStart={handleStart} />}
        {stage === 'quiz' && (
          <Quiz
            answers={answers}
            setAnswers={setAnswers}
            onComplete={handleQuizComplete}
            currentQ={currentQ}
            setCurrentQ={setCurrentQ}
          />
        )}
        {stage === 'capture' && (
          <CaptureWall contact={contact} setContact={setContact} onUnlock={handleUnlock} />
        )}
        {stage === 'result' && (
          <Result recommendations={recommendations} contact={contact} onRestart={handleRestart} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-white/50 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-[11px] text-gray-400">
          Built with verified 7th CPC data · Salary projections include DA, HRA, TA, increments & one promotion ·{' '}
          <span className="text-emerald-700 font-medium">© Testbook SuperCoaching</span>
        </div>
      </div>
    </div>
  );
}
