export default class Observable {
    private observers: Array<Function> = [];

    public subscribe(f: Function): void {
        this.observers.push(f);
    }

    public unsubscribe(f: Function): void {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    public notify(data?: any): void {
        this.observers.forEach(observer => observer(data));
    }
}