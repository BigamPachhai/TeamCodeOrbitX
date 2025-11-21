import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export default function Leaderboard() {
  const { data: users } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await api.get("/users/leaderboard");
      return data;
    },
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
        Top Contributors
      </h1>

      <div className="space-y-3">
        {users?.map((u, index) => (
          <div
            key={u._id}
            className="flex justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
          >
            <span className="font-semibold">{index + 1}. {u.fullName}</span>
            <span className="text-red-700 font-bold">{u.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
