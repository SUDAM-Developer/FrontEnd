import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { normalizeDate, timeLabel, times } from './dateTime';
import { s } from './styles';
export function CalendarPicker({
  value,
  fallback,
  onChange,
  onCancel,
}: {
  value: string;
  fallback: string;
  onChange: (date: string) => void;
  onCancel: () => void;
}) {
  const initial = (normalizeDate(value) ?? normalizeDate(fallback) ?? '2026-01-01')
    .split('-')
    .map(Number);
  const [month, setMonth] = useState({ year: initial[0], month: initial[1] });
  const start = new Date(Date.UTC(month.year, month.month - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate();
  function move(delta: number) {
    const d = new Date(Date.UTC(month.year, month.month - 1 + delta, 1));
    if (d.getUTCFullYear() < 1900 || d.getUTCFullYear() > 2100) return;
    setMonth({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
  }
  return (
    <>
      <Text role="heading" style={s.heading}>
        보강 날짜 선택
      </Text>
      <View style={s.monthHeader}>
        <Pressable
          role="button"
          accessibilityLabel="이전 달"
          onPress={() => move(-1)}
          style={s.monthButton}
        >
          <Text style={s.monthArrow}>‹</Text>
        </Pressable>
        <Text style={s.monthText}>
          {month.year}년 {month.month}월
        </Text>
        <Pressable
          role="button"
          accessibilityLabel="다음 달"
          onPress={() => move(1)}
          style={s.monthButton}
        >
          <Text style={s.monthArrow}>›</Text>
        </Pressable>
      </View>
      <View style={s.week}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <View key={day} style={s.day}>
            <Text style={s.weekText}>{day}</Text>
          </View>
        ))}
      </View>
      {Array.from({ length: Math.ceil((start + count) / 7) }, (_, row) => (
        <View key={row} style={s.week}>
          {Array.from({ length: 7 }, (_, col) => {
            const day = row * 7 + col - start + 1;
            const date = `${month.year}-${String(month.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return day < 1 || day > count ? (
              <View key={col} style={s.day} />
            ) : (
              <Pressable
                key={col}
                role="button"
                accessibilityLabel={`${month.year}년 ${month.month}월 ${day}일`}
                accessibilityState={{ selected: normalizeDate(value) === date }}
                onPress={() => onChange(date)}
                style={[s.day, normalizeDate(value) === date && s.selectedDay]}
              >
                <Text style={[s.dayText, normalizeDate(value) === date && s.selectedDayText]}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={s.actions}>
        <ActionButton label="날짜 선택 취소" variant="secondary" onPress={onCancel} />
      </View>
    </>
  );
}
export function TimePicker({
  value,
  onChange,
  onCancel,
}: {
  value: string;
  onChange: (time: string) => void;
  onCancel: () => void;
}) {
  return (
    <>
      <Text role="heading" style={s.heading}>
        시간 선택
      </Text>
      <ScrollView style={s.timeList} keyboardShouldPersistTaps="handled">
        {times.map((time) => (
          <Pressable
            key={time}
            role="button"
            accessibilityLabel={timeLabel(time)}
            accessibilityState={{ selected: value === time }}
            onPress={() => onChange(time)}
            style={[s.timeOption, value === time && s.selectedTime]}
          >
            <Text style={s.timeOptionText}>{timeLabel(time)}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.actions}>
        <ActionButton label="시간 선택 취소" variant="secondary" onPress={onCancel} />
      </View>
    </>
  );
}
