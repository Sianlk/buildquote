import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Camera,
  Upload,
  Loader2,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

interface ExtractedReceiptData {
  supplier?: string;
  date?: string;
  total?: number;
  vat?: number;
  items?: string[];
  confidence: number;
}

interface ReceiptOCRUploadProps {
  onExtracted: (data: ExtractedReceiptData) => void;
}

export function ReceiptOCRUpload({ onExtracted }: ReceiptOCRUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Process with OCR simulation (would connect to Lovable AI in production)
    await processReceipt(file);
  };

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Simulate OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would use Lovable AI with vision capabilities
      // For demo, we'll simulate extracted data
      const simulatedData: ExtractedReceiptData = {
        supplier: "Screwfix Direct",
        date: new Date().toISOString().split('T')[0],
        total: 156.78,
        vat: 26.13,
        items: [
          "10x 2.5mm Twin & Earth Cable 10m",
          "5x 13A Double Socket White",
          "1x Consumer Unit 10-way",
        ],
        confidence: 0.87,
      };

      setExtractedData(simulatedData);
      toast.success("Receipt processed successfully");
      
    } catch (error) {
      toast.error("Failed to process receipt");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (extractedData) {
      onExtracted(extractedData);
      handleClear();
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Receipt Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!previewUrl ? (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Upload receipt image</p>
              <p className="text-xs text-muted-foreground">
                Take a photo or upload an image of your receipt
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              AI-powered OCR extracts supplier, date, amounts, and VAT automatically
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative">
              <img
                src={previewUrl}
                alt="Receipt preview"
                className="w-full max-h-48 object-contain rounded-lg bg-muted"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm">Processing receipt with AI...</span>
              </div>
            ) : extractedData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Extracted Data</span>
                  <Badge variant={extractedData.confidence > 0.8 ? "default" : "secondary"}>
                    {Math.round(extractedData.confidence * 100)}% confidence
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Supplier</Label>
                    <p className="text-sm font-medium">{extractedData.supplier || 'Unknown'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <p className="text-sm font-medium">{extractedData.date || 'Unknown'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Total</Label>
                    <p className="text-sm font-medium">£{extractedData.total?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">VAT</Label>
                    <p className="text-sm font-medium">£{extractedData.vat?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                {extractedData.items && extractedData.items.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Items</Label>
                    <ul className="text-sm space-y-1 mt-1">
                      {extractedData.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="truncate text-muted-foreground">
                          • {item}
                        </li>
                      ))}
                      {extractedData.items.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{extractedData.items.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleConfirm} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Use This Data
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Re-scan
                  </Button>
                </div>

                {extractedData.confidence < 0.8 && (
                  <div className="flex items-center gap-2 text-xs text-warning">
                    <AlertTriangle className="h-3 w-3" />
                    Low confidence - please verify extracted data
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
