import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Hike } from '../models/hike';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HikeService } from '../services/hike.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-hikes',
  standalone: false,
  templateUrl: './hikes.component.html',
  styleUrl: './hikes.component.scss',
})
export class HikesComponent implements OnInit, AfterViewInit {
  hikesEmpty: boolean = true;

  hikes: Hike[] = [];

  // TABLE
  displayedColumns: string[] = [
    'id',
    'name',
    'distance',
    'startPoint',
    'endPoint',
    'estimatedTime',
    'difficulty',
    'scheduledDate',
    'elevation',
    'done',
    'actualTime',
    'score',
    'actions',
  ];
  // dataSource!: MatTableDataSource<Hike>;
  dataSource = new MatTableDataSource(this.hikes);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  // ADD EDIT
  isAddFormVisible: boolean = false;
  addButtonText: string = 'Add New Hike';
  isEditFormVisible: boolean = false;
  currentHike!: Hike;

  eventsChangeSubject: Subject<Hike> = new Subject<Hike>();

  // STATISTICS
  totalKmsDone!: number;
  totalElevationDone!: number;
  totalEstimatedTime!: number;
  totalActualTimeSpend!: number;

  percentageKmsDone!: number;
  percentageElevationDone!: number;
  percentageEstimatedTime!: number;
  percentageActualTimeSpend!: number;

  progressStartValueKm = 0;
  progressStartValueActualTime = 0;

  public lineChart: any;
  public barChart: any;

  constructor(
    private snackBar: MatSnackBar,
    private hikeService: HikeService,
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef,
  ) {
    this.initHikes();
  }

  ngOnInit(): void {
    this.initHikes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.calculateStatistics();

    this.cdRef.detectChanges();
  }

  initHikes(): void {
    if (!this.hikeService.serviceHikes) {
      this.hikeService.getHikes().subscribe((serviceHikes: Hike[]) => {
        this.hikes = serviceHikes;
        if (this.hikes.length > 0) {
          this.hikesEmpty = false;
        }
        this.dataSource = new MatTableDataSource(this.hikes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.hikesEmpty = false;
      this.hikes = this.hikeService.serviceHikes;
      this.dataSource = new MatTableDataSource(this.hikes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  showAddForm(): void {
    this.isAddFormVisible = this.isAddFormVisible ? false : true;
    this.addButtonText = this.isAddFormVisible ? 'Close the Add Form' : 'Add New Hike';

    setTimeout(() => {
      const targetElement = document.getElementById('add-form');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  }

  addHike(newHike: Hike) {
    this.hikes = this.hikeService.addHike(newHike);
    this.updateData();
    this.isAddFormVisible = false;
    this.openSnackBar('You successfully added a hike', 'Close');
    this.addButtonText = 'Add New Hike';
  }

  updateData() {
    this.dataSource = new MatTableDataSource(this.hikes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.calculateStatistics();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  deleteHike(id: number) {
    this.hikes = this.hikeService.deleteHike(id);
    this.updateData();
    this.openSnackBar('You successfully deleted a hike', 'Close');
  }

  clickToEditHike(hike: Hike) {
    this.currentHike = hike;
    this.eventsChangeSubject.next(this.currentHike);
    this.isEditFormVisible = true;

    setTimeout(() => {
      const targetElement = document.getElementById('edit-form');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  }

  editHike(editedHike: Hike) {
    this.hikes = this.hikeService.editHike(editedHike);
    this.updateData();
    this.isEditFormVisible = false;
    this.openSnackBar('You successfully eddited a hike', 'Close');
  }

  closeEditHikeForm() {
    this.isEditFormVisible = false;
  }

  calculateStatistics() {
    this.totalKmsDone = this.hikes.reduce((accumulator, hike) => {
      return accumulator + (hike.done ? hike.distance : 0);
    }, 0);
    this.totalElevationDone = this.hikes.reduce((accumulator, hike) => {
      return accumulator + (hike.done ? hike.elevation : 0);
    }, 0);
    this.totalEstimatedTime = this.hikes.reduce((accumulator, hike) => {
      return accumulator + (hike.done ? hike.estimatedTime : 0);
    }, 0);
    this.totalActualTimeSpend = this.hikes.reduce((accumulator, hike) => {
      return accumulator + (hike.actualTime ? hike.actualTime : 0);
    }, 0);

    this.percentageKmsDone = Math.floor((this.totalKmsDone / 100) * 100);
    this.percentageElevationDone = Math.floor((this.totalElevationDone / 5000) * 100);
    this.percentageEstimatedTime = Math.floor((this.totalEstimatedTime / 200) * 100);
    this.percentageActualTimeSpend = Math.floor((this.totalActualTimeSpend / 200) * 100);
    this.setProgressKm(this.percentageKmsDone);
    this.setProgressActualTime(this.percentageActualTimeSpend);
    this.createLineChart();
    this.createBarChart();
  }

  setProgressKm(value: number) {
    let progressInterval = setInterval(() => {
      if (this.progressStartValueKm < value) {
        this.progressStartValueKm++;
      } else {
        this.progressStartValueKm--;
      }

      if (this.progressStartValueKm == value) {
        clearInterval(progressInterval);
      }
    }, 200);
  }

  setProgressActualTime(value: number) {
    let progressInterval = setInterval(() => {
      if (this.progressStartValueActualTime < value) {
        this.progressStartValueActualTime++;
      } else {
        this.progressStartValueActualTime--;
      }

      if (this.progressStartValueActualTime == value) {
        clearInterval(progressInterval);
      }
    }, 200);
  }

  createLineChart() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    let htmlRef = this.elementRef.nativeElement.querySelector(`#lineChart`);

    this.lineChart = new Chart(htmlRef, {
      type: 'line',
      data: {
        labels: ['Start', 'End'],
        datasets: [
          {
            label: 'Elevations Done',
            data: [0, this.totalElevationDone],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            bodyFont: {
              size: 14,
            },
            titleFont: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });
  }

  createBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }

    let htmlRef = this.elementRef.nativeElement.querySelector(`#barChart`);

    this.barChart = new Chart(htmlRef, {
      type: 'bar',
      data: {
        labels: ['Time of finished hikes'],
        datasets: [
          {
            label: 'Estimated Time',
            data: [this.totalEstimatedTime],
            borderColor: 'rgb(255, 17, 0)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
          },
          {
            label: 'Actual Time',
            data: [this.totalActualTimeSpend],
            borderColor: 'rgb(0, 126, 165)',
            backgroundColor: 'rgb(61, 176, 211,0.2)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            bodyFont: {
              size: 14,
            },
            titleFont: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });
  }
}
