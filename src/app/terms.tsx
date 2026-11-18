import TermsScreen from '@/features/terms/TermsScreen';
import { saveTerms } from '@/apis/users';
export default function Screen() {
  return <TermsScreen onSave={saveTerms} />;
}
