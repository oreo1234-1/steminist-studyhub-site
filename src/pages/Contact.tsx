import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const contactInfo = [
    {
      type: "Email",
      value: "info@steminststudyhub.org",
      description: "General inquiries and support"
    },
    {
      type: "Phone", 
      value: "(555) 123-STEM",
      description: "Monday - Friday, 9 AM - 5 PM EST"
    },
    {
      type: "Address",
      value: "123 Education Blvd, Learning City, LC 12345",
      description: "Our main office location"
    }
  ];

  const offices = [
    {
      location: "Main Office",
      address: "123 Education Blvd, Learning City, LC 12345",
      hours: "Monday - Friday: 9 AM - 5 PM EST"
    },
    {
      location: "Community Center Partnership",
      address: "456 Community Ave, Outreach Town, OT 67890", 
      hours: "Tuesday & Thursday: 3 PM - 7 PM EST"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have questions? Want to get involved? We'd love to hear from you. 
            Reach out to learn more about our programs or how you can support our mission.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your inquiry..." 
                    rows={5}
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-4">
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

            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Office Locations</h3>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="font-semibold text-primary mb-2">{office.location}</div>
                      <div className="text-muted-foreground mb-1">{office.address}</div>
                      <div className="text-sm text-muted-foreground">{office.hours}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">How can I join the program?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simply sign up on our platform and complete the brief application. 
                  All materials and resources are free to access once you're registered.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Can I volunteer as a mentor?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We're always looking for STEM professionals who want to give back. 
                  Contact us to learn about our mentor application process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Are there age requirements?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our programs primarily serve middle and high school students (ages 11-18), 
                  but we also have resources for college students and adult learners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary">How can organizations partner with us?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We partner with schools, community organizations, and companies. 
                  Contact us to discuss collaboration opportunities and sponsorship options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground mb-6">
            Whether you're a student ready to explore STEM or a professional wanting to mentor, 
            there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Join as a Student</Button>
            <Button size="lg" variant="secondary">Become a Mentor</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;