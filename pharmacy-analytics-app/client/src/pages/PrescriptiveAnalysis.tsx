import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Target, Zap, TrendingUp, CheckCircle2, Clock, DollarSign, MapPin, Package, Store } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PrescriptiveAnalysis({ months }: { months: number }) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const criticalInitiatives = [
    {
      id: 1,
      title: 'Urban Expansion Program',
      priority: 'CRITICAL',
      impact: 'Revenue +€1.7M-2.6M annually',
      timeline: '12-24 months',
      capital: '€3M-5M',
      roi: '200-300%',
      category: 'Location Strategy',
      description: 'Open 15-25 new urban pharmacy locations in high-growth markets',
      targets: ['Germany', 'France', 'Poland', 'Netherlands'],
      actions: [
        'Identify 25-35 high-potential urban locations',
        'Conduct market analysis and feasibility studies',
        'Secure real estate and regulatory approvals',
        'Establish operations with premium positioning',
        'Implement best practices from top locations'
      ]
    },
    {
      id: 2,
      title: 'Expand High-Margin Product Categories',
      priority: 'CRITICAL',
      impact: 'Revenue +€520K-780K annually',
      timeline: '6-12 months',
      capital: '€500K-800K',
      roi: '150-200%',
      category: 'Revenue Optimization',
      description: 'Increase Wellness and Personal Care inventory by 30-40%',
      targets: ['All Regions'],
      actions: [
        'Increase Wellness product inventory by 30-40%',
        'Launch Personal Care premium lines (49.3% growth potential)',
        'Develop bundled offerings combining OTC + Wellness products',
        'Create targeted marketing campaigns for high-margin categories'
      ]
    },
    {
      id: 3,
      title: 'Rapid Location Expansion in Growth Markets',
      priority: 'CRITICAL',
      impact: 'Revenue +€1.3M-2.2M annually',
      timeline: '12-18 months',
      capital: '€2M-3M',
      roi: '180-250%',
      category: 'Regional Strategy',
      description: 'Open 15-20 new pharmacy locations in Poland and Netherlands',
      targets: ['Poland', 'Netherlands'],
      actions: [
        'Identify 20-30 high-potential locations in Poland',
        'Secure real estate and regulatory approvals',
        'Establish supply chain and operations',
        'Hire and train local staff',
        'Launch marketing campaigns'
      ]
    }
  ];

  const highPriorityActions = [
    {
      id: 4,
      title: 'Implement Dynamic Pricing Strategy',
      priority: 'HIGH',
      impact: 'Revenue +€260K-430K annually',
      timeline: '3-6 months',
      capital: '€100K-200K',
      roi: '200-300%',
      category: 'Revenue Optimization',
      regulatory_note: 'Compliance required in Germany, France, Italy, Spain, Belgium, Austria. More flexibility in Netherlands and Poland.',
      actions: [
        'Analyze price elasticity by product category and region',
        'Implement premium pricing for high-margin wellness products',
        'Optimize OTC medication pricing within regulatory limits',
        'Test dynamic pricing in less-regulated markets'
      ]
    },
    {
      id: 5,
      title: 'Develop Value-Added Services',
      priority: 'HIGH',
      impact: 'Revenue +€430K-690K annually',
      timeline: '6-9 months',
      capital: '€200K-400K',
      roi: '150-250%',
      category: 'Revenue Optimization',
      actions: [
        'Launch health screening services (blood pressure, glucose monitoring)',
        'Develop chronic disease management programs',
        'Offer medication consultation and adherence programs',
        'Create health education workshops and seminars'
      ]
    },
    {
      id: 6,
      title: 'Premium Service Differentiation',
      priority: 'HIGH',
      impact: 'Market share +2-3%',
      timeline: '6-12 months',
      capital: '€300K-600K',
      roi: '120-180%',
      category: 'Regional Strategy',
      targets: ['Germany', 'France', 'Belgium'],
      actions: [
        'Upgrade store design in top-performing locations',
        'Develop specialty pharmaceutical services',
        'Create VIP customer programs',
        'Implement health consultation services'
      ]
    },
    {
      id: 7,
      title: 'Best Practice Implementation Across Network',
      priority: 'HIGH',
      impact: 'Revenue +€430K-690K annually',
      timeline: '6-12 months',
      capital: '€150K-300K',
      roi: '200-350%',
      category: 'Location Strategy',
      benchmark_locations: ['PH0095 (Germany, €162K)', 'PH0023 (Netherlands, €159K)', 'PH0058 (Netherlands, €159K)'],
      actions: [
        'Document best practices from top 10 locations',
        'Conduct operational audits',
        'Implement standardized procedures',
        'Provide staff training programs',
        'Monitor performance improvements'
      ]
    },
    {
      id: 8,
      title: 'Promote Top-Performing Products',
      priority: 'HIGH',
      impact: 'Revenue +€345K-690K annually',
      timeline: '3-6 months',
      capital: '€100K-200K',
      roi: '200-400%',
      category: 'Product Portfolio',
      top_products: [
        'AntiBioX ACE Inhibitor 400 mg (Score: 87.7)',
        'AntiBioX Inhaler 200 mg (Score: 82.9)',
        'ZenHealth Herbal Tea Active (Score: 80.6)'
      ],
      actions: [
        'Increase shelf space for top performers',
        'Launch targeted marketing campaigns',
        'Create promotional bundles',
        'Implement staff incentives for sales'
      ]
    }
  ];

  const regulatoryByCountry = {
    'Germany': {
      regulations: ['Pharmacy Act (Apothekengesetz)', 'Price regulation for prescription drugs', 'Minimum staffing requirements'],
      constraints: ['Strict pricing controls on prescription drugs', 'Limited online sales', 'Mandatory physical presence'],
      opportunities: ['Premium wellness products', 'Health consultation services', 'Chronic disease management programs']
    },
    'France': {
      regulations: ['Code de la Santé Publique', 'Pharmacy ownership restrictions', 'Price controls on medications'],
      constraints: ['Strict location requirements', 'Limited to licensed pharmacists', 'Government price negotiations'],
      opportunities: ['Generic medication promotion', 'Health screening services', 'Wellness programs']
    },
    'Poland': {
      regulations: ['Pharmaceutical Law', 'Pharmacy licensing requirements', 'Price regulations'],
      constraints: ['Ownership restrictions being relaxed', 'Emerging market regulations', 'Price controls'],
      opportunities: ['Rapid market expansion', 'New location openings', 'Product diversification', 'Market consolidation']
    },
    'Netherlands': {
      regulations: ['Medicines Act', 'Pharmacy regulation', 'Price negotiations'],
      constraints: ['Competitive pricing environment', 'Strict regulations', 'Limited price control'],
      opportunities: ['Service differentiation', 'Health monitoring programs', 'Wellness expansion', 'Online services']
    }
  };

  // Calculate phases based on selected months
  const getImplementationPhases = () => {
    const allPhases = [
      {
        phase: 'Phase 1: Months 1-6',
        focus: 'Quick Wins & Foundation',
        initiatives: [
          'Implement dynamic pricing pilot',
          'Launch top product promotion campaigns',
          'Begin underperforming product review',
          'Conduct market analysis for expansion',
          'Develop value-added services plan'
        ],
        expected_impact: 'Revenue +€260K-430K',
        monthRange: [1, 6]
      },
      {
        phase: 'Phase 2: Months 7-12',
        focus: 'Expansion & Growth',
        initiatives: [
          'Expand Wellness and Personal Care inventory',
          'Launch health consultation services',
          'Begin new location site selection',
          'Implement best practices across network',
          'Launch regional marketing campaigns'
        ],
        expected_impact: 'Revenue +€520K-780K',
        monthRange: [7, 12]
      },
      {
        phase: 'Phase 3: Months 13-24',
        focus: 'Scale & Optimize',
        initiatives: [
          'Open 10-15 new urban locations',
          'Expand category-specific strategies',
          'Implement loyalty programs',
          'Develop strategic partnerships',
          'Optimize location portfolio'
        ],
        expected_impact: 'Revenue +€1.3M-2.2M',
        monthRange: [13, 24]
      },
      {
        phase: 'Phase 4: Months 25-36',
        focus: 'Consolidate & Sustain',
        initiatives: [
          'Complete location expansion program',
          'Optimize pricing and product mix',
          'Scale successful initiatives',
          'Evaluate performance against targets',
          'Plan Year 2 expansion'
        ],
        expected_impact: 'Revenue +€2.6M-4.3M cumulative',
        monthRange: [25, 36]
      },
      {
        phase: 'Phase 5: Months 37-48',
        focus: 'Growth Acceleration',
        initiatives: [
          'Expand to new geographic markets',
          'Launch advanced analytics capabilities',
          'Develop international partnerships',
          'Implement AI-driven optimization',
          'Scale successful regional models'
        ],
        expected_impact: 'Revenue +€3.5M-5.2M cumulative',
        monthRange: [37, 48]
      },
      {
        phase: 'Phase 6: Months 49-60',
        focus: 'Market Leadership',
        initiatives: [
          'Consolidate market position',
          'Develop new service offerings',
          'Implement sustainability initiatives',
          'Build brand recognition',
          'Plan long-term growth strategy'
        ],
        expected_impact: 'Revenue +€4.2M-6.8M cumulative',
        monthRange: [49, 60]
      }
    ];

    return allPhases.filter(phase => phase.monthRange[1] <= months);
  };

  const implementationPhases = getImplementationPhases();

  // Calculate success metrics based on selected months
  const getSuccessMetrics = () => {
    const allMetrics = [
      { year: 'Year 1', target: '€9.5M-10.2M', growth: '+10-18%', months: 12 },
      { year: 'Year 2', target: '€10.8M-12.1M', growth: '+14-19%', months: 24 },
      { year: 'Year 3', target: '€12.2M-14.5M', growth: '+13-20%', months: 36 },
      { year: 'Year 4', target: '€13.8M-16.2M', growth: '+15-22%', months: 48 },
      { year: 'Year 5', target: '€15.8M-19.4M', growth: '+83-125% cumulative', months: 60 }
    ];

    return allMetrics.filter(metric => metric.months <= months);
  };

  const successMetrics = getSuccessMetrics();

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card className="shadow-md border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Prescriptive Analysis: Strategic Recommendations
          </CardTitle>
          <CardDescription>
            Data-driven action plan with regulatory compliance, resource allocation, and ROI projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Total Revenue Opportunity</p>
              <p className="text-2xl font-bold text-slate-900">€4.2M-6.8M</p>
              <p className="text-xs text-slate-500 mt-1">3-5 year horizon</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Capital Required</p>
              <p className="text-2xl font-bold text-slate-900">€5.5M-8.8M</p>
              <p className="text-xs text-slate-500 mt-1">Investment needed</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Expected ROI</p>
              <p className="text-2xl font-bold text-slate-900">200-300%</p>
              <p className="text-xs text-slate-500 mt-1">5-year return</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Implementation Timeline</p>
              <p className="text-2xl font-bold text-slate-900">24-36 mo</p>
              <p className="text-xs text-slate-500 mt-1">Full execution</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeframe is controlled by the global selector at the top of the page */}

      {/* Main Tabs */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
          <TabsTrigger value="critical" className="text-xs sm:text-sm">
            <Zap className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Critical</span>
          </TabsTrigger>
          <TabsTrigger value="high" className="text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">High Priority</span>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="text-xs sm:text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Roadmap</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
        </TabsList>

        {/* Critical Initiatives */}
        <TabsContent value="critical" className="space-y-4">
          <div className="grid gap-4">
            {criticalInitiatives.map((initiative) => (
              <Card key={initiative.id} className="shadow-md border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {initiative.title}
                        <Badge className={`${getPriorityColor(initiative.priority)} border`}>
                          {initiative.priority}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">{initiative.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Revenue Impact</p>
                      <p className="font-semibold text-slate-900">{initiative.impact}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Timeline</p>
                      <p className="font-semibold text-slate-900">{initiative.timeline}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Capital Required</p>
                      <p className="font-semibold text-slate-900">{initiative.capital}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Expected ROI</p>
                      <p className="font-semibold text-slate-900">{initiative.roi}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Action Plan:</h5>
                    <ol className="space-y-2">
                      {initiative.actions.map((action, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-700">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">{idx + 1}</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {initiative.targets && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-2">Target Markets:</p>
                      <div className="flex flex-wrap gap-2">
                        {initiative.targets.map((target, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-700 border-blue-300 border">{target}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* High Priority Actions */}
        <TabsContent value="high" className="space-y-4">
          <div className="grid gap-4">
            {highPriorityActions.map((action) => (
              <Card key={action.id} className="shadow-md border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {action.title}
                        <Badge className={`${getPriorityColor(action.priority)} border`}>
                          {action.priority}
                        </Badge>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Impact</p>
                      <p className="font-semibold text-slate-900 text-sm">{action.impact}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Timeline</p>
                      <p className="font-semibold text-slate-900 text-sm">{action.timeline}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">Capital</p>
                      <p className="font-semibold text-slate-900 text-sm">{action.capital}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-600 mb-1">ROI</p>
                      <p className="font-semibold text-slate-900 text-sm">{action.roi}</p>
                    </div>
                  </div>

                  {action.regulatory_note && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-900 text-sm">
                        <strong>Regulatory Note:</strong> {action.regulatory_note}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Implementation Steps:</h5>
                    <ul className="space-y-2">
                      {action.actions.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-700">
                          <span className="flex-shrink-0 text-green-600">✓</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Implementation Roadmap */}
        <TabsContent value="roadmap" className="space-y-4">
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                24-Month Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {implementationPhases.map((phase, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {idx + 1}
                        </div>
                        {idx < implementationPhases.length - 1 && (
                          <div className="w-1 h-20 bg-blue-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-bold text-slate-900 text-lg">{phase.phase}</h4>
                        <p className="text-sm text-slate-600 mb-3">{phase.focus}</p>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-3">
                          <p className="text-xs font-semibold text-slate-600 mb-2">KEY INITIATIVES:</p>
                          <ul className="space-y-1">
                            {phase.initiatives.map((init, i) => (
                              <li key={i} className="text-sm text-slate-700 flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>{init}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-green-700">EXPECTED IMPACT: {phase.expected_impact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Targets */}
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Revenue Growth Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {successMetrics.map((metric, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-slate-900">{metric.year}</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{metric.target}</p>
                    <p className="text-sm text-green-700 mt-1">{metric.growth}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regulatory Compliance */}
        <TabsContent value="compliance" className="space-y-4">
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Country-Specific Regulatory Requirements
              </CardTitle>
              <CardDescription>
                Compliance checklist and market-specific constraints for all recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(regulatoryByCountry).map(([country, details]) => (
                  <div key={country} className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {country}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">KEY REGULATIONS:</p>
                        <ul className="space-y-1">
                          {details.regulations.map((reg, idx) => (
                            <li key={idx} className="text-sm text-slate-700">• {reg}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">CONSTRAINTS:</p>
                        <ul className="space-y-1">
                          {details.constraints.map((constraint, idx) => (
                            <li key={idx} className="text-sm text-slate-700">• {constraint}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">OPPORTUNITIES:</p>
                        <ul className="space-y-1">
                          {details.opportunities.map((opp, idx) => (
                            <li key={idx} className="text-sm text-slate-700">• {opp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          <Card className="shadow-md border-slate-200">
            <CardHeader>
              <CardTitle>Implementation Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Regulatory Approval</p>
                    <p className="text-sm text-slate-600">Obtain all necessary regulatory approvals for new locations and services in each country</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Pricing Compliance</p>
                    <p className="text-sm text-slate-600">Ensure all pricing strategies comply with local price controls and regulations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Staffing Requirements</p>
                    <p className="text-sm text-slate-600">Meet minimum staffing and pharmacist requirements in all markets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Data Protection</p>
                    <p className="text-sm text-slate-600">Ensure GDPR and local data protection compliance for customer information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Product Registration</p>
                    <p className="text-sm text-slate-600">Ensure all new products are registered and approved in each market</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Insights */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Strategic Insight:</strong> This prescriptive analysis identifies €4.2M-6.8M in revenue opportunities over 3-5 years through 
          aggressive expansion in high-growth markets (Poland, Netherlands), optimization of high-margin product categories (Wellness, Personal Care), 
          and best practice implementation across the 120-location network. Success requires disciplined execution, regulatory compliance in all markets, 
          and strategic capital allocation across the three critical initiative streams.
        </AlertDescription>
      </Alert>
    </div>
  );
}
