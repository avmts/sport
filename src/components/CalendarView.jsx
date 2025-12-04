import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
  parseISO
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function CalendarView({ selectedDate, onDateSelect, workouts }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Ajuster pour commencer le lundi (0 = Dimanche, 1 = Lundi...)
  // On ajoute des jours vides au début si besoin
  const startDay = getDay(startOfMonth(currentMonth));
  // Si startDay est 0 (Dimanche), on veut 6 cases vides (Lundi-Samedi).
  // Si startDay est 1 (Lundi), on veut 0 cases vides.
  const emptyDays = startDay === 0 ? 6 : startDay - 1;

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold capitalize text-slate-800">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: emptyDays }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const hasWorkout = workouts[dateKey];
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                "h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm transition-all relative",
                !isSameMonth(day, currentMonth) && "text-slate-300",
                isToday(day) && !isSelected && "text-blue-600 font-bold bg-blue-50",
                isSelected && "bg-blue-600 text-white shadow-md scale-105",
                !isSelected && "hover:bg-slate-100 text-slate-700"
              )}
            >
              {format(day, 'd')}

              {/* Indicateur de séance */}
              {hasWorkout && !isSelected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Jour avec entraînement</span>
      </div>
    </div>
  );
}
