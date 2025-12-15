# CLASS DIAGRAM - COMPREHENSIVE EXPLANATION & DEFENSE GUIDE

## MODUL 4 - CleanCity Homepage s Kartom i Dashboard

---

## TABLE OF CONTENTS

1. [Overview & Purpose](#overview--purpose)
2. [Design Philosophy](#design-philosophy)
3. [Class Analysis](#class-analysis)
4. [Relationship Analysis](#relationship-analysis)
5. [Design Patterns Used](#design-patterns-used)
6. [Design Decisions & Rationale](#design-decisions--rationale)
7. [Common Questions & Defense Points](#common-questions--defense-points)

---

## OVERVIEW & PURPOSE

### What is this Class Diagram?

This UML Class Diagram models the **application structure** for Module 4 of the CleanCity application. It focuses on:

- Object-oriented design of the frontend/backend
- Business logic and application flow
- Component responsibilities and interactions
- How data flows between layers

### Why These Classes?

The diagram contains **8 classes** chosen specifically to support Module 4's core features:

1. **MapView** - Homepage displaying report markers on a map
2. **Marker** - Individual map pin representing a report
3. **Report** - Data model for communal problem reports
4. **Dashboard** - Admin analytics panel
5. **Statistics** - Metrics calculation engine
6. **Chart** - Data visualization components
7. **Filter** - Date/location filtering logic
8. **PDFExporter** - Report generation service

### Class Diagram vs ER Diagram

| Aspect                 | ER Diagram                          | Class Diagram                  |
| ---------------------- | ----------------------------------- | ------------------------------ |
| **Focus**              | Data structure (database)           | Application logic (code)       |
| **Purpose**            | How to store data                   | How to process data            |
| **Elements**           | Entities, Attributes, Relationships | Classes, Methods, Associations |
| **Layer**              | Persistent storage                  | Business logic + UI            |
| **Questions Answered** | "What data do we need?"             | "How do we use that data?"     |

---

## DESIGN PHILOSOPHY

### Core Principles Applied

#### 1. **Separation of Concerns**

- **Decision**: Each class has a single, well-defined responsibility
- **Rationale**: Makes code maintainable, testable, and easy to understand
- **Defense**: "Following SRP (Single Responsibility Principle), each class does one thing well"

#### 2. **Composition Over Inheritance**

- **Decision**: Use aggregation/composition instead of deep inheritance hierarchies
- **Rationale**: More flexible, avoids fragile base class problem
- **Defense**: "Composition provides better flexibility - we can swap components at runtime"

#### 3. **Dependency Inversion**

- **Decision**: High-level modules (Dashboard) don't depend on low-level details (PDFExporter implementation)
- **Rationale**: Loose coupling allows independent changes
- **Defense**: "Dashboard uses PDFExporter through an interface, allowing different export formats later"

#### 4. **Tell, Don't Ask**

- **Decision**: Objects encapsulate behavior, expose methods not just getters
- **Rationale**: Prevents anemic domain models, promotes rich objects
- **Defense**: "Report.updateStatus() encapsulates logic instead of just exposing a setter"

#### 5. **Keep It Simple**

- **Decision**: No over-engineering, no premature abstractions
- **Rationale**: YAGNI (You Aren't Gonna Need It) principle
- **Defense**: "We model only what Module 4 needs today, with clear extension points for tomorrow"

---

## CLASS ANALYSIS

### 1. MapView (Presentation Layer)

```
class MapView {
    -List<Report> reports
    -List<Marker> markers
    +loadReports() void
    +displayMarkers() void
    +showReportDetails(reportId: int) void
    +filterByStatus(status: string) void
}
```

#### Purpose

Main UI component for the homepage. Displays a map with markers representing reports.

#### Responsibility

- Fetch report data from backend
- Convert reports to visual markers
- Handle user interactions (marker clicks)
- Apply status-based filtering

#### Attribute Breakdown

| Attribute | Type         | Visibility  | Justification                                                       |
| --------- | ------------ | ----------- | ------------------------------------------------------------------- |
| `reports` | List<Report> | Private (-) | Cached data from backend, shouldn't be directly modified externally |
| `markers` | List<Marker> | Private (-) | Internal UI state, encapsulated from outside                        |

**Why Private?**

- Encapsulation: External code shouldn't manipulate internal collections
- Control: All changes go through public methods (adding markers via `displayMarkers()`)
- Data Integrity: Prevents accidental corruption

#### Method Breakdown

| Method                        | Return Type | Justification                                      |
| ----------------------------- | ----------- | -------------------------------------------------- |
| `loadReports()`               | void        | Async operation fetching data from backend API     |
| `displayMarkers()`            | void        | Transforms reports into visual markers on map      |
| `showReportDetails(reportId)` | void        | Opens modal/popup with full report information     |
| `filterByStatus(status)`      | void        | Filters markers by status (e.g., show only "Novo") |

**Why These Methods?**

**`loadReports()`**:

- Responsibility: Data fetching
- Implementation: Calls backend API (`GET /api/reports`)
- Error Handling: Shows user-friendly message if network fails
- Caching: Stores result in `reports` attribute

**`displayMarkers()`**:

- Responsibility: Data transformation
- Implementation: Iterates `reports`, creates `Marker` for each, adds to map
- Logic: Marker color based on report status

**`showReportDetails(reportId)`**:

- Responsibility: User interaction
- Implementation: Finds report by ID, opens modal with details
- Why not `showReportDetails(Report report)`? Because we might need to fetch fresh data

**`filterByStatus(status)`**:

- Responsibility: View filtering
- Implementation: Hides/shows markers based on status
- Alternative: Could return filtered list, but void keeps state internal

#### Design Decisions

**Q: Why separate `loadReports()` and `displayMarkers()`?**

- **A**: Separation of concerns - data loading vs rendering
- Allows loading without immediate display (better UX with loading spinners)
- Enables testing: mock reports without rendering

**Q: Why List<Report> instead of Map<int, Report>?**

- **A**: Reports are displayed as list, iteration order matters
- Maps are for fast lookup by key, we iterate sequentially here
- If fast lookup needed, add `private Map<int, Report> reportIndex`

**Q: Could MapView extend a base Component class?**

- **A**: Depends on framework (React, Vue, Angular)
- In pure OOP: Yes, could have `abstract class UIComponent`
- Trade-off: Adds complexity, only worth it if multiple similar components

---

### 2. Marker (UI Component)

```
class Marker {
    -int id
    -decimal latitude
    -decimal longitude
    -string color
    -Report report
    +onClick() void
    +getColor() string
    +updatePosition(lat: decimal, lng: decimal) void
}
```

#### Purpose

Represents a single pin/marker on the map.

#### Responsibility

- Store geographic position
- Visual representation (color based on status)
- Handle click events
- Link to underlying Report data

#### Attribute Breakdown

| Attribute   | Type    | Visibility | Justification                             |
| ----------- | ------- | ---------- | ----------------------------------------- |
| `id`        | int     | Private    | Unique identifier (matches report ID)     |
| `latitude`  | decimal | Private    | GPS coordinate (read-only after creation) |
| `longitude` | decimal | Private    | GPS coordinate (read-only after creation) |
| `color`     | string  | Private    | Visual state (derived from report status) |
| `report`    | Report  | Private    | Associated data object                    |

**Why Reference to Report?**

- Marker is a view of Report data
- Clicking marker shows report details (needs full Report object)
- Marker color derived from `report.status`

#### Method Breakdown

| Method                     | Return Type | Justification                                             |
| -------------------------- | ----------- | --------------------------------------------------------- |
| `onClick()`                | void        | Event handler, triggers detail modal                      |
| `getColor()`               | string      | Public accessor for rendering engine                      |
| `updatePosition(lat, lng)` | void        | Allows position correction (rare, but needed for editing) |

**Why These Methods?**

**`onClick()`**:

- Responsibility: Event handling
- Implementation: Notifies parent MapView to show details
- Pattern: Observer/callback pattern

**`getColor()`**:

- Responsibility: Provide visual metadata
- Why not public attribute? Encapsulation - color might be calculated
- Implementation: Returns pre-computed color from status mapping

**`updatePosition(lat, lng)`**:

- Responsibility: Position update
- Use Case: Admin corrects GPS coordinates
- Why not just update attributes? Validation logic (bounds checking, geocoding)

#### Design Decisions

**Q: Why include `report` reference instead of just data fields?**

- **A**: Rich object design - marker knows its full context
- Clicking marker opens full report, needs all data (photos, description)
- Alternative (anemic): Store only `reportId`, fetch on click (slower UX)

**Q: Why `getColor()` method instead of public `color` attribute?**

- **A**: Encapsulation - color might be computed dynamically
- Future: Color could change based on time (aged reports change color)
- Flexibility: Can add logic without changing API

**Q: Should Marker be immutable?**

- **A**: Mostly immutable (position rarely changes)
- If strict immutability: remove `updatePosition()`, create new Marker instead
- Trade-off: Immutability vs practical editing needs

---

### 3. Report (Domain Model)

```
class Report {
    -int id
    -string title
    -string description
    -string address
    -decimal latitude
    -decimal longitude
    -string status
    -Category category
    -List<Photo> photos
    -DateTime createdAt
    +getDetails() ReportDetails
    +updateStatus(newStatus: string) void
    +addPhoto(photo: Photo) void
}
```

#### Purpose

Core domain object representing a communal problem report.

#### Responsibility

- Encapsulate report data
- Business logic (status transitions, photo management)
- Validation (ensure data integrity)

#### Attribute Breakdown

| Attribute     | Type        | Visibility | Justification                                            |
| ------------- | ----------- | ---------- | -------------------------------------------------------- |
| `id`          | int         | Private    | Unique identifier (matches database PK)                  |
| `title`       | string      | Private    | Short summary                                            |
| `description` | string      | Private    | Detailed explanation                                     |
| `address`     | string      | Private    | Human-readable location                                  |
| `latitude`    | decimal     | Private    | GPS coordinate                                           |
| `longitude`   | decimal     | Private    | GPS coordinate                                           |
| `status`      | string      | Private    | Current lifecycle state ("Novo", "U obradi", "Riješeno") |
| `category`    | Category    | Private    | Reference to category object (not just ID)               |
| `photos`      | List<Photo> | Private    | Collection of attached images                            |
| `createdAt`   | DateTime    | Private    | Timestamp when report was created                        |

**Why Private Attributes?**

- Encapsulation: Force all changes through methods (validation logic)
- Data integrity: Can't bypass business rules
- Example: Can't set `status = "Invalid"` directly, must use `updateStatus()`

**Why Category object instead of int categoryId?**

- Rich domain model: Report knows its category details
- Avoids fetching: `report.category.name` instead of separate category lookup
- ORM pattern: Object references, not just foreign keys

#### Method Breakdown

| Method                    | Return Type   | Justification                            |
| ------------------------- | ------------- | ---------------------------------------- |
| `getDetails()`            | ReportDetails | Returns aggregated data for UI display   |
| `updateStatus(newStatus)` | void          | Business logic for status transitions    |
| `addPhoto(photo)`         | void          | Manages photo collection with validation |

**Why These Methods?**

**`getDetails()`**:

- Responsibility: Data aggregation
- Returns: DTO (Data Transfer Object) with all display info
- Why DTO? Prevents exposing internal structure, allows format transformation
- Example Return:
  ```javascript
  {
    id: 1,
    title: "Rupa na Ilici",
    location: { lat: 45.8150, lng: 15.9819 },
    statusColor: "#FF0000",
    categoryIcon: "road-icon",
    photoUrls: ["url1", "url2"]
  }
  ```

**`updateStatus(newStatus)`**:

- Responsibility: State transition with validation
- Logic:
  ```
  if (status == "Riješeno") {
    throw Error("Cannot change resolved report");
  }
  if (!isValidStatus(newStatus)) {
    throw Error("Invalid status");
  }
  status = newStatus;
  if (newStatus == "Riješeno") {
    resolvedAt = DateTime.now();
  }
  ```
- Why method? Encapsulates business rules, prevents invalid transitions

**`addPhoto(photo)`**:

- Responsibility: Collection management with validation
- Logic:
  ```
  if (photos.length >= 10) {
    throw Error("Maximum 10 photos per report");
  }
  if (!photo.isValid()) {
    throw Error("Invalid photo format");
  }
  photos.add(photo);
  ```
- Why method? Enforces constraints (max photos, validation)

#### Design Decisions

**Q: Why string status instead of enum or Status object?**

- **A**: Simplicity for demo, but Status object would be better
- **Improvement**: `private Status status` with `status.getValue()` and `status.getColor()`
- Trade-off: String is simpler, Status object is more OOP

**Q: Should Report be mutable or immutable?**

- **A**: Mutable for this use case (reports change status)
- Alternative: Event sourcing (immutable events, rebuild state)
- Decision: Pragmatic mutability with controlled mutation methods

**Q: Why List<Photo> instead of List<string> photoUrls?**

- **A**: Rich objects vs primitive obsession
- Photo might have metadata (filename, uploadDate, uploader)
- Photo object can have methods (resize(), validate())

---

### 4. Dashboard (Aggregation/Coordination)

```
class Dashboard {
    -Statistics statistics
    -List<Chart> charts
    -Filter filter
    -List<Report> recentReports
    +loadDashboard() void
    +applyFilter(filter: Filter) void
    +exportPDF() void
    +refreshData() void
}
```

#### Purpose

Admin panel aggregating metrics, charts, and reports.

#### Responsibility

- Coordinate data loading
- Apply filters to all components
- Trigger PDF export
- Refresh dashboard data

#### Attribute Breakdown

| Attribute       | Type         | Visibility | Justification                                             |
| --------------- | ------------ | ---------- | --------------------------------------------------------- |
| `statistics`    | Statistics   | Private    | Aggregated metrics (total, pending, resolved, avg time)   |
| `charts`        | List<Chart>  | Private    | Multiple visualizations (time series, category breakdown) |
| `filter`        | Filter       | Private    | Current active filters (date range, location)             |
| `recentReports` | List<Report> | Private    | Latest reports for quick access                           |

**Why Aggregate These Components?**

- Dashboard is a **Facade** - simplifies complex subsystem
- Coordinates multiple services (statistics calculation, chart rendering, filtering)
- Single entry point for admin functionality

#### Method Breakdown

| Method                | Return Type | Justification                          |
| --------------------- | ----------- | -------------------------------------- |
| `loadDashboard()`     | void        | Initial data loading (async, parallel) |
| `applyFilter(filter)` | void        | Applies filter to all components       |
| `exportPDF()`         | void        | Generates downloadable report          |
| `refreshData()`       | void        | Reloads all components                 |

**Why These Methods?**

**`loadDashboard()`**:

- Responsibility: Orchestration
- Implementation:
  ```
  async loadDashboard() {
    // Parallel loading for performance
    await Promise.all([
      this.statistics.calculate(),
      this.charts.forEach(c => c.update()),
      this.loadRecentReports()
    ]);
  }
  ```
- Pattern: Coordination/Orchestration

**`applyFilter(filter)`**:

- Responsibility: Propagate filter to all components
- Implementation:
  ```
  applyFilter(filter) {
    this.filter = filter;
    this.statistics.calculate(filter);
    this.charts.forEach(c => c.update(filter));
    this.recentReports = fetchReports(filter);
  }
  ```
- Pattern: Mediator (Dashboard mediates between Filter and other components)

**`exportPDF()`**:

- Responsibility: Trigger export workflow
- Implementation:
  ```
  exportPDF() {
    const exporter = new PDFExporter();
    exporter.addStatistics(this.statistics);
    exporter.addCharts(this.charts);
    exporter.addReports(this.recentReports);
    exporter.download("dashboard-report.pdf");
  }
  ```
- Pattern: Delegation (delegates to PDFExporter)

**`refreshData()`**:

- Responsibility: Force reload
- Why separate from `loadDashboard()`? User-triggered vs initial load (different loading states)

#### Design Decisions

**Q: Why Dashboard aggregates (o--) instead of composes (\*--) Statistics and Charts?**

- **A**: Aggregation = "has-a" but doesn't own lifecycle
- Statistics/Charts can exist independently
- Composition would mean Dashboard creates/destroys them (too tight)

**Q: Should Dashboard be a singleton?**

- **A**: Depends on application architecture
- Single-page app: Probably yes (one dashboard instance)
- Multi-window app: No (each window has dashboard)
- Decision: Not shown in diagram, implementation detail

**Q: Why not split into DashboardController and DashboardView?**

- **A**: MVC pattern separation
- Improvement: Separate concerns (data loading vs rendering)
- Trade-off: Simpler one-class design vs more architectural purity

---

### 5. Statistics (Calculation Engine)

```
class Statistics {
    -int totalReports
    -int pendingReports
    -int resolvedReports
    -decimal avgResolutionTime
    -DateTime lastUpdated
    +calculate(reports: List<Report>) void
    +getMetrics() StatisticsData
    +refresh() void
}
```

#### Purpose

Calculates and caches dashboard metrics.

#### Responsibility

- Aggregate report data into metrics
- Calculate averages and totals
- Cache results (avoid recalculation)

#### Attribute Breakdown

| Attribute           | Type     | Visibility | Justification                                          |
| ------------------- | -------- | ---------- | ------------------------------------------------------ |
| `totalReports`      | int      | Private    | Count of all reports                                   |
| `pendingReports`    | int      | Private    | Count of unresolved reports                            |
| `resolvedReports`   | int      | Private    | Count of resolved reports                              |
| `avgResolutionTime` | decimal  | Private    | Average time to resolve (in hours or days)             |
| `lastUpdated`       | DateTime | Private    | When metrics were last calculated (cache invalidation) |

**Why Cache Results?**

- Performance: Avoid recalculating on every dashboard view
- `lastUpdated` allows staleness detection

#### Method Breakdown

| Method               | Return Type    | Justification                         |
| -------------------- | -------------- | ------------------------------------- |
| `calculate(reports)` | void           | Computes all metrics from report list |
| `getMetrics()`       | StatisticsData | Returns DTO with all metrics          |
| `refresh()`          | void           | Forces recalculation                  |

**Why These Methods?**

**`calculate(reports)`**:

- Responsibility: Metric computation
- Implementation:

  ```
  calculate(reports) {
    this.totalReports = reports.length;
    this.pendingReports = reports.filter(r => r.status != "Riješeno").length;
    this.resolvedReports = this.totalReports - this.pendingReports;

    const resolved = reports.filter(r => r.resolvedAt != null);
    const totalTime = resolved.reduce((sum, r) =>
      sum + (r.resolvedAt - r.createdAt), 0);
    this.avgResolutionTime = totalTime / resolved.length;

    this.lastUpdated = DateTime.now();
  }
  ```

- Pattern: Strategy (different calculation strategies for different metrics)

**`getMetrics()`**:

- Responsibility: Data exposure
- Returns DTO to prevent direct attribute access
- Example:
  ```
  {
    total: 150,
    pending: 45,
    resolved: 105,
    avgResolutionHours: 18.5,
    lastUpdated: "2025-01-15T14:30:00Z"
  }
  ```

**`refresh()`**:

- Responsibility: Cache invalidation
- Fetches latest reports and recalculates
- Use case: User clicks "Refresh" button

#### Design Decisions

**Q: Why separate Statistics class instead of Dashboard calculating directly?**

- **A**: Single Responsibility Principle
- Statistics has one job: metric calculation
- Dashboard has different job: coordination
- Allows testing Statistics independently

**Q: Why store lastUpdated?**

- **A**: Transparency - user knows if data is stale
- Cache management - auto-refresh if too old
- Debugging - helps diagnose issues

**Q: Could Statistics be a static utility class?**

- **A**: No - needs state (cached metrics)
- Static classes are stateless, this has mutable state
- Current design: Stateful service object

---

### 6. Chart (Visualization Component)

```
class Chart {
    -string type
    -List<Data> data
    -List<string> labels
    -string title
    +render() void
    +update(newData: List<Data>) void
    +export() Image
}
```

#### Purpose

Renders data visualizations (bar charts, line charts, pie charts).

#### Responsibility

- Transform data into visual representation
- Handle different chart types
- Export chart as image

#### Attribute Breakdown

| Attribute | Type         | Visibility | Justification                     |
| --------- | ------------ | ---------- | --------------------------------- |
| `type`    | string       | Private    | Chart type ("bar", "line", "pie") |
| `data`    | List<Data>   | Private    | Numeric data points               |
| `labels`  | List<string> | Private    | Axis labels or legend items       |
| `title`   | string       | Private    | Chart title                       |

**Why These Attributes?**

- Generic design: supports multiple chart types
- `type` determines rendering strategy
- `data` + `labels` = complete dataset

#### Method Breakdown

| Method            | Return Type | Justification                                  |
| ----------------- | ----------- | ---------------------------------------------- |
| `render()`        | void        | Draws chart to canvas/SVG                      |
| `update(newData)` | void        | Updates chart with new data (smooth animation) |
| `export()`        | Image       | Generates downloadable image                   |

**Why These Methods?**

**`render()`**:

- Responsibility: Initial drawing
- Implementation: Uses charting library (Chart.js, D3.js, Recharts)
- Delegates to library but encapsulates details

**`update(newData)`**:

- Responsibility: Data refresh
- Why not re-render? `update()` allows animations (data transitions)
- Implementation:
  ```
  update(newData) {
    this.data = newData;
    this.chartLibrary.updateData(newData); // Smooth transition
  }
  ```

**`export()`**:

- Responsibility: Image generation
- Returns: PNG/SVG/JPEG image blob
- Use case: Include chart in PDF report

#### Design Decisions

**Q: Why generic Chart class instead of BarChart, LineChart, PieChart subclasses?**

- **A**: Trade-off: Simplicity vs type safety
- Generic: Single class, type attribute determines behavior
- Subclasses: More OOP, but more boilerplate
- Decision: Generic for simplicity, refactor to subclasses if complexity grows

**Q: Why List<Data> instead of concrete type like List<Number>?**

- **A**: Flexibility - Data might be complex (multi-dimensional)
- Example: `Data { value: number, category: string, color: string }`
- Generic `Data` allows extension

**Q: Should Chart be immutable?**

- **A**: No - needs `update()` for dynamic dashboards
- Charts change as filters are applied
- Immutability would require destroying/recreating (poor UX)

---

### 7. Filter (Query Builder)

```
class Filter {
    -DateTime dateFrom
    -DateTime dateTo
    -string location
    -string status
    +applyTimeFilter(from: DateTime, to: DateTime) void
    +applyLocationFilter(location: string) void
    +applyStatusFilter(status: string) void
    +reset() void
    +getFilteredReports() List<Report>
}
```

#### Purpose

Builds and applies filters to report queries.

#### Responsibility

- Store filter criteria
- Validate filter inputs
- Execute filtered queries

#### Attribute Breakdown

| Attribute  | Type     | Visibility | Justification                                                   |
| ---------- | -------- | ---------- | --------------------------------------------------------------- |
| `dateFrom` | DateTime | Private    | Start of date range (nullable for "all time")                   |
| `dateTo`   | DateTime | Private    | End of date range (nullable for "until now")                    |
| `location` | string   | Private    | Geographic filter (kvart name or coordinates)                   |
| `status`   | string   | Private    | Status filter ("Novo", "U obradi", "Riješeno", or null for all) |

**Why These Filters?**

- Directly map to Module 4 requirements:
  - "Filtriranje po datumu" → `dateFrom`, `dateTo`
  - "Filtriranje po kvartu" → `location`
  - Implicit status filtering for map → `status`

#### Method Breakdown

| Method                          | Return Type  | Justification                       |
| ------------------------------- | ------------ | ----------------------------------- |
| `applyTimeFilter(from, to)`     | void         | Sets date range                     |
| `applyLocationFilter(location)` | void         | Sets geographic filter              |
| `applyStatusFilter(status)`     | void         | Sets status filter                  |
| `reset()`                       | void         | Clears all filters                  |
| `getFilteredReports()`          | List<Report> | Executes query with current filters |

**Why These Methods?**

**`applyTimeFilter(from, to)`**:

- Responsibility: Date range validation
- Implementation:
  ```
  applyTimeFilter(from, to) {
    if (from > to) {
      throw Error("Start date must be before end date");
    }
    this.dateFrom = from;
    this.dateTo = to;
  }
  ```
- Validation prevents nonsensical queries

**`applyLocationFilter(location)`**:

- Responsibility: Geographic filtering
- Implementation: Could be kvart name or bounding box coordinates
- Future: Support polygon containment

**`applyStatusFilter(status)`**:

- Responsibility: Status filtering
- Validation: Ensure status exists in STATUS table

**`reset()`**:

- Responsibility: Clear all filters
- Implementation: Set all attributes to null
- Use case: "Show all reports" button

**`getFilteredReports()`**:

- Responsibility: Query execution
- Implementation:
  ```
  getFilteredReports() {
    let query = "SELECT * FROM reports WHERE 1=1";
    if (this.dateFrom) query += ` AND created_at >= '${this.dateFrom}'`;
    if (this.dateTo) query += ` AND created_at <= '${this.dateTo}'`;
    if (this.location) query += ` AND address LIKE '%${this.location}%'`;
    if (this.status) query += ` AND status = '${this.status}'`;
    return database.execute(query);
  }
  ```
- Pattern: Builder pattern (builds query incrementally)

#### Design Decisions

**Q: Why separate Filter class instead of Dashboard having filter methods?**

- **A**: Reusability - Filter can be used in MapView too
- Single Responsibility - Filter focuses only on filtering logic
- Testability - Can test Filter independently

**Q: Why mutable (apply methods) instead of immutable (return new Filter)?**

- **A**: Practical - UI widgets modify filter as user interacts
- Immutable would be more functional but less ergonomic for UI binding

**Q: Should Filter be a value object?**

- **A**: Partially - represents filter state (could be value object)
- But has behavior (`getFilteredReports()`), so not pure value object
- Trade-off: Pragmatic design over strict categorization

---

### 8. PDFExporter (Service/Utility)

```
class PDFExporter {
    -string template
    -ReportData data
    +generate(data: ReportData) PDF
    +download(filename: string) void
    +addChart(chart: Chart) void
}
```

#### Purpose

Generates PDF reports from dashboard data.

#### Responsibility

- Format data for PDF
- Render charts as images
- Trigger browser download

#### Attribute Breakdown

| Attribute  | Type       | Visibility | Justification                         |
| ---------- | ---------- | ---------- | ------------------------------------- |
| `template` | string     | Private    | HTML/Markdown template for PDF layout |
| `data`     | ReportData | Private    | Aggregated data to include in PDF     |

**Why Template?**

- Separation of data and presentation
- Non-developers can update template (CSS, layout)
- Example: Handlebars/Jinja template

#### Method Breakdown

| Method               | Return Type | Justification                  |
| -------------------- | ----------- | ------------------------------ |
| `generate(data)`     | PDF         | Creates PDF document           |
| `download(filename)` | void        | Triggers browser download      |
| `addChart(chart)`    | void        | Includes chart as image in PDF |

**Why These Methods?**

**`generate(data)`**:

- Responsibility: PDF creation
- Implementation: Uses library (jsPDF, pdfmake, Puppeteer)
- Returns: PDF blob or base64 string

**`download(filename)`**:

- Responsibility: Client-side download
- Implementation:
  ```
  download(filename) {
    const blob = this.generate(this.data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }
  ```

**`addChart(chart)`**:

- Responsibility: Image embedding
- Implementation: Calls `chart.export()`, embeds in PDF
- Why method? Charts need special handling (rasterization)

#### Design Decisions

**Q: Why separate PDFExporter instead of Dashboard.exportPDF() doing it all?**

- **A**: Single Responsibility Principle
- PDFExporter can be reused (export single report as PDF)
- Allows swapping PDF libraries without changing Dashboard

**Q: Should PDFExporter be singleton?**

- **A**: No - multiple exports might happen concurrently
- Each export is a separate instance with its own state

**Q: Why not use backend for PDF generation?**

- **A**: Trade-off: client-side vs server-side
- Client-side: Faster (no network), no server load
- Server-side: Better for complex PDFs, consistent rendering
- Decision: Client-side for simplicity (Module 4 scope)

---

## RELATIONSHIP ANALYSIS

### Relationship Types in UML

| Symbol | Name        | Meaning                      |
| ------ | ----------- | ---------------------------- | ------ |
| `-->`  | Association | "uses" or "knows about"      |
| `o--`  | Aggregation | "has-a" (shared ownership)   |
| `*--`  | Composition | "owns" (exclusive ownership) |
| `--    | >`          | Inheritance                  | "is-a" |
| `..>`  | Dependency  | "depends on" (weak coupling) |

---

### 1. Composition: `MapView *-- Marker`

**Notation**: `MapView *-- Marker : contains`

**Meaning**:

- MapView **owns** its Markers
- Markers cannot exist without MapView
- When MapView is destroyed, Markers are destroyed

**Rationale**:

- Markers are purely UI elements
- They have no meaning outside of the map display
- Lifecycle tightly coupled (created when map loads, destroyed when map unmounts)

**Implementation**:

```javascript
class MapView {
  constructor() {
    this.markers = [] // Owns marker instances
  }

  displayMarkers() {
    this.reports.forEach((report) => {
      // MapView creates markers (composition)
      const marker = new Marker(report.latitude, report.longitude, report)
      this.markers.push(marker)
    })
  }

  destroy() {
    // Destroying MapView destroys markers
    this.markers = []
  }
}
```

**Defense Points**:

- "Composition models exclusive ownership - markers are part of the map view"
- "Filled diamond indicates strong lifecycle dependency"
- "Alternative (aggregation) wouldn't make sense - markers don't exist independently"

---

### 2. Association: `Marker --> Report`

**Notation**: `Marker --> Report : references`

**Meaning**:

- Marker **knows about** Report
- Marker uses Report data (for display, click handling)
- Report can exist without Marker (independent lifecycle)

**Rationale**:

- Marker is a view of Report data
- Report is domain model, exists in database
- Association is one-way (Report doesn't know about Marker)

**Implementation**:

```javascript
class Marker {
  constructor(lat, lng, report) {
    this.latitude = lat
    this.longitude = lng
    this.report = report // Association: reference to Report
  }

  onClick() {
    // Uses associated Report
    showDetails(this.report)
  }

  getColor() {
    // Derives color from Report status
    return this.report.status === "Riješeno" ? "green" : "red"
  }
}
```

**Defense Points**:

- "Association models 'uses' relationship without ownership"
- "Marker depends on Report data but doesn't own it"
- "Unidirectional arrow shows Marker knows Report, not vice versa"

---

### 3. Aggregation: `Dashboard o-- Statistics`

**Notation**: `Dashboard o-- Statistics : aggregates`

**Meaning**:

- Dashboard **has-a** Statistics component
- Statistics can exist independently of Dashboard
- Shared ownership (other components might use same Statistics instance)

**Rationale**:

- Statistics might be used elsewhere (MapView showing quick stats)
- Dashboard doesn't exclusively own Statistics lifecycle
- Hollow diamond indicates weaker coupling than composition

**Implementation**:

```javascript
// Statistics created externally
const statistics = new Statistics()

class Dashboard {
  constructor(statistics) {
    this.statistics = statistics // Aggregation: reference to external object
  }

  loadDashboard() {
    this.statistics.calculate(this.reports)
  }

  destroy() {
    // Dashboard destroyed, but Statistics might live on
    this.statistics = null
  }
}
```

**Defense Points**:

- "Aggregation models shared ownership - Statistics isn't exclusive to Dashboard"
- "Hollow diamond indicates Statistics can exist independently"
- "Alternative scenario: Multiple dashboards share one Statistics service"

---

### 4. Aggregation: `Dashboard o-- Chart`

**Notation**: `Dashboard o-- Chart : aggregates`

**Meaning**:

- Dashboard **has-a** collection of Charts
- Charts can exist independently
- Charts might be reused in other contexts

**Rationale**:

- Individual charts might be embedded elsewhere (single chart widget)
- Dashboard coordinates charts but doesn't exclusively own them
- Lifecycle: Charts can outlive Dashboard (cached for performance)

**Implementation**:

```javascript
class Dashboard {
  constructor() {
    this.charts = [] // Aggregates multiple Chart instances
  }

  addChart(chart) {
    this.charts.push(chart) // Adding externally created chart
  }

  render() {
    this.charts.forEach((chart) => chart.render())
  }
}

// Charts created externally
const timeSeriesChart = new Chart("line", timeSeriesData)
const categoryChart = new Chart("pie", categoryData)

const dashboard = new Dashboard()
dashboard.addChart(timeSeriesChart)
dashboard.addChart(categoryChart)
```

**Defense Points**:

- "Charts are reusable components, not exclusive to one dashboard"
- "Aggregation allows charts to be composed flexibly"
- "Could have multiple dashboards displaying same chart instances"

---

### 5. Association: `Dashboard --> Filter`

**Notation**: `Dashboard --> Filter : uses`

**Meaning**:

- Dashboard **uses** Filter to apply filtering logic
- Filter exists independently
- Dashboard modifies Filter state

**Rationale**:

- Filter is a stateful service object
- Dashboard applies filter, but doesn't own it
- Filter might be used by MapView too (shared filter state)

**Implementation**:

```javascript
class Dashboard {
  constructor(filter) {
    this.filter = filter // Uses filter service
  }

  applyFilter(filterCriteria) {
    this.filter.applyTimeFilter(filterCriteria.from, filterCriteria.to)
    this.filter.applyLocationFilter(filterCriteria.location)

    const filteredReports = this.filter.getFilteredReports()
    this.statistics.calculate(filteredReports)
    this.charts.forEach((c) => c.update(filteredReports))
  }
}
```

**Defense Points**:

- "Association models collaboration without ownership"
- "Filter is a shared service, multiple components might use it"
- "Dashboard coordinates filter application across components"

---

### 6. Dependency: `Dashboard ..> PDFExporter`

**Notation**: `Dashboard ..> PDFExporter : depends on`

**Meaning**:

- Dashboard **depends on** PDFExporter for export functionality
- Weak coupling (dashed line)
- PDFExporter might not be instantiated until needed

**Rationale**:

- PDFExporter is only used when user clicks "Export"
- Lazy loading: Don't create exporter until needed
- Loose coupling: Could swap PDF implementation easily

**Implementation**:

```javascript
class Dashboard {
  exportPDF() {
    // Dependency: Creates PDFExporter on demand
    const exporter = new PDFExporter()
    exporter.addStatistics(this.statistics)
    exporter.addCharts(this.charts)
    exporter.download("dashboard.pdf")
  }
}
```

**Why Dependency, Not Association?**

- Temporary relationship (only during export)
- No persistent reference stored
- Weak coupling allows easy substitution

**Defense Points**:

- "Dependency shows Dashboard uses PDFExporter without owning it"
- "Dashed line indicates weaker coupling than solid association"
- "Allows swapping export implementations (PDFExporter → ExcelExporter)"

---

### 7. Association: `Dashboard --> Report`

**Notation**: `Dashboard --> Report : displays`

**Meaning**:

- Dashboard **displays** recent reports
- Dashboard queries and shows report list
- Reports exist independently

**Rationale**:

- Dashboard shows top 10 recent reports
- Reports are domain objects, not owned by Dashboard
- One-way: Report doesn't know about Dashboard

**Implementation**:

```javascript
class Dashboard {
  loadDashboard() {
    // Fetches reports (doesn't own them)
    this.recentReports = fetchRecentReports(10)
  }

  render() {
    this.recentReports.forEach((report) => {
      displayReportSummary(report)
    })
  }
}
```

**Defense Points**:

- "Association models 'displays' relationship"
- "Dashboard doesn't own reports, just references them"
- "Reports can be displayed in multiple views simultaneously"

---

## DESIGN PATTERNS USED

### 1. **Facade Pattern** - Dashboard

**Definition**: Provides simplified interface to complex subsystem.

**Application**:

- Dashboard is facade for Statistics, Charts, Filter
- Hides complexity of coordinating multiple components
- Single entry point: `loadDashboard()`

**Benefits**:

- Simpler client code
- Decouples clients from subsystem details
- Easier to maintain

---

### 2. **Strategy Pattern** - Chart

**Definition**: Defines family of algorithms (chart types), makes them interchangeable.

**Application**:

- `type` attribute determines rendering strategy
- "bar", "line", "pie" → different algorithms
- Could refactor to explicit strategy classes

**Benefits**:

- Extensible (add new chart types easily)
- Avoids large conditionals
- Encapsulates algorithm variations

---

### 3. **Builder Pattern** - Filter

**Definition**: Constructs complex objects step by step.

**Application**:

- Filter built incrementally: `applyTimeFilter()`, `applyLocationFilter()`, `applyStatusFilter()`
- Allows partial filters (only date, or only location)
- `getFilteredReports()` executes built query

**Benefits**:

- Flexible query construction
- Readable API
- Reusable components

---

### 4. **Mediator Pattern** - Dashboard (Alternative View)

**Definition**: Centralizes complex communications between objects.

**Application**:

- Dashboard mediates between Filter and other components
- Filter applied → Dashboard updates Statistics and Charts
- Components don't talk to each other directly

**Benefits**:

- Loose coupling
- Centralized control flow
- Easier to modify interactions

---

### 5. **Observer Pattern** - Marker.onClick()

**Definition**: Defines one-to-many dependency, observers notified of changes.

**Application**:

- Marker.onClick() notifies MapView
- MapView is observer, Marker is subject
- Could be explicit Observable implementation

**Benefits**:

- Decouples Marker from MapView
- Allows multiple observers
- Event-driven architecture

---

## DESIGN DECISIONS & RATIONALE

### Decision 1: Composition for MapView-Marker, Not Association

**Choice**: `MapView *-- Marker` (composition) instead of `MapView --> Marker` (association)

**Rationale**:

- Markers have no meaning outside MapView
- MapView creates markers (exclusive ownership)
- Destroying MapView destroys markers

**Alternative**:

- Association: Markers exist independently, MapView just references them
- Problem: Markers are purely UI, no independent existence

**Defense**:

> "Composition models the reality that markers are integral parts of the map view. They're created by the view, owned by the view, and destroyed with the view. This tight lifecycle coupling justifies composition over association."

---

### Decision 2: Aggregation for Dashboard-Statistics, Not Composition

**Choice**: `Dashboard o-- Statistics` (aggregation) instead of `Dashboard *-- Statistics` (composition)

**Rationale**:

- Statistics might be used by other components (MapView showing quick stats)
- Dashboard doesn't exclusively own Statistics
- Statistics can outlive Dashboard (cached)

**Alternative**:

- Composition: Dashboard exclusively owns Statistics
- Problem: Prevents reuse, couples Statistics to Dashboard lifecycle

**Defense**:

> "Aggregation allows Statistics to be a shared service. While Dashboard is the primary consumer, Statistics isn't exclusive to it. This design enables reuse without tight coupling."

---

### Decision 3: Dependency for Dashboard-PDFExporter, Not Association

**Choice**: `Dashboard ..> PDFExporter` (dependency) instead of `Dashboard --> PDFExporter` (association)

**Rationale**:

- PDFExporter only used during export (rare operation)
- No persistent reference stored
- Weak coupling allows swapping implementations

**Alternative**:

- Association: Dashboard holds reference to PDFExporter
- Problem: Unnecessary coupling, PDFExporter loaded even if never used

**Defense**:

> "Dependency reflects the temporary nature of the relationship. PDFExporter is created on-demand, used, and discarded. This keeps Dashboard lightweight and allows easy substitution of export strategies."

---

### Decision 4: Association for Marker-Report, Not Composition

**Choice**: `Marker --> Report` (association) instead of `Marker *-- Report` (composition)

**Rationale**:

- Report is domain model, exists independently in database
- Marker is just a view of Report data
- Multiple markers might reference same Report (different map instances)

**Alternative**:

- Composition: Marker owns Report
- Problem: Implies Report's lifecycle tied to Marker (nonsensical)

**Defense**:

> "Association correctly models the view-model relationship. Report is the source of truth, Marker is just a visual representation. The Report exists regardless of whether a Marker displays it."

---

### Decision 5: List<Marker> Not Map<int, Marker> in MapView

**Choice**: `List<Marker> markers` instead of `Map<int, Marker> markers`

**Rationale**:

- Markers are iterated for rendering (sequential access)
- No frequent lookup by ID
- List maintains insertion order (display order)

**Alternative**:

- Map: Fast lookup by ID
- Problem: Unnecessary for use case, adds complexity

**Defense**:

> "Data structure choice reflects usage pattern. MapView iterates markers for rendering, doesn't look them up by ID. List is simpler and sufficient. If fast lookup becomes necessary, we can add a secondary Map index."

---

### Decision 6: Private Attributes with Public Methods (Encapsulation)

**Choice**: All attributes private (`-`), behavior exposed via public (`+`) methods

**Rationale**:

- Encapsulation: Hide internal state
- Flexibility: Can change implementation without breaking API
- Validation: Force changes through methods (business rules)

**Alternative**:

- Public attributes: Simpler, direct access
- Problem: No validation, no encapsulation, tight coupling

**Defense**:

> "Encapsulation is a core OOP principle. Private attributes with public methods provide a stable API, allow validation, and enable future refactoring without breaking clients. This is standard practice in enterprise software."

---

### Decision 7: void Return Types for Most Methods

**Choice**: Methods like `loadReports()`, `displayMarkers()` return `void`

**Rationale**:

- Side effects: These methods modify internal state
- Command pattern: "Do something" not "Get something"
- State changes: `loadReports()` updates `this.reports`

**Alternative**:

- Return values: `loadReports()` returns `List<Report>`
- Problem: Encourages external state management, breaks encapsulation

**Defense**:

> "void return types indicate command methods (do something) vs query methods (return data). This follows Command-Query Separation (CQS) principle: methods that change state shouldn't return values. For data retrieval, we use explicit getters like `getMetrics()`."

---

### Decision 8: No Inheritance Hierarchy

**Choice**: Flat class structure (no base classes, interfaces shown but minimal)

**Rationale**:

- Simplicity: No deep hierarchies to navigate
- Composition over inheritance: Prefer aggregation/composition
- YAGNI: Don't add inheritance until there's proven duplication

**Alternative**:

- Inheritance: `MapView extends UIComponent`, `Chart extends Renderable`
- Problem: Premature abstraction, tight coupling

**Defense**:

> "We favor composition over inheritance. The Gang of Four advises 'favor object composition over class inheritance' for flexibility. If we discover common behavior later, we can refactor to interfaces or mixins. Starting simple prevents over-engineering."

---

## COMMON QUESTIONS & DEFENSE POINTS

### Question 1: "Why separate MapView and Dashboard? Can't they be one component?"

**Student Answer**:

> "MapView and Dashboard serve different purposes and different users:
>
> **MapView**:
>
> - Purpose: Public-facing display of reports
> - Users: Citizens viewing problems on map
> - Functionality: Display markers, show details
>
> **Dashboard**:
>
> - Purpose: Admin analytics and management
> - Users: City admins, workers
> - Functionality: Statistics, charts, filtering, export
>
> Combining them would:
>
> - Violate Single Responsibility Principle
> - Create a monolithic, hard-to-maintain class
> - Couple public and admin features (security concern)
>
> Separation allows:
>
> - Independent evolution (change dashboard without affecting map)
> - Role-based access control (admins access dashboard, public accesses map)
> - Easier testing (test each component independently)
>
> This is a classic application of **Separation of Concerns**."

---

### Question 2: "Why use aggregation (o--) instead of composition (\*--) for Dashboard-Statistics?"

**Student Answer**:

> "The choice between aggregation and composition depends on **lifecycle ownership**:
>
> **Composition** (\*--):
>
> - Parent exclusively owns child
> - Child destroyed when parent destroyed
> - Example: MapView \*-- Marker (markers only exist in map context)
>
> **Aggregation** (o--):
>
> - Parent uses child, but doesn't exclusively own
> - Child can exist independently
> - Example: Dashboard o-- Statistics (statistics might be used elsewhere)
>
> **Why Aggregation for Statistics?**:
>
> - Statistics service might be shared across components
> - MapView might show quick stats too
> - Destroying Dashboard shouldn't necessarily destroy Statistics (could be cached)
>
> **Flexibility**:
>
> - Aggregation allows Statistics to be a shared service
> - Multiple dashboards could use same Statistics instance
> - Loose coupling enables reuse
>
> If Statistics were ONLY used by Dashboard, composition would be appropriate. But aggregation future-proofs the design."

---

### Question 3: "Why dependency (..>) for PDFExporter but association (-->) for Filter?"

**Student Answer**:

> "The difference is in **coupling strength and usage pattern**:
>
> **Association** (Dashboard --> Filter):
>
> - Dashboard holds persistent reference to Filter
> - Filter used frequently (every time data loads)
> - Filter state maintained across operations
> - Code:
>   ```
>   class Dashboard {
>     constructor() {
>       this.filter = new Filter(); // Persistent reference
>     }
>   }
>   ```
>
> **Dependency** (Dashboard ..> PDFExporter):
>
> - No persistent reference stored
> - PDFExporter created only when needed (export action)
> - Temporary relationship (create, use, discard)
> - Code:
>   ```
>   class Dashboard {
>     exportPDF() {
>       const exporter = new PDFExporter(); // Created on demand
>       exporter.generate(this.data);
>     }
>   }
>   ```
>
> **Benefits of Dependency**:
>
> - Loose coupling: Easy to swap implementations
> - Lazy loading: Don't load PDF library until needed
> - Memory efficiency: PDFExporter not kept in memory
>
> **Rule of Thumb**:
>
> - Use **Association** for persistent relationships (stored references)
> - Use **Dependency** for transient relationships (created on demand)"

---

### Question 4: "Could you use inheritance? Like Dashboard extends BaseComponent?"

**Student Answer**:

> "Inheritance is possible but not beneficial here:
>
> **Arguments Against Inheritance**:
>
> 1. **Composition over Inheritance**: OOP best practice (Gang of Four)
> 2. **Flexibility**: Composition allows runtime behavior changes
> 3. **No Shared Behavior**: MapView and Dashboard don't have significant common code
> 4. **Fragile Base Class Problem**: Changes to base class break subclasses
>
> **When Inheritance Makes Sense**:
>
> - Clear 'is-a' relationship (Dog is-a Animal)
> - Significant shared behavior across subclasses
> - Stable base class (rarely changes)
>
> **Our Case**:
>
> - MapView 'has-a' list of Markers (composition)
> - Dashboard 'has-a' Statistics, Charts (aggregation)
> - No 'is-a' relationships needed
>
> **Alternative (If Needed)**:
>
> - Use interfaces/protocols for contracts (Renderable, Exportable)
> - Use composition with shared utilities (not inheritance)
>
> **Example**:
>
> ```
> // ✗ Inheritance (tight coupling)
> class Dashboard extends UIComponent {
>   render() { super.render(); ... }
> }
>
> // ✓ Composition (loose coupling)
> class Dashboard {
>   constructor() {
>     this.renderer = new Renderer();
>   }
>   render() { this.renderer.render(this); }
> }
> ```
>
> Composition provides the same benefits without the coupling."

---

### Question 5: "Why does Report have both latitude/longitude and address?"

**Student Answer**:

> "They serve different purposes and use cases:
>
> **Latitude/Longitude** (Precise):
>
> - Purpose: Exact map marker placement
> - Use: `<Marker position={[lat, lng]} />`
> - Benefits: Precise, mathematical calculations (distance)
> - Example: 45.815011, 15.981919
>
> **Address** (Human-Readable):
>
> - Purpose: Display to users
> - Use: Show in report details, search
> - Benefits: Understandable, contextual
> - Example: "Ilica 42, Zagreb"
>
> **Why Both?**:
>
> 1. **User reports from mobile**: GPS gives coordinates, reverse geocoding gets address
> 2. **User reports from web**: Address entered, forward geocoding gets coordinates
> 3. **Fallback**: Sometimes only one is available
> 4. **Search**: Users search by address, results shown on map via coordinates
>
> **Example Scenario**:
>
> - Mobile user takes photo of pothole
> - GPS: (45.8150, 15.9819)
> - Reverse geocoding: 'Ilica 42, Zagreb'
> - Both stored for complete information
>
> **Alternative (Why Not Enough)**:
>
> - Only GPS: Can't show human-readable location
> - Only address: Can't place precise marker, geocoding on every load (slow)
>
> Storing both optimizes for different use cases."

---

### Question 6: "Why List<Photo> in Report instead of just one photo URL?"

**Student Answer**:

> "One photo is insufficient for real-world use cases:
>
> **Requirements**:
>
> - Citizen reports pothole: Takes multiple angles
> - Graffiti report: Before/after photos
> - Broken streetlight: Wide shot + close-up
>
> **Technical Reasons**:
>
> 1. **First Normal Form**: Multiple values in one field violates 1NF
> 2. **Flexibility**: No arbitrary limit (vs 'photo1, photo2, photo3' fields)
> 3. **Metadata**: Each photo has upload time, filename
> 4. **Ordering**: Photos have sequence (first photo is primary)
>
> **Design Comparison**:
>
> ```
> // ✗ Single photo (too restrictive)
> class Report {
>   photoUrl: string;
> }
>
> // ✗ Fixed number (arbitrary limit)
> class Report {
>   photo1: string;
>   photo2: string;
>   photo3: string;
> }
>
> // ✓ List (flexible, unlimited)
> class Report {
>   photos: List<Photo>;
> }
> ```
>
> **Photo Class Benefits**:
>
> - Encapsulates metadata (filename, uploadDate)
> - Methods: resize(), validate(), getDownloadUrl()
> - Type safety: Can't accidentally add non-photo to list
>
> Lists align with database design (one-to-many relationship) and provide maximum flexibility."

---

### Question 7: "Why are all methods public (+) and all attributes private (-)?"

**Student Answer**:

> "This follows the core OOP principle of **Encapsulation**:
>
> **Private Attributes** (-):
>
> - Hide internal implementation
> - Prevent external code from corrupting state
> - Allow validation through methods
> - Enable refactoring without breaking API
>
> **Public Methods** (+):
>
> - Provide controlled access to functionality
> - Define stable interface (API contract)
> - Allow business logic enforcement
> - Document intended usage
>
> **Example**:
>
> ```
> class Report {
>   // ✗ Public attribute (no protection)
>   + status: string;
>
>   // Problem: Nothing stops this
>   report.status = "InvalidStatus"; // Corrupted data!
> }
>
> class Report {
>   // ✓ Private attribute with public method
>   - status: string;
>
>   + updateStatus(newStatus: string) {
>     if (!isValidStatus(newStatus)) {
>       throw Error("Invalid status");
>     }
>     this.status = newStatus;
>   }
> }
> ```
>
> **Benefits**:
>
> 1. **Validation**: Can't bypass business rules
> 2. **Logging**: Methods can log state changes
> 3. **Notification**: Methods can notify observers
> 4. **Refactoring**: Can change internal structure without breaking clients
>
> **Industry Standard**:
>
> - All major OOP languages default to private (Java, C#, Swift)
> - Public-by-default (Python, JavaScript) relies on convention
> - Best practice: Private data, public interface
>
> This is fundamental OOP - the 'black box' principle."

---

### Question 8: "Why no getters/setters shown in the diagram?"

**Student Answer**:

> "Class diagrams show **significant** methods, not boilerplate:
>
> **What We Show**:
>
> - Business logic methods: `updateStatus()`, `calculate()`
> - Operations: `loadReports()`, `exportPDF()`
> - Transformations: `getDetails()`, `export()`
>
> **What We Omit**:
>
> - Simple getters/setters (assumed)
> - Constructors (implied)
> - Trivial helpers (internal implementation)
>
> **Rationale**:
>
> - Clarity: Too many methods clutter diagram
> - Focus: Highlight important behavior
> - Assumption: Standard getters/setters exist
>
> **Example**:
>
> ```
> // Shown in diagram (business logic)
> + updateStatus(newStatus: string) void
>
> // Not shown (trivial getter)
> + getTitle() string
> + setTitle(title: string) void
> ```
>
> **When to Show Getters**:
>
> - If getter has complex logic: `getColor()` (calculates from status)
> - If getter is important to API: `getMetrics()` (returns DTO)
>
> **UML Best Practice**:
>
> - Show methods that convey design intent
> - Omit mechanical/automatic methods
> - Balance detail vs readability
>
> If needed for complete API documentation, getters can be added. But for architectural overview, we focus on meaningful behavior."

---

## SUMMARY: KEY TALKING POINTS

When defending this Class diagram, emphasize:

### 1. **Separation of Concerns**

- Each class has single, clear responsibility (SRP)
- MapView (display), Dashboard (analytics), Statistics (calculation)
- No god objects, no monolithic classes

### 2. **Appropriate Relationships**

- Composition (\*--) for exclusive ownership (MapView-Marker)
- Aggregation (o--) for shared components (Dashboard-Statistics)
- Association (-->) for collaboration (Dashboard-Filter)
- Dependency (..>) for loose coupling (Dashboard-PDFExporter)

### 3. **Encapsulation**

- Private attributes, public methods
- Controlled access through interface
- Validation and business logic enforcement

### 4. **Design Patterns**

- Facade (Dashboard)
- Strategy (Chart types)
- Builder (Filter)
- Observer (Marker clicks)

### 5. **Composition Over Inheritance**

- No deep hierarchies
- Flexible, loosely coupled design
- Runtime behavior changes possible

### 6. **Real-World Mapping**

- Classes reflect domain concepts
- Methods model actual operations
- Relationships mirror real dependencies

---

## FINAL DEFENSE STRATEGY

**When asked "Why did you design it this way?"**:

1. **Start with Functionality**: "Module 4 needs to display reports on a map and provide admin analytics"
2. **Explain Responsibilities**: "Each class has a focused responsibility following SRP"
3. **Justify Relationships**: "Composition for ownership, aggregation for sharing, dependency for loose coupling"
4. **Reference Patterns**: "We apply established patterns: Facade, Strategy, Builder"
5. **Emphasize Maintainability**: "Encapsulation and separation make the code testable and evolvable"
6. **Connect to ER Diagram**: "Classes implement the behavior for entities defined in ER diagram"

**Confidence Statement**:

> "This Class diagram represents a clean, well-structured object-oriented design. Each class has a clear purpose, relationships accurately reflect coupling levels, and the overall architecture follows SOLID principles. It's simple enough to understand quickly, yet flexible enough to accommodate future requirements."

---

**END OF CLASS DIAGRAM EXPLANATION**
