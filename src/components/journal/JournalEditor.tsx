'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function JournalEditor() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const prompt = "What are the biggest challenges you're facing in your exam preparation today?";

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const saveJournal = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tags, prompt })
      });
      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (content.trim() && !isSaving) saveJournal();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [content, tags]);

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
        <CardContent className="p-4">
          <p className="font-semibold text-blue-800 dark:text-blue-300">Today's Prompt:</p>
          <p className="text-blue-600 dark:text-blue-400">{prompt}</p>
        </CardContent>
      </Card>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing here..."
        className="min-h-[300px] text-lg resize-y p-4"
        aria-label="Journal Entry Editor"
      />

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(t => (
            <Badge key={t} variant="secondary" className="px-2 py-1 flex items-center gap-1">
              {t}
              <button type="button" onClick={() => removeTag(t)} aria-label={`Remove tag ${t}`} className="text-xs hover:text-red-500">
                &times;
              </button>
            </Badge>
          ))}
        </div>
        <Input 
          id="tags" 
          value={tagInput} 
          onChange={e => setTagInput(e.target.value)} 
          onKeyDown={handleAddTag} 
          placeholder="Type a tag and press Enter" 
          className="max-w-xs"
        />
      </div>

      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-muted-foreground">
          {isSaving ? 'Saving...' : lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : ''}
        </span>
        <Button onClick={saveJournal} disabled={isSaving || !content.trim()}>
          Force Save
        </Button>
      </div>
    </div>
  );
}
