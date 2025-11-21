import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import AchievementShare from "../components/AchievementShare";
import { Trophy, Award, TrendingUp, Medal, Crown, Star, Target, CheckCircle } from "lucide-react";

export default function Leaderboard() {
  const { user } = useAuth();
  const { data: users, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await api.get("/users/leaderboard");
      return data;
    },
  });

  // Find current user's rank
  const currentUserRank = user
    ? users?.findIndex((u) => u._id === user._id) + 1
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
          <p className="mt-6 text-gray-700 text-base font-semibold">
            Loading community rankings...
          </p>
        </div>
      </div>
    );
  }

  const getRankTier = (index) => {
    if (index === 0) return { 
      color: "bg-[#DC143C]", 
      border: "border-[#DC143C]",
      bg: "bg-red-50",
      icon: <Crown className="w-5 h-5 text-[#DC143C]" />,
      badge: "Gold Medal"
    };
    if (index === 1) return { 
      color: "bg-gray-600", 
      border: "border-gray-600",
      bg: "bg-gray-50",
      icon: <Medal className="w-5 h-5 text-gray-600" />,
      badge: "Silver Medal"
    };
    if (index === 2) return { 
      color: "bg-orange-600", 
      border: "border-orange-600",
      bg: "bg-orange-50",
      icon: <Award className="w-5 h-5 text-orange-600" />,
      badge: "Bronze Medal"
    };
    return { 
      color: "bg-[#003865]", 
      border: "border-gray-300",
      bg: "bg-white",
      icon: <Star className="w-4 h-4 text-[#003865]" />,
      badge: null
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Government Header */}
        <div className="bg-white border-l-4 border-[#003865] shadow-md mb-8 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#003865] rounded flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#003865] mb-1">
                Leaderboard
              </h1>
              <p className="text-gray-600 text-sm">
                रुपन्देही जिल्ला | Rupandehi District Administration Office
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Community Engagement Rankings
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {users?.length || 0}
            </div>
            <div className="text-gray-700 font-semibold text-sm">Active Contributors</div>
            <div className="text-xs text-gray-500 mt-1">Community members</div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {users?.reduce((total, user) => total + (user.points || 0), 0) || 0}
            </div>
            <div className="text-gray-700 font-semibold text-sm">Total Points</div>
            <div className="text-xs text-gray-500 mt-1">Combined contributions</div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {users?.filter(u => u.points > 50).length || 0}
            </div>
            <div className="text-gray-700 font-semibold text-sm">High Contributors</div>
            <div className="text-xs text-gray-500 mt-1">50+ points achieved</div>
          </div>
          <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
            <div className="text-3xl font-bold text-[#003865] mb-2">
              {currentUserRank || '--'}
            </div>
            <div className="text-gray-700 font-semibold text-sm">Your Position</div>
            <div className="text-xs text-gray-500 mt-1">Current ranking</div>
          </div>
        </div>

        {/* Current User Status */}
        {user && currentUserRank && currentUserRank > 0 && (
          <div className="bg-[#003865] border border-[#003865] shadow-sm p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="w-16 h-16 bg-white/20 rounded flex items-center justify-center border border-white/30 flex-shrink-0">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Your Community Standing
                  </h3>
                  <p className="text-blue-100 text-base font-semibold mb-1">
                    Position <span className="text-yellow-300 font-bold text-xl">#{currentUserRank}</span> of {users?.length || 0} contributors
                  </p>
                  <p className="text-blue-200 text-sm mt-1 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="font-bold">{users?.[currentUserRank - 1]?.points || 0}</span> contribution points
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <AchievementShare 
                  user={user} 
                  rank={currentUserRank} 
                  totalUsers={users?.length || 0}
                />
              </div>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden mb-8">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-[#003865] uppercase tracking-wide">
              <div className="col-span-1 flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5" />
                Rank
              </div>
              <div className="col-span-6 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                Contributor
              </div>
              <div className="col-span-3 text-center flex items-center justify-center gap-2">
                <Star className="w-3.5 h-3.5" />
                Points
              </div>
              <div className="col-span-2 text-center flex items-center justify-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Status
              </div>
            </div>
          </div>

          {/* Table Body */}
          {!users || users.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Contributors</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Community engagement metrics will appear as citizens participate in public service initiatives.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((u, index) => {
                const isCurrentUser = user && u._id === user._id;
                const tier = getRankTier(index);

                return (
                  <div
                    key={u._id}
                    className={`px-6 py-4 transition-colors ${
                      isCurrentUser 
                        ? 'bg-blue-50 border-l-4 border-[#003865]' 
                        : 'hover:bg-gray-50'
                    } ${index < 3 ? tier.bg : ''}`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm border ${tier.border} ${tier.color} relative`}>
                          {index < 3 && (
                            <span className="absolute -top-0.5 -right-0.5">{tier.icon}</span>
                          )}
                          <span>{index + 1}</span>
                        </div>
                      </div>

                      {/* Contributor Info */}
                      <div className="col-span-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-base font-bold ${isCurrentUser ? 'text-[#003865]' : 'text-gray-900'}`}>
                            {u.fullName}
                          </h3>
                          {index < 3 && (
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded border border-red-300">
                              {tier.badge}
                            </span>
                          )}
                          {isCurrentUser && (
                            <span className="bg-[#003865] text-white text-xs font-semibold px-2.5 py-0.5 rounded border border-[#003865]">
                              Your Account
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {u.email}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="col-span-3 text-center">
                        <div className="inline-flex flex-col items-center bg-gray-50 rounded p-2 border border-gray-200">
                          <span className="text-2xl font-bold text-[#003865]">{u.points}</span>
                          <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Points</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-center">
                        {index < 3 ? (
                          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded border border-green-300">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Top Contributor
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded border border-gray-200">Active</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Points System */}
        <div className="mt-8 bg-white border border-gray-200 shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold text-[#003865] mb-6 text-center uppercase tracking-wide text-sm">
            Contribution Metrics System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="text-center p-5 border border-gray-200 rounded bg-gray-50">
              <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Issue Reporting</h4>
              <p className="text-3xl font-bold text-[#003865] mb-2">+10</p>
              <p className="text-gray-600 text-xs">Points per verified issue report</p>
            </div>

            <div className="text-center p-5 border border-gray-200 rounded bg-gray-50">
              <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Community Support</h4>
              <p className="text-3xl font-bold text-[#003865] mb-2">+1</p>
              <p className="text-gray-600 text-xs">Point per issue upvote received</p>
            </div>

            <div className="text-center p-5 border border-gray-200 rounded bg-gray-50">
              <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Constructive Feedback</h4>
              <p className="text-3xl font-bold text-[#003865] mb-2">+2</p>
              <p className="text-gray-600 text-xs">Points per helpful comment</p>
            </div>

            <div className="text-center p-5 border border-gray-200 rounded bg-gray-50">
              <div className="w-12 h-12 bg-[#003865] rounded flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Resolution Impact</h4>
              <p className="text-3xl font-bold text-[#003865] mb-2">+5</p>
              <p className="text-gray-600 text-xs">Bonus points for resolved issues</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 font-medium">
            Municipal Corporation Public Service Portal • Community Engagement Metrics
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Rankings updated in real-time based on community contributions
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            नेपाल सरकार | Government of Nepal
          </p>
        </div>
      </div>
    </div>
  );
}