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
  Maximize2,
  Grid3X3,
  MousePointer,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CADPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  svgContent: string;
  drawingType: string;
  drawingId?: string;
}

type Tool = "pan" | "measure" | "select";

interface MeasurementPoint {
  x: number;
  y: number;
}

interface Measurement {
  start: MeasurementPoint;
  end: MeasurementPoint;
  distance: number;
}

export function CADPreviewModal({
  open,
  onOpenChange,
  svgContent,
  drawingType,
  drawingId,
}: CADPreviewModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<Tool>("pan");
  const [showGrid, setShowGrid] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [measureStart, setMeasureStart] = useState<MeasurementPoint | null>(null);
  const [currentMeasure, setCurrentMeasure] = useState<MeasurementPoint | null>(null);
  const scale = 50; // 1:50 scale - 1 pixel = 20mm at 100% zoom

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setMeasurements([]);
    setMeasureStart(null);
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
          const distance = Math.sqrt(
            Math.pow(x - measureStart.x, 2) + Math.pow(y - measureStart.y, 2)
          );
          // Convert pixels to mm at 1:50 scale
          const realDistance = (distance / scale) * 1000;
          setMeasurements([
            ...measurements,
            { start: measureStart, end: { x, y }, distance: realDistance },
          ]);
          setMeasureStart(null);
          setCurrentMeasure(null);
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

  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAD-${drawingType}-${drawingId || Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded");
  };

  const clearMeasurements = () => {
    setMeasurements([]);
    setMeasureStart(null);
    setCurrentMeasure(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <DialogHeader className="p-4 pb-0 flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg">
              CAD Drawing Preview
            </DialogTitle>
            <Badge variant="outline" className="capitalize">
              {drawingType.replace(/_/g, " ")}
            </Badge>
            <Badge variant="secondary">Scale 1:{scale}</Badge>
          </div>
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
                title="Pan Tool"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "measure" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTool("measure")}
                title="Measure Tool"
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

            {/* Zoom Controls */}
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="w-24 flex items-center gap-2">
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
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
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
            <Button variant="outline" size="sm" onClick={handleResetView} title="Reset View">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {measurements.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearMeasurements}>
                <X className="h-4 w-4 mr-1" />
                Clear Measurements
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={downloadSVG}>
              <Download className="h-4 w-4 mr-1" />
              Download SVG
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-white relative cursor-crosshair"
          style={{
            cursor: activeTool === "pan" ? (isPanning ? "grabbing" : "grab") : "crosshair",
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
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {/* SVG Content */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          {/* Measurements Overlay */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Completed Measurements */}
            {measurements.map((m, i) => (
              <g key={i}>
                <line
                  x1={m.start.x}
                  y1={m.start.y}
                  x2={m.end.x}
                  y2={m.end.y}
                  stroke="#ef4444"
                  strokeWidth={2 / zoom}
                  strokeDasharray={`${4 / zoom} ${2 / zoom}`}
                />
                <circle cx={m.start.x} cy={m.start.y} r={4 / zoom} fill="#ef4444" />
                <circle cx={m.end.x} cy={m.end.y} r={4 / zoom} fill="#ef4444" />
                <rect
                  x={(m.start.x + m.end.x) / 2 - 30 / zoom}
                  y={(m.start.y + m.end.y) / 2 - 10 / zoom}
                  width={60 / zoom}
                  height={20 / zoom}
                  fill="white"
                  stroke="#ef4444"
                  strokeWidth={1 / zoom}
                  rx={3 / zoom}
                />
                <text
                  x={(m.start.x + m.end.x) / 2}
                  y={(m.start.y + m.end.y) / 2 + 4 / zoom}
                  textAnchor="middle"
                  fontSize={12 / zoom}
                  fill="#ef4444"
                  fontWeight="bold"
                >
                  {m.distance >= 1000
                    ? `${(m.distance / 1000).toFixed(2)}m`
                    : `${Math.round(m.distance)}mm`}
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
                  stroke="#3b82f6"
                  strokeWidth={2 / zoom}
                  strokeDasharray={`${4 / zoom} ${2 / zoom}`}
                />
                <circle cx={measureStart.x} cy={measureStart.y} r={4 / zoom} fill="#3b82f6" />
                <circle cx={currentMeasure.x} cy={currentMeasure.y} r={4 / zoom} fill="#3b82f6" />
                <text
                  x={(measureStart.x + currentMeasure.x) / 2}
                  y={(measureStart.y + currentMeasure.y) / 2 - 10 / zoom}
                  textAnchor="middle"
                  fontSize={12 / zoom}
                  fill="#3b82f6"
                  fontWeight="bold"
                >
                  {(() => {
                    const d =
                      (Math.sqrt(
                        Math.pow(currentMeasure.x - measureStart.x, 2) +
                          Math.pow(currentMeasure.y - measureStart.y, 2)
                      ) /
                        scale) *
                      1000;
                    return d >= 1000
                      ? `${(d / 1000).toFixed(2)}m`
                      : `${Math.round(d)}mm`;
                  })()}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Tool: <strong className="capitalize">{activeTool}</strong>
            </span>
            {activeTool === "measure" && (
              <span className="text-primary">Click two points to measure distance</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {measurements.length > 0 && (
              <span>{measurements.length} measurement(s)</span>
            )}
            <span>Scroll to zoom • Drag to pan</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
