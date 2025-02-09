import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function BettingForm() {
  const [formData, setFormData] = useState({
    name: '',
    football: {
      winner: '',
      score: ''
    },
    taylorSwift: {
      screenTime: '',
      proposal: ''
    },
    other: {
      aiAds: '',
      literacy: ''
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('bets')
        .insert([
          {
            name: formData.name,
            football_winner: formData.football.winner,
            football_score: formData.football.score,
            taylor_screen_time: parseInt(formData.taylorSwift.screenTime) || null,
            taylor_proposal: formData.taylorSwift.proposal,
            ai_ads: parseInt(formData.other.aiAds) || null,
            literacy: formData.other.literacy,
          }
        ]);

      if (error) throw error;
      
      console.log('Successfully submitted bet:', data);
      alert('Thanks for submitting your bets!');
      // Reset form
      setFormData({
        name: '',
        football: { winner: '', score: '' },
        taylorSwift: { screenTime: '', proposal: '' },
        other: { aiAds: '', literacy: '' }
      });
    } catch (error) {
      alert('Error submitting bets: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Super Bowl Bets</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                required
                className="w-full"
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              {/* Football Section */}
              <AccordionItem value="football">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <img
                      src={process.env.PUBLIC_URL + '/football.png'}
                      alt="Football icon"
                      className="w-6 h-6 object-contain"
                    />
                    Football Bets
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Who will win?</label>
                    <Select 
                      onValueChange={(value) => handleChange('football', 'winner', value)}
                      value={formData.football.winner}
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
                    <label className="text-sm font-medium">Final Score Prediction</label>
                    <Input
                      type="text"
                      placeholder="e.g., 24-21"
                      value={formData.football.score}
                      onChange={(e) => handleChange('football', 'score', e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Taylor Swift Section */}
              <AccordionItem value="taylor">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <img
                      src={process.env.PUBLIC_URL + '/tswift.jpg'}
                      alt="Taylor Swift icon"
                      className="w-6 h-6 object-cover rounded-full"
                    />
                    Taylor Swift Bets
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Screen Time Count</label>
                    <Input
                      type="number"
                      placeholder="Number of appearances"
                      value={formData.taylorSwift.screenTime}
                      onChange={(e) => handleChange('taylorSwift', 'screenTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Will Travis propose?</label>
                    <Select
                      onValueChange={(value) => handleChange('taylorSwift', 'proposal', value)}
                      value={formData.taylorSwift.proposal}
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
                </AccordionContent>
              </AccordionItem>

              {/* Other Bets Section */}
              <AccordionItem value="other">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6" />
                    Other Bets
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of AI Commercials</label>
                    <Input
                      type="number"
                      placeholder="Number of AI ads"
                      value={formData.other.aiAds}
                      onChange={(e) => handleChange('other', 'aiAds', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Will attendees become football literate?</label>
                    <Select
                      onValueChange={(value) => handleChange('other', 'literacy', value)}
                      value={formData.other.literacy}
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" className="w-full">
              Submit Bets
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
