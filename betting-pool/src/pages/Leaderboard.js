import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

function calculateScore(bet, answers) {
  if (!answers) return 0;
  let score = 0;

  // Football winner (3 points)
  if (bet.football_winner === answers.football_winner) score += 3;

  // Exact score (5 points)
  if (bet.football_score === answers.football_score) score += 5;

  // Taylor Swift screen time (3 points)
  if (bet.taylor_screen_time === answers.taylor_screen_time) score += 3;
  // Close guess (within 2) gets 1 point
  else if (Math.abs(bet.taylor_screen_time - answers.taylor_screen_time) <= 2) score += 1;

  // Travis proposal prediction (2 points)
  if (bet.taylor_proposal === answers.taylor_proposal) score += 2;

  // AI ads count (2 points)
  if (bet.ai_ads === answers.ai_ads) score += 2;
  // Close guess (within 1) gets 1 point
  else if (Math.abs(bet.ai_ads - answers.ai_ads) <= 1) score += 1;

  // Literacy prediction (2 points)
  if (bet.literacy === answers.literacy) score += 2;

  return score;
}

export default function Leaderboard() {
  const [bets, setBets] = useState([]);
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all bets
        const { data: betsData, error: betsError } = await supabase
          .from('bets')
          .select('*')
          .order('created_at', { ascending: false });

        if (betsError) throw betsError;

        // Fetch correct answers
        const { data: answersData, error: answersError } = await supabase
          .from('correct_answers')
          .select('*')
          .single();

        if (answersError) throw answersError;

        setBets(betsData);
        setAnswers(answersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate scores and sort by score
  const betsWithScores = bets.map(bet => ({
    ...bet,
    score: calculateScore(bet, answers)
  })).sort((a, b) => b.score - a.score);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">🏆 Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {betsWithScores.map((bet, index) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className="font-semibold">{bet.name}</span>
                  </div>
                  <span className="text-xl font-bold">{bet.score} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Bets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">All Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Winner</th>
                    <th className="p-2 text-left">Score</th>
                    <th className="p-2 text-left">Taylor Time</th>
                    <th className="p-2 text-left">Proposal</th>
                    <th className="p-2 text-left">AI Ads</th>
                    <th className="p-2 text-left">Literacy</th>
                  </tr>
                </thead>
                <tbody>
                  {betsWithScores.map((bet) => (
                    <tr key={bet.id} className="border-b">
                      <td className="p-2">{bet.name}</td>
                      <td className="p-2">{bet.football_winner}</td>
                      <td className="p-2">{bet.football_score}</td>
                      <td className="p-2">{bet.taylor_screen_time}</td>
                      <td className="p-2">{bet.taylor_proposal}</td>
                      <td className="p-2">{bet.ai_ads}</td>
                      <td className="p-2">{bet.literacy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
