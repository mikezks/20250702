import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { ReactiveNode } from '@angular/core/primitives/signals';
import { FormsModule } from '@angular/forms';
import { Flight, injectTicketsFacade } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';


@Component({
  selector: 'app-flight-search',
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private ticketsFacade = injectTicketsFacade();

  protected filter = signal({
    from: 'London',
    to: 'New York',
    urgent: false
  }, { debugName: 'filter' });
  protected readonly route = computed(
    () => 'From ' + this.filter().from + ' to ' + this.filter().to + '.'
  , { debugName: 'route' });
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights = this.ticketsFacade.flights;
  protected firstname = 'Mary';

  constructor() {
    let activeConsumer: ReactiveNode | null;
    effect(() => {
      console.log(this.route());
    }, { debugName: 'route logger effect' });
    effect(
      () => this.search(),
      { debugName: 'flight search effect' }
    );

    setTimeout(() => {
      this.firstname = 'Peter';
      console.log('Firstname updated', this.firstname);
    }, 5_000);
  }
  
  protected search(): void {
    if (!this.filter().from || !this.filter().to) {
      return;
    }

    this.ticketsFacade.search(this.filter());
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.ticketsFacade.update(newFlight);
  }

  protected reset(): void {
    this.ticketsFacade.reset();
  }
}
