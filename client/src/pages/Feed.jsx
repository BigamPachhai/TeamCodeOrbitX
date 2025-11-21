import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import IssueCard from "../components/IssueCard";

export default function Feed() {
  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const { data } = await api.get("/issues/all");
      return data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Public Issues</h1>

      <div className="space-y-6">
        {issues?.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
