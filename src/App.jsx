import React, { useState } from 'react';
import { CalendarView } from './components/CalendarView';
import { WorkoutForm } from './components/WorkoutForm';
import { useStore } from './hooks/useStore';
import { format } from 'date-fns';
import { Dumbbell, Calendar as CalendarIcon } from 'lucide-react';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { workouts, saveWorkout, deleteWorkout, getWorkout } = useStore();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSave = (data) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    saveWorkout(dateKey, {
      ...data,
      date: dateKey,
      id: dateKey
    });
  };

  const handleDelete = () => {
    if (confirm('Voulez-vous vraiment supprimer cette séance ?')) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      deleteWorkout(dateKey);
    }
  };

  const currentWorkout = getWorkout(format(selectedDate, 'yyyy-MM-dd'));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">

        {/* Header */}
        <header className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Mon Journal Sportif
            </h1>
            <p className="text-sm text-slate-500">
              Suivez votre progression jour après jour
            </p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-12 gap-6 flex-1 items-start">

          {/* Left Column: Calendar */}
          <div className="md:col-span-5 lg:col-span-4 sticky top-6">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              workouts={workouts}
            />

            <div className="mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 hidden md:block">
              <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Astuce
              </h3>
              <p className="text-sm text-blue-600 leading-relaxed">
                Cliquez sur une date pour ajouter ou modifier une séance.
                Les jours avec un point vert indiquent qu'une séance a été enregistrée.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="md:col-span-7 lg:col-span-8 min-h-[600px]">
            <WorkoutForm
              date={selectedDate}
              initialData={currentWorkout}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
