"use server";

import { createClient } from "../lib/supabase/server";

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  companyName: string;
  companyAddress: string;
  phoneNumber: string;
};

export type UpdateProfileResult = {
  success: boolean;
  message: string;
};

export async function updateProfile(data: ProfileFormData): Promise<UpdateProfileResult> {
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const companyName = data.companyName.trim();
  const companyAddress = data.companyAddress.trim();
  const phoneNumber = data.phoneNumber.trim();
  const fullName = `${firstName} ${lastName}`.trim();

  if (!firstName || !lastName || !companyName || !companyAddress || !phoneNumber) {
    return { success: false, message: "Please complete all required profile fields." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, message: "Please sign in to update your profile." };
  }

  const userId = userData.user.id;
  const email = userData.user.email ?? "";

  const { data: existing, error: lookupError } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (lookupError) {
    console.error("Client profile lookup failed:", lookupError);
    throw new Error(lookupError.message);
  }

  const payload = {
    user_id: userId,
    first_name: firstName,
    last_name: lastName,
    company_name: companyName,
    company_address: companyAddress,
    phone_number: phoneNumber,
    email: email || null,
    contact_name: fullName,
    contact_first_name: firstName,
    contact_last_name: lastName,
    billing_address: companyAddress,
    phone: phoneNumber,
  };

  if (existing) {
    const { error: updateError } = await supabase.from("clients").update(payload).eq("id", existing.id);
    if (updateError) {
      console.error("Client profile update failed:", updateError);
      throw new Error(updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("clients").insert({ ...payload, is_approved: false });
    if (insertError) {
      console.error("Client profile insert failed:", insertError);
      throw new Error(insertError.message);
    }
  }

  const { error: profileError } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
  if (profileError) {
    console.error("Profile name update failed:", profileError);
    throw new Error(profileError.message);
  }

  return { success: true, message: "Profile updated successfully." };
}
