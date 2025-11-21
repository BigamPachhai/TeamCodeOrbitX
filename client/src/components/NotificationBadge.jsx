export default function NotificationBadge({ count }) {
  if (!count || count === 0) return null;

  return (
    <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full ml-2 shadow">
      {count}
    </span>
  );
}
