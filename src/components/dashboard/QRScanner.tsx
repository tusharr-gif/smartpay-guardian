import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Zap, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        onScan(decodedText);
        html5QrCode.stop().catch(err => console.error("Stop failed", err));
      },
      () => {
        // Validation error, ignore
      }
    ).catch(err => {
      console.error("Unable to start scanning", err);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, [onScan]);

  const toggleFlash = async () => {
    if (scannerRef.current) {
        try {
            await scannerRef.current.applyVideoConstraints({ advanced: [{ torch: !isFlashOn } as any] });
            setIsFlashOn(!isFlashOn);
        } catch (err) {
            console.error("Flash toggle failed via applyVideoConstraints", err);
            try {
                // Fallback directly on track
                const track = (scannerRef.current as any).getRunningTrack();
                if (track) {
                    await track.applyConstraints({ advanced: [{ torch: !isFlashOn } as any] });
                    setIsFlashOn(!isFlashOn);
                }
            } catch (fallbackErr) {
               console.error("Fallback flash toggle failed", fallbackErr);
            }
        }
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !scannerRef.current) return;

    try {
      const decodedText = await scannerRef.current.scanFile(file, false);
      onScan(decodedText);
    } catch (err) {
      console.error("Image scan failed", err);
      toast.error("Could not find a valid QR code in the image.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md active:scale-95 transition-transform">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-white font-black uppercase tracking-widest text-sm">Scan QR Code</h2>
        <div className="h-12 w-12" /> {/* Spacer */}
      </div>

      {/* Scanner Viewport */}
      <div className="flex-1 relative">
        <div id="qr-reader" className="h-full w-full [&>video]:object-cover [&>video]:h-full [&>video]:w-full"></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative h-64 w-64">
            {/* Corner Borders with glow */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-primary rounded-tl-3xl shadow-[-5px_-5px_20px_rgba(59,130,246,0.5)]" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-primary rounded-tr-3xl shadow-[5px_-5px_20px_rgba(59,130,246,0.5)]" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-primary rounded-bl-3xl shadow-[-5px_5px_20px_rgba(59,130,246,0.5)]" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-primary rounded-br-3xl shadow-[5px_5px_20px_rgba(59,130,246,0.5)]" />
            
            {/* Scanning Line Animation */}
            <motion.div 
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute left-1 right-1 h-0.5 bg-primary shadow-[0_0_15px_2px_rgba(59,130,246,0.8)] z-20"
            />
            
            {/* Scan Box Gradient Overlay */}
            <div className="absolute inset-2 border border-white/10 rounded-2xl bg-primary/5" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 p-10 pb-16 flex items-center justify-around bg-gradient-to-t from-black/80 to-transparent z-10">
        <button 
          onClick={toggleFlash} 
          className={`h-16 w-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${isFlashOn ? "bg-primary text-white" : "bg-white/10 text-white"}`}
        >
          <Zap className={`h-6 w-6 ${isFlashOn ? "fill-white" : ""}`} />
        </button>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 px-6 border border-white/10">
           <p className="text-white font-black text-[10px] uppercase tracking-tighter">AI Guardian Scanning Active</p>
        </div>

        <label className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all cursor-pointer">
          <ImageIcon className="h-6 w-6" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
          />
        </label>
      </div>

      <div className="absolute bottom-36 inset-x-0 text-center pointer-events-none px-12">
        <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed drop-shadow-md">
          Januin Secure Scan v4.2
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
