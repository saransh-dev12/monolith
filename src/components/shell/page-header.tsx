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
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="eyebrow flex items-center gap-2 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-brand text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
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
