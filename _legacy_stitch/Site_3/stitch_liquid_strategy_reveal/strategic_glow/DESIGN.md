```markdown
# Design System Document: Kinetic Luxury & The Digital Edge

## 1. Overview & Creative North Star: "The High-Velocity Curator"
This design system is engineered for **G Gabi Produções** to command authority in the high-end social media landscape. We are moving away from the static, "templated" look of typical agencies and toward a **High-Velocity Editorial** aesthetic.

**Creative North Star: The Kinetic Curator.**
The experience must feel like a high-end fashion film—liquid, fast, and uncomfortably precise. We break the rigid grid through intentional asymmetry, where "Electric Lime" elements slice through "Deep Black" voids. The aesthetic is defined by "Liquid Physics": elements don’t just appear; they flow, stretch, and settle with momentum. We utilize aggressive typography and chromatic aberration to signal that we aren't just following trends—we are glitching the status quo.

---

## 2. Colors: High-Voltage Contrast
The palette is a study in extreme "Tonal Tension." We use deep blacks to create infinite depth, punctuated by high-visibility accents.

### The "No-Line" Rule
**Standard borders are strictly prohibited.** To define sections, use background shifts. For example, a `surface-container-low` section should sit directly against the `background` to create a seamless, sophisticated transition. We define boundaries through mass and tone, not outlines.

### Surface Hierarchy & Nesting
*   **Background (#0e0e0e):** The infinite void. Everything starts here.
*   **Surface-Container-Lowest (#000000):** Used for "recessed" areas or deep-well inputs.
*   **Surface-Container-High (#201f1f):** Used for primary cards to create a subtle lift.
*   **Primary (#f4ffc7) & Primary-Container (#d0fc00):** Reserved for "Glow" moments. This is your "Electric Lime."

### The "Glass & Gradient" Rule
To achieve the "Silver Chrome" look, use semi-transparent `secondary` (#e2e2e2) values with a 20px `backdrop-blur`. Main CTAs should utilize a linear gradient from `primary` (#f4ffc7) to `primary-dim` (#c5f000) at a 135-degree angle to simulate light hitting a liquid surface.

---

## 3. Typography: Aggressive Modernism
We use **Space Grotesk** for impact and **Inter** for utility. The hierarchy is designed to feel like a premium digital magazine.

*   **Display & Headline (Space Grotesk):** Must be used in heavy weights (Bold/ExtraBold). For high-impact titles, apply **aggressive italics (12deg-15deg)** to convey movement and trend-setting speed.
*   **Body (Inter):** Keep tracking tight (-0.02em) for a modern, compact feel.
*   **Label (Inter):** All-caps with increased letter spacing (+0.05em) to act as "technical" metadata.

**Visual Signature:** Apply a subtle 1px "Chromatic Aberration" text-shadow (Red/Cyan) to `display-lg` titles on hover to reinforce the digital edge.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-standard." We use light and transparency to dictate hierarchy.

*   **The Layering Principle:** Stack `surface-container-highest` elements on top of `surface-dim` to create a natural, physical "step."
*   **Ambient Shadows:** If an element must float (e.g., a modal), use a shadow color derived from `surface-tint` at 5% opacity, with a 64px blur. It should look like a glow, not a shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` at 15% opacity. It should be felt, not seen.
*   **Liquid Glass:** Use `surface-variant` at 40% opacity with a heavy blur to create "Chrome" containers that feel like they are floating in a liquid environment.

---

## 5. Components: Precision Utilitarianism

### Buttons
*   **Primary:** `primary-container` background, `on-primary-container` text. High-radius (`full`). On hover, apply a slight "stretch" transform (scaleX: 1.05).
*   **Secondary (Chrome):** `secondary-container` with 60% opacity and backdrop-blur. 
*   **Tertiary:** No background. Bold italics with a `primary` underline that expands from center on hover.

### Cards & Lists
*   **No Dividers:** Separate list items with 16px of `surface-container-low` background or 24px of vertical white space. 
*   **Cards:** Use `surface-container-high`. Content should be asymmetrical—text aligned left, "Silver Chrome" accents or imagery bleeding off the right edge.

### Input Fields
*   **State:** Default state is a `surface-container-lowest` well. 
*   **Focus:** The border does not light up; instead, the background shifts to `surface-bright` and the label moves with a "liquid" easing (cubic-bezier(0.8, 0, 0.2, 1)).

### Signature Component: The "Glitch" Chip
*   A selection chip using `secondary` (Silver) that features a 2px Electric Lime "glitch" line on its left edge when active.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a `display-lg` title off-center to create visual tension.
*   **Embrace the Void:** Let the `background` color (#0e0e0e) breathe. High-end design is defined by what you leave out.
*   **Animate with Momentum:** Use "Heavy" easing for transitions—fast start, slow, oily finish.

### Don't:
*   **Don't use 1px solid borders:** They look cheap and "bootstrap." Use tonal shifts.
*   **Don't use centered layouts for everything:** It feels too safe. This agency is about "Strategic Glow"—it should feel slightly disruptive.
*   **Don't use generic grey:** Always tint your neutrals with a hint of the `primary` or `secondary` hue to maintain "Chrome" or "Lime" DNA.

---

**Director's Final Note:**
Every pixel should feel like it was placed by a high-fashion editor. If a screen looks "standard," break it. Stretch a font, blur a background, or push a container off-grid. We are selling the future of digital influence. Make it look like it.**```