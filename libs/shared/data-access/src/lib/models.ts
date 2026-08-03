/**
 * Core Domain Models for StreamHub Monorepo
 */

export interface Movie {
  id: number | string;
  title: string;
  description: string;
  poster: string;
  videoUrl: string;
  duration: string;
  rating: string;
  category?: string;
  match?: string;
}

export interface MovieCategory {
  name: string;
  movies: Movie[];
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatarBg?: string;
}

export interface AuthPayload {
  token: string;
  user: {
    email: string;
    name: string;
  };
}

export interface AuthMessageEventData {
  type: 'STREAMHUB_AUTH';
  payload: AuthPayload;
}
