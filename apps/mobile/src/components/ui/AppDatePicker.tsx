import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../theme/theme.context";
import { Calendar, Clock, ChevronLeft, ChevronRight, X, Check } from "lucide-react-native";

export interface AppDatePickerProps {
  label?: string;
  value?: string; // ISO date string (YYYY-MM-DD) or datetime (YYYY-MM-DD HH:mm)
  onChange: (val: string) => void;
  mode?: "date" | "datetime";
  error?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label,
  value = "",
  onChange,
  mode = "date",
  error,
  placeholder = "Select date",
}) => {
  const { isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Initialize selected date state
  const initialDate = value ? new Date(value.replace(" ", "T")) : new Date();
  const validDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

  const [currentYear, setCurrentYear] = useState(validDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(validDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(validDate.getDate());

  const [selectedHour, setSelectedHour] = useState(
    value && mode === "datetime" ? validDate.getHours() : 9
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value && mode === "datetime" ? validDate.getMinutes() : 0
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleApply = () => {
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(selectedDay).padStart(2, "0");

    if (mode === "date") {
      onChange(`${yyyy}-${mm}-${dd}`);
    } else {
      const hh = String(selectedHour).padStart(2, "0");
      const min = String(selectedMinute).padStart(2, "0");
      onChange(`${yyyy}-${mm}-${dd} ${hh}:${min}`);
    }
    setModalVisible(false);
  };

  const handleClear = () => {
    onChange("");
    setModalVisible(false);
  };

  const setPreset = (daysToAdd: number, hour = 9, min = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setSelectedDay(d.getDate());
    setSelectedHour(hour);
    setSelectedMinute(min);
  };

  const formatDisplayValue = () => {
    if (!value) return null;
    try {
      if (mode === "date") {
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } else {
        const d = new Date(value.replace(" ", "T"));
        if (isNaN(d.getTime())) return value;
        return (
          d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
          " at " +
          d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        );
      }
    } catch {
      return value;
    }
  };

  const isDarkMode = isDark;
  const cardBg = isDarkMode ? "#0f172a" : "#ffffff";
  const borderColor = isDarkMode ? "#1e293b" : "#f1f5f9";
  const textColor = isDarkMode ? "#ffffff" : "#0f172a";
  const subTextColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <View style={{ width: "100%" }}>
      {label ? (
        <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: subTextColor }}>
          {label}
        </Text>
      ) : null}

      {/* Trigger Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? "#ef4444" : isDarkMode ? "#1e293b" : "#e2e8f0",
          backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
        }}
      >
        <View style={{ flexDirection: "row", items: "center", gap: 8, flex: 1 }}>
          {mode === "datetime" ? (
            <Clock size={18} color={subTextColor} />
          ) : (
            <Calendar size={18} color={subTextColor} />
          )}

          <Text style={{ fontSize: 14, fontWeight: "500", color: value ? textColor : subTextColor }}>
            {formatDisplayValue() || placeholder}
          </Text>
        </View>

        {value ? (
          <TouchableOpacity onPress={handleClear} style={{ padding: 4 }}>
            <X size={16} color={subTextColor} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      {error ? <Text style={{ fontSize: 12, fontWeight: "600", color: "#ef4444", marginTop: 4 }}>{error}</Text> : null}

      {/* Picker Modal */}
      {modalVisible ? (
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={StyleSheet.absoluteFillObject}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
              style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.65)" }]}
            />

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View
                style={{
                  width: "100%",
                  maxHeight: "85%",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 20,
                  backgroundColor: cardBg,
                  borderTopWidth: 1,
                  borderColor: borderColor,
                  zIndex: 10,
                }}
              >
                {/* Header */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: borderColor }}>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: textColor }}>
                    {mode === "datetime" ? "Select Date & Time" : "Select Date"}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                    <X size={20} color={subTextColor} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Presets */}
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    {[
                      { label: "Today", days: 0 },
                      { label: "Tomorrow", days: 1 },
                      { label: "Next Week", days: 7 },
                    ].map((preset) => (
                      <TouchableOpacity
                        key={preset.label}
                        onPress={() => setPreset(preset.days)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          backgroundColor: isDarkMode ? "rgba(30, 58, 138, 0.4)" : "#eff6ff",
                          borderWidth: 1,
                          borderColor: isDarkMode ? "#1e40af" : "#bfdbfe",
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "700", color: isDarkMode ? "#60a5fa" : "#2563eb" }}>
                          {preset.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Month Navigator */}
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
                    <TouchableOpacity onPress={prevMonth} style={{ padding: 8, borderRadius: 8, backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" }}>
                      <ChevronLeft size={18} color={textColor} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: "800", color: textColor }}>
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </Text>

                    <TouchableOpacity onPress={nextMonth} style={{ padding: 8, borderRadius: 8, backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" }}>
                      <ChevronRight size={18} color={textColor} />
                    </TouchableOpacity>
                  </View>

                  {/* Days Headers */}
                  <View style={{ flexDirection: "row", paddingVertical: 8 }}>
                    {DAYS_OF_WEEK.map((day) => (
                      <View key={day} style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 12, fontWeight: "700", color: subTextColor }}>
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <View key={`empty-${i}`} style={{ width: "14.28%", aspectRatio: 1, padding: 4 }} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const isSelected = dayNum === selectedDay;

                      return (
                        <TouchableOpacity
                          key={`day-${dayNum}`}
                          onPress={() => setSelectedDay(dayNum)}
                          style={{ width: "14.28%", aspectRatio: 1, padding: 4 }}
                        >
                          <View
                            style={{
                              flex: 1,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 12,
                              backgroundColor: isSelected
                                ? "#2563eb"
                                : isDarkMode
                                ? "rgba(30, 41, 59, 0.5)"
                                : "#f1f5f9",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "800",
                                color: isSelected ? "#ffffff" : textColor,
                              }}
                            >
                              {dayNum}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Time Selector */}
                  {mode === "datetime" ? (
                    <View style={{ paddingTop: 16, marginTop: 16, borderTopWidth: 1, borderTopColor: borderColor }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, color: subTextColor }}>
                        Time Selector
                      </Text>

                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 11, fontWeight: "600", marginBottom: 6, color: subTextColor }}>Hours</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                          {Array.from({ length: 24 }).map((_, h) => (
                            <TouchableOpacity
                              key={`hour-${h}`}
                              onPress={() => setSelectedHour(h)}
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 12,
                                marginRight: 6,
                                borderWidth: 1,
                                backgroundColor: selectedHour === h ? "#2563eb" : isDarkMode ? "#1e293b" : "#f1f5f9",
                                borderColor: selectedHour === h ? "#2563eb" : borderColor,
                              }}
                            >
                              <Text style={{ fontSize: 12, fontWeight: "700", color: selectedHour === h ? "#ffffff" : textColor }}>
                                {String(h).padStart(2, "0")}:00
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      <View>
                        <Text style={{ fontSize: 11, fontWeight: "600", marginBottom: 6, color: subTextColor }}>Minutes</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                          {Array.from({ length: 60 }).map((_, m) => (
                            <TouchableOpacity
                              key={`min-${m}`}
                              onPress={() => setSelectedMinute(m)}
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 12,
                                marginRight: 6,
                                borderWidth: 1,
                                backgroundColor: selectedMinute === m ? "#2563eb" : isDarkMode ? "#1e293b" : "#f1f5f9",
                                borderColor: selectedMinute === m ? "#2563eb" : borderColor,
                              }}
                            >
                              <Text style={{ fontSize: 12, fontWeight: "700", color: selectedMinute === m ? "#ffffff" : textColor }}>
                                :{String(m).padStart(2, "0")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>

                {/* Actions */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: borderColor }}>
                  <TouchableOpacity
                    onPress={handleClear}
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: borderColor }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700", color: subTextColor }}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleApply}
                    style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}
                  >
                    <Check size={16} color="#ffffff" />
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#ffffff" }}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};
