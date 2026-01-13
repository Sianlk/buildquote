import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  Move,
  Ruler,
  RotateCcw,
  Download,
  Grid3X3,
  MousePointer,
  X,
  Printer,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import { sanitizeSvg } from "@/lib/svg-sanitizer";

interface CADPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  svgContent: string;
  drawingType: string;
  drawingId?: string;
  dimensions?: { length: number; width: number; height: number };
}

type Tool = "pan" | "measure" | "select";

interface MeasurementPoint {
  x: number;
  y: number;
}

interface Measurement {
  id: string;
  start: MeasurementPoint;
  end: MeasurementPoint;
  distanceMM: number;
}

const SCALE_OPTIONS = [
  { value: 50, label: "1:50" },
  { value: 100, label: "1:100" },
  { value: 200, label: "1:200" },
];

export function CADPreviewModal({
  open,
  onOpenChange,
  svgContent,
  drawingType,
  drawingId,
  dimensions,
}: CADPreviewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<Tool>("pan");
  const [showGrid, setShowGrid] = useState(true);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [measureStart, setMeasureStart] = useState<MeasurementPoint | null>(null);
  const [currentMeasure, setCurrentMeasure] = useState<MeasurementPoint | null>(null);
  const [scale, setScale] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate pixel to mm conversion based on SVG viewBox and real dimensions
  const pixelsPerMM = dimensions ? 800 / (dimensions.length * 1000) : 1;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 50, y: 50 });
    setMeasurements([]);
    setMeasureStart(null);
    setCurrentMeasure(null);
  };

  const handleFitToView = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      // Fit SVG (assuming 800x600 base size) to container
      const fitZoom = Math.min(containerWidth / 900, containerHeight / 700);
      setZoom(fitZoom);
      setPan({ x: 50, y: 50 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "pan") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (activeTool === "measure") {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        
        if (!measureStart) {
          setMeasureStart({ x, y });
        } else {
          const pixelDistance = Math.sqrt(
            Math.pow(x - measureStart.x, 2) + Math.pow(y - measureStart.y, 2)
          );
          // Convert pixels to real-world mm using scale
          const realDistanceMM = (pixelDistance / pixelsPerMM) * (scale / 50);
          
          setMeasurements([
            ...measurements,
            {
              id: `m-${Date.now()}`,
              start: measureStart,
              end: { x, y },
              distanceMM: realDistanceMM,
            },
          ]);
          setMeasureStart(null);
          setCurrentMeasure(null);
          toast.success(`Measured: ${formatDistance(realDistanceMM)}`);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && activeTool === "pan") {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (activeTool === "measure" && measureStart) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setCurrentMeasure({
          x: (e.clientX - rect.left - pan.x) / zoom,
          y: (e.clientY - rect.top - pan.y) / zoom,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.25, Math.min(5, z + delta)));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const formatDistance = (mm: number): string => {
    if (mm >= 1000) {
      return `${(mm / 1000).toFixed(3)}m`;
    }
    return `${Math.round(mm)}mm`;
  };

  const downloadSVG = () => {
    // Create enhanced SVG with title block
    const enhancedSVG = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by BuildQuote CAD System -->
<!-- Drawing Type: ${drawingType} -->
<!-- Scale: 1:${scale} -->
<!-- Date: ${new Date().toISOString()} -->
${svgContent}`;

    const blob = new Blob([enhancedSVG], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAD-${drawingType}-${drawingId || Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded successfully");
  };

  const printDrawing = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CAD Drawing - ${drawingType}</title>
          <style>
            @page { size: A3 landscape; margin: 10mm; }
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .title-block { 
              border: 2px solid #000; 
              padding: 10px; 
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
            }
            .drawing { text-align: center; }
            svg { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div class="title-block">
            <div>
              <strong>Drawing Type:</strong> ${drawingType.replace(/_/g, " ").toUpperCase()}<br>
              <strong>Scale:</strong> 1:${scale}
            </div>
            <div>
              <strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}<br>
              <strong>Reference:</strong> ${drawingId || "N/A"}
            </div>
          </div>
          <div class="drawing">${svgContent}</div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setMeasureStart(null);
    setCurrentMeasure(null);
  };

  const removeMeasurement = (id: string) => {
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  const getCurrentDistance = (): number | null => {
    if (!measureStart || !currentMeasure) return null;
    const pixelDistance = Math.sqrt(
      Math.pow(currentMeasure.x - measureStart.x, 2) +
        Math.pow(currentMeasure.y - measureStart.y, 2)
    );
    return (pixelDistance / pixelsPerMM) * (scale / 50);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isFullscreen ? "max-w-full max-h-full w-screen h-screen" : "max-w-[95vw] max-h-[95vh] w-full h-[90vh]"} p-0 flex flex-col`}>
        <DialogHeader className="p-4 pb-2 flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg">
              CAD Drawing Preview
            </DialogTitle>
            <Badge variant="outline" className="capitalize">
              {drawingType.replace(/_/g, " ")}
            </Badge>
            <Badge variant="secondary">Scale 1:{scale}</Badge>
            {dimensions && (
              <Badge variant="outline" className="bg-primary/10">
                {dimensions.length}m × {dimensions.width}m
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            {/* Tool Selection */}
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
              <Button
                variant={activeTool === "pan" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTool("pan")}
                title="Pan Tool (drag to move)"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "measure" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTool("measure")}
                title="Measure Tool (click two points)"
              >
                <Ruler className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "select" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTool("select")}
                title="Select Tool"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Scale Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Scale:</span>
              {SCALE_OPTIONS.map((s) => (
                <Button
                  key={s.value}
                  variant={scale === s.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setScale(s.value)}
                >
                  {s.label}
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Zoom Controls */}
            <Button variant="outline" size="sm" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="w-32 flex items-center gap-2">
              <Slider
                value={[zoom * 100]}
                min={25}
                max={500}
                step={25}
                onValueChange={([v]) => setZoom(v / 100)}
              />
            </div>
            <span className="text-sm font-mono w-14 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* View Controls */}
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleFitToView} title="Fit to View">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetView} title="Reset View">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {measurements.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearMeasurements}>
                <X className="h-4 w-4 mr-1" />
                Clear ({measurements.length})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={printDrawing}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="default" size="sm" onClick={downloadSVG}>
              <Download className="h-4 w-4 mr-1" />
              Download SVG
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-white relative"
          style={{
            cursor: activeTool === "pan" ? (isPanning ? "grabbing" : "grab") : "crosshair",
            background: "linear-gradient(#f8f9fa, #f1f3f4)",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Overlay */}
          {showGrid && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width="100%"
              height="100%"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
              }}
            >
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                </pattern>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <rect width="50" height="50" fill="url(#smallGrid)" />
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#d1d5db" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="2000" height="2000" fill="url(#grid)" />
            </svg>
          )}

          {/* SVG Content */}
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(svgContent) }}
          />

          {/* Measurements Overlay */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
          >
            <g
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
              }}
            >
              {/* Completed Measurements */}
              {measurements.map((m) => (
                <g key={m.id}>
                  <line
                    x1={m.start.x}
                    y1={m.start.y}
                    x2={m.end.x}
                    y2={m.end.y}
                    stroke="#dc2626"
                    strokeWidth={2 / zoom}
                    strokeDasharray={`${6 / zoom} ${3 / zoom}`}
                  />
                  <circle cx={m.start.x} cy={m.start.y} r={5 / zoom} fill="#dc2626" stroke="#fff" strokeWidth={1 / zoom} />
                  <circle cx={m.end.x} cy={m.end.y} r={5 / zoom} fill="#dc2626" stroke="#fff" strokeWidth={1 / zoom} />
                  
                  {/* Dimension text with background */}
                  <rect
                    x={(m.start.x + m.end.x) / 2 - 40 / zoom}
                    y={(m.start.y + m.end.y) / 2 - 12 / zoom}
                    width={80 / zoom}
                    height={24 / zoom}
                    fill="white"
                    stroke="#dc2626"
                    strokeWidth={1.5 / zoom}
                    rx={4 / zoom}
                  />
                  <text
                    x={(m.start.x + m.end.x) / 2}
                    y={(m.start.y + m.end.y) / 2 + 5 / zoom}
                    textAnchor="middle"
                    fontSize={14 / zoom}
                    fill="#dc2626"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {formatDistance(m.distanceMM)}
                  </text>
                </g>
              ))}

              {/* Active Measurement */}
              {measureStart && currentMeasure && (
                <g>
                  <line
                    x1={measureStart.x}
                    y1={measureStart.y}
                    x2={currentMeasure.x}
                    y2={currentMeasure.y}
                    stroke="#2563eb"
                    strokeWidth={2 / zoom}
                    strokeDasharray={`${6 / zoom} ${3 / zoom}`}
                  />
                  <circle cx={measureStart.x} cy={measureStart.y} r={5 / zoom} fill="#2563eb" stroke="#fff" strokeWidth={1 / zoom} />
                  <circle cx={currentMeasure.x} cy={currentMeasure.y} r={5 / zoom} fill="#2563eb" stroke="#fff" strokeWidth={1 / zoom} />
                  
                  <rect
                    x={(measureStart.x + currentMeasure.x) / 2 - 40 / zoom}
                    y={(measureStart.y + currentMeasure.y) / 2 - 20 / zoom}
                    width={80 / zoom}
                    height={24 / zoom}
                    fill="white"
                    stroke="#2563eb"
                    strokeWidth={1.5 / zoom}
                    rx={4 / zoom}
                  />
                  <text
                    x={(measureStart.x + currentMeasure.x) / 2}
                    y={(measureStart.y + currentMeasure.y) / 2 - 3 / zoom}
                    textAnchor="middle"
                    fontSize={14 / zoom}
                    fill="#2563eb"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {formatDistance(getCurrentDistance() || 0)}
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Tool: <strong className="capitalize text-foreground">{activeTool}</strong>
            </span>
            {activeTool === "measure" && (
              <span className="text-primary font-medium">
                {measureStart ? "Click second point to complete measurement" : "Click first point to start measuring"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {measurements.length > 0 && (
              <span className="text-foreground">
                {measurements.length} measurement{measurements.length !== 1 ? "s" : ""} • 
                Total: {formatDistance(measurements.reduce((sum, m) => sum + m.distanceMM, 0))}
              </span>
            )}
            <span>Scroll to zoom • {activeTool === "pan" ? "Drag" : "Hold Shift+Drag"} to pan</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
