import avatarImage from "@/assets/avatar.jpg";

export function AvatarBubble() {
  return (
    <div className="fixed bottom-24 right-6 z-40 flex items-end gap-3 animate-fade-in-up" style={{ animationDelay: "900ms" }}>
      {/* Speech bubble */}
      <div className="relative max-w-[260px] p-3 rounded-2xl glass-card border-primary/20">
        <p className="text-sm text-foreground/90 leading-relaxed">
          Shall we plan your day or dive into finances?
        </p>
        {/* Bubble tail */}
        <div className="absolute -right-2 bottom-3 w-0 h-0 border-l-8 border-l-foreground/5 border-y-4 border-y-transparent" />
      </div>
      
      {/* Avatar */}
      <div className="relative shrink-0">
        {/* Glow ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 blur-md opacity-60 animate-pulse-glow" />
        
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40">
          <img 
            src={avatarImage} 
            alt="SITA AI Assistant" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
