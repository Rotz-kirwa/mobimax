import { Link } from 'react-router-dom';
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Camera,
  BatteryCharging,
  Tablet,
  Plug,
  Shield,
  Monitor,
  Package,
} from 'lucide-react';
import { useMetadata } from '../../hooks/useCatalog';

const ICON_MAP: Record<string, React.ElementType> = {
  iphones: Smartphone,
  smartphones: Smartphone,
  samsung: Smartphone,
  laptops: Laptop,
  'apple-laptops': Laptop,
  tablets: Tablet,
  monitors: Monitor,
  audio: Headphones,
  watches: Watch,
  gaming: Gamepad2,
  photography: Camera,
  accessories: Plug,
  powerbanks: BatteryCharging,
  protection: Shield,
  default: Package,
};

/* Subtle background tints per category */
const BG_MAP: Record<string, string> = {
  iphones: 'bg-slate-900',
  smartphones: 'bg-emerald-600',
  samsung: 'bg-blue-600',
  laptops: 'bg-indigo-600',
  'apple-laptops': 'bg-slate-700',
  tablets: 'bg-violet-600',
  monitors: 'bg-slate-600',
  audio: 'bg-rose-500',
  watches: 'bg-amber-500',
  gaming: 'bg-purple-600',
  photography: 'bg-orange-500',
  accessories: 'bg-teal-600',
  powerbanks: 'bg-yellow-600',
  protection: 'bg-slate-500',
};

export default function CategoryIconBar() {
  const { data: metadata } = useMetadata();
  const { categories = [] } = metadata || {};

  if (categories.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex overflow-x-auto scrollbar-hide gap-2 py-4 md:py-5 md:justify-between">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.id] || ICON_MAP.default;
            const iconBg = BG_MAP[cat.id] || 'bg-slate-600';

            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group flex flex-col items-center gap-2 shrink-0 min-w-[64px] transition-all"
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${iconBg}`}
                >
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <span className="text-[10px] md:text-[11px] font-semibold text-slate-600 group-hover:text-brand-green transition-colors text-center leading-tight max-w-[60px] truncate">
                  {cat.name.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
