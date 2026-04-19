import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

export type IconName =
  | 'start'
  | 'task'
  | 'approval'
  | 'automation'
  | 'end'
  | 'spark'
  | 'play'
  | 'export'
  | 'panel'
  | 'flow'
  | 'warning'
  | 'success'
  | 'grid'
  | 'settings'
  | 'clock'
  | 'link';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
      aria-hidden="true"
      {...props}
    >
      {name === 'start' ? (
        <>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
        </>
      ) : null}
      {name === 'task' ? (
        <>
          <rect x="5" y="4.5" width="14" height="15" rx="3" />
          <path d="M8.5 9h7" />
          <path d="M8.5 13h5" />
        </>
      ) : null}
      {name === 'approval' ? (
        <>
          <path d="M12 3.5 18.5 6v5.6c0 3.8-2.3 6.7-6.5 8.9-4.2-2.2-6.5-5.1-6.5-8.9V6L12 3.5Z" />
          <path d="m9.2 12 1.9 1.9 3.7-4" />
        </>
      ) : null}
      {name === 'automation' ? (
        <>
          <path d="M13.8 2.8 6.5 13.2h4l-.3 8 7.3-10.4h-4l.3-8Z" />
        </>
      ) : null}
      {name === 'end' ? (
        <>
          <path d="M6 5.5h9.5l3 3.5-3 3.5H6Z" />
          <path d="M6 12.5h12v6H6Z" />
        </>
      ) : null}
      {name === 'spark' ? (
        <>
          <path d="m12 2.5 1.9 5.3L19 9.5l-5.1 1.7L12 16.5l-1.9-5.3L5 9.5l5.1-1.7L12 2.5Z" />
          <path d="m19 16 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1L19 16Z" />
        </>
      ) : null}
      {name === 'play' ? (
        <>
          <path d="M8 6.2v11.6L18 12 8 6.2Z" fill="currentColor" stroke="none" />
        </>
      ) : null}
      {name === 'export' ? (
        <>
          <path d="M12 4v10" />
          <path d="m8.5 7.5 3.5-3.5 3.5 3.5" />
          <path d="M5 14.5v3A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5v-3" />
        </>
      ) : null}
      {name === 'panel' ? (
        <>
          <rect x="4" y="5" width="16" height="14" rx="3" />
          <path d="M10 5v14" />
        </>
      ) : null}
      {name === 'flow' ? (
        <>
          <rect x="3.5" y="5" width="6" height="4.5" rx="1.4" />
          <rect x="14.5" y="5" width="6" height="4.5" rx="1.4" />
          <rect x="9" y="14.5" width="6" height="4.5" rx="1.4" />
          <path d="M9.5 7.2h5" />
          <path d="M12 9.8v4.3" />
        </>
      ) : null}
      {name === 'warning' ? (
        <>
          <path d="M12 4 3.5 19h17L12 4Z" />
          <path d="M12 9v4.2" />
          <circle cx="12" cy="16.3" r="0.7" fill="currentColor" stroke="none" />
        </>
      ) : null}
      {name === 'success' ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.6 12.2 2.1 2.1 4.7-4.8" />
        </>
      ) : null}
      {name === 'grid' ? (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" />
        </>
      ) : null}
      {name === 'settings' ? (
        <>
          <circle cx="12" cy="12" r="2.7" />
          <path d="m19 12 .9-.5.4-2.1-1.5-.8-.3-1.7-1.8-.9-1 .9-1.7-.5-.9-1.5h-2.2L10 5.3l-1.7.5-1-.9-1.8.9-.3 1.7-1.5.8.4 2.1.9.5-.9.5-.4 2.1 1.5.8.3 1.7 1.8.9 1-.9 1.7.5.9 1.5h2.2l.9-1.5 1.7-.5 1 .9 1.8-.9.3-1.7 1.5-.8-.4-2.1-.9-.5Z" />
        </>
      ) : null}
      {name === 'clock' ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.8v4.7l2.8 1.8" />
        </>
      ) : null}
      {name === 'link' ? (
        <>
          <path d="M10.3 13.7 8 16a3.2 3.2 0 0 1-4.5-4.5l2.7-2.7A3.2 3.2 0 0 1 10.8 9" />
          <path d="m13.7 10.3 2.3-2.3a3.2 3.2 0 0 1 4.5 4.5l-2.7 2.7A3.2 3.2 0 0 1 13.2 15" />
          <path d="m9.2 14.8 5.6-5.6" />
        </>
      ) : null}
    </svg>
  );
}
