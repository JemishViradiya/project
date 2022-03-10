# apps/dashboard

## Out of box configs

Out of box dashboard configurations will be automatically added to the side nav for new users when they log in to UES console. Older users can manually add them using the _Add new dashboard_ dialog.

### Adding new configs

- Json configurations for out of box dashboards should be added under `apps/dashboard/src/assets/config`
- `apps/dashboard/src/assets/config/index.ts` must be updated to include new configurations
- **dashboardId** must end with 'Dashboard'
- **title** must be the same as dashboardId to allow for localization.
- localization key for the new dashboard must be added to localization files under `libs/translations/src/navigation`

## Add widgets drawer

New widgets can be added to the _Add widgets_ drawer in `partials/dashboard/cronos/src/view/widgetLibrary.tsx`
