export interface LoginRequest {
  phoneNumber: string
  smsCode: string
}

export interface LoginResponse {
  accessToken: string
  hasPassword: boolean
}

export async function LoginBySms(request: LoginRequest): Promise<LoginResponse | null> {
  console.log(request)
  const { accessToken, hasPassword } = await Promise.resolve({ accessToken: 'mock', hasPassword: true })
  return accessToken
    ? {
        accessToken,
        hasPassword,
      }
    : null
}
