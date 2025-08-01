import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    gradeLevel: '',
    interests: [] as string[],
    stemGoals: '',
    bio: ''
  });

  const totalSteps = 4;

  const stemSubjects = [
    'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Computer Science',
    'Engineering', 'Environmental Science', 'Medicine', 'Data Science',
    'Robotics', 'Biotechnology', 'Astronomy'
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          interests: formData.interests,
          stem_goals: formData.stemGoals,
          bio: formData.bio,
          portfolio_data: {
            grade_level: formData.gradeLevel,
            onboarding_completed: true
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome to STEMinist Study Hub! 🎉",
        description: "Your profile has been set up successfully. Let's start your STEM journey!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim() !== '';
      case 2:
        return formData.gradeLevel !== '';
      case 3:
        return formData.interests.length > 0;
      case 4:
        return formData.stemGoals.trim() !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
                Let's get to know you! ✨
              </h2>
              <p className="text-muted-foreground">
                What should we call you?
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="text-lg py-3"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
                What's your grade level? 📚
              </h2>
              <p className="text-muted-foreground">
                This helps us recommend age-appropriate content
              </p>
            </div>
            <RadioGroup
              value={formData.gradeLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}
              className="space-y-3"
            >
              {[
                'Middle School (6th-8th grade)',
                'High School (9th-12th grade)', 
                'College/University',
                'Graduate School',
                'Professional/Working'
              ].map((grade) => (
                <div key={grade} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/5">
                  <RadioGroupItem value={grade} id={grade} />
                  <Label htmlFor={grade} className="flex-1 cursor-pointer">
                    {grade}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
                What STEM subjects interest you? 🔬
              </h2>
              <p className="text-muted-foreground">
                Select all that apply - we'll personalize your experience!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stemSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/5">
                  <Checkbox
                    id={subject}
                    checked={formData.interests.includes(subject)}
                    onCheckedChange={(checked) => handleInterestChange(subject, checked as boolean)}
                  />
                  <Label htmlFor={subject} className="flex-1 cursor-pointer text-sm">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
                What are your STEM goals? 🎯
              </h2>
              <p className="text-muted-foreground">
                Tell us about your dreams and aspirations in STEM
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stemGoals">Your STEM Goals</Label>
                <Textarea
                  id="stemGoals"
                  placeholder="e.g., I want to become a biomedical engineer and help develop medical devices..."
                  value={formData.stemGoals}
                  onChange={(e) => setFormData(prev => ({ ...prev, stemGoals: e.target.value }))}
                  className="min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Tell us a bit about yourself (optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Share anything you'd like the community to know about you..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="min-h-20"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-ivory to-pale-beige flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-accent" />
            <h1 className="font-playfair text-3xl font-bold text-primary">STEMinist Study Hub</h1>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center items-center gap-2 mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i + 1 <= currentStep ? 'bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Card className="shadow-elegant border-2 border-accent/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-playfair text-2xl text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Personalize Your Experience
            </CardTitle>
            <CardDescription>
              Help us tailor STEMinist Study Hub just for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-accent/20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  {loading ? 'Setting up...' : 'Complete Setup 🎉'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;