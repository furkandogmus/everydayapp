/**
 * ===============================================
 * EVERYDAY PRO - MAIN APPLICATION
 * App Controller & Event Handlers
 * ===============================================
 */

/**
 * Get coach tips from i18n
 */
function getCoachTips() {
    return i18n.t('coachTips') || [
        "Make it obvious, attractive, easy, and satisfying. Start with a 2-minute version of your habit."
    ];
}

const App = {
    editingHabitId: null, // Track if we're editing
    
    /**
     * Initialize the application
     */
    init() {
        // Initialize i18n
        i18n.init();
        
        // Initialize state
        StateManager.init();
        
        // Subscribe to state changes
        StateManager.subscribe(() => {
            Renderer.render();
            Renderer.updateStats();
        });
        
        // Initial render
        Renderer.render();
        Renderer.updateStats();
        
        // Initialize Pomodoro timer
        if (window.Pomodoro) {
            Pomodoro.init();
            Pomodoro.requestPermission();
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Scroll to today
        setTimeout(() => Renderer.scrollToToday(), 100);
        
        // Welcome toast for new users
        if (StateManager.get('habits').length === 0) {
            setTimeout(() => {
                this.showToast("👋 Welcome! Add your first habit to get started.", "success");
            }, 500);
        }
    },
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Category selection in modal
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.category-option').forEach(o => 
                    o.classList.remove('selected'));
                opt.classList.add('selected');
                StateManager.state.selectedCategory = opt.dataset.cat;
            });
        });
        
        // Enter key for habit input
        document.getElementById('habit-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addHabit();
        });
        
        // Update intention behavior text as user types
        document.getElementById('habit-input').addEventListener('input', (e) => {
            const behaviorEl = document.getElementById('intention-behavior');
            if (behaviorEl) {
                behaviorEl.textContent = e.target.value.trim() || '...';
            }
        });
        
        // Rotate coach tips
        setInterval(() => {
            const tipEl = document.getElementById('coach-tip-text');
            if (tipEl) {
                const tips = getCoachTips();
                tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
            }
        }, 10000);
        
        // Event delegation for grid cells
        document.getElementById('grid-container').addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('future')) {
                const { habitId, date } = cell.dataset;
                if (habitId && date) {
                    this.toggleLog(habitId, date);
                    cell.classList.add('just-checked');
                    setTimeout(() => cell.classList.remove('just-checked'), 300);
                }
            }
        });
    },
    
    // ==================
    // HABIT OPERATIONS
    // ==================
    
    addHabit() {
        const input = document.getElementById('habit-input');
        const name = input.value.trim();
        
        if (!name) return;
        
        // Get intention data
        const intentionTime = document.getElementById('intention-time')?.value || null;
        const intentionPlace = document.getElementById('intention-place')?.value?.trim() || null;
        const stackAfter = document.getElementById('stack-after')?.value || null;
        
        const intention = {
            time: intentionTime,
            place: intentionPlace
        };
        
        const habit = StateManager.addHabit(name, StateManager.state.selectedCategory, intention);
        
        // Set stack after if selected
        if (stackAfter) {
            StateManager.updateHabit(habit.id, { stackAfter });
        }
        
        // Reset form
        this.resetForm();
        this.hideAddHabit();
        
        // Refresh Lucide icons
        if (window.lucide) lucide.createIcons();
        
        this.showToast(`✅ "${name}" added! Start your streak today.`, "success");
    },
    
    saveHabit() {
        if (!this.editingHabitId) {
            this.addHabit();
            return;
        }
        
        const input = document.getElementById('habit-input');
        const name = input.value.trim();
        
        if (!name) return;
        
        const intentionTime = document.getElementById('intention-time')?.value || null;
        const intentionPlace = document.getElementById('intention-place')?.value?.trim() || null;
        const stackAfter = document.getElementById('stack-after')?.value || null;
        
        StateManager.updateHabit(this.editingHabitId, {
            name,
            category: StateManager.state.selectedCategory,
            intention: {
                time: intentionTime,
                place: intentionPlace
            },
            stackAfter: stackAfter || null
        });
        
        this.showToast(`✏️ "${name}" updated!`, "success");
        this.resetForm();
        this.hideAddHabit();
        
        if (window.lucide) lucide.createIcons();
    },
    
    editHabit(id) {
        const habit = StateManager.getHabit(id);
        if (!habit) return;
        
        this.editingHabitId = id;
        
        // Fill form with current values
        document.getElementById('habit-input').value = habit.name;
        document.getElementById('intention-time').value = habit.intention?.time || '07:00';
        document.getElementById('intention-place').value = habit.intention?.place || '';
        document.getElementById('intention-behavior').textContent = habit.name;
        
        // Set category
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.cat === habit.category);
        });
        StateManager.state.selectedCategory = habit.category;
        
        // Set stack after dropdown
        const stackSelect = document.getElementById('stack-after');
        if (stackSelect) {
            this.populateStackDropdown(id);
            stackSelect.value = habit.stackAfter || '';
        }
        
        // Update modal title
        document.querySelector('#modal h2 span').textContent = i18n.t('editHabit') || 'Edit Habit';
        document.querySelector('#modal .btn-primary span').textContent = i18n.t('save') || 'Save';
        
        document.getElementById('modal').classList.add('active');
        document.getElementById('habit-input').focus();
    },
    
    populateStackDropdown(excludeId = null) {
        const select = document.getElementById('stack-after');
        if (!select) return;
        
        const habits = StateManager.get('habits');
        select.innerHTML = `<option value="">${i18n.t('noStack') || '-- No stacking --'}</option>`;
        
        habits.forEach(h => {
            if (h.id !== excludeId) {
                select.innerHTML += `<option value="${h.id}">${h.name}</option>`;
            }
        });
    },
    
    resetForm() {
        document.getElementById('habit-input').value = '';
        document.getElementById('intention-time').value = '07:00';
        document.getElementById('intention-place').value = '';
        document.getElementById('intention-behavior').textContent = '...';
        
        const stackSelect = document.getElementById('stack-after');
        if (stackSelect) stackSelect.value = '';
        
        // Reset category to health
        document.querySelectorAll('.category-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.cat === 'health');
        });
        StateManager.state.selectedCategory = 'health';
        
        this.editingHabitId = null;
    },
    
    deleteHabit(id) {
        const habit = StateManager.getHabit(id);
        
        if (confirm(`Delete "${habit?.name}"? Your streak data will be lost.`)) {
            StateManager.deleteHabit(id);
        }
    },
    
    toggleLog(habitId, dateStr) {
        const habit = StateManager.getHabit(habitId);
        
        // Dependency Check
        if (habit && habit.stackAfter) {
            const parentHabit = StateManager.getHabit(habit.stackAfter);
            const parentCompleted = StateManager.isLogged(habit.stackAfter, dateStr);
            
            if (!parentCompleted) {
                this.showToast(`🔒 ${i18n.t('firstComplete') || 'Önce şunu tamamlamalısın:'} ${parentHabit?.name}`, "warning");
                return;
            }
        }
        
        // Frozen Check (Only today and yesterday)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const targetDate = new Date(dateStr);
        
        if (targetDate < yesterday) {
            this.showToast(i18n.t('onlyRecentEditable') || 'Sadece bugün ve dün için değişiklik yapabilirsin!', "info");
            return;
        }

        const isNowChecked = StateManager.toggleLog(habitId, dateStr);
        
        // Check for streak milestones
        if (isNowChecked) {
            const todayStr = Utils.getTodayStr();
            if (dateStr === todayStr) {
                const streak = Utils.getStreak(habitId, dateStr);
                this.checkStreakMilestone(streak);
                this.checkTwoDayRule(habitId, dateStr);
            }
        }
    },
    
    // ==================
    // STREAK HELPERS
    // ==================
    
    checkStreakMilestone(streak) {
        const milestones = [7, 14, 21, 30, 60, 90, 100, 365];
        
        if (milestones.includes(streak)) {
            this.showToast(`🏆 Amazing! ${streak} day streak!`, "milestone");
        } else if (streak === 3) {
            this.showToast("🔥 3 days in a row! Keep it going!", "success");
        }
    },
    
    checkTwoDayRule(habitId, dateStr) {
        const yesterday = new Date(dateStr);
        yesterday.setDate(yesterday.getDate() - 1);
        const dayBefore = new Date(dateStr);
        dayBefore.setDate(dayBefore.getDate() - 2);
        
        const yStr = Utils.toDateStr(yesterday);
        const dbStr = Utils.toDateStr(dayBefore);
        
        const missedYesterday = !StateManager.isLogged(habitId, yStr);
        const didDayBefore = StateManager.isLogged(habitId, dbStr);
        
        if (missedYesterday && didDayBefore) {
            this.showToast("💪 Two-Day Rule saved! Never miss twice.", "warning");
        }
    },
    
    // ==================
    // UI HELPERS
    // ==================
    
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    },
    
    toggleSummary() {
        const panel = document.getElementById('summary-panel');
        const overlay = document.getElementById('overlay');
        panel.classList.toggle('active');
        overlay.classList.toggle('active');
    },
    
    showAddHabit() {
        this.editingHabitId = null;
        this.resetForm();
        this.populateStackDropdown();
        
        // Reset modal title for add mode
        document.querySelector('#modal h2 span').textContent = i18n.t('newHabit') || 'New Habit';
        document.querySelector('#modal .btn-primary span').textContent = i18n.t('addHabit') || 'Add Habit';
        
        document.getElementById('modal').classList.add('active');
        document.getElementById('habit-input').focus();
        
        const tips = getCoachTips();
        document.getElementById('coach-tip-text').textContent = 
            tips[Math.floor(Math.random() * tips.length)];
    },
    
    hideAddHabit() {
        document.getElementById('modal').classList.remove('active');
        this.editingHabitId = null;
    }
};

// Make App globally available
window.App = App;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
