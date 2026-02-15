// app/admin/dashboard/components/SectionHeader.tsx
"use client";
interface Props {
  title: string;
  description?: string;
}

export default function SectionHeader({ title, description }: Props) {
  return (
    <div>
      <h2 className="text-h4 text-primary font-semibold">{title}</h2>
      {description && (
        <p className="text-body-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
