/**
 * ===============================================
 * EVERYDAY PRO - STATE MANAGER
 * Centralized State Management & Persistence
 * ===============================================
 */

const StateManager = {
    state: {
        habits: [],
        logs: {},
        activities: {}, // { "2026-01-05": [{ start: "09:00", end: "12:00", name: "Deep Work", id: "a_123" }] }
        selectedCategory: 'health',
        settings: {
            location: null, // { lat, lng, city, country }
            useDynamicPrayers: false,
            lastPrayerUpdate: null,
            cachedPrayerTimes: {} // { "2026-01-05": { fajr: "05:30", ... } }
        }
    },
    
    subscribers: [],
    
    /**
     * Initialize state from localStorage
     */
    init() {
        const savedHabits = localStorage.getItem('ev_habits');
        const savedLogs = localStorage.getItem('ev_logs');
        
        // Load habits - use defaults if empty or not found
        if (savedHabits) {
            const parsed = JSON.parse(savedHabits);
            if (parsed && parsed.length > 0) {
                this.state.habits = parsed;
            } else {
                // Empty array or null - load defaults
                this.state.habits = this.getDefaultHabits();
                this.persist();
            }
        } else {
            // Load default habits for first-time users
            this.state.habits = this.getDefaultHabits();
            this.persist();
        }
        if (savedLogs) {
            this.state.logs = JSON.parse(savedLogs);
        }

        const savedSettings = localStorage.getItem('ev_settings');
        if (savedSettings) {
            this.state.settings = { ...this.state.settings, ...JSON.parse(savedSettings) };
        }
        
        return this;
    },
    
    /**
     * Default habits - 5 daily prayers, Quran, Hadith, Sports, Nutrition
     */
    getDefaultHabits() {
        return [
            // 5 Vakit Namaz
            { id: 'h_sabah', name: 'Sabah Namazı', category: 'personal', intention: { time: '05:30', place: 'ev' }, createdAt: new Date().toISOString() },
            { id: 'h_ogle', name: 'Öğle Namazı', category: 'personal', intention: { time: '13:00', place: 'iş/ev' }, createdAt: new Date().toISOString() },
            { id: 'h_ikindi', name: 'İkindi Namazı', category: 'personal', intention: { time: '16:30', place: 'iş/ev' }, createdAt: new Date().toISOString() },
            { id: 'h_aksam', name: 'Akşam Namazı', category: 'personal', intention: { time: '18:30', place: 'ev' }, createdAt: new Date().toISOString() },
            { id: 'h_yatsi', name: 'Yatsı Namazı', category: 'personal', intention: { time: '20:30', place: 'ev' }, createdAt: new Date().toISOString() },
            
            // Kuran & Hadis (Namaz sonrası zincirleme)
            { id: 'h_kuran', name: 'Kuran Okuma (1 sayfa)', category: 'learning', intention: { time: '06:00', place: 'ev' }, stackAfter: 'h_sabah', createdAt: new Date().toISOString() },
            { id: 'h_hadis', name: 'Hadis Okuma', category: 'learning', intention: { time: '21:00', place: 'ev' }, stackAfter: 'h_yatsi', createdAt: new Date().toISOString() },
            
            // Spor
            { id: 'h_spor', name: 'Egzersiz (30dk)', category: 'health', intention: { time: '07:00', place: 'ev/spor salonu' }, createdAt: new Date().toISOString() },
            
            // Beslenme
            { id: 'h_su', name: 'Su İçme (2L)', category: 'health', intention: { time: null, place: null }, createdAt: new Date().toISOString() },
            { id: 'h_beslenme', name: 'Sağlıklı Öğün', category: 'health', intention: { time: null, place: null }, createdAt: new Date().toISOString() }
        ];
    },
    
    /**
     * Get current state or specific key
     */
    get(key = null) {
        if (key) {
            return this.state[key];
        }
        return this.state;
    },
    
    /**
     * Update state and trigger re-render
     */
    setState(key, value) {
        this.state[key] = value;
        this.persist();
        this.notify();
    },
    
    /**
     * Subscribe to state changes
     */
    subscribe(fn) {
        this.subscribers.push(fn);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn);
        };
    },
    
    /**
     * Persist state to localStorage
     */
    persist() {
        localStorage.setItem('ev_habits', JSON.stringify(this.state.habits));
        localStorage.setItem('ev_logs', JSON.stringify(this.state.logs));
        localStorage.setItem('ev_settings', JSON.stringify(this.state.settings));
    },
    
    /**
     * Notify all subscribers
     */
    notify() {
        this.subscribers.forEach(fn => fn(this.state));
    },
    
    // ==================
    // HABIT OPERATIONS
    // ==================
    
    addHabit(name, category, intention = null) {
        const habit = {
            id: 'h_' + Date.now(),
            name: name,
            category: category,
            intention: intention || {
                time: null,
                place: null
            },
            createdAt: new Date().toISOString()
        };
        
        this.state.habits.push(habit);
        this.persist();
        this.notify();
        
        return habit;
    },
    
    deleteHabit(id) {
        this.state.habits = this.state.habits.filter(h => h.id !== id);
        // Also remove any stackAfter references to this habit
        this.state.habits.forEach(h => {
            if (h.stackAfter === id) {
                h.stackAfter = null;
            }
        });
        this.persist();
        this.notify();
    },
    
    updateHabit(id, updates) {
        const habit = this.state.habits.find(h => h.id === id);
        if (habit) {
            Object.assign(habit, updates);
            this.persist();
            this.notify();
        }
        return habit;
    },
    
    getHabit(id) {
        return this.state.habits.find(h => h.id === id);
    },
    
    // Get habits sorted by stack order
    getHabitsSorted() {
        const habits = [...this.state.habits];
        const result = [];
        const added = new Set();
        
        // Find root habits (not stacked after anything)
        const roots = habits.filter(h => !h.stackAfter);
        
        // Build chains
        const buildChain = (habit) => {
            if (added.has(habit.id)) return;
            result.push(habit);
            added.add(habit.id);
            
            // Find habits stacked after this one
            const children = habits.filter(h => h.stackAfter === habit.id);
            children.forEach(child => buildChain(child));
        };
        
        roots.forEach(root => buildChain(root));
        
        // Add any remaining (broken chain references)
        habits.forEach(h => {
            if (!added.has(h.id)) {
                result.push(h);
            }
        });
        
        return result;
    },
    
    // ==================
    // LOG OPERATIONS
    // ==================
    
    toggleLog(habitId, dateStr) {
        if (!this.state.logs[dateStr]) {
            this.state.logs[dateStr] = [];
        }
        
        const index = this.state.logs[dateStr].indexOf(habitId);
        const wasChecked = index > -1;
        
        if (wasChecked) {
            this.state.logs[dateStr].splice(index, 1);
        } else {
            this.state.logs[dateStr].push(habitId);
        }
        
        this.persist();
        this.notify();
        
        return !wasChecked; // Returns true if now checked
    },
    
    isLogged(habitId, dateStr) {
        return (this.state.logs[dateStr] || []).includes(habitId);
    },
    
    getLogsForDate(dateStr) {
        return this.state.logs[dateStr] || [];
    }
};

// Export for use in other modules
window.StateManager = StateManager;
