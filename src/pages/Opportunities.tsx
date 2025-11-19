import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";

const Opportunities = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [organizationFilter, setOrganizationFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    opportunities.forEach(opp => {
      opp.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [opportunities]);

  const allOrganizations = useMemo(() => {
    const orgs = new Set<string>();
    opportunities.forEach(opp => {
      if (opp.organization) orgs.add(opp.organization);
    });
    return Array.from(orgs).sort();
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      if (typeFilter !== "all" && opp.type !== typeFilter) return false;
      if (organizationFilter !== "all" && opp.organization !== organizationFilter) return false;
      if (tagFilter !== "all" && !opp.tags?.includes(tagFilter)) return false;
      if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [opportunities, typeFilter, organizationFilter, tagFilter, searchQuery]);

  const scholarships = filteredOpportunities.filter(o => o.type === "Scholarship");
  const internships = filteredOpportunities.filter(o => o.type === "Internship");
  const competitions = filteredOpportunities.filter(o => o.type === "Competition");

  const clearFilters = () => {
    setTypeFilter("all");
    setOrganizationFilter("all");
    setTagFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = typeFilter !== "all" || organizationFilter !== "all" || tagFilter !== "all" || searchQuery !== "";

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            STEM Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover scholarships, internships, competitions, and career opportunities 
            designed to support your STEM journey.
          </p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <CardTitle>Filter Opportunities</CardTitle>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Scholarship">Scholarships</SelectItem>
                    <SelectItem value="Internship">Internships</SelectItem>
                    <SelectItem value="Competition">Competitions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Organization</Label>
                <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All organizations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {allOrganizations.map(org => (
                      <SelectItem key={org} value={org}>{org}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing {filteredOpportunities.length} of {opportunities.length} opportunities</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scholarships Section */}
        {scholarships.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Scholarships ({scholarships.length})</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-primary">{scholarship.title}</CardTitle>
                      <Badge variant="secondary">{scholarship.type}</Badge>
                    </div>
                    {scholarship.amount && (
                      <CardDescription className="font-semibold text-accent-foreground">
                        {scholarship.amount}
                      </CardDescription>
                    )}
                    {scholarship.organization && (
                      <p className="text-sm text-muted-foreground">{scholarship.organization}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {scholarship.description && (
                      <p className="text-muted-foreground mb-2">{scholarship.description}</p>
                    )}
                    {scholarship.deadline && (
                      <p className="text-sm font-semibold text-foreground mb-3">
                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                      </p>
                    )}
                    {scholarship.tags && scholarship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {scholarship.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <Button className="w-full" onClick={() => scholarship.external_url && window.open(scholarship.external_url, '_blank')}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Internships Section */}
        {internships.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Internships ({internships.length})</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-primary text-lg">{internship.title}</CardTitle>
                      <Badge variant="outline">{internship.type}</Badge>
                    </div>
                    {internship.organization && (
                      <CardDescription className="font-semibold">
                        {internship.organization}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {internship.description && (
                      <p className="text-sm text-muted-foreground mb-3">{internship.description}</p>
                    )}
                    {internship.deadline && (
                      <p className="text-sm font-semibold text-foreground mb-3">
                        Apply by: {new Date(internship.deadline).toLocaleDateString()}
                      </p>
                    )}
                    {internship.tags && internship.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {internship.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <Button className="w-full" onClick={() => internship.external_url && window.open(internship.external_url, '_blank')}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Competitions Section */}
        {competitions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Competitions ({competitions.length})</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {competitions.map((competition) => (
                <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-primary">{competition.title}</CardTitle>
                      <Badge variant="destructive">{competition.type}</Badge>
                    </div>
                    {competition.amount && (
                      <CardDescription className="font-semibold text-accent-foreground">
                        {competition.amount}
                      </CardDescription>
                    )}
                    {competition.organization && (
                      <p className="text-sm text-muted-foreground">{competition.organization}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {competition.description && (
                      <p className="text-muted-foreground mb-2">{competition.description}</p>
                    )}
                    {competition.deadline && (
                      <p className="text-sm font-semibold text-foreground mb-3">
                        Deadline: {new Date(competition.deadline).toLocaleDateString()}
                      </p>
                    )}
                    {competition.tags && competition.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {competition.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <Button className="w-full" onClick={() => competition.external_url && window.open(competition.external_url, '_blank')}>
                      Register
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredOpportunities.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No opportunities match your filters.</p>
              <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-4">
            Don't See What You're Looking For?
          </h2>
          <p className="text-primary-foreground/90 mb-6">
            Our team is constantly sourcing new opportunities. Get personalized recommendations 
            based on your interests and goals.
          </p>
          <Button size="lg" variant="secondary">
            Get Personalized Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;