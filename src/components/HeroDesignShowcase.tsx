import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export const HeroDesignShowcase = () => (
  <div className="w-full">
    <SpotlightCard className="bg-background/80 border-white/10">
      <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-ultra text-white/40">UI Snapshot</p>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mt-2">Realtime Analytics Dashboard</h3>
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/70 bg-white/5 border border-white/10">
            Case Study View
          </span>
        </div>
        <div className="relative h-[360px] rounded-2xl bg-gradient-to-br from-blue-500/30 via-purple-500/10 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />
          <div className="absolute left-6 right-6 top-8 flex flex-col gap-4">
            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Engagement Lift</span>
                <span className="text-emerald-300">+142%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Active users', value: '12.4k' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Delivery', value: '0.3s' },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl bg-black/50 border border-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-super text-white/40 mb-2">{card.label}</p>
                  <p className="text-2xl font-semibold">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-sm text-white/70">
              <div>
                <p className="text-xs uppercase tracking-ultra text-white/40">Experience Layer</p>
                <p className="font-medium">Live collaboration & design systems</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-200 border border-emerald-500/20">
                In build
              </span>
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  </div>
);
