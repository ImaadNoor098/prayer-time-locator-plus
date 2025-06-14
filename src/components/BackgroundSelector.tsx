
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

export interface BackgroundOption {
  id: string;
  name: string;
  className: string;
  description: string;
  preview: string;
}

const backgroundOptions: BackgroundOption[] = [
  {
    id: 'islamic-pattern',
    name: 'Islamic Pattern',
    className: 'islamic-pattern-bg',
    description: 'Traditional Islamic geometric pattern',
    preview: 'bg-gradient-to-br from-orange-50 to-green-50'
  },
  {
    id: 'geometric',
    name: 'Geometric',
    className: 'geometric-bg',
    description: 'Clean geometric shapes',
    preview: 'bg-gradient-to-br from-yellow-50 to-orange-50'
  },
  {
    id: 'mosque-silhouette',
    name: 'Mosque Silhouette',
    className: 'mosque-silhouette-bg',
    description: 'Subtle mosque patterns',
    preview: 'bg-gradient-to-br from-blue-50 to-green-50'
  },
  {
    id: 'gradient-waves',
    name: 'Gradient Waves',
    className: 'gradient-waves-bg',
    description: 'Animated flowing gradients',
    preview: 'bg-gradient-to-br from-blue-100 via-orange-50 to-blue-100'
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    className: 'luxury-gold-bg',
    description: 'Rich golden luxury theme',
    preview: 'bg-gradient-to-br from-yellow-200 to-orange-400'
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    className: 'starry-night-bg',
    description: 'Night sky with twinkling stars',
    preview: 'bg-gradient-to-br from-slate-900 to-yellow-200'
  },
  {
    id: 'marble-texture',
    name: 'Marble Texture',
    className: 'marble-texture-bg',
    description: 'Elegant marble-like texture',
    preview: 'bg-gradient-to-br from-slate-50 to-green-50'
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    className: 'sunset-gradient-bg',
    description: 'Warm sunset colors',
    preview: 'bg-gradient-to-br from-pink-100 to-rose-200'
  }
];

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (backgroundId: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onBackgroundChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-islamic-blue">
          <Palette className="h-5 w-5 mr-2" />
          Choose Background Style
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {backgroundOptions.map((option) => (
            <div
              key={option.id}
              className="relative cursor-pointer group"
              onClick={() => onBackgroundChange(option.id)}
            >
              <div
                className={`
                  w-full h-20 rounded-lg border-2 transition-all duration-200
                  ${currentBackground === option.id 
                    ? 'border-islamic-green shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-islamic-blue group-hover:scale-102'
                  }
                  ${option.preview}
                `}
              >
                {currentBackground === option.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-islamic-green text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-islamic-blue">
                  {option.name}
                </p>
                <p className="text-xs text-islamic-gray">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-islamic-blue/5 rounded-lg">
          <h4 className="font-medium text-islamic-blue mb-2">
            Tips for Eye-Catching Backgrounds:
          </h4>
          <ul className="text-sm text-islamic-gray space-y-1">
            <li>• Animated backgrounds add modern appeal</li>
            <li>• Subtle patterns maintain readability</li>
            <li>• Luxury themes convey premium feel</li>
            <li>• Night themes reduce eye strain</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundSelector;
export { backgroundOptions };
