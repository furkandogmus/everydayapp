/**
 * ===============================================
 * EVERYDAY PRO - INTERNATIONALIZATION (i18n)
 * Multi-Language Support
 * ===============================================
 */

const i18n = {
    currentLang: 'tr',
    
    translations: {
        tr: {
            // App
            appTitle: 'Everyday Pro',
            
            // Header Stats
            bestStreak: 'En İyi Seri',
            today: 'Bugün',
            thisWeek: 'Bu Hafta',
            
            // Buttons
            weeklySummary: 'Haftalık Özet',
            cancel: 'İptal',
            
            // Modal
            newHabit: 'Yeni Alışkanlık',
            habitName: 'Alışkanlık Adı',
            habitPlaceholder: 'örn: 90dk Derin Çalışma',
            category: 'Kategori',
            
            // Categories
            health: 'Sağlık',
            work: 'İş',
            personal: 'Kişisel',
            learning: 'Öğrenme',
            
            // Implementation Intention
            implementationIntention: 'Uygulama Niyeti',
            intentionPrefix: 'Ben',
            intentionAt: "'de",
            intentionIn: "'da",
            intentionSuffix: 'yapacağım',
            intentionPlaceholder: 'yer (örn: mutfak)',
            
            // Coach Tip
            coachTipTitle: 'Atomic Habits İpucu',
            coachTipText: 'Belirgin, çekici, kolay ve tatmin edici yap. Alışkanlığının 2 dakikalık versiyonuyla başla.',
            
            // Summary Panel
            completionRate: 'Tamamlanma Oranı',
            completed: 'tamamlandı',
            currentStreaks: 'Aktif Seriler',
            activeHabits: 'aktif alışkanlık',
            habitPerformance: 'Alışkanlık Performansı (7 gün)',
            
            // Empty State
            noHabitsYet: 'Henüz alışkanlık yok',
            emptyStateDesc: 'Atomic Habits prensipleriyle günlük rutininizi oluşturmaya başlayın. Küçük alışkanlıklar, büyük sonuçlar.',
            addFirstHabit: 'İlk alışkanlığını ekle',
            firstComplete: 'Önce şunu tamamlamalısın:',
            onlyRecentEditable: 'Sadece bugün ve dün için değişiklik yapabilirsin!',
            
            // Toasts
            habitAdded: 'Alışkanlık eklendi!',
            habitDeleted: 'Alışkanlık silindi',
            streakMilestone: 'gün serisi! Harika gidiyorsun! 🎉',
            
            // Delete
            deleteHabit: 'Alışkanlığı sil',
            
            // Edit Habit
            editHabit: 'Alışkanlığı Düzenle',
            save: 'Kaydet',
            
            // Habit Stacking
            habitStacking: 'Alışkanlık Zincirleme',
            stackHint: '"X yaptıktan sonra Y yapacağım" - Atomic Habits',
            noStack: '-- Zincirleme yok --',
            
            // Risk Badge
            riskTooltip: 'Seriyi bozma! İki Gün Kuralı',
            
            // Pomodoro
            pomodoroComplete: 'Pomodoro tamamlandı! Mola zamanı.',
            pomodoroWorkTime: 'Çalışma zamanı!',
            pomodoroBreak: 'Mola',
            pomodoroWork: 'Çalışma',
            
            // Days
            mon: 'Pzt',
            tue: 'Sal',
            wed: 'Çar',
            thu: 'Per',
            fri: 'Cum',
            sat: 'Cmt',
            sun: 'Paz',
            
            // Coach Tips (Atomic Habits + Deep Work)
            coachTips: [
                "Belirgin, çekici, kolay ve tatmin edici yap. Alışkanlığının 2 dakikalık versiyonuyla başla.",
                "Yeni alışkanlığını mevcut bir alışkanlığın üzerine kur: 'X'ten sonra Y yapacağım.'",
                "Çevre tasarımı önemlidir. İyi alışkanlıklar için ipuçlarını görünür yap.",
                "İki Gün Kuralı: Bir alışkanlığı arka arkaya iki gün asla atlama.",
                "Hedeflere değil, sistemlere odaklan. Alışkanlıkların otomatik pilotun olsun.",
                "Hayır diyemeyeceğin kadar kolay yap. Sürtünmeyi azalt, başlamayı kolaylaştır.",
                "Alışkanlık takibi ilerlemenin görsel kanıtı. Zinciri kırma!",
                "Derin çalışma için en iyi zaman, irade gücünün zirvede olduğu sabah erken saatleri.",
                "📵 Bildirimleri kapat. Her kesinti, odaklanmayı yeniden kurman için 23 dakika kaybettiriyor.",
                "🚫 Twitter/X'te gezinme. Kitaplarını NotebookLM'e yükle, podcast gibi dinle.",
                "⏰ Günlük hatırlatıcılar kur. Farkındalık olmadan zaman akıp gider.",
                "🍅 Pomodoro tekniği: 25dk odaklan, 5dk mola. Derin çalışmayı sürdürülebilir kıl."
            ]
        },
        
        en: {
            // App
            appTitle: 'Everyday Pro',
            
            // Header Stats
            bestStreak: 'Best Streak',
            today: 'Today',
            thisWeek: 'This Week',
            
            // Buttons
            weeklySummary: 'Weekly Summary',
            cancel: 'Cancel',
            
            // Modal
            newHabit: 'New Habit',
            habitName: 'Habit Name',
            habitPlaceholder: 'e.g. 90m Deep Work',
            category: 'Category',
            
            // Categories
            health: 'Health',
            work: 'Work',
            personal: 'Personal',
            learning: 'Learning',
            
            // Implementation Intention
            implementationIntention: 'Implementation Intention',
            intentionPrefix: 'I will',
            intentionAt: 'at',
            intentionIn: 'in',
            intentionSuffix: '',
            intentionPlaceholder: 'place (e.g. kitchen)',
            
            // Coach Tip
            coachTipTitle: 'Atomic Habits Tip',
            coachTipText: 'Make it obvious, attractive, easy, and satisfying. Start with a 2-minute version of your habit.',
            
            // Summary Panel
            completionRate: 'Completion Rate',
            completed: 'completed',
            currentStreaks: 'Current Streaks',
            activeHabits: 'active habits',
            habitPerformance: 'Habit Performance (7 days)',
            
            // Empty State
            noHabitsYet: 'No habits yet',
            emptyStateDesc: 'Start building your daily routine with Atomic Habits principles. Small habits, big results.',
            addFirstHabit: 'Add your first habit',
            firstComplete: 'First complete:',
            onlyRecentEditable: 'Only today and yesterday can be edited!',
            
            // Toasts
            habitAdded: 'Habit added!',
            habitDeleted: 'Habit deleted',
            streakMilestone: 'day streak! Keep it up! 🎉',
            
            // Delete
            deleteHabit: 'Delete habit',
            
            // Edit Habit
            editHabit: 'Edit Habit',
            save: 'Save',
            
            // Habit Stacking
            habitStacking: 'Habit Stacking',
            stackHint: '"After I do X, I will do Y" - Atomic Habits',
            noStack: '-- No stacking --',
            
            // Risk Badge
            riskTooltip: "Don't break the chain! Two-Day Rule",
            
            // Pomodoro
            pomodoroComplete: 'Pomodoro complete! Break time.',
            pomodoroWorkTime: 'Work time!',
            pomodoroBreak: 'Break',
            pomodoroWork: 'Work',
            
            // Days
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun',
            
            // Coach Tips (Atomic Habits + Deep Work)
            coachTips: [
                "Make it obvious, attractive, easy, and satisfying. Start with a 2-minute version.",
                "Stack habits: 'After I do X, I will do Y.' Chain behaviors together.",
                "Environment design matters. Make cues for good habits visible.",
                "The Two-Day Rule: Never skip a habit two days in a row.",
                "Focus on systems, not goals. Let your habits run on autopilot.",
                "Make it so easy you can't say no. Reduce friction to start.",
                "Habit tracking is visual proof of progress. Don't break the chain!",
                "Deep work is best in early morning when willpower peaks.",
                "Turn off notifications. Each interruption costs 23 minutes to refocus.",
                "Don't scroll Twitter/X. Upload books to NotebookLM, listen like a podcast.",
                "Set daily reminders. Without awareness, time slips away.",
                "Pomodoro: 25min focus, 5min break. Makes deep work sustainable."
            ]
        }
    },
    
    /**
     * Initialize i18n - load saved language preference
     */
    init() {
        const savedLang = localStorage.getItem('ev_lang');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        }
        this.updateUI();
        return this;
    },
    
    /**
     * Get translation for a key
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },
    
    /**
     * Set language and update UI
     */
    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('ev_lang', lang);
            this.updateUI();
            
            // Re-render app with new language
            if (window.Renderer) {
                Renderer.render();
                Renderer.updateStats();
            }
        }
    },
    
    /**
     * Update all static UI elements with translations
     */
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[this.currentLang][key]) {
                el.textContent = this.t(key);
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (this.translations[this.currentLang][key]) {
                el.placeholder = this.t(key);
            }
        });
        
        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            if (this.translations[this.currentLang][key]) {
                el.title = this.t(key);
            }
        });
        
        // Update language selector
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.value = this.currentLang;
        }
    },
    
    /**
     * Get day name in current language
     */
    getDayName(date) {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return this.t(days[date.getDay()]);
    }
};

// Export for use in other modules
window.i18n = i18n;
