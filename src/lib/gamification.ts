import { doc, getDoc, updateDoc, increment, setDoc, query, collection, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-hot-toast';

export interface DailyTask {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  xp: number;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActivityDate: string; // YYYY-MM-DD
  weeklyXp: number;
  lastWeeklyReset: string;
  dailyProgress: {
    date: string;
    tasks: DailyTask[];
    totalCompleted: number;
  }
}

const DEFAULT_TASKS: DailyTask[] = [
  { id: 'joinRoom', title: 'Join 1 room', target: 1, current: 0, completed: false, xp: 50 },
  { id: 'sendMessages', title: 'Send 5 messages', target: 5, current: 0, completed: false, xp: 100 },
  { id: 'activeTime', title: 'Stay active for 3 minutes', target: 180, current: 0, completed: false, xp: 150 },
];

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getWeeklyResetId = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
};

export const initializeUserProgress = async (userId: string) => {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  
  const today = getTodayDateString();
  const weekId = getWeeklyResetId();
  
  if (!snap.exists()) {
    const initialData = {
      xp: 0,
      weeklyXp: 0,
      streak: 0,
      lastActivityDate: '',
      lastWeeklyReset: weekId,
      dailyProgress: {
        date: today,
        tasks: DEFAULT_TASKS,
        totalCompleted: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(userRef, initialData, { merge: true });
    return initialData;
  }
  
  const data = snap.data();
  // Handle daily reset
  if (data.dailyProgress?.date !== today) {
    let newStreak = data.streak || 0;
    const lastDate = data.lastActivityDate;
    
    // Check if yesterday was active
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastDate === yesterdayStr) {
      // Streak continues (but only if they did something yesterday?)
      // For now, let's say just opening the app doesn't save the date unless they do a task
    } else if (lastDate && lastDate !== today) {
      // Streak broken
      newStreak = 0;
    }

    const resetData = {
      streak: newStreak,
      dailyProgress: {
        date: today,
        tasks: DEFAULT_TASKS,
        totalCompleted: 0
      },
      updatedAt: new Date()
    };
    await updateDoc(userRef, resetData);
    return { ...data, ...resetData };
  }
  
  // Handle weekly reset
  if (data.lastWeeklyReset !== weekId) {
      await updateDoc(userRef, {
          weeklyXp: 0,
          lastWeeklyReset: weekId
      });
  }

  return data;
};

export const updateTaskProgress = async (userId: string, taskId: string, incrementValue: number = 1) => {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) return;
  const data = snap.data();
  const today = getTodayDateString();
  
  let dailyProgress = data.dailyProgress;
  
  // Auto-reset if date mismatch (backup)
  if (dailyProgress?.date !== today) {
    dailyProgress = { date: today, tasks: DEFAULT_TASKS, totalCompleted: 0 };
  }
  
  const tasks = [...dailyProgress.tasks];
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1 || tasks[taskIndex].completed) return;
  
  const task = tasks[taskIndex];
  task.current = Math.min(task.target, task.current + incrementValue);
  
  if (task.current >= task.target && !task.completed) {
    task.completed = true;
    dailyProgress.totalCompleted += 1;
    
    // Award XP
    await addXp(userId, task.xp);
    toast.success(`Task Complete: ${task.title}! +${task.xp} XP`);
    
    // If first task of the day, update lastActivityDate and streak
    if (data.lastActivityDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const newStreak = data.lastActivityDate === yesterdayStr ? (data.streak || 0) + 1 : 1;
        
        await updateDoc(userRef, {
            lastActivityDate: today,
            streak: newStreak
        });
    }

    if (dailyProgress.totalCompleted === tasks.length) {
        toast.success("🔥 Daily Challenge Complete! You're on fire!");
    }
  }
  
  await updateDoc(userRef, { dailyProgress });
};

export const addXp = async (userId: string, amount: number) => {
  if (!db) return;
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    xp: increment(amount),
    weeklyXp: increment(amount),
    updatedAt: new Date()
  });
};

export const getLeaderboard = async (type: 'global' | 'weekly' = 'global', limitCount: number = 10) => {
    if (!db) return [];
    const usersRef = collection(db, 'users');
    const q = query(
        usersRef, 
        orderBy(type === 'global' ? 'xp' : 'weeklyXp', 'desc'), 
        limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
