/**
 * Maps Notice property keys to their human-readable descriptions.
 */
export const NoticePropertyDescriptions: Record<keyof Notice, string> = {
  id: 'Unique identifier for the notice',
  title: 'Title of the notice',
  content: 'Main content or body of the notice',
  author: 'Author or creator of the notice',
  createdAt: 'ISO date string when the notice was created',
  location: 'Optional location information for the notice',
};
/**
 * Represents a notice or post on the notice board.
 */
export interface Notice {
  /** Unique identifier for the notice */
  id: number;
  /** Title of the notice */
  title: string;
  /** Main content or body of the notice */
  content: string;
  /** Author or creator of the notice */
  author: string;
  /** ISO date string when the notice was created */
  createdAt: string;
  /** Optional location information for the notice */
  location?: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  author: string;
  location?: Location;
}
