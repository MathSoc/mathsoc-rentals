# CLAUDE.md

## Architecture

Next.js 16 (App Router) + React 19 frontend. All data operations proxy through Next.js API routes (`src/app/api/[resource]/route.ts`) to a backend worker at `WORKER_URL`, authenticated with `WORKER_API_KEY`.

## Key directories

- `src/app/components/` — shared UI primitives
- `src/app/data/[resource]/` — data management pages with create/modify drawer forms
- `src/app/util/worker-requests/[resource].ts` — client-side fetch utilities for each resource
- `src/app/util/types.ts` — all shared TypeScript types
- `src/app/api/[resource]/route.ts` — Next.js API routes that proxy to the worker

## Codebase patterns

### Conditional rendering
Prefer `? ... : null` over `&&` for conditional JSX.

```tsx
// good
{value ? <Thing /> : null}

// avoid
{value && <Thing />}
```

### Data fetching
Use React Query throughout. 

```tsx
const { data, isPending, isError } = useQuery({
  queryKey: ["resource", pageIndex],
  queryFn: () => getResource({ page_index: pageIndex, page_size: PAGE_SIZE }),
});

if (isPending) return <p>Loading...</p>;
if (isError) return <p>Failed to load resource.</p>;
```

### Mutations
All mutations follow this pattern. API payloads are always sent as an array `[payload]` for POST/PATCH.

```tsx
const { mutate, isPending } = useMutation({
  mutationFn: sendCreateResourceRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resource"] });
    addToast({ title: "Resource successfully created" });
    onSuccess();
  },
  onError: () => {
    addToast({ title: "Something went wrong. Please try again." });
  },
});
```

### Toast notifications
```tsx
const { add: addToast } = Toast.useToastManager();
addToast({ title: "..." });
```

### Layout components
Use `Column`, `Row`, `Centered` from `src/app/components/layout/layout-components.tsx`. These render divs with flex direction classes — `Column` gets class `"column"`, `Row` gets class `"row"`. `Page` wraps page content and accepts a `wide` boolean prop.

When writing SCSS for a container that can be either a `Row` or `Column`, target the rendered class:

```scss
.my-container {
  &.row { justify-content: flex-end; }
  &.column { align-items: baseline; }
}
```

### Form fields
Wrap each field in `<Column className="form-field">` with a `<label>` and the input.

### Buttons
`<Button variant="primary" | "white" | "alt" | "destructive" size?="small" | "default">`

### Drawers
Data pages open create/edit forms in a `DrawerPanel`. The drawer renders its children lazily — gate child render on the open condition:

```tsx
<DrawerPanel open={selected !== null} ...>
  {selected ? <ModifyForm item={selected} /> : null}
</DrawerPanel>
```

### SearchSelect
Use `SearchSelect` from `src/app/components/search-select/search-select.client.tsx` for async-searchable dropdowns. Requires an `onSearch` function that returns `SearchSelectItem[]` (`{ label, value }`).

### Worker request utilities
Each resource has a file at `src/app/util/worker-requests/[resource].ts` exporting:
- `get[Resource](page, expand?, filters?)` — paginated fetch with optional expand/filter
- `sendCreate[Resource]Request(payload)` — POST
- `sendModify[Resource]Request(payload)` — PATCH
- `sendDelete[Resource]Request(id)` — DELETE

The `expand` parameter is a string array of relation names (e.g. `["items", "active_rentals", "renters"]`) that the backend joins and returns as flat fields on the response objects.

### Stepper component
`src/app/components/stepper/stepper.tsx` — reusable visual progress indicator with numbered circles on a connecting line. Completed steps show a checkmark, active step is filled, pending steps are outlined.

```tsx
<Stepper steps={["Renter", "Details", "Review"]} currentStep={step} />
```

### Multi-step wizard pattern
Lift all state to a parent component. Each step is its own sub-component receiving only the props and callbacks it needs. The parent renders one step at a time using `? ... : null`.

### Debouncing
Use `useDebounced` and `useDebouncedState` from `src/app/util/hooks.ts`. Do not hand-roll debounce logic with `useRef` + `useEffect` — React's effect scheduling makes that pattern unreliable.

```tsx
// debounce a derived value (e.g. for a query key)
const debouncedQuery = useDebounced(inputValue.trim(), 500);

// debounce state itself (returns [debouncedValue, setValue])
const [debouncedSearch, setSearch] = useDebouncedState("", 500);
```

### Passing display data via URL params
When navigating to a page that only needs data for display (not mutation), pass it via URL search params to avoid an extra fetch. The server component page reads `searchParams` (a `Promise` in Next.js 16) and passes the values as props to the client component.

```tsx
// navigating
router.push(`/rent/${id}?item=${encodeURIComponent(name)}`);

// page.tsx (server component)
const { item } = await searchParams;
return <ClientComponent itemName={item ?? ""} />;
```
