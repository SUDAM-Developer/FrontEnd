import { StyleSheet } from 'react-native';
import { semantic as c } from '@/styles/colors';
import { typography as t } from '@/styles/typography';
import { gap, grid, padding, radius } from '@/styles/measurement';

export const s = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center', backgroundColor: c.surface.input },
  phone: { flex: 1, width: '100%', maxWidth: 390 },
  header: { height: 52, justifyContent: 'center', paddingHorizontal: grid.margin },
  title: { ...t.heading[1].semiBold, color: c.text.default.strong },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: grid.margin,
    paddingTop: padding[12],
    paddingBottom: padding[16],
  },
  list: { gap: gap[8] },
  error: {
    padding: padding[24],
    backgroundColor: c.surface.subtle,
    borderRadius: radius.medium,
    gap: gap[16],
  },
  errorText: { ...t.body[4].regular, color: c.text.default.weak },
  card: {
    gap: gap[8],
    padding: padding[16],
    backgroundColor: c.surface.subtle,
    borderRadius: radius.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: gap[8],
  },
  cardInfo: { flex: 1, gap: gap[12] },
  student: { ...t.body[1].bold, color: c.text.default.neutral },
  period: { gap: gap[2] },
  periodText: { ...t.body[5].semiBold, color: c.text.default.neutral },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap[4],
    paddingHorizontal: padding[8],
    paddingVertical: padding[4],
    borderRadius: radius.small,
  },
  statusCreated: { backgroundColor: c.surface.focused },
  statusSent: { backgroundColor: c.surface.success },
  statusIcon: { width: 16, height: 16 },
  statusText: { ...t.caption[1].medium },
  statusTextCreated: { color: c.text.brand.assistive },
  statusTextSent: { color: c.text.feedback.success },
  readInfo: {
    borderTopWidth: 1,
    borderColor: c.border.default,
    paddingTop: padding[8],
  },
  readText: { ...t.caption[1].medium, color: c.text.feedback.success },
});

export const skeleton = StyleSheet.create({
  card: { backgroundColor: c.surface.disabled, borderRadius: radius.medium },
  short: { height: 56 },
  tall: { height: 138 },
});
