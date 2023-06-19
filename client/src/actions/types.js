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
export const GET_PROFILES = 'GET_PROFILES';
export const GET_REPOS = 'GET_REPOS';
export const PROFILE_ERROR = 'PROFILE_ERROR';
// Let's say when we login with a user that has a profile and
// logout and then login again with another user that has no profile
// We still have previous user profile in state
// So we want to clear profile on logout
export const CLEAR_PROFILE = 'CLEAR_PROFILE';
// Add and Update Profile for experience and education
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const ACCOUNT_DELETED = 'ACCOUNT_DELETED';
// Posts Types
export const GET_POSTS = 'GET_POSTS';
export const POST_ERROR = 'POST_ERROR';
export const UPDATE_LIKES = 'UPDATE_LIKES';
export const DELETE_POSTS = 'DELETE_POSTS';
export const ADD_POSTS = 'ADD_POSTS';
export const GET_POST = 'GET_POST';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
