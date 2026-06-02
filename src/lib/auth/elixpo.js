// Elixpo OAuth 2.0 client — Authorization Code flow.
// Spec: docs/sso_elixpo.md

import { env } from "@/lib/db";

function need(name) {
  const v = env(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function buildAuthorizeUrl({ state, scope = "openid profile email" }) {
  const url = new URL(need("ELIXPO_AUTHORIZE_URL"));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", need("ELIXPO_CLIENT_ID"));
  url.searchParams.set("redirect_uri", need("ELIXPO_REDIRECT_URI"));
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scope);
  return url.toString();
}

export async function exchangeCode(code) {
  const res = await fetch(need("ELIXPO_TOKEN_URL"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: need("ELIXPO_CLIENT_ID"),
      client_secret: need("ELIXPO_CLIENT_SECRET"),
      redirect_uri: need("ELIXPO_REDIRECT_URI"),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Elixpo token exchange failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function refresh(refreshToken) {
  const res = await fetch(need("ELIXPO_TOKEN_URL"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: need("ELIXPO_CLIENT_ID"),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Elixpo refresh failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function fetchUserInfo(accessToken) {
  const res = await fetch(need("ELIXPO_USERINFO_URL"), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Elixpo /me failed: ${res.status} ${body}`);
  }
  return res.json();
}
