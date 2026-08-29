import React from "react";
import { display, getErrorMessage, safeArray } from "../utils/auditlog.utils";

const PP = "Poppins, sans-serif";

interface ActiveSession {
  sessionId: string;
  user?: { fullName?: string; userId?: string; role?: string };
  loginTime?: string;
  lastActivityTime?: string;
  device?: string;
  status?: string;
}

interface FailedAttempt {
  eventId?: string;
  userName?: string;
  userId?: string;
  failureReason?: string;
  attemptCount?: number;
  timestamp?: string;
}

interface LockedAccount {
  userId?: string;
  fullName?: string;
  email?: string;
  lockedAt?: string;
  failedAttemptCount?: number;
  reason?: string;
}

interface LoginSupplementaryDataProps {
  activeSessions: ActiveSession[];
  failedAttempts: FailedAttempt[];
  lockedAccounts: LockedAccount[];
  loading: boolean;
  error: unknown;
}

export function LoginSupplementaryData({
  activeSessions,
  failedAttempts,
  lockedAccounts,
  loading,
  error,
}: LoginSupplementaryDataProps) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <h2
          className="text-base font-bold text-gray-900"
          style={{ fontFamily: PP }}
        >
          Login Security Data
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Active sessions, failed attempts, and locked accounts from the
          login-history endpoints.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading login security data…</p>
      ) : error ? (
        <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LoginDataPanel title="Active Sessions" count={activeSessions.length}>
            {activeSessions.map((session) => (
              <div
                key={session.sessionId}
                className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-gray-900">
                  {session.user?.fullName || session.user?.userId || "—"}
                </p>
                <p className="text-gray-500">
                  {display(session.device)} · {display(session.status)}
                </p>
                <p className="font-mono text-[10px] text-gray-400">
                  {display(session.loginTime)}
                </p>
              </div>
            ))}
          </LoginDataPanel>
          <LoginDataPanel title="Failed Attempts" count={failedAttempts.length}>
            {failedAttempts.map((attempt) => (
              <div
                key={attempt.eventId}
                className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-gray-900">
                  {attempt.userName || attempt.userId || "—"}
                </p>
                <p className="text-gray-500">
                  {display(attempt.failureReason)} ·{" "}
                  {display(attempt.attemptCount)} attempts
                </p>
                <p className="font-mono text-[10px] text-gray-400">
                  {display(attempt.timestamp)}
                </p>
              </div>
            ))}
          </LoginDataPanel>
          <LoginDataPanel title="Locked Accounts" count={lockedAccounts.length}>
            {lockedAccounts.map((account) => (
              <div
                key={account.userId}
                className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <p className="font-semibold text-gray-900">
                  {account.fullName || account.userId || "—"}
                </p>
                <p className="text-gray-500">
                  {display(account.reason)} ·{" "}
                  {display(account.failedAttemptCount)} attempts
                </p>
                <p className="font-mono text-[10px] text-gray-400">
                  {display(account.lockedAt)}
                </p>
              </div>
            ))}
          </LoginDataPanel>
        </div>
      )}
    </section>
  );
}

function LoginDataPanel({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 space-y-3 text-xs">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <span className="font-mono text-gray-500">{count}</span>
      </div>
      {count ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <p className="text-gray-500">No records returned.</p>
      )}
    </div>
  );
}
