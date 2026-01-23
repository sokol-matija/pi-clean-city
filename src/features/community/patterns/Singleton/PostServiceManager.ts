// Singleton pattern - upravlja servisima i konfiguracijom za postove (PostServiceManager upravlja svim servisima vezanim za postove)

import type { IPostRepository } from "../../interfaces/IPostRepository"
import type { IPostValidator } from "../../services/PostValidator"
import { SupabasePostRepository } from "../../repositories/SupabasePostRepository"
import { createBasicValidator } from "../../services/PostValidator"

// Konfiguracija za PostServiceManager
interface PostServiceConfig {
  maxPostLength: number
  minTitleLength: number
  enableModeration: boolean
  cacheDuration: number // u sekundama
}

// Defaultna konfiguracija
const DEFAULT_CONFIG: PostServiceConfig = {
  maxPostLength: 5000,
  minTitleLength: 3,
  enableModeration: false,
  cacheDuration: 300, // 5 minuta
}

export class PostServiceManager {
  // Privatna statička varijabla - drži jedinu instancu
  private static instance: PostServiceManager | null = null

  // Servisi kojima Singleton upravlja
  private readonly repository: IPostRepository
  private readonly validator: IPostValidator
  private config: PostServiceConfig

  // PRIVATNI CONSTRUCTOR - sprječava kreiranje izvana s 'new PostServiceManager()'
  private constructor(config: Partial<PostServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.repository = new SupabasePostRepository()
    this.validator = createBasicValidator()

    console.log("[Singleton] PostServiceManager instanca kreirana")
  }

  // STATIČKA METODA - jedini način za dobivanje instance
  public static getInstance(config?: Partial<PostServiceConfig>): PostServiceManager {
    // Lazy initialization - kreira instancu samo kad je prvi put potrebna
    PostServiceManager.instance ??= new PostServiceManager(config)
    return PostServiceManager.instance
  }

  // Getteri za servise
  public getRepository(): IPostRepository {
    return this.repository
  }

  public getValidator(): IPostValidator {
    return this.validator
  }

  public getConfig(): PostServiceConfig {
    return { ...this.config } // kopija da nema mutacije
  }

  // Metoda za update konfiguracije
  public updateConfig(newConfig: Partial<PostServiceConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log("[Singleton] Konfiguracija ažurirana:", this.config)
  }

  // Utility metode
  public isPostContentValid(content: string): boolean {
    return content.length <= this.config.maxPostLength && content.length > 0
  }

  public isTitleValid(title: string): boolean {
    return title.length >= this.config.minTitleLength
  }
}

// Export default instance za jednostavniju upotrebu
export const postServiceManager = PostServiceManager.getInstance()
