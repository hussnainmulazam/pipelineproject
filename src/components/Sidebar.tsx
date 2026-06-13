import React from 'react';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  unhealthyCount: number;
}

export default function Sidebar({ currentTab, setTab, unhealthyCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'incidents', label: 'Incidents', icon: 'warning', badge: unhealthyCount },
    { id: 'agents', label: 'Agents', icon: 'smart_toy' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'hub' },
    { id: 'logs', label: 'Logs', icon: 'terminal' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-md z-50">
      {/* Brand Header */}
      <div className="px-lg pb-lg border-b border-outline-variant mb-sm flex items-center gap-md">
        <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
          <span className="material-symbols-outlined font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>
            api
          </span>
        </div>
        <div>
          <div className="font-headline-md text-headline-md font-bold text-primary tracking-tighter leading-tight select-none">
            AIOps Command
          </div>
          <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest select-none">
            Vanguard-1 Node
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-sm space-y-[2px] overflow-y-auto pt-sm">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center justify-between px-md py-[10px] rounded text-left transition-all duration-150 active:scale-98 cursor-pointer ${
                isActive
                  ? 'text-secondary font-bold border-r-2 border-secondary bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-md">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-body-sm text-body-sm text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs text-background font-black animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="px-lg pt-md mt-auto border-t border-outline-variant">
        <div 
          onClick={() => setTab('settings')}
          className="flex items-center gap-sm cursor-pointer hover:bg-surface-variant p-sm rounded transition-all duration-200"
        >
          <img
            alt="SysAdmin Profile Avatar"
            className="w-9 h-9 rounded-full border border-outline-variant object-cover glow-green"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGUzr44Wc9hVS5XoQJ_QNC5McAGK87VYxyMKlvJNqc_gwIrXlq3TXgsllVw2KHbt6vuh55KFRut0K6wQP0o7esh2iYy5I0mnA86_w9S0TlrqOn3vFoOSxsm346Z8V0rn6KQiBSs5DZFoA8YrFu_yuNB5jKnT2goEDwmqckIW6EbPOV7eDFArPBnpGgU1wPVHaTzQE9FKue12tNizluE_byOC_sd42vLEQP2Ry1qbLIrHxdr3kbxbB1qrfFaZ_snFTqEVhVSskXfg"
          />
          <div className="flex flex-col">
            <span className="font-body-sm text-sm font-semibold text-on-surface">SysAdmin_01</span>
            <div className="flex items-center gap-xs text-xs text-secondary-container">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot"></span>
              <span>Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
