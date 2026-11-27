export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="command-glass mb-6 flex flex-col gap-5 rounded-2xl px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-medium text-muted-foreground">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 break-words font-brand text-2xl font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
