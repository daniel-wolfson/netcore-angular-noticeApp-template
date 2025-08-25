/**
 * Maps Notice property keys to their human-readable descriptions.
 */
export const NoticePropertyDescriptions: Record<keyof NoticeFilter, string> = {
  title: 'Search title of the notice',
  content: 'Search main content or body of the notice',
  author: 'Search author or creator of the notice',
  createdAt: 'Search Days ago when the notice was created',
  location: 'Search Place such as State, City, Address, or a name of a place',
};
/**
 * Represents a notice or post on the notice board.
 */
export interface Notice {
  /** Unique identifier for the notice */
  id: string;
  /** Title of the notice */
  title: string;
  /** Main content or body of the notice */
  content: string;
  /** Author or creator of the notice */
  author: string;
  /** ISO date string when the notice was created */
  createdAt: string;
  /** ISO date string when the notice was last updated */
  updatedAt: string;
  /** Optional location information for the notice */
  location?: Location;
  /** Human-readable location information for the notice */
  locationInfo?: string;
}

export interface NoticeFilter {
  /** Title of the notice */
  title: string;
  /** Main content or body of the notice */
  content: string;
  /** Author or creator of the notice */
  author: string;
  /** Human-readable location information for the notice */
  location?: string;
  /** ISO date string when the notice was created */
  createdAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  author: string;
  locationInfo?: string;
  location?: Location;
}
