export interface Hike {
  id: number;
  name: string;
  distance: number;
  startPoint: string;
  endPoint: string;
  estimatedTime: number;
  difficulty: string;
  scheduledDate: Date;
  elevation: number;
  done: boolean;
  actualTime?: number;
  score?: number;
}
