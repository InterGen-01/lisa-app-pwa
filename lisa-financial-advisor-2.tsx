import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, TrendingUp, Shield, AlertTriangle, Share2, Mail, MessageCircle, Star, MapPin, Calendar, DollarSign, Home, Car, Heart, GraduationCap, Briefcase, Baby, Plane } from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedLifeStage, setSelectedLifeStage] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [activeCategory, setActiveCategory] = useState('expenses');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [userProfile, setUserProfile] = useState({
    birthYear: '',
    gender: '',
    race: '',
    education: '',
    degreeType: '',
    zipCode: '75098',
    income: '',
    maritalStatus: '',
    children: 0
  });
  const [predictions, setPredictions] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  // Sample personas for different life stages and demographics
  const samplePersonas = {
    'young-single': {
      demographics: { age: 25, gender: 'male', race: 'white', education: 'bachelors', income: 45000 },
      predictions: [
        { event: 'Job Change', probability: 85, impact: 'medium', timeframe: '1-2 years', financialImpact: 8500, category: 'career' },
        { event: 'Car Purchase', probability: 72, impact: 'medium', timeframe: '2-3 years', financialImpact: 25000, category: 'transportation' },
        { event: 'Emergency Fund Need', probability: 68, impact: 'high', timeframe: '1-3 years', financialImpact: 3500, category: 'emergency' },
        { event: 'Graduate School', probability: 45, impact: 'high', timeframe: '3-5 years', financialImpact: 45000, category: 'education' },
        { event: 'Health Issue', probability: 35, impact: 'medium', timeframe: '5-10 years', financialImpact: 4200, category: 'health' }
      ],
      successStory: "Jake, 26, from Dallas saved $15,000 by age 28 by following his personalized plan. When he unexpectedly needed a new car, he was ready.",
      peerComparison: "73% of single professionals in your area aren't prepared for their first major car repair ($2,400 average)"
    },
    'young-couple': {
      demographics: { age: 28, gender: 'female', race: 'hispanic', education: 'bachelors', income: 75000 },
      predictions: [
        { event: 'Wedding Expenses', probability: 78, impact: 'high', timeframe: '1-2 years', financialImpact: 32000, category: 'family' },
        { event: 'First Home Purchase', probability: 82, impact: 'high', timeframe: '2-4 years', financialImpact: 60000, category: 'housing' },
        { event: 'Pregnancy/Baby', probability: 71, impact: 'high', timeframe: '2-5 years', financialImpact: 18500, category: 'family' },
        { event: 'Job Relocation', probability: 55, impact: 'medium', timeframe: '3-5 years', financialImpact: 8000, category: 'career' },
        { event: 'Parent Health Issue', probability: 42, impact: 'medium', timeframe: '5-8 years', financialImpact: 12000, category: 'family' }
      ],
      successStory: "Maria and Carlos planned ahead and bought their first home 18 months earlier than similar couples by preparing for these exact expenses.",
      peerComparison: "Only 31% of couples in your demographic have adequate savings for a home down payment"
    },
    'young-family': {
      demographics: { age: 32, gender: 'male', race: 'asian', education: 'masters', income: 95000 },
      predictions: [
        { event: 'Childcare Costs', probability: 95, impact: 'high', timeframe: 'ongoing', financialImpact: 15000, category: 'family' },
        { event: 'Larger Home Need', probability: 73, impact: 'high', timeframe: '2-4 years', financialImpact: 85000, category: 'housing' },
        { event: 'Child Health Emergency', probability: 68, impact: 'medium', timeframe: '1-5 years', financialImpact: 5500, category: 'health' },
        { event: 'Education Savings Gap', probability: 89, impact: 'high', timeframe: '10-15 years', financialImpact: 65000, category: 'education' },
        { event: 'Career Advancement', probability: 76, impact: 'positive', timeframe: '2-3 years', financialImpact: -12000, category: 'career' }
      ],
      successStory: "The Chen family started saving for college when their daughter was 2. By age 18, they had 90% of costs covered while similar families had only 23%.",
      peerComparison: "Families in your area typically underestimate childcare costs by $8,400 annually"
    },
    'established-family': {
      demographics: { age: 42, gender: 'female', race: 'white', education: 'bachelors', income: 110000 },
      predictions: [
        { event: 'College Tuition', probability: 92, impact: 'high', timeframe: '3-8 years', financialImpact: 125000, category: 'education' },
        { event: 'Home Major Repair', probability: 78, impact: 'medium', timeframe: '1-3 years', financialImpact: 15000, category: 'housing' },
        { event: 'Parent Care Needs', probability: 65, impact: 'high', timeframe: '5-10 years', financialImpact: 45000, category: 'family' },
        { event: 'Teenager Car Accident', probability: 47, impact: 'medium', timeframe: '2-5 years', financialImpact: 8500, category: 'transportation' },
        { event: 'Job Market Change', probability: 52, impact: 'medium', timeframe: '3-7 years', financialImpact: 25000, category: 'career' }
      ],
      successStory: "Jennifer saved $180,000 in college costs by starting a 529 plan early and choosing in-state schools strategically.",
      peerComparison: "68% of families with teenagers haven't prepared for the $847/month average college cost increase"
    },
    'empty-nester': {
      demographics: { age: 52, gender: 'male', race: 'black', education: 'masters', income: 135000 },
      predictions: [
        { event: 'Career Peak Earnings', probability: 88, impact: 'positive', timeframe: '1-5 years', financialImpact: -25000, category: 'career' },
        { event: 'Health Insurance Change', probability: 71, impact: 'medium', timeframe: '2-4 years', financialImpact: 12000, category: 'health' },
        { event: 'Adult Child Support', probability: 64, impact: 'medium', timeframe: '1-8 years', financialImpact: 18000, category: 'family' },
        { event: 'Early Retirement Option', probability: 45, impact: 'high', timeframe: '8-12 years', financialImpact: 150000, category: 'retirement' },
        { event: 'Chronic Condition', probability: 58, impact: 'high', timeframe: '5-15 years', financialImpact: 35000, category: 'health' }
      ],
      successStory: "Robert leveraged his peak earning years to retire 3 years early by maximizing retirement contributions and reducing adult children support.",
      peerComparison: "Parents in your situation provide $23,000 more to adult children than planned"
    }
  };

  const countries = [
    { name: 'United States', flag: '🇺🇸' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Singapore', flag: '🇸🇬' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginCredentials.email && loginCredentials.password) {
      setIsAuthenticated(true);
      setCurrentScreen('lifestages');
    } else {
      alert('Please enter both email and password');
    }
  };

  const lifeStages = [
    { id: 'young-single', name: 'Single', ageRange: '18 - 30', icon: '👤', description: 'Employed, Childfree', category: 'Young' },
    { id: 'young-couple', name: 'Childfree Couple', ageRange: '20 - 30', icon: '👫', description: 'Employed, Childfree', category: 'Young' },
    { id: 'young-family', name: 'Family with Child', ageRange: '22 - 35', icon: '👨‍👩‍👧', description: 'Employed, Children', category: 'Young' },
    { id: 'mature-single', name: 'Single', ageRange: '30 - 50', icon: '👤', description: 'Employed, Childfree', category: 'Maturing' },
    { id: 'established-family', name: 'Established Family', ageRange: '35 - 55', icon: '👨‍👩‍👧‍👦', description: 'Employed, Children', category: 'Maturing' },
    { id: 'well-to-do', name: 'Well to Do', ageRange: '35 - 70', icon: '💰', description: 'Unemployed, Wealthy', category: 'Maturing' },
    { id: 'empty-nester', name: 'Empty Nester', ageRange: '45 - 60', icon: '👫', description: 'Employed, Childfree', category: 'Established' },
    { id: 'retiring-employed', name: 'Retiring Employed', ageRange: '55 - 65', icon: '🏢', description: 'Grandchildren', category: 'Established' },
    { id: 'elderly', name: 'Elderly', ageRange: '70 - 90', icon: '👴👵', description: 'Children, Grandchildren', category: 'Established' }
  ];

  // Comprehensive financial data for each life stage and category
  const stageFinancialData = {
    'young-single': {
      title: 'Young Single Professional',
      description: 'Starting your career with focus on building financial foundation and emergency savings.',
      details: 'At this stage, you\'re likely renting, paying off student loans, and building credit. Focus on emergency funds, basic insurance, and starting retirement savings early to benefit from compound growth.',
      statistic: '68% of young singles have less than $1,000 in emergency savings, making unexpected expenses a major financial stress.',
      categories: {
        expenses: {
          expenses: [
            { category: 'Housing (Rent)', amount: 18000 },
            { category: 'Transportation', amount: 6500 },
            { category: 'Food', amount: 4800 },
            { category: 'Entertainment', amount: 3200 },
            { category: 'Personal Care', amount: 1800 },
            { category: 'Clothing', amount: 1500 },
            { category: 'Utilities', amount: 2400 },
            { category: 'Phone/Internet', amount: 1200 }
          ]
        },
        debt: {
          expenses: [
            { category: 'Student Loans', amount: 6000 },
            { category: 'Credit Card Debt', amount: 2400 },
            { category: 'Auto Loan', amount: 4800 },
            { category: 'Personal Loan', amount: 1200 }
          ]
        },
        savings_investments: {
          expenses: [
            { category: '401(k) Contribution', amount: 3600 },
            { category: 'Emergency Fund', amount: 2400 },
            { category: 'Roth IRA', amount: 2000 },
            { category: 'Investment Account', amount: 1200 },
            { category: 'High-Yield Savings', amount: 1800 }
          ]
        },
        education: {
          expenses: [
            { category: 'Professional Certifications', amount: 1500 },
            { category: 'Online Courses', amount: 800 },
            { category: 'Conference/Workshops', amount: 1200 },
            { category: 'Books/Learning Materials', amount: 400 }
          ]
        },
        insurance: {
          expenses: [
            { category: 'Health Insurance', amount: 3200 },
            { category: 'Auto Insurance', amount: 1800 },
            { category: 'Renters Insurance', amount: 180 },
            { category: 'Life Insurance (Term)', amount: 240 },
            { category: 'Disability Insurance', amount: 600 }
          ]
        },
        tax: {
          expenses: [
            { category: 'Federal Income Tax', amount: 8500 },
            { category: 'State Income Tax', amount: 2250 },
            { category: 'FICA Taxes', amount: 3825 },
            { category: 'Tax Preparation', amount: 200 }
          ]
        },
        business: {
          expenses: [
            { category: 'Professional Development', amount: 1500 },
            { category: 'Networking Events', amount: 600 },
            { category: 'Work Equipment', amount: 800 },
            { category: 'Business Attire', amount: 1200 }
          ]
        },
        income_protection: {
          expenses: [
            { category: 'Emergency Fund Target', amount: 15000 },
            { category: 'Short-term Disability', amount: 480 },
            { category: 'Critical Illness Insurance', amount: 360 },
            { category: 'Identity Theft Protection', amount: 120 }
          ]
        },
        estate_planning: {
          expenses: [
            { category: 'Basic Will', amount: 500 },
            { category: 'Power of Attorney', amount: 200 },
            { category: 'Healthcare Directive', amount: 150 },
            { category: 'Beneficiary Updates', amount: 0 }
          ]
        },
        special_situations: {
          expenses: [
            { category: 'Career Transition Fund', amount: 2400 },
            { category: 'Moving Expenses', amount: 1200 },
            { category: 'Job Search Costs', amount: 800 },
            { category: 'Side Business Setup', amount: 1500 }
          ]
        }
      }
    },
    'young-couple': {
      title: 'Young Couple',
      description: 'Building life together while managing dual incomes and planning for major life events.',
      details: 'This stage involves coordinating finances, saving for a home, planning a wedding, and establishing joint financial goals while maintaining individual financial independence.',
      statistic: '72% of couples disagree about money regularly, making financial communication crucial for relationship success.',
      categories: {
        expenses: {
          expenses: [
            { category: 'Housing (Rent/Mortgage)', amount: 28000 },
            { category: 'Transportation (2 cars)', amount: 12000 },
            { category: 'Food & Dining', amount: 8400 },
            { category: 'Entertainment', amount: 4800 },
            { category: 'Travel', amount: 3600 },
            { category: 'Utilities', amount: 3200 },
            { category: 'Personal Care', amount: 2400 }
          ]
        },
        debt: {
          expenses: [
            { category: 'Student Loans (Combined)', amount: 12000 },
            { category: 'Credit Card Debt', amount: 3600 },
            { category: 'Auto Loans (2 cars)', amount: 8400 },
            { category: 'Wedding Loan', amount: 6000 }
          ]
        },
        savings_investments: {
          expenses: [
            { category: 'House Down Payment Fund', amount: 12000 },
            { category: '401(k) Combined', amount: 8000 },
            { category: 'Emergency Fund', amount: 6000 },
            { category: 'Wedding Savings', amount: 8000 },
            { category: 'Joint Investment Account', amount: 4800 }
          ]
        },
        education: {
          expenses: [
            { category: 'Professional Development', amount: 3000 },
            { category: 'Graduate School Savings', amount: 4800 },
            { category: 'Couples Financial Planning', amount: 800 },
            { category: 'Career Advancement', amount: 2400 }
          ]
        },
        insurance: {
          expenses: [
            { category: 'Health Insurance (Family)', amount: 8400 },
            { category: 'Auto Insurance (2 cars)', amount: 3200 },
            { category: 'Renters/Home Insurance', amount: 1200 },
            { category: 'Life Insurance (Both)', amount: 800 }
          ]
        },
        tax: {
          expenses: [
            { category: 'Federal Income Tax', amount: 15000 },
            { category: 'State Income Tax', amount: 4200 },
            { category: 'FICA Taxes', amount: 7200 },
            { category: 'Tax Preparation', amount: 400 }
          ]
        },
        business: {
          expenses: [
            { category: 'Professional Development', amount: 3000 },
            { category: 'Home Office Setup', amount: 2000 },
            { category: 'Business Travel', amount: 2400 },
            { category: 'Professional Memberships', amount: 800 }
          ]
        },
        income_protection: {
          expenses: [
            { category: 'Emergency Fund (6 months)', amount: 30000 },
            { category: 'Disability Insurance', amount: 1200 },
            { category: 'Critical Illness Coverage', amount: 600 },
            { category: 'Job Loss Protection', amount: 400 }
          ]
        },
        estate_planning: {
          expenses: [
            { category: 'Joint Will', amount: 800 },
            { category: 'Power of Attorney', amount: 400 },
            { category: 'Healthcare Directives', amount: 300 },
            { category: 'Beneficiary Planning', amount: 200 }
          ]
        },
        special_situations: {
          expenses: [
            { category: 'Wedding Expenses', amount: 25000 },
            { category: 'Honeymoon Fund', amount: 5000 },
            { category: 'Family Planning Costs', amount: 2400 },
            { category: 'Relocation Fund', amount: 3000 }
          ]
        }
      }
    },
    'established-family': {
      title: 'Established Family',
      description: 'Managing peak family expenses while planning for children\'s education and long-term financial security.',
      details: 'This stage involves juggling mortgage payments, childcare costs, and education savings while maintaining adequate insurance coverage for the whole family. Estate planning becomes critical.',
      statistic: '62% cannot afford an unexpected bill of $400 and would have to take out a loan, borrow money, or max out their credit card to pay for $1,000 bill.',
      categories: {
        expenses: {
          expenses: [
            { category: 'Housing (Mortgage)', amount: 24000 },
            { category: 'Childcare', amount: 18000 },
            { category: 'Food & Groceries', amount: 12000 },
            { category: 'Transportation', amount: 9600 },
            { category: 'Healthcare', amount: 6000 },
            { category: 'Utilities', amount: 4800 },
            { category: 'Entertainment/Family', amount: 4200 },
            { category: 'Clothing (Family)', amount: 3600 }
          ]
        },
        debt: {
          expenses: [
            { category: 'Mortgage Principal', amount: 18000 },
            { category: 'Auto Loans', amount: 7200 },
            { category: 'Credit Card Debt', amount: 4800 },
            { category: 'Student Loans', amount: 6000 },
            { category: 'Home Equity Loan', amount: 3600 }
          ]
        },
        savings_investments: {
          expenses: [
            { category: '401(k) Contributions', amount: 12000 },
            { category: '529 College Savings', amount: 9600 },
            { category: 'Emergency Fund', amount: 6000 },
            { category: 'Investment Portfolio', amount: 8400 },
            { category: 'Retirement IRA', amount: 6000 }
          ]
        },
        education: {
          expenses: [
            { category: 'Children\'s Activities', amount: 4800 },
            { category: 'Tutoring/Support', amount: 3600 },
            { category: 'Parent Education', amount: 2400 },
            { category: 'College Prep', amount: 2000 },
            { category: 'Educational Technology', amount: 1200 }
          ]
        },
        insurance: {
          expenses: [
            { category: 'Health Insurance (Family)', amount: 18500 },
            { category: 'Life Insurance (Term)', amount: 2400 },
            { category: 'Auto Insurance (2 cars)', amount: 2800 },
            { category: 'Homeowners Insurance', amount: 1200 },
            { category: 'Umbrella Policy', amount: 600 },
            { category: 'Disability Insurance', amount: 1800 }
          ]
        },
        tax: {
          expenses: [
            { category: 'Federal Income Tax', amount: 24000 },
            { category: 'State Income Tax', amount: 6500 },
            { category: 'FICA Taxes', amount: 8800 },
            { category: 'Property Tax', amount: 8500 },
            { category: 'Tax Preparation', amount: 600 }
          ]
        },
        business: {
          expenses: [
            { category: 'Professional Development', amount: 3200 },
            { category: 'Home Office Setup', amount: 2500 },
            { category: 'Business Travel', amount: 4800 },
            { category: 'Professional Memberships', amount: 800 }
          ]
        },
        income_protection: {
          expenses: [
            { category: 'Emergency Fund (6 months)', amount: 45000 },
            { category: 'Short-term Disability', amount: 1200 },
            { category: 'Critical Illness Insurance', amount: 960 },
            { category: 'Job Loss Insurance', amount: 600 }
          ]
        },
        estate_planning: {
          expenses: [
            { category: 'Comprehensive Will', amount: 1500 },
            { category: 'Trust Setup', amount: 3500 },
            { category: 'Guardian Designation', amount: 500 },
            { category: 'Annual Trust Review', amount: 800 }
          ]
        },
        special_situations: {
          expenses: [
            { category: 'Elder Care Planning', amount: 8400 },
            { category: 'Special Needs Planning', amount: 2400 },
            { category: 'Family Emergencies', amount: 4800 },
            { category: 'Major Home Repairs', amount: 6000 }
          ]
        }
      }
    }
  };

  const categories = [
    { id: 'expenses', name: 'Expenses', icon: '💸' },
    { id: 'debt', name: 'Debt', icon: '📊' },
    { id: 'savings_investments', name: 'Savings/Investments', icon: '💰' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️' },
    { id: 'tax', name: 'Tax', icon: '📋' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'income_protection', name: 'Income Protection', icon: '🔒' },
    { id: 'estate_planning', name: 'Estate Planning', icon: '📜' },
    { id: 'special_situations', name: 'Special Situations', icon: '⚠️' }
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* iPad optimizations */
      @media screen and (min-width: 768px) and (max-width: 1024px) {
        body {
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        button {
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }
        
        input, select {
          font-size: 16px; /* Prevents zoom on focus */
        }
      }
      
      /* PWA viewport */
      @media all and (display-mode: standalone) {
        body {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    `;
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
    
    // Add viewport meta for mobile optimization
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.getElementsByTagName('head')[0].appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleEmailAdvisor = () => {
    setCurrentScreen('email-summary');
  };

  const getStageData = (stageId) => {
    if (stageFinancialData[stageId]) {
      return stageFinancialData[stageId];
    }
    return stageFinancialData['young-single'];
  };

  const generateTimelineData = (predictions) => {
    const timeline = [];
    const currentYear = new Date().getFullYear();
    const birthYear = parseInt(userProfile.birthYear) || 1990;
    const currentAge = currentYear - birthYear;
    
    for (let age = currentAge; age <= 90; age++) {
      const year = birthYear + age;
      
      let income = 50000;
      if (age < 30) income = 45000 + (age - 22) * 3000;
      else if (age < 50) income = 75000 + (age - 30) * 2500;
      else if (age < 65) income = 125000 - (age - 50) * 1000;
      else income = 45000 - (age - 65) * 1000;

      const relevantEvents = predictions.filter(p => {
        const timeframe = p.timeframe;
        if (timeframe.includes('ongoing')) return age >= currentAge && age <= currentAge + 10;
        const years = timeframe.match(/(\d+)/g);
        if (years && years.length >= 2) {
          const minYear = parseInt(years[0]);
          const maxYear = parseInt(years[1]);
          const eventAge = currentAge + (minYear + maxYear) / 2;
          return Math.abs(eventAge - age) <= 1;
        }
        return false;
      });

      let baseExpenses = income * 0.65;
      const eventCosts = relevantEvents.reduce((sum, e) => sum + (e.financialImpact > 0 ? e.financialImpact : 0), 0);
      
      timeline.push({
        age,
        year,
        income: Math.max(0, income),
        events: relevantEvents,
        expenses: baseExpenses + eventCosts,
        surplus: Math.max(0, income) - (baseExpenses + eventCosts)
      });
    }
    
    return timeline;
  };

  const generatePredictions = (stageId, profile) => {
    return samplePersonas[stageId] || samplePersonas['young-single'];
  };

  const getEventIcon = (category) => {
    const icons = {
      career: Briefcase,
      housing: Home,
      transportation: Car,
      health: Heart,
      education: GraduationCap,
      family: Baby,
      emergency: AlertTriangle,
      retirement: Calendar
    };
    return icons[category] || AlertTriangle;
  };

  if (currentScreen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-4xl">
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wide">LiSA</h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-16">Life Stage Advisor</p>
          </div>
          
          <div className="mb-16">
            <div className="relative w-full max-w-2xl mx-auto mb-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-xl font-medium mb-8 text-white text-center">Select Your Country</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {countries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => setSelectedCountry(country.name)}
                    className={`group relative p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedCountry === country.name
                        ? 'bg-blue-500 shadow-xl border-2 border-white'
                        : 'bg-white/20 backdrop-blur-md hover:bg-white/30 border-2 border-white/30'
                    }`}
                  >
                    {selectedCountry === country.name && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                    
                    <div className="text-5xl mb-4 text-center">{country.flag}</div>
                    <div className="font-semibold text-lg text-center text-white">{country.name}</div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentScreen('login')}
                className="w-full py-4 bg-white/20 backdrop-blur-md text-white font-medium rounded-2xl border-2 border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-300 text-lg"
              >
                Select and Click here to Log-in
              </button>
            </div>
            
            <p className="text-blue-200 text-base mb-4 text-center">Choose your country to get localized financial insights</p>
          </div>
        </div>
        
        <div className="absolute bottom-6 right-6">
          <div className="inline-flex items-center gap-2 text-blue-200 font-medium">
            <span className="text-lg">InterGen</span>
            <div className="bg-white text-blue-900 px-3 py-1 rounded-full text-sm font-bold">DATA</div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome</h1>
            <p className="text-blue-200">Sign in to access your financial insights</p>
            
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <span className="text-xl">{countries.find(c => c.name === selectedCountry)?.flag || '🇺🇸'}</span>
              <span className="text-sm font-medium">{selectedCountry}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-100">Email Address</label>
                <input
                  type="email"
                  value={loginCredentials.email}
                  onChange={(e) => setLoginCredentials(prev => ({...prev, email: e.target.value}))}
                  className="w-full p-4 rounded-xl bg-white/90 text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-100">Password</label>
                <input
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials(prev => ({...prev, password: e.target.value}))}
                  className="w-full p-4 rounded-xl bg-white/90 text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                  placeholder="Enter your password"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Powered by Auth0 • Secure Authentication
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button 
              onClick={() => setCurrentScreen('splash')}
              className="text-blue-200 hover:text-white transition-colors text-sm underline"
            >
              ← Back to Country Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'lifestages') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentScreen('login')} className="p-3 rounded-full hover:bg-gray-200 transition-colors">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                <span className="text-lg md:text-xl">InterGen</span>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">DATA</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                <span className="text-xl md:text-2xl">{countries.find(c => c.name === selectedCountry)?.flag || '🇺🇸'}</span>
                <span>{selectedCountry}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">Life stages</h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">Choose the stage that best represents your current situation</p>
          </div>

          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {lifeStages.map((stage, index) => (
                <button
                  key={stage.id}
                  onClick={() => {
                    setSelectedLifeStage(stage.id);
                    setCurrentScreen('national-averages');
                  }}
                  className="group relative p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 text-center flex flex-col items-center justify-center border border-gray-200 hover:border-blue-300 h-56 md:h-64 lg:h-72"
                >
                  {/* Category badge at top */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gray-600 text-white rounded-full text-xs md:text-sm font-medium shadow-md">
                    {stage.category}
                  </div>
                  
                  {/* Icon - larger and more centered */}
                  <div className="mb-4 md:mb-6 flex items-center justify-center">
                    <div className="text-5xl md:text-6xl lg:text-7xl transform group-hover:scale-110 transition-all duration-300">
                      {stage.icon}
                    </div>
                  </div>
                  
                  {/* Text content - better centered and spaced */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-gray-900 font-bold text-lg md:text-xl lg:text-2xl text-center">
                      {stage.name}
                    </div>
                    <div className="text-blue-600 font-semibold text-base md:text-lg text-center">
                      {stage.ageRange}
                    </div>
                    <div className="text-gray-500 text-sm md:text-base font-medium text-center">
                      {stage.description}
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-all duration-300"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gray-100 rounded-2xl border border-gray-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <p className="text-gray-700 text-lg md:text-xl font-medium">
                Select the life stage that best describes your current situation
              </p>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'national-averages') {
    const currentStageData = getStageData(selectedLifeStage);
    const currentCategoryData = currentStageData.categories[activeCategory] || currentStageData.categories.expenses;
    const maxExpense = Math.max(...currentCategoryData.expenses.map(e => e.amount));

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentScreen('lifestages')} className="p-2 rounded-full hover:bg-gray-200">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                <span>InterGen</span>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">DATA</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentScreen('questionnaire')}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                Personalize
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 transform relative overflow-hidden ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg hover:scale-102'
                    }`}
                    style={{
                      minWidth: '140px',
                      boxShadow: activeCategory === category.id 
                        ? '0 6px 20px rgba(59, 130, 246, 0.25)' 
                        : '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    {activeCategory === category.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-white/20 to-blue-400/10 animate-pulse"></div>
                    )}
                    
                    <span className="text-lg relative z-10">{category.icon}</span>
                    <span className="font-semibold text-xs relative z-10">{category.name}</span>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-lg mb-6 border border-blue-100">
              <span className="font-bold text-blue-900">{currentStageData.title}</span>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="text-5xl">{lifeStages.find(s => s.id === selectedLifeStage)?.icon}</div>
              <div>
                <div className="text-blue-600 font-bold text-2xl">{lifeStages.find(s => s.id === selectedLifeStage)?.name}</div>
                <div className="text-gray-600 text-lg">{lifeStages.find(s => s.id === selectedLifeStage)?.ageRange}</div>
                <div className="text-gray-500">{lifeStages.find(s => s.id === selectedLifeStage)?.description}</div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{currentStageData.title}</h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{currentStageData.description}</p>
              <p className="text-gray-700 mb-6 leading-relaxed">{currentStageData.details}</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <p className="text-amber-800 font-medium">{currentStageData.statistic}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {categories.find(c => c.id === activeCategory)?.name} Expenses ({selectedCountry})
                </h3>
                <p className="text-gray-600">Annual averages for your life stage</p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value="75098" 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  readOnly
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
                  Chart
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-3">
                {currentCategoryData.expenses.map((expense, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center mb-1">
                      <div className="w-48 text-sm font-medium text-gray-700 text-right pr-4">{expense.category}</div>
                      <div className="flex-1 bg-gray-100 rounded-lg h-12 relative overflow-hidden">
                        <div 
                          className={`h-full rounded-lg transition-all duration-1000 delay-${idx * 150} bg-gradient-to-r`}
                          style={{
                            width: `${(expense.amount / maxExpense) * 100}%`,
                            background: activeCategory === 'expenses' ? 'linear-gradient(90deg, #EF4444, #DC2626)' :
                                       activeCategory === 'debt' ? 'linear-gradient(90deg, #F59E0B, #D97706)' :
                                       activeCategory === 'savings_investments' ? 'linear-gradient(90deg, #10B981, #059669)' :
                                       activeCategory === 'education' ? 'linear-gradient(90deg, #8B5CF6, #7C3AED)' :
                                       activeCategory === 'insurance' ? 'linear-gradient(90deg, #3B82F6, #1D4ED8)' : 
                                       activeCategory === 'tax' ? 'linear-gradient(90deg, #6B7280, #4B5563)' :
                                       activeCategory === 'business' ? 'linear-gradient(90deg, #06B6D4, #0891B2)' :
                                       activeCategory === 'income_protection' ? 'linear-gradient(90deg, #84CC16, #65A30D)' :
                                       activeCategory === 'estate_planning' ? 'linear-gradient(90deg, #A855F7, #9333EA)' :
                                       'linear-gradient(90deg, #EC4899, #DB2777)'
                          }}
                        ></div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-bold text-white drop-shadow-lg">
                          ${expense.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Annual {categories.find(c => c.id === activeCategory)?.name} Costs:</span>
                  <span className="text-blue-600">
                    ${currentCategoryData.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <button onClick={() => setCurrentScreen('national-averages')} className="p-3 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
              <span className="text-lg md:text-xl">InterGen</span>
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">DATA</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="mb-6 md:mb-8">
              <div className="bg-blue-100 px-4 md:px-6 py-3 md:py-4 rounded-lg mb-4 md:mb-6">
                <h3 className="font-medium text-blue-900 text-lg md:text-xl">Selected Life Stage</h3>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="text-4xl md:text-5xl">{lifeStages.find(s => s.id === selectedLifeStage)?.icon}</div>
                <div>
                  <div className="text-blue-600 font-medium text-lg md:text-xl">{lifeStages.find(s => s.id === selectedLifeStage)?.name}</div>
                  <div className="text-sm md:text-base text-gray-600">{lifeStages.find(s => s.id === selectedLifeStage)?.ageRange}</div>
                  <div className="text-sm md:text-base text-gray-500">{lifeStages.find(s => s.id === selectedLifeStage)?.description}</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Questionnaire</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
              In order for us to provide accurate predictions, we need to ask you just a few questions.
            </p>

            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">What year were you born?</label>
                  <input
                    type="number"
                    value={userProfile.birthYear}
                    onChange={(e) => setUserProfile(prev => ({...prev, birthYear: e.target.value}))}
                    className="w-full p-3 md:p-4 border rounded-lg text-base md:text-lg"
                    placeholder="1980"
                  />
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">What was your birth gender?</label>
                  <select
                    value={userProfile.gender}
                    onChange={(e) => setUserProfile(prev => ({...prev, gender: e.target.value}))}
                    className="w-full p-3 md:p-4 border rounded-lg text-base md:text-lg"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">What Race do you most identify with?</label>
                  <select
                    value={userProfile.race}
                    onChange={(e) => setUserProfile(prev => ({...prev, race: e.target.value}))}
                    className="w-full p-3 md:p-4 border rounded-lg text-base md:text-lg"
                  >
                    <option value="">Select...</option>
                    <option value="asian">Asian</option>
                    <option value="black">Black or African American</option>
                    <option value="hispanic">Hispanic or Latino</option>
                    <option value="native">Native American</option>
                    <option value="other">Other</option>
                    <option value="white">White</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">What is your Highest Education Level?</label>
                  <select
                    value={userProfile.education}
                    onChange={(e) => setUserProfile(prev => ({...prev, education: e.target.value}))}
                    className="w-full p-3 md:p-4 border rounded-lg text-base md:text-lg"
                  >
                    <option value="">Select...</option>
                    <option value="high-school">High School</option>
                    <option value="associates">Associate's Degree</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="doctorate">Doctorate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">What is your Degree Type?</label>
                  <select
                    value={userProfile.degreeType}
                    onChange={(e) => setUserProfile(prev => ({...prev, degreeType: e.target.value}))}
                    className="w-full p-3 md:p-4 border rounded-lg text-base md:text-lg"
                  >
                    <option value="">Select...</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="engineering">Engineering</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="liberal-arts">Liberal Arts</option>
                    <option value="other">Other</option>
                    <option value="science">Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm md:text-base font-medium mb-2">Annual Household Income</label>
                  <select
                    value={userProfile.income}
                    onChange={(e) => setUserProfile(prev => ({...prev, income: e.target.value}))}
                    className="w-full p-3 md:p-4 border rounded-lg text-base md:text-lg"
                  >
                    <option value="">Select...</option>
                    <option value="25000">Under $25,000</option>
                    <option value="50000">$25,000 - $50,000</option>
                    <option value="75000">$50,000 - $75,000</option>
                    <option value="100000">$75,000 - $100,000</option>
                    <option value="150000">$100,000 - $150,000</option>
                    <option value="200000">$150,000+</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6 pt-4 md:pt-6">
                <button
                  onClick={() => setCurrentScreen('lifestages')}
                  className="px-6 md:px-8 py-3 md:py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-base md:text-lg"
                >
                  Reset
                </button>
                
                <button
                  onClick={() => {
                    const personaData = generatePredictions(selectedLifeStage, userProfile);
                    setPredictions(personaData.predictions);
                    const timeline = generateTimelineData(personaData.predictions);
                    setTimelineData(timeline);
                    setCurrentScreen('results');
                  }}
                  className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base md:text-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'results') {
    const personaData = samplePersonas[selectedLifeStage] || samplePersonas['young-single'];
    const highRiskEvents = predictions.filter(p => p.impact === 'high' && p.probability >= 70);
    const mediumRiskEvents = predictions.filter(p => (p.impact === 'high' && p.probability < 70) || (p.impact === 'medium' && p.probability >= 60));

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentScreen('questionnaire')} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                <span>InterGen</span>
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">DATA</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentScreen('sharing')}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Get Advisor
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <div className="bg-white rounded-lg p-6">
            <div className="bg-blue-100 px-4 py-2 rounded mb-4 inline-block">
              <span className="font-medium text-blue-900">Selected Life Stage</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{lifeStages.find(s => s.id === selectedLifeStage)?.icon}</div>
              <div>
                <div className="text-blue-600 font-medium text-lg">{lifeStages.find(s => s.id === selectedLifeStage)?.name}</div>
                <div className="text-gray-600">{lifeStages.find(s => s.id === selectedLifeStage)?.ageRange}</div>
                <div className="text-gray-500">{lifeStages.find(s => s.id === selectedLifeStage)?.description}</div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              At this stage, financial planning becomes crucial for long-term stability and achieving life goals.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Important:</strong> {stageFinancialData[selectedLifeStage]?.statistic || 'Planning ahead can help you avoid common financial pitfalls.'}
              </p>
            </div>
          </div>

          {timelineData.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Income vs Expenses Timeline</h2>
              <div className="mb-4 text-center">
                <p className="text-gray-600">Projected annual income vs expenses from age {timelineData[0]?.age || 25} to 90</p>
              </div>
              
              <div className="w-full">
                <div className="relative w-full h-80">
                  <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
                    <span>$200k</span>
                    <span>$150k</span>
                    <span>$100k</span>
                    <span>$50k</span>
                    <span>$0</span>
                  </div>
                  
                  <div className="ml-16 h-full relative">
                    {timelineData.map((point, idx) => {
                      const maxValue = 200000;
                      const incomeHeight = Math.max(5, (point.income / maxValue) * 250);
                      const expenseHeight = Math.max(5, (point.expenses / maxValue) * 250);
                      const surplusHeight = Math.max(0, (point.surplus / maxValue) * 250);
                      const barWidth = Math.max(2, (100 / timelineData.length) * 0.8);
                      const xPosition = (idx / (timelineData.length - 1)) * 95;
                      
                      return (
                        <div 
                          key={idx} 
                          className="absolute bottom-0 group cursor-pointer"
                          style={{
                            left: `${xPosition}%`,
                            width: `${barWidth}%`
                          }}
                        >
                          <div 
                            className="bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-sm transition-all duration-300 hover:from-blue-500 hover:to-blue-600 w-full"
                            style={{height: `${incomeHeight}px`}}
                          ></div>
                          
                          <div 
                            className="bg-gradient-to-t from-red-400 to-red-500 absolute bottom-0 rounded-t-sm transition-all duration-300 hover:from-red-500 hover:to-red-600 w-full"
                            style={{
                              height: `${expenseHeight}px`
                            }}
                          ></div>
                          
                          {point.surplus > 0 && (
                            <div 
                              className="bg-gradient-to-t from-green-400 to-green-500 absolute rounded-t-sm transition-all duration-300 w-full"
                              style={{
                                bottom: `${expenseHeight}px`,
                                height: `${surplusHeight}px`
                              }}
                            ></div>
                          )}
                          
                          {(point.age % 10 === 0 || idx === 0 || idx === timelineData.length - 1) && (
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium text-center">
                              <div>Age {point.age}</div>
                              <div className="text-gray-400">{point.year}</div>
                            </div>
                          )}
                          
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            <div>Age {point.age} ({point.year})</div>
                            <div>Income: ${point.income.toLocaleString()}</div>
                            <div>Expenses: ${point.expenses.toLocaleString()}</div>
                            <div>Surplus: ${point.surplus.toLocaleString()}</div>
                            {point.events.length > 0 && (
                              <div className="border-t border-gray-600 mt-1 pt-1">
                                Events: {point.events.map(e => e.event).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="absolute inset-0 pointer-events-none">
                      {[50000, 100000, 150000, 200000].map((value, idx) => (
                        <div 
                          key={idx}
                          className="absolute w-full border-t border-gray-200"
                          style={{bottom: `${(value / 200000) * 250}px`}}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-12 space-x-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-blue-400 to-blue-500 rounded"></div>
                  <span>Total Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-red-400 to-red-500 rounded"></div>
                  <span>Expenses + Life Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-green-400 to-green-500 rounded"></div>
                  <span>Available Surplus</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">AI Life Event Predictions</h2>
            </div>

            {highRiskEvents.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-700">Critical Events - Plan Now</h3>
                  <span className="text-sm text-gray-500">(High Impact, High Probability)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {highRiskEvents.map((event, idx) => {
                    const IconComponent = getEventIcon(event.category);
                    return (
                      <div key={idx} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-red-600" />
                            <h4 className="font-medium">{event.event}</h4>
                          </div>
                          <span className="text-sm font-medium text-red-600">{event.probability}% likely</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">Expected: {event.timeframe}</div>
                        <div className="text-lg font-semibold text-red-700">
                          ${event.financialImpact.toLocaleString()} impact
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {mediumRiskEvents.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-700">Important to Consider</h3>
                  <span className="text-sm text-gray-500">(Medium Impact or Probability)</span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {mediumRiskEvents
                    .sort((a, b) => {
                      const getTimeframePriority = (timeframe) => {
                        if (timeframe.includes('1-')) return 1;
                        if (timeframe.includes('2-')) return 2;
                        if (timeframe.includes('3-')) return 3;
                        if (timeframe.includes('5-')) return 5;
                        if (timeframe.includes('8-')) return 8;
                        return 999;
                      };
                      return getTimeframePriority(a.timeframe) - getTimeframePriority(b.timeframe);
                    })
                    .map((event, idx) => {
                      const IconComponent = getEventIcon(event.category);
                      
                      return (
                        <div 
                          key={idx} 
                          className="w-64 h-40 flex-shrink-0 border border-orange-200 rounded-lg p-4 bg-orange-50 relative overflow-hidden"
                        >
                          <div className="absolute top-2 right-2 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            {event.timeframe}
                          </div>
                          
                          <div className="flex items-start gap-2 mb-2">
                            <IconComponent className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                            <h4 className="font-medium text-sm leading-tight text-gray-800">{event.event}</h4>
                          </div>
                          
                          <div className="mt-auto">
                            <div className="text-xs text-orange-600 font-medium mb-1">
                              {event.probability}% likelihood
                            </div>
                            <div className="text-sm font-bold text-orange-700">
                              ${event.financialImpact.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 to-orange-500"></div>
                        </div>
                      );
                    })}
                </div>
                
                <div className="mt-3 flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-300 rounded"></div>
                    <span>Near-term (1-3 years)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Mid-term (3-5 years)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Long-term (5+ years)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">People Like You</h3>
              </div>
              <p className="text-blue-800 text-sm mb-2">{personaData.peerComparison}</p>
              <div className="bg-white rounded p-3 border-l-4 border-green-500">
                <p className="text-sm text-gray-700">
                  <strong>Success Story:</strong> {personaData.successStory}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center">Take Action</h2>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setCurrentScreen('sharing')}
                className="flex-1 max-w-xs group p-4 border-2 border-blue-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-center h-40"
              >
                <div className="mb-3 mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-base mb-2 text-gray-800">Share Your Results</div>
                <div className="text-sm text-gray-600 leading-relaxed">Show friends your preparedness score</div>
              </button>
              
              <button 
                onClick={handleEmailAdvisor}
                className="flex-1 max-w-xs group p-4 border-2 border-green-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-center h-40"
              >
                <div className="mb-3 mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-base mb-2 text-gray-800">Email Advisor</div>
                <div className="text-sm text-gray-600 leading-relaxed">Send your profile to an expert</div>
              </button>
              
              <button 
                onClick={() => setCurrentScreen('advisor-match')}
                className="flex-1 max-w-xs group p-4 border-2 border-purple-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-center h-40"
              >
                <div className="mb-3 mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-base mb-2 text-gray-800">Find an Advisor</div>
                <div className="text-sm text-gray-600 leading-relaxed">Match with local experts</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'email-summary') {
    const currentStageData = getStageData(selectedLifeStage);
    
    const calculateTotals = () => {
      let totals = {};
      let grandTotal = 0;
      
      categories.forEach(category => {
        const categoryData = currentStageData.categories[category.id];
        if (categoryData && categoryData.expenses) {
          const total = categoryData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
          totals[category.name] = total;
          grandTotal += total;
        }
      });
      
      return { totals, grandTotal };
    };

    const { totals, grandTotal } = calculateTotals();

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setCurrentScreen('results')} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Complete Financial Analysis</h1>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{lifeStages.find(s => s.id === selectedLifeStage)?.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Financial Summary</h2>
                <p className="text-xl text-blue-600 font-medium">{lifeStages.find(s => s.id === selectedLifeStage)?.name} ({lifeStages.find(s => s.id === selectedLifeStage)?.ageRange})</p>
                <p className="text-gray-600">{currentStageData.description}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Personal Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><strong>Birth Year:</strong> {userProfile.birthYear || 'Not provided'}</div>
                <div><strong>Gender:</strong> {userProfile.gender || 'Not provided'}</div>
                <div><strong>Race:</strong> {userProfile.race || 'Not provided'}</div>
                <div><strong>Education:</strong> {userProfile.education || 'Not provided'}</div>
                <div><strong>Income:</strong> {userProfile.income || 'Not provided'}</div>
                <div><strong>Location:</strong> {userProfile.zipCode || '75098'}, {selectedCountry}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  ${grandTotal.toLocaleString()}
                </h3>
                <p className="text-gray-600">Total Annual Financial Obligations</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2">Financial Categories Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(totals).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span>{categories.find(c => c.name === category)?.icon} {category}</span>
                    <span className="font-bold">${amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {predictions.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-orange-900 mb-2">AI Life Event Predictions</h3>
                <div className="space-y-2">
                  {predictions.slice(0, 5).map((prediction, idx) => (
                    <div key={idx} className="text-sm">
                      <strong>{prediction.event}</strong> - {prediction.probability}% probability, {prediction.timeframe} 
                      <span className="text-orange-700 font-medium"> (${prediction.financialImpact.toLocaleString()} impact)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
              
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setCurrentScreen('results')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ← Back to Results
              </button>
              <button 
                onClick={() => {
                  const emailContent = `
LISA FINANCIAL ANALYSIS - ${lifeStages.find(s => s.id === selectedLifeStage)?.name} PROFILE

Personal Profile:
- Life Stage: ${lifeStages.find(s => s.id === selectedLifeStage)?.name} (${lifeStages.find(s => s.id === selectedLifeStage)?.ageRange})
- Birth Year: ${userProfile.birthYear || 'Not provided'}
- Education: ${userProfile.education || 'Not provided'}
- Income: ${userProfile.income || 'Not provided'}
- Location: ${userProfile.zipCode || '75098'}, ${selectedCountry}

Financial Summary:
Total Annual Obligations: $${grandTotal.toLocaleString()}

${Object.entries(totals).map(([category, amount]) => 
  `${category}: $${amount.toLocaleString()}`
).join('\n')}

AI Predictions:
${predictions.map(p => 
  `• ${p.event} (${p.probability}% probability, ${p.timeframe}) - $${p.financialImpact.toLocaleString()} impact`
).join('\n')}

Generated by LISA (Life Stage Advisor) - InterGen Data
                  `.trim();
                  
                  const subject = `LISA Financial Analysis - ${lifeStages.find(s => s.id === selectedLifeStage)?.name} Profile`;
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
                  window.open(mailtoLink, '_blank');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                📧 Send Email
              </button>
              <button 
                onClick={() => {
                  const content = `Complete financial analysis data for ${lifeStages.find(s => s.id === selectedLifeStage)?.name}...`;
                  navigator.clipboard.writeText(content).then(() => {
                    alert('Financial summary copied to clipboard!');
                  }).catch(() => {
                    alert('Copy to clipboard not supported in this browser.');
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                📋 Copy Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'sharing') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setCurrentScreen('results')} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Share Your Results</h1>
          </div>

          <div className="bg-white rounded-lg p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">See How You Compare</h2>
              <p className="text-gray-600">Choose what you'd like to share with friends and family</p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Financial Preparedness Score</h3>
                    <p className="text-sm text-gray-600">Show how ready you are vs. peers</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">78/100</div>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Neighborhood Comparison</h3>
                    <p className="text-sm text-gray-600">"Better prepared than 67% of families in 75098"</p>
                  </div>
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Top Risk Awareness</h3>
                    <p className="text-sm text-gray-600">"Ready for the big expenses others miss"</p>
                  </div>
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Success Prediction</h3>
                    <p className="text-sm text-gray-600">"On track to meet 85% of financial goals"</p>
                  </div>
                  <Share2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Share on Social
              </button>
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                Send via Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'advisor-match') {
    const advisors = [
      {
        name: "Sarah Johnson, CFP®",
        firm: "Wealth Partners Dallas",
        specialty: "Family Financial Planning",
        rating: 4.9,
        experience: "12 years",
        distance: "2.3 miles",
        avatar: "👩‍💼",
        strengths: ["College Planning", "Risk Management", "Estate Planning"]
      },
      {
        name: "Michael Chen, CFA",
        firm: "Investment Solutions Group",
        specialty: "Investment & Retirement",
        rating: 4.8,
        experience: "8 years", 
        distance: "3.7 miles",
        avatar: "👨‍💼",
        strengths: ["Portfolio Management", "Tax Planning", "Retirement Strategies"]
      },
      {
        name: "Jennifer Martinez, CRPC®",
        firm: "Family First Financial",
        specialty: "Life Stage Planning",
        rating: 4.9,
        experience: "15 years",
        distance: "1.8 miles", 
        avatar: "👩‍💼",
        strengths: ["Life Event Planning", "Insurance Review", "Education Funding"]
      }
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setCurrentScreen('results')} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Find Your Perfect Advisor</h1>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h2 className="text-xl font-bold">Matched Based on Your Profile</h2>
                <p className="text-gray-600">We've found advisors who specialize in your predicted life events and local area</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Your Profile:</strong> {lifeStages.find(s => s.id === selectedLifeStage)?.name} ({lifeStages.find(s => s.id === selectedLifeStage)?.ageRange}) • College Planning Priority • Insurance Review Needed • Located in {userProfile.zipCode}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {advisors.map((advisor, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{advisor.avatar}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{advisor.name}</h3>
                      <p className="text-blue-600 font-medium">{advisor.firm}</p>
                      <p className="text-gray-600 mb-2">{advisor.specialty}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{advisor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{advisor.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{advisor.distance}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {advisor.strengths.map((strength, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={handleEmailAdvisor}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Send My Profile
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Schedule Call
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <strong>Why This Match:</strong> Specializes in families with college-bound children and has helped 200+ families prepare for educational expenses and unexpected life events.
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Powered by Couplr.ai</h3>
            <p className="text-purple-100 mb-4">Advanced AI matching connects you with advisors who understand your specific life stage and predicted challenges</p>
            <button className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-medium">
              Learn More About Our Matching Process
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;