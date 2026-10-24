# FurLink Platform Documentation & Technical Manual
**No-Kill Animal Rescue, Adoption Registry & Clinical Sanctuary System**

---

## 1. Executive Summary & Architecture

FurLink is a production-grade web application built for an animal welfare organization and sanctuary alliance based in Belagavi, Karnataka. The system was designed from the ground up under two governing design and engineering principles:

1. **Strict Conversion Focus**: Every visitor interaction, typography scale, and call-to-action directly drives one of two primary human actions: **ADOPT** or **DONATE**.
2. **Editorial Case File Concept**: *"Every animal has a name before a number."* Animals are treated not as commercial inventory in a catalogue grid, but as individual living beings with unique medical histories, temperament quirks, and verified waiting days.

```mermaid
graph TD
    User["Public Visitor / Rescuer"]
    Admin["Shelter Administrator"]
    Verifier["Clinical Verifier"]

    subgraph Core Platform
        Web["Next.js 16 App Router (Turbopack)"]
        Auth["Hybrid Clerk + Local SQLite Auth"]
        DB[(Prisma ORM + SQLite dev.db)]
    end

    subgraph Operational Flows
        Adopt["Adoption Dossiers & Caregiver Outreach"]
        Rescue["Emergency Dispatch & GPS Incident Intake"]
        Sterile["Humane TNVR Sterilization & Audit Queue"]
        Donate["Clinical Fund & Tangible Impact Engine"]
        Stories["Recovery Documentaries (FurStories)"]
    end

    User --> Web
    Admin --> Web
    Verifier --> Web
    Web --> Auth
    Auth --> DB
    Web --> Adopt
    Web --> Rescue
    Web --> Sterile
    Web --> Donate
    Web --> Stories
```

### Visual Identity System
* **Background Palette**: Blush ground (`#f3c9d5`), ink print copy (`#1A2540`), terracotta accent (`#cc2b3f`), warm cream paper backing (`#f2e9db`).
* **Typography Hierarchy**: League Spartan (800 / 900 heavy uppercase) for display headlines; Poppins (400 / 500 / 600) for editorial narrative body text; Martian Mono for docket reference numbers, case IDs, and waiting day counters.
* **Material System**: Visual elements are modeled after print-shop material states: kiss-cut borders, dashed die-cut lines, folded corner flaps, and sealed verification stamps.
* **Offline Self-Sufficiency**: Powered entirely by an embedded SQLite engine with zero third-party database network dependencies.

---

## 2. Public Platform Experience & User Flows

### 2.1 Editorial Home Interface & Hero Ledger
The home page immediately establishes emotional connection without sentimental fluff. It presents verified waiting counters, recovery meals sponsored, and the Verified Adopter Family Registry.

![FurLink Sanctuary Home Interface](./screenshots/ss_home.png)

#### Key Capabilities:
* **Permanent Live Counter**: Calculates real elapsed days since sanctuary intake.
* **Proof Exhibit**: Features real alumni profiles and registered adoptive homes.
* **Clean Public Navigation**: Features five clear links (*Adoptions*, *Medical Fund*, *Emergency Dispatch*, *Recovery Stories*, *ABC / TNVR*) with a mobile slide drawer.

---

### 2.2 The Waiting Wall & Adoption Catalog
Located at `/adoptions`, the Waiting Wall organizes animals awaiting adoption by urgent medical need and wait duration.

![FurLink Waiting Wall Adoption Catalog](./screenshots/ss_adoptions.png)

#### Filtering & Organization:
* **Status Tabs**:
  * *Currently Waiting*: Active residents seeking forever homes.
  * *Application In Review*: Animals with pending applicant screenings.
  * *Homes Found*: Completed adoption alumni.
* **Species Filter Chips**: One-click toggling between Canine, Feline, and Community animals.
* **Case Reference Tags**: Each card displays age, gender, medical protocol completion, and days elapsed.

---

### 2.3 Individual Case Dossier & Caregiver Coordination Flow
Located at `/adoptions/[id]`, each animal features an individualized documentary profile detailing clinical interventions, behavior, and physical location.

