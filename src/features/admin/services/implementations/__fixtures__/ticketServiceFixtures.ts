// src/features/admin/services/implementations/__fixtures__/ticketServiceFixtures.ts

import type { Profile, Status } from '@/types/database.types'

export const mockCityServices: Profile[] = [
  {
    id: 'worker-1',
    username: 'Alice Johnson',
    email: 'alice@city.com',
    role: 'cityservice',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    avatar_url: null
  },
  {
    id: 'worker-2',
    username: 'Bob Smith',
    email: 'bob@city.com',
    role: 'cityservice',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    avatar_url:  null
  },
  {
    id: 'worker-3',
    username: 'Charlie Davis',
    email: 'charlie@city.com',
    role: 'cityservice',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    avatar_url: null
  }
]

export const mockStatuses: Status[] = [
  {
    id: 1,
    name: 'New',
    sort_order: 1,
    description: 'Newly reported',
    color: 'blue'
  },
  {
    id: 2,
    name: 'In Progress',
    sort_order: 2,
    description: 'Being worked on',
    color: 'orange'
  },
  {
    id: 3,
    name: 'Resolved',
    sort_order: 3,
    description: 'Issue resolved',
    color: 'green'
  },
  {
    id: 4,
    name: 'Closed',
    sort_order: 4,
    description:  'Ticket closed',
    color: 'gray'
  }
]