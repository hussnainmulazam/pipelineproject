import React, { useState } from 'react';
import { Incident } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  unhealthyIncidents: Incident[];
  setTab: (tab: string) => void;
}

export default function Header({ onSearch, unhealthyIncidents, setTab }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDnsStatus, setShowDnsStatus] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 border-b border-outline-variant bg-surface-container flex items-center justify-between px-lg z-40">
      {/* Omni-search */}
      <form onSubmit={submitSearch} className="flex items-center gap-md w-1/3">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={handleInputChange}
            className="w-full bg-surface-dim border border-outline-variant text-on-surface font-body-sm text-sm rounded py-[6px] pl-[36px] pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
            placeholder="Search microservices, logs, nodes..."
          />
          <div className="absolute right-sm top-1/2 -translate-y-1/2 flex gap-xs select-none">
            <kbd className="font-data-sm text-[10px] text-on-surface-variant bg-surface-variant px-1 rounded font-mono">
              ⌘
            </kbd>
            <kbd className="font-data-sm text-[10px] text-on-surface-variant bg-surface-variant px-1 rounded font-mono">
              K
            </kbd>
          </div>
        </div>
      </form>

      {/* Global Brand Title */}
      <div 
        onClick={() => setTab('dashboard')} 
        className="flex items-center justify-center cursor-pointer select-none"
      >
        <span className="font-headline-sm text-lg font-black text-primary uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all">
          AIOps Vanguard
        </span>
      </div>

      {/* Trailing Controls */}
      <div className="flex items-center gap-md w-1/3 justify-end relative">
        {/* Notifications Alert Dropdown */}
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDnsStatus(false);
            }}
            className="text-on-surface-variant hover:text-primary transition-all cursor-pointer relative p-sm rounded hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unhealthyIncidents.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-bounce"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-high border border-outline-variant rounded-lg p-sm shadow-xl z-50">
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs mb-xs">
                <span className="font-label-caps text-xs text-on-surface font-bold uppercase">
                  Active Alerts ({unhealthyIncidents.length})
                </span>
                <span className="w-2 h-2 rounded-full bg-error pulse-dot"></span>
              </div>
              <div className="space-y-sm max-h-60 overflow-y-auto terminal-scroll">
                {unhealthyIncidents.length === 0 ? (
                  <p className="font-body-sm text-xs text-on-surface-variant py-sm text-center">
                    All telemetry feeds nominal. Zero alerts.
                  </p>
                ) : (
                  unhealthyIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setTab('incidents');
                        setShowNotifications(false);
                      }}
                      className="p-xs hover:bg-surface-variant rounded border border-error/20 bg-error-container/5 cursor-pointer text-xs transition-colors"
                    >
                      <div className="flex justify-between font-bold text-error">
                        <span>{inc.id}</span>
                        <span className="font-label-caps text-[9px] px-1 bg-error/20 rounded border border-error/30">
                          {inc.severity}
                        </span>
                      </div>
                      <p className="text-on-surface font-medium mt-1 truncate">{inc.title}</p>
                      <p className="text-on-surface-variant text-[10px] mt-0.5">{inc.service}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* DNS Status Tooltip */}
        <div className="relative">
          <button
            aria-label="Cluster Connection"
            onClick={() => {
              setShowDnsStatus(!showDnsStatus);
              setShowNotifications(false);
            }}
            className="text-on-surface-variant hover:text-primary transition-all cursor-pointer p-sm rounded hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">dns</span>
          </button>

          {showDnsStatus && (
            <div className="absolute right-0 mt-2 w-64 bg-surface-container-highest border border-outline-variant rounded-lg p-md shadow-xl z-50 font-sans">
              <div className="flex justify-between items-center border-b border-outline-variant pb-xs mb-xs text-sm font-semibold">
                <span>DNS / Node Registry</span>
                <span className="text-secondary flex items-center text-xs gap-1">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> Online
                </span>
              </div>
              <div className="space-y-xs text-xs text-on-surface-variant pt-xs">
                <div className="flex justify-between">
                  <span>Server Pod IP:</span>
                  <span className="font-mono">10.244.1.18</span>
                </div>
                <div className="flex justify-between">
                  <span>SSL Security:</span>
                  <span className="text-secondary font-medium">Auto-renew SSL</span>
                </div>
                <div className="flex justify-between">
                  <span>Ingress Provider:</span>
                  <span>nginx-ingress</span>
                </div>
                <div className="flex justify-between border-t border-outline-variant pt-xs mt-xs text-[10px]">
                  <span>Vanguard Cluster Health:</span>
                  <span className="text-secondary font-bold">98%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          aria-label="Profile"
          onClick={() => setTab('settings')}
          className="text-on-surface-variant hover:text-primary transition-all cursor-pointer flex items-center p-sm rounded hover:bg-surface-variant"
        >
          <img
            alt="Cyberpunk admin profile avatar with glowing green and blue tech reflections"
            className="w-7 h-7 rounded-full border border-outline-variant glow-green object-cover"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQjWdEG5s6N-Bsn2Kdl2bYmZyW97Deer215blD-eQf7h5AFOSJL9kKuDfyzBGEsV7FVdTsrjKeHUitD74wtkWA_HK5SUR2NR2Twi5un9ivhD2HCjJQMbr3QFiIBwcgAGdtmLXG9ZlyeZU2fXcXzYNo2dAbg5TMeI_g_fdvXjsR53-TJ9R1sndmbt0Uk-6OEPZZ7KbiiUsN0Af5sEmdpoWLlY2wgbSxASyTvLDPQK_Sv43edrvq_V9nWUFZB70Ji4TxEPY59Ppc1w"
          />
        </button>
      </div>
    </header>
  );
}
