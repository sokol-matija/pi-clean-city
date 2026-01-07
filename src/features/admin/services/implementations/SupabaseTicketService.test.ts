// SupabaseTicketService.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest"; //Vitest function for testing
import {SupabaseTicketService} from './SupabaseTicketService'
import type { TicketUpdatePayload } from "../interfaces/ITicketService";

//chain of mocks for supabase client methods
// const mockEq = vi.fn(() => Promise.resolve({ data: null, error: null }));
// const mockUpdate = vi.fn(() => ({ eq: mockEq }));
// const mockFrom = vi.fn(() => ({ update: mockUpdate }));

// Using vi.hoisted to ensure mocks are created before imports
const {mockEq, mockUpdate, mockFrom} = vi.hoisted(() => {
    const mockEq = vi.fn(() => Promise.resolve({ data: null, error: null }));
    const mockUpdate = vi.fn(() => ({ eq: mockEq }));
    const mockFrom = vi.fn(() => ({ update: mockUpdate }));

    return { mockEq, mockUpdate, mockFrom };
});

//Mock Supabase client
//vi - Vitest mock utility - fake verzije funkcija/objekata
// mockamo supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: mockFrom
    }
}))

import { supabase } from "@/lib/supabase";

//describe() - Test suite - grupira povezane testove
describe('SupabaseTicketService', () => {
    let service: SupabaseTicketService //dostupna svima u describe bloku

    beforeEach(() => {
        service = new SupabaseTicketService() //svaki test dobiva novu instancu
        vi.clearAllMocks()
    })

    describe('updateTicket', () => {
        it('should update ticket successfully when Supabase returns no error', async () => {
            //testovi
            //ARRANGE
            const ticketId = 'test-ticket-123'
            const changes: TicketUpdatePayload = {
                priority: 'high',
                status_id: 2,
                assigned_worker_id: 'worker-456'
            }

            //ACT
            await service.updateTicket(ticketId, changes) //poziva stvarni kod

            //LOG
            console.log('mockFrom pozvan:', mockFrom. mock.calls.length, 'puta')
            console.log('mockUpdate pozvan sa:', mockUpdate.mock.calls[0])
            console.log('mockEq pozvan sa:', mockEq. mock.calls[0])

            //ASSERT
            // expect(true).toBe(true) //placeholder assert

            expect(supabase.from).toHaveBeenCalled() //provjerava da je supabase.from pozvan
            expect(supabase.from).toHaveBeenCalledWith('report') //provjerava da je pozvan s 'report' argumentom
            expect(supabase.from).toHaveBeenCalledTimes(1) //provjerava da je pozvan tocno jendom

            expect(mockUpdate).toHaveBeenCalled() //provjerava da je mockUpdate pozvan
            expect(mockUpdate).toHaveBeenCalledWith(changes) //provjerava da je pozvan s changes argumentom
            expect(mockUpdate).toHaveBeenCalledTimes(1) //provjerava da je pozvan tocno jednom

            expect(mockEq).toHaveBeenCalled() //provjerava da je mockEq pozvan
            expect(mockEq).toHaveBeenCalledWith('id', ticketId) //provjerava da je pozvan s 'id' i ticketId argumentima
            expect(mockEq).toHaveBeenCalledTimes(1) //provjerava da je pozvan tocno jednom



    })
})
})
