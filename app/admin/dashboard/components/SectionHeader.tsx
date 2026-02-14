"use client";
interface Props {
  title: string;
  description?: string;
}

export default function SectionHeader({ title, description }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}
