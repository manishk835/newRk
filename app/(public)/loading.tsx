// app/(public)/loading.tsx

export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg font-medium">
          Loading...
        </div>
      </div>
    );
  }