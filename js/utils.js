/**
 * ===============================================
 * EVERYDAY PRO - UTILITIES
 * Helper Functions & Calculations
 * ===============================================
 */

const Utils = {
    // ==================
    // DATE HELPERS
    // ==================
    
    /**
     * Get date string in local timezone (YYYY-MM-DD)
     */
    toDateStr(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    
    /**
     * Get today's date string
     */
    getTodayStr() {
        return this.toDateStr(new Date());
    },
    
    /**
     * Get array of dates for display (past N days + future days)
     */
    getDateRange(pastDays = 40, futureDays = 5) {
        const today = new Date();
        const days = [];
        
        for (let i = pastDays; i >= -futureDays; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(d);
        }
        
        return days;
    },
    
    // ==================
    // STREAK CALCULATION
    // ==================
    
    /**
     * Calculate current streak for a habit
     */
    getStreak(habitId, dateStr) {
        const state = StateManager.get();
        let count = 0;
        let current = new Date(dateStr);
        
        while (true) {
            const dStr = this.toDateStr(current);
            if ((state.logs[dStr] || []).includes(habitId)) {
                count++;
                current.setDate(current.getDate() - 1);
            } else {
                break;
            }
        }
        
        return count;
    },
    
    /**
     * Get best ever streak for a habit
     */
    getBestStreak(habitId) {
        const state = StateManager.get();
        let maxStreak = 0;
        let currentStreak = 0;
        
        const dates = Object.keys(state.logs).sort();
        
        for (const date of dates) {
            if ((state.logs[date] || []).includes(habitId)) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        
        return maxStreak;
    },
    
    /**
     * Calculate level based on streak (for heatmap intensity)
     */
    getStreakLevel(streak) {
        if (streak <= 0) return 0;
        if (streak > 10) return 4;
        return Math.min(4, Math.ceil(streak / 3));
    },
    
    // ==================
    // STATISTICS
    // ==================
    
    /**
     * Get weekly completion rate
     */
    getWeeklyRate() {
        const state = StateManager.get();
        
        if (state.habits.length === 0) {
            return { rate: 0, done: 0, total: 0 };
        }
        
        const today = new Date();
        let totalPossible = 0;
        let totalDone = 0;
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = this.toDateStr(d);
            
            state.habits.forEach(habit => {
                if (!habit.createdAt || new Date(habit.createdAt) <= d) {
                    totalPossible++;
                    if ((state.logs[dateStr] || []).includes(habit.id)) {
                        totalDone++;
                    }
                }
            });
        }
        
        return {
            rate: totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0,
            done: totalDone,
            total: totalPossible
        };
    },
    
    /**
     * Get weekly data for a specific habit
     */
    getHabitWeeklyData(habitId) {
        const today = new Date();
        let done = 0;
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = this.toDateStr(d);
            
            if (StateManager.isLogged(habitId, dateStr)) {
                done++;
            }
        }
        
        return { done, rate: Math.round((done / 7) * 100) };
    },
    
    /**
     * Check if habit is at risk (Two-Day Rule)
     */
    isAtRisk(habitId) {
        const todayStr = this.getTodayStr();
        const today = new Date();
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yStr = this.toDateStr(yesterday);
        
        const dayBefore = new Date(today);
        dayBefore.setDate(today.getDate() - 2);
        const dbStr = this.toDateStr(dayBefore);
        
        const missedYesterday = !StateManager.isLogged(habitId, yStr);
        const didDayBefore = StateManager.isLogged(habitId, dbStr);
        const didToday = StateManager.isLogged(habitId, todayStr);
        
        return missedYesterday && didDayBefore && !didToday;
    },
    
    // ==================
    // PERFORMANCE HELPERS
    // ==================
    
    /**
     * Debounce function calls
     */
    debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    },
    
    /**
     * Throttle function calls
     */
    throttle(fn, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for use in other modules
window.Utils = Utils;
