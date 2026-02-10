<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework
  for building efficient and scalable server-side applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
</p>

---

## Description

This project is built using the **NestJS framework** and is focused on developing
a **Doctor–Patient Appointment Booking System**.

Along with backend development, this repository also documents **user experience
flows** to ensure the system is designed from a real user’s perspective.

---

## Doctor & Patient Experience Flow

This section is created as part of today’s task to **design and understand the
complete experience flow for both Patients and Doctors**, focusing beyond APIs
and backend implementation.

The goal is to clearly map how users interact with the system step by step,
from onboarding to re-engagement.

---

### Patient Experience Flow

1. Patient opens the application.
2. Patient signs up or logs in using Email, Phone, or Google.
3. System verifies the patient via OTP or email.
4. Patient selects the role as **Patient**.
5. Patient completes the onboarding walkthrough.
6. Patient searches for doctors by specialization, rating, or availability.
7. Patient views the selected doctor’s profile.
8. Patient selects an available time slot.
9. Patient confirms the appointment.
10. System sends an appointment confirmation notification.
11. Patient can view upcoming appointments.
12. Patient can cancel or reschedule an appointment.
13. Patient receives reminders and follow-up notifications.

---

### Doctor Experience Flow

1. Doctor opens the application.
2. Doctor signs up using professional credentials.
3. Doctor submits details for verification.
4. System verifies and approves the doctor account.
5. Doctor sets up profile with specialization and experience.
6. Doctor sets consultation hours and availability.
7. Doctor creates and manages time slots.
8. Doctor views scheduled appointments.
9. Doctor can cancel an appointment if required.
10. System notifies the patient about appointment cancellation.
11. Doctor receives notifications when a patient reschedules or cancels.
12. Doctor can view slot utilization and appointment summary.

---

### ER Diagram (Conceptual)

![ER Diagram](schedula-backend\docs\erd\doctor_patient_experience_er.png)
