// Enhanced Trade Marketplace Features - Verification, Reviews, Bidding, Analytics
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  CheckCircle,
  Shield,
  TrendingUp,
  Users,
  FileCheck,
  Award,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Calendar,
  Briefcase,
  BarChart3,
  Camera,
} from "lucide-react";

// Verification Status Types
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'premium';

interface VerificationChecklist {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  documentType?: string;
}

// Verification requirements by trade
export const VERIFICATION_REQUIREMENTS: Record<string, VerificationChecklist[]> = {
  Plumbing: [
    { id: 'gas_safe', label: 'Gas Safe Registration (if gas work)', required: false, checked: false, documentType: 'certificate' },
    { id: 'public_liability', label: 'Public Liability Insurance (min £2M)', required: true, checked: false, documentType: 'certificate' },
    { id: 'id_verification', label: 'Photo ID Verification', required: true, checked: false, documentType: 'id' },
    { id: 'address_proof', label: 'Business Address Proof', required: true, checked: false, documentType: 'utility' },
    { id: 'qualifications', label: 'Trade Qualifications (NVQ/City & Guilds)', required: false, checked: false, documentType: 'certificate' },
  ],
  Electrical: [
    { id: 'niceic', label: 'NICEIC/NAPIT Registration', required: true, checked: false, documentType: 'certificate' },
    { id: 'public_liability', label: 'Public Liability Insurance (min £2M)', required: true, checked: false, documentType: 'certificate' },
    { id: 'id_verification', label: 'Photo ID Verification', required: true, checked: false, documentType: 'id' },
    { id: 'address_proof', label: 'Business Address Proof', required: true, checked: false, documentType: 'utility' },
    { id: 'part_p', label: 'Part P Certification', required: true, checked: false, documentType: 'certificate' },
  ],
  Carpentry: [
    { id: 'public_liability', label: 'Public Liability Insurance (min £2M)', required: true, checked: false, documentType: 'certificate' },
    { id: 'id_verification', label: 'Photo ID Verification', required: true, checked: false, documentType: 'id' },
    { id: 'address_proof', label: 'Business Address Proof', required: true, checked: false, documentType: 'utility' },
    { id: 'qualifications', label: 'Trade Qualifications', required: false, checked: false, documentType: 'certificate' },
    { id: 'cscs', label: 'CSCS Card', required: false, checked: false, documentType: 'card' },
  ],
  General: [
    { id: 'public_liability', label: 'Public Liability Insurance (min £1M)', required: true, checked: false, documentType: 'certificate' },
    { id: 'id_verification', label: 'Photo ID Verification', required: true, checked: false, documentType: 'id' },
    { id: 'address_proof', label: 'Business Address Proof', required: true, checked: false, documentType: 'utility' },
  ],
};

interface TradeVerificationFormProps {
  trade: string;
  onSubmit: (data: any) => void;
}

