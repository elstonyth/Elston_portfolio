import { LucideIcon } from 'lucide-react';

export interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export enum TabOptions {
  EMAIL = 'Email',
  REACT = 'React',
  HTML = 'HTML',
  JSON = 'JSON',
}
