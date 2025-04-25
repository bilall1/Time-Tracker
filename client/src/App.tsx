import React, { useState, useEffect } from 'react';
import './App.css';
import { API_URL, TimeEntry, formatDuration } from './common';

function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterTask, setFilterTask] = useState<string>('');

  // Load saved state from localStorage
  useEffect(() => {
    const savedCurrentEntry = localStorage.getItem('currentEntry');
    if (savedCurrentEntry) {
      const parsed = JSON.parse(savedCurrentEntry);
      setCurrentEntry({
        ...parsed,
        startTime: new Date(parsed.startTime),
        endTime: parsed.endTime ? new Date(parsed.endTime) : null
      });
    }
  }, []);

  // Save current entry to localStorage
  useEffect(() => {
    if (currentEntry) {
      localStorage.setItem('currentEntry', JSON.stringify(currentEntry));
    } else {
      localStorage.removeItem('currentEntry');
    }
  }, [currentEntry]);

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

  // Get unique task descriptions for dropdown
  const uniqueTasks = Array.from(new Set(entries.map(entry => entry.description))).sort();

  // Filter entries based on date and task
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.startTime);
    const filterDateObj = filterDate ? new Date(filterDate) : null;
    
    // Convert both dates to local date strings for comparison
    const entryDateStr = entryDate.toLocaleDateString();
    const filterDateStr = filterDateObj ? filterDateObj.toLocaleDateString() : '';
    
    const matchesDate = !filterDate || entryDateStr === filterDateStr;
    const matchesTask = !filterTask || entry.description.toLowerCase().includes(filterTask.toLowerCase());
    return matchesDate && matchesTask;
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mini Time Tracker</h1>
      </header>
      <main>
        {error && <div className="error-message">{error}</div>}
        <div className="timer-container">
          <div className="input-group">
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="task-select"
            >
              <option value="">Select a task or type new one</option>
              {uniqueTasks.map(task => (
                <option key={task} value={task}>{task}</option>
              ))}
            </select>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task name"
              className="description-input"
            />
          </div>
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

        <div className="filter-container">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            value={filterTask}
            onChange={(e) => setFilterTask(e.target.value)}
            placeholder="Filter by task"
            className="filter-input"
          />
        </div>

        <div className="entries-container">
          <h2>Time Entries</h2>
          <div className="entries-list">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <h3>{entry.description}</h3>
                <p>Duration: {formatDuration(entry.duration)}</p>
                <p>Started: {entry.startTime.toLocaleString()}</p>
                <p>Ended: {entry.endTime ? entry.endTime.toLocaleString() : 'In Progress'}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 