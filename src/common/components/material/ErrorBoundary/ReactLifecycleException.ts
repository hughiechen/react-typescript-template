export class ReactLifecycleException {
  constructor(public message: string, public stack: string, public componentStack: string) {}
}
