import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemePresetKey } from '../../services/themeService';
import { Sun, Moon, Anchor, Check, Sparkles, ChevronDown } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { currentPreset, setVisitorTheme, isVisitorOverride, clearVisitorTheme, presets } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { id: ThemePresetKey; name: string; icon: any; color: string }[] = [
    { id: 'light', name: 'Light', icon: Sun, color: '#F7F9FC' },
    { id: 'scaleup-navy', name: 'ScaleUp Navy', icon: Anchor, color: '#07111F' },
    { id: 'midnight', name: 'Midnight', icon: Moon, color: '#050608' },
  ];

  const currentOption = themeOptions.find((t) => t.id === currentPreset) || themeOptions[1];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-secondary)] text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-all shadow-sm text-xs font-semibold"
        title="Switch Website Theme"
        aria-label="Theme Selector"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
        <span className="hidden md:inline text-xs">{currentOption.name}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] border-b border-[var(--theme-border)] mb-1 flex items-center justify-between">
            <span>Select Theme</span>
            {isVisitorOverride && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearVisitorTheme();
                  setIsOpen(false);
                }}
                className="text-[9px] text-[var(--theme-accent)] hover:underline"
              >
                Reset Default
              </button>
            )}
          </div>

          <div className="space-y-1">
            {themeOptions.map(({ id, name, icon: Icon, color }) => {
              const isSelected = currentPreset === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setVisitorTheme(id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[var(--theme-primary)] text-white shadow-sm'
                      : 'text-[var(--theme-text)] hover:bg-[var(--theme-surface-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
