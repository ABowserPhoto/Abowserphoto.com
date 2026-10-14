"use server";

import {
  sendAdminRegistrationEmail,
  type NewClientRegistrationDetails,
} from "../lib/mail";

export async function notifyAdminOfRegistration(details: NewClientRegistrationDetails) {
  try {
    await sendAdminRegistrationEmail(details);
  } catch (error) {
    console.error("Admin registration email failed:", error);
  }
}
