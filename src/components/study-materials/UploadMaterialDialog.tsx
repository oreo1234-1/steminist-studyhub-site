import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const EDUCATION_LEVELS = {
  "Middle School": "🟦",
  "High School": "🟩",
  "College": "🟥"
};

const SUBJECTS = {
  "Middle School": {
    "Science": [
      "Life Science",
      "Earth & Space Science",
      "Physical Science",
      "Environmental Science",
      "Human Biology (intro)",
      "Ecology",
      "Astronomy",
      "Chemistry Basics",
      "Physics Basics",
      "Weather & Climate",
      "Geology",
      "Scientific Method / Lab Skills"
    ],
    "Technology": [
      "Computer Basics",
      "Digital Literacy",
      "Keyboarding",
      "Basic Coding (Scratch, Blockly)",
      "Robotics (LEGO / VEX)",
      "3D Printing Basics",
      "Intro to Engineering",
      "Internet Safety & Cyber Awareness",
      "Simple Game Design (Scratch)"
    ],
    "Engineering": [
      "Engineering Design Process",
      "Structural Engineering (bridges, towers)",
      "Simple Machines",
      "Robotics Engineering",
      "Energy Systems",
      "Renewable Energy",
      "Engineering Challenges (prototypes, models)"
    ],
    "Math": [
      "Arithmetic Review",
      "Pre-Algebra",
      "Algebra I (sometimes grade 8)",
      "Geometry Basics",
      "Data & Graphing",
      "Probability & Statistics (intro)",
      "Ratios, Proportions, and Percent"
    ]
  },
  "High School": {
    "Science": [
      "General Biology",
      "Honors Biology",
      "AP Biology",
      "General Chemistry",
      "Honors Chemistry",
      "AP Chemistry",
      "Conceptual Physics",
      "Honors Physics",
      "AP Physics 1",
      "AP Physics 2",
      "AP Physics C: Mechanics",
      "AP Physics C: Electricity & Magnetism",
      "Anatomy & Physiology",
      "Environmental Science (Honors)",
      "AP Environmental Science",
      "Marine Biology",
      "Forensic Science",
      "Astronomy (advanced)"
    ],
    "Technology & Computer Science": [
      "Computer Science Principles",
      "AP Computer Science Principles",
      "AP Computer Science A",
      "Web Development",
      "App Development",
      "Game Development",
      "Cybersecurity (intro)",
      "AI / Machine Learning (intro)",
      "Robotics",
      "IT Fundamentals",
      "Data Science (intro)"
    ],
    "Engineering": [
      "Engineering Design I",
      "Engineering Design II",
      "Robotics Engineering",
      "STEM Lab / Makerspace",
      "Architectural Engineering",
      "Civil Engineering (intro)",
      "Mechanical Engineering (intro)",
      "Aerospace Engineering (intro)",
      "Environmental Engineering",
      "CAD Design (AutoCAD, SolidWorks)",
      "Electronics Engineering"
    ],
    "Math": [
      "Algebra I",
      "Geometry",
      "Algebra II",
      "Pre-Calculus",
      "Honors Pre-Calculus",
      "Statistics",
      "AP Statistics",
      "AP Precalculus",
      "Calculus",
      "AP Calculus AB",
      "AP Calculus BC",
      "Discrete Math (some schools)",
      "Linear Algebra (rare but offered)"
    ]
  },
  "College": {
    "Biology & Life Sciences": [
      "General Biology I & II",
      "Cell Biology",
      "Molecular Biology",
      "Genetics",
      "Microbiology",
      "Biochemistry",
      "Anatomy & Physiology",
      "Ecology",
      "Evolutionary Biology",
      "Neurobiology",
      "Marine Biology",
      "Plant Biology",
      "Biotechnology",
      "Immunology",
      "Physiology",
      "Pharmacology",
      "Parasitology"
    ],
    "Chemistry": [
      "General Chemistry I & II",
      "Organic Chemistry I & II",
      "Inorganic Chemistry",
      "Analytical Chemistry",
      "Physical Chemistry (P-Chem)",
      "Biochemistry",
      "Environmental Chemistry",
      "Materials Chemistry"
    ],
    "Physics": [
      "General Physics I & II",
      "Calculus-Based Physics",
      "Modern Physics",
      "Quantum Mechanics",
      "Thermodynamics",
      "Optics",
      "Electromagnetism",
      "Nuclear Physics",
      "Astrophysics"
    ],
    "Engineering Majors": [
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Computer Engineering",
      "Chemical Engineering",
      "Biomedical Engineering",
      "Aerospace Engineering",
      "Software Engineering",
      "Industrial Engineering",
      "Environmental Engineering",
      "Materials Science Engineering",
      "Robotics Engineering",
      "Systems Engineering",
      "Structural Engineering"
    ],
    "Computer Science & Technology": [
      "Introduction to Programming",
      "Data Structures",
      "Algorithms",
      "Web Development",
      "Software Engineering",
      "Database Systems",
      "Computer Architecture",
      "Operating Systems",
      "Machine Learning",
      "Artificial Intelligence",
      "Cybersecurity",
      "Networks & Systems",
      "Human–Computer Interaction",
      "Cloud Computing",
      "Data Science",
      "Mobile App Development"
    ],
    "Mathematics": [
      "Precalculus",
      "Calculus I, II, III",
      "Differential Equations",
      "Linear Algebra",
      "Discrete Mathematics",
      "Real Analysis",
      "Abstract Algebra",
      "Probability",
      "Statistics",
      "Numerical Methods",
      "Applied Mathematics",
      "Mathematical Modeling"
    ],
    "Earth & Environmental Sciences": [
      "Environmental Science",
      "Geology",
      "Oceanography",
      "Meteorology",
      "Climate Science",
      "Earth Systems",
      "Geographic Information Systems (GIS)"
    ]
  }
};

