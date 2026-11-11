import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { TextInput } from '@/components/TextInput';
import { s } from './styles';
import type { Textbook } from './types';
const units = ['Unit', '단원', '페이지', '회', '직접'] as const;
type Props = {
  number: number;
  disabled: boolean;
  onRegister: (book: Omit<Textbook, 'id'>) => void;
  onCancel: () => void;
};
export function BookEditor({ number, disabled, onRegister, onCancel }: Props) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<string>('');
  const [customUnit, setCustomUnit] = useState('');
  const [start, setStart] = useState('');
  const [error, setError] = useState(false);
  const unitName = unit === '직접' ? customUnit.trim() : unit;
  function register() {
    if (disabled) return;
    if (!name.trim() || !unitName) {
      setError(true);
      return;
    }
    onRegister({
      name: name.trim(),
      unit: unitName,
      previousProgress: start.trim() || undefined,
      suggestions: [],
    });
  }
  return (
    <View style={s.editor}>
      <View style={s.editorHeader}>
        <Text style={s.bookName}>교재 {number}</Text>
        <View style={s.editorActions}>
          <Pressable
            role="button"
            accessibilityLabel="교재 추가 취소"
            disabled={disabled}
            onPress={onCancel}
          >
            <Text style={s.previous}>취소</Text>
          </Pressable>
          <Pressable
            role="button"
            accessibilityLabel="교재 등록하기"
            disabled={disabled}
            onPress={register}
          >
            <Text style={s.link}>등록하기</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.editorBody}>
        <View>
          <Text style={s.label}>교재명*</Text>
          <TextInput
            accessibilityLabel="교재명"
            value={name}
            onChangeText={setName}
            editable={!disabled}
            maxLength={80}
            placeholder="텍스트를 입력해주세요"
          />
        </View>
        <View>
          <Text style={s.label}>진도 단위</Text>
          <View style={s.chips}>
            {units.map((v) => (
              <Chip
                key={v}
                label={v}
                selected={unit === v}
                disabled={disabled}
                onPress={() => setUnit(v)}
              />
            ))}
          </View>
          <View style={{ height: 8 }} />
          <TextInput
            accessibilityLabel="진도 단위 직접 입력"
            value={unit === '직접' ? customUnit : unit}
            onChangeText={(v) => {
              setUnit('직접');
              setCustomUnit(v);
            }}
            editable={!disabled}
            maxLength={20}
            placeholder="텍스트를 입력해주세요"
          />
        </View>
        <View>
          <Text style={s.label}>시작 진도(선택)</Text>
          <TextInput
            accessibilityLabel="시작 진도"
            value={start}
            onChangeText={setStart}
            editable={!disabled}
            maxLength={60}
            placeholder="텍스트를 입력해주세요"
          />
        </View>
        {error && (
          <Text role="alert" style={s.warning}>
            교재명과 진도 단위를 입력해 주세요.
          </Text>
        )}
      </View>
    </View>
  );
}
