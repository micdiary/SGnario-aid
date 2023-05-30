export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  return localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setUserID(userID) {
  localStorage.setItem("userID", userID);
}

export function removeUserID() {
  return localStorage.removeItem("userID");
}

export function getUserID() {
  return localStorage.getItem("userID");
}
