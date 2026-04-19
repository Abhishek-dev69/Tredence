import { Icon, type IconName } from '@/components/common/Icons';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: IconName;
}

export function EmptyState({ title, description, iconName = 'spark' }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.88))] p-6 text-center shadow-inner">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <Icon name={iconName} className="h-6 w-6 text-slate-500" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
