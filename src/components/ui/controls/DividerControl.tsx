import { ImagePicker } from '../ImagePicker';
import { useState } from 'react';

interface DividerControlProps {
  // Top divider
  topDividerEnabled?: boolean;
  topDividerType?: 'image' | 'svg';
  topDividerImageUrl?: string;
  topDividerSvgType?: 'wave' | 'slant';
  topDividerColor?: string;
  topDividerHeight?: number;
  topDividerFlip?: boolean;
  
  // Bottom divider
  bottomDividerEnabled?: boolean;
  bottomDividerType?: 'image' | 'svg';
  bottomDividerImageUrl?: string;
  bottomDividerSvgType?: 'wave' | 'slant';
  bottomDividerColor?: string;
  bottomDividerHeight?: number;
  bottomDividerFlip?: boolean;
  
  sectionId: string;
  onUpdate: (path: string[], value: any) => void;
}

export function DividerControl({
  topDividerEnabled = false,
  topDividerType = 'svg',
  topDividerImageUrl = '',
  topDividerSvgType = 'wave',
  topDividerColor = '#1E90FF',
  topDividerHeight = 100,
  topDividerFlip = false,
  
  bottomDividerEnabled = false,
  bottomDividerType = 'svg',
  bottomDividerImageUrl = '',
  bottomDividerSvgType = 'wave',
  bottomDividerColor = '#1E90FF',
  bottomDividerHeight = 100,
  bottomDividerFlip = false,
  
  sectionId,
  onUpdate,
}: DividerControlProps) {
  const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-xs font-semibold text-gray-700 mb-3">Dividers (Transitions visuelles)</h3>
      
      {/* Tabs pour Top/Bottom */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('top')}
          className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
            activeTab === 'top'
              ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
          }`}
        >
          Divider Haut
        </button>
        <button
          onClick={() => setActiveTab('bottom')}
          className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
            activeTab === 'bottom'
              ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
          }`}
        >
          Divider Bas
        </button>
      </div>

      {/* Top Divider */}
      {activeTab === 'top' && (
        <div className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="topDividerEnabled"
              checked={topDividerEnabled}
              onChange={(e) => onUpdate(['topDividerEnabled'], e.target.checked)}
              className="w-4 h-4 text-[#1E90FF] border-gray-300 rounded focus:ring-[#1E90FF]"
            />
            <label htmlFor="topDividerEnabled" className="text-sm text-gray-700">
              Activer le divider en haut
            </label>
          </div>

          {topDividerEnabled && (
            <>
              {/* Type: Image ou SVG */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Type de divider
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(['topDividerType'], 'svg')}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      topDividerType === 'svg'
                        ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                    }`}
                  >
                    SVG
                  </button>
                  <button
                    onClick={() => onUpdate(['topDividerType'], 'image')}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      topDividerType === 'image'
                        ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                    }`}
                  >
                    Image
                  </button>
                </div>
              </div>

              {/* Si SVG */}
              {topDividerType === 'svg' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Forme SVG
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdate(['topDividerSvgType'], 'wave')}
                        className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                          topDividerSvgType === 'wave'
                            ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                        }`}
                      >
                        Vague
                      </button>
                      <button
                        onClick={() => onUpdate(['topDividerSvgType'], 'slant')}
                        className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                          topDividerSvgType === 'slant'
                            ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                        }`}
                      >
                        Ligne penchée
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Couleur
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={topDividerColor}
                        onChange={(e) => onUpdate(['topDividerColor'], e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={topDividerColor}
                        onChange={(e) => onUpdate(['topDividerColor'], e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                        placeholder="#1E90FF"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Si Image */}
              {topDividerType === 'image' && (
                <ImagePicker
                  value={topDividerImageUrl}
                  onChange={(url) => onUpdate(['topDividerImageUrl'], url)}
                  sectionId={sectionId}
                  label="Image du divider"
                />
              )}

              {/* Hauteur */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Hauteur (px)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={topDividerHeight}
                    onChange={(e) => onUpdate(['topDividerHeight'], parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                  />
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={topDividerHeight}
                    onChange={(e) => onUpdate(['topDividerHeight'], parseInt(e.target.value) || 100)}
                    className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  />
                </div>
              </div>

              {/* Flip */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="topDividerFlip"
                  checked={topDividerFlip}
                  onChange={(e) => onUpdate(['topDividerFlip'], e.target.checked)}
                  className="w-4 h-4 text-[#1E90FF] border-gray-300 rounded focus:ring-[#1E90FF]"
                />
                <label htmlFor="topDividerFlip" className="text-sm text-gray-700">
                  Retourner verticalement
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom Divider */}
      {activeTab === 'bottom' && (
        <div className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bottomDividerEnabled"
              checked={bottomDividerEnabled}
              onChange={(e) => onUpdate(['bottomDividerEnabled'], e.target.checked)}
              className="w-4 h-4 text-[#1E90FF] border-gray-300 rounded focus:ring-[#1E90FF]"
            />
            <label htmlFor="bottomDividerEnabled" className="text-sm text-gray-700">
              Activer le divider en bas
            </label>
          </div>

          {bottomDividerEnabled && (
            <>
              {/* Type: Image ou SVG */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Type de divider
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(['bottomDividerType'], 'svg')}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      bottomDividerType === 'svg'
                        ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                    }`}
                  >
                    SVG
                  </button>
                  <button
                    onClick={() => onUpdate(['bottomDividerType'], 'image')}
                    className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                      bottomDividerType === 'image'
                        ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                    }`}
                  >
                    Image
                  </button>
                </div>
              </div>

              {/* Si SVG */}
              {bottomDividerType === 'svg' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Forme SVG
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdate(['bottomDividerSvgType'], 'wave')}
                        className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                          bottomDividerSvgType === 'wave'
                            ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                        }`}
                      >
                        Vague
                      </button>
                      <button
                        onClick={() => onUpdate(['bottomDividerSvgType'], 'slant')}
                        className={`flex-1 px-3 py-2 text-xs rounded border transition-all ${
                          bottomDividerSvgType === 'slant'
                            ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#1E90FF]'
                        }`}
                      >
                        Ligne penchée
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Couleur
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bottomDividerColor}
                        onChange={(e) => onUpdate(['bottomDividerColor'], e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bottomDividerColor}
                        onChange={(e) => onUpdate(['bottomDividerColor'], e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                        placeholder="#1E90FF"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Si Image */}
              {bottomDividerType === 'image' && (
                <ImagePicker
                  value={bottomDividerImageUrl}
                  onChange={(url) => onUpdate(['bottomDividerImageUrl'], url)}
                  sectionId={sectionId}
                  label="Image du divider"
                />
              )}

              {/* Hauteur */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  Hauteur (px)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={bottomDividerHeight}
                    onChange={(e) => onUpdate(['bottomDividerHeight'], parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
                  />
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={bottomDividerHeight}
                    onChange={(e) => onUpdate(['bottomDividerHeight'], parseInt(e.target.value) || 100)}
                    className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                  />
                </div>
              </div>

              {/* Flip */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bottomDividerFlip"
                  checked={bottomDividerFlip}
                  onChange={(e) => onUpdate(['bottomDividerFlip'], e.target.checked)}
                  className="w-4 h-4 text-[#1E90FF] border-gray-300 rounded focus:ring-[#1E90FF]"
                />
                <label htmlFor="bottomDividerFlip" className="text-sm text-gray-700">
                  Retourner verticalement
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
