// Company accounts use the web dashboard, not an app — the auth pages
// send them back there, keyed by the link's `project` param. Mirrors the
// origins in the cloud functions' companyPayments.js.
export const COMPANY_DASHBOARD_URL: Record<string, string> = {
  "myoga-dev": "https://myoga-dev-company-admin.web.app",
  "myoga-80daa": "https://company-admin.myoga.com.ng",
};
