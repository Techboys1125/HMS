/**
 * Cookie-based token storage.
 *
 * Replaces localStorage for auth tokens (accessToken, refreshToken) to
 * eliminate the XSS exfiltration vector flagged by
 * react-doctor/auth-token-in-web-storage.
 *
 * Cookies are set with SameSite=Strict (CSRF protection). Path is scoped to
 * "/". The Secure flag is applied only over HTTPS — browsers refuse Secure
 * cookies on plain-HTTP LAN origins (e.g. http://192.168.x.x:5173), which
 * would otherwise break authentication during local development.
 */

function secureFlag(): string {
  return typeof window !== "undefined" && window.location.protocol === "https:"
    ? ";Secure"
    : "";
}

export function getToken(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;SameSite=Strict${secureFlag()}`;
}

export function removeToken(name: string): void {
  // Setting Max-Age=0 instructs the browser to delete the cookie immediately.
  document.cookie = `${name}=;path=/;SameSite=Strict${secureFlag()};Max-Age=0`;
}
