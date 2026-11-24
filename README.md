# Postcard UI - CE.SDK Starterkit

Built to facilitate optimal post- and greeting-card design, from changing accent colors and selecting fonts to custom messages and pictures. Built with [CE.SDK](https://img.ly/creative-sdk) and React by [IMG.LY](https://img.ly), featuring a step-by-step workflow for creating personalized greeting cards.

## Features

- **Three-Step Workflow**:
  - **Style**: Choose from pre-designed postcard templates
  - **Design**: Customize colors, images, and layout on the front
  - **Write**: Compose your message and customize typography on the back

- **Template Library**: Four beautiful pre-designed templates (Thank You, Merry Christmas, Bonjour Paris, Wish You Were Here)
- **Custom UI Components**: 50+ React components for a tailored editing experience
- **Asset Integration**: Unsplash integration, upload support, stickers, and shapes
- **Real-time Preview**: See your changes instantly in the canvas
- **Dual-Page Editing**: Separate front and back page customization

## Features and This Kit

This kit builds its own UI on the engine, so `cesdk.features` does not apply to it: features drive only the CE.SDK UI. Gate the controls in your own code.

## Getting Started

### Prerequisites

- Node.js 22+ and npm
- CE.SDK license key (set in `.env` as `VITE_CESDK_LICENSE`)

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Build

```bash
# Production build
npm run build
```

## Project Structure

```
src/
├── imgly/                        # CE.SDK glue layer (reusable)
│   ├── index.ts                  # Editor initialization function
│   ├── constants.ts              # Block names, asset source ids, font subset
│   ├── demo-assets.ts            # Demo asset URLs
│   ├── postcard-catalog.ts       # Postcard templates
│   ├── utils.ts                  # Color, placement, export and asset lookup helpers
│   ├── config/
│   │   └── actions.ts            # Postcard actions on the engine's Actions API
│   └── plugins/
│       ├── image-colors.ts       # Image colors asset source
│       └── unsplash.ts           # Unsplash asset source
├── app/                          # Postcard UI (application-specific)
│   ├── App.tsx                   # Root component: providers and the editor shell
│   ├── App.module.css            # App styles
│   ├── contexts/                 # Engine, editor, page settings, selection and single-page-mode contexts
│   ├── hooks/                    # Reactive state bridges (useEditMode, useHistory, …)
│   ├── components/               # Generic UI primitives (IconButton, Dropdown, …)
│   ├── features/                 # Editor panels grouped by feature
│   │   ├── text/                 # AddTextSecondary, ChangeFontSecondary, …
│   │   ├── image/                # AddImageSecondary, ImageAdjustmentBar, …
│   │   ├── shape/                # AddShapeSecondary, ShapesBar, …
│   │   ├── sticker/              # AddStickerSecondary, StickerBar, …
│   │   └── blocks/               # AddBlockBar, DeleteSelectedButton, BottomControls
│   ├── layout/                   # App shell & chrome
│   │   ├── PostcardUI/           # Root editor shell (switches between steps)
│   │   ├── ProcessNavigation/    # Step navigation (Style → Design → Write)
│   │   └── PageToolbar/          # Front/back page toolbars
│   ├── steps/                    # One screen per wizard step
│   │   └── ChooseTemplateStep/   # The "Style" step (template selection)
│   └── icons/                    # SVG icons (imported as React components)
└── index.tsx                     # Application entry point
```

## Architecture

The codebase is organized into two clearly separated layers.

### `src/imgly/` — CE.SDK glue (reusable)

Encapsulates the engine setup and the postcard operations:

- **`index.ts`** — `initPostcardEditor(engine)`: editor settings, role and scopes, asset sources, and the postcard actions.
- **`config/actions.ts`** — Registers the postcard operations (`addText`, `replaceFontOnSelection`, `exportToPdf`, `setColorByBlockName`, `setTextSizeByBlockName`, `setFontByBlockName`) on the engine's Actions API.
- **`plugins/`** — Engine-native asset sources (`unsplash.ts`, `image-colors.ts`).
- **`utils.ts`** — Stateless helpers: color conversion, block placement, download, and asset lookups (`findShapes`, `findStickers`, `findTypefaces`, …).
- **`constants.ts`** — Shared constants: `BLOCK_NAMES`, `ASSET_SOURCES`, `FONT_SUBSET`.

### `src/app/` — Postcard UI (application-specific)

Owns all React UI that is specific to the postcard use-case:

- **`contexts/`** — Engine lifecycle (`EngineContext`), domain state (`EditorContext` for template selection, scene loading and steps, `PageSettingsContext` for front/back colors, fonts and sizes), block selection (`SelectionContext`) and single-page-focus mode (`SinglePageModeContext`).
- **`hooks/`** — Reactive state bridges (`useEditMode`, `useHistory`, `useImageUpload`, `useSelectedProperty`).
- **`components/`** — Generic, reusable UI primitives (buttons, dropdowns incl. `ColorDropdown`, color pickers, layout primitives).
- **`features/`** — Editor panels grouped feature-first (`text/`, `image/`, `shape/`, `sticker/`, `blocks/`).
- **`layout/`** — App shell and chrome: `PostcardUI` (composition root that switches between steps), `ProcessNavigation` (the Style → Design → Write stepper), and `PageToolbar` (front/back page toolbars).
- **`steps/`** — One screen per wizard step (e.g. `ChooseTemplateStep`, the "Style" step). The steps themselves are listed in `ALL_STEPS` in `EditorContext`.

### Postcard actions

The postcard-specific operations live in `src/imgly/config/actions.ts`, and UI components run them with `engine.actions.run(...)`, for example `engine.actions.run('exportToPdf', pageId)`. Common operations such as `history.undo` or `selection.delete` are engine defaults and need no registration.

### Path aliases

| Alias | Maps to |
| ----- | ------- |
| `@/*` | `src/*` |

## Key Components

### Contexts

- **EditorContext**: Manages template selection, scene loading, step navigation, and asset discovery
- **PageSettingsContext**: Controls front/back page customization (colors, fonts, sizes)
- **EngineContext**: Wraps CE.SDK engine initialization
- **SinglePageModeContext**: Handles single-page focus mode with scroll support
- **SelectionContext**: Tracks currently selected blocks

### UI Components

The starterkit includes 50+ UI components organized by function:

- **Bottom Controls**: Main editing toolbar (AddImage, AddText, AddShape, AddSticker, etc.)
- **Secondary Toolbars**: Context-aware property panels
- **Dropdowns**: Color picker, font selector, text size selector
- **Canvas**: CE.SDK canvas wrapper
- **Navigation**: Process step navigation, undo/redo
- **Export**: PDF/PNG export functionality

## Customization

### Adding New Templates

Edit `src/imgly/postcard-catalog.ts`:

```typescript
export const POSTCARD_TEMPLATES: Record<string, PostcardTemplate> = {
  my_template: {
    name: 'My Template',
    colors: ['#FF0000', '#FFFFFF', '#000000'],
    preview: '/templates/my_template.png',
    scene: '/templates/my_template.scene',
    keyword: 'Search keyword for Unsplash'
  }
};
```

### Customizing the Workflow

Modify `ALL_STEPS` in `src/app/contexts/EditorContext.tsx` to add or remove steps:

```typescript
export const ALL_STEPS = ['Style', 'Design', 'Write', 'Review'] as const;
```

### Styling

All components use CSS modules for scoped styling. Global styles are defined in `index.html`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run check:syntax` - TypeScript strict-mode type checking

## Demo Assets

The demo assets for this starter kit load from the IMG.LY CDN by default, and
`.env.example` links a zip with them. To host them yourself, upload the
extracted files to your own server or CDN and set `VITE_DEMO_ASSETS_BASE_URL`
in `.env`:

```bash
VITE_DEMO_ASSETS_BASE_URL=https://cdn.yourdomain.com/demo-assets
```

The demo assets are intended for development and prototyping — replace
them with your own content or licensed stock assets before shipping to
production (see `DEMO-ASSETS-NOTICE.txt` in the download). This applies in
particular to media such as music tracks and stock imagery.

## License

See the main repository LICENSE file.

## Support

For questions and support, visit [img.ly/docs](https://img.ly/docs/cesdk/)
