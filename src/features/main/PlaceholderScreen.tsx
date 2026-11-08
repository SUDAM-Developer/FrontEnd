import { StyleSheet, Text, View } from 'react-native';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={s.page}>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      <Text style={s.body}>화면 준비 중입니다.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { color: '#343845', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  body: { color: '#7c8391', fontSize: 14 },
});
