export interface PasswordHasher {
  hasher(password: string): Promise<string>
  compare(hash: string, password: string): Promise<boolean>
}