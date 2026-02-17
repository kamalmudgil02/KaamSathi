'use client';

import React from 'react';

interface LottiePlayerProps {
    animationName: string;
    className?: string;
}

export default function LottiePlayer({ animationName, className = '' }: LottiePlayerProps) {
    // This is a placeholder component for Lottie animations
    // In production, you would:
    // 1. Download Lottie JSON files from lottiefiles.com
    // 2. Install lottie-react: npm install lottie-react
    // 3. Import and use the Lottie component

    const placeholderText = {
        builder: '👷 Builder Animation',
        electrician: '⚡ Electrician Animation',
        carpenter: '🔨 Carpenter Animation',
        plumber: '🔧 Plumber Animation',
        whitewasher: '🎨 Painter Animation',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl">
                <div className="text-6xl mb-4 animate-float">
                    {animationName === 'builder' && '👷'}
                    {animationName === 'electrician' && '⚡'}
                    {animationName === 'carpenter' && '🔨'}
                    {animationName === 'plumber' && '🔧'}
                    {animationName === 'whitewasher' && '🎨'}
                </div>
                <p className="text-sm text-neutral-600">
                    {placeholderText[animationName as keyof typeof placeholderText] || 'Animation Placeholder'}
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                    Replace with actual Lottie JSON
                </p>
            </div>
        </div>
    );
}

/* 
  To use actual Lottie animations:
  
  1. Install: npm install lottie-react
  
  2. Download animations from https://lottiefiles.com/
     - Search for "builder", "electrician", "carpenter" etc.
     - Download as JSON
     - Place in /public/animations/ folder
  
  3. Replace this component with:
  
  import Lottie from 'lottie-react';
  import builderAnimation from '@/public/animations/builder.json';
  
  export default function LottiePlayer({ animationName, className = '' }) {
    const animations = {
      builder: builderAnimation,
      electrician: electricianAnimation,
      // ... etc
    };
    
    return (
      <Lottie 
        animationData={animations[animationName]} 
        className={className}
        loop={true}
      />
    );
  }
*/
