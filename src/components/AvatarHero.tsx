import avatarImage from "@/assets/avatar.jpg";
import { motion } from "framer-motion";

export function AvatarHero() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer purple-gold gradient glow */}
      <motion.div 
        className="absolute w-72 h-72 rounded-full bg-gradient-to-b from-secondary/30 via-accent/20 to-primary/30 blur-3xl"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Cyan halo ring - animated */}
      <motion.div 
        className="absolute w-56 h-56 rounded-full border-4 border-accent/60"
        style={{
          boxShadow: "0 0 30px rgba(76, 224, 224, 0.5), 0 0 60px rgba(76, 224, 224, 0.3), inset 0 0 30px rgba(76, 224, 224, 0.1)"
        }}
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Inner decorative ring */}
      <div className="absolute w-52 h-52 rounded-full border border-accent/20" />
      
      {/* Avatar container */}
      <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-accent/30">
        {/* Avatar gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
        
        <img 
          src={avatarImage} 
          alt="AI Avatar" 
          className="w-full h-full object-cover object-top scale-110"
        />
      </div>
      
      {/* Sparkle effects */}
      <motion.div
        className="absolute -top-2 right-8 w-2 h-2 rounded-full bg-primary"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute top-12 -left-4 w-1.5 h-1.5 rounded-full bg-secondary"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1
        }}
      />
    </div>
  );
}
