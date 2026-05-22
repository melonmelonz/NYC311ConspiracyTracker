import { Link, NavLink } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  FileSearch,
  Map,
  RadioTower,
  ShieldAlert
} from 'lucide-react';
import EvidenceImagePlaceholder from './EvidenceImagePlaceholder';
import evidenceWall from '../assets/evidence-wall.png';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Activity },
  { to: '/reports', label: 'Case Feed', icon: FileSearch },
  { to: '/map', label: 'Heat Map', icon: Map },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 }
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-x-0 top-0 z-30 border-b border-paper/10 bg-charcoal/95 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <Link to="/" className="group relative block overflow-hidden border-b border-paper/10 p-5">
          <img
            src={evidenceWall}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale transition duration-500 group-hover:opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-matte/50 via-charcoal/70 to-matte" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2 text-surveillance">
              <RadioTower size={18} />
              <span className="live-dot" />
              <span className="font-body text-xs uppercase tracking-[0.28em]">Live Intake</span>
            </div>
            <h1 className="font-display text-5xl leading-none text-aged">311 Conspiracy Tracker</h1>
            <p className="mt-3 max-w-48 font-marker text-xl text-paper">Operation Streetlight</p>
          </div>
        </Link>

        <nav className="grid grid-cols-4 gap-1 border-b border-paper/10 p-2 lg:flex lg:flex-col lg:gap-2 lg:p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  [
                    'distressed-button flex min-h-12 items-center justify-center gap-3 rounded-[6px] px-3 py-3 text-xs uppercase tracking-[0.18em] transition lg:justify-start',
                    isActive
                      ? 'border-crimson/70 bg-crimson/15 text-aged shadow-crimson'
                      : 'border-paper/10 bg-black/20 text-muted hover:border-rust/60 hover:text-paper'
                  ].join(' ')
                }
              >
                <Icon size={18} />
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex">
          <div className="classified-panel">
            <div className="mb-3 flex items-center gap-2 text-crimson">
              <ShieldAlert size={18} />
              <span className="font-display text-2xl">ACTIVE CASE</span>
            </div>
            <p className="font-body text-sm leading-6 text-muted">
              NYC incident streams are scanned for paranormal, covert, underground, and anomalous signatures.
            </p>
          </div>

          <EvidenceImagePlaceholder label="SIDEBAR CONSPIRACY POSTER SLOT" />
        </div>
      </div>
    </aside>
  );
}
