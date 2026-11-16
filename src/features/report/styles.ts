import { StyleSheet } from 'react-native';
import { semantic as c } from '@/styles/colors';
import { typography as t } from '@/styles/typography';
import { gap, padding, radius } from '@/styles/measurement';

export const s = StyleSheet.create({
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
