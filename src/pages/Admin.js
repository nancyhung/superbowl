import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Admin() {
  const [answers, setAnswers] = useState({
    football_winner: '',
    football_score: '',
    taylor_screen_time: '',
    taylor_proposal: '',
    ai_ads: '',
    literacy: '',
  });

  useEffect(() => {
    async function fetchAnswers() {
      const { data, error } = await supabase
        .from('correct_answers')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching answers:', error);
        return;
      }

      if (data) {
        setAnswers(data);
      }
    }

    fetchAnswers();
  }, []);

  const handleChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('correct_answers')
        .update({
          football_winner: answers.football_winner,
          football_score: answers.football_score,
          taylor_screen_time: parseInt(answers.taylor_screen_time) || null,
          taylor_proposal: answers.taylor_proposal,
          ai_ads: parseInt(answers.ai_ads) || null,
          literacy: answers.literacy,
        })
        .eq('id', answers.id);

      if (error) throw error;
      alert('Answers updated successfully!');
    } catch (error) {
      alert('Error updating answers: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set Correct Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Who won?</label>
              <Select
                value={answers.football_winner}
                onValueChange={(value) => handleChange('football_winner', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chiefs">Kansas City Chiefs</SelectItem>
                  <SelectItem value="eagles">Philadelphia Eagles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Final Score</label>
              <Input
                type="text"
                placeholder="e.g., 24-21"
                value={answers.football_score || ''}
                onChange={(e) => handleChange('football_score', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Taylor Swift Screen Time Count</label>
              <Input
                type="number"
                placeholder="Number of appearances"
                value={answers.taylor_screen_time || ''}
                onChange={(e) => handleChange('taylor_screen_time', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Did Travis Propose?</label>
              <Select
                value={answers.taylor_proposal}
                onValueChange={(value) => handleChange('taylor_proposal', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of AI Commercials</label>
              <Input
                type="number"
                placeholder="Number of AI ads"
                value={answers.ai_ads || ''}
                onChange={(e) => handleChange('ai_ads', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Did Attendees Become Football Literate?</label>
              <Select
                value={answers.literacy}
                onValueChange={(value) => handleChange('literacy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Update Answers
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
