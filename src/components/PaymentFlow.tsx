'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Lock,
  Star,
  User
} from 'lucide-react';

interface PaymentFlowProps {
  bidAmount: number;
  transporterName: string;
  transporterRating?: number;
  petName: string;
  route: string;
  pickupDate: string;
  deliveryDate: string;
  onPaymentComplete: () => void;
}

export default function PaymentFlow({
  bidAmount,
  transporterName,
  transporterRating = 4.9,
  petName,
  route,
  pickupDate,
  deliveryDate,
  onPaymentComplete
}: PaymentFlowProps) {
  const [paymentStep, setPaymentStep] = useState<'review' | 'payment' | 'processing' | 'complete'>('review');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const platformFee = bidAmount * 0.03; // 3% platform fee
  const totalAmount = bidAmount + platformFee;

  const handlePayment = async () => {
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('complete');
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 3000);
  };

  const renderStepContent = () => {
    switch (paymentStep) {
      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Booking</h3>
              <p className="text-gray-600">Please review the details before payment</p>
            </div>

            {/* Transport Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transport Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pet:</span>
                  <span className="font-medium">{petName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-medium">{new Date(pickupDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium">{new Date(deliveryDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Transporter Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Transporter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {transporterName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{transporterName}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{transporterRating} • Verified Professional</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600">Insured</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Service:</span>
                  <span className="font-medium">${bidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (3%):</span>
                  <span className="font-medium">${platformFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Escrow Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Secure Escrow Payment</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Your payment is held securely until your pet is safely delivered. 
                    Funds are only released to the transporter after you confirm delivery.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setPaymentStep('payment')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              Proceed to Payment
            </Button>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Enter your payment details</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>256-bit SSL encryption</span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Payment Protection</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your card will be charged ${totalAmount.toFixed(2)}. Funds are held in escrow 
                    and only released when you confirm your pet's safe delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setPaymentStep('review')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                Pay ${totalAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
            <h3 className="text-2xl font-bold text-gray-900">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your secure payment...</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure transaction in progress</span>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-gray-600">
              Your booking is confirmed. {transporterName} will contact you shortly to arrange pickup details.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-800 space-y-1 text-left">
                <li>• You'll receive a confirmation email with all details</li>
                <li>• The transporter will contact you within 24 hours</li>
                <li>• Track your pet's journey in real-time</li>
                <li>• Confirm delivery to release payment</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderStepContent()}
    </div>
  );
}