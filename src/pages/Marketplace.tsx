import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Users,
  Briefcase,
  Star,
  MapPin,
  Search,
  Plus,
  CheckCircle,
  Shield,
  TrendingUp,
  BarChart3,
  FileCheck,
  Award,
  MessageSquare,
} from "lucide-react";

// Demo data for marketplace
const DEMO_TRADES = [
  { id: '1', businessName: 'Smith Plumbing Services', trade: 'Plumbing', rating: 4.8, reviews: 47, verified: true, location: 'London', hourlyRate: 55 },
  { id: '2', businessName: 'ABC Electrical', trade: 'Electrical', rating: 4.9, reviews: 82, verified: true, location: 'Manchester', hourlyRate: 60 },
  { id: '3', businessName: 'Premier Carpentry', trade: 'Carpentry', rating: 4.6, reviews: 31, verified: true, location: 'Birmingham', hourlyRate: 45 },
  { id: '4', businessName: 'GlazeTech Windows', trade: 'Glazing', rating: 4.7, reviews: 28, verified: false, location: 'Leeds', hourlyRate: 50 },
  { id: '5', businessName: 'Green Energy Solutions', trade: 'Renewables', rating: 4.9, reviews: 56, verified: true, location: 'Bristol', hourlyRate: 65 },
  { id: '6', businessName: 'RoofMaster UK', trade: 'Roofing', rating: 4.5, reviews: 39, verified: true, location: 'Newcastle', hourlyRate: 52 },
];

const DEMO_JOBS = [
  { id: '1', title: 'Bathroom Renovation', trade: 'Plumbing', budget: '£2,000-£3,500', location: 'London SW1', urgency: 'normal', posted: '2 days ago' },
  { id: '2', title: 'Full House Rewire', trade: 'Electrical', budget: '£4,000-£6,000', location: 'Manchester M1', urgency: 'urgent', posted: '1 day ago' },
  { id: '3', title: 'Kitchen Fitting', trade: 'Carpentry', budget: '£1,500-£2,500', location: 'Birmingham B1', urgency: 'normal', posted: '3 days ago' },
  { id: '4', title: 'Solar Panel Installation', trade: 'Renewables', budget: '£6,000-£9,000', location: 'Bristol BS1', urgency: 'normal', posted: '4 days ago' },
  { id: '5', title: 'New Window Installation', trade: 'Glazing', budget: '£3,000-£5,000', location: 'Leeds LS1', urgency: 'urgent', posted: '1 day ago' },
];

const TRADE_TYPES = [
  'Plumbing', 'Electrical', 'Carpentry', 'Glazing', 'Roofing', 
  'Renewables', 'HVAC', 'Masonry', 'Flooring', 'Plastering', 'Painting'
];

