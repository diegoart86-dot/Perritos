import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetReminder } from '../types';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Volume2, 
  Check, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Syringe, 
  Pill, 
  AlertCircle, 
  X,
  CalendarCheck
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface CalendarPanelProps {
  reminders: PetReminder[];
  onAddReminder: (reminder: Omit<PetReminder, 'id' | 'completed' | 'notified'>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onPlayBarkSound: () => void;
  onClose: () => void;
}

export default function CalendarPanel({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onPlayBarkSound,
  onClose,
}: CalendarPanelProps) {
  const { t, lang } = useLanguage();
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<'vaccine' | 'flea_pill'>('vaccine');
  const [newTitle, setNewTitle] = useState('');
  const [newDateStr, setNewDateStr] = useState('');
  const [newTimeStr, setNewTimeStr] = useState('10:00');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar calculations
  const monthNames = lang === 'es'
    ? [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
    : [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

  const daysOfWeek = lang === 'es'
    ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Number of days in current month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // Number of days in previous month (to fill prefix grid)
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (d: number) => {
    const today = new Date();
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (d: number) => {
    return selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const getRemindersForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reminders.filter(r => r.date === dateStr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Por favor escribe un título.');
      return;
    }
    if (!newDateStr) {
      setFormError('Por favor selecciona una fecha.');
      return;
    }

    onAddReminder({
      type: newType,
      title: newTitle.trim(),
      date: newDateStr,
      time: newTimeStr || undefined,
      notes: newNotes.trim() || undefined,
    });

    // Reset Form
    setNewTitle('');
    setNewDateStr('');
    setNewTimeStr('10:00');
    setNewNotes('');
    setFormError('');
    setShowAddForm(false);
  };

  // Generate calendar cells
  const renderCalendarCells = () => {
    const cells = [];

    // 1. Prefill with previous month's ending days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevDay = totalDaysInPrevMonth - i;
      cells.push(
        <div 
          key={`prev-${prevDay}`} 
          className="h-9 sm:h-11 flex items-center justify-center text-xs text-[#806F66]/30 font-medium select-none bg-stone-50/40 rounded-xl pointer-events-none"
        >
          {prevDay}
        </div>
      );
    }

    // 2. Main days of the month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dayReminders = getRemindersForDay(d);
      const hasVaccine = dayReminders.some(r => r.type === 'vaccine');
      const hasFleaPill = dayReminders.some(r => r.type === 'flea_pill');

      cells.push(
        <button
          key={`day-${d}`}
          onClick={() => {
            const newSel = new Date(year, month, d);
            setSelectedDate(newSel);
            setNewDateStr(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
          }}
          className={`h-9 sm:h-11 flex flex-col items-center justify-between p-1 rounded-xl border relative transition-all cursor-pointer ${
            isToday(d)
              ? 'border-[#F4B942] bg-[#FFF0D4] font-bold text-[#3D2B24]'
              : isSelected(d)
                ? 'border-[#3D2B24] bg-[#FFF8EE] font-semibold text-[#3D2B24]'
                : 'border-transparent text-[#3D2B24] hover:bg-[#FFF8EE] font-medium'
          }`}
        >
          <span className="text-xs sm:text-sm">{d}</span>
          
          {/* Bottom dots representing event categories */}
          <div className="flex gap-0.5 justify-center items-center h-1.5 w-full">
            {hasVaccine && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" title="Vacuna" />
            )}
            {hasFleaPill && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Pastilla Pulgas" />
            )}
          </div>
        </button>
      );
    }

    return cells;
  };

  // Filter reminders for display on right side/bottom list
  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedReminders = reminders.filter(r => r.date === selectedDateStr);

  return (
    <div id="calendar-modal" className="fixed inset-0 bg-[#3D2B24]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        className="w-full max-w-2xl bg-white rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(61,43,36,0.14)] border border-[#F4D396] flex flex-col max-h-[90vh] font-montserrat"
      >
        {/* Header */}
        <div className="bg-[#FFF8EE] border-b border-[#F4D396]/60 p-4.5 text-[#3D2B24] flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#FFF0D4] border border-[#F4D396] flex items-center justify-center text-[#F4B942]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#3D2B24]">{t('calendarTitle')}</h3>
              <p className="text-[11px] text-[#806F66]">{t('calendarSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPlayBarkSound}
              className="flex items-center gap-1.5 bg-white hover:bg-[#FFF0D4] border border-[#F4D396] px-3 py-1.5 rounded-full font-medium text-xs text-[#3D2B24] shadow-2xs transition-colors cursor-pointer"
              title={t('testBark')}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F4B942]" />
              <span className="hidden sm:inline">{t('testBark')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#806F66] hover:text-[#3D2B24] hover:bg-[#FFF0D4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4.5 bg-[#FFFDF9] flex flex-col md:flex-row gap-5">
          
          {/* LEFT: CALENDAR VIEW */}
          <div className="flex-1 flex flex-col gap-3">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center bg-white border border-[#F4D396]/50 p-2.5 rounded-[18px] shadow-2xs text-[#3D2B24]">
              <button 
                onClick={handlePrevMonth} 
                className="p-1.5 rounded-xl hover:bg-[#FFF8EE] text-[#3D2B24] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h4 className="font-semibold text-xs sm:text-sm capitalize">
                {monthNames[month]} {year}
              </h4>
              <button 
                onClick={handleNextMonth} 
                className="p-1.5 rounded-xl hover:bg-[#FFF8EE] text-[#3D2B24] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border border-[#F4D396]/40 p-3 rounded-[22px] shadow-2xs">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] text-[#806F66] font-semibold uppercase tracking-wider">
                {daysOfWeek.map(d => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>
              
              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarCells()}
              </div>
            </div>

            {/* Quick Informative banner */}
            <div className="bg-white border border-[#F4D396]/40 p-3 rounded-[18px] flex items-center gap-2.5 text-xs text-[#3D2B24]">
              <AlertCircle className="w-4 h-4 text-[#F4B942] flex-shrink-0" />
              <p className="font-medium leading-tight text-[11px] text-[#806F66]">
                {lang === 'es' 
                  ? 'Toca cualquier día para agendar vacuna 💉 o pastilla antipulgas 💊.' 
                  : 'Tap any day to schedule vaccination 💉 or flea pill 💊.'}
              </p>
            </div>
          </div>

          {/* RIGHT: SELECTED DAY'S REMINDERS & SCHEDULER */}
          <div className="w-full md:w-[260px] flex flex-col gap-3">
            
            {/* Header / Day title */}
            <div className="bg-[#FFF8EE] border border-[#F4D396]/60 p-3 rounded-[18px] text-center">
              <span className="text-[10px] text-[#806F66] uppercase font-medium tracking-wider">
                {lang === 'es' ? 'Fecha Seleccionada' : 'Selected Date'}
              </span>
              <p className="font-semibold text-sm text-[#3D2B24] mt-0.5">
                📅 {lang === 'es' ? `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}` : `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`}
              </p>
            </div>

            {/* Reminders List for Selected Day */}
            <div className="flex-1 min-h-[140px] bg-white border border-[#F4D396]/40 rounded-[22px] p-3 flex flex-col gap-2 overflow-y-auto">
              <span className="text-[10px] text-[#806F66] uppercase font-medium tracking-wider mb-1 block">
                {lang === 'es' ? 'Eventos del día' : 'Day events'}
              </span>
              
              {selectedReminders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <CalendarCheck className="w-7 h-7 text-[#F4B942]/40 mb-1" />
                  <p className="text-[11px] text-[#806F66] font-medium">
                    {lang === 'es' ? 'No hay eventos para esta fecha' : 'No events for this date'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedReminders.map(r => (
                    <div 
                      key={r.id} 
                      className={`p-2.5 rounded-[16px] border flex flex-col gap-1.5 transition-all text-xs relative ${
                        r.completed 
                          ? 'bg-emerald-50/40 border-emerald-200 text-[#806F66]' 
                          : 'bg-white border-[#F4D396] text-[#3D2B24]'
                      }`}
                    >
                      {/* Top Action / Label */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1 font-semibold text-[11px]">
                          {r.type === 'vaccine' ? (
                            <Syringe className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Pill className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span className="truncate max-w-[120px]">{r.title}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Complete Checkbox */}
                          <button
                            onClick={() => onToggleReminder(r.id)}
                            className={`p-1 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              r.completed
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : 'border-[#F4D396] hover:bg-[#FFF0D4]'
                            }`}
                            title={r.completed ? (lang === 'es' ? "Desmarcar" : "Uncheck") : (lang === 'es' ? "Marcar completado" : "Mark completed")}
                          >
                            <Check className="w-3 h-3" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteReminder(r.id)}
                            className="p-1 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title={lang === 'es' ? "Eliminar recordatorio" : "Delete reminder"}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Notes / Time */}
                      <div className="text-[10px] text-[#806F66] flex flex-col gap-0.5">
                        {r.time && (
                          <span className="flex items-center gap-0.5 font-medium text-[#F4B942]">
                            <Clock className="w-2.5 h-2.5" /> {r.time}
                          </span>
                        )}
                        {r.notes && (
                          <p className="italic font-normal leading-tight">"{r.notes}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ADD FORM TOGGLE BUTTON */}
            {!showAddForm ? (
              <button
                onClick={() => {
                  setNewDateStr(selectedDateStr);
                  setShowAddForm(true);
                }}
                className="w-full py-2.5 rounded-[18px] bg-[#F4B942] text-[#3D2B24] hover:bg-[#FFD477] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E29E2E] shadow-xs cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addReminderBtn')}</span>
              </button>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white border border-[#F4D396] rounded-[22px] p-3 flex flex-col gap-2.5 shadow-md"
              >
                <div className="flex justify-between items-center pb-1 border-b border-[#FFF0D4]">
                  <span className="text-[10px] font-semibold text-[#3D2B24] uppercase">
                    {lang === 'es' ? 'Nuevo Recordatorio' : 'New Reminder'}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="p-0.5 rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Segmented Type Switcher */}
                <div className="flex bg-[#FFF8EE] p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setNewType('vaccine')}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      newType === 'vaccine'
                        ? 'bg-white text-rose-600 border border-rose-100 shadow-3xs'
                        : 'text-[#806F66] hover:bg-[#FFF0D4]/50'
                    }`}
                  >
                    <Syringe className="w-3 h-3 text-rose-500" /> {t('vaccineTitle')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('flea_pill')}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      newType === 'flea_pill'
                        ? 'bg-white text-amber-700 border border-amber-100 shadow-3xs'
                        : 'text-[#806F66] hover:bg-[#FFF0D4]/50'
                    }`}
                  >
                    <Pill className="w-3 h-3 text-amber-600" /> {t('fleaPillTitle')}
                  </button>
                </div>

                {/* Text Title */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder={newType === 'vaccine' ? (lang === 'es' ? "Vacuna Séxtuple, Rabia..." : "Rabies, Distemper...") : (lang === 'es' ? "NexGard, Simparica, Pipeta..." : "NexGard, Bravecto...")}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#F4D396]/60 bg-[#FFFDF9] text-xs text-[#3D2B24] placeholder-[#806F66]/50 outline-none focus:border-[#F4B942]"
                  />
                </div>

                {/* Date & Time Picker inputs */}
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="text-[8px] font-semibold text-[#806F66] block mb-0.5">{lang === 'es' ? 'FECHA' : 'DATE'}</label>
                    <input
                      type="date"
                      required
                      value={newDateStr}
                      onChange={(e) => setNewDateStr(e.target.value)}
                      className="w-full p-1 rounded-lg border border-[#F4D396]/60 bg-[#FFFDF9] text-[10px] text-[#3D2B24] outline-none"
                    />
                  </div>
                  <div className="w-[70px]">
                    <label className="text-[8px] font-semibold text-[#806F66] block mb-0.5">{lang === 'es' ? 'HORA' : 'TIME'}</label>
                    <input
                      type="time"
                      value={newTimeStr}
                      onChange={(e) => setNewTimeStr(e.target.value)}
                      className="w-full p-1 rounded-lg border border-[#F4D396]/60 bg-[#FFFDF9] text-[10px] text-[#3D2B24] outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Notes Input */}
                <div>
                  <textarea
                    placeholder={lang === 'es' ? "Notas (veterinario, dosis...)" : "Notes (vet, dosage...)"}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#F4D396]/60 bg-[#FFFDF9] text-xs text-[#3D2B24] placeholder-[#806F66]/50 outline-none resize-none focus:border-[#F4B942] h-11"
                  />
                </div>

                {formError && (
                  <p className="text-[10px] text-rose-500 font-semibold">{formError}</p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-1.5 rounded-xl border border-stone-200 text-stone-500 font-medium text-[10px] hover:bg-stone-50 cursor-pointer"
                  >
                    {lang === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-xl bg-[#F4B942] hover:bg-[#FFD477] text-[#3D2B24] font-semibold text-[10px] border border-[#E29E2E] cursor-pointer shadow-3xs"
                  >
                    {lang === 'es' ? 'Guardar' : 'Save'}
                  </button>
                </div>
              </motion.form>
            )}

          </div>

        </div>

        {/* Footer / Close Button */}
        <div className="p-4 bg-[#FFF8EE] border-t border-[#F4D396]/40 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[18px] bg-[#3D2B24] text-white font-medium text-xs hover:bg-[#5A3828] transition-colors cursor-pointer shadow-xs"
          >
            {t('backToGolden')}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
