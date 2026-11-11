import { useState } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { MakeupSheet } from './MakeupSheet';
import { createPreviewActions } from './previewActions';
import { s } from './styles';
export function MakeupPreview() {
  const params = useLocalSearchParams<{
    step?: string;
    count?: string;
    scenario?: string;
    consent?: string;
  }>();
  const [visible, setVisible] = useState(true);
  const [actions] = useState(() => createPreviewActions(params.scenario));
  if (!__DEV__) return <Redirect href="/home" />;
  const count = Math.min(3, Math.max(1, Number(params.count) || 1));
  return (
    <SafeAreaView style={s.preview}>
      <View style={s.previewButton}>
        <ActionButton label="휴강·보강 조율 열기" onPress={() => setVisible(true)} />
      </View>
      {visible && (
        <MakeupSheet
          lesson={{
            id: 'preview-makeup-lesson',
            studentName: '윤서아',
            dateLabel: '10월 21일 (화)',
            date: '2026-10-21',
            time: '20:00',
            parentConsented: params.consent !== 'no',
            alreadyCancelled: params.step === 'candidates',
          }}
          actions={actions}
          initialStep={params.step === 'candidates' ? 'candidates' : 'action'}
          initialCandidates={
            params.count
              ? Array.from({ length: count }, (_, i) => ({
                  id: `candidate-${i + 1}`,
                  date: `2026.10.${22 + i}`,
                  time: '20:00',
                }))
              : undefined
          }
          onClose={() => setVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}
