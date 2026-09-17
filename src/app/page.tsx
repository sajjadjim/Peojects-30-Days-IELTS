'use client';

import React from 'react';
import BandProgressHero from '@/components/dashboard/BandProgressHero';
import QuickActions from '@/components/dashboard/QuickActions';
import SkillCardsGrid from '@/components/dashboard/SkillCardsGrid';
import TodayRoutine from '@/components/dashboard/TodayRoutine';
import WeakAreaAlert from '@/components/dashboard/WeakAreaAlert';

export default function DashboardPage() {
  return (
    <div className="page-wrapper">
      <BandProgressHero />
      <QuickActions />
      <SkillCardsGrid />
      <TodayRoutine />
      <WeakAreaAlert />
    </div>
  );
}
