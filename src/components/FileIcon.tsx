import React from 'react';
import { Settings } from 'lucide-react';

interface FileIconProps {
  fileId: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileId, className = 'w-3.5 h-3.5 mr-2 shrink-0' }) => {
  if (fileId.endsWith('.tsx') || fileId.endsWith('.jsx')) {
    // Authentic React logo (cyan atom with orbits)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#00d8ff" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" stroke="#00d8ff" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" stroke="#00d8ff" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.2" fill="#00d8ff" />
      </svg>
    );
  }

  if (fileId.endsWith('.ts')) {
    // Official TypeScript badge (blue square with TS)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3.5" fill="#3178c6" />
        <path d="M4.5 8h6M7.5 8v10" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="square" />
        <path d="M13 16.5c1 .9 2.5 1.1 3.8.4 1-.6 1.4-1.8.8-2.8-.5-.8-1.5-1.2-2.3-1.6-.9-.4-1.8-.8-2-1.7-.3-1 .2-2.1 1.2-2.6 1.3-.7 3.2-.4 4.2.4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (fileId.endsWith('.js')) {
    // Official JavaScript badge (yellow square with JS)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3.5" fill="#f7df1e" />
        <path d="M7 14.5c.3 1.8 1.4 2.8 3.2 2.8 1.8 0 2.8-1 2.8-2.5V8" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14.5 15.8c1 .8 2.2 1.2 3.5.7 1-.4 1.5-1.5 1-2.4-.4-.8-1.4-1.2-2.2-1.6-.9-.4-1.7-.8-1.9-1.6-.3-.9.2-1.9 1.1-2.4 1.2-.6 2.8-.4 3.7.3" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (fileId.endsWith('.py')) {
    // Official Python logo (blue & yellow intertwined snakes)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9 2c-3.1 0-5 1.4-5 3.5v2.6h5.2V9H4.4C2.3 9 1 10.9 1 14.1c0 3.1 1.6 4.9 3.9 4.9h2.2v-2.3c0-1.8 1.5-3.3 3.3-3.3h5.2c1.4 0 2.6-1.2 2.6-2.6V5.5C18.2 3.4 15 2 11.9 2zm-1.8 2.2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" fill="#3776ab" />
        <path d="M12.1 22c3.1 0 5-1.4 5-3.5v-2.6h-5.2V15h7.7c2.1 0 3.4-1.9 3.4-5.1 0-3.1-1.6-4.9-3.9-4.9h-2.2v2.3c0 1.8-1.5 3.3-3.3 3.3H8.4c-1.4 0-2.6 1.2-2.6 2.6v5.2c0 2.1 3.2 3.5 6.3 3.5zm1.8-2.2c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" fill="#ffd438" />
      </svg>
    );
  }

  if (fileId.endsWith('.html')) {
    // Official HTML5 badge
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3l1.5 16.5L12 21.5l6.5-2L20 3H4z" fill="#E44D26"/>
        <path d="M12 4.5v15.5l5.2-1.6L18.4 4.5H12z" fill="#F16529"/>
        <path d="M12 8.5H8.2l.3 3.2H12v-3.2zm0 5.4H9.7l.2 2 2.1.6v-2.6z" fill="#EBEBEB"/>
        <path d="M12 8.5h3.8l-.4 4.2h-3.4v-4.2zm0 5.4v2.6l2.1-.6.3-2H12z" fill="#FFFFFF"/>
      </svg>
    );
  }

  if (fileId.endsWith('.css') || fileId === 'contact') {
    // Official CSS3 or Terminal badge
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3l1.5 16.5L12 21.5l6.5-2L20 3H4z" fill="#264DE4"/>
        <path d="M12 4.5v15.5l5.2-1.6L18.4 4.5H12z" fill="#2965F1"/>
        <path d="M12 8.5H8.2l.3 3.2H12v-3.2zm0 5.4H9.7l.2 2 2.1.6v-2.6z" fill="#EBEBEB"/>
        <path d="M12 8.5h3.8l-.4 4.2h-3.4v-4.2zm0 5.4v2.6l2.1-.6.3-2H12z" fill="#FFFFFF"/>
      </svg>
    );
  }

  if (fileId === 'settings.json') {
    return <Settings className={`${className} text-gray-400`} />;
  }

  if (fileId.endsWith('.json')) {
    // JSON golden curly braces
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 5c-1.5 0-2.5 1-2.5 2.5v2.5c0 1-.5 1.5-1.5 1.5 1 0 1.5.5 1.5 1.5V16c0 1.5 1 2.5 2.5 2.5M17 5c1.5 0 2.5 1 2.5 2.5v2.5c0 1 .5 1.5 1.5 1.5-1 0-1.5.5-1.5 1.5V16c0 1.5-1 2.5-2.5 2.5" stroke="#cbcb41" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (fileId.endsWith('.md')) {
    // Official Markdown logo
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="#42a5f5" strokeWidth="1.8" />
        <path d="M5.5 14.5v-5l2.2 2.8 2.3-2.8v5M15 12l2 2.5 2-2.5M17 9.5v5" stroke="#42a5f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  if (fileId.endsWith('.pdf')) {
    // Official PDF red badge
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3.5" fill="#e53935" />
        <text x="12" y="15.5" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">PDF</text>
      </svg>
    );
  }

  return <Settings className={`${className} text-gray-400`} />;
};
