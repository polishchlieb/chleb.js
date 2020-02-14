export default class Observable {
    observers: Array<Function> = [];

    subscribe(f: Function): void {
        this.observers.push(f);
    }

    unsubscribe(f: Function): void {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    notify(data: any): void {
        this.observers.forEach(observer => observer(data));
    }

    ping(): void {
        this.observers.forEach(observer => observer());
    }
}