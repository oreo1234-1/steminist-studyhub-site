import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Simulate sending (in production, connect to an edge function or email service)
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    toast({ title: "Message sent! ✉️", description: "We'll get back to you within 24 hours." });
  };

  const contactInfo = [
    { type: "Email", value: "info@steminststudyhub.org", description: "General inquiries and support" },
    { type: "Phone", value: "(555) 123-STEM", description: "Monday - Friday, 9 AM - 5 PM EST" },
    { type: "Address", value: "123 Education Blvd, Learning City, LC 12345", description: "Our main office location" },
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have questions? Want to get involved? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Send us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground">Thank you for reaching out. We'll respond within 24 hours.</p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" }); }}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="font-semibold text-primary mb-1">{info.type}</div>
                  <div className="text-lg font-medium text-foreground mb-1">{info.value}</div>
                  <div className="text-sm text-muted-foreground">{info.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "How can I join the program?", a: "Simply sign up on our platform and complete the brief application. All materials and resources are free to access once you're registered." },
              { q: "Can I volunteer as a mentor?", a: "Yes! We're always looking for STEM professionals who want to give back. Contact us to learn about our mentor application process." },
              { q: "Are there age requirements?", a: "Our programs primarily serve middle and high school students (ages 11-18), but we also have resources for college students and adult learners." },
              { q: "How can organizations partner with us?", a: "We partner with schools, community organizations, and companies. Contact us to discuss collaboration opportunities." },
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader><CardTitle className="text-primary">{faq.q}</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">{faq.a}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
