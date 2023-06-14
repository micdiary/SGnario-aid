// TOKEN
export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

// USER ID
export function getUserID() {
  return localStorage.getItem("userID");
}

export function setUserID(userID) {
  localStorage.setItem("userID", userID);
}

export function removeUserID() {
  localStorage.removeItem("userID");
}

// USER TYPE
export function getUserType(){
  return localStorage.getItem("userType");
}

export function setUserType(userType){
  localStorage.setItem("userType", userType);
}

export function removeUserType() {
  localStorage.removeItem("userType");
}