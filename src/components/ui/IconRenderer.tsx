import React from 'react';
import {
  Code,
  Layers,
  Palette,
  Box,
  Server,
  Terminal,
  Database,
  Zap,
  Cpu,
  HardDrive,
  Shield,
  Sparkles,
  Layout,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Flame,
  Briefcase,
  Mail,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Settings,
  Plus,
  Trash2,
  Edit,
  X,
  Menu,
  ChevronRight,
  Lock,
  LogOut,
  RefreshCw,
  Globe,
  Radio
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Code,
  Layers,
  Palette,
  Box,
  Server,
  Terminal,
  Database,
  Zap,
  Cpu,
  HardDrive,
  Shield,
  Sparkles,
  Layout,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Flame,
  Briefcase,
  Mail,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Settings,
  Plus,
  Trash2,
  Edit,
  X,
  Menu,
  ChevronRight,
  Lock,
  LogOut,
  RefreshCw,
  Globe,
  Radio
};

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = iconMap[name] || Flame;
  return <IconComponent className={className} size={size} />;
};
