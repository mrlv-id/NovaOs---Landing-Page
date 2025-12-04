import React from 'react';

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ScreenSlide {
  id: number;
  key: string; // Stable key for logic (e.g., 'home', 'wallet')
  title: string; // Display title (translated)
  imageColor: string;
}