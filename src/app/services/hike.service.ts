import { Injectable } from '@angular/core';

import { Hike } from '../models/hike';
import { HIKES } from '../mock-hikes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HikeService {
  private hikes: Hike[] = HIKES;
  serviceHikes: Hike[] | undefined;

  constructor() {}

  getHikes(): Observable<Hike[]> {
    return new Observable((observer) => {
      if (this.serviceHikes) {
        observer.next(this.serviceHikes);
      } else {
        this.serviceHikes = this.hikes;
        observer.next(this.serviceHikes);
      }
    });
  }

  addHike(newHike: Hike): Hike[] {
    if (this.serviceHikes) {
      newHike.id = this.findMaxId() + 1;
      this.serviceHikes.push(newHike);
      return this.serviceHikes;
    } else {
      return [];
    }
  }

  findMaxId(): number {
    let maxId = 0;
    this.serviceHikes!.forEach((hike) => {
      if (hike.id > maxId) {
        maxId = hike.id;
      }
    });
    return maxId;
  }

  deleteHike(id: number): Hike[] {
    if (this.serviceHikes) {
      const indexOfItemToBeDeleted = this.serviceHikes.findIndex((hike) => hike.id == id);
      this.serviceHikes.splice(indexOfItemToBeDeleted, 1);
      return this.serviceHikes;
    } else {
      return [];
    }
  }

  editHike(editedHike: Hike): Hike[] {
    if (this.serviceHikes) {
      const index = this.serviceHikes.findIndex((hike) => hike.id === editedHike.id);
      if (index !== -1) {
        this.serviceHikes[index] = editedHike;
      }
      return this.serviceHikes;
    } else {
      return [];
    }
  }
}
