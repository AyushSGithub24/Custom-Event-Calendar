import React, { useState, useEffect } from "react";
import {Clock,X,AlignLeft,Repeat,Save,} from "lucide-react";
import { toast } from "react-toastify";


export const EventSidebar = ({ isOpen, onClose, onSave, eventData, setFormData }) => {
  const predefinedRecurrenceOptions = [
    { label: "Daily", value: "FREQ=DAILY" },
    { label: "Weekly", value: "FREQ=WEEKLY" },
    { label: "Weekdays (Mon–Fri)", value: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" },
    { label: "Weekends (Sat–Sun)", value: "FREQ=WEEKLY;BYDAY=SA,SU" },
    { label: "Monthly", value: "FREQ=MONTHLY" },
    { label: "Quarterly", value: "FREQ=MONTHLY;INTERVAL=3" },
    { label: "Yearly", value: "FREQ=YEARLY" },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isRecurring") {
      setFormData((prev) => ({
        ...prev,
        isRecurring: checked,
        recurrenceRule: checked ? "FREQ=DAILY" : "",
      }));
    } else if (name === "recurrence-select") {
      setFormData((prev) => ({
        ...prev,
        recurrenceRule: value === "CUSTOM" ? "" : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!eventData.title) {
      toast.error("Title is required.");
      return;
    }
    if (new Date(eventData.end) <= new Date(eventData.start)) {
      toast.error("End must be after start.");
      return;
    }
    onSave(eventData);
  };

  const isPredefined = predefinedRecurrenceOptions.some(
    (opt) => opt.value === eventData.recurrenceRule
  );
  const showCustomInput = eventData.isRecurring && !isPredefined;
  const selectValue = showCustomInput ? "CUSTOM" : eventData.recurrenceRule;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Add Event</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </header>

          {/* Form */}
          <form
            onSubmit={handleSave}
            className="flex-grow px-6 py-4 overflow-y-auto space-y-6"
          >
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              placeholder="Add title"
              className="w-full text-xl font-semibold text-gray-800 border-none focus:ring-0"
              required
            />

            <div className="space-y-3">
              {/* Date Time Inputs */}
              <div className="flex items-start gap-4">
                <Clock className="mt-2 text-gray-400" size={20} />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2 items-center">
                    <span className="w-14 text-sm text-gray-600">Starts</span>
                    <input
                      type="datetime-local"
                      name="start"
                      value={eventData.start}
                      onChange={handleChange}
                      className="flex-1 p-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-14 text-sm text-gray-600">Ends</span>
                    <input
                      type="datetime-local"
                      name="end"
                      value={eventData.end}
                      onChange={handleChange}
                      className="flex-1 p-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex items-start gap-4">
                <AlignLeft className="mt-2 text-gray-400" size={20} />
                <textarea
                  name="description"
                  rows="4"
                  value={eventData.description}
                  onChange={handleChange}
                  placeholder="Add description"
                  className="w-full p-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Recurring Event */}
              <div className="flex items-center gap-3">
                <Repeat className="text-gray-400" size={20} />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={eventData.isRecurring}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Recurring event
                </label>
              </div>

              {/* Recurrence Rule Options */}
              {eventData.isRecurring && (
                <div className="pl-9 space-y-2">
                  <select
                    name="recurrence-select"
                    value={selectValue}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300 bg-gray-100 focus:ring-indigo-500"
                  >
                    {predefinedRecurrenceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    <option value="CUSTOM">Custom...</option>
                  </select>

                  {showCustomInput && (
                    <input
                      type="text"
                      name="recurrenceRule"
                      value={eventData.recurrenceRule}
                      onChange={handleChange}
                      placeholder="Enter custom RRULE string"
                      className="w-full p-2 rounded-md border border-gray-300 bg-gray-100 focus:ring-indigo-500"
                    />
                  )}
                </div>
              )}
            </div>

            {/* ✅ Submit in footer */}
            <footer className="p-4 fixed right-0 left-0 bottom-0 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#588baa] hover:hover:bg-[#557990] text-white font-medium px-4 py-2 rounded-md shadow"
              >
                <Save size={18} />
                Save
              </button>
            </footer>
          </form>
        </div>
      </div>
    </>
  );
};
