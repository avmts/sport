import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les données dans le LocalStorage.
 * Structure des données :
 * {
 *   [dateISOString]: {
 *     date: string, // YYYY-MM-DD
 *     startTime: string, // HH:mm
 *     endTime: string, // HH:mm
 *     feeling: string, // Texte libre
 *     exercises: [
 *       { id: string, name: string, sets: number, reps: number }
 *     ]
 *   }
 * }
 */
export function useStore() {
  const [workouts, setWorkouts] = useState(() => {
    try {
      const item = window.localStorage.getItem('fitness-tracker-data');
      return item ? JSON.parse(item) : {};
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('fitness-tracker-data', JSON.stringify(workouts));
    } catch (error) {
      console.error('Erreur lors de l\'écriture dans le localStorage:', error);
    }
  }, [workouts]);

  const saveWorkout = (date, data) => {
    setWorkouts(prev => ({
      ...prev,
      [date]: data
    }));
  };

  const deleteWorkout = (date) => {
    setWorkouts(prev => {
      const newWorkouts = { ...prev };
      delete newWorkouts[date];
      return newWorkouts;
    });
  };

  const getWorkout = (date) => {
    return workouts[date] || null;
  };

  return {
    workouts,
    saveWorkout,
    deleteWorkout,
    getWorkout
  };
}
