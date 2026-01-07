//React components test

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import {
    createStatusBadge,
    createPriorityBadge,
    createAssignmentBadge,
    createCategoryBadge,
    BadgeRenderer
} from './BadgeFactory'
import type { Status, Profile } from '@/types/database.types'

//mock badgeConfig functions
vi.mock('@/features/reports/config/badgeConfig', () => ({
    getStatusBadgeVariant: vi.fn(() => 'default'),
    getPriorityBadgeVariant: vi.fn(() => 'default')
}))

describe('BadgeFactory', () => {
    describe('Factory Functions', () => {
        it('should create StatusBadge', () => {
            //ARRANGE
            const status: Status = { id: 1, name: 'New', sort_order: 1, description: null, color: '#FF0000' }

            //ACT
            const badge = createStatusBadge(status)

            //ASSERT
            expect(badge).toBeDefined()
            expect(badge).toHaveProperty('render')
            expect(badge).toHaveProperty('getLabel')
            expect(typeof badge.render).toBe('function')
            expect(typeof badge.getLabel).toBe('function')
        })


        it('should create PriorityBadge', () => {
            //ACT
            const badge = createPriorityBadge('High') //direktan poziv

            //ASSERT
            expect(badge).toBeDefined()
            expect(badge).toHaveProperty('render')
            expect(badge).toHaveProperty('getLabel')

        })

        it('should create AssignmentBadge', () => {
            //ARRANGE
            const worker: Profile = {
                id: 'worker-1',
                username: 'John Doe',
                email: 'john@example.com',
                role: 'cityservice',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                avatar_url: null
            }

            //ACT
            const badge = createAssignmentBadge(worker)

            //ASSERT
            expect(badge).toBeDefined()
            expect(badge).toHaveProperty('render')
            expect(badge).toHaveProperty('getLabel')
        })

        it('should create CategoryBadge', () => {
            //ACT
            const badge = createCategoryBadge('Graffiti')

            //ASSERT
            expect(badge).toBeDefined()
            expect(badge).toHaveProperty('render')
            expect(badge).toHaveProperty('getLabel')
        })
    })
    describe('StatusBadge', () => {
        it('should render status name when status is provided', () => {
            // ARRANGE
            const status: Status = {
                id: 1,
                name: 'In Progress',
                sort_order: 2,
                description: null,
                color: 'blue'
            }

            const badge = createStatusBadge(status)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('In Progress')
        })

        it('should render "Unknown" when status is null', () => {
            // ARRANGE
            const badge = createStatusBadge(null)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('Unknown')
        })

        it('should display "Unknown" when status is undefined', () => {
            // ARRANGE
            const badge = createStatusBadge(undefined)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('Unknown')
        })

        it('should return status name from getLabel', () => {
            const status: Status = {
                id: 1,
                name: 'Resolved',
                sort_order: 3,
                description: null,
                color: 'blue'
            }

            const badge = createStatusBadge(status)

            // ACT
            const label = badge.getLabel()

            // ASSERT
            expect(label).toBe('Resolved')
        })

        it('should return "Unknown" from getLabel when status is null', () => {
            //ARRANGE
            const badge = createStatusBadge(null)

            //ACT
            const label = badge.getLabel()

            //ASSERT
            expect(label).toBe('Unknown')
        })
    })

    describe('PriorityBadge', () => {
        it('should render priority value when provided', () => {
            //ARRANGE
            const badge = createPriorityBadge('High')

            //ACT
            const { container } = render(<>{badge.render()}</>)

            //ASSERT
            expect(container.textContent).toContain('High')
        })

        it('should render "N/A" when priority is null', () => {
            //ARRANGE
            const badge = createPriorityBadge(null)

            //ACT
            const { container } = render(<>{badge.render()}</>)

            //ASSERT
            expect(container.textContent).toContain('N/A')
        })

        it('should render "N/A" when priority is undefined', () => {
            //ARRANGE
            const badge = createPriorityBadge(undefined)

            //ACT
            const { container } = render(<>{badge.render()}</>)

            //ASSERT
            expect(container.textContent).toContain('N/A')
        })

        it('should return priority value from getLabel', () => {
            //ARRANGE
            const badge = createPriorityBadge('Low')

            //ACT
            const label = badge.getLabel()

            //ASSERT
            expect(label).toBe('Low')
        })
    })

    describe('AssignmentBadge', () => {
        it('should render worker username when provided', () => {
            // ARRANGE
            const worker: Profile = {
                id: 'worker-1',
                username: 'Alice Johnson',
                email: 'alice@city.com',
                role: 'cityservice',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                avatar_url: null
            }

            const badge = createAssignmentBadge(worker)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('Alice Johnson')
        })

        it('should display "Unassigned" when worker is null', () => {
            // ARRANGE
            const badge = createAssignmentBadge(null)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('Unassigned')
        })

        it('should fallback to email when username is null', () => {
            // ARRANGE
            const worker: Profile = {
                id: 'worker-1',
                username: null,
                email: 'worker@city.com',
                role: 'cityservice',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                avatar_url: null
            }

            const badge = createAssignmentBadge(worker)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('worker@city.com')
        })

        it('should return worker username from getLabel()', () => {
            // ARRANGE
            const worker: Profile = {
                id: 'worker-1',
                username: 'Bob Smith',
                email: 'bob@city.com',
                role: 'cityservice',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                avatar_url: null
            }

            const badge = createAssignmentBadge(worker)

            // ACT
            const label = badge.getLabel()

            // ASSERT
            expect(label).toBe('Bob Smith')
        })
    })

    describe('CategoryBadge', () => {
        it('should render category name when provided', () => {
            //ARRANGE
            const badge = createCategoryBadge('Graffiti')

            //ACT
            const { container } = render(<>{badge.render()}</>)

            //ASSERT
            expect(container.textContent).toContain('Graffiti')
        })

        it('should display "N/A" when category is null', () => {
            // ARRANGE
            const badge = createCategoryBadge(null)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('N/A')
        })

        it('should display "N/A" when category is undefined', () => {
            // ARRANGE
            const badge = createCategoryBadge(undefined)

            // ACT
            const { container } = render(<>{badge.render()}</>)

            // ASSERT
            expect(container.textContent).toContain('N/A')
        })

        it('should return category name from getLabel()', () => {
            // ARRANGE
            const badge = createCategoryBadge('Graffiti')

            // ACT
            const label = badge.getLabel()

            // ASSERT
            expect(label).toBe('Graffiti')
        })
    })

    describe('BadgeRenderer', () => {
        it('should render badge component output', () => {
            // ARRANGE
            const badge = createStatusBadge({
                id: 1,
                name: 'New',
                sort_order: 1,
                description: null,
                color: 'blue'
            })

            // ACT
            const { container } = render(<BadgeRenderer badge={badge} />)

            // ASSERT
            expect(container.textContent).toContain('New')
        })

        it('should render different badge types', () => {
            // ARRANGE
            const priorityBadge = createPriorityBadge('high')

            // ACT
            const { container } = render(<BadgeRenderer badge={priorityBadge} />)

            // ASSERT
            expect(container.textContent).toContain('high')
        })
    })
})
