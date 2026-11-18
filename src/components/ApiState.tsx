import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from './ActionButton';
export function ApiState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={s.container}>
      <Text role={message ? 'alert' : 'status'}>{message ?? '불러오는 중이에요'}</Text>
      {onRetry && <ActionButton label="다시 시도" onPress={onRetry} />}
      {message && (
        <ActionButton
          label="로그인 화면으로"
          variant="secondary"
          onPress={() => router.replace('/login')}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', backgroundColor: '#fff' },
});
