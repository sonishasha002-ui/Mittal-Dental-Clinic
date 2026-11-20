# Security Specification — Mittal Dental Clinic Firestore Rules

## 1. Data Invariants
1. Public visitors can ONLY read non-PII clinic showcase data (`clinic_info`, `doctor_profile`, `branches`, `gallery`) and submit new appointment requests (`appointments` create) with `status == "pending_clinic_confirmation"`.
2. Public visitors can NEVER read, list, update, or delete `appointments` (strict PII isolation for patient names and mobile numbers).
3. Public visitors can NEVER upload, edit, or delete `clinic_info`, `doctor_profile`, `branches`, `gallery`, or `admins`.
4. Only verified clinic administrators (`request.auth != null && request.auth.token.email_verified == true && (request.auth.token.email == 'sonishasha002@gmail.com' || exists(/databases/$(database)/documents/admins/$(request.auth.uid)))`) can access the Admin Dashboard operations.
5. All document timestamps (`createdAt`, `updatedAt`) are enforced server-side via `request.time`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Appointment Read**: `GET /appointments` or `LIST /appointments` when `request.auth == null`.
2. **Non-Admin Signed-In Appointment Read**: `LIST /appointments` as a random verified Google user not in `/admins` and not `sonishasha002@gmail.com`.
3. **Appointment Status Spoofing on Create**: `CREATE /appointments/{id}` with `"status": "confirmed"` instead of `"pending_clinic_confirmation"`.
4. **Shadow Field Injection on Create**: `CREATE /appointments/{id}` including `"adminNotes": "bypass"` or `"isAdmin": true`.
5. **Backdated Timestamp on Create**: `CREATE /appointments/{id}` with a client-forged `createdAt` not equal to `request.time`.
6. **Public Gallery Upload**: `CREATE /gallery/{id}` when `request.auth == null` or non-admin user.
7. **Public Gallery Delete**: `DELETE /gallery/{id}` by a public visitor or non-admin user.
8. **Public Branch Hours Tampering**: `UPDATE /branches/civil-lines` by a non-admin user.
9. **Public Doctor Profile Tampering**: `UPDATE /doctor_profile/main` by a non-admin user.
10. **Self-Admin Privilege Escalation**: `CREATE /admins/{uid}` by an arbitrary signed-in user trying to grant themselves `role: "admin"`.
11. **Oversized Document / ID Poisoning**: `CREATE /gallery/{1500-char-invalid-id}` or `imageDataUrl` exceeding 450,000 characters.
12. **Unverified Email Spoof**: Signed-in token with `email == "sonishasha002@gmail.com"` where `email_verified == false`.
