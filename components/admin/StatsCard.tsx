type StatsCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
  };
  
  export default function StatsCard({
    title,
    value,
    subtitle,
  }: StatsCardProps) {
    return (
      <div className="bg-white border rounded-lg p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
  