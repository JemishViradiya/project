import type { ShortUserItem, ShortZoneDetails, UserState } from '@ues-data/persona'
import type { CustomFilter, DateRangeFilter, SimpleFilter } from '@ues/behaviours'

export enum UserListColumnKey {
  Username = 'userName',
  State = 'state',
  LastOnline = 'lastEventTime',
  Zones = 'zones',
}

export interface UserListFilters {
  [UserListColumnKey.Username]?: SimpleFilter<ShortUserItem>
  [UserListColumnKey.State]?: SimpleFilter<UserState>
  [UserListColumnKey.Zones]?: SimpleFilter<ShortZoneDetails>
  [UserListColumnKey.LastOnline]?: CustomFilter<DateRangeFilter>
}