![Individual Case Dossier and Caregiver Docket](./screenshots/ss_pet_detail.png)

```mermaid
sequenceDiagram
    autonumber
    actor Applicant as Adopter
    participant App as FurLink Pet Dossier (/adoptions/[id])
    participant Guardian as Shelter Caregiver
    participant AdminPortal as Coordinator Portal (/admin/adoptions)

    Applicant->>App: Review medical history & caregiver facility
    Applicant->>App: Fill home intake form (select Preferred Call Window)
    App->>App: Generate unique Reference Docket (APP-XXXXXX)
    App-->>Applicant: Present Immediate Direct Connect Center
    par Immediate Outreach
        Applicant->>Guardian: Direct phone call (tel:...) or WhatsApp inquiry
    and Scheduled Outreach
        App->>AdminPortal: Post application with highlighted Call Window
        AdminPortal->>Guardian: Review housing & care experience
        Guardian->>Applicant: Call applicant during designated availability window
    end
```

#### Feature Breakdown:
1. **Direct Caregiver & Location Docket**:
   * Lists the exact sanctuary station (e.g. *Tilakwadi Sanctuary Station, Belagavi*) and visiting hours.
   * Instant **"Call Guardian"** button (`tel:...`) connects straight to the caregiver in charge.
   * Instant **"WhatsApp Inquiries"** action pre-fills a detailed inquiry referencing the pet's case ID.
2. **Medical Protocol Checklist**: Displays TNVR certification status, 7-in-1 multi-spectrum vaccination, and anti-rabies immunizations.
3. **Application Intake Questionnaire**:
   * Collects applicant contact, street address, housing type, and pet experience.
   * **Preferred Call Window**: Allows applicants to designate *Morning (9 AM - 12 PM)*, *Afternoon (12 PM - 4 PM)*, *Evening (4 PM - 8 PM)*, or *Anytime*.
4. **Immediate Direct Connect Center**:
   * Appears immediately upon submission.
   * Gives applicants their reference docket code (e.g. `APP-A3B91C`).
   * Outlines the next three steps: document check, 15-minute phone interview during selected window, and shelter meet-and-greet visit.

---

### 2.4 Applicant Profile & Application Docket Tracking
Located at `/profile`, logged-in applicants can track all their interactions in one unified dossier:

* **Adoption Dossiers Section**: Displays each submitted application, current status (`PENDING`, `APPROVED`, `REJECTED`), the applicant's chosen call window, direct guardian phone number, facility address, and instant call/WhatsApp buttons.
* **Field Rescue Incident Reports**: Tracks reports filed by the user and current ambulance dispatch status.
* **TNVR Requests**: Shows street sterilization cases registered by the user.
* **Clinical Donations**: Provides transaction receipts and audit references.

---

### 2.5 Clinical Emergency Fund & Direct Impact Allocation Engine
Located at `/donate`, this interface translates monetary gifts into concrete medical and nutritional provisions.

![Clinical Emergency Fund and Allocation Engine](./screenshots/ss_donate.png)

#### Impact Tier Allocation:
* **INR 450**: Supplies 9 days of nourishing recovery meals for one recuperating animal.
* **INR 1,200**: Covers core 7-in-1 multi-spectrum vaccines, anti-rabies vials, and tick prophylaxis.
* **INR 2,800**: Sponsors complete sterile TNVR surgical procedures and 5-day post-op hospital stay.
* **INR 6,500**: Underwrites trauma diagnostic x-ray plates and orthopedic bone-setting splints.
* **INR 12,000**: Underwrites an entire calendar month of inpatient nursing, IV fluids, and rehabilitation.
* **Multi-Currency Support**: Real-time conversion across INR, USD, and EUR.
* **Offline Test Donations**: Provides instant local confirmation tickets with unique transaction tokens.

---

### 2.6 Emergency Trauma Dispatch Feed & Intake Report
Located at `/rescues` and `/rescues/new`, this workflow enables rapid citizen reporting of roadside animal emergencies.

![Emergency Trauma Dispatch Feed](./screenshots/ss_rescues.png)

![Roadside Distress Intake Form](./screenshots/ss_new_rescue.png)

