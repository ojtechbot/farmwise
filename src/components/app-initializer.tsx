'use client';
import React from 'react';

// This component is a placeholder for any app-wide initialization logic
// that needs to run after the auth state is determined.
export function AppInitializer({ children }: { children: React.ReactNode }) {
  // The auth context already handles the main loading state,
  // so we can just render the children directly here.
  return <>{children}</>;
}
