import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Crown, 
  Zap, 
  Users, 
  Award, 
  CheckCircle, 
  Star
} from "lucide-react";

const Premium = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for getting started with premium features',
      features: [
        'Basic AI Study Assistant',
        'Simple Flashcard Generator',
        'Basic Progress Tracking',
        'Email Support',
        '5 AI Conversations/day',
        'Standard Study Plans'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      description: 'Most popular plan for serious students',
      features: [
        'Advanced AI Study Assistant',
        'Smart Flashcard Generator',
        'Advanced Progress Analytics',
        'Priority Support',
        'Unlimited AI Conversations',
        'Personalized Study Plans',
        'Advanced Quiz Generator',
        'Study Session Timer',
        'Performance Analytics',
        'Custom Study Goals'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$39.99',
      period: '/month',
      description: 'For study groups and institutions',
      features: [
        'Everything in Premium',
        'Team Management',
        'Bulk User Management',
        'Custom Integrations',
        'Dedicated Support',
        'Advanced Analytics Dashboard',
        'White-label Options',
        'API Access',
        'Custom Study Modules',
        'Institution-wide Reporting'
      ],
      popular: false
    }
  ];

  const handleUpgrade = (planId: string) => {
    if (!user) {
      // Redirect to auth if not logged in
      window.location.href = '/auth';
      return;
    }
    // TODO: Implement Stripe checkout
    console.log(`Upgrading to ${planId} plan`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Helmet>
        <title>Premium Features - STEMinist Study Hub</title>
        <meta name="description" content="Unlock advanced AI study tools, personalized learning plans, and premium features to supercharge your STEM education journey." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-accent text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="h-12 w-12 text-accent" />
              <h1 className="text-5xl md:text-6xl font-playfair font-bold">
                Premium Features
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Unlock the full potential of your STEM education with our advanced AI-powered study tools
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Zap className="h-4 w-4 mr-1" />
                AI-Powered Learning
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="h-4 w-4 mr-1" />
                Community Access
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Award className="h-4 w-4 mr-1" />
                Advanced Analytics
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan to enhance your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-elegant ${
                  plan.popular ? 'ring-2 ring-accent scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-primary">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-accent hover:bg-accent/90 text-white' 
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {user ? 'Upgrade Now' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Ready to Supercharge Your Learning?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of students who are already using our premium features to excel in STEM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleUpgrade('premium')}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Crown className="h-5 w-5 mr-2" />
              Start Premium Trial
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/contact">Contact Sales</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Premium;