#### Technical Capabilities:
* **Real-Time Dispatch Statuses**: `REPORTED` (open triage), `IN_PROGRESS` (ambulance en route), `RESCUED` (admitted to clinic), `CLOSED` (stabilized/rehabilitated).
* **GPS Coordinate Capture**: Browser geolocation integration automatically populates latitude and longitude coordinates.
* **Offline-Resilient Photo Attachment**: Supports local file uploads via HTML5 `FileReader` data URLs, Cloudinary cloud integration, and quick demo presets.

---

### 2.7 Humane ABC / TNVR Sterilization Management
Located at `/sterilization`, this section coordinates Animal Birth Control (ABC) and Trap-Neuter-Vaccinate-Return (TNVR) programs.

![Humane TNVR Sterilization Management](./screenshots/ss_sterilization.png)

#### Lifecycle Stages:
1. **Request Logged (`PENDING`)**: Community member identifies an unsterilized group.
2. **Clinic Scheduled (`SCHEDULED`)**: Field rescuer claims the request and reserves hospital slots.
3. **Proof Submitted (`PROOF_SUBMITTED`)**: Rescuer uploads veterinary completion certificate and surgeon affidavit.
4. **Clinical Verification (`VERIFIED`)**: Authorized veterinary verifier approves proof and completes case.

---

### 2.8 Clinical Recovery Case Archives (FurStories)
Located at `/stories` and `/stories/new`, this editorial documentary section chronicles journeys from roadside trauma into rehabilitation.

![Clinical Recovery Case Archives](./screenshots/ss_stories.png)

#### Functionality:
* Photographic carousel plates documenting day-of-rescue to full rehabilitation.
* Clinical interventions timeline and caregiver commentary.
* Authenticated community submission and administrative moderation pipeline.

---

## 3. Master Administrative Console (`/admin`)

The Administrative Console is accessible directly via `/admin`. It provides high-contrast operational controls for sanctuary directors, veterinary coordinators, and field dispatchers.

```mermaid
graph LR
    subgraph Admin Console Navigation (/admin)
        T1["01 Overview"]
        T2["02 Adoptions & Pets"]
        T3["03 Field Rescues"]
        T4["04 TNVR Sterilization"]
        T5["05 Verification Queue"]
        T6["06 Medical Donations"]
        T7["07 Recovery Stories"]
        T8["08 Guardian Users"]
        T9["09 Analytics & Impact"]
    end
```

### 3.1 Master Admin Top Bar & Global Controls
Every administrative view includes:
* **"Return to Public Website"**: A dedicated exit link returning to the public home page.
* **Operator Identification**: Displays the active administrator name, email, and security role.
* **Quick Create Shortcuts**: Rapid modals for `+ Pet`, `+ Rescue`, and `+ Story`.

---

### 3.2 Master Admin Overview
Located at `/admin`, the overview aggregates platform health, urgent action notices, and operational metrics.

![Master Administration Overview](./screenshots/ss_admin_overview.png)

#### Dashboard Cards:
* **Urgent Action Banner**: Flags pending surgical proofs, open trauma dispatches, and unreviewed adoption applications.
* **KPI Metrics**: Real-time totals for registered guardians, surgical procedures, field rescues, and medical fund donations.
* **Pipeline Audits**: Breakdown of sterilization cases across all six lifecycle states.

---

### 3.3 Adoption Docket & Coordinator Portal
Located at `/admin/adoptions`, this screen allows coordinators to review applications, contact adopters, and update animal statuses.

![Admin Adoption Management and Outreach Docket](./screenshots/ss_admin_adoptions.png)

#### Coordinator Tools:
* **Call Window Badge**: Highlights the applicant's chosen time (e.g. *Window: Evening (4 PM - 8 PM)*).
* **Direct Outreach Actions**:
  * **"Call"** (`tel:...`): Initiates phone call directly to applicant.
  * **"WhatsApp"**: Pre-fills greeting message introducing the caregiver and linking the pet name.
* **Decision Controls**: One-click **Approve**, **Reject**, or **Revert** buttons that automatically synchronize pet catalog availability.

