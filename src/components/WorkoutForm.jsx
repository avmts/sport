import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Share2, Clock, Activity, AlignLeft, CalendarPlus, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function WorkoutForm({ date, initialData, onSave, onDelete }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [feeling, setFeeling] = useState('');
  const [exercises, setExercises] = useState([]);

  // Charger les données quand la date change
  useEffect(() => {
    if (initialData) {
      setStartTime(initialData.startTime || '');
      setEndTime(initialData.endTime || '');
      setFeeling(initialData.feeling || '');
      setExercises(initialData.exercises || []);
    } else {
      // Reset form if no data for this date
      setStartTime('');
      setEndTime('');
      setFeeling('');
      setExercises([]);
    }
  }, [date, initialData]);

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now(), name: '', sets: '', reps: '', rest: '' }]);
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSave = () => {
    onSave({
      startTime,
      endTime,
      feeling,
      exercises
    });
  };

  const handleShare = () => {
    const dateStr = format(date, 'd MMMM yyyy', { locale: fr });
    let text = `🏋️ Séance du ${dateStr}\n`;
    if (startTime && endTime) text += `⏰ ${startTime} - ${endTime}\n`;
    if (feeling) text += `📝 Ressenti: ${feeling}\n`;
    text += `\n📋 Exercices:\n`;
    exercises.forEach(ex => {
      if (ex.name) {
        text += `- ${ex.name}: ${ex.sets} séries x ${ex.reps} reps`;
        if (ex.rest) text += ` (Repos: ${ex.rest})`;
        text += `\n`;
      }
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('Résumé copié dans le presse-papier !');
    });
  };

  const handleAddToCalendar = () => {
    const dateStr = format(date, 'yyyyMMdd');
    let startStr = '000000';
    let endStr = '000000';

    if (startTime) startStr = startTime.replace(':', '') + '00';
    if (endTime) endStr = endTime.replace(':', '') + '00';

    // Si pas d'heure, événement sur la journée (pas supporté proprement ici sans complexité, on met une heure par défaut)
    if (!startTime) startStr = '090000';
    if (!endTime) endStr = '100000';

    const eventTitle = `Séance de sport - ${exercises.length} exercices`;
    let description = `Ressenti: ${feeling}\\n\\nExercices:\\n`;
    exercises.forEach(ex => {
        description += `- ${ex.name}: ${ex.sets}x${ex.reps}`;
        if (ex.rest) description += ` (Repos: ${ex.rest})`;
        description += `\\n`;
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${dateStr}T${startStr}`,
      `DTEND:${dateStr}T${endStr}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'seance.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Séance du {format(date, 'd MMMM', { locale: fr })}
        </h2>
        <div className="flex gap-2">
          {initialData && (
            <>
              <button
                onClick={handleAddToCalendar}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                title="Ajouter au calendrier"
              >
                <CalendarPlus className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Copier le résumé"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Supprimer la séance"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Horaires */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Début
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Fin
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Exercices */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Exercices
            </label>
          </div>

          <div className="space-y-3">
            {exercises.map((ex) => (
              <div key={ex.id} className="group relative bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-all">
                <input
                  type="text"
                  placeholder="Nom de l'exercice (ex: Squat)"
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-800 placeholder-slate-400 outline-none mb-2"
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Séries"
                      value={ex.sets}
                      onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                      className="w-full bg-white p-1 px-2 text-sm border border-slate-200 rounded-md outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center text-slate-400 text-xs">x</div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Répétitions"
                      value={ex.reps}
                      onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                      className="w-full bg-white p-1 px-2 text-sm border border-slate-200 rounded-md outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-slate-500 text-xs">
                    <Timer className="w-3 h-3" />
                    <input
                      type="text"
                      placeholder="Temps de pause (ex: 1m30)"
                      value={ex.rest || ''}
                      onChange={(e) => updateExercise(ex.id, 'rest', e.target.value)}
                      className="flex-1 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none p-1"
                    />
                </div>
                <button
                  onClick={() => removeExercise(ex.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addExercise}
              className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Ajouter un exercice
            </button>
          </div>
        </div>

        {/* Ressenti */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <AlignLeft className="w-4 h-4" /> Comment j'ai vécu la séance
          </label>
          <textarea
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="Super sensations aujourd'hui, un peu dur sur la fin..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24 resize-none"
          />
        </div>
      </div>

      <div className="pt-6 mt-auto border-t border-slate-100">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer la séance
        </button>
      </div>
    </div>
  );
}
