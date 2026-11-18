/** Swagger의 서버 응답 모델. 화면 모델로 변환한 뒤 사용합니다. */
export type ApiPeriod = { startDate: string; endDate: string };

export type ApiUnderstanding = { high: number; medium: number; low: number };

export type ApiStats = {
  completedCount: number;
  targetCount: number;
  canceledCount: number;
  homeworkRate: number | null;
  prevHomeworkRate: number | null;
  understanding: ApiUnderstanding;
};

export type ApiProgress = {
  textbookName: string;
  startLabel: string;
  endLabel: string;
  textbookStatus: 'ACTIVE' | 'ADDED' | 'ENDED';
};

export type ApiParentResponse = { participantId: number; label: 'MOTHER' | 'FATHER' | 'GUARDIAN' };

export type ApiReportResponse = {
  reportId: number;
  status: 'GENERATED' | 'SCHEDULED' | 'SENT' | 'FAILED';
  studentName: string;
  period: ApiPeriod;
  stats: ApiStats;
  progress: ApiProgress[];
  understandingLevel: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  parents: ApiParentResponse[];
};

export type ApiReportInvoiceResponse = {
  invoiceId: number;
  paymentTiming: 'PREPAID' | 'POSTPAID';
  settlementSessionCnt: number;
  billedCycleStartDate: string | null;
  unitPrice: number;
  canceledCount: number;
  deductionAmount: number;
  calculatedAmount: number;
  amount: number;
  recognizedCount: number | null;
  bankCode: string | null;
  bankName: string;
  accountLast4: string;
  accountHolder: string;
};

export type ApiSoftenedSentence = { original: string; softened: string };

export type ApiReportCommentResponse = {
  comment: string;
  commentSource: 'AI_DRAFT' | 'AI_EDITED' | 'TEACHER';
  reviewed: boolean;
  aiStatus: 'PENDING' | 'DONE' | 'FAILED';
  softenedSentences: ApiSoftenedSentence[];
};

export type ApiSummary = { totalAmount: number; paidAmount: number; unpaidAmount: number };

export type ApiStatusLine = {
  type: 'PARENT_CONFIRMED' | 'PARTIAL_PAID' | 'RESENT' | 'REMINDER_SCHEDULED' | 'NOT_SENT' | 'NONE';
  at: string;
};

export type ApiInvoiceItemResponse = {
  invoiceId: number;
  tutoringId: number;
  studentName: string;
  invoiceName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  previousUnpaidAmount: number;
  status: 'PENDING' | 'CONFIRM_REQUESTED' | 'PARTIAL' | 'PAID' | 'CANCELED';
  statusLine: ApiStatusLine;
  reportId: number;
  notifiedAt: string;
  createdAt: string;
  parents: ApiParentResponse[];
};

export type ApiInvoiceListResponse = {
  confirmRequestedCount: number;
  unpaidCount: number;
  summary: ApiSummary;
  items: ApiInvoiceItemResponse[];
};

export type ApiPaymentConfirmResponse = {
  paymentId: number;
  appliedAmount: number;
  item: ApiInvoiceItemResponse;
};

export type ApiReportSendResponse = {
  reportId: number;
  status: 'GENERATED' | 'SCHEDULED' | 'SENT' | 'FAILED';
  sentAt: string;
};

export type ApiSubjectItem = {
  code: 'ENGLISH' | 'MATH' | 'KOREAN' | 'SCIENCE' | 'SOCIAL' | 'OTHER';
  name: string;
};

export type ApiProfile = { name: string; subjects: ApiSubjectItem[] };

export type ApiAccount = { provider: 'KAKAO' };

export type ApiIntro = { status: string; unlockedAt: string };

export type ApiCurriculumPass = {
  availableCount: number;
  nearestExpiresAt: string;
  hasPendingRequest: boolean;
};

export type ApiSubscription = { status: string; nextBillingOn: string; hasPendingRequest: boolean };

export type ApiNotification = { sentCount: number; pushEnabled: boolean };

export type ApiSettingsResponse = {
  profile: ApiProfile;
  account: ApiAccount;
  intro: ApiIntro;
  curriculumPass: ApiCurriculumPass;
  subscription: ApiSubscription;
  notification: ApiNotification;
};

export type ApiShareResponse = {
  shareId: number;
  url: string;
  title: string;
  description: string;
  buttonTitle: string;
};

/** BackEnd dev의 ReportDeliveryListResponse.Item에서 확인한 목록 응답입니다. */
export type ApiReportDeliveryItem = {
  reportId: number;
  tutoringId: number;
  studentName: string;
  settlementMonth: string;
  status: ApiReportResponse['status'];
  sentAt: string | null;
  viewedAt: string | null;
  createdAt: string;
};
