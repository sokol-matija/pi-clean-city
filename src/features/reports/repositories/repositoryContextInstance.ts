/**
 * Repository Context Instance
 *
 * This file contains only the context creation to satisfy React Fast Refresh.
 * Exported separately from the Provider component.
 */

import { createContext } from "react"
import type { RepositoryContextValue } from "./RepositoryContext"

export const RepositoryContext = createContext<RepositoryContextValue | null>(null)
