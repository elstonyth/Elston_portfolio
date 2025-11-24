import React, { useState } from 'react';
import { Download, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeDownloadProps {
  variant?: 'primary' | 'secondary' | 'link';
  className?: string;
  showIcon?: boolean;
}

export const ResumeDownload: React.FC<ResumeDownloadProps> = ({ 
  variant = 'primary',
  className,
  showIcon = true 
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    
    // Track download event (you can integrate with analytics later)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'resume_download', {
        event_category: 'engagement',
        event_label: 'Resume PDF Download'
      });
    }

    setTimeout(() => setDownloaded(false), 3000);
  };

  const variants = {
    primary: "flex-1 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 active:scale-95",
    secondary: "inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-all active:scale-95 gap-2",
    link: "hover:text-white transition-colors inline-flex items-center gap-2"
  };

  return (
    <a
      href="/ElstonYeo_FullStack_AI_Resume_2025.pdf"
      download="ElstonYeo_FullStack_AI_Resume_2025.pdf"
      onClick={handleDownload}
      className={cn(variants[variant], className)}
      aria-label="Download Elston Yeo's Resume"
    >
      {downloaded ? (
        <>
          <Check size={18} className="animate-in zoom-in duration-200" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          {showIcon && (variant === 'link' ? <FileText size={18} /> : <Download size={18} />)}
          <span>Resume</span>
        </>
      )}
    </a>
  );
};