export function TradeVerificationForm({ trade, onSubmit }: TradeVerificationFormProps) {
  const requirements = VERIFICATION_REQUIREMENTS[trade] || VERIFICATION_REQUIREMENTS.General;
  const [checklist, setChecklist] = useState<VerificationChecklist[]>(requirements);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: '',
    tradingYears: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    serviceAreas: '',
  });

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const completedRequired = checklist.filter(c => c.required && c.checked).length;
  const totalRequired = checklist.filter(c => c.required).length;
  const progress = (completedRequired / totalRequired) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Business Name *</Label>
            <Input
              value={businessDetails.businessName}
              onChange={(e) => setBusinessDetails(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Your business name"
            />
          </div>
          <div>
            <Label>Years Trading *</Label>
            <Input
              type="number"
              value={businessDetails.tradingYears}
              onChange={(e) => setBusinessDetails(prev => ({ ...prev, tradingYears: e.target.value }))}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input
              value={businessDetails.phone}
              onChange={(e) => setBusinessDetails(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="07xxx xxxxxx"
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={businessDetails.email}
              onChange={(e) => setBusinessDetails(prev => ({ ...prev, email: e.target.value }))}
              placeholder="you@business.com"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Service Areas (postcodes or areas)</Label>
            <Input
              value={businessDetails.serviceAreas}
              onChange={(e) => setBusinessDetails(prev => ({ ...prev, serviceAreas: e.target.value }))}
              placeholder="e.g., SW, SE, Central London, Surrey"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Business Description</Label>
            <Textarea
              value={businessDetails.description}
              onChange={(e) => setBusinessDetails(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your services, specialities, and experience..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Verification Documents</h3>
          <span className="text-sm text-muted-foreground">
            {completedRequired}/{totalRequired} required completed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                item.checked ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50'
              }`}
              onClick={() => toggleCheck(item.id)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                item.checked ? 'bg-primary border-primary' : 'border-muted-foreground/30'
              }`}>
                {item.checked && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <span className="text-sm">{item.label}</span>
                {item.required && <Badge variant="outline" className="ml-2 text-xs">Required</Badge>}
              </div>
              <Button size="sm" variant="outline">
                <Camera className="h-3 w-3 mr-1" />
                Upload
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button 
        className="w-full" 
        disabled={progress < 100}
        onClick={() => onSubmit({ ...businessDetails, documents: checklist })}
      >
        <Shield className="h-4 w-4 mr-2" />
        Submit for Verification
      </Button>
    </div>
  );
}

// Review System Component
interface ReviewFormProps {
  tradeId: string;
  jobId?: string;
  onSubmit: (review: any) => void;
}

export function ReviewForm({ tradeId, jobId, onSubmit }: ReviewFormProps) {
  const [ratings, setRatings] = useState({
    overall: 0,
    workmanship: 0,
    communication: 0,
    value: 0,
  });
  const [review, setReview] = useState({
    title: '',
    text: '',
    wouldRecommend: true,
  });

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm w-32">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer ${
              star <= value ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
            }`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <StarRating label="Overall" value={ratings.overall} onChange={(v) => setRatings(prev => ({ ...prev, overall: v }))} />
        <StarRating label="Workmanship" value={ratings.workmanship} onChange={(v) => setRatings(prev => ({ ...prev, workmanship: v }))} />
        <StarRating label="Communication" value={ratings.communication} onChange={(v) => setRatings(prev => ({ ...prev, communication: v }))} />
        <StarRating label="Value for Money" value={ratings.value} onChange={(v) => setRatings(prev => ({ ...prev, value: v }))} />
      </div>

      <div>
        <Label>Review Title</Label>
        <Input
          value={review.title}
          onChange={(e) => setReview(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Summarize your experience"
        />
      </div>

      <div>
        <Label>Your Review</Label>
        <Textarea
          value={review.text}
          onChange={(e) => setReview(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Tell others about your experience..."
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recommend"
          checked={review.wouldRecommend}
          onChange={(e) => setReview(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="recommend" className="cursor-pointer">I would recommend this tradesperson</Label>
      </div>

      {jobId && (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified Job Review
        </Badge>
      )}

      <Button 
        className="w-full" 
        onClick={() => onSubmit({ ...ratings, ...review, tradeId, jobId })}
        disabled={ratings.overall === 0}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Submit Review
      </Button>
    </div>
  );
}

// Trade Analytics Dashboard
interface TradeAnalyticsProps {
  profileId: string;
}

export function TradeAnalytics({ profileId }: TradeAnalyticsProps) {
  // Mock analytics data - would come from database
  const analytics = {
    profileViews: 1247,
    quoteRequests: 48,
    jobsWon: 23,
    conversionRate: 47.9,
    averageRating: 4.8,
    totalReviews: 47,
    responseTime: '2.4 hours',
    monthlyTrend: [
      { month: 'Oct', views: 180, quotes: 8, jobs: 3 },
      { month: 'Nov', views: 220, quotes: 12, jobs: 5 },
      { month: 'Dec', views: 195, quotes: 9, jobs: 4 },
      { month: 'Jan', views: 280, quotes: 15, jobs: 7 },
    ],
    reviewSources: [
      { source: 'Platform', count: 35, percentage: 74 },
      { source: 'Google', count: 8, percentage: 17 },
      { source: 'Imported', count: 4, percentage: 9 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{analytics.profileViews}</div>
            <div className="text-sm text-muted-foreground">Profile Views</div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline" /> +18% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{analytics.quoteRequests}</div>
            <div className="text-sm text-muted-foreground">Quote Requests</div>
            <div className="text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 inline" /> +25% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{analytics.jobsWon}</div>
            <div className="text-sm text-muted-foreground">Jobs Won</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.conversionRate}% conversion
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold flex items-center gap-1">
              {analytics.averageRating}
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.totalReviews} reviews
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Review Sources</CardTitle>
          <CardDescription>Where your reviews come from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.reviewSources.map((source) => (
              <div key={source.source} className="flex items-center gap-3">
                <span className="w-20 text-sm">{source.source}</span>
                <Progress value={source.percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {source.count} ({source.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Improve Response Time</p>
                <p className="text-xs text-muted-foreground">
                  Your average response time is {analytics.responseTime}. Responding within 1 hour increases conversion by 40%.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Great Review Score!</p>
                <p className="text-xs text-muted-foreground">
                  Your {analytics.averageRating} rating puts you in the top 15% of trades in your area.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Job Bidding Component
interface JobBidFormProps {
  job: {
    id: string;
    title: string;
    description: string;
    budgetMin: number;
    budgetMax: number;
    location: string;
  };
  onSubmit: (bid: any) => void;
}

export function JobBidForm({ job, onSubmit }: JobBidFormProps) {
  const [bid, setBid] = useState({
    amount: '',
    message: '',
    estimatedDuration: '',
    availableDate: '',
  });

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium">{job.title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
        <div className="flex gap-4 mt-2 text-sm">
          <span>Budget: £{job.budgetMin} - £{job.budgetMax}</span>
          <span>Location: {job.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Quote (£) *</Label>
          <Input
            type="number"
            value={bid.amount}
            onChange={(e) => setBid(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="e.g., 2500"
          />
        </div>
        <div>
          <Label>Estimated Duration *</Label>
          <Input
            value={bid.estimatedDuration}
            onChange={(e) => setBid(prev => ({ ...prev, estimatedDuration: e.target.value }))}
            placeholder="e.g., 3 days"
          />
        </div>
        <div className="col-span-2">
          <Label>Available Start Date</Label>
          <Input
            type="date"
            value={bid.availableDate}
            onChange={(e) => setBid(prev => ({ ...prev, availableDate: e.target.value }))}
          />
        </div>
        <div className="col-span-2">
          <Label>Message to Customer *</Label>
          <Textarea
            value={bid.message}
            onChange={(e) => setBid(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Introduce yourself and explain why you're the right choice for this job..."
            rows={4}
          />
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <strong>Tip:</strong> Personalized messages that address the customer's specific needs have a 3x higher success rate.
      </div>

      <Button 
        className="w-full" 
        onClick={() => onSubmit({ ...bid, jobId: job.id })}
        disabled={!bid.amount || !bid.message}
      >
        <Briefcase className="h-4 w-4 mr-2" />
        Submit Quote
      </Button>
    </div>
  );
}
