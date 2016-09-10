
export interface CommsActions {
  get: (url: string) => Promise<any>
}


export enum CommsChannelStatus {
  Offline,
  Idle,
  Active,
}

export interface CommsChannelRequest {
  url: string
  progress: number
  status?: number
  result?: any
}

export interface CommsChannelState {
  requests: Array<CommsChannelRequest>
  status: CommsChannelStatus
  statusString: string
}

export default class CommsChannel<CommData> {
  private nextRequestKey: number
  private state: CommsChannelState
  private updateCommsState: (name: string, state: CommsChannelState) => void

  constructor (
    public name: string, public urlRoot: string,
    public commData: CommData,
    private prepareRequest: (req: XMLHttpRequest, commData?: CommData) => void,
    private processSuccess: (req: XMLHttpRequest, commData?: CommData) => any,
    private processError: (req: XMLHttpRequest, commData?: CommData) => any
  ) {
    this.nextRequestKey = 0
    this.state = {
      requests: [],
      status: CommsChannelStatus.Idle,
      statusString: CommsChannelStatus[CommsChannelStatus.Idle],
    }
  }

  setStateSetter(func: (name: string, state: CommsChannelState) => void) {
    this.updateCommsState = func
  }

  getState (): CommsChannelState {
    return this.state
  }

  updateRequestState (key: number, request: CommsChannelRequest) {
    const nextRequests = this.state.requests.slice()
    let status: CommsChannelStatus

    nextRequests[key] = request

    if (this.state.status === CommsChannelStatus.Offline) {
      if (request.status !== 0 && request.progress === 1) {
        if (nextRequests.every((r) => r.progress === 1)) {
          status = CommsChannelStatus.Idle
        } else {
          status = CommsChannelStatus.Active
        }
      } else {
        status = CommsChannelStatus.Offline
      }
    } else {
      if (request.status === 0) {
        status = CommsChannelStatus.Offline
      } else if (nextRequests.every((r) => r.progress === 1)) {
        status = CommsChannelStatus.Idle
      } else {
        status = CommsChannelStatus.Active
      }
    }

    this.state = {
      requests: nextRequests, status,
      statusString: CommsChannelStatus[status],
    }

    this.updateCommsState(this.name, this.state)
  }

  get (url: string): Promise<any> {
    const key = this.nextRequestKey++
    return new Promise((resolve, reject) => {
      console.log(`comms :: ${this.name} :: get - ${url}`)
      const req = new XMLHttpRequest()

      this.updateRequestState(key, {url, progress: 0})

      req.addEventListener("load", () => {
        if (req.status >= 400) {
          const result = this.processError(req, this.commData);
          this.updateRequestState(key, {url, status: req.status,
                                        progress: 1, result})
          reject(result)
        } else {
          const result = this.processSuccess(req, this.commData);
          this.updateRequestState(key, {url, status: req.status,
                                        progress: 1, result})
          resolve(result)
        }
      }, false)
      req.addEventListener("error", () => {
        const result = this.processError(req, this.commData);
        this.updateRequestState(key, {url, status: 0, progress: 1, result})

        reject(result)
      }, false)

      req.open("GET", `${this.urlRoot}${url}`)

      this.prepareRequest(req, this.commData)
      req.send()
    })
  }

  actions (): CommsActions {
    return {
      get: this.get.bind(this),
    }
  }
}
