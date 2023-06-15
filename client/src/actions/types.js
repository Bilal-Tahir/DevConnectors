export const SET_ALERT = 'SET_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
// Register Types
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
// Login Types
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOG_OUT = 'LOG_OUT';
// Profile Types
export const GET_PROFILE = 'GET_PROFILE';
export const PROFILE_ERROR = 'PROFILE_ERROR';
// Let's say when we login with a user that has a profile and
// logout and then login again with another user that has no profile
// We still have previous user profile in state
// So we want to clear profile on logout
export const CLEAR_PROFILE = 'CLEAR_PROFILE';
// Add and Update Profile for experience and education
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
