// Decorator pattern - dodaje nove funkcionalnosti objektu bez mjenjanja originalne klase u ovom slucaju na postove dodaje badgeove

import type { PostWithProfile } from "../../hooks/usePosts"

// Extendanje originalnog posta s badgeovima i svojstvima
export interface DecoratedPost extends PostWithProfile {
  badges: PostBadge[]
  priority: number
  isHighlighted: boolean
}

// Tipovi badge-a koje možemo dodati
export interface PostBadge {
  type: "new" | "popular" | "trending" | "pinned" | "verified"
  label: string
  color: string
  icon?: string
}

// Bazni interface za sve dekoratore
export interface IPostDecorator {
  decorate(post: PostWithProfile): DecoratedPost
}

// Helper funkcija za kreiranje baznog dekoriranog posta
function createBaseDecoratedPost(post: PostWithProfile): DecoratedPost {
  return {
    ...post,
    badges: [],
    priority: 0,
    isHighlighted: false,
  }
}

// NewPostDecorator - novi postovi manji od 24h su "novi"
export class NewPostDecorator implements IPostDecorator {
  private readonly hoursThreshold: number

  constructor(hoursThreshold: number = 24) {
    this.hoursThreshold = hoursThreshold
  }

  decorate(post: PostWithProfile): DecoratedPost {
    const decorated = createBaseDecoratedPost(post)
    const postDate = new Date(post.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff <= this.hoursThreshold) {
      decorated.badges.push({
        type: "new",
        label: "Novo",
        color: "bg-green-500",
        icon: "✨", // https://emojipedia.org/sparkles
      })
      decorated.priority += 1
    }

    return decorated
  }
}

// PopularPostDecorator - označava postove s visokim ratingom kao "popularne"
export class PopularPostDecorator implements IPostDecorator {
  private readonly ratingThreshold: number

  constructor(ratingThreshold: number = 4) {
    this.ratingThreshold = ratingThreshold
  }

  decorate(post: PostWithProfile): DecoratedPost {
    const decorated = createBaseDecoratedPost(post)

    if (post.averageRating !== null && post.averageRating >= this.ratingThreshold) {
      decorated.badges.push({
        type: "popular",
        label: "Popularno",
        color: "bg-yellow-500",
        icon: "⭐", // https://emojipedia.org/star
      })
      decorated.priority += 2
      decorated.isHighlighted = true
    }

    return decorated
  }
}

// TrendingPostDecorator - označava postove koji su trending (nedavni s dobrim ratingom)
export class TrendingPostDecorator implements IPostDecorator {
  decorate(post: PostWithProfile): DecoratedPost {
    const decorated = createBaseDecoratedPost(post)
    const postDate = new Date(post.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)

    // Trending = mlađe od 48h i ima rating iznad 3.5
    const isRecent = hoursDiff <= 48
    const hasGoodRating = post.averageRating !== null && post.averageRating >= 3.5

    if (isRecent && hasGoodRating) {
      decorated.badges.push({
        type: "trending",
        label: "U trendu",
        color: "bg-orange-500",
        icon: "🔥", // https://emojipedia.org/fire
      })
      decorated.priority += 3
      decorated.isHighlighted = true
    }

    return decorated
  }
}

// VerifiedAuthorDecorator - označava postove verificiranih autora
export class VerifiedAuthorDecorator implements IPostDecorator {
  private readonly verifiedUserIds: Set<string>

  constructor(verifiedUserIds: string[] = []) {
    this.verifiedUserIds = new Set(verifiedUserIds)
  }

  decorate(post: PostWithProfile): DecoratedPost {
    const decorated = createBaseDecoratedPost(post)

    if (post.userId !== null && this.verifiedUserIds.has(post.userId)) {
      decorated.badges.push({
        type: "verified",
        label: "Verificirano",
        color: "bg-blue-500",
        icon: "✔️", // https://emojipedia.org/check-mark
      })
    }

    return decorated
  }
}

// PostDecoratorChain - omogućuje lančano primjenjivanje više dekoratora
export class PostDecoratorChain {
  private readonly decorators: IPostDecorator[] = []

  addDecorator(decorator: IPostDecorator): this {
    this.decorators.push(decorator)
    return this
  }

  decorate(post: PostWithProfile): DecoratedPost {
    const decorated = createBaseDecoratedPost(post)

    // Primjenjujemo sve dekoratore redom
    for (const decorator of this.decorators) {
      const result = decorator.decorate(post)
      // Spajamo badge-ove i uzimamo maksimalni priority
      decorated.badges = [...decorated.badges, ...result.badges]
      decorated.priority = Math.max(decorated.priority, result.priority)
      decorated.isHighlighted = decorated.isHighlighted || result.isHighlighted
    }

    return decorated
  }

  decorateMany(posts: PostWithProfile[]): DecoratedPost[] {
    return posts.map((post) => this.decorate(post))
  }
}

// Factory funkcija za kreiranje default dekorator lanca

export function createDefaultDecoratorChain(): PostDecoratorChain {
  return new PostDecoratorChain()
    .addDecorator(new NewPostDecorator(24))
    .addDecorator(new PopularPostDecorator(4))
    .addDecorator(new TrendingPostDecorator())
}

export function createMinimalDecoratorChain(): PostDecoratorChain {
  return new PostDecoratorChain().addDecorator(new NewPostDecorator(12))
}
