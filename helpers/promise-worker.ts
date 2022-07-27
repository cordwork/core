export class PromiseWorker {
	
	constructor(private works: PromiseLike<any>[] = []) {

	}

	public add(work: PromiseLike<any>) {
		this.works.push(work);
	}

	public wait() {
		return Promise.all(this.works);
	}

}