import { useState, useRef, useEffect, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUsers } from "@/features/community/hooks/useUsers"
import defaultAvatar from "@/assets/default_avatar.jpg"
import type { Profile } from "@/types/database.types"

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function MentionInput({ value, onChange, placeholder, className }: Readonly<MentionInputProps>) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [mentionSearch, setMentionSearch] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { data: users = [] } = useUsers()

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(mentionSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(mentionSearch.toLowerCase())
  )

  const findMentionStart = useCallback(
    (text: string, cursorPos: number): { start: number; search: string } | null => {
      let start = cursorPos - 1
      while (start >= 0) {
        const char = text[start]
        if (char === "@") {
          const search = text.substring(start + 1, cursorPos)

          if (!search.includes(" ")) {
            return { start, search }
          }
          return null
        }
        if (char === " " || char === "\n") {
          return null
        }
        start--
      }
      return null
    },
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const newCursorPos = e.target.selectionStart || 0

    onChange(newValue)
    setCursorPosition(newCursorPos)

    // pokazi suggestion ako je krenuo mention
    const mention = findMentionStart(newValue, newCursorPos)
    if (mention) {
      setMentionSearch(mention.search)
      setShowSuggestions(true)
      setSuggestionIndex(0)
    } else {
      setShowSuggestions(false)
      setMentionSearch("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || filteredUsers.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSuggestionIndex((prev) => (prev + 1) % filteredUsers.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSuggestionIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)
        break
      case "Enter":
      case "Tab":
        if (showSuggestions) {
          e.preventDefault()
          selectUser(filteredUsers[suggestionIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        break
    }
  }

  const selectUser = (user: Profile) => {
    const mention = findMentionStart(value, cursorPosition)
    if (!mention || !user.username) return

    const username = user.username
    const before = value.substring(0, mention.start)
    const after = value.substring(cursorPosition)
    const newValue = `${before}@${username} ${after}`

    onChange(newValue)
    setShowSuggestions(false)
    setMentionSearch("")

    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = mention.start + username.length + 2
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  // zatvaranje boxa nakon micanja fokusa
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />

      {/* Dropdown suggestiona */}
      {showSuggestions && filteredUsers.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute bottom-full left-0 z-50 mb-1 max-h-48 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {filteredUsers.slice(0, 5).map((user, index) => (
            <button
              key={user.id}
              type="button"
              onClick={() => selectUser(user)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors ${
                index === suggestionIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
              }`}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar_url || defaultAvatar} />
                <AvatarFallback>
                  {(user.username || "U").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username || "Unknown"}</span>
                {user.email && <span className="text-xs text-gray-500">{user.email}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MentionInput
