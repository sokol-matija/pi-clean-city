# CleanCity - Figma Wireframe Workflow

**Figma File:** [Test - CleanCity Wireframes](https://www.figma.com/design/IKDSx67qiKJAqcGeGe0EkB/Test?node-id=0-1&p=f&t=2I5IeaVvBjbjFQJU-0)

Last updated: 2025-11-17

---

## Wireframe Fidelity Levels

### Low-Fidelity Wireframes (Lo-Fi)

**Purpose:** Quick ideation, layout exploration, user flow validation

**Characteristics:**

- Black, white, and gray only
- Boxes and placeholders instead of real content
- Simple shapes (rectangles, circles, lines)
- Minimal detail
- Focus on structure and hierarchy
- Fast to create and iterate

**When to Use:**

- Initial design exploration
- Team brainstorming sessions
- Getting quick feedback on layout
- Testing user flows
- Before investing in detailed design

**Time Investment:** 15-30 minutes per screen

---

### High-Fidelity Wireframes (Hi-Fi)

**Purpose:** Detailed design, developer handoff, stakeholder presentations

**Characteristics:**

- Full color palette
- Real or realistic content
- Detailed UI components
- Actual images and icons
- Typography hierarchy
- Interactive states (hover, active, disabled)
- Spacing and alignment precision

**When to Use:**

- After lo-fi approval
- Developer handoff
- Client presentations
- Usability testing
- Final design decisions

**Time Investment:** 1-3 hours per screen

---

## Recommended Workflow

### Phase 1: Lo-Fi Wireframes (Week 1)

1. Create all Priority 1 screens as lo-fi wireframes
2. Review with team
3. Test user flows
4. Iterate quickly based on feedback
5. Get approval before moving to hi-fi

### Phase 2: Hi-Fi Wireframes (Week 2-3)

1. Convert approved lo-fi screens to hi-fi
2. Build component library
3. Add real content and styling
4. Create interactive prototype
5. Conduct usability testing

### Phase 3: Developer Handoff (Week 4)

1. Finalize all screens
2. Document component specs
3. Export assets
4. Create design system documentation

---

## Figma File Organization

### Recommended Page Structure

```
📄 Page 1: Cover & Index
   └── Project overview, screen index, design system info

📄 Page 2: Lo-Fi - Public/Citizen Screens
   ├── 1. Landing Page / Homepage
   ├── 2. Interactive Map View
   ├── 3. Report Submission Form
   ├── 4. Report Details Modal
   ├── 5. User Authentication (Login/Register)
   └── 6. My Reports Dashboard

📄 Page 3: Lo-Fi - Municipal Worker Screens
   ├── 7. Worker Dashboard
   ├── 8. Report Management Table
   └── 9. Report Processing View

📄 Page 4: Lo-Fi - Admin Screens
   ├── 10. Admin Dashboard
   ├── 11. User Management
   └── 12. Analytics Dashboard

📄 Page 5: User Flows
   ├── Citizen: Submit Report Flow
   ├── Worker: Process Report Flow
   └── Admin: View Statistics Flow

📄 Page 6: Hi-Fi - Public/Citizen Screens
   └── (Same structure as Lo-Fi, but detailed)

📄 Page 7: Hi-Fi - Municipal Worker Screens
   └── (Same structure as Lo-Fi, but detailed)

📄 Page 8: Hi-Fi - Admin Screens
   └── (Same structure as Lo-Fi, but detailed)

📄 Page 9: Component Library
   ├── Buttons
   ├── Form Elements
   ├── Cards
   ├── Modals
   ├── Navigation
   ├── Map Components
   └── Status Badges

📄 Page 10: Style Guide
   ├── Colors
   ├── Typography
   ├── Icons
   ├── Spacing
   └── Breakpoints
```

---

## Frame/Artboard Sizes

### Desktop Screens

- **Width:** 1440px (standard desktop)
- **Height:** Variable (based on content)

### Tablet Screens (Optional)

- **Width:** 768px
- **Height:** 1024px

### Mobile Screens (Optional)

- **Width:** 375px (iPhone standard)
- **Height:** 812px

### Modals

- **Width:** 600px - 800px
- **Height:** Variable

---

## Lo-Fi Wireframe Kit

### Essential Elements to Create

#### 1. Basic Shapes

- Rectangle (for containers, buttons, images)
- Circle (for avatars, icons)
- Line (for dividers)

#### 2. Text Placeholders

- Heading: **Bold, 24-32px**
- Subheading: **Semibold, 18-20px**
- Body: Regular, 14-16px
- Caption: Regular, 12px

#### 3. Common Components

- **Header/Navigation Bar**
  - Logo placeholder (rectangle)
  - Menu items (text)
  - User avatar (circle)

- **Button**
  - Rectangle with rounded corners
  - Text label
  - States: Default, Hover, Disabled

- **Input Field**
  - Rectangle outline
  - Label text
  - Placeholder text

- **Card**
  - Container rectangle
  - Image placeholder (gray rectangle)
  - Title and description text

- **Map Placeholder**
  - Large rectangle with diagonal lines
  - "Map View" label

- **Table**
  - Grid of rectangles
  - Header row
  - Data rows

#### 4. Icons (Simple Shapes)

- Menu: Three horizontal lines
- Search: Circle with line
- Filter: Inverted triangle
- Close: X
- Add: Plus sign
- User: Circle + semicircle

---

## Priority 1 Screens - Lo-Fi Specifications

### Screen 1: Landing Page / Homepage

**Layout:**

```
┌─────────────────────────────────────────┐
│ [Logo]  Home  Map  Reports  [Login/Register] │ ← Header (80px)
├─────────────────────────────────────────┤
│                                         │
│    INTERACTIVE MAP (Full Width)         │
│    [Gray rectangle with map icon]       │
│                                         │
│  🔴 New  🟡 In Progress  🟢 Resolved    │ ← Legend
│                                         │
│  [Filter Panel - Side]                  │
│  □ Status ▼                            │
│  □ Category ▼                          │
│  □ Date Range                          │
│  □ Location ▼                          │
│  [Apply Filters Button]                │
│                                         │
├─────────────────────────────────────────┤
│           [Submit Report CTA]           │ ← Sticky button
└─────────────────────────────────────────┘
```

**Components:**

- Header: 1440px × 80px
- Map: 1440px × 600px
- Filter panel: 300px × auto
- CTA button: Full width × 60px

---

### Screen 2: Report Submission Form

**Layout:**

```
┌─────────────────────────────────────────┐
│ [Back Arrow]  Submit New Report         │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  [Photo Upload Area]                    │
│  ┌───────────────────────────┐         │
│  │   [Camera Icon]           │         │
│  │   Click to upload photo   │         │
│  │   (Required)              │         │
│  └───────────────────────────┘         │
│                                         │
│  Category *                             │
│  [Dropdown ▼]                          │
│                                         │
│  Location *                             │
│  [Map + Address Input]                  │
│                                         │
│  Description *                          │
│  [Text area - 4 rows]                   │
│                                         │
│  [Cancel Button]  [Submit Button]       │
│                                         │
└─────────────────────────────────────────┘
```

**Validation States:**

- Empty fields: Red border + error message
- Valid fields: Green checkmark
- Required fields marked with \*

---

### Screen 3: Report Details Modal

**Layout:**

```
┌─────────────────────────────────────────┐
│  Report #12345        [X Close]         │
├─────────────────────────────────────────┤
│                                         │
│  [Photo Gallery - Large Image]          │
│  [Thumbnail] [Thumbnail] [Thumbnail]    │
│                                         │
│  🟡 In Progress                         │ ← Status Badge
│                                         │
│  Broken Street Light                    │ ← Title
│  Category: Street Lighting              │
│  Submitted: Nov 15, 2025                │
│  Location: Main St & 5th Ave           │
│                                         │
│  Description:                           │
│  [Lorem ipsum dolor sit amet...]        │
│                                         │
│  ──────────────────────────────────     │
│                                         │
│  Timeline                               │
│  ● Submitted - Nov 15, 10:30 AM         │
│  ● Assigned to Worker - Nov 15, 2:00 PM │
│  ● In Progress - Nov 16, 9:00 AM        │
│                                         │
│  ──────────────────────────────────     │
│                                         │
│  Comments (3)                           │
│  [User Avatar] John Doe                 │
│  "Working on this today"                │
│                                         │
│  [Add Comment Input]                    │
│  [Post Comment Button]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

### Screen 4: Worker Dashboard

**Layout:**

```
┌─────────────────────────────────────────┐
│ CleanCity  Dashboard  Reports  [Profile] │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  Welcome, Worker Name                   │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │  15 │  │  8  │  │  5  │  │  2  │   │ ← Metrics Cards
│  │Assigned│ Active │ Today │Priority│   │
│  └─────┘  └─────┘  └─────┘  └─────┘   │
│                                         │
│  My Assigned Reports                    │
│  [Search] [Filter ▼] [Sort ▼]         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ID    │ Status  │ Category │ Date │  │ ← Table
│  ├─────────────────────────────────┤   │
│  │ #123  │ 🟡 Active│ Pothole │ Nov 15│  │
│  │ #124  │ 🔴 New   │ Trash   │ Nov 16│  │
│  │ #125  │ 🟡 Active│ Light   │ Nov 16│  │
│  └─────────────────────────────────┘   │
│                                         │
│  [Load More]                            │
│                                         │
└─────────────────────────────────────────┘
```

---

### Screen 5: Admin Dashboard

**Layout:**

```
┌─────────────────────────────────────────┐
│ CleanCity  Dashboard  Users  [Profile]  │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  Statistics Dashboard                   │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ 156 │  │  42 │  │ 98  │  │ 2.5 │   │ ← KPI Cards
│  │Total│  │Pending│ │Resolved│ │Days│   │
│  └─────┘  └─────┘  └─────┘  └─────┘   │
│                                         │
│  Filters: [Date Range] [Location ▼]    │
│           [Export PDF]                  │
│                                         │
│  ┌──────────────────┐ ┌──────────────┐ │
│  │                  │ │              │ │
│  │  Reports Over    │ │  By Category │ │ ← Charts
│  │  Time (Line)     │ │  (Pie Chart) │ │
│  │                  │ │              │ │
│  └──────────────────┘ └──────────────┘ │
│                                         │
│  Recent Activity                        │
│  ┌─────────────────────────────────┐   │
│  │ Time   │ Event          │ User  │   │
│  ├─────────────────────────────────┤   │
│  │ 10:30  │ Report #123    │ John  │   │
│  │ 10:45  │ Status Updated │ Sarah │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Design System Guidelines (For Hi-Fi)

### Color Palette

#### Primary Colors

- **Primary Blue:** #2196F3 (CTAs, links, active states)
- **Primary Dark:** #1976D2 (hover states)

#### Status Colors

- **New/Pending:** #FF6B6B (red-orange)
- **In Progress:** #FFD93D (yellow)
- **Resolved:** #6BCF7F (green)
- **Closed:** #95A5A6 (gray)

#### Neutral Colors

- **Text Primary:** #212121
- **Text Secondary:** #757575
- **Background:** #FFFFFF
- **Background Secondary:** #F5F5F5
- **Border:** #E0E0E0

#### Semantic Colors

- **Success:** #4CAF50
- **Error:** #F44336
- **Warning:** #FF9800
- **Info:** #2196F3

---

### Typography

#### Font Family

- **Primary:** Inter or Roboto (clean, modern, readable)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

#### Type Scale

- **H1:** 32px / Bold / Line height 40px
- **H2:** 24px / Bold / Line height 32px
- **H3:** 20px / Semibold / Line height 28px
- **H4:** 18px / Semibold / Line height 24px
- **Body Large:** 16px / Regular / Line height 24px
- **Body:** 14px / Regular / Line height 20px
- **Caption:** 12px / Regular / Line height 16px

---

### Spacing System (8px Grid)

- **XXS:** 4px
- **XS:** 8px
- **S:** 16px
- **M:** 24px
- **L:** 32px
- **XL:** 48px
- **XXL:** 64px

---

### Component Specifications

#### Buttons

**Primary Button:**

- Height: 40px
- Padding: 12px 24px
- Border radius: 4px
- Background: Primary Blue
- Text: White, 14px, Semibold

**Secondary Button:**

- Height: 40px
- Padding: 12px 24px
- Border radius: 4px
- Background: Transparent
- Border: 1px solid Primary Blue
- Text: Primary Blue, 14px, Semibold

**States:**

- Hover: Darken 10%
- Active: Darken 20%
- Disabled: 40% opacity

---

#### Input Fields

**Text Input:**

- Height: 40px
- Padding: 8px 12px
- Border: 1px solid #E0E0E0
- Border radius: 4px
- Font: 14px, Regular

**States:**

- Focus: Border color Primary Blue, 2px width
- Error: Border color Error Red
- Disabled: Background #F5F5F5, 60% opacity

**Label:**

- Font: 14px, Semibold
- Margin bottom: 8px

---

#### Cards

**Standard Card:**

- Padding: 24px
- Border radius: 8px
- Background: White
- Shadow: 0px 2px 8px rgba(0, 0, 0, 0.1)

**Hover State:**

- Shadow: 0px 4px 16px rgba(0, 0, 0, 0.15)
- Transform: translateY(-2px)

---

## Lo-Fi Creation Steps (Figma)

### Step 1: Set Up Your Workspace

1. Rename "Page 1" to "Cover & Index"
2. Create additional pages as outlined above
3. Add project description and screen index

### Step 2: Create Frame Template

1. Press `F` or select Frame tool
2. Choose Desktop frame (1440px width)
3. Duplicate for each screen
4. Name frames clearly (e.g., "1. Landing Page - Lo-Fi")

### Step 3: Build Lo-Fi Components

1. Use Rectangle tool (`R`) for all containers
2. Use Text tool (`T`) for labels
3. Use Line tool (`L`) for dividers
4. Keep it SIMPLE - boxes and text only
5. Use gray fills (#F5F5F5) for image placeholders
6. Use dark gray text (#757575)

### Step 4: Add Annotations

1. Use red text for notes/comments
2. Add arrows to show interactions
3. Number elements for reference
4. Document user flows with arrows

### Step 5: Present for Feedback

1. Use Figma's presentation mode
2. Share link with team
3. Collect feedback using comments
4. Iterate quickly

---

## Hi-Fi Creation Steps (After Lo-Fi Approval)

### Step 1: Build Component Library

1. Create master components for:
   - Buttons (all variants)
   - Input fields
   - Cards
   - Navigation
   - Status badges
   - Icons
2. Use Auto Layout for responsive components
3. Add variants for different states

### Step 2: Apply Design System

1. Create color styles
2. Create text styles
3. Apply to all components
4. Ensure consistency

### Step 3: Add Real Content

1. Replace placeholder text with realistic content
2. Use real or stock images
3. Add proper icons (Heroicons, Material Icons)
4. Ensure proper spacing

### Step 4: Create Interactive Prototype

1. Link frames to show user flows
2. Add hover states
3. Add transitions
4. Test prototype thoroughly

### Step 5: Developer Handoff

1. Organize layers properly
2. Add component descriptions
3. Export assets (SVG for icons, PNG for images)
4. Document spacing and measurements

---

## Tips for Success

### Lo-Fi Wireframes

✅ **DO:**

- Keep it simple and fast
- Focus on layout and hierarchy
- Use consistent spacing
- Label everything clearly
- Test user flows early

❌ **DON'T:**

- Add colors (except grays)
- Spend time on details
- Use real images
- Perfect pixel alignment
- Add fancy effects

### Hi-Fi Wireframes

✅ **DO:**

- Follow the design system strictly
- Pay attention to details
- Use real/realistic content
- Test on different screen sizes
- Document component usage

❌ **DON'T:**

- Deviate from approved lo-fi structure
- Use inconsistent spacing
- Forget accessibility
- Skip states (hover, active, etc.)
- Ignore developer feedback

---

## Next Action Items

### Immediate (Today)

1. ✅ Review this workflow document
2. ⏳ Reorganize Figma file pages
3. ⏳ Create first lo-fi screen (Landing Page)
4. ⏳ Get team feedback

### This Week

1. ⏳ Complete all 5 Priority 1 lo-fi screens
2. ⏳ Create user flow diagrams
3. ⏳ Team review meeting
4. ⏳ Iterate based on feedback

### Next Week

1. ⏳ Start hi-fi wireframes
2. ⏳ Build component library
3. ⏳ Apply design system
4. ⏳ Create interactive prototype

---

## Resources

### Figma Learning

- [Figma Official Tutorial](https://www.figma.com/resources/learn-design/)
- [Wireframing Best Practices](https://www.figma.com/blog/how-to-wireframe/)
- [Design Systems in Figma](https://www.figma.com/best-practices/components-styles-and-shared-libraries/)

### Inspiration

- [Dribbble - Dashboard Designs](https://dribbble.com/search/dashboard)
- [Behance - Admin Panels](https://www.behance.net/search/projects?search=admin%20dashboard)
- [Mobbin - Mobile Patterns](https://mobbin.com/)

### Icon Libraries

- [Heroicons](https://heroicons.com/) - Clean, modern icons
- [Material Icons](https://fonts.google.com/icons) - Google's icon set
- [Feather Icons](https://feathericons.com/) - Simple, beautiful icons

### Stock Images (For Hi-Fi)

- [Unsplash](https://unsplash.com/)
- [Pexels](https://www.pexels.com/)
- [Lorem Picsum](https://picsum.photos/) - Placeholder images

---

**Good luck with your wireframes! Start with lo-fi, get feedback, then move to hi-fi. Keep it simple and iterate quickly!** 🎨
