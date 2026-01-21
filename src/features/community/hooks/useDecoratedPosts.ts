// Hook za decorator pattern - dodaje badgeove prioritiy i highlighting

import { useMemo } from "react"
import { usePosts } from "./usePosts"
import {
  createDefaultDecoratorChain,
  type DecoratedPost,
  type PostDecoratorChain,
} from "../patterns/Decorator/PostDecorator"

interface UseDecoratedPostsOptions {
  decoratorChain?: PostDecoratorChain
  sortByPriority?: boolean
  onlyHighlighted?: boolean
}

interface UseDecoratedPostsResult {
  decoratedPosts: DecoratedPost[]
  isLoading: boolean
  error: Error | null
  // Helper za pronalazak posta po ID-u
  getPostById: (id: number) => DecoratedPost | undefined
  // Statistika
  stats: {
    total: number
    highlighted: number
    withBadges: number
  }
}

export function useDecoratedPosts(options: UseDecoratedPostsOptions = {}): UseDecoratedPostsResult {
  const { decoratorChain, sortByPriority = true, onlyHighlighted = false } = options

  // Fetch originalnih postova
  const { data: posts, isLoading, error } = usePosts()

  const chain = useMemo(() => decoratorChain ?? createDefaultDecoratorChain(), [decoratorChain])

  // Apply dekoratora na postove
  const decoratedPosts: DecoratedPost[] = useMemo(() => {
    if (!posts) return []

    // Dekoriraj use svi postovi
    let result: DecoratedPost[] = chain.decorateMany(posts)

    if (onlyHighlighted) {
      result = result.filter((post: DecoratedPost) => post.isHighlighted)
    }

    if (sortByPriority) {
      result = result.sort((a: DecoratedPost, b: DecoratedPost) => b.priority - a.priority)
    }

    return result
  }, [posts, chain, sortByPriority, onlyHighlighted])

  // Fetch post po idu
  const getPostById = (id: number): DecoratedPost | undefined => {
    return decoratedPosts.find((post: DecoratedPost) => post.id === id)
  }

  // Statistika
  const stats = useMemo(
    () => ({
      total: decoratedPosts.length,
      highlighted: decoratedPosts.filter((p: DecoratedPost) => p.isHighlighted).length,
      withBadges: decoratedPosts.filter((p: DecoratedPost) => p.badges.length > 0).length,
    }),
    [decoratedPosts]
  )

  return {
    decoratedPosts,
    isLoading,
    error,
    getPostById,
    stats,
  }
}
