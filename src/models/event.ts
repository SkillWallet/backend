
export interface Event {
	title: string;
	credits: number;
    roles: string[];
}


export interface EventsList {
	pastEvents: Event[];
	futureEvents: Event[];
}