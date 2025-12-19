/* 
    SRP Prinicple
    Manage ticket details modal state

    This hook is responisble only for modal state
*/

import { ReportWithRelations } from "@/types/database.types";
import { useCallback, useState } from "react";

interface UseTicketModalReturn {
    selectedTicket: ReportWithRelations | null
    isModalOpen: boolean
    openModal: (ticket: ReportWithRelations) => void
    closeModal: () => void
}

export function useTicketModal(): UseTicketModalReturn {
    const[selectedTicket, setSelectedTicket] = useState<ReportWithRelations | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = useCallback((ticket: ReportWithRelations) => {
        setSelectedTicket(ticket)
        setIsModalOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedTicket(null)
    }, [])

    return {
        selectedTicket,
        isModalOpen,
        openModal,
        closeModal
    }
}