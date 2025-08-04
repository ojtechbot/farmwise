'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TutorialCard } from '@/components/tutorial-card';
import { AiSuggestionCard } from '@/components/ai-suggestion-card';
import { tutorials } from '@/lib/data';
import type { Tutorial } from '@/lib/types';
import { BookOpen, Target, Search } from 'lucide-react';

export function DashboardClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory =
      filterCategory === 'all' || tutorial.category === filterCategory;
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back, Farmer!</h1>
        <p className="text-muted-foreground">
          Continue your learning journey and cultivate new skills.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <p className="text-xs text-muted-foreground">
              You've completed 2 of 8 modules
            </p>
            <Progress value={25} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Tutorials
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tutorials.length}</div>
            <p className="text-xs text-muted-foreground">
              modules available across all categories
            </p>
          </CardContent>
        </Card>
        <div className="lg:col-span-1">
          <AiSuggestionCard />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Explore Tutorials</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tutorials..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={setFilterCategory} value={filterCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Crop Production">Crop Production</SelectItem>
              <SelectItem value="Fish Farming">Fish Farming</SelectItem>
              <SelectItem value="Pest Control">Pest Control</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTutorials.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p>No tutorials found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
