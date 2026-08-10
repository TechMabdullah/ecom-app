import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { signInWithCustomToken } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Creates a user record in Firestore alongside the Firebase Auth account
async function createUserDoc(uid: string, name: string, email: string) {
  await setDoc(doc(db, "users", uid), {
    name,
    email,
    createdAt: serverTimestamp(),
  });
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await createUserDoc(result.user.uid, name, email);
  return result.user;
}

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  // Save/update user doc in case this is their first time
  await createUserDoc(result.user.uid, result.user.displayName || "", result.user.email || "");
  return result.user;
}

export async function loginWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  await createUserDoc(result.user.uid, result.user.displayName || "", result.user.email || "");
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

const actionCodeSettings = {
  // This is the page the user lands on after clicking the email link
  url: typeof window !== "undefined" ? `${window.location.origin}/finish-signin` : "",
  handleCodeInApp: true,
};

export async function sendMagicLink(email: string) {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // Save email locally so we can auto-fill it when they click the link
  // (needed in case they open the link on the same device/browser)
  window.localStorage.setItem("emailForSignIn", email);
}

export function isMagicLink(url: string) {
  return isSignInWithEmailLink(auth, url);
}

export async function completeMagicLinkSignIn(url: string, emailFromPrompt?: string) {
  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    // Happens if they opened the link on a different device/browser
    email = emailFromPrompt || "";
  }
  const result = await signInWithEmailLink(auth, email, url);
  window.localStorage.removeItem("emailForSignIn");
  await createUserDoc(result.user.uid, result.user.displayName || "", result.user.email || "");
  return result.user;
}

export async function signInWithToken(token: string) {
  const result = await signInWithCustomToken(auth, token);
  await createUserDoc(result.user.uid, result.user.displayName || "", result.user.email || "");
  return result.user;
}