---

### 3.4 Field Rescue Dispatch Management
Located at `/admin/rescues`, this interface manages ambulance fleet dispatches and roadside incident resolution.

![Admin Field Rescue Management](./screenshots/ss_admin_rescues.png)

#### Dispatch Workflow:
* Filter cases across *Reported (Open)*, *In Progress*, *Rescued*, and *Closed*.
* Review reported GPS coordinates, street addresses, and distress descriptions.
* Dispatch emergency ambulances and update patient status in real time.

---

### 3.5 Guardian Users & Access Control
Located at `/admin/users`, directors can manage user permissions and promote team members.

![Admin User Management and Role Control](./screenshots/ss_admin_users.png)

#### Role Hierarchy:
* `USER`: Can file rescue reports, adopt pets, submit TNVR requests, and donate.
* `VERIFIER`: Can inspect surgical certificates, verify veterinary affidavits, and resolve sterilization disputes.
* `ADMIN`: Full master access to user roles, catalog creation, financial ledgers, and system configurations.

---

### 3.6 Medical Donations & Financial Ledger
Located at `/admin/donations`, this portal provides a public and internal audit record of all transactions.

![Admin Donation Records and Ledger](./screenshots/ss_admin_donations.png)

#### Financial Controls:
* Aggregate metrics: Total Funds Raised, Verified Donations, Average Contribution.
* Full itemized ledger displaying donor name, payment ID, order ID, and exact timestamp.

---

### 3.7 Clinical Verification Audit Queue
Located at `/admin/verifications` (and `/verify`), veterinary verifiers audit field sterilization submissions.

![Admin Verification Queue](./screenshots/ss_admin_verifications.png)

#### Verification Workflow:
* Inspects uploaded veterinary certificates and clinic affidavits.
* Direct action controls to approve verification or flag cases for clinical dispute.

---

## 4. Database Schema & Data Models

The platform runs on an embedded SQLite database (`prisma/dev.db`) managed through Prisma ORM v6.19.3.

```mermaid
erDiagram
    User ||--o{ AdoptionApplication : "files"
    User ||--o{ RescueReport : "submits"
    User ||--o{ SterilizationRequest : "requests"
    User ||--o{ FurStory : "authors"
    User ||--o{ Donation : "contributes"

    Pet ||--o{ AdoptionApplication : "receives"

    SterilizationRequest ||--o| User : "rescuer"
    SterilizationRequest ||--o| User : "verifiedBy"

    FurStory ||--o{ FurStoryImage : "contains"

    User {
        string id PK
        string email UK
        string name
        enum role "USER | VERIFIER | ADMIN"
        datetime createdAt
    }

    Pet {
        string id PK
        string name
        string species
        string age
        string gender
        string description
        string imageUrl
        string ownerName
        string contactPhone
        string location
        string visitingHours
        enum status "AVAILABLE | PENDING | ADOPTED"
    }

    AdoptionApplication {
        string id PK
        string petId FK
        string userId FK
        string fullName
        string phone
        string address
        string preferredCallTime
        string housingType
        string priorExperience
        string reason
        enum status "PENDING | APPROVED | REJECTED"
    }

    RescueReport {
        string id PK
        string userId FK
        string animalType
        string description
        string location
        float latitude
        float longitude
        string imageUrl
        enum status "REPORTED | IN_PROGRESS | RESCUED | CLOSED"
    }

    Donation {
        string id PK
        string userId FK
        float amount
        string currency
        string paymentId
        string orderId
        enum status "PENDING | SUCCESS | FAILED"
    }
```

---

## 5. Security & Deployment Summary

* **Role-Based Guards**: Protected endpoints and actions verify user roles via `requireAdmin()` and `requireVerifier()` helper modules.
* **Strict Privacy on Public Navbar**: Public interfaces are clean and free of administrative controls or role-switching widgets.
* **Zero External Dependencies**: Operates offline without external cloud databases, allowing local development and standalone offline clinic deployment.
* **Zero Emojis**: All UI views, copy, comments, and documentation maintain strict compliance with the zero-emoji guideline.