export default function Marketplace() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('find-trades');
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Job posting form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    trade_required: '',
    location: '',
    postcode: '',
    budget_min: '',
    budget_max: '',
    urgency: 'normal',
  });
  
  // Trade profile form state
  const [profileForm, setProfileForm] = useState({
    business_name: '',
    trade_type: '',
    description: '',
    hourly_rate: '',
    day_rate: '',
    service_areas: '',
    contact_email: '',
    contact_phone: '',
    gas_safe_number: '',
    niceic_number: '',
  });
  
  // Bid form state
  const [bidForm, setBidForm] = useState({
    quote_amount: '',
    message: '',
    estimated_duration: '',
    available_start_date: '',
  });

  // Fetch user's trade profile
  const { data: myProfile } = useQuery({
    queryKey: ['my-trade-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('trade_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Fetch marketplace jobs
  const { data: jobs } = useQuery({
    queryKey: ['marketplace-jobs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('marketplace_jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  // Fetch trade profiles
  const { data: tradeProfiles } = useQuery({
    queryKey: ['trade-profiles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('trade_profiles')
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false });
      return data || [];
    },
  });

  // Create job posting mutation
  const createJobMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('marketplace_jobs').insert({
        customer_id: user.id,
        title: jobForm.title,
        description: jobForm.description,
        trade_required: jobForm.trade_required,
        job_type: jobForm.trade_required,
        location: jobForm.location,
        postcode: jobForm.postcode,
        budget_min: parseFloat(jobForm.budget_min) || null,
        budget_max: parseFloat(jobForm.budget_max) || null,
        urgency: jobForm.urgency,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Job posted successfully!');
      setShowJobDialog(false);
      setJobForm({ title: '', description: '', trade_required: '', location: '', postcode: '', budget_min: '', budget_max: '', urgency: 'normal' });
      queryClient.invalidateQueries({ queryKey: ['marketplace-jobs'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Create trade profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('trade_profiles').insert({
        user_id: user.id,
        business_name: profileForm.business_name,
        trade_type: profileForm.trade_type,
        description: profileForm.description,
        hourly_rate: parseFloat(profileForm.hourly_rate) || null,
        day_rate: parseFloat(profileForm.day_rate) || null,
        service_areas: profileForm.service_areas.split(',').map(s => s.trim()),
        contact_email: profileForm.contact_email,
        contact_phone: profileForm.contact_phone,
        gas_safe_number: profileForm.gas_safe_number || null,
        niceic_number: profileForm.niceic_number || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Trade profile created!');
      setShowProfileDialog(false);
      queryClient.invalidateQueries({ queryKey: ['my-trade-profile'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Submit bid mutation
  const submitBidMutation = useMutation({
    mutationFn: async () => {
      if (!user || !myProfile || !selectedJobId) throw new Error('Missing required data');
      const { error } = await supabase.from('job_quotes').insert({
        job_id: selectedJobId,
        trade_profile_id: myProfile.id,
        quote_amount: parseFloat(bidForm.quote_amount),
        message: bidForm.message,
        estimated_duration: bidForm.estimated_duration,
        available_start_date: bidForm.available_start_date || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Quote submitted successfully!');
      setShowBidDialog(false);
      setBidForm({ quote_amount: '', message: '', estimated_duration: '', available_start_date: '' });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filteredTrades = (tradeProfiles || DEMO_TRADES).filter((t: any) =>
    (t.business_name || t.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.trade_type || t.trade || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = (jobs || DEMO_JOBS).filter((j: any) =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.trade_required || j.trade)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Find verified trades, post jobs, submit quotes, and manage reviews
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!!myProfile}>
                  <Plus className="h-4 w-4 mr-2" />
                  {myProfile ? 'Profile Created' : 'Create Trade Profile'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Trade Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Name *</Label>
                      <Input value={profileForm.business_name} onChange={e => setProfileForm(p => ({ ...p, business_name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Trade Type *</Label>
                      <Select value={profileForm.trade_type} onValueChange={v => setProfileForm(p => ({ ...p, trade_type: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select trade" /></SelectTrigger>
                        <SelectContent>
                          {TRADE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={profileForm.description} onChange={e => setProfileForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hourly Rate (£)</Label>
                      <Input type="number" value={profileForm.hourly_rate} onChange={e => setProfileForm(p => ({ ...p, hourly_rate: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Day Rate (£)</Label>
                      <Input type="number" value={profileForm.day_rate} onChange={e => setProfileForm(p => ({ ...p, day_rate: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Service Areas (comma-separated)</Label>
                    <Input placeholder="London, Manchester, Leeds" value={profileForm.service_areas} onChange={e => setProfileForm(p => ({ ...p, service_areas: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact Email</Label>
                      <Input type="email" value={profileForm.contact_email} onChange={e => setProfileForm(p => ({ ...p, contact_email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone</Label>
                      <Input value={profileForm.contact_phone} onChange={e => setProfileForm(p => ({ ...p, contact_phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gas Safe Number</Label>
                      <Input value={profileForm.gas_safe_number} onChange={e => setProfileForm(p => ({ ...p, gas_safe_number: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>NICEIC Number</Label>
                      <Input value={profileForm.niceic_number} onChange={e => setProfileForm(p => ({ ...p, niceic_number: e.target.value }))} />
                    </div>
                  </div>
                  <Button onClick={() => createProfileMutation.mutate()} disabled={!profileForm.business_name || !profileForm.trade_type} className="w-full">
                    Create Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post a Job</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input placeholder="e.g. Bathroom Renovation" value={jobForm.title} onChange={e => setJobForm(f => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea placeholder="Describe the work required..." value={jobForm.description} onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Trade Required *</Label>
                      <Select value={jobForm.trade_required} onValueChange={v => setJobForm(f => ({ ...f, trade_required: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select trade" /></SelectTrigger>
                        <SelectContent>
                          {TRADE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Urgency</Label>
                      <Select value={jobForm.urgency} onValueChange={v => setJobForm(f => ({ ...f, urgency: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input placeholder="e.g. London" value={jobForm.location} onChange={e => setJobForm(f => ({ ...f, location: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Postcode</Label>
                      <Input placeholder="e.g. SW1A 1AA" value={jobForm.postcode} onChange={e => setJobForm(f => ({ ...f, postcode: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Budget Min (£)</Label>
                      <Input type="number" value={jobForm.budget_min} onChange={e => setJobForm(f => ({ ...f, budget_min: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget Max (£)</Label>
                      <Input type="number" value={jobForm.budget_max} onChange={e => setJobForm(f => ({ ...f, budget_max: e.target.value }))} />
                    </div>
                  </div>
                  <Button onClick={() => createJobMutation.mutate()} disabled={!jobForm.title || !jobForm.description || !jobForm.trade_required || !jobForm.location} className="w-full">
                    Post Job
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          <TabsList className="w-full h-auto flex flex-nowrap justify-start gap-1 overflow-x-auto pb-1">
            <TabsTrigger value="find-trades" className="flex-shrink-0">Find Trades</TabsTrigger>
            <TabsTrigger value="browse-jobs" className="flex-shrink-0">Browse Jobs</TabsTrigger>
            <TabsTrigger value="my-profile" className="flex-shrink-0">My Profile</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-shrink-0">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="find-trades" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrades.map((trade) => {
                const businessName = (trade as any).business_name || (trade as any).businessName;
                const tradeType = (trade as any).trade_type || (trade as any).trade;
                const isVerified = (trade as any).is_verified || (trade as any).verified;
                const avgRating = (trade as any).average_rating || (trade as any).rating || 0;
                const reviewCount = (trade as any).total_reviews || (trade as any).reviews || 0;
                const location = (trade as any).service_areas?.[0] || (trade as any).location;
                const rate = (trade as any).hourly_rate || (trade as any).hourlyRate || 0;
                
                return (
                <Card key={trade.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{businessName}</h4>
                        <p className="text-sm text-muted-foreground">{tradeType}</p>
                      </div>
                      {isVerified && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {avgRating} ({reviewCount})
                      </span>
                      {location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {location}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">£{rate}/hr</span>
                      <Button size="sm">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="browse-jobs" className="mt-4">
            {/* Bid Dialog */}
            <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Quote</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quote Amount (£) *</Label>
                    <Input type="number" value={bidForm.quote_amount} onChange={e => setBidForm(f => ({ ...f, quote_amount: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea placeholder="Introduce yourself and explain your approach..." value={bidForm.message} onChange={e => setBidForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estimated Duration</Label>
                      <Input placeholder="e.g. 3-5 days" value={bidForm.estimated_duration} onChange={e => setBidForm(f => ({ ...f, estimated_duration: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Available Start Date</Label>
                      <Input type="date" value={bidForm.available_start_date} onChange={e => setBidForm(f => ({ ...f, available_start_date: e.target.value }))} />
                    </div>
                  </div>
                  <Button onClick={() => submitBidMutation.mutate()} disabled={!bidForm.quote_amount || !myProfile} className="w-full">
                    {myProfile ? 'Submit Quote' : 'Create Profile First'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const jt = job as any;
                const tradeReq = jt.trade_required || jt.trade;
                const budget = jt.budget_min && jt.budget_max ? `£${jt.budget_min}-£${jt.budget_max}` : jt.budget || 'TBC';
                const postDate = jt.created_at ? new Date(jt.created_at).toLocaleDateString() : jt.posted;
                
                return (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{job.title}</h4>
                          <Badge variant={jt.urgency === 'urgent' ? 'destructive' : 'outline'}>
                            {jt.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {tradeReq} • {jt.location} • {postDate}
                        </p>
                        <p className="text-sm font-medium">Budget: {budget}</p>
                      </div>
                      <Button onClick={() => { setSelectedJobId(job.id); setShowBidDialog(true); }}>
                        Submit Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="my-profile" className="mt-4">
            {myProfile ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      {myProfile.business_name}
                    </CardTitle>
                    <CardDescription>{myProfile.trade_type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{myProfile.average_rating || 0}</span>
                        <span className="text-muted-foreground">({myProfile.total_reviews || 0} reviews)</span>
                      </div>
                      {myProfile.is_verified && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Hourly Rate</p>
                        <p className="font-medium">£{myProfile.hourly_rate || 0}/hr</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day Rate</p>
                        <p className="font-medium">£{myProfile.day_rate || 0}/day</p>
                      </div>
                    </div>
                    {myProfile.description && <p className="text-sm">{myProfile.description}</p>}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public Liability Insurance</span>
                      <Badge variant={myProfile.insurance_valid_until ? 'default' : 'outline'}>
                        {myProfile.insurance_valid_until ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gas Safe Registration</span>
                      <Badge variant={myProfile.gas_safe_number ? 'default' : 'outline'}>
                        {myProfile.gas_safe_number || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">NICEIC Certification</span>
                      <Badge variant={myProfile.niceic_number ? 'default' : 'outline'}>
                        {myProfile.niceic_number || 'N/A'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
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
                  <Button className="mt-6" onClick={() => setShowProfileDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Trade Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Profile Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Quote Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-muted-foreground">+5 this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">34%</p>
                  <Progress value={34} className="mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Performance Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Complete your profile with detailed descriptions and portfolio images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Respond to quote requests within 24 hours for higher conversion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Ask satisfied customers to leave reviews after completing jobs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Keep your verification documents up to date</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
