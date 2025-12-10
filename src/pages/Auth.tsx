import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { AlertCircle, Sparkles, Mail, Lock, User, Github, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [showVerificationReminder, setShowVerificationReminder] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user arrived via password reset link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    if (type === 'recovery') {
      setShowPasswordUpdate(true);
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && !showPasswordUpdate) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('portfolio_data')
          .eq('id', session.user.id)
          .single();
        
        const hasCompletedOnboarding = profile?.portfolio_data && 
          typeof profile.portfolio_data === 'object' && 
          'onboarding_completed' in profile.portfolio_data ? 
          (profile.portfolio_data as any).onboarding_completed : false;
        navigate(hasCompletedOnboarding ? '/' : '/onboarding');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowPasswordUpdate(true);
      } else if (event === 'SIGNED_IN' && session && !showPasswordUpdate) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('portfolio_data')
          .eq('id', session.user.id)
          .single();
        
        const hasCompletedOnboarding = profile?.portfolio_data && 
          typeof profile.portfolio_data === 'object' && 
          'onboarding_completed' in profile.portfolio_data ? 
          (profile.portfolio_data as any).onboarding_completed : false;
        navigate(hasCompletedOnboarding ? '/' : '/onboarding');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showPasswordUpdate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setShowVerificationReminder(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setUnverifiedEmail(email);
          setShowVerificationReminder(true);
          setError('Please verify your email before signing in.');
        } else {
          setError(error.message);
        }
      } else if (data.user && !data.user.email_confirmed_at) {
        setUnverifiedEmail(email);
        setShowVerificationReminder(true);
        setError('Please verify your email before signing in.');
        await supabase.auth.signOut();
      } else {
        toast.success('Welcome back!');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unverifiedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Verification email sent! Please check your inbox.');
        toast.success('Verification email sent!');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success('Password updated successfully!');
        setShowPasswordUpdate(false);
        setPassword('');
        setConfirmPassword('');
        // Clear the hash from URL
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else {
          setError(error.message);
        }
      } else {
        setMessage('Check your email for the confirmation link!');
        toast.success('Account created! Check your email to confirm.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'apple') => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('provider is not enabled')) {
          setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not enabled yet. Please enable it in Supabase Authentication settings.`);
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the password reset link!');
        toast.success('Password reset email sent!');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Google Icon Component
  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  // Apple Icon Component
  const AppleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );

  return (
    <>
      <Helmet>
        <title>Join Us | STEMinist Study Hub</title>
        <meta name="description" content="Join the STEMinist Study Hub community. Sign up to access study resources, mentorship, and connect with other women in STEM." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:flex flex-col space-y-8 p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                STEMinist Study Hub
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground leading-tight">
                Empowering the next generation of 
                <span className="text-primary"> women in STEM</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join our vibrant community of learners, mentors, and future leaders. 
                Access study resources, connect with peers, and unlock your full potential.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Active Members', value: '5,000+' },
                { label: 'Study Resources', value: '500+' },
                { label: 'Expert Mentors', value: '100+' },
                { label: 'Success Stories', value: '1,000+' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50 hover:border-primary/30 transition-colors">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth Form */}
          <Card className="w-full max-w-md mx-auto shadow-2xl border-border/50 backdrop-blur">
            <CardHeader className="text-center space-y-2 pb-2">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">STEMinist Study Hub</span>
              </div>
              <CardTitle className="text-2xl font-bold">Join Our Community</CardTitle>
              <CardDescription>
                Start your journey to STEM excellence today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && (
                <Alert className="border-primary/50 bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary">{message}</AlertDescription>
                </Alert>
              )}

              {/* Email Verification Reminder */}
              {showVerificationReminder && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <Mail className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    <div className="space-y-2">
                      <p>Your email hasn't been verified yet. Please check your inbox for the verification link.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={loading}
                        className="border-amber-500/50 hover:bg-amber-500/10"
                      >
                        {loading ? 'Sending...' : 'Resend verification email'}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {showPasswordUpdate ? (
                /* Password Update Form */
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Set your new password</h3>
                    <p className="text-sm text-muted-foreground">
                      Please enter your new password below.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11"
                          required
                          disabled={loading}
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 h-11"
                          required
                          disabled={loading}
                          minLength={6}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-medium"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>
              ) : showForgotPassword ? (
                /* Forgot Password Form */
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError('');
                      setMessage('');
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </button>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Reset your password</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 text-base font-medium"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                </div>
              ) : (
                /* Main Auth Form */
                <>
                  {/* OAuth Buttons */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-medium gap-3 hover:bg-accent/50 transition-all border-2"
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={loading}
                    >
                      <GoogleIcon />
                      Continue with Google
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-medium gap-3 hover:bg-accent/50 transition-all border-2"
                      onClick={() => handleOAuthSignIn('apple')}
                      disabled={loading}
                    >
                      <AppleIcon />
                      Continue with Apple
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-medium gap-3 hover:bg-accent/50 transition-all border-2"
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={loading}
                    >
                      <Github className="h-5 w-5" />
                      Continue with GitHub
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>

                  {/* Email Auth Tabs */}
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signin-email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 h-11"
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signin-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signin-password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10 h-11"
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full h-11 text-base font-medium"
                          disabled={loading}
                        >
                          {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true);
                            setError('');
                            setMessage('');
                          }}
                          className="w-full text-sm text-primary hover:underline"
                        >
                          Forgot your password?
                        </button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="Your full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="pl-10 h-11"
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 h-11"
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10 h-11"
                              minLength={6}
                              required
                              disabled={loading}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full h-11 text-base font-medium"
                          disabled={loading}
                        >
                          {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              <p className="text-xs text-center text-muted-foreground pt-2">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Auth;
