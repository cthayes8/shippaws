'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  Shield, 
  MapPin, 
  MessageCircle, 
  CreditCard,
  Heart,
  Truck,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

const customerSteps = [
  {
    step: 1,
    icon: <Search className="w-8 h-8" />,
    title: "Post Your Request",
    description: "Tell us about your pet's journey with pickup and delivery locations, dates, and special requirements.",
    details: [
      "Enter pickup and delivery locations",
      "Select preferred dates and times",
      "Add your pet's details and special needs",
      "Set your budget preferences"
    ]
  },
  {
    step: 2,
    icon: <Users className="w-8 h-8" />,
    title: "Receive Bids",
    description: "Verified transporters review your request and submit competitive bids with their rates and schedules.",
    details: [
      "Get multiple quotes within hours",
      "Review transporter profiles and ratings",
      "Compare prices and service offerings",
      "Ask questions directly to transporters"
    ]
  },
  {
    step: 3,
    icon: <Shield className="w-8 h-8" />,
    title: "Choose & Travel",
    description: "Select your preferred transporter, complete secure payment, and track your pet's journey in real-time.",
    details: [
      "Choose the best transporter for your needs",
      "Secure payment with escrow protection",
      "Real-time tracking and updates",
      "24/7 customer support throughout"
    ]
  }
];

const transporterSteps = [
  {
    step: 1,
    icon: <MapPin className="w-8 h-8" />,
    title: "Find Jobs",
    description: "Browse available transport requests in your area and filter by distance, pet type, and schedule.",
    details: [
      "Search jobs by location and route",
      "Filter by pet types you specialize in",
      "View job details and requirements",
      "Check customer ratings and reviews"
    ]
  },
  {
    step: 2,
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Submit Bids",
    description: "Send competitive bids with your rates, availability, and personalized service offerings.",
    details: [
      "Set your competitive rates",
      "Show your availability and flexibility",
      "Highlight your experience and specialties",
      "Communicate directly with pet owners"
    ]
  },
  {
    step: 3,
    icon: <CreditCard className="w-8 h-8" />,
    title: "Get Paid",
    description: "Complete the transport safely, confirm delivery, and receive payment securely through our platform.",
    details: [
      "Transport pets safely and professionally",
      "Provide regular updates to owners",
      "Confirm delivery and get customer approval",
      "Receive secure payment within 24 hours"
    ]
  }
];

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState("customers");
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const currentSteps = activeTab === "customers" ? customerSteps : transporterSteps;

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white to-blue-50/30"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6" style={{fontFamily: 'Inter, Montserrat, sans-serif'}}>
              How Ship Paws Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Whether you're a pet owner seeking safe transportation or a professional transporter 
              looking to grow your business, we make the process simple and secure.
            </p>
            
            {/* Enhanced Tab Selector */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-lg mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 p-2 rounded-2xl">
                <TabsTrigger 
                  value="customers" 
                  className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 font-semibold"
                  style={{fontFamily: 'Inter, Montserrat, sans-serif'}}
                >
                  <Heart className="w-5 h-5" />
                  For Pet Owners
                </TabsTrigger>
                <TabsTrigger 
                  value="transporters" 
                  className="flex items-center gap-3 px-6 py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 font-semibold"
                  style={{fontFamily: 'Inter, Montserrat, sans-serif'}}
                >
                  <Truck className="w-5 h-5" />
                  For Transporters
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {currentSteps.map((step, index) => (
              <Card 
                key={step.step}
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                  hoveredStep === step.step ? 'shadow-xl scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredStep(step.step)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step number badge */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.step}
                </div>

                <CardContent className="p-8">
                  <div className={`mb-6 p-4 rounded-full w-fit mx-auto transition-colors ${
                    hoveredStep === step.step 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-4">
                    {step.description}
                  </p>

                  {/* Expandable details */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    hoveredStep === step.step ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-gray-200">
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers and professional transporters on Ship Paws
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Heart className="w-5 h-5 mr-2" />
                Get Quote as Pet Owner
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400"
              >
                <Truck className="w-5 h-5 mr-2" />
                Join as Transporter
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}