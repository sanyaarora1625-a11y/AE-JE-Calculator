import React, { useState, useMemo, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';
import {
  ChevronRight, Check, Share2, Sparkles, Trophy,
  IndianRupee, TrendingUp, Award, Briefcase, RefreshCw, Star,
  GraduationCap, MapPin, Clock, Target, Users, Calendar, ArrowRight,
  CheckCircle2, Zap, BookOpen, AlertCircle
} from 'lucide-react';

// ============================================================
// EXAM DATABASE — verified 7th CPC + DA 60% (Jan 2026)
// ============================================================
const EXAMS = {
  'ssc-je': {
    name: 'SSC JE', fullName: 'SSC Junior Engineer',
    payLevel: 6, basicPay: 35400, probationBasic: null, probationYears: 0,
    departments: 'CPWD, MES, BRO, CWC',
    eligibility: ['diploma', 'btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 1731, nextNotification: 'June 2026',
    promotionPath: 'JE → AE → EE', promotionYear: 6, promotionBump: 1.18,
    type: 'Central JE', hraTier: 'central',
    why: 'Central govt, stable promotions, all-India postings',
    scope: 'central',
  },
  'rrb-je': {
    name: 'RRB JE', fullName: 'Railway Junior Engineer',
    payLevel: 6, basicPay: 35400, probationBasic: null, probationYears: 0,
    departments: 'Track, Signal, Mech, Electrical, Civil',
    eligibility: ['diploma', 'btech'], branches: ['civil', 'mechanical', 'electrical', 'electronics'],
    vacancies: 7951, nextNotification: 'Aug-Sep 2026',
    promotionPath: 'JE → SSE → ADEN', promotionYear: 5, promotionBump: 1.20,
    type: 'Central JE', hraTier: 'central',
    why: 'Highest vacancies (7,951), railway perks, PLB bonus',
    scope: 'central',
  },
  'dmrc-je': {
    name: 'DMRC JE', fullName: 'Delhi Metro Rail Junior Engineer',
    payLevel: 0, basicPay: 37000, probationBasic: null, probationYears: 0,
    departments: 'Civil, Electrical, Electronics, Mechanical',
    eligibility: ['diploma', 'btech'], branches: ['civil', 'mechanical', 'electrical', 'electronics'],
    vacancies: 350, nextNotification: 'Variable',
    promotionPath: 'JE → AM → DM', promotionYear: 6, promotionBump: 1.15,
    type: 'PSU JE', hraTier: 'x-only',
    why: 'IDA-PSU scale, 35% Cafeteria perks, Delhi posting',
    scope: 'state', stateLink: 'delhi',
  },
  'uppsc-ae': {
    name: 'UPPSC AE', fullName: 'UP PSC Assistant Engineer',
    payLevel: 10, basicPay: 56100, probationBasic: null, probationYears: 0,
    departments: 'PWD, Irrigation, Public Health',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 600, nextNotification: 'Q3 2026',
    promotionPath: 'AE → EE → SE → CE', promotionYear: 7, promotionBump: 1.20,
    type: 'State AE', hraTier: 'state',
    why: 'Group B Gazetted, home state UP, officer authority',
    scope: 'state', stateLink: 'up',
  },
  'bpsc-ae': {
    name: 'BPSC AE', fullName: 'Bihar PSC Assistant Engineer',
    payLevel: 9, basicPay: 53100, probationBasic: null, probationYears: 0,
    departments: 'PWD, Water Resources, Building Construction',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 700, nextNotification: 'Q4 2026',
    promotionPath: 'AE → EE → SE', promotionYear: 7, promotionBump: 1.18,
    type: 'State AE', hraTier: 'state',
    why: 'Bihar home state, Class II Gazetted',
    scope: 'state', stateLink: 'bihar',
  },
  'mppsc-ae': {
    name: 'MPPSC AE', fullName: 'MP PSC Assistant Engineer',
    payLevel: 10, basicPay: 56100, probationBasic: null, probationYears: 0,
    departments: 'PWD, Water Resources, PHE',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 350, nextNotification: 'Q2 2026',
    promotionPath: 'AE → EE → SE → CE', promotionYear: 7, promotionBump: 1.20,
    type: 'State AE', hraTier: 'state',
    why: 'Class I Gazetted, MP home state',
    scope: 'state', stateLink: 'mp',
  },
  'rpsc-ae': {
    name: 'RPSC AEN', fullName: 'Rajasthan PSC Assistant Engineer',
    payLevel: 10, basicPay: 56100, probationBasic: 33800, probationYears: 2,
    departments: 'PWD, Water Resources, PHED',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 280, nextNotification: 'Q3 2026',
    promotionPath: 'AEN → XEN → SE → CE', promotionYear: 7, promotionBump: 1.20,
    type: 'State AE', hraTier: 'state',
    why: 'OPS restored — guaranteed pension, no NPS deduction',
    scope: 'state', stateLink: 'rajasthan', pension: 'OPS',
  },
  'hppsc-ae': {
    name: 'HPPSC AE', fullName: 'Himachal PSC Assistant Engineer',
    payLevel: 10, basicPay: 56100, probationBasic: null, probationYears: 0,
    departments: 'IPH, PWD, MPP & Power',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 100, nextNotification: 'Q3 2026',
    promotionPath: 'AE → EE → SE', promotionYear: 4, promotionBump: 1.17,
    type: 'State AE', hraTier: 'state',
    why: 'OPS restored, 4-tier auto-upgrade pay structure',
    scope: 'state', stateLink: 'hp', pension: 'OPS',
  },
  'gpsc-ae': {
    name: 'GPSC AE', fullName: 'Gujarat PSC Assistant Engineer',
    payLevel: 8, basicPay: 44900, probationBasic: null, probationYears: 0,
    departments: 'R&B, Water Supply, Narmada',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 49, nextNotification: 'Q4 2026',
    promotionPath: 'AE → DyEE → EE', promotionYear: 8, promotionBump: 1.18,
    type: 'State AE', hraTier: 'state',
    why: 'Gujarat home state, Class II Gazetted',
    scope: 'state', stateLink: 'gujarat',
  },
  'upsssc-je': {
    name: 'UPSSSC JE', fullName: 'UP SSSC Junior Engineer',
    payLevel: 6, basicPay: 35400, probationBasic: null, probationYears: 0,
    departments: 'PWD, Jal Nigam, UPRNN',
    eligibility: ['diploma', 'btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 4016, nextNotification: 'Q2 2026',
    promotionPath: 'JE → AE', promotionYear: 8, promotionBump: 1.15,
    type: 'State JE', hraTier: 'state',
    why: 'Home state UP, lower competition than SSC',
    scope: 'state', stateLink: 'up',
  },
  'btsc-je': {
    name: 'BTSC JE', fullName: 'Bihar TSC Junior Engineer',
    payLevel: 7, basicPay: 35400, probationBasic: null, probationYears: 0,
    departments: 'PHED, Water Resources, Rural Works',
    eligibility: ['diploma', 'btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 2920, nextNotification: 'Q3 2026',
    promotionPath: 'JE → AE', promotionYear: 8, promotionBump: 1.15,
    type: 'State JE', hraTier: 'state',
    why: 'Bihar home state, GP 4,600',
    scope: 'state', stateLink: 'bihar',
  },
  'rsmssb-je': {
    name: 'RSMSSB JE', fullName: 'Rajasthan SMSSB Junior Engineer',
    payLevel: 10, basicPay: 33800, probationBasic: 23700, probationYears: 2,
    departments: 'PWD, PHED, Water Resources',
    eligibility: ['diploma', 'btech'], branches: ['civil', 'mechanical', 'electrical'],
    vacancies: 774, nextNotification: 'Q3 2026',
    promotionPath: 'JEN → AEN → XEN', promotionYear: 8, promotionBump: 1.18,
    type: 'State JE', hraTier: 'state',
    why: 'OPS restored, ₹23,700 fixed in probation (2 yrs)',
    scope: 'state', stateLink: 'rajasthan', pension: 'OPS',
  },
  'gate-psu': {
    name: 'GATE → PSU', fullName: 'PSU Recruitment via GATE',
    payLevel: 0, basicPay: 60000, probationBasic: null, probationYears: 0,
    departments: 'ONGC, GAIL, BPCL, IOCL, NTPC, BHEL, SAIL',
    eligibility: ['btech'], branches: ['civil', 'mechanical', 'electrical', 'electronics'],
    vacancies: 800, nextNotification: 'Feb 2026 (GATE)',
    promotionPath: 'E1 → E2 → E3 → E4 (3-4 yr cycles)',
    promotionYear: 4, promotionBump: 1.20,
    type: 'PSU AE', hraTier: 'psu',
    why: 'Highest CTC (₹15-25 LPA), Maharatna PSUs, 35% perks line',
    scope: 'central',
  },
};

const STATE_CITY_CLASS = {
  'delhi': 'X', 'up': 'Y', 'bihar': 'Y', 'mp': 'Y',
  'rajasthan': 'Y', 'hp': 'Z', 'gujarat': 'X', 'other': 'Y',
};

const HRA_RATES = { 'X': 0.30, 'Y': 0.20, 'Z': 0.10 };

// ============================================================
// DECISION ENGINE — Bug A (saturation), C (poor matches), D (other state)
// ============================================================
const recommendExams = (answers) => {
  const { qualification, branch, age, state, relocate, attempts, hours } = answers;
  const scoredExams = [];

  Object.entries(EXAMS).forEach(([id, exam]) => {
    if (!exam.eligibility.includes(qualification)) return;
    if (!exam.branches.includes(branch)) return;

    let score = 50;

    const isHomeStateExam = exam.scope === 'state' && exam.stateLink === state;
    const isCentralExam = exam.scope === 'central';
    const userHasMappedState = state !== 'other' && state !== '';

    if (isHomeStateExam) score += 25;
    if (isCentralExam) score += 8;

    if (relocate === 'home-only') {
      if (userHasMappedState) {
        if (!isHomeStateExam && !isCentralExam) score -= 40;
      } else {
        if (!isCentralExam) score -= 35;
      }
    }
    if (relocate === 'anywhere' && isCentralExam) score += 12;

    if (age === '30+' && exam.type === 'State JE') score -= 15;
    if (age === '<23' && exam.type === 'State AE') score -= 5;

    score += Math.min(exam.vacancies / 250, 15);

    if (attempts === '3+' && exam.type === 'State JE') score += 6;
    if (attempts === 'first' && exam.type === 'PSU AE' && hours !== '8+') score -= 12;

    if (hours === '<4' && exam.type === 'PSU AE') score -= 18;
    if (hours === '8+' && exam.type === 'PSU AE') score += 10;
    if (hours === '<4' && exam.type === 'State AE') score -= 5;

    if (qualification === 'btech') {
      if (exam.type === 'State AE') score += 12;
      if (exam.type === 'PSU AE') score += 6;
    }
    if (qualification === 'diploma') {
      if (exam.type === 'Central JE') score += 10;
      if (exam.type === 'State JE') score += 6;
    }

    scoredExams.push({ id, exam, score });
  });

  scoredExams.sort((a, b) => b.score - a.score);

  // Bug C: filter poor matches
  const validMatches = scoredExams.filter(s => s.score >= 35);
  const top = validMatches.slice(0, 3);

  if (top.length === 0) return [];

  // Bug A: spread scores across 60-95% range
  const topScore = top[0].score;
  const minScore = Math.min(...top.map(t => t.score));
  const range = topScore - minScore || 1;

  return top.map((s, idx) => ({
    ...s.exam,
    id: s.id,
    matchScore: Math.round(95 - (idx * 4) - ((topScore - s.score) / range) * 8),
  }));
};

// ============================================================
// SALARY ENGINE — Bugs 6, 7, 8, 9 fixed
// ============================================================
const generateProjection = (exam, userState) => {
  const data = [];
  const cityClass = STATE_CITY_CLASS[userState] || 'Y';
  const hraRate = exam.hraTier === 'x-only' ? 0.30 : HRA_RATES[cityClass];
  const daRate = 0.60;

  let basic = exam.basicPay;
  const isPSU = exam.type === 'PSU AE' || exam.type === 'PSU JE';
  let cumulative = 0;

  for (let year = 1; year <= 10; year++) {
    // Bug 9: promotion at start of year
    if (exam.promotionYear && year === exam.promotionYear) {
      basic = basic * exam.promotionBump;
    }

    // Bug 6: probation pay
    let effectiveBasic = basic;
    if (exam.probationBasic && year <= exam.probationYears) {
      effectiveBasic = exam.probationBasic;
    }

    let monthly, annual;
    if (isPSU) {
      // Bug 7: realistic PSU calc
      const ida = effectiveBasic * 0.534;
      const psuHra = effectiveBasic * (cityClass === 'X' ? 0.24 : 0.16);
      const perks = effectiveBasic * 0.35;
      monthly = effectiveBasic + ida + psuHra + perks;
      const annualPRP = effectiveBasic * 12 * 0.40;
      annual = (monthly * 12) + annualPRP;
    } else {
      const da = effectiveBasic * daRate;
      const hra = effectiveBasic * hraRate;
      const ta = exam.payLevel >= 9
        ? 7200 * (1 + daRate)
        : 3600 * (1 + daRate);
      monthly = effectiveBasic + da + hra + ta;
      annual = monthly * 12;
    }

    cumulative += annual;
    data.push({
      year: `Y${year}`,
      monthly: Math.round(monthly),
      annual: Math.round(annual),
      cumulative: Math.round(cumulative),
      basic: Math.round(effectiveBasic),
    });

    if (!exam.probationBasic || year > exam.probationYears) {
      basic = basic * 1.03;
    }
  }
  return data;
};

// ============================================================
// FORMATTERS — Bug 12: Indian comma style
// ============================================================
const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

const formatINR = (num) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${inrFormatter.format(num)}`;
};

const formatINRFull = (num) => `₹${inrFormatter.format(num)}`;

// ============================================================
// QUIZ QUESTIONS
// ============================================================
const QUESTIONS = [
  { key: 'qualification', label: 'What is your qualification?', icon: GraduationCap,
    options: [
      { value: 'diploma', label: 'Diploma in Engineering', sub: '3-year polytechnic' },
      { value: 'btech', label: 'B.Tech / B.E.', sub: '4-year degree' },
    ]},
  { key: 'branch', label: 'Which branch?', icon: BookOpen,
    options: [
      { value: 'civil', label: 'Civil', sub: 'Construction, Structures' },
      { value: 'mechanical', label: 'Mechanical', sub: 'Machines, Manufacturing' },
      { value: 'electrical', label: 'Electrical', sub: 'Power, Wiring' },
      { value: 'electronics', label: 'Electronics', sub: 'Signal, Telecom' },
    ]},
  { key: 'age', label: 'Your current age?', icon: Clock,
    options: [
      { value: '<23', label: 'Below 23' },
      { value: '23-26', label: '23 - 26' },
      { value: '27-30', label: '27 - 30' },
      { value: '30+', label: '30 and above' },
    ]},
  { key: 'state', label: 'Which state are you from?', icon: MapPin,
    options: [
      { value: 'up', label: 'Uttar Pradesh' },
      { value: 'bihar', label: 'Bihar' },
      { value: 'mp', label: 'Madhya Pradesh' },
      { value: 'rajasthan', label: 'Rajasthan' },
      { value: 'hp', label: 'Himachal Pradesh' },
      { value: 'gujarat', label: 'Gujarat' },
      { value: 'delhi', label: 'Delhi NCR' },
      { value: 'other', label: 'Other state' },
    ]},
  { key: 'relocate', label: 'Open to relocate for posting?', icon: Target,
    options: [
      { value: 'anywhere', label: 'Anywhere in India', sub: 'Maximum opportunities' },
      { value: 'flexible', label: 'Prefer home state but flexible' },
      { value: 'home-only', label: 'Only home state', sub: 'Limits central exams' },
    ]},
  { key: 'attempts', label: 'Your attempt history?', icon: Trophy,
    options: [
      { value: 'first', label: 'First attempt', sub: 'Fresh aspirant' },
      { value: '1-2', label: '1-2 prior attempts' },
      { value: '3+', label: '3+ prior attempts', sub: 'Repeat aspirant' },
    ]},
  { key: 'hours', label: 'Hours per day for prep?', icon: Zap,
    options: [
      { value: '<4', label: 'Less than 4 hrs' },
      { value: '4-6', label: '4 - 6 hrs' },
      { value: '6-8', label: '6 - 8 hrs' },
      { value: '8+', label: '8+ hrs', sub: 'Full-time aspirant' },
    ]},
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
        { num: '13+', label: 'Exams analyzed' },
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
      Verified data: 7th CPC Pay Matrix, DA @ 60% (Jan 2026)
    </div>
  </div>
);

const Quiz = ({ answers, setAnswers, onComplete, currentQ, setCurrentQ }) => {
  const question = QUESTIONS[currentQ];
  const Icon = question.icon;
  const [transitioning, setTransitioning] = useState(false);

  const handleSelect = (value) => {
    if (transitioning) return; // Bug G
    setTransitioning(true);
    const newAnswers = { ...answers, [question.key]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        onComplete(newAnswers);
      }
      setTransitioning(false);
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
                disabled={transitioning}
                className={`w-full text-left px-4 sm:px-5 py-4 rounded-xl border-2 transition-all duration-150 ${
                  selected
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 bg-white'
                } ${transitioning ? 'opacity-70 cursor-wait' : ''}`}
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
            <label htmlFor="cap-name" className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Your Name
            </label>
            <input
              id="cap-name"
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
            <label htmlFor="cap-phone" className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
              <input
                id="cap-phone"
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
            <label htmlFor="cap-email" className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Email Address
            </label>
            <input
              id="cap-email"
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

// Bug B: empty recommendations handler
const NoMatchScreen = ({ onRestart }) => (
  <div className="max-w-md mx-auto py-12 text-center">
    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-orange-500" />
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">
      No exact matches found
    </h2>
    <p className="text-sm text-gray-600 mb-6">
      Based on your filters, we couldn't find a strong AE/JE match. This usually happens when branch + state + qualification combinations are very restrictive.
    </p>
    <p className="text-xs text-gray-500 mb-6">
      Try retaking with broader options — like "Anywhere in India" relocate preference.
    </p>
    <button
      onClick={onRestart}
      className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl"
    >
      <RefreshCw className="w-4 h-4" />
      Retake Quiz
    </button>
  </div>
);

const Result = ({ recommendations, contact, userState, onRestart }) => {
  const [selectedExam, setSelectedExam] = useState(recommendations[0]);

  // Bug E: sync selectedExam if recommendations change
  useEffect(() => {
    if (recommendations[0]) setSelectedExam(recommendations[0]);
  }, [recommendations]);

  const projection = useMemo(
    () => generateProjection(selectedExam, userState),
    [selectedExam, userState]
  );
  const totalEarnings = projection[projection.length - 1].cumulative;
  const cityClass = STATE_CITY_CLASS[userState] || 'Y';

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6">
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
                  {inrFormatter.format(exam.vacancies)} posts
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
              {selectedExam.pension === 'OPS' && (
                <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-orange-500/20 border border-orange-300/30 rounded-full text-[10px] font-bold text-orange-200">
                  ✨ OPS PENSION RESTORED
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                10-year total
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-300">
                {formatINR(totalEarnings)}
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">
                {cityClass}-class city · DA 60%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 border-b border-gray-100">
          {[
            { label: 'Starting Basic', value: formatINRFull(selectedExam.basicPay), icon: IndianRupee },
            { label: `Y1 Monthly`, value: formatINRFull(projection[0].monthly), icon: Briefcase },
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

        {selectedExam.probationBasic && (
          <div className="bg-orange-50 border-b border-orange-100 px-5 py-3 flex items-start gap-2 text-xs text-orange-900">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Probation note:</strong> First {selectedExam.probationYears} years on fixed pay of {formatINRFull(selectedExam.probationBasic)}/month basic. Full pay matrix kicks in from Year {selectedExam.probationYears + 1}.
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
            10-Year Cumulative Earnings ({cityClass}-Class City Posting)
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
                  tickFormatter={(v) => v >= 10000000 ? `${(v / 10000000).toFixed(1)}Cr` : `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 10px',
                  }}
                  labelStyle={{ color: '#10B981', fontWeight: 'bold', marginBottom: 4 }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value, name, props) => {
                    const p = props.payload;
                    return [
                      <span key="content" style={{ display: 'block' }}>
                        <div style={{ color: '#fff' }}>Monthly: {formatINR(p.monthly)}</div>
                        <div style={{ color: '#fff' }}>Annual: {formatINR(p.annual)}</div>
                        <div style={{ color: '#FBBF24', marginTop: 2, fontWeight: 'bold' }}>Total: {formatINR(p.cumulative)}</div>
                      </span>,
                      ''
                    ];
                  }}
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
        Calculations: 7th CPC Pay Matrix · DA @ 60% (Jan 2026) · {cityClass}-class HRA · Promotion modeled at year {selectedExam.promotionYear}
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
        {stage === 'result' && recommendations.length === 0 && (
          <NoMatchScreen onRestart={handleRestart} />
        )}
        {stage === 'result' && recommendations.length > 0 && (
          <Result
            recommendations={recommendations}
            contact={contact}
            userState={answers.state}
            onRestart={handleRestart}
          />
        )}
      </div>

      <div className="border-t border-gray-100 bg-white/50 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-[11px] text-gray-400">
          Built with verified 7th CPC data · DA 60% (Jan 2026) · X/Y/Z HRA tier-aware ·{' '}
          <span className="text-emerald-700 font-medium">©️ Testbook SuperCoaching</span>
        </div>
      </div>
    </div>
  );
}
