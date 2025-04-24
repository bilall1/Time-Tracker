import React, { useState, useEffect } from 'react';
import './App.css';

interface TimeEntry {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
}

const API_URL = 'http://localhost:3001/api';

function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/entries`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data.map((entry: any) => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: entry.endTime ? new Date(entry.endTime) : null
      })));
    } catch (err) {
      setError('Failed to load entries');
    }
  };

  const startTimer = async () => {
    if (description.trim() === '') return;

    const newEntry: TimeEntry = {
      id: Date.now(),
      description: description.trim(),
      startTime: new Date(),
      endTime: null,
      duration: 0
    };

    try {
      const response = await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error('Failed to create entry');
      const savedEntry = await response.json();
      setCurrentEntry({
        ...savedEntry,
        startTime: new Date(savedEntry.startTime),
        endTime: savedEntry.endTime ? new Date(savedEntry.endTime) : null
      });
      setDescription('');
    } catch (err) {
      setError('Failed to start timer');
    }
  };

  const stopTimer = async () => {
    if (!currentEntry) return;

    const endTime = new Date();
    const duration = (endTime.getTime() - currentEntry.startTime.getTime()) / 1000;
    
    const completedEntry: TimeEntry = {
      ...currentEntry,
      endTime,
      duration
    };

    try {
      const response = await fetch(`${API_URL}/entries/${currentEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completedEntry),
      });

      if (!response.ok) throw new Error('Failed to update entry');
      await fetchEntries();
      setCurrentEntry(null);
    } catch (err) {
      setError('Failed to stop timer');
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Time Tracker</h1>
      </header>
      <main>
        {error && <div className="error-message">{error}</div>}
        <div className="timer-container">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you working on?"
            className="description-input"
          />
          <div className="button-group">
            <button
              onClick={startTimer}
              disabled={!!currentEntry || description.trim() === ''}
              className="start-button"
            >
              Start
            </button>
            <button
              onClick={stopTimer}
              disabled={!currentEntry}
              className="stop-button"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="entries-container">
          <h2>Time Entries</h2>
          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <h3>{entry.description}</h3>
                <p>Duration: {formatDuration(entry.duration)}</p>
                <p>Started: {entry.startTime.toLocaleTimeString()}</p>
                <p>Ended: {entry.endTime?.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 