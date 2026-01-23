/* LSP -> liskov substitution principle -> bazna klasa i njene podklase moraju biti zamjenjive.
    Dakle ako se glavna klasa koristi negdje, podklasa mora moći zamijeniti tu glavnu klasu bez problema.
    TL;DR: Podklasa mora vracati isti tip podatka i nikada ne smije bacati iznimke koje bazna klasa ne baca. */

import type { PostWithProfile } from "../hooks/usePosts"

// Interface za formatiranje postova
export interface IPostFormatter {
  formatDate(dateString: string): string
  formatContent(content: string, maxLength?: number): string
  formatPost(post: PostWithProfile): FormattedPost
}

export interface FormattedPost {
  id: number
  title: string
  content: string
  excerpt: string
  formattedDate: string
  authorName: string
  authorAvatar: string
}

// Bazna klasa za format postova, sve podklase moraju poštovati isti interface (IPostFormatter), isti input i output type
export abstract class BasePostFormatter implements IPostFormatter {
  // Formatiranje datuma u string
  abstract formatDate(dateString: string): string

  // Formatiranje contenta posta
  formatContent(content: string, maxLength?: number): string {
    if (maxLength && content.length > maxLength) {
      return content.substring(0, maxLength) + "..."
    }
    return content
  }

  // Formatiranje cijelog posta (contentm i ostalim podacima)
  abstract formatPost(post: PostWithProfile): FormattedPost

  // Helper metoda za kreiranje summarya/excerpta
  protected createExcerpt(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + "..."
  }
}

// Standardni formater -> pošutuje LSP jer može zamijentiti bilo koji IPostFormatter (outputi su istog tipa)
export class StandardPostFormatter extends BasePostFormatter {
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("hr-HR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatPost(post: PostWithProfile): FormattedPost {
    return {
      id: post.id,
      title: post.title,
      content: this.formatContent(post.content),
      excerpt: this.createExcerpt(post.content),
      formattedDate: this.formatDate(post.created_at),
      authorName: post.user?.username || "Anonymous",
      authorAvatar: post.user?.avatar_url || "/default-avatar.jpg",
    }
  }
}

// Relativni time format, prikazuje "prije X sati" umjesto datuma, može zamjeniti bilo koji IPostFormatter (vraca isti output type)
export class RelativeTimePostFormatter extends BasePostFormatter {
  // Vraca string i bez exceptiona tako da poštuje osnovnu klasu tj. LSP princip
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "upravo sada"
    if (diffInSeconds < 3600) return `prije ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `prije ${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 604800) return `prije ${Math.floor(diffInSeconds / 86400)} dana`

    return date.toLocaleDateString("hr-HR")
  }

  formatPost(post: PostWithProfile): FormattedPost {
    return {
      id: post.id,
      title: post.title,
      content: this.formatContent(post.content),
      excerpt: this.createExcerpt(post.content, 150),
      formattedDate: this.formatDate(post.created_at),
      authorName: post.user?.username || "Anonimno",
      authorAvatar: post.user?.avatar_url || "/default-avatar.jpg",
    }
  }
}

// Compact format -> sažeci i kraci datum, može zamijeniti bilo koji IPostFormatter (vraca isti output type)
export class CompactPostFormatter extends BasePostFormatter {
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  formatContent(content: string, maxLength: number = 50): string {
    return this.createExcerpt(content, maxLength)
  }

  formatPost(post: PostWithProfile): FormattedPost {
    return {
      id: post.id,
      title: post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title,
      content: this.formatContent(post.content, 50),
      excerpt: this.createExcerpt(post.content, 50),
      formattedDate: this.formatDate(post.created_at),
      authorName: post.user?.username?.substring(0, 10) || "Anon",
      authorAvatar: post.user?.avatar_url || "/default-avatar.jpg",
    }
  }
}

// Factory funkcija za kreiranje formatera po tipu
export function createFormatter(type: "standard" | "relative" | "compact"): IPostFormatter {
  switch (type) {
    case "relative":
      return new RelativeTimePostFormatter()
    case "compact":
      return new CompactPostFormatter()
    default:
      return new StandardPostFormatter()
  }
}
