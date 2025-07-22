'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, Heart, Truck } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  userType: 'customer' | 'transporter';
  rating: number;
  text: string;
  route?: string;
  petType?: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    location: 'Los Angeles, CA',
    userType: 'customer',
    rating: 5,
    text: "Ship Paws made moving my dog across the country stress-free. The transporter was professional and sent updates throughout the journey. Highly recommend!",
    route: 'Los Angeles to New York',
    petType: 'Golden Retriever',
    featured: true
  },
  {
    id: '2',
    name: 'Michael R.',
    location: 'Chicago, IL',
    userType: 'customer',
    rating: 5,
    text: "Excellent service! My cats arrived happy and healthy. The ability to track their journey in real-time gave me peace of mind. Will use again!",
    route: 'Chicago to Miami',
    petType: '2 Cats'
  },
  {
    id: '3',
    name: 'David T.',
    location: 'Austin, TX',
    userType: 'transporter',
    rating: 5,
    text: "Ship Paws has transformed my pet transport business. The platform makes it easy to find jobs and the payment system is reliable. Great community!",
    route: 'Texas Routes'
  },
  {
    id: '4',
    name: 'Emily S.',
    location: 'Seattle, WA',
    userType: 'customer',
    rating: 5,
    text: "The quote process was simple and transparent. Our transporter was caring and experienced. Our puppy had a comfortable journey. Thank you Ship Paws!",
    route: 'Seattle to Denver',
    petType: 'Labrador Puppy',
    featured: true
  },
  {
    id: '5',
    name: 'Jennifer L.',
    location: 'Phoenix, AZ',
    userType: 'transporter',
    rating: 5,
    text: "As a professional pet transporter, Ship Paws gives me access to quality clients who truly care about their pets. The bidding system is fair and efficient.",
    route: 'Southwest Region'
  },
  {
    id: '6',
    name: 'Robert K.',
    location: 'Boston, MA',
    userType: 'customer',
    rating: 5,
    text: "Moving our elderly cat required special care, and our transporter went above and beyond. The real-time updates kept us informed every step of the way.",
    route: 'Boston to Orlando',
    petType: 'Senior Cat'
  }
];

export default function TestimonialsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'customer' | 'transporter'>('all');

  const filteredTestimonials = testimonials.filter(testimonial => 
    activeFilter === 'all' || testimonial.userType === activeFilter
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of satisfied pet owners and professional transporters who trust Ship Paws 
              for safe, reliable pet transportation services.
            </p>

            {/* Filter buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setActiveFilter('customer')}
                className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                  activeFilter === 'customer' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className="w-4 h-4" />
                Pet Owners
              </button>
              <button
                onClick={() => setActiveFilter('transporter')}
                className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                  activeFilter === 'transporter' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Truck className="w-4 h-4" />
                Transporters
              </button>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  testimonial.featured ? 'ring-2 ring-blue-200 shadow-md' : ''
                }`}
              >
                {testimonial.featured && (
                  <Badge 
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    Featured
                  </Badge>
                )}

                <CardContent className="p-6">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-gray-300 mb-4" />
                  
                  {/* Rating */}
                  <div className="mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* User info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {testimonial.name}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            testimonial.userType === 'customer' 
                              ? 'bg-pink-100 text-pink-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {testimonial.userType === 'customer' ? (
                            <>
                              <Heart className="w-3 h-3 mr-1" />
                              Pet Owner
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3 mr-1" />
                              Transporter
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div>{testimonial.location}</div>
                        {testimonial.route && (
                          <div className="text-xs text-gray-500 mt-1">
                            {testimonial.petType ? `${testimonial.petType} • ` : ''}
                            {testimonial.route}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats footer */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Trusted by Thousands
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
                  <div className="text-gray-600">Safe Journeys</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified Transporters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}