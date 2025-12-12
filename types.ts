export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingMetadata?: {
    groundingChunks: GroundingChunk[];
  };
}

export enum AppView {
  HOME = 'HOME',
  LOCATOR = 'LOCATOR',
  ASSISTANT = 'ASSISTANT',
}
