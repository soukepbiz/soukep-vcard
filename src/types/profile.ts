export interface SocialLink {
  id: string
  platform: string
  title: string
  url: string
  order: number
}

export interface PhoneNumber {
  id: string
  label: string
  number: string
  order: number
}

export interface ProfileEmail {
  id: string
  label: string
  email: string
  order: number
}

export interface Profile {
  id: string
  username: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  job_title: string | null
  company: string | null
  bio: string | null
  bio_title: string | null
  avatar_url: string | null
  cover_url: string | null
  social_links: SocialLink[]
  phone_numbers: PhoneNumber[]
  emails: ProfileEmail[]
  location: string | null
  accent_color: string | null
  text_color: string | null
  is_published: boolean
  subscription_type: 'free' | 'premium' | 'lifetime'
  subscription_expires_at: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export type SubscriptionType = 'free' | 'premium' | 'lifetime'