export function UploadMaterialDialog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    educationLevel: "",
    category: "",
    subject: "",
    difficultyLevel: "beginner",
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload materials",
        variant: "destructive"
      });
      return;
    }

    if (!formData.file || !formData.title || !formData.educationLevel || !formData.category || !formData.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png'];
    const fileExt = '.' + formData.file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, Word, PowerPoint, text, or image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (formData.file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Upload file to storage with path only
      const fileName = `${user.id}/${Date.now()}${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(fileName, formData.file);

      if (uploadError) throw uploadError;

      // Create database entry with file path (not public URL)
      const { error: dbError } = await supabase
        .from('study_materials')
        .insert({
          title: formData.title,
          description: formData.description,
          file_url: fileName,
          file_type: fileExt.substring(1),
          subject: `${EDUCATION_LEVELS[formData.educationLevel as keyof typeof EDUCATION_LEVELS]} ${formData.educationLevel} - ${formData.category} - ${formData.subject}`,
          difficulty_level: formData.difficultyLevel,
          uploaded_by: user.id,
          tags: [formData.educationLevel, formData.category, formData.subject]
        });

      if (dbError) throw dbError;

      toast({
        title: "Success! 🎉",
        description: "Your material has been uploaded and is pending approval",
      });

      setFormData({
        title: "",
        description: "",
        educationLevel: "",
        category: "",
        subject: "",
        difficultyLevel: "beginner",
        file: null
      });

      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your material. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = formData.educationLevel 
    ? Object.keys(SUBJECTS[formData.educationLevel as keyof typeof SUBJECTS] || {})
    : [];

  const availableSubjects = formData.educationLevel && formData.category
    ? (SUBJECTS[formData.educationLevel as keyof typeof SUBJECTS]?.[formData.category as any] || [])
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Upload className="h-5 w-5" />
          Upload Study Material
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Study Material</DialogTitle>
          <DialogDescription>
            Share your study materials with the STEMinist community. Your upload will be reviewed before being published.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., AP Biology Study Guide Chapter 5"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the material and what it covers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level *</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) => setFormData({ ...formData, educationLevel: value, category: "", subject: "" })}
              >
                <SelectTrigger id="educationLevel">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EDUCATION_LEVELS).map(([level, emoji]) => (
                    <SelectItem key={level} value={level}>
                      {emoji} {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value, subject: "" })}
                disabled={!formData.educationLevel}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
              disabled={!formData.category}
            >
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficultyLevel">Difficulty Level</Label>
            <Select
              value={formData.difficultyLevel}
              onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value })}
            >
              <SelectTrigger id="difficultyLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              required
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG (Max 20MB)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Uploading..." : "Upload Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
