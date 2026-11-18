import { API_URL } from '@/config/api';

/** 서버 공통 응답 형식 */
type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 액세스 토큰은 메모리에만 둡니다. 리프레시 토큰은 서버가 HttpOnly 쿠키로 관리하므로
 * 새로고침 뒤에는 `reissueAccessToken`으로 다시 받습니다.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function hasAccessToken() {
  return accessToken !== null;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  /** false면 Authorization 헤더를 붙이지 않고, 401이어도 토큰을 재발급하지 않습니다. */
  auth?: boolean;
};

async function send<T>(path: string, options: RequestOptions): Promise<T> {
  const { method = 'GET', body, signal, auth = true } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    // 리프레시 토큰 쿠키를 주고받습니다.
    credentials: 'include',
  });

  if (response.status === 204 && response.ok) return undefined as T;
  let json: ApiResponse<T> | null = null;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    // 본문이 JSON이 아니면 아래에서 상태 코드로 처리합니다.
  }
  if (!response.ok || !json?.isSuccess) {
    throw new ApiError(
      response.status,
      json?.code ?? `HTTP${response.status}`,
      json?.message ?? '요청을 처리하지 못했어요.',
    );
  }
  return json.result;
}

let reissuing: Promise<string> | null = null;

/** 리프레시 토큰 쿠키로 액세스 토큰을 다시 받습니다. 동시에 여러 번 불려도 요청은 한 번만 보냅니다. */
export function reissueAccessToken(): Promise<string> {
  reissuing ??= send<{ accessToken: string }>('/api/v1/auth/reissue', {
    method: 'POST',
    auth: false,
  })
    .then(({ accessToken: token }) => {
      setAccessToken(token);
      return token;
    })
    .catch((error: unknown) => {
      setAccessToken(null);
      throw error;
    })
    .finally(() => {
      reissuing = null;
    });
  return reissuing;
}

/** 인증이 필요한 요청은 401이면 토큰을 한 번 재발급한 뒤 다시 보냅니다. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await send<T>(path, options);
  } catch (error) {
    if (options.auth === false || !(error instanceof ApiError) || error.status !== 401) throw error;
    if (options.signal?.aborted) throw error;
    await reissueAccessToken();
    if (options.signal?.aborted) throw error;
    return send<T>(path, options);
  }
}
