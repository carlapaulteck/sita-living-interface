import avatarImage from "@/assets/avatar.jpg";

export function AvatarHero() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div className="absolute w-72 h-72 rounded-full bg-secondary/20 blur-3xl animate-pulse-glow" />
      
      {/* Cyan halo ring */}
      <div className="absolute w-64 h-64 rounded-full border-4 border-secondary/50 shadow-glow-cyan animate-pulse-glow" />
      
      {/* Inner decorative ring */}
      <div className="absolute w-56 h-56 rounded-full border border-secondary/20" />
      
      {/* Avatar container */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-foreground/10">
        {/* Avatar gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
        
        <img 
          src={avatarImage} 
          alt="SITA AI Avatar" 
          className="w-full h-full object-cover object-top scale-110"
        />
      </div>
    </div>
  );
}
