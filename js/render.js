/**
 * ===============================================
 * EVERYDAY PRO - RENDERER
 * DOM Rendering & UI Updates
 * ===============================================
 */

const Renderer = {
    // ==================
    // TEMPLATE FRAGMENTS
    // ==================
    templates: {
        cell: (isDone, isFuture, level, habitId, dateStr, isLocked = false, isFrozen = false) => `
            <div class="cell ${isDone ? 'done' : ''} ${isFuture ? 'future' : ''} ${isLocked ? 'locked' : ''} ${isFrozen ? 'frozen' : ''}" 
                 data-level="${level}" 
                 data-habit-id="${habitId}" 
                 data-date="${dateStr}">
            </div>`,
        
        dateCell: (date, isToday) => `
            <div class="date-cell ${isToday ? 'today' : ''}">
                <div style="opacity: 0.5">${i18n.getDayName(date)}</div>
                <div style="font-weight: 600">${date.getDate()}</div>
            </div>`,
        
        riskBadge: () => 
            `<span class="streak-badge danger" title="${i18n.t('riskTooltip')}">⚠️</span>`
    },
    
    // ==================
    // MAIN RENDER
    // ==================
    
    render() {
        const state = StateManager.get();
        const namesList = document.getElementById('names-list');
        const gridContainer = document.getElementById('grid-container');
        const today = new Date();
        const todayStr = Utils.toDateStr(today);
        
        // Empty state
        if (state.habits.length === 0) {
            namesList.innerHTML = '';
            gridContainer.innerHTML = this.renderEmptyState();
            return;
        }
        
        // Get date range
        const days = Utils.getDateRange(40, 5);
        
        // Build HTML
        let namesHtml = `<div class="header-row"></div>`;
        let gridHtml = this.renderDateHeader(days, today);
        
        // Get habits sorted by stack order
        const sortedHabits = StateManager.getHabitsSorted();
        
        // Render each habit row
        sortedHabits.forEach((habit, index) => {
            const prevHabit = sortedHabits[index - 1];
            const isChained = habit.stackAfter && habit.stackAfter === prevHabit?.id;
            namesHtml += this.renderHabitName(habit, todayStr, isChained);
            gridHtml += this.renderHabitRow(habit, days, today);
        });
        
        namesList.innerHTML = namesHtml;
        gridContainer.innerHTML = gridHtml;
        
        // Refresh Lucide icons after DOM update
        if (window.lucide) {
            lucide.createIcons();
        }
    },
    
    // ==================
    // RENDER HELPERS
    // ==================
    
    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>${i18n.t('noHabitsYet')}</h3>
                <p>${i18n.t('emptyStateDesc')}</p>
                <button class="btn-primary" onclick="App.showAddHabit()">${i18n.t('addFirstHabit')}</button>
            </div>
        `;
    },
    
    renderDateHeader(days, today) {
        let html = `<div class="row header-row">`;
        
        days.forEach(d => {
            const isToday = d.toDateString() === today.toDateString();
            html += this.templates.dateCell(d, isToday);
        });
        
        return html + `</div>`;
    },
    
    renderHabitName(habit, todayStr, isChained = false) {
        const currentStreak = Utils.getStreak(habit.id, todayStr);
        const catColor = `var(--cat-${habit.category || 'health'})`;
        const atRisk = Utils.isAtRisk(habit.id);
        
        let badgeClass = currentStreak >= 7 ? 'milestone' : '';
        
        // Build intention display
        const hasIntention = habit.intention?.time && habit.intention?.place;
        const intentionHtml = hasIntention 
            ? `<span class="habit-intention"><i data-lucide="clock" class="intention-icon"></i> ${habit.intention.time} @ ${habit.intention.place}</span>`
            : '';
        
        // Chain indicator for stacked habits
        const chainHtml = isChained 
            ? `<span class="chain-indicator" title="Stacked after previous habit"><i data-lucide="arrow-down" class="chain-icon"></i></span>`
            : '';
        
        return `
            <div class="row ${isChained ? 'chained' : ''}">
                <div class="name-cell">
                    <div class="habit-info">
                        ${chainHtml}
                        <span class="category-dot" style="background: ${catColor}"></span>
                        <div class="habit-text" onclick="App.editHabit('${habit.id}')" style="cursor: pointer;">
                            <span class="habit-name">${habit.name}</span>
                            ${intentionHtml}
                        </div>
                    </div>
                    <div class="badges">
                        ${atRisk ? this.templates.riskBadge() : ''}
                        <button class="delete-btn" onclick="event.stopPropagation(); App.deleteHabit('${habit.id}')" title="Delete habit"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            </div>`;
    },
    
    renderHabitRow(habit, days, today) {
        let html = `<div class="row">`;
        
        days.forEach(d => {
            const dateStr = Utils.toDateStr(d);
            const isFuture = d > today;
            const isDone = StateManager.isLogged(habit.id, dateStr);
            
            let level = 0;
            if (isDone) {
                const streakAtTime = Utils.getStreak(habit.id, dateStr);
                level = Utils.getStreakLevel(streakAtTime);
            }
            
            // Dependency check (habit stacking lock)
            let isLocked = false;
            if (habit.stackAfter && !isFuture) {
                const parentCompleted = StateManager.isLogged(habit.stackAfter, dateStr);
                if (!parentCompleted) {
                    isLocked = true;
                }
            }
            
            // Frozen check (only today and yesterday editable)
            let isFrozen = false;
            if (!isFuture) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (d < yesterday) {
                    isFrozen = true;
                }
            }
            
            html += this.templates.cell(isDone, isFuture, level, habit.id, dateStr, isLocked, isFrozen);
        });
        
        return html + `</div>`;
    },
    
    // ==================
    // STATS UPDATE
    // ==================
    
    updateStats() {
        const state = StateManager.get();
        const todayStr = Utils.getTodayStr();
        
        // Best streak across all habits
        let bestStreak = 0;
        state.habits.forEach(h => {
            bestStreak = Math.max(bestStreak, Utils.getBestStreak(h.id));
        });
        document.getElementById('total-streak').textContent = bestStreak;
        
        // Today's completion
        const todayLogs = StateManager.getLogsForDate(todayStr);
        document.getElementById('today-done').textContent = 
            `${todayLogs.length}/${state.habits.length}`;
        
        // Weekly rate
        const weekly = Utils.getWeeklyRate();
        document.getElementById('weekly-rate').textContent = weekly.rate + '%';
        
        // Summary panel
        document.getElementById('summary-rate').textContent = weekly.rate + '%';
        document.getElementById('summary-detail').textContent = 
            `${weekly.done} of ${weekly.total} completed`;
        
        // Active streaks
        let activeStreaks = 0;
        state.habits.forEach(h => {
            if (Utils.getStreak(h.id, todayStr) > 0) activeStreaks++;
        });
        document.getElementById('summary-streaks').textContent = activeStreaks;
        
        // Habit breakdown
        this.renderHabitBreakdown();
    },
    
    renderHabitBreakdown() {
        const state = StateManager.get();
        const container = document.getElementById('habit-breakdown');
        let html = `<h4>${i18n.t('habitPerformance')}</h4>`;
        
        state.habits.forEach(habit => {
            const weeklyData = Utils.getHabitWeeklyData(habit.id);
            const catColor = `var(--cat-${habit.category || 'health'})`;
            
            html += `
                <div class="breakdown-item">
                    <div class="breakdown-name">
                        <span class="category-dot" style="background: ${catColor}"></span>
                        <span>${habit.name}</span>
                    </div>
                    <div class="breakdown-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${weeklyData.rate}%; background: ${catColor}"></div>
                        </div>
                        <span class="progress-percent">${weeklyData.rate}%</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    // ==================
    // SCROLL HELPERS
    // ==================
    
    scrollToToday() {
        const wrapper = document.querySelector('.wrapper');
        const todayCell = document.querySelector('.date-cell.today');
        
        if (todayCell) {
            const centerOffset = (todayCell.offsetLeft + (todayCell.offsetWidth / 2)) - (window.innerWidth / 2);
            wrapper.scrollLeft = centerOffset;
        }
    }
};

// Export for use in other modules
window.Renderer = Renderer;
