# ER DIAGRAM - COMPREHENSIVE EXPLANATION & DEFENSE GUIDE

## MODUL 4 - CleanCity Homepage s Kartom i Dashboard

---

## TABLE OF CONTENTS
1. [Overview & Purpose](#overview--purpose)
2. [Design Philosophy](#design-philosophy)
3. [Entity Analysis](#entity-analysis)
4. [Relationship Analysis](#relationship-analysis)
5. [Normalization (3NF) Explanation](#normalization-3nf-explanation)
6. [Design Decisions & Rationale](#design-decisions--rationale)
7. [Common Questions & Defense Points](#common-questions--defense-points)

---

## OVERVIEW & PURPOSE

### What is this ER Diagram?
This Entity-Relationship diagram models the **database structure** for Module 4 of the CleanCity application. It focuses on:
- Storing citizen reports of communal problems
- Managing report metadata (categories, statuses, photos)
- Tracking user interactions with reports
- Supporting the homepage map and admin dashboard functionality

### Why These Entities?
The diagram contains **6 entities** chosen specifically to support Module 4's core features:
1. **REPORT** - Central data for communal problem reports
2. **PHOTO** - Visual evidence for each report
3. **CATEGORY** - Classification of problem types
4. **STATUS** - Lifecycle tracking of reports
5. **USER** - System users (citizens, admins)
6. **REPORT_VIEW** - Junction table tracking user-report interactions

---

## DESIGN PHILOSOPHY

### Core Principles Applied

#### 1. **Simplicity & Focus**
- **Decision**: Only include entities directly relevant to Module 4
- **Rationale**: The homepage map and dashboard don't need complex user management, payment systems, or notification entities
- **Defense**: "We focused on the minimal viable schema that supports our module's functionality without over-engineering"

#### 2. **Normalization First**
- **Decision**: Follow 3rd Normal Form (3NF) strictly
- **Rationale**: Prevents data redundancy, update anomalies, and maintains data integrity
- **Defense**: "Every design choice prioritizes data integrity and follows database normalization best practices"

#### 3. **Scalability Considerations**
- **Decision**: Use surrogate integer primary keys (id) for all entities
- **Rationale**: Better performance, easier foreign key references, allows natural keys to change
- **Defense**: "Integer PKs provide optimal join performance and index efficiency as the database grows"

#### 4. **Real-World Mapping**
- **Decision**: Entity names and attributes reflect real-world concepts
- **Rationale**: Makes the schema intuitive for developers and stakeholders
- **Defense**: "The schema is self-documenting - a developer can understand the domain just by reading entity names"

---

## ENTITY ANALYSIS

### 1. REPORT (Central Entity)

```
REPORT {
    int id PK
    string title
    string description
    string address
    decimal latitude
    decimal longitude
    datetime created_at
    datetime resolved_at
    int category_id FK
    int status_id FK
}
```

#### Purpose
The core entity representing a single communal problem report submitted by a citizen.

#### Attribute Breakdown

| Attribute | Type | Justification |
|-----------|------|---------------|
| `id` | int PK | Surrogate key for optimal performance and referential integrity |
| `title` | string | Short summary for quick identification (e.g., "Rupa na Ilici") |
| `description` | string | Detailed explanation of the problem (supports longer text) |
| `address` | string | Human-readable location (e.g., "Ilica 42, Zagreb") |
| `latitude` | decimal | GPS coordinate for precise map marker placement |
| `longitude` | decimal | GPS coordinate for precise map marker placement |
| `created_at` | datetime | Timestamp when report was submitted (for analytics) |
| `resolved_at` | datetime | Timestamp when problem was fixed (nullable - only set when resolved) |
| `category_id` | int FK | Foreign key to CATEGORY (normalization - avoid repeating category data) |
| `status_id` | int FK | Foreign key to STATUS (normalization - avoid repeating status data) |

#### Design Decisions

**Q: Why separate `latitude` and `longitude` instead of a single location field?**
- **A**: Decimal fields allow precise mathematical calculations (distance, proximity)
- Separate fields enable indexed spatial queries for map filtering
- Standard practice in GIS applications

**Q: Why both `address` and GPS coordinates?**
- **A**: `address` is human-readable for display and search
- GPS coordinates are precise for map rendering and spatial queries
- Supports cases where GPS is available but address isn't (and vice versa)

**Q: Why nullable `resolved_at`?**
- **A**: Not all reports are resolved immediately
- `NULL` indicates "still pending" - cleaner than using sentinel values
- Allows calculation: `resolved_at - created_at = resolution_time`

**Q: Why foreign keys instead of embedding category/status names directly?**
- **A**: 3NF compliance - avoids transitive dependencies
- Allows category/status properties to change without updating all reports
- Enables referential integrity constraints

---

### 2. PHOTO (Evidence Storage)

```
PHOTO {
    int id PK
    string url
    string filename
    int report_id FK
    datetime uploaded_at
}
```

#### Purpose
Stores photographic evidence for reports. One report can have multiple photos.

#### Attribute Breakdown

| Attribute | Type | Justification |
|-----------|------|---------------|
| `id` | int PK | Unique identifier for each photo |
| `url` | string | Full path to stored image (cloud storage URL or file path) |
| `filename` | string | Original filename (preserves user's naming, useful for downloads) |
| `report_id` | int FK | Links photo to its parent report (enforces 1:N relationship) |
| `uploaded_at` | datetime | Audit trail - when was this photo added |

#### Design Decisions

**Q: Why a separate PHOTO table instead of storing URLs in REPORT?**
- **A**: 1NF violation to store multiple URLs in one field (repeating groups)
- Reports can have 0, 1, or many photos - separate table handles this elegantly
- Allows efficient photo-specific queries (e.g., "find all reports with photos")

**Q: Why store both `url` and `filename`?**
- **A**: `url` is for system access (actual storage location)
- `filename` preserves original name for user download/display
- Separation allows storage refactoring without losing original context

**Q: Why `uploaded_at` if we have `created_at` in REPORT?**
- **A**: Photos can be added later (initial report might have no photos)
- Supports audit requirements ("when was this evidence added?")
- Enables timeline reconstruction

---

### 3. CATEGORY (Classification System)

```
CATEGORY {
    int id PK
    string name
    string icon
    string description
}
```

#### Purpose
Defines types of communal problems (e.g., "Rupe na cesti", "Smeće", "Rasvjeta").

#### Attribute Breakdown

| Attribute | Type | Justification |
|-----------|------|---------------|
| `id` | int PK | Stable identifier (name can change without breaking references) |
| `name` | string | Display name (e.g., "Rupe na cesti") |
| `icon` | string | Icon identifier for UI (e.g., "road-icon", "trash-icon") |
| `description` | string | Helpful text explaining what belongs in this category |

#### Design Decisions

**Q: Why separate CATEGORY table instead of using ENUM or hardcoding?**
- **A**: ENUMs are database-specific and hard to modify
- Separate table allows dynamic category management (add/remove without code changes)
- Enables category-specific properties (icon, description) without code duplication

**Q: Why `icon` as string instead of storing actual image?**
- **A**: Icon identifier references UI icon library (e.g., Font Awesome)
- Keeps database lean (no binary data)
- Frontend can swap icon libraries without database migration

**Q: Why `description`?**
- **A**: Helps users choose correct category when submitting reports
- Documentation for admins managing categories
- Supports accessibility (screen readers can explain category)

---

### 4. STATUS (Lifecycle Tracking)

```
STATUS {
    int id PK
    string name
    string color
    string description
}
```

#### Purpose
Defines report lifecycle states (e.g., "Novo", "U obradi", "Riješeno").

#### Attribute Breakdown

| Attribute | Type | Justification |
|-----------|------|---------------|
| `id` | int PK | Stable identifier for workflow logic |
| `name` | string | Display name (e.g., "U obradi") |
| `color` | string | Hex color or CSS class for map markers (e.g., "#FF0000" or "red") |
| `description` | string | Explains what this status means |

#### Design Decisions

**Q: Why separate STATUS table?**
- **A**: Status workflow may evolve (add "Na čekanju", "Odbijeno")
- Color coding is UI concern, separating allows independent changes
- Multiple modules might use same status definitions (DRY principle)

**Q: Why `color` attribute?**
- **A**: Map markers change color based on status (requirement from Module 4)
- Separating color logic from code allows non-developers to update
- Supports theming (light/dark mode) by changing color values

**Q: Could we merge STATUS and CATEGORY?**
- **A**: No - they serve different purposes (what vs. where in lifecycle)
- A report is simultaneously in a category AND a status
- Separation maintains Single Responsibility Principle

---

### 5. USER (Actor Management)

```
USER {
    int id PK
    string username
    string email
    string role
    datetime created_at
}
```

#### Purpose
Represents system users - citizens who submit reports and admins who manage them.

#### Attribute Breakdown

| Attribute | Type | Justification |
|-----------|------|---------------|
| `id` | int PK | Unique user identifier |
| `username` | string | Display name / login identifier |
| `email` | string | Contact info, authentication, notifications |
| `role` | string | Permission level (e.g., "citizen", "admin", "worker") |
| `created_at` | datetime | Account creation timestamp (audit trail) |

#### Design Decisions

**Q: Why minimal USER entity?**
- **A**: Module 4 only needs to track who viewed reports
- Full user management (passwords, profiles) is handled by another module
- Keeps schema focused on Module 4 scope

**Q: Why `role` as string instead of separate ROLE table?**
- **A**: Trade-off: simplicity vs. normalization
- Roles are unlikely to have many attributes
- If role complexity grows, refactor to separate table later (YAGNI principle)

**Q: Why no password field?**
- **A**: Authentication is handled by separate auth service/module
- Separation of concerns - database schema doesn't need auth details
- Security best practice - password hashes should be in isolated storage

---

### 6. REPORT_VIEW (Junction Table)

```
REPORT_VIEW {
    int id PK
    int report_id FK
    int user_id FK
    datetime viewed_at
}
```

#### Purpose
Resolves Many-to-Many relationship between REPORT and USER. Tracks which users viewed which reports and when.

#### Attribute Breakdown

| Attribute | Type | Justification |
|-----------|------|---------------|
| `id` | int PK | Surrogate key (best practice for junction tables) |
| `report_id` | int FK | Which report was viewed |
| `user_id` | int FK | Who viewed it |
| `viewed_at` | datetime | When it was viewed |

#### Design Decisions

**Q: Why is REPORT_VIEW necessary?**
- **A**: 3NF requirement - M:N relationships MUST use junction table
- Direct M:N violates normalization (creates insertion/update/deletion anomalies)
- Enables tracking additional metadata about the relationship (`viewed_at`)

**Q: Why `id` PK instead of composite PK (`report_id`, `user_id`)?**
- **A**: Allows multiple views by same user (user can view report multiple times)
- Simplifies ORM mapping (many frameworks prefer single-column PK)
- Performance: single integer index faster than composite

**Q: Could we skip REPORT_VIEW if we don't track views?**
- **A**: Yes, if viewing history isn't needed
- However, dashboard analytics likely benefit from view metrics
- Better to have infrastructure in place for future features

**Q: Why `viewed_at` timestamp?**
- **A**: Analytics - "when do users engage with reports?"
- Distinguishes fresh views from stale ones
- Supports "recently viewed" features

---

## RELATIONSHIP ANALYSIS

### Relationship Types Explained

#### 1:N (One-to-Many) Relationships

##### `REPORT ||--o{ PHOTO` - "One report has many photos"

**Cardinality**:
- One REPORT can have **zero or more** PHOTOS (||--o{)
- One PHOTO belongs to **exactly one** REPORT

**Rationale**:
- Citizens can upload multiple photos as evidence
- Some reports may have no photos (optional - hence "o" in notation)
- Photos cannot exist without a parent report (orphaned photos make no sense)

**Implementation**:
- `report_id` FK in PHOTO table
- Foreign key constraint ensures referential integrity
- Cascading delete: if report deleted, all photos deleted too

**Defense Points**:
- "We chose 1:N to allow flexibility in evidence submission"
- "Optional relationship (0 or more) accommodates reports without immediate photo evidence"
- "Cascading deletes prevent orphaned data"

---

##### `REPORT ||--o{ REPORT_VIEW` - "One report tracked in many views"

**Cardinality**:
- One REPORT can have **zero or more** views
- One REPORT_VIEW belongs to **exactly one** REPORT

**Rationale**:
- New reports haven't been viewed yet (0 views)
- Popular reports may have many views
- Each view record ties to exactly one report

**Implementation**:
- `report_id` FK in REPORT_VIEW table
- Composite index on (`report_id`, `user_id`, `viewed_at`) for fast queries

**Defense Points**:
- "This enables analytics: 'most viewed reports', 'view trends'"
- "Separating views from reports maintains 3NF"
- "Optional views (0 or more) handles newly created reports"

---

##### `USER ||--o{ REPORT_VIEW` - "One user has many views"

**Cardinality**:
- One USER can have **zero or more** views
- One REPORT_VIEW belongs to **exactly one** USER

**Rationale**:
- New users haven't viewed anything yet
- Active users view multiple reports
- Each view is by a specific user

**Implementation**:
- `user_id` FK in REPORT_VIEW table
- Allows per-user analytics ("what did this user view?")

**Defense Points**:
- "User-centric analytics for engagement tracking"
- "Supports personalization features (recommended reports)"
- "Privacy-preserving: can be anonymized later if needed"

---

#### M:1 (Many-to-One) Relationships

##### `REPORT }o--|| CATEGORY` - "Many reports belong to one category"

**Cardinality**:
- Many REPORTS can share **exactly one** CATEGORY
- One CATEGORY can classify **zero or more** REPORTS

**Rationale**:
- Reports must be categorized (required FK)
- Categories are reusable (many reports per category)
- Categories can exist without reports (e.g., new category before first report)

**Implementation**:
- `category_id` FK in REPORT table (NOT NULL)
- Referential integrity prevents invalid category references
- No cascading delete (preserve categories even if all reports deleted)

**Defense Points**:
- "3NF: avoids repeating category details (name, icon) in every report"
- "Centralized category management - change icon once, affects all reports"
- "Required relationship ensures data quality (every report categorized)"

---

##### `REPORT }o--|| STATUS` - "Many reports have one status"

**Cardinality**:
- Many REPORTS share **exactly one** STATUS
- One STATUS can apply to **zero or more** REPORTS

**Rationale**:
- Reports must have a status (lifecycle tracking)
- Statuses are reusable (many "Novo" reports)
- Statuses can exist without reports (e.g., "Odbijeno" status before first rejection)

**Implementation**:
- `status_id` FK in REPORT table (NOT NULL)
- Indexed for fast filtering ("show me all 'U obradi' reports")
- No cascading delete (preserve status definitions)

**Defense Points**:
- "3NF: status metadata (color, description) stored once"
- "Status changes are updates (just change `status_id`), not inserts"
- "Required relationship enforces business rule: every report has a lifecycle state"

---

#### M:N (Many-to-Many) via Junction Table

##### `REPORT }o--o{ USER` (via REPORT_VIEW)

**Original M:N Relationship**:
- Many USERS can view many REPORTS
- Many REPORTS can be viewed by many USERS

**Why Junction Table?**:
- **3NF Violation**: Direct M:N creates redundancy and anomalies
- **Solution**: Decompose into two 1:N relationships via REPORT_VIEW

**Decomposition**:
```
REPORT ||--o{ REPORT_VIEW
USER ||--o{ REPORT_VIEW
```

**Benefits**:
- Stores relationship metadata (`viewed_at`)
- Prevents anomalies (insertion, update, deletion)
- Allows duplicate relationships (same user views same report multiple times)

**Defense Points**:
- "Junction table is 3NF requirement for M:N relationships"
- "REPORT_VIEW adds value: tracks when views occurred"
- "Enables rich analytics without denormalization"

---

## NORMALIZATION (3NF) EXPLANATION

### What is 3NF and Why It Matters

**Third Normal Form (3NF)** ensures:
1. Data integrity (no contradictory data)
2. No redundancy (each fact stored once)
3. Efficient updates (change data in one place)
4. Prevents anomalies (insertion, update, deletion)

### 1NF (First Normal Form) Compliance

**Rule**: All attributes must be atomic (no repeating groups, no arrays).

**How We Comply**:
- ✅ No multi-value fields (e.g., "photo1, photo2, photo3")
- ✅ No repeating groups (separate PHOTO table for multiple photos)
- ✅ Every field contains single value

**Example**:
```
❌ BAD (violates 1NF):
REPORT {
    id: 1,
    photos: ["url1", "url2", "url3"]  // Array - NOT ATOMIC
}

✅ GOOD (1NF compliant):
REPORT { id: 1 }
PHOTO { id: 1, report_id: 1, url: "url1" }
PHOTO { id: 2, report_id: 1, url: "url2" }
PHOTO { id: 3, report_id: 1, url: "url3" }
```

---

### 2NF (Second Normal Form) Compliance

**Rule**: All non-key attributes must depend on the **entire** primary key (no partial dependencies).

**How We Comply**:
- ✅ All entities use single-column PK (`id`)
- ✅ No composite keys where partial dependencies could occur
- ✅ Every non-key attribute depends on the full PK

**Example**:
```
✅ GOOD (2NF compliant):
PHOTO {
    id: 1,           // PK
    url: "...",      // Depends on id (full PK)
    filename: "...", // Depends on id (full PK)
    report_id: 2     // Depends on id (full PK)
}

❌ BAD (violates 2NF with composite PK):
PHOTO {
    report_id: 2,     // Part of composite PK
    photo_num: 1,     // Part of composite PK
    url: "...",       // Depends on full PK ✓
    report_title: "Rupa" // Depends ONLY on report_id (partial dependency) ✗
}
```

---

### 3NF (Third Normal Form) Compliance

**Rule**: No transitive dependencies (non-key attributes depend ONLY on PK, not on other non-key attributes).

**How We Comply**:
- ✅ Category details in separate CATEGORY table (not in REPORT)
- ✅ Status details in separate STATUS table (not in REPORT)
- ✅ M:N resolved with REPORT_VIEW junction table

**Example of 3NF Violation (Fixed)**:

```
❌ BAD (violates 3NF - transitive dependency):
REPORT {
    id: 1,
    title: "Rupa",
    category_name: "Ceste",    // Depends on category_id (transitive)
    category_icon: "road.png", // Depends on category_id (transitive)
    category_id: 5
}
// Problem: category_name depends on category_id (not on PK directly)

✅ GOOD (3NF compliant - no transitive dependencies):
REPORT {
    id: 1,
    title: "Rupa",
    category_id: 5  // Only FK, no transitive data
}
CATEGORY {
    id: 5,
    name: "Ceste",
    icon: "road.png"
}
// All non-key attributes depend ONLY on their own table's PK
```

---

### Critical 3NF Fix: REPORT_VIEW Junction Table

**Original Problem**:
```
❌ Direct M:N (violates 3NF):
REPORT }o--o{ USER
```

**Issues**:
1. How to store this in SQL? (no direct M:N support)
2. Where to put `viewed_at`? (in REPORT? in USER? neither makes sense)
3. Redundancy: repeating user data for each report view

**Solution**:
```
✅ Junction Table (3NF compliant):
REPORT ||--o{ REPORT_VIEW }o--|| USER

REPORT_VIEW {
    id: 1,
    report_id: 10,
    user_id: 25,
    viewed_at: "2025-01-15 14:30:00"
}
```

**Why This Works**:
- No transitive dependencies (all fields depend on REPORT_VIEW.id)
- No redundancy (each view stored once)
- Proper normalization (relationship metadata stored appropriately)

---

## DESIGN DECISIONS & RATIONALE

### Decision 1: Surrogate Integer Primary Keys

**Choice**: All entities use `int id PK` instead of natural keys.

**Natural Key Alternatives**:
- REPORT: Could use `(latitude, longitude, created_at)` composite
- USER: Could use `email`
- CATEGORY: Could use `name`

**Why Integer PKs?**

| Reason | Explanation |
|--------|-------------|
| **Performance** | Integer joins faster than string/composite joins |
| **Stability** | Natural keys change (email update), PKs don't |
| **Simplicity** | Single-column FKs easier than composite FKs |
| **ORM Friendly** | Most frameworks prefer single-column PKs |
| **Privacy** | Don't expose real data (email) in URLs |

**Defense**:
> "Surrogate keys provide stable, performant references. Natural keys like email can change, breaking references. Integer PKs are database best practice for scalable applications."

---

### Decision 2: Separate Latitude/Longitude (Not PostGIS Geography)

**Choice**: `decimal latitude` + `decimal longitude` instead of `geography location`.

**Alternatives Considered**:
- PostGIS `geography` type
- Single `location` JSON field
- `address` only (no coordinates)

**Why Two Decimal Fields?**

| Reason | Explanation |
|--------|-------------|
| **Portability** | Works across all SQL databases (MySQL, Postgres, SQL Server) |
| **Simplicity** | No special extensions required (PostGIS setup complexity) |
| **Sufficient Precision** | Decimal(9,6) gives ~10cm accuracy |
| **Query Simplicity** | Standard math functions (no specialized GIS queries) |

**When PostGIS Is Better**:
- Need advanced spatial queries (polygon containment, routing)
- Working exclusively with PostgreSQL
- Large-scale GIS application

**Our Use Case**:
- Simple marker placement on map
- Basic distance calculations
- Multi-database support

**Defense**:
> "For Module 4, we need simple point mapping. Decimal lat/lng provides sufficient precision without external dependencies. If advanced GIS features are needed later, we can migrate to PostGIS."

---

### Decision 3: Nullable `resolved_at` (Not Boolean `is_resolved`)

**Choice**: `datetime resolved_at` (nullable) instead of `boolean is_resolved`.

**Alternatives Considered**:
- `boolean is_resolved`
- `string resolution_status`
- `int days_to_resolve` (calculated field)

**Why Nullable Timestamp?**

| Reason | Explanation |
|--------|-------------|
| **Information Rich** | Captures WHEN resolution happened, not just IF |
| **Analytics** | Calculate avg resolution time: `AVG(resolved_at - created_at)` |
| **Cleaner Logic** | `NULL` = pending, `NOT NULL` = resolved (no magic boolean values) |
| **Audit Trail** | Timestamp provides accountability |

**Example Queries Enabled**:
```sql
-- Average resolution time
SELECT AVG(resolved_at - created_at) FROM REPORT WHERE resolved_at IS NOT NULL;

-- Reports resolved this week
SELECT * FROM REPORT WHERE resolved_at >= NOW() - INTERVAL '7 days';

-- Pending reports (natural NULL check)
SELECT * FROM REPORT WHERE resolved_at IS NULL;
```

**Defense**:
> "Timestamps are more valuable than booleans. We get the same 'is resolved' logic (NULL check) plus the ability to analyze resolution times, track SLAs, and provide accountability."

---

### Decision 4: Foreign Keys with Referential Integrity (Not Soft References)

**Choice**: Proper FK constraints (`category_id FK`, `report_id FK`) with database enforcement.

**Alternatives Considered**:
- No FKs (application-level enforcement only)
- Soft deletes (keep deleted records with `deleted_at` flag)
- Denormalization (embed category data in REPORT)

**Why Database-Level FKs?**

| Reason | Explanation |
|--------|-------------|
| **Data Integrity** | Database prevents orphaned records |
| **Performance** | Indexed FKs speed up joins |
| **Documentation** | Schema self-documents relationships |
| **Safety** | Prevents bugs (app can't insert invalid FKs) |

**Example Protection**:
```sql
-- ✗ This will FAIL (FK constraint violation)
INSERT INTO PHOTO (report_id, url) VALUES (99999, 'test.jpg');
-- Error: report_id 99999 doesn't exist in REPORT table

-- ✓ This SUCCEEDS (valid FK)
INSERT INTO PHOTO (report_id, url) VALUES (1, 'test.jpg');
```

**Defense**:
> "Database constraints are the last line of defense. Even if application code has bugs, the database prevents data corruption. Referential integrity is a non-negotiable best practice."

---

### Decision 5: STATUS and CATEGORY as Separate Tables (Not ENUMs)

**Choice**: Dedicated tables for STATUS and CATEGORY.

**Alternatives Considered**:
- PostgreSQL ENUM type
- Hardcoded constants in application
- Single `lookup_table` with type discriminator

**Why Separate Tables?**

| Reason | Explanation |
|--------|-------------|
| **Flexibility** | Add/remove values without schema migration |
| **Portability** | ENUMs are database-specific |
| **Rich Metadata** | Store color, icon, description per value |
| **Admin UI** | Non-developers can manage categories |

**Example: Adding New Category**:
```sql
-- ✓ With table (no schema change)
INSERT INTO CATEGORY (name, icon, description)
VALUES ('Grafiti', 'spray-can', 'Vandalism reports');

-- ✗ With ENUM (requires migration)
ALTER TYPE category_enum ADD VALUE 'grafiti';
```

**Defense**:
> "Tables provide flexibility ENUMs can't match. We can add categories at runtime, store UI metadata (icons, colors), and allow admins to configure the system without developer intervention."

---

### Decision 6: Junction Table with Own PK (Not Composite PK)

**Choice**: `REPORT_VIEW` has `int id PK`, not `PK (report_id, user_id)`.

**Alternatives Considered**:
- Composite PK: `PRIMARY KEY (report_id, user_id)`
- Composite PK with timestamp: `PRIMARY KEY (report_id, user_id, viewed_at)`

**Why Surrogate PK?**

| Reason | Explanation |
|--------|-------------|
| **Multiple Views** | User can view same report multiple times |
| **ORM Compatibility** | Frameworks prefer single-column PK |
| **Indexing** | Simpler index structure |
| **Future-Proof** | Easy to add more attributes later |

**Composite PK Limitation**:
```sql
-- ✗ With composite PK (report_id, user_id)
-- User can only view report ONCE (duplicate PK error)
INSERT INTO REPORT_VIEW (report_id, user_id) VALUES (1, 5);
INSERT INTO REPORT_VIEW (report_id, user_id) VALUES (1, 5); -- ERROR!

-- ✓ With surrogate PK
-- User can view multiple times (new records)
INSERT INTO REPORT_VIEW (report_id, user_id, viewed_at)
VALUES (1, 5, '2025-01-15 10:00:00');
INSERT INTO REPORT_VIEW (report_id, user_id, viewed_at)
VALUES (1, 5, '2025-01-15 14:00:00'); -- SUCCESS!
```

**Defense**:
> "Surrogate PKs in junction tables allow richer analytics. We can track repeated views, identify engaged users, and avoid artificial constraints. It's a more flexible design."

---

## COMMON QUESTIONS & DEFENSE POINTS

### Question 1: "Why not embed photos as URLs in REPORT table?"

**Student Answer**:
> "That would violate First Normal Form (1NF). If we store multiple photo URLs in a single field (e.g., comma-separated string or JSON array), we create repeating groups. 1NF requires atomic values. Additionally, a separate PHOTO table:
> - Allows unlimited photos per report (no arbitrary limit)
> - Enables photo-specific metadata (filename, upload timestamp)
> - Makes queries easier (e.g., 'find all reports with at least 3 photos')
> - Maintains referential integrity (cascading deletes)"

---

### Question 2: "Why separate STATUS table instead of just using a string field?"

**Student Answer**:
> "A string field like `status: 'U obradi'` would violate Third Normal Form (3NF) if we wanted to store status metadata like color. We'd have transitive dependencies:
> - `status_name → status_color` (color depends on status name, not report ID)
>
> With a separate table:
> - Change status color once (in STATUS table), affects all reports automatically
> - Prevents typos ('U obradi' vs 'u obradi' vs 'U Obradi')
> - Enforces valid statuses via FK constraint
> - Allows adding new statuses without code changes
> - Stores status metadata (color for map markers, descriptions for tooltips)"

---

### Question 3: "Could you combine CATEGORY and STATUS into one 'METADATA' table?"

**Student Answer**:
> "No, that would be poor design. Categories and statuses serve fundamentally different purposes:
> - **Category**: What type of problem? (domain classification)
> - **Status**: Where in lifecycle? (workflow state)
>
> Combining them would:
> - Violate Single Responsibility Principle
> - Create confusing semantics ('is 'Riješeno' a category or status?')
> - Make queries harder (need type discriminator field)
> - Reduce clarity for developers
>
> The current design is self-documenting: `category_id` and `status_id` clearly indicate their purposes."

---

### Question 4: "Why do you need REPORT_VIEW? Can't admins just see all reports?"

**Student Answer**:
> "REPORT_VIEW serves multiple purposes beyond just access control:
>
> **Analytics**:
> - Track engagement: which reports get the most views?
> - Identify trends: are certain categories more popular?
> - Measure effectiveness: do viewed reports get resolved faster?
>
> **Personalization**:
> - 'Recently viewed' feature for users
> - Recommendations based on viewing history
>
> **Audit Trail**:
> - Accountability: who accessed which reports when?
> - Compliance: some regulations require access logging
>
> **3NF Compliance**:
> - M:N relationships MUST use junction tables in 3NF
> - Without REPORT_VIEW, we'd violate normalization
>
> Even if we don't use all these features today, the infrastructure supports future requirements."

---

### Question 5: "Why decimal for latitude/longitude instead of float?"

**Student Answer**:
> "Decimals provide exact precision, while floats introduce rounding errors:
>
> **Precision Comparison**:
> - Float: Approximate (binary representation), can drift over calculations
> - Decimal: Exact (base-10 representation), maintains accuracy
>
> **GPS Accuracy Requirements**:
> - DECIMAL(9,6): 6 decimal places = ~10cm accuracy
> - Float: May lose precision in arithmetic operations
>
> **Financial Analogy**:
> - Just like we use DECIMAL for money (not FLOAT), we use DECIMAL for coordinates
> - Critical data requiring exact values should use DECIMAL
>
> **Example**:
> ```sql
> -- Float rounding error
> FLOAT: 45.123456789 → stored as 45.123455 (loss of precision)
>
> -- Decimal exact storage
> DECIMAL(9,6): 45.123456 → stored exactly as 45.123456
> ```"

---

### Question 6: "Could you denormalize for performance (e.g., store category_name in REPORT)?"

**Student Answer**:
> "Denormalization is a trade-off, and in this case, normalization wins:
>
> **Arguments Against Denormalization**:
> 1. **Update Anomalies**: If category name changes, must update all reports
> 2. **Data Integrity**: Risk of inconsistency (some reports with old name, some with new)
> 3. **Storage**: Wasting space repeating category data
> 4. **Modern Databases**: Joins are highly optimized (indexed FK joins are fast)
>
> **When to Denormalize**:
> - Extreme performance requirements (millions of queries/second)
> - Read-heavy workloads with proven bottlenecks
> - After profiling shows joins are the problem
>
> **Our Case**:
> - Module 4 doesn't have extreme scale requirements
> - Joins are fast with proper indexing
> - Data integrity > marginal performance gains
> - Premature optimization is the root of all evil
>
> **Decision**: Maintain 3NF. If profiling later shows performance issues, denormalize specific hot paths."

---

### Question 7: "Why nullable `resolved_at` instead of a separate `is_resolved` boolean?"

**Covered in Decision 3 above, but quick defense**:

**Student Answer**:
> "A boolean only tells us IF something happened. A timestamp tells us IF and WHEN. The timestamp provides strictly more information:
> - `NULL` = not resolved (same as `false`)
> - `NOT NULL` = resolved (same as `true`)
> - Plus: exact resolution time for analytics
>
> It's the same storage cost (nullable timestamp vs nullable boolean + timestamp), but we get richer data. There's no downside."

---

### Question 8: "Why 6 tables? Couldn't you simplify to 3-4 tables?"

**Student Answer**:
> "Each table serves a distinct purpose and represents a clear real-world entity:
>
> 1. **REPORT**: Core domain entity (the problem being reported)
> 2. **PHOTO**: Evidence (1NF requires separate table for multi-value relationships)
> 3. **CATEGORY**: Classification metadata (3NF requires separate table to avoid transitive dependencies)
> 4. **STATUS**: Lifecycle metadata (same 3NF reasoning as CATEGORY)
> 5. **USER**: Actor in the system (independent entity with its own lifecycle)
> 6. **REPORT_VIEW**: Junction table (3NF requirement for M:N relationships)
>
> **Could we merge?**:
> - CATEGORY + STATUS: No (different purposes, confusing semantics)
> - PHOTO into REPORT: No (violates 1NF - repeating groups)
> - Remove REPORT_VIEW: No (violates 3NF - M:N without junction table)
> - Remove USER: No (needed to track who views reports)
>
> **Conclusion**: 6 tables is the minimum for a properly normalized schema supporting Module 4's requirements. Each table is justified by normalization rules or domain modeling."

---

## SUMMARY: KEY TALKING POINTS

When defending this ER diagram, emphasize these core points:

### 1. **3NF Compliance is Non-Negotiable**
- All design decisions prioritize normalization
- No redundancy, no anomalies, proper data integrity
- Junction table (REPORT_VIEW) resolves M:N correctly

### 2. **Simplicity & Focus**
- Only 6 tables, each with a clear purpose
- No over-engineering (no unnecessary entities)
- Supports Module 4 requirements without bloat

### 3. **Scalability & Performance**
- Integer PKs for fast joins
- Proper indexing strategy (FKs are indexed)
- Decimal coordinates for precise calculations

### 4. **Flexibility & Maintainability**
- Separate STATUS/CATEGORY tables allow runtime changes
- Nullable timestamps provide rich information
- Referential integrity prevents bugs

### 5. **Real-World Mapping**
- Schema reflects domain concepts (REPORT, PHOTO, CATEGORY)
- Intuitive for developers and stakeholders
- Self-documenting (entity names explain their purpose)

---

## FINAL DEFENSE STRATEGY

**When asked "Why did you design it this way?"**:

1. **Start with Requirements**: "Module 4 needs to display reports on a map and provide admin analytics"
2. **Explain Normalization**: "We follow 3NF to ensure data integrity and prevent anomalies"
3. **Justify Each Entity**: "Each table represents a distinct domain concept with its own lifecycle"
4. **Defend Relationships**: "M:N via junction table is 3NF requirement, not a choice"
5. **Performance Consideration**: "Integer PKs and proper indexing ensure scalability"
6. **Future-Proofing**: "Design allows extension (new categories, statuses) without schema changes"

**Confidence Statement**:
> "This ER diagram is the minimal, properly normalized schema that supports Module 4's functionality. Every entity, attribute, and relationship is justified by either normalization rules or domain requirements. It's simple, scalable, and maintainable."

---

**END OF ER DIAGRAM EXPLANATION**
