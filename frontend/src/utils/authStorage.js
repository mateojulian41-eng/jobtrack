export function getStoredToken() {
  return (
    localStorage.getItem("jobtrack_token") ||
    sessionStorage.getItem("jobtrack_token")
  );
}

export function clearSession() {
  localStorage.removeItem("jobtrack_token");
  localStorage.removeItem("jobtrack_user");
  sessionStorage.removeItem("jobtrack_token");
  sessionStorage.removeItem("jobtrack_user");
}

export function saveSession(token, user, remember = true) {
  clearSession();

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("jobtrack_token", token);
  storage.setItem("jobtrack_user", JSON.stringify(user));
}
