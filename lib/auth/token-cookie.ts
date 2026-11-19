const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function setTokenCookie(name: string, token: string) {
  document.cookie = `${name}=${token}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function removeTokenCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
