import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';

// Inline UI Components
const Button = ({ children, onClick, disabled, className = "", variant = "default", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
    {children}
  </label>
);

const Checkbox = ({ checked, onCheckedChange, className = "", ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
    {...props}
  />
);

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, className = "", variant = "default", ...props }) => {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Icons (simplified SVG icons)
const CheckCircle = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowRight = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowLeft = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Sparkles = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const DollarSign = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const Calendar = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Target = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);

const Users = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FileText = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BarChart3 = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AlertTriangle = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const Edit = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Download = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Upload = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const File = ({ className = "", ...props }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);



const BusinessCaseBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('manual');
  const [businessCaseData, setBusinessCaseData] = useState({
    title: '',
    description: '',
    businessDriver: '',
    expectedBenefits: '',
    corporateAlignment: [],
    digitalAlignment: [],
    stakeholders: '',
    timeline: '',
    budget: '',
    risks: ''
  });

  const steps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Business Driver' },
    { id: 3, title: 'Benefits' },
    { id: 4, title: 'Stakeholders' },
    { id: 5, title: 'Strategic Alignment' },
    { id: 6, title: 'Timeline' },
    { id: 7, title: 'Budget' },
    { id: 8, title: 'Implementation' }
  ];

  const corporateAlignmentOptions = [
    'Digital Transformation Initiative',
    'Operational Excellence Program',
    'Customer Experience Enhancement',
    'Cost Optimization Strategy',
    'Risk Management Framework',
    'Sustainability Goals',
    'Innovation & Growth Strategy',
    'Regulatory Compliance'
  ];

  const digitalAlignmentOptions = [
    'Cloud-First Strategy',
    'Data & Analytics Modernization',
    'Cybersecurity Enhancement',
    'API & Integration Platform',
    'Automation & AI Implementation',
    'Legacy System Modernization',
    'Mobile & User Experience',
    'DevOps & Agile Transformation'
  ];

  const implementationOptions = [
    {
      title: 'Phased Implementation',
      description: 'Roll out in multiple phases with milestone reviews',
      timeline: '12-18 months',
      cost: 'Medium',
      recommended: true
    },
    {
      title: 'Big Bang Approach',
      description: 'Complete implementation in single deployment',
      timeline: '6-9 months',
      cost: 'High',
      recommended: false
    },
    {
      title: 'Pilot Program',
      description: 'Start with limited scope pilot before full rollout',
      timeline: '18-24 months',
      cost: 'Low to Medium',
      recommended: false
    }
  ];

  const handleGenerate = async () => {
    if (inputMethod === 'manual' && !businessCaseData.title.trim()) return;
    if (inputMethod === 'upload' && !uploadedFile) return;
    
    setIsGenerating(true);
    
    // Simulate AI enhancement - auto-fill all fields
    setTimeout(() => {
      const title = inputMethod === 'manual' ? businessCaseData.title : uploadedFile?.name.replace(/\.[^/.]+$/, "") || "Uploaded Project";
      
      setBusinessCaseData(prev => ({
        title: title,
        description: inputMethod === 'upload' 
          ? `Based on the uploaded document "${uploadedFile?.name}", this initiative focuses on implementing strategic improvements to enhance operational efficiency and drive business value.`
          : prev.description,
        businessDriver: `The ${title} initiative is driven by the need to modernize our existing systems and improve operational efficiency. Current manual processes are causing delays, increased costs, and customer satisfaction issues. This project addresses critical business needs including digital transformation, cost reduction, and competitive advantage in the market.`,
        expectedBenefits: `• Cost savings of $2.5M annually through process automation\n• 40% reduction in processing time\n• Improved customer satisfaction scores by 25%\n• Enhanced data accuracy and reporting capabilities\n• Better compliance with regulatory requirements\n• Scalable platform for future growth`,
        corporateAlignment: ['Digital Transformation Initiative', 'Operational Excellence Program', 'Customer Experience Enhancement'],
        digitalAlignment: ['Cloud-First Strategy', 'Data & Analytics Modernization', 'Automation & AI Implementation'],
        stakeholders: `• Executive Sponsor: Chief Technology Officer\n• Project Manager: IT Project Management Office\n• Business Users: Operations Team (25 users)\n• Technical Team: IT Development Team\n• End Users: Customer Service Representatives (50 users)\n• External: Technology vendor and implementation partner`,
        timeline: `Phase 1: Requirements & Design (3 months)\nPhase 2: Development & Testing (6 months)\nPhase 3: Deployment & Training (2 months)\nPhase 4: Go-live & Support (1 month)\n\nTotal Duration: 12 months`,
        budget: `Development: $850,000\nLicensing: $120,000/year\nInfrastructure: $75,000\nTraining: $45,000\nContingency (15%): $165,000\n\nTotal Initial Investment: $1,255,000\nAnnual Operating Costs: $120,000`,
        risks: `• Technical complexity may cause delays (Medium risk)\n• User adoption challenges (Low risk)\n• Integration with legacy systems (High risk)\n• Vendor dependency (Medium risk)\n• Budget overruns (Medium risk)\n\nMitigation strategies included for each identified risk.`
      }));
      setIsEnhanced(true);
      setIsGenerating(false);
      setShowPreview(true);
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAlignment = (type, value, checked) => {
    const field = type === 'corporate' ? 'corporateAlignment' : 'digitalAlignment';
    setBusinessCaseData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${step.id < currentStep ? 'bg-blue-600 text-white' : 
                  step.id === currentStep ? 'bg-blue-600 text-white' : 
                  'bg-gray-200 text-gray-600'}
              `}>
                {step.id < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span className="text-xs font-medium mt-2 max-w-20 text-center">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-12 h-1 rounded-full transition-all
                ${step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Input Method Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setInputMethod('manual')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  inputMethod === 'manual' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Manual Entry</h3>
                <p className="text-sm text-gray-500">Enter project details manually</p>
              </button>
              
              <button
                onClick={() => setInputMethod('upload')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  inputMethod === 'upload' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Upload Document</h3>
                <p className="text-sm text-gray-500">Upload existing document</p>
              </button>
            </div>

            {inputMethod === 'manual' ? (
              <>
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold">Project Title</Label>
                  <Input
                    id="title"
                    value={businessCaseData.title}
                    onChange={(e) => setBusinessCaseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your project title..."
                    className="mt-2 px-6 py-4 text-lg border-2 rounded-xl focus:border-blue-600"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold">Project Description</Label>
                  <Textarea
                    id="description"
                    value={businessCaseData.description}
                    onChange={(e) => setBusinessCaseData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project, its objectives, and key requirements..."
                    rows={6}
                    className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="file-upload" className="text-lg font-semibold">Upload Document</Label>
                <div className="mt-2">
                  <label 
                    htmlFor="file-upload" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-600 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadedFile ? (
                        <>
                          <File className="w-8 h-8 mb-2 text-blue-600" />
                          <p className="text-sm font-medium text-blue-600">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-2 text-blue-600" />
                          <p className="text-sm font-medium">Click to upload document</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT files supported</p>
                        </>
                      )}
                    </div>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={(inputMethod === 'manual' && !businessCaseData.title) || (inputMethod === 'upload' && !uploadedFile) || isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 w-full flex items-center justify-center"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  <span>{inputMethod === 'upload' ? 'Processing document with AI...' : 'Enhancing with AI...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>{inputMethod === 'upload' ? 'Generate from Document' : 'Enhance with AI'}</span>
                </div>
              )}
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label htmlFor="businessDriver" className="text-lg font-semibold">Business Driver</Label>
              <Textarea
                id="businessDriver"
                value={businessCaseData.businessDriver}
                onChange={(e) => setBusinessCaseData(prev => ({ ...prev, businessDriver: e.target.value }))}
                placeholder="What business problem or opportunity is driving this initiative?"
                rows={6}
                className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label htmlFor="expectedBenefits" className="text-lg font-semibold">Expected Benefits</Label>
              <Textarea
                id="expectedBenefits"
                value={businessCaseData.expectedBenefits}
                onChange={(e) => setBusinessCaseData(prev => ({ ...prev, expectedBenefits: e.target.value }))}
                placeholder="Describe the expected benefits, including quantifiable metrics where possible..."
                rows={6}
                className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label htmlFor="stakeholders" className="text-lg font-semibold">Key Stakeholders</Label>
              <Textarea
                id="stakeholders"
                value={businessCaseData.stakeholders}
                onChange={(e) => setBusinessCaseData(prev => ({ ...prev, stakeholders: e.target.value }))}
                placeholder="List the key stakeholders, their roles, and level of involvement..."
                rows={6}
                className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Corporate Strategic Alignment</h3>
                <div className="space-y-3">
                  {corporateAlignmentOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-3">
                      <Checkbox
                        id={`corporate-${option}`}
                        checked={businessCaseData.corporateAlignment.includes(option)}
                        onCheckedChange={(checked) => updateAlignment('corporate', option, checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <Label htmlFor={`corporate-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Digital Strategy Alignment</h3>
                <div className="space-y-3">
                  {digitalAlignmentOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-3">
                      <Checkbox
                        id={`digital-${option}`}
                        checked={businessCaseData.digitalAlignment.includes(option)}
                        onCheckedChange={(checked) => updateAlignment('digital', option, checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <Label htmlFor={`digital-${option}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label htmlFor="timeline" className="text-lg font-semibold">Project Timeline</Label>
              <Textarea
                id="timeline"
                value={businessCaseData.timeline}
                onChange={(e) => setBusinessCaseData(prev => ({ ...prev, timeline: e.target.value }))}
                placeholder="Outline the project timeline, key milestones, and critical dependencies..."
                rows={6}
                className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <Label htmlFor="budget" className="text-lg font-semibold">Budget & Financial Impact</Label>
              <Textarea
                id="budget"
                value={businessCaseData.budget}
                onChange={(e) => setBusinessCaseData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="Provide budget estimates, ROI projections, and financial impact analysis..."
                rows={6}
                className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Implementation Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {implementationOptions.map((option, index) => (
                  <Card key={index} className={`cursor-pointer transition-all hover:shadow-lg ${option.recommended ? 'ring-2 ring-blue-600' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        {option.recommended && (
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Timeline:</span>
                          <span className="text-sm text-muted-foreground">{option.timeline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Cost:</span>
                          <span className="text-sm text-muted-foreground">{option.cost}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="risks" className="text-lg font-semibold">Risk Assessment</Label>
              <Textarea
                id="risks"
                value={businessCaseData.risks}
                onChange={(e) => setBusinessCaseData(prev => ({ ...prev, risks: e.target.value }))}
                placeholder="Identify key risks, mitigation strategies, and contingency plans..."
                rows={6}
                className="mt-2 px-6 py-4 border-2 rounded-xl focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPreview = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Business Case Preview</h2>
        <p className="text-gray-600">Review your AI-enhanced business case before finalizing</p>
        <div className="flex justify-center space-x-4 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(false)}
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit & Enhance</span>
          </Button>
          <Button 
            onClick={() => setCurrentStep(2)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Accept & Continue</span>
          </Button>
          <Button 
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate Draft</span>
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Project Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg mb-2">{businessCaseData.title}</h3>
            <p className="text-gray-600">{businessCaseData.description}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Business Driver</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{businessCaseData.businessDriver}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Expected Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{businessCaseData.expectedBenefits}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Strategic Alignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Corporate</h4>
                  <div className="flex flex-wrap gap-2">
                    {businessCaseData.corporateAlignment.map((item, index) => (
                      <Badge key={index} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Digital</h4>
                  <div className="flex flex-wrap gap-2">
                    {businessCaseData.digitalAlignment.map((item, index) => (
                      <Badge key={index} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Stakeholders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm">{businessCaseData.stakeholders}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm">{businessCaseData.timeline}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Budget</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm">{businessCaseData.budget}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{businessCaseData.risks}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
        <PageHeader title="Business Case Builder"  />
    
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        

        {renderProgressIndicator()}

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-lg p-8 mb-8">
          {showPreview ? renderPreview() : renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Business Case</span>
            </Button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default BusinessCaseBuilder;