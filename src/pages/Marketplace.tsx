import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  Star,
  MapPin,
  Search,
  Plus,
  CheckCircle,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

// Demo data for marketplace
const DEMO_TRADES = [
  { id: '1', businessName: 'Smith Plumbing Services', trade: 'Plumbing', rating: 4.8, reviews: 47, verified: true, location: 'London', hourlyRate: 55 },
  { id: '2', businessName: 'ABC Electrical', trade: 'Electrical', rating: 4.9, reviews: 82, verified: true, location: 'Manchester', hourlyRate: 60 },
  { id: '3', businessName: 'Premier Carpentry', trade: 'Carpentry', rating: 4.6, reviews: 31, verified: true, location: 'Birmingham', hourlyRate: 45 },
  { id: '4', businessName: 'GlazeTech Windows', trade: 'Glazing', rating: 4.7, reviews: 28, verified: false, location: 'Leeds', hourlyRate: 50 },
];

const DEMO_JOBS = [
  { id: '1', title: 'Bathroom Renovation', trade: 'Plumbing', budget: '£2,000-£3,500', location: 'London SW1', urgency: 'normal', posted: '2 days ago' },
  { id: '2', title: 'Full House Rewire', trade: 'Electrical', budget: '£4,000-£6,000', location: 'Manchester M1', urgency: 'urgent', posted: '1 day ago' },
  { id: '3', title: 'Kitchen Fitting', trade: 'Carpentry', budget: '£1,500-£2,500', location: 'Birmingham B1', urgency: 'normal', posted: '3 days ago' },
];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('find-trades');

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Trade Marketplace
            </h1>
            <p className="text-sm text-muted-foreground">
              Find verified trades, post jobs, and get reviews
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Trade Profile
            </Button>
            <Button>
              <Briefcase className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trades, jobs, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="find-trades">Find Trades</TabsTrigger>
            <TabsTrigger value="browse-jobs">Browse Jobs</TabsTrigger>
            <TabsTrigger value="my-profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="find-trades" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMO_TRADES.map((trade) => (
                <Card key={trade.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{trade.businessName}</h4>
                        <p className="text-sm text-muted-foreground">{trade.trade}</p>
                      </div>
                      {trade.verified && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {trade.rating} ({trade.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {trade.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">£{trade.hourlyRate}/hr</span>
                      <Button size="sm">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="browse-jobs" className="mt-4">
            <div className="space-y-4">
              {DEMO_JOBS.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{job.title}</h4>
                          <Badge variant={job.urgency === 'urgent' ? 'destructive' : 'outline'}>
                            {job.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {job.trade} • {job.location} • Posted {job.posted}
                        </p>
                        <p className="text-sm font-medium">Budget: {job.budget}</p>
                      </div>
                      <Button>Submit Quote</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-profile" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Create Your Trade Profile
                </CardTitle>
                <CardDescription>
                  Get verified and start receiving job enquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Verification Benefits</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Verified badge on your profile
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Priority in search results
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Customer trust & confidence
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Review collection tools
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Required for Verification</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Valid public liability insurance</li>
                      <li>• Gas Safe registration (gas work)</li>
                      <li>• NICEIC/NAPIT (electrical work)</li>
                      <li>• Business address confirmation</li>
                    </ul>
                  </div>
                </div>
                <Button className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trade Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
