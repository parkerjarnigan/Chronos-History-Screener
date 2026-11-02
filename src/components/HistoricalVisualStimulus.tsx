import React, { useState } from 'react';
import { ZoomIn, Eye, Sparkles } from 'lucide-react';

interface HistoricalVisualStimulusProps {
  visualId: string;
  imageUrl?: string;
  imageAlt?: string;
  title: string;
  caption?: string;
}

export const HistoricalVisualStimulus: React.FC<HistoricalVisualStimulusProps> = ({
  visualId,
  imageUrl,
  imageAlt,
  title,
  caption,
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  const resolvedImageUrl = imageUrl
    ? (imageUrl.startsWith('http') || imageUrl.startsWith('data:')
        ? imageUrl
        : `${import.meta.env.BASE_URL}${imageUrl.replace(/^\//, '')}`)
    : undefined;

  return (
    <div className="w-full my-6 rounded-2xl overflow-hidden border-2 border-stone-300 dark:border-stone-700 bg-stone-900 shadow-md">
      {/* Visual Header */}
      <div className="px-5 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Eye className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-base sm:text-lg text-stone-100 tracking-wide uppercase">
            {title}
          </span>
        </div>
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
          title="Toggle Zoom / Expanded View"
        >
          <ZoomIn className="w-4 h-4 text-amber-400" />
          <span>{isZoomed ? 'Standard View' : 'Zoom Visual'}</span>
        </button>
      </div>

      {/* Visual Canvas Area */}
      <div className={`p-4 sm:p-6 flex items-center justify-center bg-stone-900/90 transition-all ${
        isZoomed ? 'min-h-[500px]' : 'min-h-[300px]'
      }`}>
        {resolvedImageUrl && !imageFailed ? (
          <div className="w-full flex items-center justify-center p-2 overflow-auto">
            <img
              src={resolvedImageUrl}
              alt={imageAlt || title}
              className={`w-auto h-auto max-h-[550px] object-contain rounded-xl shadow-2xl border-2 border-stone-700 transition-all duration-300 select-none ${
                isZoomed ? 'scale-110 sm:scale-125 my-8 shadow-amber-500/10' : 'scale-100'
              }`}
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <>
        {/* ======================================================== */}
        {/* VISUAL 1: 1789 FRENCH REVOLUTION THREE ESTATES CARTOON   */}
        {/* ======================================================== */}
        {visualId === 'estates-cartoon' && (
          <div className="w-full max-w-2xl bg-amber-50 rounded-xl p-4 sm:p-6 border border-stone-300 text-stone-900 shadow-inner">
            <svg 
              viewBox="0 0 600 380" 
              className="w-full h-auto drop-shadow-sm select-none" 
              role="img" 
              aria-label="Political cartoon of the Three Estates in France (1789)"
            >
              <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="100%" stopColor="#fed7aa" />
                </linearGradient>
                <filter id="sketchFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                </filter>
              </defs>

              {/* Background Antique Plate */}
              <rect x="10" y="10" width="580" height="360" rx="8" fill="url(#bgGrad)" stroke="#78350f" strokeWidth="2" strokeDasharray="6 3" />

              {/* Title Scroll */}
              <rect x="70" y="24" width="460" height="34" rx="4" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
              <text x="300" y="46" textAnchor="middle" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#78350f" fontStyle="italic">
                "A faut esperer q'eu jeu la finira bentot" (One hopes this game ends soon)
              </text>

              {/* Landscape / Field / Unfair Game (Crops eaten by protected animals) */}
              <path d="M 30 330 Q 300 310 570 330 L 570 360 L 30 360 Z" fill="#d97706" opacity="0.3" />
              <text x="70" y="320" fontSize="11" fontFamily="sans-serif" fill="#78350f" fontWeight="bold">
                🌾 Peasants forbidden by law to hunt birds/rabbits destroying their crops
              </text>

              {/* THIRD ESTATE: The Peasant on hands and knees */}
              <g transform="translate(140, 180)">
                {/* Body hunched */}
                <ellipse cx="140" cy="80" rx="75" ry="32" fill="#a8a29e" stroke="#292524" strokeWidth="3" transform="rotate(-10 140 80)" />
                {/* Legs & knees */}
                <path d="M 75 90 L 45 130 L 30 130" stroke="#292524" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 90 95 L 70 135 L 50 135" stroke="#292524" strokeWidth="7" strokeLinecap="round" fill="none" />
                {/* Arms on ground */}
                <path d="M 195 90 L 225 135 L 240 135" stroke="#292524" strokeWidth="8" strokeLinecap="round" fill="none" />
                {/* Head hanging low in exhaustion */}
                <circle cx="215" cy="70" r="18" fill="#d6d3d1" stroke="#292524" strokeWidth="2.5" />
                <path d="M 205 76 Q 215 72 225 76" stroke="#44403c" strokeWidth="2" fill="none" />
                {/* Wooden Hoe Tool on Ground */}
                <line x1="20" y1="135" x2="260" y2="135" stroke="#78350f" strokeWidth="4" />
                <rect x="250" y="125" width="20" height="15" fill="#451a03" />
                {/* Label */}
                <rect x="90" y="105" width="110" height="22" rx="4" fill="#ffffff" stroke="#292524" />
                <text x="145" y="120" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
                  3rd ESTATE (Commoners)
                </text>
              </g>

              {/* FIRST & SECOND ESTATES: Riding comfortably on his back */}
              {/* Clergy (1st Estate) */}
              <g transform="translate(190, 80)">
                <ellipse cx="60" cy="90" rx="36" ry="42" fill="#7c3aed" stroke="#4c1d95" strokeWidth="2.5" />
                <circle cx="60" cy="40" r="17" fill="#fde047" stroke="#854d0e" strokeWidth="2" />
                {/* Bishop Mitre Hat */}
                <path d="M 45 35 L 60 5 L 75 35 Z" fill="#a855f7" stroke="#581c87" strokeWidth="2" />
                {/* Gold Cross */}
                <line x1="60" y1="70" x2="60" y2="105" stroke="#facc15" strokeWidth="4" />
                <line x1="50" y1="80" x2="70" y2="80" stroke="#facc15" strokeWidth="4" />
                <text x="60" y="145" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4c1d95" fontFamily="sans-serif">
                  1st: CLERGY
                </text>
              </g>

              {/* Nobility (2nd Estate) */}
              <g transform="translate(280, 75)">
                <ellipse cx="60" cy="95" rx="38" ry="44" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
                <circle cx="60" cy="42" r="17" fill="#fed7aa" stroke="#9a3412" strokeWidth="2" />
                {/* Plumed Feather Hat */}
                <ellipse cx="60" cy="30" rx="26" ry="7" fill="#1e293b" />
                <path d="M 60 25 Q 85 5 100 20" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />
                {/* Aristocratic Sword */}
                <line x1="85" y1="95" x2="135" y2="135" stroke="#475569" strokeWidth="4" />
                <line x1="80" y1="90" x2="90" y2="100" stroke="#f59e0b" strokeWidth="5" />
                <text x="60" y="150" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#991b1b" fontFamily="sans-serif">
                  2nd: NOBILITY
                </text>
              </g>

              {/* Callout box */}
              <rect x="360" y="240" width="210" height="50" rx="6" fill="#ffffff" stroke="#b45309" strokeWidth="1.5" />
              <text x="465" y="260" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">
                97% of French Citizens
              </text>
              <text x="465" y="278" textAnchor="middle" fontSize="10" fill="#451a03" fontFamily="sans-serif">
                Paid 100% of taxes; 0 political voice
              </text>
            </svg>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISUAL 2: 1914 CHAIN OF FRIENDSHIP ALLIANCES CARTOON     */}
        {/* ======================================================== */}
        {visualId === 'chain-alliances' && (
          <div className="w-full max-w-2xl bg-stone-100 rounded-xl p-4 sm:p-6 border border-stone-300 text-stone-900 shadow-inner">
            <svg 
              viewBox="0 0 620 340" 
              className="w-full h-auto drop-shadow-sm select-none"
              role="img"
              aria-label="Chain of Friendship cartoon showing alliances in 1914"
            >
              {/* Header Banner */}
              <rect x="20" y="12" width="580" height="34" rx="4" fill="#0f172a" />
              <text x="310" y="34" textAnchor="middle" fontFamily="sans-serif" fontSize="15" fontWeight="bold" fill="#f8fafc">
                "THE CHAIN OF FRIENDSHIP" — THE ENTANGLING ALLIANCES (JULY 1914)
              </text>

              {/* Chain Links connecting figures */}
              <path d="M 60 160 Q 150 140 230 160 T 360 160 T 470 160 T 560 160" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 4" fill="none" />

              {/* 1. Serbia (small figure) */}
              <g transform="translate(30, 110)">
                <circle cx="30" cy="50" r="14" fill="#fbcfe8" stroke="#831843" strokeWidth="2" />
                <rect x="22" y="64" width="16" height="50" fill="#be185d" rx="4" />
                <text x="30" y="130" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#831843">SERBIA</text>
                {/* Speech bubble */}
                <rect x="-10" y="0" width="85" height="28" rx="4" fill="#ffffff" stroke="#831843" />
                <text x="32" y="18" textAnchor="middle" fontSize="9" fontWeight="bold">"If you touch me..."</text>
              </g>

              {/* 2. Austria-Hungary */}
              <g transform="translate(130, 95)">
                <circle cx="30" cy="50" r="17" fill="#fed7aa" stroke="#9a3412" strokeWidth="2" />
                <rect x="20" y="67" width="20" height="65" fill="#ea580c" rx="4" />
                <line x1="38" y1="80" x2="60" y2="60" stroke="#7c2d12" strokeWidth="5" strokeLinecap="round" />
                <text x="30" y="150" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c2d12">AUSTRIA</text>
                {/* Speech bubble */}
                <rect x="-10" y="-12" width="95" height="30" rx="4" fill="#ffffff" stroke="#7c2d12" />
                <text x="37" y="7" textAnchor="middle" fontSize="9" fontWeight="bold">"If you make a move..."</text>
              </g>

              {/* 3. Russia */}
              <g transform="translate(250, 80)">
                <circle cx="35" cy="50" r="20" fill="#bbf7d0" stroke="#14532d" strokeWidth="2" />
                <rect x="22" y="70" width="26" height="80" fill="#15803d" rx="4" />
                <line x1="45" y1="85" x2="70" y2="55" stroke="#14532d" strokeWidth="6" strokeLinecap="round" />
                <text x="35" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#14532d">RUSSIA</text>
                {/* Speech bubble */}
                <rect x="-10" y="-14" width="100" height="32" rx="4" fill="#ffffff" stroke="#14532d" />
                <text x="40" y="7" textAnchor="middle" fontSize="9" fontWeight="bold">"If you hit that little fellow..."</text>
              </g>

              {/* 4. Germany */}
              <g transform="translate(370, 70)">
                <circle cx="35" cy="50" r="22" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
                <rect x="22" y="72" width="26" height="90" fill="#78350f" rx="4" />
                {/* Pickelhaube spiked helmet */}
                <path d="M 22 36 L 35 18 L 48 36 Z" fill="#ca8a04" />
                <line x1="35" y1="18" x2="35" y2="10" stroke="#ca8a04" strokeWidth="3" />
                <line x1="48" y1="90" x2="80" y2="55" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
                <text x="35" y="180" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#451a03">GERMANY</text>
                {/* Speech bubble */}
                <rect x="-10" y="-14" width="95" height="30" rx="4" fill="#ffffff" stroke="#451a03" />
                <text x="37" y="6" textAnchor="middle" fontSize="9" fontWeight="bold">"If you strike my friend..."</text>
              </g>

              {/* 5. France & Britain */}
              <g transform="translate(490, 75)">
                <circle cx="30" cy="48" r="18" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
                <rect x="18" y="66" width="24" height="85" fill="#0284c7" rx="4" />
                <circle cx="65" cy="48" r="18" fill="#fee2e2" stroke="#b91c1c" strokeWidth="2" />
                <rect x="53" y="66" width="24" height="85" fill="#b91c1c" rx="4" />
                <text x="48" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0f172a">FRANCE & BRITAIN</text>
                {/* Speech bubble */}
                <rect x="-10" y="-12" width="115" height="30" rx="4" fill="#ffffff" stroke="#0f172a" />
                <text x="47" y="6" textAnchor="middle" fontSize="9" fontWeight="bold">"Hi there, if you chaps..."</text>
              </g>

              {/* Bottom Explanatory Strip */}
              <rect x="20" y="275" width="580" height="50" rx="6" fill="#f8fafc" stroke="#cbd5e1" />
              <text x="310" y="295" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">
                DOMINO EFFECT: Mutual defense treaties forced a local Balkan conflict into a global world war
              </text>
              <text x="310" y="313" textAnchor="middle" fontSize="11" fill="#475569">
                Triple Entente (Britain, France, Russia) vs. Central Powers (Germany, Austria-Hungary)
              </text>
            </svg>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISUAL 3: 1938 DAVID LOW APPEASEMENT CARTOON             */}
        {/* ======================================================== */}
        {visualId === 'appeasement-stepping-stones' && (
          <div className="w-full max-w-2xl bg-amber-50/90 rounded-xl p-4 sm:p-6 border border-stone-300 text-stone-900 shadow-inner">
            <svg 
              viewBox="0 0 600 350" 
              className="w-full h-auto drop-shadow-sm select-none"
              role="img"
              aria-label="Political cartoon of Hitler marching across spineless leaders of democracy"
            >
              {/* Header Box */}
              <rect x="30" y="15" width="540" height="32" rx="4" fill="#1c1917" />
              <text x="300" y="36" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#f5f5f4">
                "SPINELESS LEADERS OF DEMOCRACY — STEPPING STONES TO GLORY" (1938)
              </text>

              {/* Staircase Steps formed by bent backs of European Leaders */}
              {/* Step 1: Rhineland */}
              <g transform="translate(70, 230)">
                <path d="M 0 40 Q 40 10 80 40" stroke="#292524" strokeWidth="8" fill="#e7e5e4" strokeLinecap="round" />
                <circle cx="10" cy="50" r="10" fill="#fed7aa" stroke="#44403c" />
                <rect x="5" y="45" width="70" height="20" rx="3" fill="#ffffff" stroke="#78350f" />
                <text x="40" y="59" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">1. Rhineland (1936)</text>
              </g>

              {/* Step 2: Danzig / Rearmament */}
              <g transform="translate(160, 190)">
                <path d="M 0 40 Q 40 10 80 40" stroke="#292524" strokeWidth="8" fill="#e7e5e4" strokeLinecap="round" />
                <circle cx="10" cy="50" r="10" fill="#fed7aa" stroke="#44403c" />
                <rect x="5" y="45" width="75" height="20" rx="3" fill="#ffffff" stroke="#78350f" />
                <text x="42" y="59" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">2. Rearmament</text>
              </g>

              {/* Step 3: Anschluss (Austria) */}
              <g transform="translate(250, 150)">
                <path d="M 0 40 Q 40 10 80 40" stroke="#292524" strokeWidth="8" fill="#e7e5e4" strokeLinecap="round" />
                <circle cx="10" cy="50" r="10" fill="#fed7aa" stroke="#44403c" />
                <rect x="5" y="45" width="80" height="20" rx="3" fill="#ffffff" stroke="#78350f" />
                <text x="45" y="59" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">3. Austria (1938)</text>
              </g>

              {/* Step 4: Sudetenland / Munich */}
              <g transform="translate(340, 110)">
                <path d="M 0 40 Q 40 10 80 40" stroke="#292524" strokeWidth="8" fill="#e7e5e4" strokeLinecap="round" />
                <circle cx="10" cy="50" r="10" fill="#fed7aa" stroke="#44403c" />
                <rect x="0" y="45" width="90" height="20" rx="3" fill="#ffffff" stroke="#78350f" />
                <text x="45" y="59" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">4. Sudetenland (Munich)</text>
              </g>

              {/* Adolf Hitler Marching on Top of the Leaders */}
              <g transform="translate(370, 45)">
                {/* High Military Boots */}
                <path d="M 30 80 L 35 110 L 50 110 L 45 80 Z" fill="#000000" />
                <path d="M 15 70 L 10 95 L -5 95 L 10 70 Z" fill="#000000" />
                {/* Brown Nazi Uniform Coat */}
                <rect x="15" y="35" width="30" height="45" fill="#78350f" rx="3" />
                {/* Arm with Nazi Armband */}
                <line x1="30" y1="45" x2="60" y2="35" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
                <rect x="36" y="40" width="10" height="8" fill="#dc2626" />
                {/* Head with Moustache & Forelock */}
                <circle cx="30" cy="22" r="14" fill="#fed7aa" stroke="#451a03" strokeWidth="2" />
                <path d="M 18 14 Q 30 10 38 18" stroke="#1c1917" strokeWidth="4" fill="none" />
                <rect x="27" y="27" width="6" height="4" fill="#1c1917" />
                <text x="30" y="-2" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#991b1b">
                  ADOLF HITLER
                </text>
              </g>

              {/* Label pointing to the bent leaders */}
              <rect x="40" y="290" width="520" height="45" rx="6" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
              <text x="300" y="308" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">
                "SPINELESS LEADERS OF DEMOCRACY": British & French Prime Ministers (Chamberlain & Daladier)
              </text>
              <text x="300" y="324" textAnchor="middle" fontSize="10" fill="#451a03">
                Cartoonist's point: Giving in to Hitler's aggressive demands (Appeasement) enabled further conquest
              </text>
            </svg>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISUAL 4: MAP OF TWO-FRONT WAR IN EUROPE (1914)          */}
        {/* ======================================================== */}
        {visualId === 'central-powers-map' && (
          <div className="w-full max-w-2xl bg-sky-950 rounded-xl p-4 sm:p-6 border border-stone-300 text-stone-100 shadow-inner">
            <svg 
              viewBox="0 0 600 360" 
              className="w-full h-auto drop-shadow-sm select-none"
              role="img"
              aria-label="Map showing Central Powers surrounded by Allied Western and Eastern fronts"
            >
              {/* Header */}
              <rect x="20" y="10" width="560" height="34" rx="4" fill="#0f172a" />
              <text x="300" y="32" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#38bdf8">
                EUROPE 1914: THE TWO-FRONT GEOGRAPHIC ENCIRCLEMENT
              </text>

              {/* Water background */}
              <rect x="20" y="50" width="560" height="290" fill="#082f49" rx="6" />

              {/* Western Front Allies: Great Britain & France */}
              <g transform="translate(60, 90)">
                <rect x="10" y="20" width="70" height="70" rx="8" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
                <text x="45" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ffffff">BRITAIN</text>

                <rect x="20" y="110" width="90" height="90" rx="8" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="2" />
                <text x="65" y="155" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ffffff">FRANCE</text>

                <text x="65" y="215" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#38bdf8">
                  WESTERN ALLIES
                </text>
              </g>

              {/* Central Powers: Germany & Austria-Hungary (surrounded in center) */}
              <g transform="translate(220, 110)">
                <rect x="10" y="10" width="140" height="70" rx="8" fill="#854d0e" stroke="#facc15" strokeWidth="3" />
                <text x="80" y="45" textAnchor="middle" fontSize="14" fontWeight="black" fill="#fef08a">GERMANY</text>

                <rect x="25" y="90" width="130" height="70" rx="8" fill="#b45309" stroke="#facc15" strokeWidth="3" />
                <text x="90" y="125" textAnchor="middle" fontSize="13" fontWeight="black" fill="#fef08a">AUSTRIA-HUNGARY</text>

                <text x="80" y="175" textAnchor="middle" fontSize="12" fontWeight="black" fill="#fde047">
                  CENTRAL POWERS
                </text>
              </g>

              {/* Eastern Front Ally: Russian Empire */}
              <g transform="translate(420, 100)">
                <rect x="10" y="10" width="130" height="170" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="75" y="95" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ffffff">RUSSIAN</text>
                <text x="75" y="115" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ffffff">EMPIRE</text>

                <text x="75" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6ee7b7">
                  EASTERN ALLY
                </text>
              </g>

              {/* Attack Arrows pinching Central Powers from both sides */}
              {/* Western Front Push */}
              <path d="M 180 170 L 220 160" stroke="#ef4444" strokeWidth="6" markerEnd="url(#arrow)" />
              <text x="175" y="145" fontSize="10" fontWeight="bold" fill="#f87171">Western Front</text>

              {/* Eastern Front Push */}
              <path d="M 420 170 L 380 160" stroke="#ef4444" strokeWidth="6" markerEnd="url(#arrow)" />
              <text x="400" y="145" fontSize="10" fontWeight="bold" fill="#f87171">Eastern Front</text>

              {/* Strategic Dilemma Callout */}
              <rect x="40" y="290" width="520" height="40" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="300" y="308" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#facc15">
                GEOGRAPHIC DILEMMA: Fighting simultaneously against France on the West and Russia on the East
              </text>
              <text x="300" y="322" textAnchor="middle" fontSize="10" fill="#cbd5e1">
                Forced German military leaders to split armies and gamble on quick preemptive offensives
              </text>
            </svg>
          </div>
        )}
          </>
        )}
      </div>

      {/* Caption footer */}
      {caption && (
        <div className="px-5 py-2.5 bg-stone-950 border-t border-stone-800 text-xs text-stone-400 font-mono text-center">
          {caption}
        </div>
      )}
    </div>
  );
};
